import React from 'react';
import { CoffeeIcon, GlobeIcon, VolumeOnIcon, VolumeMuteIcon, SearchIcon } from '../common/Icons.jsx';
import { t } from './translations.js';

export default function MenuTopbar({
  cafe = {},
  lang = 'en',
  sound = true,
  searchQuery = '',
  onSearchChange,
  onToggleLang,
  onToggleSound,
}) {
  return (
    <header className="topbar">
      <div className="wrap topbar__inner">
        <a className="brand" href="/cafe">
          <span className="brand__logo" id="cafeLogo" aria-hidden="true">
            <CoffeeIcon size={22} />
          </span>
          <span className="brand__text">
            <span className="brand__name" id="cafeName">
              {cafe.name || 'Cafe'}
            </span>
            <span className="brand__tag" id="cafeTagline">
              {cafe.tagline || t('tagline', lang)}
            </span>
          </span>
        </a>

        {/* Digital Menu View Badge */}
        <div className="menu-view-badge" id="menuViewBadge">
          <span className="badge-dot" />
          <span id="menuViewBadgeText">{t('menuViewBadge', lang)}</span>
        </div>

        <label className="search">
          <span className="search__icon" aria-hidden="true">
            <SearchIcon size={16} />
          </span>
          <input
            id="search"
            type="search"
            placeholder={t('searchPlaceholder', lang)}
            autoComplete="off"
            aria-label="Search the menu"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </label>

        <div className="topbar-actions">
          {/* Language Switcher */}
          <button
            className="lang-btn"
            id="langBtn"
            type="button"
            title="Switch language / ቋንቋ ይቀይሩ"
            aria-label="Toggle language"
            onClick={onToggleLang}
          >
            <span className="lang-btn__globe" aria-hidden="true">
              <GlobeIcon size={15} />
            </span>
            <span className="lang-btn__label" id="langLabel">
              {t('langLabel', lang)}
            </span>
          </button>

          {/* Sound effects toggle */}
          <button
            className="icon-btn"
            id="soundBtn"
            type="button"
            title="Toggle audio sound effects"
            aria-label="Toggle sound"
            onClick={onToggleSound}
          >
            <span id="soundIcon" aria-hidden="true">
              {sound ? <VolumeOnIcon size={16} /> : <VolumeMuteIcon size={16} />}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export { MenuTopbar };
