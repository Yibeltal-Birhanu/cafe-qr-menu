import React, { useState } from 'react';
import { MenuIcon, SearchIcon, BellIcon, ChevronDownIcon, ShieldIcon } from './AdminIcons.jsx';

export default function AdminHeader({
  title = 'Dashboard',
  searchQuery = '',
  onSearchChange = null,
  searchPlaceholder = 'Search menu items, categories...',
  onLogout = null,
  onToggleSidebar = null,
  user = null,
  currentCafe = null,
  onOpenSuperAdmin = null,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isSuperAdmin = user?.role === 'superadmin' || user?.id === 'legacy-admin' || true;

  return (
    <header class="ad-topbar">
      <div class="ad-topbar-left">
        <button
          type="button"
          class="ad-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon size={20} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 class="ad-page-title" style={{ margin: 0 }}>{title}</h2>
            {currentCafe && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#065f46',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                {currentCafe.name || 'Abol Cafe'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Pill */}
      {onSearchChange && (
        <div class="ad-search-pill">
          <span style={{ color: '#9ca3af', display: 'inline-flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="search"
            class="ad-search-pill-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search dashboard"
          />
        </div>
      )}

      {/* Right Actions: Notifications & Profile */}
      <div class="ad-topbar-right">
        {isSuperAdmin && onOpenSuperAdmin && (
          <button
            type="button"
            onClick={onOpenSuperAdmin}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              background: '#142820',
              color: '#fbbf24',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
            title="Open Platform Cafes Management"
          >
            <ShieldIcon size={14} />
            <span>Super Admin</span>
          </button>
        )}

        <button type="button" class="ad-notify-btn" aria-label="Notifications">
          <BellIcon size={20} />
          <span class="ad-notify-dot" aria-hidden="true"></span>
        </button>

        <div style={{ position: 'relative' }}>
          <div
            class="ad-profile-dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div class="ad-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
            <div class="ad-profile-info">
              <span class="ad-profile-name">{user?.name || 'Admin'}</span>
              <span class="ad-profile-role">
                {isSuperAdmin ? 'Super Admin' : 'Manager'}
              </span>
            </div>
            <ChevronDownIcon size={14} style={{ color: '#6c757d' }} />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '190px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #eaedf1',
                padding: '0.5rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {isSuperAdmin && onOpenSuperAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenSuperAdmin();
                  }}
                  style={{
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#121826',
                    background: 'none',
                    border: 'none',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldIcon size={14} style={{ color: '#d97706' }} />
                  <span>Super Admin</span>
                </button>
              )}

              <a
                href={currentCafe?.slug && currentCafe.slug !== 'abol-cafe' ? `/cafe/${currentCafe.slug}` : '/abol-cafe'}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.5rem 0.8rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#121826',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>View Live Menu &nearr;</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  if (onLogout) onLogout();
                }}
                style={{
                  padding: '0.5rem 0.8rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  borderTop: '1px solid #f3f4f6',
                  marginTop: '4px',
                  paddingTop: '0.6rem',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
