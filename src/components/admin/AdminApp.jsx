import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminTopbar from './AdminTopbar.jsx';
import AdminLogin from './AdminLogin.jsx';
import VenueSettings from './VenueSettings.jsx';
import TableQrStudio from './TableQrStudio.jsx';
import CategoryDishManager from './CategoryDishManager.jsx';
import AdminDishModal from './AdminDishModal.jsx';

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
  const [saveState, setSaveState] = useState('Checking session...');
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const debounceTimers = useRef({});

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

  // API Client Helper
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
        setSaveState('Session expired');
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
      setSaveState('Loading...');
      const data = await apiCall('/api/menu');
      setMenu(data);
      setSaveState('All changes saved');
    } catch (err) {
      console.error('Menu load error:', err);
      showToast('Failed to load menu: ' + err.message, true);
    }
  }, [apiCall, showToast]);

  // Verify Session on initial load or token change
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setSaveState('Not signed in');
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
        setSaveState('Not signed in');
      });
  }, [token, apiCall, loadMenu]);

  // Sign In Handler
  const handleSignIn = async (password) => {
    const data = await apiCall('/api/admin/login', {
      method: 'POST',
      body: { password },
      noAuthRedirect: true,
    });
    setToken(data.token);
    try {
      localStorage.setItem(TOKEN_KEY, data.token);
    } catch {}
    setIsAuthenticated(true);
    showToast('Signed in successfully!');
  };

  // Sign Out Handler
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setToken('');
    setMenu(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setSaveState('Not signed in');
    showToast('Signed out');
  };

  // Auto-save Cafe Profile
  const handleSaveCafe = async (updatedCafe) => {
    setSaveState('Saving cafe profile...');
    try {
      const data = await apiCall('/api/admin/cafe', {
        method: 'PUT',
        body: updatedCafe,
      });
      setMenu((prev) => (prev ? { ...prev, cafe: data.cafe } : prev));
      setSaveState('All changes saved');
    } catch (err) {
      setSaveState('Save failed');
      showToast(err.message, true);
    }
  };

  // Category Actions
  const handleAddCategoryClick = () => {
    setModalMode('addCategory');
    setModalData(null);
    setModalOpen(true);
  };

  const handleUpdateCategory = (categoryId, fields) => {
    // Optimistic UI update
    setMenu((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((c) => (c.id === categoryId ? { ...c, ...fields } : c)),
      };
    });

    const timerKey = `cat-${categoryId}`;
    if (debounceTimers.current[timerKey]) clearTimeout(debounceTimers.current[timerKey]);

    setSaveState('Saving...');
    debounceTimers.current[timerKey] = setTimeout(async () => {
      try {
        await apiCall(`/api/admin/categories/${categoryId}`, {
          method: 'PUT',
          body: fields,
        });
        setSaveState('All changes saved');
      } catch (err) {
        setSaveState('Save failed');
        showToast(err.message, true);
      }
    }, 400);
  };

  const handleDeleteCategory = async (categoryId) => {
    setSaveState('Deleting category...');
    try {
      await apiCall(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      await loadMenu();
      showToast('Category deleted');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const handleReorderCategories = async (order) => {
    setSaveState('Reordering categories...');
    try {
      await apiCall('/api/admin/categories/reorder', {
        method: 'POST',
        body: { order },
      });
      await loadMenu();
      showToast('Categories reordered');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Dish Actions
  const handleAddDishClick = (categoryId) => {
    setModalMode('addDish');
    setModalData(null);
    setTargetCategoryId(categoryId);
    setModalOpen(true);
  };

  const handleUpdateDish = (dishId, fields) => {
    // Optimistic UI update
    setMenu((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((c) => ({
          ...c,
          items: c.items.map((item) => (item.id === dishId ? { ...item, ...fields } : item)),
        })),
      };
    });

    const timerKey = `item-${dishId}`;
    if (debounceTimers.current[timerKey]) clearTimeout(debounceTimers.current[timerKey]);

    setSaveState('Saving...');
    debounceTimers.current[timerKey] = setTimeout(async () => {
      try {
        await apiCall(`/api/admin/items/${dishId}`, {
          method: 'PUT',
          body: fields,
        });
        setSaveState('All changes saved');
        // If category changed, reload menu to re-bucket item
        if (fields.categoryId) {
          await loadMenu();
        }
      } catch (err) {
        setSaveState('Save failed');
        showToast(err.message, true);
      }
    }, 450);
  };

  const handleDeleteDish = async (dishId) => {
    setSaveState('Deleting dish...');
    try {
      await apiCall(`/api/admin/items/${dishId}`, { method: 'DELETE' });
      await loadMenu();
      showToast('Dish removed');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Reset to Sample Menu
  const handleResetSampleMenu = async () => {
    if (!window.confirm('Are you sure you want to restore the default sample menu? This will replace your customized categories and dishes.')) {
      return;
    }
    setSaveState('Resetting menu...');
    try {
      await apiCall('/api/admin/reset', { method: 'POST' });
      await loadMenu();
      showToast('Menu successfully reset to sample data');
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Modal Submit Dispatcher
  const handleModalSubmit = async (formData) => {
    setSaveState('Saving changes...');
    try {
      if (modalMode === 'addCategory') {
        await apiCall('/api/admin/categories', {
          method: 'POST',
          body: formData,
        });
        showToast('Category created');
      } else if (modalMode === 'addDish') {
        await apiCall(`/api/admin/categories/${formData.categoryId}/items`, {
          method: 'POST',
          body: formData,
        });
        showToast('Dish added');
      }
      setModalOpen(false);
      await loadMenu();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  const cafe = menu?.cafe || { name: 'Cafe', currency: 'ETB' };
  const categories = menu?.categories || [];

  // Stats
  const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const allPrices = categories.flatMap((cat) => (cat.items || []).map((i) => Number(i.price) || 0));
  const avgPrice = allPrices.length ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length) : 0;

  return (
    <>
      <AdminTopbar
        isAuthenticated={isAuthenticated}
        saveState={saveState}
        onSignOut={handleSignOut}
      />

      <main className="wrap admin">
        {!isAuthenticated ? (
          <AdminLogin onSignIn={handleSignIn} />
        ) : (
          <section id="dashView">
            <div className="admin__head">
              <div>
                <h1>Cafe Menu Controller</h1>
                <p className="hint">
                  All changes save instantly and update the live QR menu in real-time.
                </p>
              </div>
              <div className="admin__head-actions">
                <button
                  className="btn btn--primary"
                  id="addCategoryBtn"
                  type="button"
                  onClick={handleAddCategoryClick}
                >
                  + Add Category
                </button>
                <button
                  className="btn btn--ghost"
                  id="refreshBtn"
                  type="button"
                  onClick={loadMenu}
                >
                  Reload Menu
                </button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="stats" id="stats">
              <div className="stat">
                <b>{categories.length}</b>
                <span>Categories</span>
              </div>
              <div className="stat">
                <b>{totalItems}</b>
                <span>Dishes</span>
              </div>
              <div className="stat">
                <b>{avgPrice}</b>
                <span>Avg. price ({cafe.currency || 'ETB'})</span>
              </div>
              <div className="stat">
                <b>{cafe.currency || 'ETB'}</b>
                <span>Currency</span>
              </div>
            </div>

            {/* Venue Profile Settings */}
            <VenueSettings cafe={cafe} onSaveCafe={handleSaveCafe} />

            {/* Table QR Studio */}
            <TableQrStudio cafeName={cafe.name} />

            {/* Categories & Dish Manager */}
            <CategoryDishManager
              categories={categories}
              currency={cafe.currency || 'ETB'}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onReorderCategories={handleReorderCategories}
              onAddDish={handleAddDishClick}
              onUpdateDish={handleUpdateDish}
              onDeleteDish={handleDeleteDish}
            />

            {/* Danger Zone: Reset to sample */}
            <div className="panel panel--danger">
              <h2 className="panel__title">Danger Zone</h2>
              <p className="hint">
                Restores the default sample menu (Burgers, Pizza, Coffee, Breakfast, Desserts, Drinks) and clears modifications.
              </p>
              <button
                className="btn btn--danger"
                id="resetBtn"
                type="button"
                onClick={handleResetSampleMenu}
              >
                Reset to Sample Menu
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Add Category & Dish Modal */}
      <AdminDishModal
        isOpen={modalOpen}
        mode={modalMode}
        data={modalData}
        categories={categories}
        targetCategoryId={targetCategoryId}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {/* Floating Toast Notification */}
      <div
        className={`toast ${toast ? `is-on ${toast.isBad ? 'is-bad' : ''}` : ''}`}
        id="toast"
        role="status"
        aria-live="polite"
      >
        {toast?.text}
      </div>
    </>
  );
}
