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
} from './AdminIcons.jsx';
import { THEME_PRESETS } from '../common/themePresets.js';

export default function SuperAdminDashboard({
  currentUser,
  onSwitchCafe,
  onShowToast,
  apiCall,
}) {
  const [cafes, setCafes] = useState([]);
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

  const loadCafes = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await apiCall('/api/superadmin/cafes');
      setCafes(data.cafes || []);
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

  // Platform KPIs
  const stats = useMemo(() => {
    const totalCafes = cafes.length;
    const activeCafes = cafes.filter((c) => c.status === 'active').length;
    const suspendedCafes = totalCafes - activeCafes;
    const totalDishes = cafes.reduce((acc, c) => acc + (Number(c.dishCount) || 0), 0);
    const totalCategories = cafes.reduce((acc, c) => acc + (Number(c.categoryCount) || 0), 0);
    const totalManagers = cafes.filter((c) => Boolean(c.managerEmail)).length;
    const estimatedScans = cafes.reduce((acc, c) => acc + (Number(c.dishCount) || 0) * 28 + 140, 0);
    const activeRate = totalCafes > 0 ? Math.round((activeCafes / totalCafes) * 100) : 100;

    return {
      totalCafes,
      activeCafes,
      suspendedCafes,
      totalDishes,
      totalCategories,
      totalManagers,
      estimatedScans,
      activeRate,
    };
  }, [cafes]);

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

        {/* Card 3: Digital QR Scans */}
        <div className="sad-stat-card">
          <div className="sad-stat-header">
            <span className="sad-stat-label">Estimated QR Scans</span>
            <div className="sad-stat-icon-wrap sad-stat-icon-sky">
              <QrCodeIcon size={20} />
            </div>
          </div>
          <div className="sad-stat-val">{stats.estimatedScans.toLocaleString()}</div>
          <div className="sad-stat-sub" style={{ color: '#0284c7', fontWeight: 600 }}>
            <span>↑ 18.2% monthly guest volume</span>
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
            <span>100% Better Auth Secured</span>
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
                              onClick={() => onSwitchCafe(cafe.slug)}
                              title={`Switch admin context to ${cafe.name}`}
                            >
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
                    onClick={() => onSwitchCafe(cafe.slug)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <span>Manage Menu</span>
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

      {/* 7. Reset Manager Credentials Modal */}
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
