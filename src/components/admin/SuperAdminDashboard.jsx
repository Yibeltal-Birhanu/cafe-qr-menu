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
} from './AdminIcons.jsx';

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

  // Modal State for New Cafe
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const loadCafes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiCall('/api/superadmin/cafes');
      setCafes(data.cafes || []);
    } catch (err) {
      if (onShowToast) onShowToast(`Failed to load cafes: ${err.message}`, true);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, onShowToast]);

  useEffect(() => {
    loadCafes();
  }, [loadCafes]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalCafes = cafes.length;
    const activeCafes = cafes.filter((c) => c.status === 'active').length;
    const totalDishes = cafes.reduce((acc, c) => acc + (Number(c.dishCount) || 0), 0);
    const totalCategories = cafes.reduce((acc, c) => acc + (Number(c.categoryCount) || 0), 0);
    const totalManagers = cafes.filter((c) => Boolean(c.managerEmail)).length;
    return { totalCafes, activeCafes, totalDishes, totalCategories, totalManagers };
  }, [cafes]);

  // Filtered cafes
  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      const matchesSearch =
        !searchQuery.trim() ||
        cafe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.managerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || cafe.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cafes, searchQuery, statusFilter]);

  // Slug generator helper
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
      if (onShowToast) onShowToast(`Updated status for "${cafe.name}" to ${nextStatus}.`);
    } catch (err) {
      if (onShowToast) onShowToast(`Status update failed: ${err.message}`, true);
    }
  };

  const handleDeleteCafe = async (cafe) => {
    if (!window.confirm(`Are you sure you want to completely remove "${cafe.name}" (${cafe.slug}) and all its dishes?`)) {
      return;
    }
    try {
      await apiCall(`/api/superadmin/cafes/${cafe.id}`, { method: 'DELETE' });
      setCafes((prev) => prev.filter((c) => c.id !== cafe.id));
      if (onShowToast) onShowToast(`Cafe "${cafe.name}" has been deleted.`);
    } catch (err) {
      if (onShowToast) onShowToast(`Delete failed: ${err.message}`, true);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      if (onShowToast) onShowToast('Cafe name and slug are required.', true);
      return;
    }
    setIsSubmitting(true);
    try {
      await apiCall('/api/superadmin/cafes', {
        method: 'POST',
        body: formData,
      });
      if (onShowToast) onShowToast(`Cafe "${formData.name}" created successfully!`);
      setIsModalOpen(false);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {/* 1. Hero Header */}
      <div
        className="ad-hero-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(14, 20, 17, 0.96) 0%, rgba(20, 36, 28, 0.92) 55%, rgba(245, 158, 11, 0.15) 100%)',
          minHeight: '170px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#fbbf24' }}>
                <ShieldIcon size={22} />
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#fbbf24',
                }}
              >
                Super Administrator
              </span>
            </div>
            <h2 className="ad-hero-title" style={{ fontSize: '1.8rem' }}>
              Platform Multi-Tenant Hub
            </h2>
            <p className="ad-hero-sub" style={{ maxWidth: '620px' }}>
              Manage all registered cafes, provision manager credentials, inspect menu volumes, and customize individual tenant identities.
            </p>
          </div>

          <button
            type="button"
            className="ad-btn-action-primary"
            onClick={() => setIsModalOpen(true)}
            style={{ width: 'auto', padding: '0.75rem 1.4rem', fontSize: '0.88rem' }}
          >
            <PlusIcon size={16} />
            <span>Create New Cafe &amp; Manager</span>
          </button>
        </div>
      </div>

      {/* 2. Platform KPI Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.2rem',
        }}
      >
        <div className="ad-panel-card" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Total Platform Cafes</span>
            <CoffeeIcon size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>
            {stats.totalCafes}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '4px' }}>
            {stats.activeCafes} Active / {stats.totalCafes - stats.activeCafes} Suspended
          </div>
        </div>

        <div className="ad-panel-card" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Dishes Across Platform</span>
            <BookOpenIcon size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>
            {stats.totalDishes}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '4px' }}>
            In {stats.totalCategories} total categories
          </div>
        </div>

        <div className="ad-panel-card" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Provisioned Managers</span>
            <UsersIcon size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827' }}>
            {stats.totalManagers}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#6b7280', marginTop: '4px' }}>
            Dedicated Better Auth accounts
          </div>
        </div>

        <div className="ad-panel-card" style={{ padding: '1.2rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <span>Active Platform Status</span>
            <CheckIcon size={18} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
            100%
          </div>
          <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '4px' }}>
            All systems operational
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div
        className="ad-panel-card"
        style={{
          padding: '1rem 1.4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          <SearchIcon size={16} style={{ color: '#9ca3af' }} />
          <input
            type="text"
            className="ad-form-input"
            placeholder="Search by cafe name, slug, or manager email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '0.4rem 0', boxShadow: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'active', 'suspended'].map((status) => (
            <button
              key={status}
              type="button"
              className={`ad-currency-btn ${statusFilter === status ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(status)}
              style={{ textTransform: 'capitalize' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Cafes Directory Table */}
      <div className="ad-panel-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="ad-card-title" style={{ margin: 0, fontSize: '1.1rem' }}>
            Registered Venues ({filteredCafes.length})
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Click &ldquo;Manage&rdquo; to switch context to that cafe
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8faf9', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontWeight: 600 }}>
                <th style={{ padding: '0.9rem 1.4rem' }}>Cafe &amp; Slug</th>
                <th style={{ padding: '0.9rem 1rem' }}>Manager Account</th>
                <th style={{ padding: '0.9rem 1rem' }}>Menu Catalog</th>
                <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                <th style={{ padding: '0.9rem 1.4rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                    Loading platform venues...
                  </td>
                </tr>
              ) : filteredCafes.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                    No cafes found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCafes.map((cafe) => {
                  const isAbol = cafe.slug === 'abol-cafe';
                  const liveUrl = isAbol ? '/abol-cafe' : `/cafe/${cafe.slug}`;
                  const qrUrl = isAbol ? '/qr.png' : `/api/${cafe.slug}/qr.png`;

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
                      <td style={{ padding: '1rem 1.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#fef3c7',
                              color: '#d97706',
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                            }}
                          >
                            {cafe.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>
                              {cafe.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#6b7280', fontFamily: 'monospace' }}>
                              /{cafe.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        {cafe.managerEmail ? (
                          <div>
                            <div style={{ fontWeight: 600, color: '#1f2937' }}>
                              {cafe.managerName || 'Manager'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {cafe.managerEmail}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                            }}
                          >
                            {cafe.dishCount || 0} dishes
                          </span>
                          <span
                            style={{
                              background: '#f3f4f6',
                              color: '#4b5563',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                            }}
                          >
                            {cafe.categoryCount || 0} categories
                          </span>
                        </div>
                      </td>

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

                      <td style={{ padding: '1rem 1.4rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="ad-btn-action-primary"
                            onClick={() => onSwitchCafe(cafe.slug)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.76rem',
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
                            title="View Customer Digital Menu"
                            style={{
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.76rem',
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
                            title="Download / View QR Code"
                            style={{
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.76rem',
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
                              title="Delete Cafe"
                              style={{
                                background: 'transparent',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                borderRadius: '8px',
                                padding: '0.4rem 0.55rem',
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

      {/* 5. Create New Cafe & Provision Manager Modal */}
      {isModalOpen && (
        <div className="ad-modal-overlay" style={{ display: 'grid', placeItems: 'center', zIndex: 10000 }}>
          <div
            className="ad-panel-card"
            style={{
              width: '92%',
              maxWidth: '600px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <div>
                <h3 className="ad-card-title" style={{ margin: 0, fontSize: '1.25rem' }}>
                  Create New Cafe &amp; Manager
                </h3>
                <p className="ad-card-sub" style={{ margin: '4px 0 0' }}>
                  Deploy a new digital menu instance and provision manager credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
              {/* Cafe Details */}
              <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.9rem', color: '#111827', fontWeight: 700 }}>
                  Venue Profile
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                  <div>
                    <label className="ad-field-label">Cafe Name *</label>
                    <input
                      type="text"
                      className="ad-form-input"
                      placeholder="e.g. Sunset Bistro"
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
                      placeholder="e.g. sunset-bistro"
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
                    placeholder="e.g. Fresh roasts &amp; artisan pastries"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginTop: '0.8rem' }}>
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
                    <label className="ad-field-label">Starter Menu Template</label>
                    <select
                      className="ad-form-input"
                      value={formData.template}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    >
                      <option value="seed">Seed Sample Menu (Burgers, Coffee, etc.)</option>
                      <option value="empty">Empty Catalog (Start Fresh)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Manager Credentials */}
              <div>
                <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.9rem', color: '#111827', fontWeight: 700 }}>
                  Manager Account (Better Auth)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
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
                      placeholder="e.g. manager@sunset.com"
                      value={formData.managerEmail}
                      onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.8rem' }}>
                  <label className="ad-field-label">Manager Initial Password *</label>
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="ad-btn-action-secondary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ width: 'auto', padding: '0.65rem 1.2rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ad-btn-action-primary"
                  disabled={isSubmitting}
                  style={{ width: 'auto', padding: '0.65rem 1.6rem' }}
                >
                  {isSubmitting ? 'Creating...' : 'Deploy Cafe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
