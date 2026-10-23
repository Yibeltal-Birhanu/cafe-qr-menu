import React from 'react';
import { CoffeeIcon, HomeIcon, GridIcon, BookOpenIcon, SettingsIcon, QrCodeIcon, ShieldIcon } from './AdminIcons.jsx';

export default function AdminSidebar({ activeTab, onSelectTab, cafe, currentUser }) {
  const isSuperAdmin = currentUser?.role === 'superadmin' || currentUser?.id === 'legacy-admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon size={18} /> },
    { id: 'items', label: 'Menu Items', icon: <BookOpenIcon size={18} /> },
    { id: 'categories', label: 'Categories', icon: <GridIcon size={18} /> },
    { id: 'templates', label: 'QR Templates', icon: <QrCodeIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <aside className="ad-sidebar" aria-label="Admin Navigation">
      {/* Brand Header */}
      <a href="/admin" className="ad-sidebar-brand">
        <span className="ad-sidebar-logo" aria-hidden="true">
          <CoffeeIcon size={24} />
        </span>
        <div style={{ overflow: 'hidden' }}>
          <h1 className="ad-sidebar-title" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {cafe?.name || 'CafeMenu'}
          </h1>
          <p className="ad-sidebar-sub" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {cafe?.tagline || 'Good Food • Great Moments'}
          </p>
        </div>
      </a>

      {/* Navigation List */}
      <nav className="ad-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`ad-nav-item ${activeTab === item.id ? 'is-active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <span className="ad-nav-icon">{item.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
          </button>
        ))}

        {/* Dedicated Super Admin Console Access Link */}
        {isSuperAdmin && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', padding: '0 0.75rem 0.5rem', fontWeight: 700 }}>
              Platform Owner
            </div>
            <a
              href="/superadmin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.06))',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#f59e0b',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.82rem',
                transition: 'all 0.2s ease',
              }}
              title="Open standalone Super Admin Platform Console"
            >
              <ShieldIcon size={18} />
              <span style={{ flex: 1 }}>Super Admin</span>
              <span style={{ fontSize: '0.85rem' }}>&nearr;</span>
            </a>
          </div>
        )}
      </nav>

      {/* Sidebar Footer & Watermark */}
      <div className="ad-sidebar-footer">
        <svg className="ad-sidebar-leaf-art" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M50 95 C50 50, 10 30, 20 5 C35 30, 60 40, 50 95 Z" />
          <path d="M50 95 C55 60, 90 40, 80 15 C65 40, 45 50, 50 95 Z" />
          <line x1="50" y1="95" x2="45" y2="25" />
          <line x1="48" y1="65" x2="30" y2="45" />
          <line x1="49" y1="50" x2="65" y2="35" />
        </svg>

        <div className="ad-sidebar-credits">
          <strong>CafeMenu Admin</strong>
          <span>v1.0.0 &bull; Manager</span>
        </div>
      </div>
    </aside>
  );
}
