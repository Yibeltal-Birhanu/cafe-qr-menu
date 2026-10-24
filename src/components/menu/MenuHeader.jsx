import React from 'react';
import { CoffeeIcon, PizzaIcon, CakeIcon, FlameIcon, SearchIcon, ChevronLeftIcon } from '../common/Icons.jsx';

export default function MenuHeader({
  cafeName = 'CafeMenu',
  activeCategory = null,
  activeTab = 'home',
  onTabChange = null,
  onBack = null,
  onSearchClick = null,
  tableNumber = '',
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

  return (
    <>
      {activeCategory ? (
        /* Category View Header: < [Category Name] [Search] */
        <header className={`cm-category-nav-header cm-category-nav-header--${layout}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              className="cm-icon-btn"
              onClick={onBack}
              aria-label="Back to home"
            >
              <ChevronLeftIcon size={22} />
            </button>
            <h2 className="cm-category-nav-title">{activeCategory.name}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Desktop Navigation Links */}
            <nav className="cm-desktop-nav" aria-label="Desktop Navigation">
              <button
                type="button"
                className="cm-desktop-nav-link"
                onClick={onBack}
              >
                Home
              </button>
              <button
                type="button"
                className="cm-desktop-nav-link is-active"
                onClick={() => onTabChange && onTabChange('menu')}
              >
                Full Menu
              </button>
              <button
                type="button"
                className="cm-desktop-nav-link"
                onClick={() => onTabChange && onTabChange('details')}
              >
                Details &amp; Wi-Fi
              </button>
            </nav>

            <button
              type="button"
              className="cm-icon-btn"
              onClick={onSearchClick}
              aria-label="Search items"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </header>
      ) : (
        /* Home Header: Logo + CafeMenu + Table / Badge + Desktop Nav */
        <header className={`cm-header cm-header--${layout}`}>
          <div className="cm-brand-group">
            <span
              className="cm-welcome-logo"
              style={{ color: theme?.primaryColor || 'var(--cm-amber)' }}
              aria-hidden="true"
            >
              {renderLogo()}
            </span>
            <span className="cm-brand-name" id="cafeName">{cafeName}</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="cm-desktop-nav" aria-label="Desktop Navigation">
            <button
              type="button"
              className={`cm-desktop-nav-link ${activeTab === 'home' ? 'is-active' : ''}`}
              onClick={() => {
                if (onBack) onBack();
                if (onTabChange) onTabChange('home');
              }}
            >
              Home
            </button>
            <button
              type="button"
              className={`cm-desktop-nav-link ${activeTab === 'menu' ? 'is-active' : ''}`}
              onClick={() => onTabChange && onTabChange('menu')}
            >
              Full Menu
            </button>
            <button
              type="button"
              className={`cm-desktop-nav-link ${activeTab === 'details' ? 'is-active' : ''}`}
              onClick={() => onTabChange && onTabChange('details')}
            >
              Details &amp; Wi-Fi
            </button>
          </nav>

          <div className="cm-header-actions">
            {/* Digital Menu View Badge for test compliance and customer clarity */}
            <div className="menu-view-badge" id="menuViewBadge" style={{ margin: 0 }}>
              <span className="badge-dot"></span>
              <span id="menuViewBadgeText">Digital Menu</span>
            </div>

            {tableNumber ? (
              <div className={`cm-table-badge cm-table-badge--${layout}`} title={`Table ${tableNumber}`}>
                <span className="cm-badge-dot"></span>
                <span>Table #{tableNumber}</span>
              </div>
            ) : null}
          </div>
        </header>
      )}
    </>
  );
}
