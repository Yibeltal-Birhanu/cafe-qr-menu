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
  const [menu, setMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'items' | 'categories' | 'templates' | 'settings'
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
    [token, showToast]
  );

  // Load Menu
  const loadMenu = useCallback(async () => {
    try {
      const data = await apiCall('/api/menu');
      setMenu(data);
    } catch (err) {
      console.error('Menu load error:', err);
      showToast('Failed to load menu: ' + err.message, true);
    }
  }, [apiCall, showToast]);

  // Verify Session
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    apiCall('/api/admin/session', { noAuthRedirect: true })
      .then(() => {
        setIsAuthenticated(true);
        loadMenu();
      })
      .catch(() => {
        setIsAuthenticated(false);
        setToken('');
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {}
      });
  }, [token, apiCall, loadMenu]);

  // Login handler
  const handleLogin = async (password) => {
    try {
      const data = await apiCall('/api/admin/login', {
        method: 'POST',
        body: { password },
        noAuthRedirect: true,
      });

      if (data.token) {
        setToken(data.token);
        try {
          localStorage.setItem(TOKEN_KEY, data.token);
        } catch {}
        setIsAuthenticated(true);
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
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    showToast('Signed out successfully.');
  };

  const cafe = menu?.cafe || {
    name: 'CafeMenu',
    tagline: 'Good Food • Great Moments',
    currency: 'ETB',
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

  // CRUD Handlers
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
      await apiCall(`/api/admin/items/${dish.id}`, { method: 'DELETE' });
      showToast(`Deleted "${dish.name}"`);
      await loadMenu();
    } catch (err) {
      showToast('Failed to delete item: ' + err.message, true);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}" and all its dishes?`)) return;
    try {
      await apiCall(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
      showToast(`Deleted category "${cat.name}"`);
      await loadMenu();
    } catch (err) {
      showToast('Failed to delete category: ' + err.message, true);
    }
  };

  const handleReorderCategories = async (newOrder) => {
    try {
      await apiCall('/api/admin/categories/reorder', {
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
      await apiCall('/api/admin/cafe', { method: 'PUT', body: patch });
      showToast('Cafe settings updated');
      await loadMenu();
    } catch (err) {
      showToast('Failed to update cafe: ' + err.message, true);
    }
  };

  const handleResetSampleMenu = async () => {
    if (!window.confirm('Reset all categories and dishes to sample defaults? Any custom items will be overwritten.')) return;
    try {
      await apiCall('/api/admin/reset', { method: 'POST' });
      showToast('Restored default sample menu');
      await loadMenu();
    } catch (err) {
      showToast('Failed to reset: ' + err.message, true);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'addCategory') {
        await apiCall('/api/admin/categories', {
          method: 'POST',
          body: { name: formData.name, icon: formData.icon },
        });
        showToast(`Category "${formData.name}" added`);
      } else if (modalMode === 'editCategory') {
        await apiCall(`/api/admin/categories/${modalData.id}`, {
          method: 'PUT',
          body: { name: formData.name, icon: formData.icon },
        });
        showToast(`Category "${formData.name}" updated`);
      } else if (modalMode === 'addDish') {
        await apiCall(`/api/admin/categories/${formData.categoryId}/items`, {
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
        await apiCall(`/api/admin/items/${modalData.id}`, {
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
        <AdminLogin onLogin={handleLogin} />
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
  };

  return (
    <div class="ad-layout">
      {/* 1. Left Sidebar */}
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. Main Content Container */}
      <main class="ad-main">
        {/* Top Header */}
        <AdminHeader
          title={titles[activeTab] || 'Dashboard'}
          searchQuery={globalSearch}
          onSearchChange={activeTab === 'templates' ? null : setGlobalSearch}
          searchPlaceholder={activeTab === 'templates' ? 'Search templates...' : 'Search menu items, categories...'}
          onLogout={handleLogout}
        />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <div class="ad-content-wrapper">
            {/* Left Main Dashboard Column */}
            <div class="ad-content-left">
              {/* Hero Welcome Card */}
              <div class="ad-hero-card">
                <h2 class="ad-hero-title">Welcome back, Admin!</h2>
                <p class="ad-hero-sub">Here&rsquo;s what&rsquo;s happening with your cafe today.</p>
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
            <div class="ad-content-left">
              <div class="ad-panel-card" style={{ marginBottom: '1.5rem' }}>
                <VenueSettings cafe={cafe} onSaveCafe={handleSaveCafe} />
              </div>

              <div class="ad-panel-card" style={{ borderLeft: '4px solid #ef4444' }}>
                <h3 class="ad-card-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
                <p class="ad-card-sub" style={{ marginBottom: '1rem' }}>
                  Restores the default sample menu (Burgers, Pizza, Coffee, Breakfast, Desserts, Drinks) and clears modifications.
                </p>
                <button
                  type="button"
                  class="ad-btn-action-primary"
                  id="resetBtn"
                  onClick={handleResetSampleMenu}
                  style={{ background: '#ef4444', maxWidth: '240px' }}
                >
                  Reset to Sample Menu
                </button>
              </div>
            </div>
            <AdminRightSidebar
              onAddDish={() => handleOpenAddDish()}
              onManageCategories={() => setActiveTab('categories')}
              onOpenQrTemplates={() => setActiveTab('templates')}
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
