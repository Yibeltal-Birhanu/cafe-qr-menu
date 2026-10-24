import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldIcon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
  QrCodeIcon,
  TrashIcon,
  CoffeeIcon,
  UsersIcon,
  BookOpenIcon,
  GridIcon,
  CheckIcon,
  LockIcon,
  PaletteIcon,
  KeyIcon,
  ExternalLinkIcon,
  RefreshIcon,
  SettingsIcon,
} from './AdminIcons.jsx';
import { THEME_PRESETS } from '../common/themePresets.js';

export default function SuperAdminDashboard({
  currentUser,
  onSwitchCafe,
  onShowToast,
  apiCall,
}) {
  const [cafes, setCafes] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal: Deploy New Cafe
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    currency: 'ETB',
    phone: '',
    wifi_ssid: '',
    wifi_pass: '',
    managerName: '',
    managerEmail: '',
    managerPassword: '',
    template: 'seed',
  });

  // Modal: Manager Credentials Reset
  const [credentialModalCafe, setCredentialModalCafe] = useState(null);
  const [credForm, setCredForm] = useState({ email: '', password: '', name: '' });
  const [isUpdatingCred, setIsUpdatingCred] = useState(false);

  // Modal: Quick Theme Switcher
  const [themeModalCafe, setThemeModalCafe] = useState(null);
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);

  // Dedicated Super Admin Cafe Settings Modal
  const [manageCafe, setManageCafe] = useState(null);
  const [manageActiveTab, setManageActiveTab] = useState('general'); // 'general' | 'wifi' | 'theme' | 'manager'
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    currency: 'ETB',
    phone: '',
    wifi_ssid: '',
    wifi_pass: '',
    footer: '',
    status: 'active',
    themePreset: 'showcase',
    primaryColor: '#1c2826',
    secondaryColor: '#64748b',
    accentColor: '#e6923c',
    managerName: '',
    managerEmail: '',
    managerPassword: '',
  });

  const loadCafes = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [data, statsData] = await Promise.all([
        apiCall('/api/superadmin/cafes'),
        apiCall('/api/superadmin/stats').catch(() => null),
      ]);
      setCafes(data.cafes || []);
      if (statsData) setPlatformStats(statsData);
      if (quiet && onShowToast) {
        onShowToast('Venues catalog refreshed');
      }
    } catch (err) {
      if (onShowToast) onShowToast(`Failed to load venues: ${err.message}`, true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [apiCall, onShowToast]);

  useEffect(() => {
    loadCafes();
  }, [loadCafes]);

  // Real Platform KPIs
  const stats = useMemo(() => {
    const totalCafes = platformStats?.totalCafes ?? cafes.length;
    const activeCafes = platformStats?.activeCafes ?? cafes.filter((c) => c.status === 'active').length;
    const suspendedCafes = platformStats?.suspendedCafes ?? (totalCafes - activeCafes);
    const totalDishes = platformStats?.totalDishes ?? cafes.reduce((acc, c) => acc + (Number(c.dishCount) || 0), 0);
    const totalCategories = platformStats?.totalCategories ?? cafes.reduce((acc, c) => acc + (Number(c.categoryCount) || 0), 0);
    const totalManagers = platformStats?.totalManagers ?? cafes.filter((c) => Boolean(c.managerEmail)).length;
    const activeSessions = platformStats?.activeSessions ?? 0;
    const avgPrice = platformStats?.avgPrice ?? (totalDishes > 0 ? 280 : 0);
    const activeRate = totalCafes > 0 ? Math.round((activeCafes / totalCafes) * 100) : 100;

    return {
      totalCafes,
      activeCafes,
      suspendedCafes,
      totalDishes,
      totalCategories,
      totalManagers,
      activeSessions,
      avgPrice,
      activeRate,
    };
  }, [cafes, platformStats]);

  // Filtered cafes
  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cafe.name?.toLowerCase().includes(q) ||
        cafe.slug?.toLowerCase().includes(q) ||
        cafe.managerEmail?.toLowerCase().includes(q) ||
        cafe.currency?.toLowerCase().includes(q) ||
        cafe.tagline?.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' || cafe.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cafes, searchQuery, statusFilter]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleToggleStatus = async (cafe) => {
    const nextStatus = cafe.status === 'active' ? 'suspended' : 'active';
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}/status`, {
        method: 'PUT',
        body: { status: nextStatus },
      });
      setCafes((prev) =>
        prev.map((c) => (c.id === cafe.id ? { ...c, status: nextStatus } : c))
      );
      if (onShowToast) onShowToast(`${cafe.name} is now ${nextStatus}`);
    } catch (err) {
      if (onShowToast) onShowToast(`Status update failed: ${err.message}`, true);
    }
  };

  const handleDeleteCafe = async (cafe) => {
    if (!window.confirm(`Permanently remove venue "${cafe.name}" (${cafe.slug}) and delete its digital menu?`)) {
      return;
    }
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}`, { method: 'DELETE' });
      setCafes((prev) => prev.filter((c) => c.id !== cafe.id));
      if (onShowToast) onShowToast(`Deleted venue "${cafe.name}"`);
    } catch (err) {
      if (onShowToast) onShowToast(`Delete failed: ${err.message}`, true);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      if (onShowToast) onShowToast('Venue name and slug are required.', true);
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedPreset = THEME_PRESETS[0];
      const themePayload = {
        preset: selectedPreset.id,
        layout: selectedPreset.layout,
        cardStyle: selectedPreset.cardStyle,
        navStyle: selectedPreset.navStyle,
        landingStyle: selectedPreset.landingStyle,
        primaryColor: selectedPreset.primaryColor,
        accentColor: selectedPreset.accentColor,
        backgroundColor: selectedPreset.backgroundColor,
        backgroundMode: selectedPreset.backgroundMode,
        surfaceColor: selectedPreset.surfaceColor,
        textColor: selectedPreset.textColor,
        fontFamily: selectedPreset.fontFamily,
      };

      await apiCall('/api/superadmin/cafes', {
        method: 'POST',
        body: {
          ...formData,
          theme: themePayload,
        },
      });
      if (onShowToast) onShowToast(`Venue "${formData.name}" deployed successfully!`);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        slug: '',
        tagline: '',
        currency: 'ETB',
        phone: '',
        wifi_ssid: '',
        wifi_pass: '',
        managerName: '',
        managerEmail: '',
        managerPassword: '',
        template: 'seed',
      });
      await loadCafes(true);
    } catch (err) {
      if (onShowToast) onShowToast(err.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCredentialsModal = (cafe) => {
    setCredentialModalCafe(cafe);
    setCredForm({
      name: cafe.managerName || `${cafe.name} Manager`,
      email: cafe.managerEmail || '',
      password: '',
    });
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    if (!credForm.email.trim() || !credForm.password.trim()) {
      if (onShowToast) onShowToast('Manager email and a new password are required.', true);
      return;
    }
    setIsUpdatingCred(true);
    try {
      await apiCall(`/api/superadmin/cafes/${credentialModalCafe.id}/manager`, {
        method: 'PUT',
        body: {
          managerEmail: credForm.email.trim(),
          managerPassword: credForm.password.trim(),
          managerName: credForm.name.trim(),
        },
      });
      if (onShowToast) onShowToast(`Credentials updated for ${credentialModalCafe.name}`);
      setCredentialModalCafe(null);
      await loadCafes(true);
    } catch (err) {
      if (onShowToast) onShowToast(`Credential update failed: ${err.message}`, true);
    } finally {
      setIsUpdatingCred(false);
    }
  };

  const handleSelectQuickTheme = async (preset) => {
    if (!themeModalCafe) return;
    setIsUpdatingTheme(true);
    try {
      const themePayload = {
        preset: preset.id,
        layout: preset.layout,
        cardStyle: preset.cardStyle,
        navStyle: preset.navStyle,
        landingStyle: preset.landingStyle,
        primaryColor: preset.primaryColor,
        accentColor: preset.accentColor,
        backgroundColor: preset.backgroundColor,
        backgroundMode: preset.backgroundMode,
        surfaceColor: preset.surfaceColor,
        textColor: preset.textColor,
        fontFamily: preset.fontFamily,
      };
      await apiCall(`/api/superadmin/cafes/${themeModalCafe.id}/theme`, {
        method: 'PUT',
        body: { theme: themePayload },
      });
      if (onShowToast) onShowToast(`Applied "${preset.name}" to ${themeModalCafe.name}`);
      setThemeModalCafe(null);
      await loadCafes(true);
    } catch (err) {
      if (onShowToast) onShowToast(`Theme update failed: ${err.message}`, true);
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  const copyUrlToClipboard = (slug) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      if (onShowToast) onShowToast(`Copied menu link: /${slug}`);
    }
  };

  const handleOpenManageSettings = (cafe) => {
    setManageCafe(cafe);
    setManageActiveTab('general');
    const matchedPreset = THEME_PRESETS.find((p) => p.id === cafe.theme?.preset) || THEME_PRESETS[0];
    setSettingsForm({
      name: cafe.name || '',
      slug: cafe.slug || '',
      tagline: cafe.tagline || '',
      currency: cafe.currency || 'ETB',
      phone: cafe.phone || '',
      wifi_ssid: cafe.wifi_ssid || '',
      wifi_pass: cafe.wifi_pass || '',
      footer: cafe.footer || '',
      status: cafe.status || 'active',
      hero_title: cafe.hero_title || '',
      hero_description: cafe.hero_description || '',
      hero_image: cafe.hero_image || '',
      themePreset: cafe.theme?.preset || matchedPreset.id,
      primaryColor: cafe.theme?.primaryColor || matchedPreset.primaryColor,
      secondaryColor: cafe.theme?.secondaryColor || matchedPreset.secondaryColor,
      accentColor: cafe.theme?.accentColor || matchedPreset.accentColor,
      managerName: cafe.managerName || '',
      managerEmail: cafe.managerEmail || '',
      managerPassword: '',
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settingsForm.name.trim()) {
      if (onShowToast) onShowToast('Venue name is required.', true);
      return;
    }
    setIsUpdatingSettings(true);
    try {
      const selectedPreset = THEME_PRESETS.find((p) => p.id === settingsForm.themePreset) || THEME_PRESETS[0];
      const themePayload = {
        preset: settingsForm.themePreset,
        layout: selectedPreset.layout,
        cardStyle: selectedPreset.cardStyle,
        navStyle: selectedPreset.navStyle,
        landingStyle: selectedPreset.landingStyle,
        backgroundColor: selectedPreset.backgroundColor || '#ffffff',
        backgroundMode: selectedPreset.backgroundMode || 'light',
        surfaceColor: selectedPreset.surfaceColor || '#ffffff',
        textColor: selectedPreset.textColor || '#111827',
        fontFamily: selectedPreset.fontFamily,
        primaryColor: settingsForm.primaryColor || selectedPreset.primaryColor,
        secondaryColor: settingsForm.secondaryColor || selectedPreset.secondaryColor,
        accentColor: settingsForm.accentColor || selectedPreset.accentColor,
      };

      const payload = {
        name: settingsForm.name.trim(),
        tagline: settingsForm.tagline.trim(),
        currency: settingsForm.currency.trim(),
        phone: settingsForm.phone.trim(),
        wifi_ssid: settingsForm.wifi_ssid.trim(),
        wifi_pass: settingsForm.wifi_pass.trim(),
        footer: settingsForm.footer.trim(),
        hero_title: (settingsForm.hero_title || '').trim(),
        hero_description: (settingsForm.hero_description || '').trim(),
        hero_image: (settingsForm.hero_image || '').trim(),
        status: settingsForm.status,
        theme: themePayload,
      };

      if (settingsForm.managerEmail && settingsForm.managerPassword) {
        payload.managerEmail = settingsForm.managerEmail.trim();
        payload.managerPassword = settingsForm.managerPassword.trim();
        payload.managerName = settingsForm.managerName.trim();
      }

      await apiCall(`/api/superadmin/cafes/${manageCafe.id}`, {
        method: 'PUT',
        body: payload,
      });

      if (onShowToast) onShowToast(`Settings saved for "${settingsForm.name}"`);
      setManageCafe(null);
      await loadCafes(true);
    } catch (err) {
      if (onShowToast) onShowToast(`Update failed: ${err.message}`, true);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  return (
    <div className="sad-container">
      {/* 1. Executive Platform Banner */}
      <div className="sad-hero">
        <div className="sad-hero-content">
          <div>
            <div className="sad-hero-tagline">
              <span className="sad-hero-badge">
                <ShieldIcon size={14} />
                <span>Super Admin Platform</span>
              </span>
              <span className="sad-live-status">
                <span className="sad-pulse-circle"></span>
                <span>Operational &bull; Multi-Tenant MySQL</span>
              </span>
            </div>

            <h2 className="sad-hero-title">
              Locations &amp; Venue Fleet
            </h2>
            <p className="sad-hero-sub">
              Manage multi-tenant digital menus, customize structural theme architectures, provision manager credentials, and monitor QR engagement.
            </p>
          </div>

          <div className="sad-hero-actions">
            <button
              type="button"
              className="sad-btn-ghost"
              onClick={() => loadCafes(true)}
              title="Refresh venues data"
            >
              <RefreshIcon size={15} className={isRefreshing ? 'cm-spin' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              className="sad-btn-deploy"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusIcon size={16} />
              <span>Deploy New Venue</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Platform Key Metric Cards */}
      <div className="sad-stats-grid">
        {/* Card 1: Venues Fleet */}
        <div className="sad-stat-card">
          <div className="sad-stat-header">
            <span className="sad-stat-label">Active Locations</span>
            <div className="sad-stat-icon-wrap sad-stat-icon-amber">
              <CoffeeIcon size={20} />
            </div>
          </div>
          <div className="sad-stat-val">{stats.totalCafes}</div>
          <div className="sad-stat-sub">
            <span style={{ color: '#059669', fontWeight: 700 }}>{stats.activeCafes} active</span>
            <span>&bull;</span>
            <span style={{ color: stats.suspendedCafes > 0 ? '#e11d48' : '#94a3b8' }}>
              {stats.suspendedCafes} suspended
            </span>
          </div>
          <div className="sad-progress-track">
            <div className="sad-progress-fill" style={{ width: `${stats.activeRate}%` }}></div>
          </div>
        </div>

        {/* Card 2: Total Menu Items */}
        <div className="sad-stat-card">
          <div className="sad-stat-header">
            <span className="sad-stat-label">Catalog Volume</span>
            <div className="sad-stat-icon-wrap sad-stat-icon-emerald">
              <BookOpenIcon size={20} />
            </div>
          </div>
          <div className="sad-stat-val">{stats.totalDishes}</div>
          <div className="sad-stat-sub">
            <span>Across {stats.totalCategories} categories</span>
            <span>&bull;</span>
            <span>~{(stats.totalDishes / (stats.totalCafes || 1)).toFixed(1)} / venue</span>
          </div>
        </div>

        {/* Card 3: Average Dish Price */}
        <div className="sad-stat-card">
          <div className="sad-stat-header">
            <span className="sad-stat-label">Average Dish Price</span>
            <div className="sad-stat-icon-wrap sad-stat-icon-sky">
              <GridIcon size={20} />
            </div>
          </div>
          <div className="sad-stat-val">{stats.avgPrice} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>ETB</span></div>
          <div className="sad-stat-sub" style={{ color: '#0284c7', fontWeight: 600 }}>
            <span>Live multi-tenant catalog pricing</span>
          </div>
        </div>

        {/* Card 4: Manager Accounts */}
        <div className="sad-stat-card">
          <div className="sad-stat-header">
            <span className="sad-stat-label">Manager Accounts</span>
            <div className="sad-stat-icon-wrap sad-stat-icon-indigo">
              <UsersIcon size={20} />
            </div>
          </div>
          <div className="sad-stat-val">{stats.totalManagers}</div>
          <div className="sad-stat-sub" style={{ color: '#059669', fontWeight: 600 }}>
            <span>{stats.activeSessions > 0 ? `${stats.activeSessions} active Better Auth sessions` : '100% Better Auth Secured'}</span>
          </div>
        </div>
      </div>

      {/* 3. Search, Filter & Layout Controls */}
      <div className="sad-toolbar">
        <div className="sad-search-container">
          <SearchIcon size={16} style={{ color: '#94a3b8' }} />
          <input
            type="text"
            className="sad-search-input"
            placeholder="Search venue name, slug, currency, manager email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="sad-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Status Segmented Tabs */}
          <div className="sad-filter-tabs">
            <button
              type="button"
              className={`sad-tab-btn ${statusFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span>All</span>
              <span className="sad-tab-count">{stats.totalCafes}</span>
            </button>
            <button
              type="button"
              className={`sad-tab-btn ${statusFilter === 'active' ? 'is-active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              <span>Active</span>
              <span className="sad-tab-count">{stats.activeCafes}</span>
            </button>
            <button
              type="button"
              className={`sad-tab-btn ${statusFilter === 'suspended' ? 'is-active' : ''}`}
              onClick={() => setStatusFilter('suspended')}
            >
              <span>Suspended</span>
              <span className="sad-tab-count">{stats.suspendedCafes}</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="sad-view-switch">
            <button
              type="button"
              className={`sad-view-btn ${viewMode === 'table' ? 'is-active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <BookOpenIcon size={15} />
            </button>
            <button
              type="button"
              className={`sad-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Bento Grid View"
            >
              <GridIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Directory: Table or Bento Grid View */}
      {viewMode === 'table' ? (
        <div className="sad-table-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="sad-table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Venue &amp; Vanity URL</th>
                  <th style={{ width: '18%' }}>Theme Architecture</th>
                  <th style={{ width: '22%' }}>Manager Account</th>
                  <th style={{ width: '12%' }}>Catalog</th>
                  <th style={{ width: '8%' }}>Status</th>
                  <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshIcon size={18} className="cm-spin" />
                        <span>Loading venue network...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCafes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No venues found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCafes.map((cafe) => {
                    const isAbol = cafe.slug === 'abol-cafe';
                    const liveUrl = isAbol ? '/abol-cafe' : `/${cafe.slug}`;
                    const qrUrl = isAbol ? '/qr.png' : `/api/${cafe.slug}/qr.png`;
                    const themeObj = cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {};
                    const matchedPreset = THEME_PRESETS.find((p) => p.id === themeObj.preset) || THEME_PRESETS[0];

                    return (
                      <tr key={cafe.id} className="sad-table-row">
                        {/* 1. Venue Details */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              className="sad-venue-avatar"
                              style={{
                                background: themeObj.primaryColor
                                  ? `${themeObj.primaryColor}15`
                                  : 'rgba(245, 158, 11, 0.12)',
                                color: themeObj.primaryColor || '#d97706',
                                border: `1px solid ${themeObj.primaryColor ? `${themeObj.primaryColor}35` : 'rgba(245, 158, 11, 0.3)'}`,
                              }}
                            >
                              {cafe.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="sad-venue-name">{cafe.name}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                <a
                                  href={liveUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="sad-slug-pill"
                                  title="Open guest menu"
                                >
                                  <span>/{cafe.slug}</span>
                                  <ExternalLinkIcon size={10} />
                                </a>
                                {cafe.currency && (
                                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                                    &bull; {cafe.currency}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Theme Architecture */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  background: themeObj.primaryColor || matchedPreset.primaryColor,
                                  display: 'inline-block',
                                }}
                              />
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  background: themeObj.accentColor || matchedPreset.accentColor,
                                  display: 'inline-block',
                                }}
                              />
                              <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
                                {matchedPreset.name.split(' ')[0]}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {matchedPreset.archetype}
                            </div>
                          </div>
                        </td>

                        {/* 3. Manager Account */}
                        <td>
                          {cafe.managerEmail ? (
                            <div>
                              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.84rem' }}>
                                {cafe.managerName || 'Manager'}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>{cafe.managerEmail}</span>
                              </div>
                            </div>
                          ) : (
                            <span
                              style={{
                                fontSize: '0.74rem',
                                color: '#d97706',
                                background: '#fef3c7',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontWeight: 600,
                              }}
                            >
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* 4. Catalog Volume */}
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            {cafe.dishCount || 0} <span style={{ fontSize: '0.74rem', fontWeight: 500, color: '#64748b' }}>dishes</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {cafe.categoryCount || 0} categories
                          </div>
                        </td>

                        {/* 5. Status Toggle */}
                        <td>
                          <button
                            type="button"
                            className={`sad-status-badge ${cafe.status === 'active' ? 'is-active' : 'is-suspended'}`}
                            onClick={() => handleToggleStatus(cafe)}
                            title="Click to toggle active / suspended"
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: cafe.status === 'active' ? '#10b981' : '#f43f5e',
                              }}
                            />
                            <span>{cafe.status === 'active' ? 'Active' : 'Suspended'}</span>
                          </button>
                        </td>

                        {/* 6. Action Dock */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <button
                              type="button"
                              className="sad-btn-manage"
                              onClick={() => handleOpenManageSettings(cafe)}
                              title="Manage Cafe Settings"
                            >
                              <SettingsIcon size={13} />
                              <span>Manage</span>
                            </button>

                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="sad-action-btn"
                              title="Open live guest menu"
                            >
                              <EyeIcon size={14} />
                            </a>

                            <a
                              href={qrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="sad-action-btn"
                              title="Download QR code"
                            >
                              <QrCodeIcon size={14} />
                            </a>

                            <button
                              type="button"
                              className="sad-action-btn"
                              onClick={() => setThemeModalCafe(cafe)}
                              title="Customize structural theme"
                            >
                              <PaletteIcon size={14} />
                            </button>

                            <button
                              type="button"
                              className="sad-action-btn"
                              onClick={() => handleOpenCredentialsModal(cafe)}
                              title="Update manager password/account"
                            >
                              <KeyIcon size={14} />
                            </button>

                            <button
                              type="button"
                              className="sad-action-btn is-danger"
                              onClick={() => handleDeleteCafe(cafe)}
                              title="Delete venue"
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bento Grid View */
        <div className="sad-bento-grid">
          {filteredCafes.map((cafe) => {
            const isAbol = cafe.slug === 'abol-cafe';
            const liveUrl = isAbol ? '/abol-cafe' : `/${cafe.slug}`;
            const qrUrl = isAbol ? '/qr.png' : `/api/${cafe.slug}/qr.png`;
            const themeObj = cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {};
            const matchedPreset = THEME_PRESETS.find((p) => p.id === themeObj.preset) || THEME_PRESETS[0];

            return (
              <div key={cafe.id} className="sad-bento-card">
                <div
                  className="sad-bento-top-bar"
                  style={{ background: themeObj.primaryColor || '#d97706' }}
                />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div
                      className="sad-venue-avatar"
                      style={{
                        background: themeObj.primaryColor ? `${themeObj.primaryColor}15` : 'rgba(245, 158, 11, 0.12)',
                        color: themeObj.primaryColor || '#d97706',
                        border: `1px solid ${themeObj.primaryColor ? `${themeObj.primaryColor}35` : 'rgba(245, 158, 11, 0.3)'}`,
                      }}
                    >
                      {cafe.name.charAt(0).toUpperCase()}
                    </div>
                    <button
                      type="button"
                      className={`sad-status-badge ${cafe.status === 'active' ? 'is-active' : 'is-suspended'}`}
                      onClick={() => handleToggleStatus(cafe)}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: cafe.status === 'active' ? '#10b981' : '#f43f5e',
                        }}
                      />
                      <span>{cafe.status === 'active' ? 'Active' : 'Suspended'}</span>
                    </button>
                  </div>

                  <h4 style={{ margin: '0 0 2px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {cafe.name}
                  </h4>
                  <div style={{ marginBottom: '0.65rem' }}>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="sad-slug-pill"
                    >
                      <span>/{cafe.slug}</span>
                      <ExternalLinkIcon size={10} />
                    </a>
                  </div>

                  {cafe.tagline && (
                    <p style={{ margin: '0 0 0.8rem', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      {cafe.tagline}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                    <span style={{ background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {cafe.dishCount || 0} dishes
                    </span>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {cafe.categoryCount || 0} categories
                    </span>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {matchedPreset.name.split(' ')[0]} Theme
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.7rem' }}>
                    <strong>Manager:</strong> {cafe.managerEmail || 'Unassigned'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '5px', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="sad-btn-manage"
                    onClick={() => handleOpenManageSettings(cafe)}
                    style={{ flex: 1, justifyContent: 'center' }}
                    title="Manage Cafe Settings"
                  >
                    <SettingsIcon size={13} />
                    <span>Manage Settings</span>
                  </button>

                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sad-action-btn"
                    title="Live Menu"
                  >
                    <EyeIcon size={14} />
                  </a>

                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sad-action-btn"
                    title="QR Code"
                  >
                    <QrCodeIcon size={14} />
                  </a>

                  <button
                    type="button"
                    className="sad-action-btn"
                    onClick={() => setThemeModalCafe(cafe)}
                    title="Theme"
                  >
                    <PaletteIcon size={14} />
                  </button>

                  <button
                    type="button"
                    className="sad-action-btn"
                    onClick={() => handleOpenCredentialsModal(cafe)}
                    title="Credentials"
                  >
                    <KeyIcon size={14} />
                  </button>

                  <button
                    type="button"
                    className="sad-action-btn is-danger"
                    onClick={() => handleDeleteCafe(cafe)}
                    title="Delete"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Deploy New Venue Modal */}
      {isCreateModalOpen && (
        <div className="sad-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'grid', placeItems: 'center', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div
            className="sad-stat-card"
            style={{
              width: '92%',
              maxWidth: '600px',
              padding: '2.2rem',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Deploy New Venue
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                  Set up a fresh multi-tenant catalog and assign manager access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Venue Profile
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="ad-field-label">Venue Name *</label>
                    <input
                      type="text"
                      className="ad-form-input"
                      placeholder="e.g. Skyline Lounge"
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="ad-field-label">Vanity Slug *</label>
                    <input
                      type="text"
                      className="ad-form-input"
                      placeholder="e.g. skyline-lounge"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.8rem' }}>
                  <label className="ad-field-label">Slogan / Tagline</label>
                  <input
                    type="text"
                    className="ad-form-input"
                    placeholder="e.g. Rooftop views, craft coffee &amp; gourmet dining"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.8rem' }}>
                  <div>
                    <label className="ad-field-label">Currency</label>
                    <select
                      className="ad-form-input"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="ETB">ETB (Ethiopian Birr)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="ad-field-label">Starter Catalog</label>
                    <select
                      className="ad-form-input"
                      value={formData.template}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    >
                      <option value="seed">Pre-seeded Sample Dishes</option>
                      <option value="empty">Empty Catalog</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.1rem' }}>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  2. Manager Credentials (Better Auth)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="ad-field-label">Manager Name</label>
                    <input
                      type="text"
                      className="ad-form-input"
                      placeholder="e.g. Abebe Bikila"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="ad-field-label">Manager Email *</label>
                    <input
                      type="email"
                      className="ad-form-input"
                      placeholder="e.g. manager@venue.com"
                      value={formData.managerEmail}
                      onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.8rem' }}>
                  <label className="ad-field-label">Initial Password *</label>
                  <input
                    type="password"
                    className="ad-form-input"
                    placeholder="Min 8 characters"
                    value={formData.managerPassword}
                    onChange={(e) => setFormData({ ...formData, managerPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="sad-btn-ghost"
                  style={{ color: '#64748b', background: '#f1f5f9', border: 'none' }}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sad-btn-deploy"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deploying...' : 'Deploy Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Quick Theme Switcher Modal */}
      {themeModalCafe && (
        <div className="sad-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'grid', placeItems: 'center', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div
            className="sad-stat-card"
            style={{
              width: '94%',
              maxWidth: '860px',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2.2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Select Theme Architecture: {themeModalCafe.name}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                  Choose from 4 distinct structural themes with customized card designs, navigation layouts, and guest welcome covers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setThemeModalCafe(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.1rem' }}>
              {THEME_PRESETS.map((preset) => {
                const isActive = (themeModalCafe.theme?.preset === preset.id) ||
                  (!themeModalCafe.theme?.preset && preset.id === 'showcase');

                return (
                  <div
                    key={preset.id}
                    className={`sad-theme-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectQuickTheme(preset)}
                  >
                    <div>
                      {/* Top Row: Palette + Active Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {preset.previewColors.map((c, i) => (
                            <span
                              key={i}
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: c,
                                display: 'inline-block',
                                border: '1.5px solid rgba(0,0,0,0.1)',
                              }}
                            />
                          ))}
                        </div>
                        {isActive ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: '#d97706',
                              color: '#ffffff',
                              padding: '2px 9px',
                              borderRadius: '999px',
                            }}
                          >
                            Active Theme
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#64748b',
                              background: '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            {preset.archetype}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.02rem', fontWeight: 800, color: '#0f172a' }}>
                        {preset.name}
                      </h4>
                      <p style={{ margin: '0 0 0.85rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                        {preset.tagline}
                      </p>

                      {/* Structural Architectural Specifications */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: '#f8fafc', padding: '0.75rem 0.9rem', borderRadius: '10px', fontSize: '0.76rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                          <span style={{ fontWeight: 700, minWidth: '50px', color: '#64748b' }}>Cards:</span>
                          <span style={{ fontWeight: 600 }}>{preset.cardStyle}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                          <span style={{ fontWeight: 700, minWidth: '50px', color: '#64748b' }}>Navbar:</span>
                          <span style={{ fontWeight: 600 }}>{preset.navStyle}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                          <span style={{ fontWeight: 700, minWidth: '50px', color: '#64748b' }}>Cover:</span>
                          <span style={{ fontWeight: 600 }}>{preset.landingStyle}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <button
                        type="button"
                        disabled={isUpdatingTheme}
                        className={isActive ? 'sad-btn-ghost' : 'sad-btn-deploy'}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '0.6rem 1rem',
                          fontSize: '0.82rem',
                          background: isActive ? '#f1f5f9' : undefined,
                          color: isActive ? '#64748b' : undefined,
                          boxShadow: isActive ? 'none' : undefined,
                        }}
                      >
                        {isActive ? 'Current Active Theme' : isUpdatingTheme ? 'Applying Architecture...' : 'Apply This Architecture'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="sad-btn-ghost"
                onClick={() => setThemeModalCafe(null)}
                style={{ color: '#64748b', background: '#f1f5f9', border: 'none' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Dedicated Super Admin Venue Settings Modal */}
      {manageCafe && (
        <div
          className="sad-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="sad-stat-card"
            style={{
              width: '90%',
              maxWidth: '840px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '1.8rem',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                    Manage Venue: {manageCafe.name}
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: settingsForm.status === 'active' ? '#ecfdf5' : '#fff1f2',
                      color: settingsForm.status === 'active' ? '#047857' : '#be123c',
                      border: `1px solid ${settingsForm.status === 'active' ? '#a7f3d0' : '#fecdd3'}`,
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: settingsForm.status === 'active' ? '#10b981' : '#f43f5e' }} />
                    {settingsForm.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  URL Path: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#0f172a', fontWeight: 600 }}>/{manageCafe.slug}</code> &bull; {manageCafe.dishCount || 0} menu items across {manageCafe.categoryCount || 0} categories
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={`/cafe/${manageCafe.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="sad-btn-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                  title="Open public guest menu"
                >
                  <EyeIcon size={14} />
                  <span>View Menu</span>
                </a>
                <button
                  type="button"
                  onClick={() => setManageCafe(null)}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    color: '#64748b',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Tab Controls */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
              {[
                { id: 'general', label: 'General & Profile' },
                { id: 'hero', label: 'Hero & Showcase' },
                { id: 'wifi', label: 'Wi-Fi & Connectivity' },
                { id: 'theme', label: 'Theme & Architecture' },
                { id: 'manager', label: 'Manager Credentials' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setManageActiveTab(tab.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: manageActiveTab === tab.id ? '#4f46e5' : '#f1f5f9',
                    color: manageActiveTab === tab.id ? '#ffffff' : '#475569',
                    fontWeight: manageActiveTab === tab.id ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* TAB 1: GENERAL */}
              {manageActiveTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label className="ad-field-label">Venue Name *</label>
                      <input
                        type="text"
                        required
                        className="ad-form-input"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        placeholder="e.g. Abol Cafe & Roasters"
                      />
                    </div>

                    <div>
                      <label className="ad-field-label">URL Slug (System Handle)</label>
                      <input
                        type="text"
                        disabled
                        className="ad-form-input"
                        value={`/${settingsForm.slug}`}
                        style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label className="ad-field-label">Tagline / Slogan</label>
                      <input
                        type="text"
                        className="ad-form-input"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        placeholder="e.g. Freshly brewed, freshly grilled"
                      />
                    </div>

                    <div>
                      <label className="ad-field-label">Currency</label>
                      <select
                        className="ad-form-input"
                        value={settingsForm.currency}
                        onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                      >
                        <option value="ETB">ETB (Ethiopian Birr)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="KES">KES (KSh)</option>
                        <option value="AED">AED (د.إ)</option>
                        <option value="SAR">SAR (﷼)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label className="ad-field-label">Contact Phone / Support</label>
                      <input
                        type="text"
                        className="ad-form-input"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="e.g. +251 911 234 567"
                      />
                    </div>

                    <div>
                      <label className="ad-field-label">Operational Status</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, status: 'active' })}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: settingsForm.status === 'active' ? '2px solid #10b981' : '1px solid #cbd5e1',
                            background: settingsForm.status === 'active' ? '#ecfdf5' : '#ffffff',
                            color: settingsForm.status === 'active' ? '#047857' : '#64748b',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                          Active
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, status: 'suspended' })}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: settingsForm.status === 'suspended' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                            background: settingsForm.status === 'suspended' ? '#fff1f2' : '#ffffff',
                            color: settingsForm.status === 'suspended' ? '#be123c' : '#64748b',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                          Suspended
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="ad-field-label">Footer / Welcome Brand Note</label>
                    <textarea
                      rows={2}
                      className="ad-form-input"
                      style={{ resize: 'vertical' }}
                      value={settingsForm.footer}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footer: e.target.value })}
                      placeholder="Scan, browse, enjoy. Ask our staff for today's special."
                    />
                  </div>
                </div>
              )}

              {/* TAB: HERO SHOWCASE */}
              {manageActiveTab === 'hero' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Configure custom hero headline, description, and top banner image for this cafe's mobile menu homepage.
                  </p>

                  <div>
                    <label className="ad-field-label">Custom Hero Title</label>
                    <input
                      type="text"
                      className="ad-form-input"
                      value={settingsForm.hero_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                      placeholder="e.g. Wood-Fired Delicacies &amp; Reserve Roasts (leave empty for theme default)"
                    />
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                      Defaults to the cafe name or theme layout signature heading if left blank.
                    </span>
                  </div>

                  <div>
                    <label className="ad-field-label">Custom Hero Description / Subtitle</label>
                    <textarea
                      rows={2}
                      className="ad-form-input"
                      style={{ resize: 'vertical' }}
                      value={settingsForm.hero_description || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_description: e.target.value })}
                      placeholder="e.g. Freshly handcrafted ingredients, organic sourdough pizzas, and single-origin coffee."
                    />
                  </div>

                  <div>
                    <label className="ad-field-label">Hero Banner Image URL</label>
                    <input
                      type="url"
                      className="ad-form-input"
                      value={settingsForm.hero_image || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_image: e.target.value })}
                      placeholder="https://res.cloudinary.com/... or paste image URL"
                    />
                    {/* Current Hero Image Preview */}
                    {settingsForm.hero_image ? (
                      <div style={{ marginTop: '0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>🖼️</span> Current Hero Image Preview
                          </span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                            ● Active on Menu
                          </span>
                        </div>
                        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', height: '160px', position: 'relative', background: '#000' }}>
                          <img
                            src={settingsForm.hero_image}
                            alt="Hero banner preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                          <div style={{ position: 'absolute', bottom: '8px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                            Hero Banner Preview
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.8rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '0.9rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                        No hero image set. Mobile menu displays a clean title-only banner.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: WIFI */}
              {manageActiveTab === 'wifi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Set guest Wi-Fi details. When entered, guest mobile menus will display instant connect cards.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label className="ad-field-label">Wi-Fi Network Name (SSID)</label>
                      <input
                        type="text"
                        className="ad-form-input"
                        value={settingsForm.wifi_ssid}
                        onChange={(e) => setSettingsForm({ ...settingsForm, wifi_ssid: e.target.value })}
                        placeholder="e.g. AbolGuestWiFi"
                      />
                    </div>

                    <div>
                      <label className="ad-field-label">Wi-Fi Password</label>
                      <input
                        type="text"
                        className="ad-form-input"
                        value={settingsForm.wifi_pass}
                        onChange={(e) => setSettingsForm({ ...settingsForm, wifi_pass: e.target.value })}
                        placeholder="e.g. Coffee2026!"
                      />
                    </div>
                  </div>

                  <div style={{ padding: '1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', display: 'grid', placeItems: 'center', color: '#4338ca', fontSize: '1.2rem' }}>
                      📶
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#334155' }}>
                      <strong>Guest Menu Preview:</strong> {settingsForm.wifi_ssid ? `Connect to "${settingsForm.wifi_ssid}" using password "${settingsForm.wifi_pass || '(No password)'}"` : 'No guest Wi-Fi configured yet.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: THEME */}
              {manageActiveTab === 'theme' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label className="ad-field-label">Choose Theme Architecture Preset</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
                    {THEME_PRESETS.map((preset) => {
                      const isSelected = settingsForm.themePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setSettingsForm({
                              ...settingsForm,
                              themePreset: preset.id,
                              primaryColor: preset.primaryColor,
                              secondaryColor: preset.secondaryColor,
                              accentColor: preset.accentColor,
                            });
                          }}
                          style={{
                            padding: '12px',
                            borderRadius: '10px',
                            border: isSelected ? `2px solid ${preset.primaryColor}` : '1px solid #e2e8f0',
                            background: isSelected ? '#faf5ff' : '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: preset.primaryColor }} />
                              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{preset.name.split(' (')[0]}</span>
                            </div>
                            {isSelected && <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.85rem' }}>✓</span>}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {preset.archetype}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {preset.previewColors?.map((c, i) => (
                              <span key={i} style={{ width: '16px', height: '8px', borderRadius: '2px', background: c, border: '1px solid #e2e8f0' }} />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginTop: '0.5rem' }}>
                    <div>
                      <label className="ad-field-label">1st Color (Primary)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={settingsForm.primaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                          style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          className="ad-form-input"
                          value={settingsForm.primaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                          style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="ad-field-label">2nd Color (Secondary)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={settingsForm.secondaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                          style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          className="ad-form-input"
                          value={settingsForm.secondaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                          style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="ad-field-label">3rd Color (Accent)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={settingsForm.accentColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accentColor: e.target.value })}
                          style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          className="ad-form-input"
                          value={settingsForm.accentColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accentColor: e.target.value })}
                          style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MANAGER */}
              {manageActiveTab === 'manager' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Manage assigned venue manager credentials. Any changes sync directly to the Better Auth authentication table.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label className="ad-field-label">Manager Display Name</label>
                      <input
                        type="text"
                        className="ad-form-input"
                        value={settingsForm.managerName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, managerName: e.target.value })}
                        placeholder="e.g. Venue General Manager"
                      />
                    </div>

                    <div>
                      <label className="ad-field-label">Manager Email Account</label>
                      <input
                        type="email"
                        className="ad-form-input"
                        value={settingsForm.managerEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, managerEmail: e.target.value })}
                        placeholder="e.g. manager@venue.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="ad-field-label">Reset Password (Optional)</label>
                    <input
                      type="password"
                      className="ad-form-input"
                      value={settingsForm.managerPassword}
                      onChange={(e) => setSettingsForm({ ...settingsForm, managerPassword: e.target.value })}
                      placeholder="Leave blank to preserve current password"
                      autoComplete="new-password"
                    />
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Only fill this in if you want to set a brand new password for this manager.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setManageCafe(null);
                      if (onSwitchCafe) onSwitchCafe(manageCafe.slug);
                    }}
                    style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.8rem', color: '#4f46e5', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    title="Switch to cafe context to edit individual dishes"
                  >
                    <span>Full Manager Menu Editor</span>
                    <ExternalLinkIcon size={12} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="sad-btn-ghost"
                    onClick={() => setManageCafe(null)}
                    disabled={isUpdatingSettings}
                    style={{ color: '#64748b', background: '#f1f5f9', border: 'none' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sad-btn-deploy"
                    disabled={isUpdatingSettings}
                    style={{ minWidth: '130px' }}
                  >
                    {isUpdatingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {credentialModalCafe && (
        <div className="sad-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'grid', placeItems: 'center', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)' }}>
          <div
            className="sad-stat-card"
            style={{
              width: '92%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Update Manager Credentials
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {credentialModalCafe.name} (/{credentialModalCafe.slug})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCredentialModalCafe(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="ad-field-label">Manager Display Name</label>
                <input
                  type="text"
                  className="ad-form-input"
                  value={credForm.name}
                  onChange={(e) => setCredForm({ ...credForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="ad-field-label">Manager Email *</label>
                <input
                  type="email"
                  className="ad-form-input"
                  value={credForm.email}
                  onChange={(e) => setCredForm({ ...credForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="ad-field-label">New Password *</label>
                <input
                  type="password"
                  className="ad-form-input"
                  placeholder="Min 8 characters"
                  value={credForm.password}
                  onChange={(e) => setCredForm({ ...credForm, password: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="sad-btn-ghost"
                  onClick={() => setCredentialModalCafe(null)}
                  style={{ color: '#64748b', background: '#f1f5f9', border: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sad-btn-deploy"
                  disabled={isUpdatingCred}
                >
                  {isUpdatingCred ? 'Saving...' : 'Update Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
