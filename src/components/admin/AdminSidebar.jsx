import React from 'react';
import { CoffeeIcon, HomeIcon, GridIcon, BookOpenIcon, SettingsIcon, QrCodeIcon } from './AdminIcons.jsx';

export default function AdminSidebar({ activeTab, onSelectTab, cafe }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon size={18} /> },
    { id: 'items', label: 'Menu Items', icon: <BookOpenIcon size={18} /> },
    { id: 'categories', label: 'Categories', icon: <GridIcon size={18} /> },
    { id: 'templates', label: 'QR Templates', icon: <QrCodeIcon size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <aside class="ad-sidebar" aria-label="Admin Navigation">
      {/* Brand Header */}
      <a href="/admin" class="ad-sidebar-brand">
        <span class="ad-sidebar-logo" aria-hidden="true">
          <CoffeeIcon size={24} />
        </span>
        <div style={{ overflow: 'hidden' }}>
          <h1 class="ad-sidebar-title" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {cafe?.name || 'CafeMenu'}
          </h1>
          <p class="ad-sidebar-sub" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {cafe?.tagline || 'Good Food • Great Moments'}
          </p>
        </div>
      </a>

      {/* Navigation List */}
      <nav class="ad-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            class={`ad-nav-item ${activeTab === item.id ? 'is-active' : ''}`}
            onClick={() => onSelectTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <span class="ad-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Footer & Watermark */}
      <div class="ad-sidebar-footer">
        <svg class="ad-sidebar-leaf-art" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M50 95 C50 50, 10 30, 20 5 C35 30, 60 40, 50 95 Z" />
          <path d="M50 95 C55 60, 90 40, 80 15 C65 40, 45 50, 50 95 Z" />
          <line x1="50" y1="95" x2="45" y2="25" />
          <line x1="48" y1="65" x2="30" y2="45" />
          <line x1="49" y1="50" x2="65" y2="35" />
        </svg>

        <div class="ad-sidebar-credits">
          <strong>CafeMenu Admin</strong>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
