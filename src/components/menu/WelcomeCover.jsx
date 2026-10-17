import React from 'react';
import { CoffeeIcon, ArrowRightIcon, WifiIcon, BatteryIcon } from '../common/Icons.jsx';

export default function WelcomeCover({ cafeName = 'CafeMenu', onStart }) {
  return (
    <div class="cm-welcome-screen" role="region" aria-label="Welcome screen">
      {/* iOS Status Bar */}
      <div class="cm-status-bar cm-status-bar--light" style={{ padding: '0 0 1rem 0' }}>
        <span>9:41</span>
        <div class="cm-status-icons">
          <WifiIcon size={14} />
          <BatteryIcon size={16} />
        </div>
      </div>

      {/* Brand Header */}
      <div class="cm-welcome-header">
        <span class="cm-welcome-logo" aria-hidden="true">
          <CoffeeIcon size={38} />
        </span>
        <h1 class="cm-welcome-brand">{cafeName}</h1>
        <span class="cm-welcome-tagline">Good Food &bull; Great Moments</span>
      </div>

      {/* Hero Welcome Message */}
      <div class="cm-welcome-body">
        <h2 class="cm-welcome-title">Scan. Browse. Enjoy.</h2>
        <p class="cm-welcome-sub">Explore our delicious menu and find your next favorite dish.</p>
        <button
          type="button"
          class="cm-welcome-btn"
          onClick={onStart}
          aria-label="View Menu"
        >
          <span>View Menu</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}
