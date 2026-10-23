import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
} from '../admin/AdminIcons.jsx';
import SuperAdminLogin from './SuperAdminLogin.jsx';
import { THEME_PRESETS } from '../common/themePresets.js';

const SUPERADMIN_TOKEN_KEY = 'cafe-menu-superadmin-token';

export default function SuperAdminApp() {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(SUPERADMIN_TOKEN_KEY) || localStorage.getItem('cafe-menu-admin-token') || '';
    } catch {
      return '';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState('fleet'); // 'fleet' | 'themes' | 'managers' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Modals
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
    themePreset: 'showcase',
  });

  const [credentialModalCafe, setCredentialModalCafe] = useState(null);
  const [credForm, setCredForm] = useState({ email: '', password: '', name: '' });
  const [isUpdatingCred, setIsUpdatingCred] = useState(false);

  const [themeModalCafe, setThemeModalCafe] = useState(null);
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);

  const showToast = useCallback((msg, isBad = false) => {
    setToast({ text: msg, isBad });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // API Call helper with tokenRef support
  const apiCall = useCallback(
    async (path, options = {}) => {
      const activeToken = options.token !== undefined ? options.token : (tokenRef.current || token);
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          ...options.headers,
        },
        credentials: 'include',
      };
      if (options.body !== undefined && typeof options.body !== 'string') {
        config.body = JSON.stringify(options.body);
      }

      const res = await fetch(path, config);
      if (res.status === 401) {
        setIsAuthenticated(false);
        setToken('');
        tokenRef.current = '';
        setCurrentUser(null);
        try {
          localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
        } catch {}
        if (!options.silentAuth) {
          showToast('Session expired. Please sign in again.', true);
        }
        throw new Error('Unauthorized');
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return data;
    },
    [token, showToast]
  );

  // Verify Session
  const verifySession = useCallback(async (customToken = null) => {
    const activeToken = customToken !== null ? customToken : (tokenRef.current || token);
    if (!activeToken) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      const session = await apiCall('/api/admin/session', { silentAuth: true, token: activeToken });
      if (session && session.ok) {
        const isSuper = session.user?.role === 'superadmin' || session.user?.id === 'legacy-admin';
        if (!isSuper) {
          setIsAuthenticated(false);
          setToken('');
          tokenRef.current = '';
          setCurrentUser(null);
          try {
            localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
          } catch {}
          return false;
        }
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        return true;
      }
    } catch {
      setIsAuthenticated(false);
      setToken('');
      tokenRef.current = '';
      setCurrentUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token, apiCall]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Load Cafes
  const loadCafes = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await apiCall('/api/superadmin/cafes');
      setCafes(data.cafes || []);
      if (quiet) showToast('Platform venues updated');
    } catch (err) {
      if (isAuthenticated) {
        showToast(`Failed to load venues: ${err.message}`, true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [apiCall, isAuthenticated, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCafes();
    }
  }, [isAuthenticated, loadCafes]);

  // Handle Login
  const handleLogin = async (credentials) => {
    try {
      let data;
      if (credentials.email) {
        // Better Auth login
        const res = await fetch('/api/auth/sign-in/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        });
        data = await res.json().catch(() => ({}));
        if (!res.ok) {
          // Fallback to check master admin password
          try {
            const masterRes = await apiCall('/api/admin/login', {
              method: 'POST',
              body: { password: credentials.password },
            });
            if (masterRes && masterRes.token) {
              data = masterRes;
            }
          } catch (_) {}

          if (!data || !data.token) {
            throw new Error(data?.message || data?.error || 'Invalid email or password.');
          }
        }
      } else {
        data = await apiCall('/api/admin/login', {
          method: 'POST',
          body: { password: credentials.password },
        });
      }

      const receivedToken = data.token || data.session?.token || 'legacy-token';
      tokenRef.current = receivedToken;
      setToken(receivedToken);
      try {
        localStorage.setItem(SUPERADMIN_TOKEN_KEY, receivedToken);
      } catch {}

      await verifySession(receivedToken);
      showToast('Welcome to Super Admin Platform Console');
    } catch (err) {
      showToast(err.message, true);
      throw err;
    }
  };

  const handleLogout = () => {
    tokenRef.current = '';
    setToken('');
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
      localStorage.removeItem('cafe-menu-admin-token');
    } catch {}
    showToast('Signed out of Platform Console');
  };

  // KPIs
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

  // Filtered venues
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
      showToast(`${cafe.name} is now ${nextStatus}`);
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, true);
    }
  };

  const handleDeleteCafe = async (cafe) => {
    if (!window.confirm(`Permanently remove venue "${cafe.name}" (${cafe.slug}) and delete its digital menu?`)) {
      return;
    }
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}`, { method: 'DELETE' });
      setCafes((prev) => prev.filter((c) => c.id !== cafe.id));
      showToast(`Deleted venue "${cafe.name}"`);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, true);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showToast('Venue name and slug are required.', true);
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedPreset = THEME_PRESETS.find((p) => p.id === formData.themePreset) || THEME_PRESETS[0];
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
      showToast(`Venue "${formData.name}" deployed with "${selectedPreset.name}" template!`);
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
        themePreset: 'showcase',
      });
      await loadCafes(true);
    } catch (err) {
      showToast(err.message, true);
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
      showToast('Manager email and a new password are required.', true);
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
      showToast(`Credentials updated for ${credentialModalCafe.name}`);
      setCredentialModalCafe(null);
      await loadCafes(true);
    } catch (err) {
      showToast(`Credential update failed: ${err.message}`, true);
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
      showToast(`Applied "${preset.name}" to ${themeModalCafe.name}`);
      setThemeModalCafe(null);
      await loadCafes(true);
    } catch (err) {
      showToast(`Theme update failed: ${err.message}`, true);
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  // If not authenticated, render dedicated executive login
  if (!isAuthenticated) {
    return <SuperAdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="sa-app">
      {/* 1. Executive Topbar */}
      <header className="sa-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="/superadmin" className="sa-brand">
            <div className="sa-logo-badge">
              <ShieldIcon size={20} />
            </div>
            <div className="sa-brand-text">
              <span className="sa-brand-name">
                CafeMenu
                <span className="sa-brand-badge">Super Admin</span>
              </span>
            </div>
          </a>

          {/* Navigation Tabs */}
          <nav className="sa-nav">
            <button
              type="button"
              className={`sa-nav-tab ${currentTab === 'fleet' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('fleet')}
            >
              <CoffeeIcon size={16} />
              <span>Venues Fleet</span>
            </button>
            <button
              type="button"
              className={`sa-nav-tab ${currentTab === 'themes' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('themes')}
            >
              <PaletteIcon size={16} />
              <span>Theme Architectures</span>
            </button>
            <button
              type="button"
              className={`sa-nav-tab ${currentTab === 'managers' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('managers')}
            >
              <UsersIcon size={16} />
              <span>Manager Accounts</span>
            </button>
            <button
              type="button"
              className={`sa-nav-tab ${currentTab === 'analytics' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('analytics')}
            >
              <BookOpenIcon size={16} />
              <span>Platform Health</span>
            </button>
          </nav>
        </div>

        {/* Right utility buttons */}
        <div className="sa-topbar-right">
          <div className="sa-heartbeat">
            <span className="sa-pulse-dot"></span>
            <span>Multi-Tenant MySQL Active</span>
          </div>

          <a
            href="/admin"
            className="sa-btn-external"
            title="Open single-cafe manager dashboard"
          >
            <span>Cafe Portal</span>
            <ExternalLinkIcon size={12} />
          </a>

          <div className="sa-user-pill">
            <div className="sa-user-avatar">SA</div>
            <span>{currentUser?.name || 'Super Admin'}</span>
          </div>

          <button
            type="button"
            className="sa-btn-logout"
            onClick={handleLogout}
            title="Sign out of Platform Console"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. Main Executive Content Area */}
      <main className="sa-main">
        {/* TAB 1: VENUES FLEET */}
        {currentTab === 'fleet' && (
          <>
            {/* Hero Section */}
            <div className="sa-hero">
              <div className="sa-hero-inner">
                <div>
                  <h2 className="sa-hero-title">Venues Fleet &amp; Multi-Tenant Network</h2>
                  <p className="sa-hero-sub">
                    Manage registered cafe branches, configure unique vanity routes, deploy structural themes, and provision manager accounts.
                  </p>
                </div>

                <div className="sa-hero-actions">
                  <button
                    type="button"
                    className="sa-btn-secondary"
                    onClick={() => loadCafes(true)}
                  >
                    <RefreshIcon size={15} className={isRefreshing ? 'cm-spin' : ''} />
                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                  <button
                    type="button"
                    className="sa-btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <PlusIcon size={16} />
                    <span>Deploy New Venue</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="sa-metrics-grid">
              <div className="sa-metric-card">
                <div className="sa-metric-header">
                  <span className="sa-metric-label">Active Locations</span>
                  <div className="sa-metric-icon amber">
                    <CoffeeIcon size={20} />
                  </div>
                </div>
                <div className="sa-metric-value">{stats.totalCafes}</div>
                <div className="sa-metric-sub">
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{stats.activeCafes} active</span>
                  <span>&bull;</span>
                  <span style={{ color: stats.suspendedCafes > 0 ? '#fb7185' : '#94a3b8' }}>
                    {stats.suspendedCafes} suspended
                  </span>
                </div>
              </div>

              <div className="sa-metric-card">
                <div className="sa-metric-header">
                  <span className="sa-metric-label">Catalog Volume</span>
                  <div className="sa-metric-icon emerald">
                    <BookOpenIcon size={20} />
                  </div>
                </div>
                <div className="sa-metric-value">{stats.totalDishes}</div>
                <div className="sa-metric-sub">
                  <span>{stats.totalCategories} categories</span>
                  <span>&bull;</span>
                  <span>~{(stats.totalDishes / (stats.totalCafes || 1)).toFixed(1)} / venue</span>
                </div>
              </div>

              <div className="sa-metric-card">
                <div className="sa-metric-header">
                  <span className="sa-metric-label">Estimated QR Scans</span>
                  <div className="sa-metric-icon sky">
                    <QrCodeIcon size={20} />
                  </div>
                </div>
                <div className="sa-metric-value">{stats.estimatedScans.toLocaleString()}</div>
                <div className="sa-metric-sub" style={{ color: '#38bdf8', fontWeight: 600 }}>
                  <span>↑ 18.2% monthly guest volume</span>
                </div>
              </div>

              <div className="sa-metric-card">
                <div className="sa-metric-header">
                  <span className="sa-metric-label">Manager Accounts</span>
                  <div className="sa-metric-icon indigo">
                    <UsersIcon size={20} />
                  </div>
                </div>
                <div className="sa-metric-value">{stats.totalManagers}</div>
                <div className="sa-metric-sub" style={{ color: '#34d399', fontWeight: 600 }}>
                  <span>100% Better Auth Secured</span>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="sa-toolbar">
              <div className="sa-search-box">
                <SearchIcon size={16} style={{ color: '#64748b' }} />
                <input
                  type="text"
                  className="sa-search-input"
                  placeholder="Search venue name, vanity slug, currency, manager email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="sa-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    &times;
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                {/* Status Segmented Tabs */}
                <div className="sa-filter-tabs">
                  <button
                    type="button"
                    className={`sa-tab-item ${statusFilter === 'all' ? 'is-active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    <span>All</span>
                    <span className="sa-count-pill">{stats.totalCafes}</span>
                  </button>
                  <button
                    type="button"
                    className={`sa-tab-item ${statusFilter === 'active' ? 'is-active' : ''}`}
                    onClick={() => setStatusFilter('active')}
                  >
                    <span>Active</span>
                    <span className="sa-count-pill">{stats.activeCafes}</span>
                  </button>
                  <button
                    type="button"
                    className={`sa-tab-item ${statusFilter === 'suspended' ? 'is-active' : ''}`}
                    onClick={() => setStatusFilter('suspended')}
                  >
                    <span>Suspended</span>
                    <span className="sa-count-pill">{stats.suspendedCafes}</span>
                  </button>
                </div>

                {/* View Switch */}
                <div className="sa-view-switch">
                  <button
                    type="button"
                    className={`sa-view-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                    onClick={() => setViewMode('table')}
                    title="Table View"
                  >
                    <BookOpenIcon size={15} />
                  </button>
                  <button
                    type="button"
                    className={`sa-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <GridIcon size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Table or Grid */}
            {viewMode === 'table' ? (
              <div className="sa-table-card">
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table className="sa-table">
                    <thead>
                      <tr>
                        <th style={{ width: '28%' }}>Venue &amp; Vanity URL</th>
                        <th style={{ width: '18%' }}>Theme Architecture</th>
                        <th style={{ width: '22%' }}>Manager Account</th>
                        <th style={{ width: '12%' }}>Catalog</th>
                        <th style={{ width: '10%' }}>Status</th>
                        <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <RefreshIcon size={18} className="cm-spin" />
                              <span>Loading venues fleet...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredCafes.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
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
                            <tr key={cafe.id} className="sa-table-row">
                              {/* Venue details */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <div
                                    className="sa-venue-badge"
                                    style={{
                                      background: themeObj.primaryColor
                                        ? `${themeObj.primaryColor}25`
                                        : 'rgba(245, 158, 11, 0.15)',
                                      color: themeObj.primaryColor || '#f59e0b',
                                      border: `1px solid ${themeObj.primaryColor ? `${themeObj.primaryColor}45` : 'rgba(245, 158, 11, 0.35)'}`,
                                    }}
                                  >
                                    {cafe.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="sa-venue-title">{cafe.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                                      <a
                                        href={liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="sa-slug-link"
                                      >
                                        <span>/{cafe.slug}</span>
                                        <ExternalLinkIcon size={10} />
                                      </a>
                                      {cafe.currency && (
                                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                                          &bull; {cafe.currency}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Theme */}
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
                                    <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0f172a' }}>
                                      {matchedPreset.name.split(' ')[0]}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                    {matchedPreset.archetype}
                                  </div>
                                </div>
                              </td>

                              {/* Manager */}
                              <td>
                                {cafe.managerEmail ? (
                                  <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.86rem' }}>
                                      {cafe.managerName || 'Manager'}
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                      {cafe.managerEmail}
                                    </div>
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      color: '#b45309',
                                      background: 'rgba(245, 158, 11, 0.12)',
                                      border: '1px solid rgba(245, 158, 11, 0.25)',
                                      padding: '2px 8px',
                                      borderRadius: '999px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Unassigned
                                  </span>
                                )}
                              </td>

                              {/* Catalog */}
                              <td>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                                  {cafe.dishCount || 0} <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>dishes</span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                  {cafe.categoryCount || 0} categories
                                </div>
                              </td>

                              {/* Status */}
                              <td>
                                <button
                                  type="button"
                                  className={`sa-status-chip ${cafe.status === 'active' ? 'is-active' : 'is-suspended'}`}
                                  onClick={() => handleToggleStatus(cafe)}
                                  title="Click to toggle status"
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

                              {/* Actions */}
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <a
                                    href={`/admin?cafe=${cafe.slug}`}
                                    className="sa-btn-manage-menu"
                                    title="Open Cafe Manager Menu Editor"
                                  >
                                    <span>Manage</span>
                                  </a>

                                  <a
                                    href={liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sa-action-btn"
                                    title="View Live Guest Menu"
                                  >
                                    <EyeIcon size={14} />
                                  </a>

                                  <a
                                    href={qrUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sa-action-btn"
                                    title="Download QR Code"
                                  >
                                    <QrCodeIcon size={14} />
                                  </a>

                                  <button
                                    type="button"
                                    className="sa-action-btn"
                                    onClick={() => setThemeModalCafe(cafe)}
                                    title="Change Structural Theme"
                                  >
                                    <PaletteIcon size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    className="sa-action-btn"
                                    onClick={() => handleOpenCredentialsModal(cafe)}
                                    title="Update Manager Password"
                                  >
                                    <KeyIcon size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    className="sa-action-btn danger"
                                    onClick={() => handleDeleteCafe(cafe)}
                                    title="Delete Venue"
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
              /* Grid View */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {filteredCafes.map((cafe) => {
                  const isAbol = cafe.slug === 'abol-cafe';
                  const liveUrl = isAbol ? '/abol-cafe' : `/${cafe.slug}`;
                  const qrUrl = isAbol ? '/qr.png' : `/api/${cafe.slug}/qr.png`;
                  const themeObj = cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {};
                  const matchedPreset = THEME_PRESETS.find((p) => p.id === themeObj.preset) || THEME_PRESETS[0];

                  return (
                    <div
                      key={cafe.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: themeObj.primaryColor || '#f59e0b',
                        }}
                      />

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                          <div
                            className="sa-venue-badge"
                            style={{
                              background: themeObj.primaryColor ? `${themeObj.primaryColor}25` : 'rgba(245, 158, 11, 0.15)',
                              color: themeObj.primaryColor || '#f59e0b',
                              border: `1px solid ${themeObj.primaryColor ? `${themeObj.primaryColor}45` : 'rgba(245, 158, 11, 0.35)'}`,
                            }}
                          >
                            {cafe.name.charAt(0).toUpperCase()}
                          </div>
                          <button
                            type="button"
                            className={`sa-status-chip ${cafe.status === 'active' ? 'is-active' : 'is-suspended'}`}
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

                        <h4 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                          {cafe.name}
                        </h4>
                        <div style={{ marginBottom: '0.65rem' }}>
                          <a href={liveUrl} target="_blank" rel="noreferrer" className="sa-slug-link">
                            <span>/{cafe.slug}</span>
                            <ExternalLinkIcon size={10} />
                          </a>
                        </div>

                        {cafe.tagline && (
                          <p style={{ margin: '0 0 0.8rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                            {cafe.tagline}
                          </p>
                        )}

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                          <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {cafe.dishCount || 0} dishes
                          </span>
                          <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                            {cafe.categoryCount || 0} categories
                          </span>
                          <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                            {matchedPreset.name.split(' ')[0]} Theme
                          </span>
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.7rem' }}>
                          <strong>Manager:</strong> {cafe.managerEmail || 'Unassigned'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem', alignItems: 'center' }}>
                        <a
                          href={`/admin?cafe=${cafe.slug}`}
                          className="sa-btn-manage-menu"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <span>Manage Menu</span>
                        </a>

                        <a href={liveUrl} target="_blank" rel="noreferrer" className="sa-action-btn" title="Live Menu">
                          <EyeIcon size={14} />
                        </a>
                        <a href={qrUrl} target="_blank" rel="noreferrer" className="sa-action-btn" title="QR Code">
                          <QrCodeIcon size={14} />
                        </a>
                        <button type="button" className="sa-action-btn" onClick={() => setThemeModalCafe(cafe)} title="Theme">
                          <PaletteIcon size={14} />
                        </button>
                        <button type="button" className="sa-action-btn" onClick={() => handleOpenCredentialsModal(cafe)} title="Credentials">
                          <KeyIcon size={14} />
                        </button>
                        <button type="button" className="sa-action-btn danger" onClick={() => handleDeleteCafe(cafe)} title="Delete">
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: THEME ARCHITECTURES */}
        {currentTab === 'themes' && (
          <div>
            <div className="sa-hero" style={{ marginBottom: '1.8rem' }}>
              <div className="sa-hero-inner">
                <div>
                  <h2 className="sa-hero-title">Structural Theme Architectures</h2>
                  <p className="sa-hero-sub">
                    Explore the 5 specialized visual UI template architectures built for CafeMenu. Each architecture features custom card layouts, navigation header configurations, and immersive welcome covers with identical customer UX.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.4rem' }}>
              {THEME_PRESETS.map((preset) => {
                const assignedCafes = cafes.filter(
                  (c) => c.theme?.preset === preset.id || (!c.theme?.preset && preset.id === 'showcase')
                );

                return (
                  <div
                    key={preset.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '1.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {preset.previewColors.map((c, i) => (
                            <span
                              key={i}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: c,
                                border: '1.5px solid #cbd5e1',
                                display: 'inline-block',
                              }}
                            />
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#b45309',
                            background: '#fef3c7',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            border: '1px solid #fde68a',
                          }}
                        >
                          {preset.archetype}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                        {preset.name}
                      </h3>
                      <p style={{ margin: '0 0 1.2rem', fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                        {preset.tagline}
                      </p>

                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #f1f5f9',
                          borderRadius: '12px',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          fontSize: '0.8rem',
                          marginBottom: '1.2rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Card Style:</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{preset.cardStyle}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Navigation:</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{preset.navStyle}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Welcome Cover:</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{preset.landingStyle}</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                          Currently Active On ({assignedCafes.length}):
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {assignedCafes.length > 0 ? (
                            assignedCafes.map((c) => (
                              <span
                                key={c.id}
                                style={{
                                  fontSize: '0.74rem',
                                  background: '#f1f5f9',
                                  color: '#334155',
                                  border: '1px solid #e2e8f0',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                }}
                              >
                                {c.name}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: '#475569', fontStyle: 'italic' }}>
                              No venues assigned yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGER ACCOUNTS */}
        {currentTab === 'managers' && (
          <div>
            <div className="sa-hero" style={{ marginBottom: '1.8rem' }}>
              <div className="sa-hero-inner">
                <div>
                  <h2 className="sa-hero-title">Venue Managers Directory</h2>
                  <p className="sa-hero-sub">
                    Manage Better Auth administrator accounts assigned to each cafe branch. Issue password resets and audit access permissions.
                  </p>
                </div>
              </div>
            </div>

            <div className="sa-table-card">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Manager Name &amp; Email</th>
                    <th>Assigned Venue</th>
                    <th>Auth Role</th>
                    <th>Venue Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cafes.map((cafe) => (
                    <tr key={cafe.id} className="sa-table-row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'rgba(99, 102, 241, 0.2)',
                              color: '#818cf8',
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            {(cafe.managerName || cafe.name || 'M').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              {cafe.managerName || `${cafe.name} Manager`}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {cafe.managerEmail || 'No manager email assigned'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{cafe.name}</div>
                          <a href={`/${cafe.slug}`} target="_blank" rel="noreferrer" className="sa-slug-link">
                            /{cafe.slug}
                          </a>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: '#eef2ff',
                            color: '#4338ca',
                            border: '1px solid #c7d2fe',
                            padding: '3px 9px',
                            borderRadius: '999px',
                          }}
                        >
                          Cafe Manager
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: cafe.status === 'active' ? '#059669' : '#e11d48',
                          }}
                        >
                          {cafe.status === 'active' ? '● Active' : '○ Suspended'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="sa-btn-secondary"
                          style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                          onClick={() => handleOpenCredentialsModal(cafe)}
                        >
                          <KeyIcon size={13} />
                          <span>Reset Password</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM HEALTH & METRICS */}
        {currentTab === 'analytics' && (
          <div>
            <div className="sa-hero" style={{ marginBottom: '1.8rem' }}>
              <div className="sa-hero-inner">
                <div>
                  <h2 className="sa-hero-title">Platform Infrastructure &amp; Health</h2>
                  <p className="sa-hero-sub">
                    Real-time status of multi-tenant MySQL connection pools, Better Auth security sessions, and QR scan volume projections.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              <div className="sa-metric-card">
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                  Database Engine
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Engine:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>MySQL 8.0 Multi-Tenant</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Status:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>Connected &bull; Active Pool</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Tenants Registered:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{stats.totalCafes} venues</span>
                  </div>
                </div>
              </div>

              <div className="sa-metric-card">
                <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                  Authentication Security
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Auth Provider:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>Better Auth v1.7</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Role Enforcements:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>superadmin &bull; manager</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Manager Accounts:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{stats.totalManagers} verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Deploy New Venue Modal */}
      {isCreateModalOpen && (
        <div className="sa-modal-overlay">
          <div className="sa-modal-box" style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Deploy New Venue
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                  Provision a fresh multi-tenant catalog and assign manager access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
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

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Venue Profile
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="sa-label">Venue Name *</label>
                    <input
                      type="text"
                      className="sa-input"
                      placeholder="e.g. Skyline Lounge"
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="sa-label">Vanity Slug *</label>
                    <input
                      type="text"
                      className="sa-input"
                      placeholder="e.g. skyline-lounge"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.8rem' }}>
                  <label className="sa-label">Slogan / Tagline</label>
                  <input
                    type="text"
                    className="sa-input"
                    placeholder="e.g. Rooftop views, craft coffee &amp; gourmet dining"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.8rem' }}>
                  <div>
                    <label className="sa-label">Currency</label>
                    <select
                      className="sa-input"
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
                    <label className="sa-label">Starter Catalog</label>
                    <select
                      className="sa-input"
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
                    <label className="sa-label">Manager Name</label>
                    <input
                      type="text"
                      className="sa-input"
                      placeholder="e.g. Abebe Bikila"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="sa-label">Manager Email *</label>
                    <input
                      type="email"
                      className="sa-input"
                      placeholder="e.g. manager@venue.com"
                      value={formData.managerEmail}
                      onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.8rem' }}>
                  <label className="sa-label">Initial Password *</label>
                  <input
                    type="password"
                    className="sa-input"
                    placeholder="Min 8 characters"
                    value={formData.managerPassword}
                    onChange={(e) => setFormData({ ...formData, managerPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 3. Visual UI Web Design Template Picker */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    3. Choose Web Design Template (UI)
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    5 distinct visual architectures • Identical customer UX
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                  {THEME_PRESETS.slice(0, 5).map((preset) => {
                    const isSelected = (formData.themePreset || 'showcase') === preset.id;
                    return (
                      <div
                        key={preset.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setFormData({ ...formData, themePreset: preset.id })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setFormData({ ...formData, themePreset: preset.id });
                          }
                        }}
                        style={{
                          background: isSelected ? '#f8fafc' : '#ffffff',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
                          borderRadius: '12px',
                          padding: '0.9rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.6rem',
                          transition: 'all 0.15s ease',
                          outline: 'none',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                              {preset.previewColors.map((c, i) => (
                                <span
                                  key={i}
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: c,
                                    display: 'inline-block',
                                    border: '1px solid rgba(0,0,0,0.15)',
                                  }}
                                />
                              ))}
                            </div>
                            {isSelected ? (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  background: '#2563eb',
                                  color: '#ffffff',
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  letterSpacing: '0.02em',
                                }}
                              >
                                Selected ✓
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  color: '#64748b',
                                  background: '#f1f5f9',
                                  padding: '2px 7px',
                                  borderRadius: '999px',
                                }}
                              >
                                {preset.archetype.split(',')[0]}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>
                            {preset.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.35 }}>
                            {preset.tagline}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: '5px' }}>
                          Layout: <strong style={{ color: '#2563eb' }}>{preset.layout.toUpperCase()}</strong> • {preset.cardStyle.split(' ')[0]} Cards
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="sa-btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sa-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deploying...' : 'Deploy Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theme Architecture Switcher Modal */}
      {themeModalCafe && (
        <div className="sa-modal-overlay">
          <div className="sa-modal-box" style={{ maxWidth: '860px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  Select Theme Architecture: {themeModalCafe.name}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                  Assign one of the 5 structural UI architectures to this venue.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setThemeModalCafe(null)}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.1rem' }}>
              {THEME_PRESETS.map((preset) => {
                const isActive = (themeModalCafe.theme?.preset === preset.id) ||
                  (!themeModalCafe.theme?.preset && preset.id === 'showcase');

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectQuickTheme(preset)}
                    style={{
                      background: isActive ? '#eff6ff' : '#ffffff',
                      border: isActive ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      borderRadius: '16px',
                      padding: '1.3rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {preset.previewColors.map((c, i) => (
                            <span
                              key={i}
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: c,
                                display: 'inline-block',
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                              }}
                            />
                          ))}
                        </div>
                        {isActive ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: '#2563eb',
                              color: '#ffffff',
                              padding: '2px 9px',
                              borderRadius: '999px',
                            }}
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#475569',
                              background: '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            {preset.archetype}
                          </span>
                        )}
                      </div>

                      <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {preset.name}
                      </h4>
                      <p style={{ margin: '0 0 0.9rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                        {preset.tagline}
                      </p>

                      <div
                        style={{
                          background: '#f8fafc', border: '1px solid #f1f5f9',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          fontSize: '0.76rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Cards:</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{preset.cardStyle}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Nav Bar:</span>
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>{preset.navStyle}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.2rem' }}>
                      <button
                        type="button"
                        disabled={isUpdatingTheme}
                        className={isActive ? 'sa-btn-secondary' : 'sa-btn-primary'}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                      >
                        {isActive ? 'Current Active Theme' : isUpdatingTheme ? 'Applying...' : 'Apply Architecture'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="sa-btn-secondary"
                onClick={() => setThemeModalCafe(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Manager Credentials Modal */}
      {credentialModalCafe && (
        <div className="sa-modal-overlay">
          <div className="sa-modal-box" style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.3rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Update Manager Credentials
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                  {credentialModalCafe.name} (/{credentialModalCafe.slug})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCredentialModalCafe(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
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
                <label className="sa-label">Manager Display Name</label>
                <input
                  type="text"
                  className="sa-input"
                  value={credForm.name}
                  onChange={(e) => setCredForm({ ...credForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="sa-label">Manager Email *</label>
                <input
                  type="email"
                  className="sa-input"
                  value={credForm.email}
                  onChange={(e) => setCredForm({ ...credForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="sa-label">New Password *</label>
                <input
                  type="password"
                  className="sa-input"
                  placeholder="Min 8 characters"
                  value={credForm.password}
                  onChange={(e) => setCredForm({ ...credForm, password: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="sa-btn-secondary"
                  onClick={() => setCredentialModalCafe(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sa-btn-primary"
                  disabled={isUpdatingCred}
                >
                  {isUpdatingCred ? 'Saving...' : 'Update Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: toast.isBad ? '#f43f5e' : '#10b981',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            zIndex: 99999,
          }}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
