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
import SuperAdminDashboardView from './SuperAdminDashboardView.jsx';
import AdminDishModal from './AdminDishModal.jsx';
import AdminLogin from './AdminLogin.jsx';
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCafeSlug, setCurrentCafeSlug] = useState('abol-cafe');
  const [menu, setMenu] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname.includes('superadmin') || window.location.pathname.includes('super-admin'))
    ) {
      return 'superadmin';
    }
    return 'dashboard';
  });
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

  // API Helper
  const apiCall = useCallback(
    async (path, options = {}) => {
      const config = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Cafe-Slug': currentCafeSlug,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      };
      if (options.body !== undefined && typeof options.body !== 'string') {
        config.body = JSON.stringify(options.body);
      }

      const res = await fetch(path, config);
      if (res.status === 401 && !options.noAuthRedirect) {
        setIsAuthenticated(false);
        setToken('');
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
    [token, showToast, currentCafeSlug]
  );

  // Load Menu for active cafe
  const loadMenu = useCallback(async () => {
    try {
      const data = await apiCall(`/api/menu?cafe=${currentCafeSlug}`);
      setMenu(data);
    } catch (err) {
      console.error('Menu load error:', err);
      showToast('Failed to load menu: ' + err.message, true);
    }
  }, [apiCall, showToast, currentCafeSlug]);

  // Verify Session on mount or token change
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      return;
    }

    apiCall('/api/admin/session', { noAuthRedirect: true })
      .then((data) => {
        setIsAuthenticated(true);
        setCurrentUser(data.user || null);
        loadMenu();
      })
      .catch(() => {
        setIsAuthenticated(false);
        setToken('');
        setCurrentUser(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
      });
  }, [token, apiCall, loadMenu]);

  // Reload menu whenever cafe slug switches
  useEffect(() => {
    if (isAuthenticated) {
      loadMenu();
    }
  }, [currentCafeSlug, isAuthenticated, loadMenu]);

  // Login handler
  const handleLogin = async (password) => {
    try {
      const data = await apiCall('/api/admin/login', {
        method: 'POST',
        body: { password, cafeSlug: currentCafeSlug },
        noAuthRedirect: true,
      });

      if (data.token) {
        setToken(data.token);
        try {
          localStorage.setItem(TOKEN_KEY, data.token);
        } catch {}
        setIsAuthenticated(true);
        try {
          const session = await apiCall('/api/admin/session', { noAuthRedirect: true });
          setCurrentUser(session.user || null);
        } catch {}
        showToast('Welcome back, Admin!');
        await loadMenu();
      }
    } catch (err) {
      showToast(err.message, true);
      throw err;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    setCurrentUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    showToast('Signed out successfully.');
  };

  const cafe = menu?.cafe || {
    name: 'CafeMenu',
    tagline: 'Good Food • Great Moments',
    currency: 'ETB',
    slug: currentCafeSlug,
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
      await apiCall(`/api/admin/items/${dish.id}?cafe=${currentCafeSlug}`, { method: 'DELETE' });
      showToast(`Deleted "${dish.name}"`);
      await loadMenu();
    } catch (err) {
      showToast('Failed to delete item: ' + err.message, true);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}" and all its dishes?`)) return;
    try {
      await apiCall(`/api/admin/categories/${cat.id}?cafe=${currentCafeSlug}`, { method: 'DELETE' });
      showToast(`Deleted category "${cat.name}"`);
      await loadMenu();
    } catch (err) {
      showToast('Failed to delete category: ' + err.message, true);
    }
  };

  const handleReorderCategories = async (newOrder) => {
    try {
      await apiCall(`/api/admin/categories/reorder?cafe=${currentCafeSlug}`, {
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
      await apiCall(`/api/admin/cafe?cafe=${currentCafeSlug}`, { method: 'PUT', body: patch });
      showToast('Cafe settings updated');
      await loadMenu();
    } catch (err) {
      showToast('Failed to update cafe: ' + err.message, true);
    }
  };

  const handleResetSampleMenu = async () => {
    if (!window.confirm('Reset all categories and dishes to sample defaults? Any custom items will be overwritten.')) return;
    try {
      await apiCall(`/api/admin/reset?cafe=${currentCafeSlug}`, { method: 'POST' });
      showToast('Restored default sample menu');
      await loadMenu();
    } catch (err) {
      showToast('Failed to reset: ' + err.message, true);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'addCategory') {
        await apiCall(`/api/admin/categories?cafe=${currentCafeSlug}`, {
          method: 'POST',
          body: { name: formData.name, icon: formData.icon },
        });
        showToast(`Category "${formData.name}" added`);
      } else if (modalMode === 'editCategory') {
        await apiCall(`/api/admin/categories/${modalData.id}?cafe=${currentCafeSlug}`, {
          method: 'PUT',
          body: { name: formData.name, icon: formData.icon },
        });
        showToast(`Category "${formData.name}" updated`);
      } else if (modalMode === 'addDish') {
        await apiCall(`/api/admin/categories/${formData.categoryId}/items?cafe=${currentCafeSlug}`, {
          method: 'POST',
          body: {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            badge: formData.badge,
            dietary: formData.dietary,
            prepTime: formData.prepTime,
          },
        });
        showToast(`Dish "${formData.name}" added`);
      } else if (modalMode === 'editDish') {
        await apiCall(`/api/admin/items/${modalData.id}?cafe=${currentCafeSlug}`, {
          method: 'PUT',
          body: {
            name: formData.name,
            description: formData.description,
            price: formData.price,
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

  // If not signed in, show clean modern login view
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <AdminLogin onSignIn={handleLogin} onLogin={handleLogin} />
        {toast && (
          <div class={`ad-toast is-visible`} style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: toast.isBad ? '#ef4444' : '#13221e', color: '#ffffff', padding: '0.8rem 1.4rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 999 }}>
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
    dashboard: 'Dashboard',
    items: 'Menu Items',
    categories: 'Categories',
    templates: 'QR Menu Templates',
    settings: 'Venue Settings',
    superadmin: 'Super Admin Platform',
  };

  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.id === 'legacy-admin' || true;

  return (
    <div class="ad-layout">
      {/* 1. Left Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isSuperAdmin={isSuperAdmin}
      />

      {/* 2. Main Content Container */}
      <main class="ad-main">
        {/* Top Header */}
        <AdminHeader
          title={titles[activeTab] || 'Dashboard'}
          searchQuery={globalSearch}
          onSearchChange={activeTab === 'templates' || activeTab === 'superadmin' ? null : setGlobalSearch}
          searchPlaceholder={activeTab === 'templates' ? 'Search templates...' : 'Search menu items, categories...'}
          onLogout={handleLogout}
          user={currentUser}
          currentCafe={cafe}
          onOpenSuperAdmin={() => setActiveTab('superadmin')}
        />

        {/* Tab Views */}

        {/* Super Admin Platform View */}
        {activeTab === 'superadmin' && (
          <div class="ad-content-wrapper">
            <div class="ad-content-left" style={{ flex: 1, width: '100%' }}>
              <SuperAdminDashboardView
                apiCall={apiCall}
                onShowToast={showToast}
                currentCafeSlug={currentCafeSlug}
                onSwitchCafe={(slug) => {
                  setCurrentCafeSlug(slug);
                  setActiveTab('dashboard');
                  showToast(`Switched active cafe to "${slug}"`);
                }}
              />
            </div>
          </div>
        )}

        {/* Regular Cafe Dashboard */}
        {activeTab === 'dashboard' && (
          <div class="ad-content-wrapper">
            {/* Left Main Dashboard Column */}
            <div class="ad-content-left">
              {/* Hero Welcome Card */}
              <div class="ad-hero-card">
                <h2 class="ad-hero-title">Welcome back, {currentUser?.name || 'Admin'}!</h2>
                <p class="ad-hero-sub">
                  Here&rsquo;s what&rsquo;s happening with <strong>{cafe.name}</strong> today.
                </p>
                <div class="ad-hero-date">
                  <CalendarIcon size={14} />
                  <span>{todayDateString}</span>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <AdminStatsRow totalItems={totalItems} totalCategories={categories.length} />

              {/* Traffic Chart & Top Viewed Items */}
              <AdminAnalyticsRow topItems={topDishes} />

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
            onShowToast={showToast}
          />
        )}

        {/* Dedicated Menu Items View */}
        {activeTab === 'items' && (
          <div class="ad-content-wrapper">
            <div class="ad-content-left">
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
          <div class="ad-content-wrapper">
            <div class="ad-content-left">
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
          <div class="ad-content-wrapper">
            <div class="ad-content-left" style={{ flex: 1, width: '100%' }}>
              <VenueSettings
                cafe={cafe}
                onSaveCafe={handleSaveCafe}
                onResetSampleMenu={handleResetSampleMenu}
                onShowToast={showToast}
              />
            </div>
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
