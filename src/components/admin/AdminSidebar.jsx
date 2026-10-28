import React from 'react';
import {
  CoffeeIcon,
  HomeIcon,
  GridIcon,
  BookOpenIcon,
  SettingsIcon,
  QrCodeIcon,
  ShieldIcon,
  CloseIcon,
} from './AdminIcons.jsx';

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  cafe,
  currentUser,
  isOpen = false,
  onClose = null,
}) {
  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.id === 'legacy-admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon size={18} /> },
    { id: 'items', label: 'Menu Items', icon: <BookOpenIcon size={18} /> },
    { id: 'categories', label: 'Categories', icon: <GridIcon size={18} /> },
    { id: 'templates', label: 'QR Templates', icon: <QrCodeIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  const handleItemClick = (id) => {
    onSelectTab(id);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`ad-sidebar ${isOpen ? 'is-open' : ''}`}
      aria-label="Admin Navigation"
      role="navigation"
    >
      {/* Brand Header */}
      <div className="ad-sidebar-header">
        <a
          href="/admin"
          className="ad-sidebar-brand"
          onClick={() => onClose && onClose()}
          title={cafe?.name || 'CafeMenu'}
        >
          <div className="ad-sidebar-logo" aria-hidden="true">
            <CoffeeIcon size={22} />
          </div>
          <div className="ad-sidebar-brand-meta">
            <h1 className="ad-sidebar-title">
              {cafe?.name || 'CafeMenu'}
            </h1>
            <p className="ad-sidebar-sub">
              {cafe?.tagline || 'Good Food • Great Moments'}
            </p>
          </div>
        </a>

        {onClose && (
          <button
            type="button"
            className="ad-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar navigation"
            title="Close navigation"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="ad-nav">
        <div className="ad-nav-list">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`ad-nav-item ${isActive ? 'is-active' : ''}`}
                onClick={() => handleItemClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="ad-nav-icon">{item.icon}</span>
                <span className="ad-nav-label">{item.label}</span>
                {isActive && <span className="ad-nav-indicator" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {/* Dedicated Super Admin Console Access Link */}
        {isSuperAdmin && (
          <div className="ad-sidebar-owner-section">
            <div className="ad-sidebar-owner-label">
              Platform Owner
            </div>
            <a
              href="/superadmin"
              className="ad-sidebar-owner-link"
              onClick={() => onClose && onClose()}
              title="Open standalone Super Admin Platform Console"
            >
              <span className="ad-sidebar-owner-icon">
                <ShieldIcon size={18} />
              </span>
              <span className="ad-sidebar-owner-text">Super Admin</span>
              <span className="ad-sidebar-owner-arrow" aria-hidden="true">&nearr;</span>
            </a>
          </div>
        )}
      </nav>

      {/* Sidebar Footer & Watermark */}
      <div className="ad-sidebar-footer">
        <svg
          className="ad-sidebar-leaf-art"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M50 95 C50 50, 10 30, 20 5 C35 30, 60 40, 50 95 Z" />
          <path d="M50 95 C55 60, 90 40, 80 15 C65 40, 45 50, 50 95 Z" />
          <line x1="50" y1="95" x2="45" y2="25" />
          <line x1="48" y1="65" x2="30" y2="45" />
          <line x1="49" y1="50" x2="65" y2="35" />
        </svg>

        <div className="ad-sidebar-credits">
          <strong className="ad-sidebar-credits-title">CafeMenu Admin</strong>
          <span className="ad-sidebar-credits-version">v1.0.0 &bull; Manager</span>
        </div>
      </div>
    </aside>
  );
}
