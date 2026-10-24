import React from 'react';
import { getHeroBannerImage } from '../common/imageUtils.js';

export default function MenuHero({
  layout = 'bento',
  cafeName = 'CafeMenu',
  tagline = '',
  heroTitle = '',
  heroSub = '',
  heroImage = '',
  tableNumber = '',
}) {
  const displayTitle = heroTitle || cafeName || 'Welcome';
  const displaySub = heroSub || tagline || 'Explore our dishes and specialty drinks.';
  const optimizedHero = getHeroBannerImage(heroImage);
  const tableBadge = tableNumber ? (
    <span className="cm-hero-bento__chip cm-hero-bento__chip--table">
      Table #{tableNumber}
    </span>
  ) : null;

  // 1. BENTO HERO (Modern Bento Food App)
  if (layout === 'bento') {
    return (
      <div className="cm-hero-bento">
        <div className="cm-hero-bento__content">
          <h2 className="cm-hero-bento__title">{displayTitle}</h2>
          <p className="cm-hero-bento__sub">{displaySub}</p>
          {tableBadge && (
            <div className="cm-hero-bento__chips">
              {tableBadge}
            </div>
          )}
        </div>
        {optimizedHero ? (
          <div className="cm-hero-bento__media">
            <img
              src={optimizedHero}
              alt={displayTitle}
              className="cm-hero-bento__img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // 2. EDITORIAL HERO (Haute Cuisine Reserve Tasting Menu)
  if (layout === 'editorial') {
    return (
      <div className="cm-hero-editorial">
        <h2 className="cm-hero-editorial__title">
          {displayTitle}
        </h2>
        {optimizedHero && (
          <div className="cm-hero-editorial__media" style={{ margin: '1.2rem auto', borderRadius: '12px', overflow: 'hidden', maxHeight: '220px', maxWidth: '520px', border: '1px solid var(--cm-secondary, #d4af37)' }}>
            <img
              src={optimizedHero}
              alt={displayTitle}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
              decoding="async"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="cm-hero-editorial__divider" aria-hidden="true"></div>
        <p className="cm-hero-editorial__sub">
          {displaySub}
        </p>
        {tableNumber && (
          <div className="cm-hero-editorial__badges">
            <span className="cm-hero-editorial__badge">TABLE #{tableNumber}</span>
          </div>
        )}
      </div>
    );
  }

  // 3. RUSTIC HERO (Wood-Fired Hearth & Open Grill)
  if (layout === 'rustic') {
    return (
      <div className="cm-hero-rustic">
        <div className="cm-hero-rustic__content">
          <h2 className="cm-hero-rustic__title">
            {displayTitle}
          </h2>
          <p className="cm-hero-rustic__sub">
            {displaySub}
          </p>
          {tableNumber && (
            <div className="cm-hero-rustic__chips">
              <span className="cm-hero-rustic__chip cm-hero-rustic__chip--table">TABLE #{tableNumber}</span>
            </div>
          )}
        </div>
        {optimizedHero ? (
          <div className="cm-hero-rustic__media">
            <img
              src={optimizedHero}
              alt={displayTitle}
              className="cm-hero-rustic__img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // 4. BOUTIQUE HERO (Parisian Patisserie & Bakery)
  if (layout === 'boutique') {
    return (
      <div className="cm-hero-boutique">
        <div className="cm-hero-boutique__content">
          <h2 className="cm-hero-boutique__title">
            {displayTitle}
          </h2>
          <p className="cm-hero-boutique__sub">
            {displaySub}
          </p>
          {tableNumber && (
            <div className="cm-hero-boutique__chips">
              <span className="cm-hero-boutique__chip cm-hero-boutique__chip--table">TABLE #{tableNumber}</span>
            </div>
          )}
        </div>
        {optimizedHero ? (
          <div className="cm-hero-boutique__media">
            <img
              src={optimizedHero}
              alt={displayTitle}
              className="cm-hero-boutique__img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // 5. NOIR HERO (Evening Lounge & Cocktail Bar)
  if (layout === 'noir') {
    return (
      <div className="cm-hero-noir">
        <div className="cm-hero-noir__content">
          <h2 className="cm-hero-noir__title">
            {displayTitle}
          </h2>
          <p className="cm-hero-noir__sub">
            {displaySub}
          </p>
          {tableNumber && (
            <div className="cm-hero-noir__chips">
              <span className="cm-hero-noir__chip cm-hero-noir__chip--table">TABLE #{tableNumber}</span>
            </div>
          )}
        </div>
        {optimizedHero ? (
          <div className="cm-hero-noir__media">
            <img
              src={optimizedHero}
              alt={displayTitle}
              className="cm-hero-noir__img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  // 6. MINIMAL HERO (Seasonal Kitchen & Concept Cafe)
  return (
    <div className="cm-hero-minimal">
      <div className="cm-hero-minimal__content">
        <h2 className="cm-hero-minimal__title">
          {displayTitle}
        </h2>
        <p className="cm-hero-minimal__sub">
          {displaySub}
        </p>
        {tableNumber && (
          <div className="cm-hero-minimal__chips">
            <span className="cm-hero-minimal__chip cm-hero-minimal__chip--table">Table #{tableNumber}</span>
          </div>
        )}
      </div>
      {optimizedHero ? (
        <div className="cm-hero-minimal__media">
          <img
            src={optimizedHero}
            alt={displayTitle}
            className="cm-hero-minimal__img"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
