import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  EditIcon,
  CheckIcon,
  SearchIcon,
  UsersIcon,
  CoffeeIcon,
  BookOpenIcon,
  GlobeIcon,
} from './AdminIcons.jsx';

export default function SuperAdminDashboardView({
  apiCall,
  onShowToast,
  onSwitchCafe,
  currentCafeSlug = 'abol-cafe',
}) {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'suspended'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provisionData, setProvisionData] = useState({
    name: '',
    slug: '',
    tagline: 'Good Food • Great Moments',
    currency: 'ETB',
    phone: '',
    wifi_ssid: '',
    wifi_pass: '',
    template: 'seed',
    managerEmail: '',
    managerPassword: '',
    managerName: '',
  });

  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [selectedCafeForManager, setSelectedCafeForManager] = useState(null);
  const [managerData, setManagerData] = useState({
    managerEmail: '',
    managerPassword: '',
    managerName: '',
  });

  const [actionLoading, setActionLoading] = useState(false);

  // Load all platform cafes
  const loadCafes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/superadmin/cafes');
      setCafes(data.cafes || []);
    } catch (err) {
      if (onShowToast) onShowToast('Failed to load cafes: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onShowToast]);

  useEffect(() => {
    loadCafes();
  }, [loadCafes]);

  // Handle cafe provisioning
  const handleProvisionSubmit = async (e) => {
    e.preventDefault();
    if (!provisionData.name.trim() || !provisionData.slug.trim()) {
      if (onShowToast) onShowToast('Cafe name and slug are required.', true);
      return;
    }
    setActionLoading(true);
    try {
      const res = await apiCall('/api/superadmin/cafes', {
        method: 'POST',
        body: {
          name: provisionData.name.trim(),
          slug: provisionData.slug.trim().toLowerCase(),
          tagline: provisionData.tagline.trim(),
          currency: provisionData.currency.trim(),
          phone: provisionData.phone.trim(),
          wifi_ssid: provisionData.wifi_ssid.trim(),
          wifi_pass: provisionData.wifi_pass.trim(),
          template: provisionData.template,
          managerEmail: provisionData.managerEmail.trim(),
          managerPassword: provisionData.managerPassword.trim(),
          managerName: provisionData.managerName.trim(),
        },
      });

      if (onShowToast) {
        onShowToast(`Cafe "${res.cafe.name}" provisioned successfully!`);
      }
      setIsProvisionOpen(false);
      setProvisionData({
        name: '',
        slug: '',
        tagline: 'Good Food • Great Moments',
        currency: 'ETB',
        phone: '',
        wifi_ssid: '',
        wifi_pass: '',
        template: 'seed',
        managerEmail: '',
        managerPassword: '',
        managerName: '',
      });
      await loadCafes();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, true);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (cafe) => {
    const nextStatus = cafe.status === 'active' ? 'suspended' : 'active';
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}/status`, {
        method: 'PUT',
        body: { status: nextStatus },
      });
      if (onShowToast) onShowToast(`Cafe "${cafe.name}" is now ${nextStatus}!`);
      await loadCafes();
    } catch (err) {
      if (onShowToast) onShowToast('Failed to update status: ' + err.message, true);
    }
  };

  // Manager credentials update
  const handleOpenManagerModal = (cafe) => {
    setSelectedCafeForManager(cafe);
    setManagerData({
      managerEmail: cafe.managerEmail || '',
      managerPassword: '',
      managerName: cafe.managerName || `${cafe.name} Manager`,
    });
    setIsManagerModalOpen(true);
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    if (!managerData.managerEmail || !managerData.managerPassword) {
      if (onShowToast) onShowToast('Manager email and new password are required.', true);
      return;
    }
    setActionLoading(true);
    try {
      await apiCall(`/api/superadmin/cafes/${selectedCafeForManager.id}/manager`, {
        method: 'PUT',
        body: managerData,
      });
      if (onShowToast) onShowToast(`Manager credentials updated for "${selectedCafeForManager.name}"!`);
      setIsManagerModalOpen(false);
      await loadCafes();
    } catch (err) {
      if (onShowToast) onShowToast('Failed to update manager: ' + err.message, true);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete cafe
  const handleDeleteCafe = async (cafe) => {
    if (cafe.slug === 'abol-cafe') {
      if (onShowToast) onShowToast('Default platform cafe "abol-cafe" cannot be deleted.', true);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${cafe.name}" and all its menu items? This action cannot be undone.`)) {
      return;
    }
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}`, { method: 'DELETE' });
      if (onShowToast) onShowToast(`Cafe "${cafe.name}" deleted.`);
      await loadCafes();
    } catch (err) {
      if (onShowToast) onShowToast('Failed to delete cafe: ' + err.message, true);
    }
  };

  // Auto-fill slug from name
  const handleNameChange = (nameVal) => {
    const slugVal = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setProvisionData((prev) => ({
      ...prev,
      name: nameVal,
      slug: prev.slug === '' || prev.slug === slugify(prev.name) ? slugVal : prev.slug,
    }));
  };

  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Filter cafes
  const filteredCafes = cafes.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.slug && c.slug.toLowerCase().includes(q)) ||
      (c.managerEmail && c.managerEmail.toLowerCase().includes(q)) ||
      (c.managerName && c.managerName.toLowerCase().includes(q))
    );
  });

  const totalCafes = cafes.length;
  const activeCafes = cafes.filter((c) => c.status === 'active').length;
  const suspendedCafes = cafes.filter((c) => c.status === 'suspended').length;
  const totalDishes = cafes.reduce((sum, c) => sum + Number(c.dishCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Hero Platform Banner */}
      <div
        class="ad-hero-card"
        style={{
          background:
            'linear-gradient(to right, rgba(14, 20, 17, 0.96) 0%, rgba(14, 20, 17, 0.85) 55%, rgba(14, 20, 17, 0.4) 100%), url("/images/habesha.jpg") center/cover no-repeat',
          minHeight: '190px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              color: '#000000',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldIcon size={12} />
            <span>Super Admin Platform</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
            Multi-Tenant Management
          </span>
        </div>

        <h2 class="ad-hero-title">Platform Cafes &amp; Venues</h2>
        <p class="ad-hero-sub" style={{ maxWidth: '580px' }}>
          Provision new cafés, assign dedicated manager login credentials, monitor tenant metrics, and switch between venues.
        </p>

        <div class="ad-qr-feature-badges">
          <span class="ad-qr-feature-item">
            <GlobeIcon size={14} /> Multi-Tenant Scoped
          </span>
          <span class="ad-qr-feature-item">
            <ShieldIcon size={14} /> Better Auth Protected
          </span>
          <span class="ad-qr-feature-item">
            <CheckIcon size={14} /> MySQL Synchronized
          </span>
        </div>
      </div>

      {/* 2. Platform Metrics (4 Stat Cards) */}
      <div class="ad-stats-grid">
        <div class="ad-stat-card">
          <div class="ad-stat-icon ad-stat-icon--items">
            <CoffeeIcon size={20} />
          </div>
          <div class="ad-stat-value">{totalCafes}</div>
          <div class="ad-stat-label">Total Platform Venues</div>
          <div class="ad-stat-trend ad-stat-trend--up">
            <span>&bull;</span> Multi-tenant system
          </div>
        </div>

        <div class="ad-stat-card">
          <div class="ad-stat-icon ad-stat-icon--categories">
            <CheckIcon size={20} />
          </div>
          <div class="ad-stat-value">{activeCafes}</div>
          <div class="ad-stat-label">Active Venues</div>
          <div class="ad-stat-trend ad-stat-trend--up">
            <span>&#9650;</span> Live on public URLs
          </div>
        </div>

        <div class="ad-stat-card">
          <div class="ad-stat-icon ad-stat-icon--orders">
            <ShieldIcon size={20} />
          </div>
          <div class="ad-stat-value">{suspendedCafes}</div>
          <div class="ad-stat-label">Suspended Venues</div>
          <div class="ad-stat-trend" style={{ color: suspendedCafes > 0 ? '#ef4444' : '#6b7280' }}>
            <span>&bull;</span> {suspendedCafes > 0 ? 'Action required' : 'All running'}
          </div>
        </div>

        <div class="ad-stat-card">
          <div class="ad-stat-icon ad-stat-icon--visitors">
            <BookOpenIcon size={20} />
          </div>
          <div class="ad-stat-value">{totalDishes}</div>
          <div class="ad-stat-label">Total Platform Dishes</div>
          <div class="ad-stat-trend ad-stat-trend--up">
            <span>&bull;</span> Menu items cataloged
          </div>
        </div>
      </div>

      {/* 3. Platform Cafes Management Panel */}
      <div class="ad-panel-card" style={{ padding: '1.6rem' }}>
        <div
          class="ad-card-header"
          style={{
            marginBottom: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 class="ad-card-title">All Registered Cafes</h3>
            <p class="ad-card-sub">
              Manage client cafes, assign managers, toggle access, or switch into any cafe to edit its menu.
            </p>
          </div>

          <button
            type="button"
            class="ad-btn-add"
            onClick={() => setIsProvisionOpen(true)}
            style={{ padding: '0.65rem 1.4rem' }}
          >
            <PlusIcon size={16} />
            <span>Provision New Cafe</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.2rem',
          }}
        >
          <div class="ad-header-search" style={{ width: '280px' }}>
            <SearchIcon size={14} className="ad-header-search-icon" />
            <input
              type="text"
              class="ad-header-search-input"
              placeholder="Search cafe, slug, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div class="ad-filter-pills-row" role="tablist">
            <button
              type="button"
              class={`ad-filter-pill-btn ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({cafes.length})
            </button>
            <button
              type="button"
              class={`ad-filter-pill-btn ${filter === 'active' ? 'is-active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({activeCafes})
            </button>
            <button
              type="button"
              class={`ad-filter-pill-btn ${filter === 'suspended' ? 'is-active' : ''}`}
              onClick={() => setFilter('suspended')}
            >
              Suspended ({suspendedCafes})
            </button>
          </div>
        </div>

        {/* Cafes Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            Loading platform cafes...
          </div>
        ) : filteredCafes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table class="ad-table" style={{ width: '100%', minWidth: '700px' }}>
              <thead>
                <tr>
                  <th>Cafe &amp; URL Slug</th>
                  <th>Manager Credentials</th>
                  <th>Dishes</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCafes.map((cafe) => {
                  const isCurrent = currentCafeSlug === cafe.slug;
                  const liveUrl = cafe.slug === 'abol-cafe' ? '/abol-cafe' : `/cafe/${cafe.slug}`;

                  return (
                    <tr
                      key={cafe.id}
                      style={{
                        background: isCurrent ? 'rgba(16, 185, 129, 0.04)' : undefined,
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: '#142820',
                              color: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CoffeeIcon size={20} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <strong style={{ fontSize: '0.92rem', color: 'var(--ad-text-dark)' }}>
                                {cafe.name}
                              </strong>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    background: '#10b981',
                                    color: '#ffffff',
                                    padding: '1px 6px',
                                    borderRadius: '999px',
                                  }}
                                >
                                  Current
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              URL: <code style={{ color: '#065f46' }}>{liveUrl}</code>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {cafe.managerEmail ? (
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ad-text-dark)' }}>
                              {cafe.managerName || 'Manager'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                              {cafe.managerEmail}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td>
                        <span class="ad-tag-dish" style={{ background: '#f3f4f6', color: '#374151', fontWeight: 700 }}>
                          {cafe.dishCount || 0} items
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#13221e' }}>
                          {cafe.currency || 'ETB'}
                        </span>
                      </td>

                      <td>
                        <span
                          class={`ad-status-pill ${
                            cafe.status === 'active'
                              ? 'ad-status-pill--active'
                              : 'ad-status-pill--out'
                          }`}
                        >
                          {cafe.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          {/* Switch to this cafe button */}
                          <button
                            type="button"
                            class="ad-btn-action-primary"
                            onClick={() => onSwitchCafe(cafe.slug)}
                            style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', width: 'auto' }}
                            title="Edit this cafe's menu and settings"
                          >
                            Manage
                          </button>

                          {/* Open Live Menu */}
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            class="ad-btn-action-secondary"
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              width: 'auto',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                            title="View customer menu"
                          >
                            <EyeIcon size={14} />
                          </a>

                          {/* Toggle Status */}
                          <button
                            type="button"
                            class="ad-icon-action"
                            onClick={() => handleToggleStatus(cafe)}
                            title={cafe.status === 'active' ? 'Suspend cafe' : 'Activate cafe'}
                          >
                            <CheckIcon
                              size={15}
                              style={{ color: cafe.status === 'active' ? '#10b981' : '#9ca3af' }}
                            />
                          </button>

                          {/* Edit Manager Credentials */}
                          <button
                            type="button"
                            class="ad-icon-action"
                            onClick={() => handleOpenManagerModal(cafe)}
                            title="Set or reset manager credentials"
                          >
                            <UsersIcon size={15} />
                          </button>

                          {/* Delete Cafe (except default) */}
                          {cafe.slug !== 'abol-cafe' && (
                            <button
                              type="button"
                              class="ad-icon-action ad-icon-action--delete"
                              onClick={() => handleDeleteCafe(cafe)}
                              title="Delete cafe"
                            >
                              <TrashIcon size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#6b7280' }}>
            No cafes found matching "{searchQuery}".
          </div>
        )}
      </div>

      {/* 4. Provision New Cafe Modal */}
      {isProvisionOpen && (
        <div
          class="ad-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsProvisionOpen(false);
          }}
        >
          <div class="ad-modal-box" style={{ maxWidth: '600px' }}>
            <button
              type="button"
              class="ad-modal-close-btn"
              onClick={() => setIsProvisionOpen(false)}
            >
              &times;
            </button>

            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
              Provision New Cafe Tenant
            </h3>
            <p style={{ margin: '2px 0 1rem', fontSize: '0.82rem', color: '#6b7280' }}>
              Create an isolated café tenant and automatically configure its initial manager login credentials.
            </p>

            <form onSubmit={handleProvisionSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* Cafe Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label class="ad-field-label">Cafe Name *</label>
                    <input
                      type="text"
                      class="ad-form-input"
                      placeholder="e.g. Blue Nile Coffee & Bistro"
                      value={provisionData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label class="ad-field-label">URL Slug *</label>
                    <input
                      type="text"
                      class="ad-form-input"
                      placeholder="e.g. blue-nile"
                      value={provisionData.slug}
                      onChange={(e) =>
                        setProvisionData((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label class="ad-field-label">Currency</label>
                    <input
                      type="text"
                      class="ad-form-input"
                      placeholder="ETB"
                      value={provisionData.currency}
                      onChange={(e) =>
                        setProvisionData((prev) => ({ ...prev, currency: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label class="ad-field-label">Initial Menu Starter</label>
                    <select
                      class="ad-form-input"
                      value={provisionData.template}
                      onChange={(e) =>
                        setProvisionData((prev) => ({ ...prev, template: e.target.value }))
                      }
                    >
                      <option value="seed">Sample Menu (Habesha, Burgers, Pizza, Coffee)</option>
                      <option value="empty">Blank Slate (0 items)</option>
                    </select>
                  </div>
                </div>

                {/* Manager Account Section */}
                <div
                  style={{
                    background: '#f8faf9',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '1.1rem',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '0.9rem', fontWeight: 800, color: '#13221e' }}>
                    Manager User Credentials (Better Auth)
                  </h4>
                  <p style={{ margin: '0 0 0.8rem', fontSize: '0.75rem', color: '#6b7280' }}>
                    The manager uses these credentials to sign in and update their café menu.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <div>
                      <label class="ad-field-label">Manager Email *</label>
                      <input
                        type="email"
                        class="ad-form-input"
                        placeholder="manager@bluenile.com"
                        value={provisionData.managerEmail}
                        onChange={(e) =>
                          setProvisionData((prev) => ({ ...prev, managerEmail: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label class="ad-field-label">Manager Initial Password *</label>
                      <input
                        type="password"
                        class="ad-form-input"
                        placeholder="Password123!"
                        value={provisionData.managerPassword}
                        onChange={(e) =>
                          setProvisionData((prev) => ({ ...prev, managerPassword: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '0.8rem' }}>
                    <label class="ad-field-label">Manager Full Name</label>
                    <input
                      type="text"
                      class="ad-form-input"
                      placeholder="e.g. Solomon Haile"
                      value={provisionData.managerName}
                      onChange={(e) =>
                        setProvisionData((prev) => ({ ...prev, managerName: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.8rem',
                  marginTop: '1.4rem',
                  borderTop: '1px solid #eaedf1',
                  paddingTop: '1rem',
                }}
              >
                <button
                  type="button"
                  class="ad-btn-action-secondary"
                  onClick={() => setIsProvisionOpen(false)}
                  style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="ad-btn-action-primary"
                  disabled={actionLoading}
                  style={{ width: 'auto', padding: '0.65rem 1.6rem' }}
                >
                  <PlusIcon size={16} />
                  <span>{actionLoading ? 'Provisioning...' : 'Provision Cafe'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Manager Credentials Modal */}
      {isManagerModalOpen && selectedCafeForManager && (
        <div
          class="ad-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsManagerModalOpen(false);
          }}
        >
          <div class="ad-modal-box" style={{ maxWidth: '480px' }}>
            <button
              type="button"
              class="ad-modal-close-btn"
              onClick={() => setIsManagerModalOpen(false)}
            >
              &times;
            </button>

            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              Update Manager Credentials
            </h3>
            <p style={{ margin: '2px 0 1.2rem', fontSize: '0.82rem', color: '#6b7280' }}>
              Assign a new manager or reset password for <strong>{selectedCafeForManager.name}</strong>.
            </p>

            <form onSubmit={handleManagerSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label class="ad-field-label">Manager Email *</label>
                  <input
                    type="email"
                    class="ad-form-input"
                    value={managerData.managerEmail}
                    onChange={(e) =>
                      setManagerData((prev) => ({ ...prev, managerEmail: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label class="ad-field-label">New Password *</label>
                  <input
                    type="password"
                    class="ad-form-input"
                    placeholder="Enter new password..."
                    value={managerData.managerPassword}
                    onChange={(e) =>
                      setManagerData((prev) => ({ ...prev, managerPassword: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label class="ad-field-label">Manager Full Name</label>
                  <input
                    type="text"
                    class="ad-form-input"
                    value={managerData.managerName}
                    onChange={(e) =>
                      setManagerData((prev) => ({ ...prev, managerName: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.8rem',
                  marginTop: '1.4rem',
                  borderTop: '1px solid #eaedf1',
                  paddingTop: '1rem',
                }}
              >
                <button
                  type="button"
                  class="ad-btn-action-secondary"
                  onClick={() => setIsManagerModalOpen(false)}
                  style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="ad-btn-action-primary"
                  disabled={actionLoading}
                  style={{ width: 'auto', padding: '0.65rem 1.6rem' }}
                >
                  <span>{actionLoading ? 'Saving...' : 'Update Manager'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
