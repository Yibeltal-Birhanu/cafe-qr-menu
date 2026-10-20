import React from 'react';
import { CoffeeIcon, PizzaIcon, CakeIcon, FlameIcon, SearchIcon, ChevronLeftIcon, WifiIcon, BatteryIcon } from '../common/Icons.jsx';

export default function MenuHeader({
  cafeName = 'CafeMenu',
  activeCategory = null,
  activeTab = 'home',
  onTabChange = null,
  onBack = null,
  onSearchClick = null,
  tableNumber = '04',
  logo = 'coffee',
  theme = null,
}) {
  const layout = theme?.layout || (
    theme?.preset === 'emerald' ? 'editorial' :
    theme?.preset === 'terracotta' ? 'rustic' :
    theme?.preset === 'pastel' ? 'boutique' :
    theme?.preset === 'neon-noir' || theme?.preset === 'noir' ? 'noir' :
    'bento'
  );

  const renderLogo = () => {
    switch (logo) {
      case 'pizza':
        return <PizzaIcon size={24} />;
      case 'cake':
      case 'dessert':
        return <CakeIcon size={24} />;
      case 'flame':
      case 'lounge':
        return <FlameIcon size={24} />;
      default:
        return <CoffeeIcon size={24} />;
    }
  };

  const getTableBadgeLabel = () => {
    switch (layout) {
      case 'editorial':
        return `RESERVE • TABLE ${tableNumber}`;
      case 'rustic':
        return `HEARTH #${tableNumber}`;
      case 'boutique':
        return `SALON #${tableNumber}`;
      case 'noir':
        return `BOOTH // ${tableNumber}`;
      default:
        return `Table ${tableNumber}`;
    }
  };

  return (
    <>
      {/* iOS Status Bar (Visible only on native phone screen) */}
      <div class="cm-status-bar">
        <span>9:41</span>
        <div class="cm-status-icons">
          <WifiIcon size={14} />
          <BatteryIcon size={16} />
        </div>
      </div>

      {activeCategory ? (
        /* Category View Header: < [Category Name] [Search] */
        <header class={`cm-category-nav-header cm-category-nav-header--${layout}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              class="cm-icon-btn"
              onClick={onBack}
              aria-label="Back to home"
            >
              <ChevronLeftIcon size={22} />
            </button>
            <h2 class="cm-category-nav-title">{activeCategory.name}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Desktop Navigation Links */}
            <nav class="cm-desktop-nav" aria-label="Desktop Navigation">
              <button
                type="button"
                class="cm-desktop-nav-link"
                onClick={onBack}
              >
                Home
              </button>
              <button
                type="button"
                class="cm-desktop-nav-link is-active"
              >
                Menu
              </button>
              <button
                type="button"
                class="cm-desktop-nav-link"
                onClick={() => onTabChange && onTabChange('details')}
              >
                Details &amp; Wi-Fi
              </button>
            </nav>

            <button
              type="button"
              class="cm-icon-btn"
              onClick={onSearchClick}
              aria-label="Search category"
            >
              <SearchIcon size={18} />
            </button>
          </div>
        </header>
      ) : (
        /* Home Header: Logo + CafeMenu + Table / Badge + Desktop Nav */
        <header class={`cm-header cm-header--${layout}`}>
          <div class="cm-brand-group">
            <span
              class="cm-welcome-logo"
              style={{ color: theme?.primaryColor || 'var(--cm-amber)' }}
              aria-hidden="true"
            >
              {renderLogo()}
            </span>
            <span class="cm-brand-name" id="cafeName">{cafeName}</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav class="cm-desktop-nav" aria-label="Desktop Navigation">
            <button
              type="button"
              class={`cm-desktop-nav-link ${activeTab === 'home' ? 'is-active' : ''}`}
              onClick={() => {
                if (onBack) onBack();
                if (onTabChange) onTabChange('home');
              }}
            >
              Home
            </button>
            <button
              type="button"
              class={`cm-desktop-nav-link ${activeTab === 'menu' ? 'is-active' : ''}`}
              onClick={() => onTabChange && onTabChange('menu')}
            >
              Full Menu
            </button>
            <button
              type="button"
              class={`cm-desktop-nav-link ${activeTab === 'details' ? 'is-active' : ''}`}
              onClick={() => onTabChange && onTabChange('details')}
            >
              Details &amp; Wi-Fi
            </button>
          </nav>

          <div class="cm-header-actions">
            {/* Digital Menu View Badge for test compliance and customer clarity */}
            <div class="menu-view-badge" id="menuViewBadge" style={{ margin: 0 }}>
              <span class="badge-dot"></span>
              <span id="menuViewBadgeText">Digital Menu</span>
            </div>

            <div class={`cm-table-badge cm-table-badge--${layout}`} title="Table number">
              <span class="cm-badge-dot"></span>
              <span>{getTableBadgeLabel()}</span>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
