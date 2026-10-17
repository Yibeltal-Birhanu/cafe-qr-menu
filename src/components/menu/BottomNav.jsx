import React from 'react';
import { HomeIcon, BookOpenIcon, InfoIcon } from '../common/Icons.jsx';

export default function BottomNav({ activeTab = 'home', onTabChange }) {
  return (
    <nav class="cm-bottom-nav" aria-label="Bottom Navigation">
      <button
        type="button"
        class={`cm-nav-item ${activeTab === 'home' ? 'is-active' : ''}`}
        onClick={() => onTabChange('home')}
        aria-label="Home"
      >
        <HomeIcon size={22} />
        <span>Home</span>
      </button>

      <button
        type="button"
        class={`cm-nav-item ${activeTab === 'menu' ? 'is-active' : ''}`}
        onClick={() => onTabChange('menu')}
        aria-label="Full Menu"
      >
        <BookOpenIcon size={22} />
        <span>Menu</span>
      </button>

      <button
        type="button"
        class={`cm-nav-item ${activeTab === 'details' ? 'is-active' : ''}`}
        onClick={() => onTabChange('details')}
        aria-label="Cafe Details and Info"
      >
        <InfoIcon size={22} />
        <span>Details</span>
      </button>
    </nav>
  );
}
