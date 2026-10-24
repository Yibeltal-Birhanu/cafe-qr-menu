import React from 'react';
import { HomeIcon, BookOpenIcon, InfoIcon } from '../common/Icons.jsx';

export default function BottomNav({ activeTab = 'home', onTabChange, theme = null }) {
  const activeColor = theme?.primaryColor;

  return (
    <nav className="cm-bottom-nav" aria-label="Bottom Navigation">
      <button
        type="button"
        className={`cm-nav-item ${activeTab === 'home' ? 'is-active' : ''}`}
        onClick={() => onTabChange('home')}
        aria-label="Home"
        style={activeTab === 'home' && activeColor ? { color: activeColor } : {}}
      >
        <HomeIcon size={22} />
        <span>Home</span>
        {activeTab === 'home' && (
          <span
            className="cm-nav-dot"
            style={activeColor ? { backgroundColor: activeColor } : {}}
            aria-hidden="true"
          />
        )}
      </button>

      <button
        type="button"
        className={`cm-nav-item ${activeTab === 'menu' ? 'is-active' : ''}`}
        onClick={() => onTabChange('menu')}
        aria-label="Full Menu"
        style={activeTab === 'menu' && activeColor ? { color: activeColor } : {}}
      >
        <BookOpenIcon size={22} />
        <span>Menu</span>
        {activeTab === 'menu' && (
          <span
            className="cm-nav-dot"
            style={activeColor ? { backgroundColor: activeColor } : {}}
            aria-hidden="true"
          />
        )}
      </button>

      <button
        type="button"
        className={`cm-nav-item ${activeTab === 'details' ? 'is-active' : ''}`}
        onClick={() => onTabChange('details')}
        aria-label="Cafe Details and Info"
        style={activeTab === 'details' && activeColor ? { color: activeColor } : {}}
      >
        <InfoIcon size={22} />
        <span>Details</span>
        {activeTab === 'details' && (
          <span
            className="cm-nav-dot"
            style={activeColor ? { backgroundColor: activeColor } : {}}
            aria-hidden="true"
          />
        )}
      </button>
    </nav>
  );
}
