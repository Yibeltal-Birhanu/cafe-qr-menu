import React, { useState } from 'react';
import { MenuIcon, SearchIcon, BellIcon, ChevronDownIcon, ShieldIcon } from './AdminIcons.jsx';

export default function AdminHeader({
  title = 'Dashboard',
  searchQuery = '',
  onSearchChange = null,
  searchPlaceholder = 'Search menu items, categories...',
  user = null,
  cafe = null,
  cafeSlug = 'abol-cafe',
  availableCafes = [],
  onSwitchCafe = null,
  onLogout = null,
  onToggleSidebar = null,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isSuperAdmin = user?.role === 'superadmin' || user?.id === 'legacy-admin';

  const displayName = user?.name || 'Admin';
  const displayRole = user?.role === 'superadmin' ? 'Super Admin' : (user?.role === 'manager' ? 'Cafe Manager' : 'Administrator');
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const currentSlug = cafeSlug || cafe?.slug || 'abol-cafe';
  const liveMenuUrl = currentSlug === 'abol-cafe' ? '/abol-cafe' : `/cafe/${currentSlug}`;

  return (
    <header className="ad-topbar">
      <div className="ad-topbar-left">
        <button
          type="button"
          className="ad-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon size={20} />
        </button>
        <h2 className="ad-page-title">{title}</h2>

        {/* Super Admin Cafe Switcher (only shown when multi-cafe super admin) */}
        {isSuperAdmin && availableCafes.length > 0 && (
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>Venue:</span>
            <select
              value={currentSlug}
              onChange={(e) => onSwitchCafe && onSwitchCafe(e.target.value)}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#111827',
                cursor: 'pointer'
              }}
              aria-label="Switch active cafe"
            >
              {availableCafes.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Global Search Pill */}
      {onSearchChange && (
        <div className="ad-search-pill">
          <span style={{ color: '#9ca3af', display: 'inline-flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="search"
            className="ad-search-pill-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search dashboard"
          />
        </div>
      )}

      {/* Right Actions: Notifications, Super Admin link & Profile */}
      <div className="ad-topbar-right">
        {/* Dedicated Super Admin Console button for super admins */}
        {isSuperAdmin && (
          <a
            href="/superadmin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.45rem 0.85rem',
              background: '#090d16',
              color: '#f59e0b',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title="Open dedicated Super Admin platform console"
          >
            <ShieldIcon size={14} />
            <span>Super Admin &nearr;</span>
          </a>
        )}

        {/* Quick link to live customer QR menu */}
        <a
          href={liveMenuUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '0.45rem 0.85rem',
            background: 'rgba(217, 119, 6, 0.1)',
            color: '#b45309',
            borderRadius: '8px',
            textDecoration: 'none',
            border: '1px solid rgba(217, 119, 6, 0.2)'
          }}
          title={`Open live menu for ${cafe?.name || currentSlug}`}
        >
          <span>Live Menu &nearr;</span>
        </a>

        <button type="button" className="ad-notify-btn" aria-label="Notifications">
          <BellIcon size={20} />
          <span className="ad-notify-dot" aria-hidden="true"></span>
        </button>

        <div style={{ position: 'relative' }}>
          <div
            className="ad-profile-dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="ad-avatar">{avatarInitial}</div>
            <div className="ad-profile-info">
              <span className="ad-profile-name">{displayName}</span>
              <span className="ad-profile-role">{displayRole}</span>
            </div>
            <ChevronDownIcon size={14} style={{ color: '#6c757d' }} />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '220px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #eaedf1',
                padding: '0.6rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {/* User Email & Cafe Info Header */}
              <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>{displayName}</div>
                {user?.email && (
                  <div style={{ fontSize: '0.74rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.email}
                  </div>
                )}
                <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>
                  Venue: {cafe?.name || currentSlug}
                </div>
              </div>

              {isSuperAdmin && (
                <a
                  href="/superadmin"
                  style={{
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#d97706',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ShieldIcon size={15} />
                  <span>Platform Console &nearr;</span>
                </a>
              )}

              <a
                href={liveMenuUrl}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  borderTop: '1px solid #f3f4f6',
                  marginTop: '4px',
                  paddingTop: '0.6rem',
                }}
              >
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
