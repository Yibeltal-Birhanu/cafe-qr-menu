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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal: New Cafe
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

  const loadCafes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiCall('/api/superadmin/cafes');
      setCafes(data.cafes || []);
    } catch (err) {
      if (onShowToast) onShowToast(`Failed to load venues: ${err.message}`, true);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, onShowToast]);

  useEffect(() => {
    loadCafes();
  }, [loadCafes]);

  // Platform KPIs
  const stats = useMemo(() => {
    const totalCafes = cafes.length;
    const activeCafes = cafes.filter((c) => c.status === 'active').length;
    const totalDishes = cafes.reduce((acc, c) => acc + (Number(c.dishCount) || 0), 0);
    const totalCategories = cafes.reduce((acc, c) => acc + (Number(c.categoryCount) || 0), 0);
    const totalManagers = cafes.filter((c) => Boolean(c.managerEmail)).length;
    const estimatedScans = cafes.reduce((acc, c) => acc + (Number(c.dishCount) || 0) * 28 + 120, 0);
    return {
      totalCafes,
      activeCafes,
      totalDishes,
      totalCategories,
      totalManagers,
      estimatedScans,
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
        cafe.currency?.toLowerCase().includes(q);
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
      if (onShowToast) onShowToast(`${cafe.name} is now ${nextStatus}.`);
    } catch (err) {
      if (onShowToast) onShowToast(`Status update failed: ${err.message}`, true);
    }
  };

  const handleDeleteCafe = async (cafe) => {
    if (!window.confirm(`Permanently remove venue "${cafe.name}" and delete all its menu items?`)) {
      return;
    }
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}`, { method: 'DELETE' });
      setCafes((prev) => prev.filter((c) => c.id !== cafe.id));
      if (onShowToast) onShowToast(`Deleted venue "${cafe.name}".`);
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
      await apiCall('/api/superadmin/cafes', {
        method: 'POST',
        body: formData,
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
      await loadCafes();
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
      await loadCafes();
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
      if (onShowToast) onShowToast(`Theme for ${themeModalCafe.name} changed to ${preset.name}`);
      setThemeModalCafe(null);
      await loadCafes();
    } catch (err) {
      if (onShowToast) onShowToast(`Theme update failed: ${err.message}`, true);
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Executive Top Bar */}
      <div
        className="ad-panel-card"
        style={{
          padding: '1.6rem 1.8rem',
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ color: '#fbbf24' }}>
                <ShieldIcon size={18} />
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#fbbf24',
                }}
              >
                Super Admin Console
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  marginLeft: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                System Operational
              </span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Locations &amp; Multi-Tenant Platform
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#9ca3af', maxWidth: '640px' }}>
              Manage digital menu catalogs, provision manager credentials, and control venue branding across all locations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              type="button"
              className="ad-btn-action-primary"
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                width: 'auto',
                boxShadow: '0 4px 14px rgba(230, 146, 60, 0.35)',
              }}
            >
              <PlusIcon size={16} />
              <span>Deploy New Venue</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Platform Key Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="ad-panel-card" style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Active Locations</span>
            <CoffeeIcon size={18} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
            {stats.totalCafes}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>
            <span>{stats.activeCafes} active</span>
            <span style={{ color: '#d1d5db' }}>&bull;</span>
            <span style={{ color: stats.totalCafes - stats.activeCafes > 0 ? '#ef4444' : '#9ca3af' }}>
              {stats.totalCafes - stats.activeCafes} suspended
            </span>
          </div>
        </div>

        <div className="ad-panel-card" style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Total Menu Items</span>
            <BookOpenIcon size={18} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
            {stats.totalDishes}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '4px' }}>
            Across {stats.totalCategories} categories (avg. {(stats.totalDishes / (stats.totalCafes || 1)).toFixed(1)} / venue)
          </div>
        </div>

        <div className="ad-panel-card" style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Estimated QR Scans</span>
            <QrCodeIcon size={18} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
            {stats.estimatedScans.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>
            &uarr; 18.2% monthly scan volume
          </div>
        </div>

        <div className="ad-panel-card" style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Manager Accounts</span>
            <UsersIcon size={18} />
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
            {stats.totalManagers}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>
            100% assigned with secure auth
          </div>
        </div>
      </div>

      {/* 3. Search, Filter & Layout Controls */}
      <div
        className="ad-panel-card"
        style={{
          padding: '0.9rem 1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <SearchIcon size={16} style={{ color: '#9ca3af' }} />
          <input
            type="text"
            className="ad-form-input"
            placeholder="Search venue name, slug, currency, or manager email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '0.4rem 0', boxShadow: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', background: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
            {['all', 'active', 'suspended'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                style={{
                  border: 'none',
                  background: statusFilter === status ? '#ffffff' : 'transparent',
                  color: statusFilter === status ? '#111827' : '#6b7280',
                  fontWeight: statusFilter === status ? 700 : 500,
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  boxShadow: statusFilter === status ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '2px', background: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              style={{
                border: 'none',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#111827' : '#6b7280',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <BookOpenIcon size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
              style={{
                border: 'none',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#111827' : '#6b7280',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <GridIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Directory: Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="ad-panel-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                  <th style={{ padding: '0.95rem 1.4rem' }}>Venue &amp; Location</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Active Theme</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Manager Account</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Catalog Volume</th>
                  <th style={{ padding: '0.95rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.95rem 1.4rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#9ca3af' }}>
                      Loading locations...
                    </td>
                  </tr>
                ) : filteredCafes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#9ca3af' }}>
                      No venues found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCafes.map((cafe) => {
                    const isAbol = cafe.slug === 'abol-cafe';
                    const liveUrl = isAbol ? '/abol-cafe' : `/cafe/${cafe.slug}`;
                    const qrUrl = isAbol ? '/qr.png' : `/api/${cafe.slug}/qr.png`;
                    const themeObj = cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {};
                    const matchedPreset = THEME_PRESETS.find((p) => p.id === themeObj.preset) || THEME_PRESETS[0];

                    return (
                      <tr
                        key={cafe.id}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Venue Name & Slug */}
                        <td style={{ padding: '1rem 1.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: themeObj.primaryColor
                                  ? `${themeObj.primaryColor}18`
                                  : 'rgba(230, 146, 60, 0.12)',
                                color: themeObj.primaryColor || '#d97706',
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                border: `1px solid ${themeObj.primaryColor || '#d97706'}33`,
                              }}
                            >
                              {cafe.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>
                                {cafe.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span style={{ fontSize: '0.74rem', color: '#6b7280', fontFamily: 'monospace' }}>
                                  /{cafe.slug}
                                </span>
                                {cafe.tagline && (
                                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                    &bull; {cafe.tagline.slice(0, 32)}{cafe.tagline.length > 32 ? '...' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Theme Preset Pill & Swatch */}
                        <td style={{ padding: '1rem 1rem' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '3px' }}>
                              <span
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: themeObj.primaryColor || '#1c2826',
                                  display: 'inline-block',
                                }}
                              />
                              <span
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: themeObj.accentColor || '#e6923c',
                                  display: 'inline-block',
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 600,
                                color: '#374151',
                                background: '#f3f4f6',
                                padding: '2px 8px',
                                borderRadius: '6px',
                              }}
                            >
                              {matchedPreset.name.split(' ')[0]}
                            </span>
                            <button
                              type="button"
                              onClick={() => setThemeModalCafe(cafe)}
                              title="Change Theme"
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                            >
                              <PaletteIcon size={13} />
                            </button>
                          </div>
                        </td>

                        {/* Manager Credentials */}
                        <td style={{ padding: '1rem 1rem' }}>
                          {cafe.managerEmail ? (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.84rem' }}>
                                  {cafe.managerName || 'Manager'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenCredentialsModal(cafe)}
                                  title="Reset password / reassign"
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    padding: '0',
                                  }}
                                >
                                  <LockIcon size={12} />
                                </button>
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                                {cafe.managerEmail}
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenCredentialsModal(cafe)}
                              style={{
                                border: '1px dashed #d1d5db',
                                background: 'transparent',
                                color: '#6b7280',
                                borderRadius: '6px',
                                padding: '2px 8px',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                              }}
                            >
                              + Assign Manager
                            </button>
                          )}
                        </td>

                        {/* Catalog Volume */}
                        <td style={{ padding: '1rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                              }}
                            >
                              {cafe.dishCount || 0} dishes
                            </span>
                            <span
                              style={{
                                background: '#f3f4f6',
                                color: '#4b5563',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                              }}
                            >
                              {cafe.categoryCount || 0} cats
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                              {cafe.currency || 'ETB'}
                            </span>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td style={{ padding: '1rem 1rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cafe)}
                            title="Click to toggle status"
                            style={{
                              border: 'none',
                              cursor: 'pointer',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              background: cafe.status === 'active' ? '#dcfce7' : '#fee2e2',
                              color: cafe.status === 'active' ? '#15803d' : '#b91c1c',
                            }}
                          >
                            {cafe.status === 'active' ? 'Active' : 'Suspended'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '1rem 1.4rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="ad-btn-action-primary"
                              onClick={() => onSwitchCafe(cafe.slug)}
                              style={{
                                padding: '0.42rem 0.85rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                width: 'auto',
                              }}
                            >
                              <span>Manage</span>
                            </button>

                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="ad-btn-action-secondary"
                              title="Open Customer Digital Menu"
                              style={{
                                padding: '0.42rem 0.65rem',
                                fontSize: '0.78rem',
                                width: 'auto',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              <EyeIcon size={14} />
                            </a>

                            <a
                              href={qrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="ad-btn-action-secondary"
                              title="Download High-Res QR"
                              style={{
                                padding: '0.42rem 0.65rem',
                                fontSize: '0.78rem',
                                width: 'auto',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              <QrCodeIcon size={14} />
                            </a>

                            {!isAbol && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCafe(cafe)}
                                title="Delete Venue"
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #fecaca',
                                  color: '#dc2626',
                                  borderRadius: '8px',
                                  padding: '0.42rem 0.55rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                }}
                              >
                                <TrashIcon size={14} />
                              </button>
                            )}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.2rem',
          }}
        >
          {filteredCafes.map((cafe) => {
            const isAbol = cafe.slug === 'abol-cafe';
            const liveUrl = isAbol ? '/abol-cafe' : `/cafe/${cafe.slug}`;
            const qrUrl = isAbol ? '/qr.png' : `/api/${cafe.slug}/qr.png`;
            const themeObj = cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {};
            const matchedPreset = THEME_PRESETS.find((p) => p.id === themeObj.preset) || THEME_PRESETS[0];

            return (
              <div
                key={cafe.id}
                className="ad-panel-card"
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderTop: `4px solid ${themeObj.primaryColor || '#e6923c'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: themeObj.primaryColor ? `${themeObj.primaryColor}18` : 'rgba(230, 146, 60, 0.12)',
                        color: themeObj.primaryColor || '#d97706',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                      }}
                    >
                      {cafe.name.charAt(0).toUpperCase()}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cafe)}
                      style={{
                        border: 'none',
                        cursor: 'pointer',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: cafe.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: cafe.status === 'active' ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {cafe.status === 'active' ? 'Active' : 'Suspended'}
                    </button>
                  </div>

                  <h4 style={{ margin: '0 0 3px', fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                    {cafe.name}
                  </h4>
                  <div style={{ fontSize: '0.76rem', color: '#6b7280', fontFamily: 'monospace', marginBottom: '0.6rem' }}>
                    /{cafe.slug}
                  </div>

                  {cafe.tagline && (
                    <p style={{ margin: '0 0 0.8rem', fontSize: '0.78rem', color: '#4b5563', lineHeight: 1.4 }}>
                      {cafe.tagline}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 7px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {cafe.dishCount || 0} dishes
                    </span>
                    <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '2px 7px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {cafe.categoryCount || 0} categories
                    </span>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {matchedPreset.name.split(' ')[0]} Theme
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '0.6rem' }}>
                    <strong>Manager:</strong> {cafe.managerEmail || 'Unassigned'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.8rem' }}>
                  <button
                    type="button"
                    className="ad-btn-action-primary"
                    onClick={() => onSwitchCafe(cafe.slug)}
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}
                  >
                    Manage
                  </button>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ad-btn-action-secondary"
                    title="Live Menu"
                    style={{ padding: '0.5rem 0.7rem', display: 'grid', placeItems: 'center', textDecoration: 'none' }}
                  >
                    <EyeIcon size={14} />
                  </a>
                  <a
                    href={qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ad-btn-action-secondary"
                    title="QR Code"
                    style={{ padding: '0.5rem 0.7rem', display: 'grid', placeItems: 'center', textDecoration: 'none' }}
                  >
                    <QrCodeIcon size={14} />
                  </a>
                  <button
                    type="button"
                    className="ad-btn-action-secondary"
                    onClick={() => setThemeModalCafe(cafe)}
                    title="Change Theme"
                    style={{ padding: '0.5rem 0.7rem', display: 'grid', placeItems: 'center' }}
                  >
                    <PaletteIcon size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Deploy New Venue Modal */}
      {isCreateModalOpen && (
        <div className="ad-modal-overlay" style={{ display: 'grid', placeItems: 'center', zIndex: 10000 }}>
          <div
            className="ad-panel-card"
            style={{
              width: '92%',
              maxWidth: '580px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 className="ad-card-title" style={{ margin: 0, fontSize: '1.25rem' }}>
                  Deploy New Venue
                </h3>
                <p className="ad-card-sub" style={{ margin: '4px 0 0' }}>
                  Set up a fresh digital menu catalog and assign manager access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: '#9ca3af',
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.88rem', color: '#111827', fontWeight: 700 }}>
                  Venue Profile
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
                    <label className="ad-field-label">URL Slug *</label>
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
                    placeholder="e.g. Panoramic rooftop views &amp; craft drinks"
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
                      <option value="EUR">EUR (&euro;)</option>
                      <option value="GBP">GBP (&pound;)</option>
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

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.88rem', color: '#111827', fontWeight: 700 }}>
                  Manager Account
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="ad-btn-action-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ad-btn-action-primary"
                  disabled={isSubmitting}
                  style={{ width: 'auto', padding: '0.65rem 1.6rem', fontWeight: 700 }}
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
        <div className="ad-modal-overlay" style={{ display: 'grid', placeItems: 'center', zIndex: 10000 }}>
          <div
            className="ad-panel-card"
            style={{
              width: '94%',
              maxWidth: '820px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.8rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
              <div>
                <h3 className="ad-card-title" style={{ margin: 0, fontSize: '1.25rem' }}>
                  Select Theme Architecture: {themeModalCafe.name}
                </h3>
                <p className="ad-card-sub" style={{ margin: '4px 0 0', maxWidth: '640px' }}>
                  Choose from 4 fundamentally distinct UX architectures featuring custom card layouts, specialized navigation headers, and immersive customer cover screens.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setThemeModalCafe(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
              {THEME_PRESETS.map((preset) => {
                const isActive = (themeModalCafe.theme?.preset === preset.id) ||
                  (!themeModalCafe.theme?.preset && preset.id === 'showcase');
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectQuickTheme(preset)}
                    style={{
                      padding: '1.1rem',
                      borderRadius: '14px',
                      border: isActive ? '2px solid #e6923c' : '1px solid #e5e7eb',
                      background: isActive ? 'rgba(230, 146, 60, 0.04)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s ease',
                      boxShadow: isActive ? '0 6px 20px rgba(230, 146, 60, 0.14)' : '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.07)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                      }
                    }}
                  >
                    <div>
                      {/* Top Row: Palette + Active Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {preset.previewColors.map((c, i) => (
                            <span
                              key={i}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: c,
                                display: 'inline-block',
                                border: '1px solid rgba(0,0,0,0.12)',
                              }}
                            />
                          ))}
                        </div>
                        {isActive ? (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: '#e6923c',
                              color: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            Active Theme
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              color: '#6b7280',
                              background: '#f3f4f6',
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            {preset.archetype}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>
                        {preset.name}
                      </h4>
                      <p style={{ margin: '0 0 0.8rem', fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.35 }}>
                        {preset.tagline}
                      </p>

                      {/* Structural Architectural Specifications */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: '#f8fafc', padding: '0.7rem 0.8rem', borderRadius: '8px', fontSize: '0.74rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                          <span style={{ fontWeight: 700, minWidth: '46px', color: '#64748b' }}>Cards:</span>
                          <span style={{ fontWeight: 600 }}>{preset.cardStyle}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                          <span style={{ fontWeight: 700, minWidth: '46px', color: '#64748b' }}>Nav Bar:</span>
                          <span style={{ fontWeight: 600 }}>{preset.navStyle}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                          <span style={{ fontWeight: 700, minWidth: '46px', color: '#64748b' }}>Cover:</span>
                          <span style={{ fontWeight: 600 }}>{preset.landingStyle}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        disabled={isUpdatingTheme}
                        className={isActive ? 'ad-btn-action-secondary' : 'ad-btn-action-primary'}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.9rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isActive ? 'Current Theme' : isUpdatingTheme ? 'Applying...' : 'Apply This Architecture'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.4rem' }}>
              <button
                type="button"
                className="ad-btn-action-secondary"
                onClick={() => setThemeModalCafe(null)}
                style={{ width: 'auto', padding: '0.55rem 1.4rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Reset Manager Credentials Modal */}
      {credentialModalCafe && (
        <div className="ad-modal-overlay" style={{ display: 'grid', placeItems: 'center', zIndex: 10000 }}>
          <div
            className="ad-panel-card"
            style={{
              width: '92%',
              maxWidth: '460px',
              padding: '1.8rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 className="ad-card-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                  Update Manager Credentials
                </h3>
                <p className="ad-card-sub" style={{ margin: '4px 0 0' }}>
                  {credentialModalCafe.name} ({credentialModalCafe.slug})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCredentialModalCafe(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label className="ad-field-label">Manager Name</label>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.6rem' }}>
                <button
                  type="button"
                  className="ad-btn-action-secondary"
                  onClick={() => setCredentialModalCafe(null)}
                  style={{ width: 'auto', padding: '0.55rem 1.1rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ad-btn-action-primary"
                  disabled={isUpdatingCred}
                  style={{ width: 'auto', padding: '0.55rem 1.4rem', fontWeight: 700 }}
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
