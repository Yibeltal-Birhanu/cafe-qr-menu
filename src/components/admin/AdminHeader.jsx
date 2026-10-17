import React, { useState } from 'react';
import { MenuIcon, SearchIcon, BellIcon, ChevronDownIcon } from './AdminIcons.jsx';

export default function AdminHeader({
  title = 'Dashboard',
  searchQuery = '',
  onSearchChange = null,
  searchPlaceholder = 'Search menu items, categories...',
  onLogout = null,
  onToggleSidebar = null,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        <h2 class="ad-page-title">{title}</h2>
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
            <div class="ad-avatar">A</div>
            <div class="ad-profile-info">
              <span class="ad-profile-name">Admin</span>
              <span class="ad-profile-role">Administrator</span>
            </div>
            <ChevronDownIcon size={14} style={{ color: '#6c757d' }} />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '180px',
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
              <a
                href="/abol-cafe"
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
