import React from 'react';
import { HomeIcon, UtensilsCrossedIcon, InfoIcon } from '../common/Icons.jsx';

export default function BottomNav({ activeTab = 'home', onTabChange, theme = null }) {
  const activeColor = theme?.primaryColor || '#84A98C';

  const tabs = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'menu', label: 'Menu', Icon: UtensilsCrossedIcon },
    { id: 'details', label: 'Info', Icon: InfoIcon },
  ];

  return (
    <div className="cm-bottom-dock" aria-label="Navigation dock">
      <nav className="cm-glass-nav glass-effect" aria-label="Bottom Navigation">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              className={`cm-glass-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => onTabChange(id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`cm-glass-tab-icon ${isActive ? 'is-active' : ''}`}
                style={isActive && activeColor ? { backgroundColor: `${activeColor}20`, color: activeColor } : undefined}
              >
                <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className="cm-glass-tab-label"
                style={isActive && activeColor ? { color: activeColor } : undefined}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
