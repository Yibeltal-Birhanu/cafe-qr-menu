import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import AdminStatsRow from './AdminStatsRow.jsx';
import AdminAnalyticsRow from './AdminAnalyticsRow.jsx';
import AdminItemsTable from './AdminItemsTable.jsx';
import AdminRightSidebar from './AdminRightSidebar.jsx';
import QrTemplatesView from './QrTemplatesView.jsx';
import VenueSettings from './VenueSettings.jsx';
import CategoryManagerView from './CategoryManagerView.jsx';
import AdminDishModal from './AdminDishModal.jsx';
import AdminLogin from './AdminLogin.jsx';
import SuperAdminDashboard from './SuperAdminDashboard.jsx';
import { CalendarIcon, PlusIcon } from './AdminIcons.jsx';


const TOKEN_KEY = 'cafe-menu-admin-token';

export default function AdminApp() {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch {
      return '';
    }
  });
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menu, setMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('addCategory');
  const [modalData, setModalData] = useState(null);
  const [targetCategoryId, setTargetCategoryId] = useState('');

  const showToast = useCallback((msg, isBad = false) => {
    setToast({ text: msg, isBad });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCafeSlug, setSelectedCafeSlug] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('cafe') || '';
    } catch {
      return '';
    }
  });
  const slugRef = useRef(selectedCafeSlug);
  useEffect(() => {
    slugRef.current = selectedCafeSlug;
  }, [selectedCafeSlug]);

  const [availableCafes, setAvailableCafes] = useState([]);

  // API Helper with tokenRef & credentials support
  const apiCall = useCallback(
    async (path, options = {}) => {
      const activeToken = options.token !== undefined ? options.token : (tokenRef.current || token);
      const activeSlug = options.cafeSlug !== undefined ? options.cafeSlug : (slugRef.current || selectedCafeSlug);

      const headers = {
        'Content-Type': 'application/json',
        ...(activeSlug ? { 'X-Cafe-Slug': activeSlug } : {}),
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        ...options.headers,
      };

      const config = {
        method: options.method || 'GET',
        headers,
        credentials: 'include',
      };
      if (options.body !== undefined) {
        config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      }

      const res = await fetch(path, config);
      if (res.status === 401 && !options.noAuthRedirect) {
        setIsAuthenticated(false);
        setToken('');
        tokenRef.current = '';
        setCurrentUser(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
        showToast('Session expired. Please sign in again.', true);
        throw new Error('Unauthorized');
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return data;
    },
    [token, selectedCafeSlug, showToast]
  );

  // Load Menu for designated tenant cafe
  const loadMenu = useCallback(
    async (slug = '', customToken = null) => {
      try {
        const activeSlug = slug || slugRef.current || selectedCafeSlug || 'abol-cafe';
        const query = activeSlug ? `?cafe=${encodeURIComponent(activeSlug)}` : '';
        const data = await apiCall(`/api/admin/menu${query}`, {
          token: customToken !== null ? customToken : (tokenRef.current || token),
          cafeSlug: activeSlug,
          noAuthRedirect: true,
        });
        if (data) {
          setMenu(data);
        }
      } catch (err) {
        console.warn('Menu load notice:', err.message);
      }
    },
    [apiCall, selectedCafeSlug, token]
  );

  // Verify Session & Resolve Scoped Cafe
  const verifySession = useCallback(
    async (customToken = null) => {
      const activeToken = customToken !== null ? customToken : (tokenRef.current || token);
      if (!activeToken) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        return false;
      }

      let session = null;
      try {
        session = await apiCall('/api/admin/session', {
          noAuthRedirect: true,
          token: activeToken,
          cafeSlug: '', // don't send premature slug for session check
        });
      } catch (err) {
        console.warn('Session check rejected:', err.message);
        setIsAuthenticated(false);
        setToken('');
        tokenRef.current = '';
        setCurrentUser(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
        return false;
      }

      if (session && session.ok) {
        setIsAuthenticated(true);
        setCurrentUser(session.user);
        const urlParams = new URLSearchParams(window.location.search);
        const urlCafe = urlParams.get('cafe');
        const resolvedSlug = urlCafe || session.cafeSlug || 'abol-cafe';
        setSelectedCafeSlug(resolvedSlug);
        slugRef.current = resolvedSlug;

        // If superadmin, fetch all cafes for switcher
        if (session.user && (session.user.role === 'superadmin' || session.user.id === 'legacy-admin')) {
          try {
            const cafesRes = await apiCall('/api/admin/cafes', { token: activeToken, noAuthRedirect: true });
            setAvailableCafes(cafesRes.cafes || []);
          } catch (_) {}
        }

        try {
          await loadMenu(resolvedSlug, activeToken);
        } catch (_) {}

        return true;
      } else {
        setIsAuthenticated(false);
        setToken('');
        tokenRef.current = '';
        setCurrentUser(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
        return false;
      }
    },
    [token, apiCall, loadMenu]
  );

  useEffect(() => {
    verifySession();
  }, [token, verifySession]);

  // Dual-mode Login handler (Manager Email or Master Password)
  const handleLogin = async (credentials) => {
    try {
      let authToken = '';
      if (typeof credentials === 'object' && credentials.email) {
        // Better Auth Manager Sign In
        const res = await fetch('/api/auth/sign-in/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        });
        const resData = await res.json().catch(() => ({}));
        if (res.ok && (resData.token || resData.session?.token)) {
          authToken = resData.token || (resData.session && resData.session.token) || '';
        } else {
          // Check master admin password fallback
          try {
            const masterRes = await apiCall('/api/admin/login', {
              method: 'POST',
              body: { password: credentials.password },
              noAuthRedirect: true,
            });
            if (masterRes && masterRes.token) {
              authToken = masterRes.token;
            }
          } catch (_) {}

          if (!authToken) {
            throw new Error(resData.message || resData.error || 'Invalid email or password.');
          }
        }
      } else {
        // Master Admin Password
        const pwd = typeof credentials === 'object' ? credentials.password : credentials;
        const data = await apiCall('/api/admin/login', {
          method: 'POST',
          body: { password: pwd },
          noAuthRedirect: true,
        });
        authToken = data.token || '';
      }

      if (!authToken) {
        throw new Error('Authentication succeeded but no authorization token was received.');
      }

      tokenRef.current = authToken;
      setToken(authToken);
      try {
        localStorage.setItem(TOKEN_KEY, authToken);
      } catch {}

      const ok = await verifySession(authToken);
      if (ok) {
        showToast('Signed in successfully!');
      } else {
        throw new Error('Session could not be established. Please try again.');
      }
    } catch (err) {
      showToast(err.message, true);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' }).catch(() => {});
    } catch {}
    setIsAuthenticated(false);
    setToken('');
    setCurrentUser(null);
    setSelectedCafeSlug('');
    setAvailableCafes([]);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    showToast('Signed out successfully.');
  };

  const handleSwitchCafe = async (newSlug) => {
    if (!newSlug) return;
    setSelectedCafeSlug(newSlug);
    await loadMenu(newSlug);
    setActiveTab('dashboard');
    showToast(`Switched venue to ${newSlug}`);
  };


  const cafe = menu?.cafe || {
    name: 'CafeMenu',
    tagline: 'Good Food • Great Moments',
    currency: 'ETB',
    slug: selectedCafeSlug,
  };

  const categories = menu?.categories || [];

  // Flatten all items for items table and analytics
  const allDishes = useMemo(() => {
    const list = [];
    categories.forEach((cat) => {
      (cat.items || []).forEach((item) => {
        list.push({
          ...item,
          categoryId: cat.id,
          categoryName: cat.name,
        });
      });
    });
    return list;
  }, [categories]);

  const totalItems = allDishes.length;

  // Top dishes for ranked analytics
  const topDishes = useMemo(() => {
    return allDishes.slice(0, 5).map((dish, i) => ({
      id: dish.id,
      name: dish.name,
      count: 42 - i * 4,
      max: 50,
      image: dish.image,
    }));
  }, [allDishes]);

  // CRUD Handlers scoped to active cafe
  const handleOpenAddDish = (categoryId = '') => {
    setModalMode('addDish');
    setModalData(null);
    setTargetCategoryId(categoryId || categories[0]?.id || '');
    setModalOpen(true);
  };

  const handleOpenEditDish = (dish) => {
    setModalMode('editDish');
    setModalData(dish);
    setTargetCategoryId(dish.categoryId || '');
    setModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setModalMode('addCategory');
    setModalData(null);
    setModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setModalMode('editCategory');
    setModalData(cat);
    setModalOpen(true);
  };

  const handleDeleteDish = async (dish) => {
    if (!window.confirm(`Delete "${dish.name}" from menu?`)) return;
    try {
      await apiCall(`/api/admin/items/${dish.id}?cafe=${selectedCafeSlug}`, { method: 'DELETE' });
      showToast(`Deleted "${dish.name}"`);
      await loadMenu();
    } catch (err) {
      showToast('Failed to delete item: ' + err.message, true);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}" and all its dishes?`)) return;
    try {
      await apiCall(`/api/admin/categories/${cat.id}?cafe=${selectedCafeSlug}`, { method: 'DELETE' });
      showToast(`Deleted category "${cat.name}"`);
      await loadMenu();
    } catch (err) {
      showToast('Failed to delete category: ' + err.message, true);
    }
  };

  const handleReorderCategories = async (newOrder) => {
    try {
      await apiCall(`/api/admin/categories/reorder?cafe=${selectedCafeSlug}`, {
        method: 'POST',
        body: { order: newOrder },
      });
      showToast('Category order saved');
      await loadMenu();
    } catch (err) {
      showToast('Failed to reorder categories: ' + err.message, true);
    }
  };

  const handleSaveCafe = async (patch) => {
    try {
      await apiCall(`/api/admin/cafe?cafe=${selectedCafeSlug}`, { method: 'PUT', body: patch });
      showToast('Cafe settings updated');
      await loadMenu();
    } catch (err) {
      showToast('Failed to update cafe: ' + err.message, true);
    }
  };

  const handleResetSampleMenu = async () => {
    if (!window.confirm('Reset all categories and dishes to sample defaults? Any custom items will be overwritten.')) return;
    try {
      await apiCall(`/api/admin/reset?cafe=${selectedCafeSlug}`, { method: 'POST' });
      showToast('Restored default sample menu');
      await loadMenu();
    } catch (err) {
      showToast('Failed to reset: ' + err.message, true);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'addCategory') {
        await apiCall(`/api/admin/categories?cafe=${selectedCafeSlug}`, {
          method: 'POST',
          body: {
            name: formData.name,
            icon: formData.icon,
            image: formData.image || '',
            description: formData.description || '',
          },
        });
        showToast(`Category "${formData.name}" added`);
      } else if (modalMode === 'editCategory') {
        await apiCall(`/api/admin/categories/${modalData.id}?cafe=${selectedCafeSlug}`, {
          method: 'PUT',
          body: {
            name: formData.name,
            icon: formData.icon,
            image: formData.image !== undefined ? formData.image : '',
            description: formData.description !== undefined ? formData.description : '',
          },
        });
        showToast(`Category "${formData.name}" updated`);
      } else if (modalMode === 'addDish') {
        const catId = formData.categoryId || (categories[0]?.id || '');
        const targetUrl = catId
          ? `/api/admin/categories/${catId}/items?cafe=${selectedCafeSlug}`
          : `/api/admin/items?cafe=${selectedCafeSlug}`;
        await apiCall(targetUrl, {
          method: 'POST',
          body: {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            image: formData.image,
            badge: formData.badge,
            dietary: formData.dietary,
            prepTime: formData.prepTime,
            categoryId: catId,
          },
        });
        showToast(`Dish "${formData.name}" added`);
      } else if (modalMode === 'editDish') {
        await apiCall(`/api/admin/items/${modalData.id}?cafe=${selectedCafeSlug}`, {
          method: 'PUT',
          body: {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            image: formData.image,
            badge: formData.badge,
            dietary: formData.dietary,
            prepTime: formData.prepTime,
            categoryId: formData.categoryId,
          },
        });
        showToast(`Dish "${formData.name}" updated`);
      }
      setModalOpen(false);
      await loadMenu();
    } catch (err) {
      showToast(err.message, true);
      throw err;
    }
  };

  // Image upload handler (uploads to Cloudinary via backend)
  const handleUploadImage = useCallback(async (file, folder = 'dishes') => {
    const activeToken = tokenRef.current || token;
    const fd = new FormData();
    fd.append('image', file);
    fd.append('folder', folder);
    if (selectedCafeSlug) {
      fd.append('cafeSlug', selectedCafeSlug);
    }
    const query = new URLSearchParams();
    if (selectedCafeSlug) query.set('cafe', selectedCafeSlug);
    if (folder) query.set('folder', folder);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await fetch(`/api/admin/upload${queryString}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        'X-Cafe-Slug': selectedCafeSlug || '',
      },
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data;
  }, [token, selectedCafeSlug]);

  // If not signed in, show clean modern login view
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <AdminLogin onLogin={handleLogin} onSignIn={handleLogin} />
        {toast && (
          <div className={`ad-toast is-visible`} style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.isBad ? '#ef4444' : '#13221e', color: '#ffffff', padding: '0.8rem 1.4rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 999 }}>
            {toast.text}
          </div>
        )}
      </div>
    );
  }

  // Get current date string for welcome banner
  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Page title mapping
  const titles = {
    platform: 'Platform Hub',
    dashboard: 'Dashboard',
    items: 'Menu Items',
    categories: 'Categories',
    templates: 'QR Menu Templates',
    settings: 'Venue Settings',
    superadmin: 'Super Admin Platform',
  };

  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.id === 'legacy-admin';

  return (
    <div className="ad-layout">
      {/* 1. Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cafe={cafe}
        currentUser={currentUser}
      />

      {/* 2. Main Content Container */}
      <main className="ad-main">
        {/* Top Header */}
        <AdminHeader
          title={titles[activeTab] || 'Dashboard'}
          searchQuery={globalSearch}
          onSearchChange={activeTab === 'templates' || activeTab === 'superadmin' ? null : setGlobalSearch}
          searchPlaceholder={activeTab === 'templates' ? 'Search templates...' : 'Search menu items, categories...'}
          user={currentUser}
          cafe={cafe}
          cafeSlug={selectedCafeSlug}
          availableCafes={availableCafes}
          onSwitchCafe={handleSwitchCafe}
          onLogout={handleLogout}
        />

        {/* Dedicated Super Admin Platform View */}
        {(activeTab === 'platform' || activeTab === 'superadmin') && (
          <div className="ad-content-full">
            <SuperAdminDashboard
              currentUser={currentUser}
              onSwitchCafe={(slug) => {
                handleSwitchCafe(slug);
              }}
              onShowToast={showToast}
              apiCall={apiCall}
            />
          </div>
        )}

        {/* Regular Cafe Dashboard */}
        {activeTab === 'dashboard' && (

          <div className="ad-content-wrapper">
            {/* Left Main Dashboard Column */}
            <div className="ad-content-left">
              {/* Hero Welcome Card */}
              <div className="ad-hero-card">
                <h2 className="ad-hero-title">Welcome back, {currentUser?.name || 'Admin'}!</h2>
                <p className="ad-hero-sub">Managing <strong>{cafe.name}</strong> &bull; {selectedCafeSlug}</p>
                <div className="ad-hero-date">
                  <CalendarIcon size={14} />
                  <span>{todayDateString}</span>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <AdminStatsRow
                totalItems={totalItems}
                totalCategories={categories.length}
                stats={menu?.analytics || {}}
              />

              {/* Traffic Chart & Top Viewed Items */}
              <AdminAnalyticsRow
                topItems={topDishes}
                chartData={menu?.analytics?.chartData}
              />

              {/* Menu Items Table */}
              <AdminItemsTable
                dishes={allDishes}
                currency={cafe.currency || 'ETB'}
                onAddItem={() => handleOpenAddDish()}
                onEditDish={handleOpenEditDish}
                onDeleteDish={handleDeleteDish}
              />
            </div>

            {/* Right Dashboard Column */}
            <AdminRightSidebar
              onAddDish={() => handleOpenAddDish()}
              onManageCategories={() => setActiveTab('categories')}
              onOpenQrTemplates={() => setActiveTab('templates')}
            />
          </div>
        )}

        {/* QR Menu Templates View */}
        {activeTab === 'templates' && (
          <QrTemplatesView
            cafeName={cafe.name || 'CafeMenu'}
            cafeSlug={selectedCafeSlug || cafe.slug || 'abol-cafe'}
            onShowToast={showToast}
          />
        )}

        {/* Dedicated Menu Items View */}
        {activeTab === 'items' && (
          <div className="ad-content-wrapper">
            <div className="ad-content-left">
              <AdminItemsTable
                dishes={allDishes}
                currency={cafe.currency || 'ETB'}
                onAddItem={() => handleOpenAddDish()}
                onEditDish={handleOpenEditDish}
                onDeleteDish={handleDeleteDish}
              />
            </div>
            <AdminRightSidebar
              onAddDish={() => handleOpenAddDish()}
              onManageCategories={() => setActiveTab('categories')}
              onOpenQrTemplates={() => setActiveTab('templates')}
            />
          </div>
        )}

        {/* Dedicated Categories View */}
        {activeTab === 'categories' && (
          <div className="ad-content-wrapper">
            <div className="ad-content-left">
              <CategoryManagerView
                categories={categories}
                currency={cafe.currency || 'ETB'}
                onAddCategory={handleOpenAddCategory}
                onEditCategory={handleOpenEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onReorderCategories={handleReorderCategories}
                onAddDish={(catId) => handleOpenAddDish(catId)}
              />
            </div>
            <AdminRightSidebar
              onAddDish={() => handleOpenAddDish()}
              onManageCategories={() => setActiveTab('categories')}
              onOpenQrTemplates={() => setActiveTab('templates')}
            />
          </div>
        )}

        {/* Dedicated Settings View */}
        {activeTab === 'settings' && (
          <div className="ad-content-full">
            <VenueSettings
                cafe={cafe}
                dishes={allDishes}
                onSaveCafe={handleSaveCafe}
                onResetSampleMenu={handleResetSampleMenu}
                onShowToast={showToast}
                onUploadImage={handleUploadImage}
                cafeSlug={selectedCafeSlug}
            />
          </div>
        )}
      </main>

      {/* Add / Edit Dish & Category Modal */}
      <AdminDishModal
        isOpen={modalOpen}
        mode={modalMode}
        data={modalData}
        categories={categories}
        targetCategoryId={targetCategoryId}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        onUploadImage={handleUploadImage}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: toast.isBad ? '#ef4444' : '#13221e',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'cmFadeIn 0.2s ease',
          }}
          role="status"
          aria-live="polite"
        >
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
