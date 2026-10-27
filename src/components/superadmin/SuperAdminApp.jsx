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
  SettingsIcon,
  SmartphoneIcon,
  ZapIcon,
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
  const [platformStats, setPlatformStats] = useState(null);
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
    hero_title: '',
    hero_description: '',
    hero_image: '',
    themePreset: 'showcase',
    primaryColor: '#1c2826',
    secondaryColor: '#64748b',
    accentColor: '#e6923c',
    managerName: '',
    managerEmail: '',
    managerPassword: '',
  });

  // Theme Management Studio & Multi-UI Switcher State
  const [studioPresetId, setStudioPresetId] = useState('showcase');
  const [studioTargetCafeId, setStudioTargetCafeId] = useState('');
  const [studioCustomColors, setStudioCustomColors] = useState({
    primary: '#1c2826',
    secondary: '#64748b',
    accent: '#e6923c',
    font: 'Plus Jakarta Sans',
    layout: 'bento',
  });
  const [studioView, setStudioView] = useState('studio'); // 'studio' | 'grid'
  const [isApplyingTheme, setIsApplyingTheme] = useState(false);
  const [activeSimulatorTab, setActiveSimulatorTab] = useState('All');

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
      if (options.body !== undefined) {
        config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
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

  // Load Cafes & Real Platform Stats
  const loadCafes = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [cafesData, statsData] = await Promise.all([
        apiCall('/api/superadmin/cafes'),
        apiCall('/api/superadmin/stats').catch(() => null),
      ]);
      setCafes(cafesData.cafes || []);
      if (statsData) setPlatformStats(statsData);
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
      showToast('Venue name is required.', true);
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

      showToast(`Settings saved for "${settingsForm.name}"`);
      setManageCafe(null);
      await loadCafes(true);
    } catch (err) {
      showToast(`Update failed: ${err.message}`, true);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleSelectStudioPreset = (preset) => {
    setStudioPresetId(preset.id);
    setStudioCustomColors({
      primary: preset.primaryColor,
      secondary: preset.secondaryColor,
      accent: preset.accentColor,
      font: preset.fontFamily,
      layout: preset.layout,
    });
  };

  const handleApplyPresetToCafe = async (preset, cafeId) => {
    if (!cafeId) {
      showToast('Please select a target venue first.', true);
      return;
    }
    const targetCafe = cafes.find((c) => c.id === cafeId);
    if (!targetCafe) return;

    setIsApplyingTheme(true);
    try {
      const themePayload = {
        preset: preset.id,
        layout: preset.layout,
        cardStyle: preset.cardStyle,
        navStyle: preset.navStyle,
        landingStyle: preset.landingStyle,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
        accentColor: preset.accentColor,
        backgroundColor: preset.backgroundColor || '#ffffff',
        backgroundMode: preset.backgroundMode || 'light',
        surfaceColor: preset.surfaceColor || '#ffffff',
        textColor: preset.textColor || '#111827',
        fontFamily: preset.fontFamily,
      };

      await apiCall(`/api/superadmin/cafes/${cafeId}/theme`, {
        method: 'PUT',
        body: { theme: themePayload },
      });

      showToast(`Applied "${preset.name.split(' (')[0]}" to ${targetCafe.name}!`);
      await loadCafes(true);
    } catch (err) {
      showToast(`Failed to apply theme: ${err.message}`, true);
    } finally {
      setIsApplyingTheme(false);
    }
  };

  const handleApplyCustomStudioTheme = async (cafeId) => {
    if (!cafeId) {
      showToast('Please select a target venue first.', true);
      return;
    }
    const targetCafe = cafes.find((c) => c.id === cafeId);
    if (!targetCafe) return;

    const basePreset = THEME_PRESETS.find((p) => p.id === studioPresetId) || THEME_PRESETS[0];

    setIsApplyingTheme(true);
    try {
      const themePayload = {
        preset: studioPresetId,
        layout: studioCustomColors.layout || basePreset.layout,
        cardStyle: basePreset.cardStyle,
        navStyle: basePreset.navStyle,
        landingStyle: basePreset.landingStyle,
        primaryColor: studioCustomColors.primary || basePreset.primaryColor,
        secondaryColor: studioCustomColors.secondary || basePreset.secondaryColor,
        accentColor: studioCustomColors.accent || basePreset.accentColor,
        backgroundColor: '#ffffff',
        backgroundMode: 'light',
        surfaceColor: '#ffffff',
        textColor: '#111827',
        fontFamily: studioCustomColors.font || basePreset.fontFamily,
      };

      await apiCall(`/api/superadmin/cafes/${cafeId}/theme`, {
        method: 'PUT',
        body: { theme: themePayload },
      });

      showToast(`Applied custom studio palette to ${targetCafe.name}!`);
      await loadCafes(true);
    } catch (err) {
      showToast(`Failed to apply custom theme: ${err.message}`, true);
    } finally {
      setIsApplyingTheme(false);
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
                  <span style={{ color: '#059669', fontWeight: 700 }}>{stats.activeCafes} active</span>
                  <span>&bull;</span>
                  <span style={{ color: stats.suspendedCafes > 0 ? '#e11d48' : '#64748b' }}>
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
                  <span className="sa-metric-label">Average Dish Price</span>
                  <div className="sa-metric-icon sky">
                    <GridIcon size={20} />
                  </div>
                </div>
                <div className="sa-metric-value">{stats.avgPrice} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>ETB</span></div>
                <div className="sa-metric-sub" style={{ color: '#0284c7', fontWeight: 600 }}>
                  <span>Live multi-tenant catalog pricing</span>
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
                <div className="sa-metric-sub" style={{ color: '#059669', fontWeight: 600 }}>
                  <span>{stats.activeSessions > 0 ? `${stats.activeSessions} active Better Auth sessions` : '100% Better Auth Secured'}</span>
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
                                  <button
                                    type="button"
                                    className="sa-btn-manage-menu"
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
                        <button
                          type="button"
                          className="sa-btn-manage-menu"
                          onClick={() => handleOpenManageSettings(cafe)}
                          style={{ flex: 1, justifyContent: 'center' }}
                          title="Manage Cafe Settings"
                        >
                          <SettingsIcon size={13} />
                          <span>Manage Settings</span>
                        </button>

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

        {/* TAB 2: THEME ARCHITECTURES & LIVE STUDIO */}
        {currentTab === 'themes' && (() => {
          const activeStudioPreset = THEME_PRESETS.find((p) => p.id === studioPresetId) || THEME_PRESETS[0];
          const activeLayout = studioCustomColors.layout || activeStudioPreset.layout || 'bento';
          const primaryCol = studioCustomColors.primary || activeStudioPreset.primaryColor;
          const secondaryCol = studioCustomColors.secondary || activeStudioPreset.secondaryColor;
          const accentCol = studioCustomColors.accent || activeStudioPreset.accentColor;

          const sampleDishes = [
            {
              id: 'd1',
              name: 'Signature Wagyu Smash Burger',
              desc: 'Double grass-fed smash patties, aged cheddar, caramelised onions & truffle aioli on toasted brioche.',
              price: '280 ETB',
              prepTime: '12 min',
              badge: 'Chef Special',
              image: '/images/dishes/classic-beef-burger.jpg',
              category: 'Burgers',
            },
            {
              id: 'd2',
              name: 'Artisan Bunna Ceremony & Popcorn',
              desc: 'Freshly roasted Yirgacheffe single-origin beans, traditional clay pot brew with organic salted popcorn.',
              price: '120 ETB',
              prepTime: '8 min',
              badge: 'Heritage',
              image: '/images/dishes/macchiato.jpg',
              category: 'Coffee',
            },
            {
              id: 'd3',
              name: 'Stone-Baked Margherita D.O.P.',
              desc: 'San Marzano plum tomatoes, fresh buffalo mozzarella, aromatic sweet basil, cold-pressed olive oil.',
              price: '340 ETB',
              prepTime: '15 min',
              badge: 'Wood Fired',
              image: '/images/dishes/margherita.jpg',
              category: 'Pizza',
            },
            {
              id: 'd4',
              name: 'Pistachio & Rose Choux Au Craquelin',
              desc: 'Delicate crisp pastry filled with light Sicilian pistachio cream, infused with organic damask rose water.',
              price: '190 ETB',
              prepTime: '5 min',
              badge: 'Fresh Baked',
              image: '/images/dishes/tiramisu.jpg',
              category: 'Desserts',
            },
          ];

          const filteredSampleDishes = activeSimulatorTab === 'All' 
            ? sampleDishes 
            : sampleDishes.filter((d) => d.category.toLowerCase().includes(activeSimulatorTab.toLowerCase()));

          return (
            <div>
              {/* Header with View Toggle */}
              <div className="sa-hero" style={{ marginBottom: '1.8rem' }}>
                <div className="sa-hero-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 className="sa-hero-title">Structural Theme Architectures & Live Studio</h2>
                    <p className="sa-hero-sub">
                      Preview, customize, and switch distinct visual UI architectures across your venue fleet in real time.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setStudioView('studio')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9px',
                        border: 'none',
                        background: studioView === 'studio' ? '#ffffff' : 'transparent',
                        color: studioView === 'studio' ? '#0f172a' : '#64748b',
                        fontWeight: studioView === 'studio' ? 700 : 500,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: studioView === 'studio' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <SmartphoneIcon size={15} />
                      <span>Live Studio & Simulator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioView('grid')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9px',
                        border: 'none',
                        background: studioView === 'grid' ? '#ffffff' : 'transparent',
                        color: studioView === 'grid' ? '#0f172a' : '#64748b',
                        fontWeight: studioView === 'grid' ? 700 : 500,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: studioView === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <GridIcon size={15} />
                      <span>Theme Catalog Grid</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* VIEW 1: INTERACTIVE STUDIO & PHONE SIMULATOR */}
              {studioView === 'studio' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'start' }}>
                  {/* Left Column: Preset Switcher, Color Engine, and Direct Apply Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* 1. Quick Switch Venue Action Bar */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1.4rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                            1-Click Theme Switcher
                          </h4>
                          <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                            Apply the active architecture to any venue immediately.
                          </p>
                        </div>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            border: '1px solid #a7f3d0',
                          }}
                        >
                          Ready to Switch
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                          value={studioTargetCafeId}
                          onChange={(e) => setStudioTargetCafeId(e.target.value)}
                          className="sa-input"
                          style={{ flex: 1, height: '42px', fontSize: '0.88rem', fontWeight: 600 }}
                        >
                          <option value="">-- Select Target Venue --</option>
                          {cafes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} (Current: {c.theme?.preset || 'showcase'})
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="sa-btn-primary"
                          disabled={!studioTargetCafeId || isApplyingTheme}
                          onClick={() => handleApplyPresetToCafe(activeStudioPreset, studioTargetCafeId)}
                          style={{
                            height: '42px',
                            padding: '0 20px',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            minWidth: '170px',
                            justifyContent: 'center',
                          }}
                        >
                          <ZapIcon size={14} />
                          <span>{isApplyingTheme ? 'Applying...' : `Apply "${activeStudioPreset.name.split(' (')[0]}"`}</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Architecture Preset Carousel / Cards */}
                    <div>
                      <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        Choose UI Architecture Preset ({THEME_PRESETS.length} available)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                        {THEME_PRESETS.map((preset) => {
                          const isSelected = studioPresetId === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectStudioPreset(preset)}
                              style={{
                                padding: '14px',
                                borderRadius: '14px',
                                border: isSelected ? `2.5px solid ${preset.primaryColor}` : '1.5px solid #e2e8f0',
                                background: isSelected ? '#faf5ff' : '#ffffff',
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                boxShadow: isSelected ? '0 8px 20px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.02)',
                                transition: 'all 0.18s ease',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: preset.primaryColor, border: '1px solid #e2e8f0' }} />
                                  <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                                    {preset.name.split(' (')[0]}
                                  </span>
                                </div>
                                {isSelected && (
                                  <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '0.9rem' }}>✓</span>
                                )}
                              </div>

                              <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.35 }}>
                                {preset.archetype}
                              </div>

                              <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                                {preset.previewColors.map((c, i) => (
                                  <span key={i} style={{ width: '18px', height: '7px', borderRadius: '3px', background: c, border: '1px solid #e2e8f0' }} />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Live 3-Tier Color Engine Customizer */}
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '1.4rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                            3-Tier Color Engine & Architecture Specs
                          </h4>
                          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                            Changes reflect in the live simulator immediately.
                          </p>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#475569', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          Layout: {activeLayout}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div>
                          <label className="sa-label" style={{ fontSize: '0.76rem' }}>1st Color (Primary)</label>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={primaryCol}
                              onChange={(e) => setStudioCustomColors({ ...studioCustomColors, primary: e.target.value })}
                              style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                            />
                            <input
                              type="text"
                              className="sa-input"
                              value={primaryCol}
                              onChange={(e) => setStudioCustomColors({ ...studioCustomColors, primary: e.target.value })}
                              style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem', padding: '6px 8px' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="sa-label" style={{ fontSize: '0.76rem' }}>2nd Color (Secondary)</label>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={secondaryCol}
                              onChange={(e) => setStudioCustomColors({ ...studioCustomColors, secondary: e.target.value })}
                              style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                            />
                            <input
                              type="text"
                              className="sa-input"
                              value={secondaryCol}
                              onChange={(e) => setStudioCustomColors({ ...studioCustomColors, secondary: e.target.value })}
                              style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem', padding: '6px 8px' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="sa-label" style={{ fontSize: '0.76rem' }}>3rd Color (Accent)</label>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input
                              type="color"
                              value={accentCol}
                              onChange={(e) => setStudioCustomColors({ ...studioCustomColors, accent: e.target.value })}
                              style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                            />
                            <input
                              type="text"
                              className="sa-input"
                              value={accentCol}
                              onChange={(e) => setStudioCustomColors({ ...studioCustomColors, accent: e.target.value })}
                              style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem', padding: '6px 8px' }}
                            />
                          </div>
                        </div>
                      </div>

                      {studioTargetCafeId && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="sa-btn-secondary"
                            disabled={isApplyingTheme}
                            onClick={() => handleApplyCustomStudioTheme(studioTargetCafeId)}
                            style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                          >
                            Apply Custom Palette to Selected Venue
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Realistic Interactive Smartphone Viewport Simulator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      Live Smartphone Viewport Simulation ({activeStudioPreset.name.split(' (')[0]})
                    </div>

                    <div
                      style={{
                        width: '380px',
                        height: '740px',
                        background: '#0f172a',
                        borderRadius: '44px',
                        padding: '12px',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25), 0 0 0 2px #334155',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Phone Speaker Notch */}
                      <div
                        style={{
                          width: '120px',
                          height: '18px',
                          background: '#0f172a',
                          borderRadius: '0 0 12px 12px',
                          position: 'absolute',
                          top: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '999px' }} />
                      </div>

                      {/* Phone Screen Canvas */}
                      <div
                        style={{
                          flex: 1,
                          background: '#ffffff',
                          borderRadius: '32px',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          fontFamily: studioCustomColors.font || activeStudioPreset.fontFamily || 'Plus Jakarta Sans',
                        }}
                      >
                        {/* Top Simulated App Bar */}
                        <div
                          style={{
                            padding: '30px 14px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: `1.5px solid ${secondaryCol}25`,
                            background: '#ffffff',
                            position: 'sticky',
                            top: 0,
                            zIndex: 20,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.72rem', color: secondaryCol, fontWeight: 700, letterSpacing: '0.04em' }}>
                              CAFEMENU GUEST APP
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: primaryCol, letterSpacing: '-0.02em' }}>
                              Abol Cafe &amp; Roasters
                            </div>
                          </div>

                          <div
                            style={{
                              background: `${primaryCol}15`,
                              border: `1px solid ${primaryCol}35`,
                              color: primaryCol,
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            Table #04
                          </div>
                        </div>

                        {/* Distinct Archetype Hero Banner */}
                        <div style={{ margin: '8px 12px 12px' }}>
                          {activeLayout === 'editorial' && (
                            <div style={{ background: '#fbfaf8', border: `1.5px solid ${secondaryCol}`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                              <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: secondaryCol, fontWeight: 800 }}>
                                RESERVE TASTING MENU
                              </div>
                              <h3 style={{ margin: '4px 0', fontFamily: 'serif', fontSize: '1.15rem', color: primaryCol, fontWeight: 800 }}>
                                Curated Tasting Menu
                              </h3>
                              <div style={{ width: '40px', height: '1.5px', background: accentCol, margin: '6px auto' }} />
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Rare single-origin harvests &amp; artisanal pairings.
                              </div>
                            </div>
                          )}

                          {activeLayout === 'rustic' && (
                            <div style={{ background: '#fff7ed', border: `2px solid ${primaryCol}`, borderRadius: '12px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: primaryCol, textTransform: 'uppercase' }}>
                                WOOD-FIRED HEARTH &amp; GRILL
                              </div>
                              <h3 style={{ margin: '3px 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                                CRAFTED BY FLAME
                              </h3>
                              <div style={{ fontSize: '0.72rem', color: secondaryCol }}>
                                Hardwood smoked, stone-baked sourdough crusts.
                              </div>
                            </div>
                          )}

                          {activeLayout === 'boutique' && (
                            <div style={{ background: '#fdf2f8', border: `1.5px solid ${primaryCol}40`, borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: primaryCol }}>
                                ARTISAN BAKES & PATISSERIE
                              </div>
                              <h3 style={{ margin: '3px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                Parisian Bakes &amp; Patisserie
                              </h3>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Freshly laminated viennoiserie &amp; choux.
                              </div>
                            </div>
                          )}

                          {activeLayout === 'noir' && (
                            <div style={{ background: '#0f172a', border: `1.5px solid ${primaryCol}`, borderRadius: '12px', padding: '12px 14px', color: '#ffffff' }}>
                              <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: primaryCol, fontWeight: 700 }}>
                                EVENING LOUNGE & BEVERAGES
                              </div>
                              <h3 style={{ margin: '3px 0', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                                SIGNATURE COCKTAILS & DINING
                              </h3>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                Handcrafted cocktails and evening dining.
                              </div>
                            </div>
                          )}

                          {activeLayout === 'minimal' && (
                            <div style={{ background: '#f8fafc', border: `1px solid ${secondaryCol}40`, borderRadius: '12px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: accentCol, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                SEASONAL KITCHEN &amp; COFFEE
                              </div>
                              <h3 style={{ margin: '3px 0', fontSize: '1.1rem', fontWeight: 800, color: primaryCol }}>
                                Fresh &amp; Thoughtfully Sourced
                              </h3>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Clean stone-ground grains &amp; single origins.
                              </div>
                            </div>
                          )}

                          {activeLayout === 'bento' && (
                            <div style={{ background: '#faf5ff', border: `1.5px solid ${primaryCol}30`, borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: accentCol }}>
                                FEATURED SPECIALTIES
                              </div>
                              <h3 style={{ margin: '3px 0', fontSize: '1.1rem', fontWeight: 900, color: primaryCol }}>
                                Fresh Flavors Every Day
                              </h3>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Authentic Habesha craft &amp; artisan grill.
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Category Filter Pills in Phone */}
                        <div style={{ display: 'flex', gap: '6px', padding: '0 12px 10px', overflowX: 'auto' }}>
                          {['All', 'Burgers', 'Coffee', 'Pizza', 'Desserts'].map((cat) => {
                            const isPillActive = activeSimulatorTab === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveSimulatorTab(cat)}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: activeLayout === 'boutique' ? '999px' : '8px',
                                  border: isPillActive ? `1.5px solid ${primaryCol}` : '1px solid #e2e8f0',
                                  background: isPillActive ? primaryCol : '#ffffff',
                                  color: isPillActive ? '#ffffff' : '#475569',
                                  fontSize: '0.72rem',
                                  fontWeight: isPillActive ? 700 : 500,
                                  whiteSpace: 'nowrap',
                                  cursor: 'pointer',
                                }}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>

                        {/* Dish List inside Phone */}
                        <div style={{ padding: '0 12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {filteredSampleDishes.map((dish) => (
                            <div
                              key={dish.id}
                              style={{
                                background: '#ffffff',
                                border: activeLayout === 'noir'
                                  ? `1.5px solid ${primaryCol}60`
                                  : activeLayout === 'rustic'
                                  ? `2px solid #ea580c30`
                                  : '1px solid #f1f5f9',
                                borderRadius: activeLayout === 'boutique' ? '18px' : '14px',
                                padding: '10px',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                              }}
                            >
                              <img
                                src={dish.image}
                                alt={dish.name}
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: activeLayout === 'boutique' ? '12px' : '10px',
                                  objectFit: 'cover',
                                  flexShrink: 0,
                                }}
                              />

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div
                                    style={{
                                      fontSize: '0.82rem',
                                      fontWeight: 800,
                                      color: primaryCol,
                                      lineHeight: 1.25,
                                    }}
                                  >
                                    {dish.name}
                                  </div>
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {dish.desc}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: accentCol }}>
                                    {dish.price}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.62rem',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      background: `${primaryCol}12`,
                                      color: primaryCol,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {dish.badge}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: THEME CATALOG GRID */}
              {studioView === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.4rem' }}>
                  {THEME_PRESETS.map((preset) => {
                    const assignedCafes = cafes.filter(
                      (c) => c.theme?.preset === preset.id || (!c.theme?.preset && preset.id === 'showcase')
                    );

                    return (
                      <div
                        key={preset.id}
                        style={{
                          background: '#ffffff',
                          border: studioPresetId === preset.id ? `2px solid ${preset.primaryColor}` : '1px solid #e2e8f0',
                          borderRadius: '20px',
                          padding: '1.6rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
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

                          <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                            {preset.name}
                          </h3>
                          <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
                            {preset.tagline}
                          </p>

                          <div
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #f1f5f9',
                              borderRadius: '12px',
                              padding: '0.9rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              fontSize: '0.78rem',
                              marginBottom: '1rem',
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

                          <div style={{ marginBottom: '1.2rem' }}>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                              Active on {assignedCafes.length} venue{assignedCafes.length === 1 ? '' : 's'}:
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
                                      fontWeight: 600,
                                    }}
                                  >
                                    {c.name}
                                  </span>
                                ))
                              ) : (
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>
                                  No venues assigned yet
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Direct Switcher Actions */}
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="sa-btn-secondary"
                            onClick={() => {
                              handleSelectStudioPreset(preset);
                              setStudioView('studio');
                            }}
                            style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '8px' }}
                          >
                            <SmartphoneIcon size={14} />
                            <span>Preview in Studio</span>
                          </button>

                          <button
                            type="button"
                            className="sa-btn-primary"
                            onClick={() => {
                              setThemeModalCafe(cafes[0]);
                            }}
                            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                          >
                            Assign...
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

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
                    <span style={{ color: '#64748b' }}>Connection Pool:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>Connected &bull; Active Pool</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Tenants Registered:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{stats.totalCafes} venues</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Total Menu Dishes:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{stats.totalDishes} items</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Average Dish Price:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{stats.avgPrice} ETB</span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Active Sessions:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{stats.activeSessions} tokens</span>
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

      {/* Dedicated Super Admin Venue Settings Modal */}
      {manageCafe && (
        <div className="sa-modal-overlay">
          <div className="sa-modal-box" style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto' }}>
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
                  className="sa-btn-secondary"
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
                      <label className="sa-label">Venue Name *</label>
                      <input
                        type="text"
                        required
                        className="sa-input"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        placeholder="e.g. Abol Cafe & Roasters"
                      />
                    </div>

                    <div>
                      <label className="sa-label">URL Slug (System Handle)</label>
                      <input
                        type="text"
                        disabled
                        className="sa-input"
                        value={`/${settingsForm.slug}`}
                        style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label className="sa-label">Tagline / Slogan</label>
                      <input
                        type="text"
                        className="sa-input"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        placeholder="e.g. Freshly brewed, freshly grilled"
                      />
                    </div>

                    <div>
                      <label className="sa-label">Currency</label>
                      <select
                        className="sa-input"
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
                      <label className="sa-label">Contact Phone / Support</label>
                      <input
                        type="text"
                        className="sa-input"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="e.g. +251 911 234 567"
                      />
                    </div>

                    <div>
                      <label className="sa-label">Operational Status</label>
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
                    <label className="sa-label">Footer / Welcome Brand Note</label>
                    <textarea
                      rows={2}
                      className="sa-input"
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
                    <label className="sa-label">Custom Hero Title</label>
                    <input
                      type="text"
                      className="sa-input"
                      value={settingsForm.hero_title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                      placeholder="e.g. Wood-Fired Delicacies &amp; Reserve Roasts (leave empty for theme default)"
                    />
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                      Defaults to the cafe name or theme layout signature heading if left blank.
                    </span>
                  </div>

                  <div>
                    <label className="sa-label">Custom Hero Description / Subtitle</label>
                    <textarea
                      rows={2}
                      className="sa-input"
                      style={{ resize: 'vertical' }}
                      value={settingsForm.hero_description || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_description: e.target.value })}
                      placeholder="e.g. Freshly handcrafted ingredients, organic sourdough pizzas, and single-origin coffee."
                    />
                  </div>

                  <div>
                    <label className="sa-label">Hero Banner Image URL</label>
                    <input
                      type="url"
                      className="sa-input"
                      value={settingsForm.hero_image || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_image: e.target.value })}
                      placeholder="https://res.cloudinary.com/... or paste image URL"
                    />
                    {/* Current Hero Image Preview */}
                    {settingsForm.hero_image ? (
                      <div style={{ marginTop: '0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            Current Hero Image Preview
                          </span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                            ● Active on Menu
                          </span>
                        </div>
                        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', height: '160px', position: 'relative', background: '#000' }}>
                          <img
                            src={settingsForm.hero_image}
                            alt="Hero banner preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
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
                      <label className="sa-label">Wi-Fi Network Name (SSID)</label>
                      <input
                        type="text"
                        className="sa-input"
                        value={settingsForm.wifi_ssid}
                        onChange={(e) => setSettingsForm({ ...settingsForm, wifi_ssid: e.target.value })}
                        placeholder="e.g. AbolGuestWiFi"
                      />
                    </div>

                    <div>
                      <label className="sa-label">Wi-Fi Password</label>
                      <input
                        type="text"
                        className="sa-input"
                        value={settingsForm.wifi_pass}
                        onChange={(e) => setSettingsForm({ ...settingsForm, wifi_pass: e.target.value })}
                        placeholder="e.g. Coffee2026!"
                      />
                    </div>
                  </div>

                  <div style={{ padding: '1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', display: 'grid', placeItems: 'center', color: '#4338ca', fontSize: '1.2rem' }}>
                      WiFi
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
                  <label className="sa-label">Choose Theme Architecture Preset</label>
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
                      <label className="sa-label">1st Color (Primary)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={settingsForm.primaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                          style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          className="sa-input"
                          value={settingsForm.primaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                          style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="sa-label">2nd Color (Secondary)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={settingsForm.secondaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                          style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          className="sa-input"
                          value={settingsForm.secondaryColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                          style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="sa-label">3rd Color (Accent)</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={settingsForm.accentColor}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accentColor: e.target.value })}
                          style={{ width: '38px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          className="sa-input"
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
                      <label className="sa-label">Manager Display Name</label>
                      <input
                        type="text"
                        className="sa-input"
                        value={settingsForm.managerName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, managerName: e.target.value })}
                        placeholder="e.g. Venue General Manager"
                      />
                    </div>

                    <div>
                      <label className="sa-label">Manager Email Account</label>
                      <input
                        type="email"
                        className="sa-input"
                        value={settingsForm.managerEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, managerEmail: e.target.value })}
                        placeholder="e.g. manager@venue.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="sa-label">Reset Password (Optional)</label>
                    <input
                      type="password"
                      className="sa-input"
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
                  <a
                    href={`/admin?cafe=${manageCafe.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.8rem', color: '#4f46e5', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    title="Open full manager menu editor in new tab"
                  >
                    <span>Full Manager Menu Editor</span>
                    <ExternalLinkIcon size={12} />
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="sa-btn-secondary"
                    onClick={() => setManageCafe(null)}
                    disabled={isUpdatingSettings}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sa-btn-primary"
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
