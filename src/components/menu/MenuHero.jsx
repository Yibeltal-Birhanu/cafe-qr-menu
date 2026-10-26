import React, { useState } from 'react';
import {
  getHeroBannerImage,
  getHeroBannerSrcSet,
  getHeroBannerSizes,
} from '../common/imageUtils.js';

export default function MenuHero({
  layout = 'bento',
  cafeName = 'CafeMenu',
  tagline = '',
  heroTitle = '',
  heroSub = '',
  heroImage = '',
  tableNumber = '',
  cafeSlug = 'abol-cafe',
  cafeCity = '',
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedHero = getHeroBannerImage(heroImage);
  const heroSrcSet = getHeroBannerSrcSet(heroImage);
  const heroSizes = getHeroBannerSizes(layout);

  // Helper to highlight the last word in titles when custom title is provided
  const renderDuoTitle = (titleText, highlightClass = '') => {
    if (!titleText) return null;
    const words = titleText.trim().split(' ');
    if (words.length <= 1) return titleText;
    const main = words.slice(0, -1).join(' ');
    const last = words[words.length - 1];
    return (
      <>
        {main} <span className={highlightClass}>{last}</span>
      </>
    );
  };

  // =========================================================================
  // 1. EDITORIAL RESERVE: "LA BELLA TRATTORIA"
  // Layout Architecture: Left Image, Right Text (Classic Editorial Spread)
  // Warm parchment canvas, Italian serif, olive flourish, ceramic plate
  // =========================================================================
  if (layout === 'editorial') {
    const brandTitle = cafeName && cafeName !== 'CafeMenu' ? cafeName : 'LA BELLA TRATTORIA';
    const locationStr = cafeCity || (cafeName.toLowerCase().includes('abol') ? 'Addis Ababa, Ethiopia' : 'Rome, Italy');
    const displayHeading = heroTitle || 'Taste Italy, one scan away';
    const displayLead = heroSub || tagline || 'Authentic recipes. Timeless flavors. Now just a scan away.';

    return (
      <div className="cm-hero-full cm-hero--editorial">
        <div className="cm-hero__container cm-hero__container--split-img-left">
          {/* Left Column: Image Staging */}
          <div className="cm-hero__col-visual">
            {optimizedHero && !hasError ? (
              <div className={`cm-hero__stage cm-hero__stage--editorial ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
                <img
                  src={optimizedHero}
                  srcSet={heroSrcSet}
                  sizes={heroSizes}
                  alt={displayHeading}
                  className={`cm-hero__img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setHasError(true)}
                />
                <div className="cm-hero__badge cm-hero__badge--editorial">
                  <span>🌿</span> Chef's Handcrafted Special
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Editorial Masthead Text */}
          <div className="cm-hero__col-text">
            <div className="cm-hero__meta">
              <span className="cm-hero__brand-tag">TRATTORIA &deg; RISTORANTE</span>
              <span className="cm-hero__sep">&bull;</span>
              <span className="cm-hero__location">📍 {locationStr}</span>
              <span className="cm-hero__sep">&bull;</span>
              <span className="cm-hero__live">
                <span className="cm-hero__dot cm-hero__dot--olive" />
                Open now
              </span>
              {tableNumber && (
                <span className="cm-hero__table">Table #{tableNumber}</span>
              )}
            </div>

            <h1 className="cm-hero__heading cm-hero__heading--editorial">
              {displayHeading}
            </h1>

            <div className="cm-hero__divider cm-hero__divider--editorial" aria-hidden="true">
              <span className="cm-hero__divider-line" />
              <span className="cm-hero__divider-icon">🌿</span>
              <span className="cm-hero__divider-line" />
            </div>

            <p className="cm-hero__lead cm-hero__lead--editorial">
              {displayLead}
            </p>

            <div className="cm-hero__foot-notes cm-hero__foot-notes--editorial">
              <span className="cm-hero__note-chip">✨ Wood-Fired Hearth</span>
              <span className="cm-hero__note-chip">🍝 Fresh Artisan Pasta</span>
              <span className="cm-hero__note-chip">🍷 Tuscan Pairings</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. NOIR ARCHETYPE: "HIKARI SUSHI BAR"
  // Layout Architecture: Left Text, Right Floating Slate (Cyber-Midnight Split)
  // Pure obsidian black, neon coral red accents, Katana flourish, slate dish
  // =========================================================================
  if (layout === 'noir') {
    const brandTitle = cafeName && cafeName !== 'CafeMenu' ? cafeName : 'HIKARI SUSHI BAR';
    const locationStr = cafeCity || (cafeName.toLowerCase().includes('abol') ? 'Tokyo • Roppongi' : 'Tokyo, Japan');
    const displayHeading = heroTitle
      ? renderDuoTitle(heroTitle, 'cm-hero__coral')
      : (
        <>
          Fresh. Fast. <span className="cm-hero__coral">Japanese.</span>
        </>
      );
    const displayLead = heroSub || tagline || 'Premium ingredients. Unforgettable taste.';

    return (
      <div className="cm-hero-full cm-hero--noir">
        <div className="cm-hero__container cm-hero__container--split-text-left">
          {/* Left Column: High-Impact Typography & Atmosphere */}
          <div className="cm-hero__col-text">
            <div className="cm-hero__meta cm-hero__meta--noir">
              <span className="cm-hero__kanji-badge">◎ 旬</span>
              <span className="cm-hero__brand-tag cm-hero__brand-tag--coral">
                {brandTitle} &bull; SUSHI &amp; ROBATA
              </span>
              <span className="cm-hero__sep cm-hero__sep--dark">&bull;</span>
              <span className="cm-hero__location cm-hero__location--dark">📍 {locationStr}</span>
              <span className="cm-hero__live cm-hero__live--dark">
                <span className="cm-hero__dot cm-hero__dot--coral" />
                Open Tonight
              </span>
              {tableNumber && (
                <span className="cm-hero__table cm-hero__table--noir">Table #{tableNumber}</span>
              )}
            </div>

            <h1 className="cm-hero__heading cm-hero__heading--noir">
              {displayHeading}
            </h1>

            <div className="cm-hero__divider cm-hero__divider--noir" aria-hidden="true">
              <span className="cm-hero__divider-line cm-hero__divider-line--coral" />
              <span className="cm-hero__divider-icon cm-hero__divider-icon--coral">✦</span>
              <span className="cm-hero__divider-line cm-hero__divider-line--coral" />
            </div>

            <p className="cm-hero__lead cm-hero__lead--noir">
              {displayLead}
            </p>

            <div className="cm-hero__foot-notes cm-hero__foot-notes--noir">
              <span className="cm-hero__note-chip cm-hero__note-chip--noir">🍣 Tsukiji Market Grade</span>
              <span className="cm-hero__note-chip cm-hero__note-chip--noir">🔥 Binchotan Charcoal</span>
              <span className="cm-hero__note-chip cm-hero__note-chip--noir">🍶 Junmai Daiginjo</span>
            </div>
          </div>

          {/* Right Column: Dark Floating Slate Dish Stage */}
          <div className="cm-hero__col-visual">
            {optimizedHero && !hasError ? (
              <div className={`cm-hero__stage cm-hero__stage--noir ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
                <img
                  src={optimizedHero}
                  srcSet={heroSrcSet}
                  sizes={heroSizes}
                  alt="Japanese specialties"
                  className={`cm-hero__img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setHasError(true)}
                />
                <div className="cm-hero__badge cm-hero__badge--noir">
                  <span>★ 4.9</span> Seasonal Catch
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. MODERN BENTO ARCHETYPE: "LUNA CAFÉ"
  // Layout Architecture: Modern Asymmetric Bento Box (Header + Modular Cells)
  // Soft oat / latte cream canvas, coffee leaf flourish, artisan croissant & cup
  // =========================================================================
  if (layout === 'bento') {
    const brandTitle = cafeName && cafeName !== 'CafeMenu' ? cafeName : 'LUNA CAFÉ';
    const locationStr = cafeCity || (cafeName.toLowerCase().includes('abol') ? 'Bole • Addis Ababa' : 'Portland, Oregon');
    const displayHeading = heroTitle || 'Good mornings start here';
    const displayLead = heroSub || tagline || 'Warm coffee. Fresh bites. Made for your moment.';

    return (
      <div className="cm-hero-full cm-hero--bento">
        <div className="cm-hero__container cm-hero__container--bento">
          {/* Bento Top Header Banner */}
          <div className="cm-hero__bento-top">
            <div className="cm-hero__bento-brand">
              <span className="cm-hero__leaf-badge">🍃</span>
              <div>
                <span className="cm-hero__bento-name">{brandTitle}</span>
                <span className="cm-hero__bento-sub">ARTISAN COFFEE ROASTERS &amp; BAKERY</span>
              </div>
            </div>
            <div className="cm-hero__bento-status">
              <span>📍 {locationStr}</span>
              <span className="cm-hero__bento-live">
                <span className="cm-hero__dot cm-hero__dot--sage" />
                Morning Roasts Ready
              </span>
              {tableNumber && <span className="cm-hero__table cm-hero__table--bento">Table #{tableNumber}</span>}
            </div>
          </div>

          {/* Bento Grid Cells */}
          <div className="cm-hero__bento-grid">
            {/* Bento Dish Showcase Cell */}
            <div className="cm-hero__bento-cell cm-hero__bento-cell--dish">
              {optimizedHero && !hasError ? (
                <div className={`cm-hero__stage cm-hero__stage--bento ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
                  <img
                    src={optimizedHero}
                    srcSet={heroSrcSet}
                    sizes={heroSizes}
                    alt="Artisan bakery and specialty coffee"
                    className={`cm-hero__img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setHasError(true)}
                  />
                  <div className="cm-hero__badge cm-hero__badge--bento">
                    <span>☕</span> Daily Roast Pairing
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bento Narrative Cell */}
            <div className="cm-hero__bento-cell cm-hero__bento-cell--content">
              <h1 className="cm-hero__heading cm-hero__heading--bento">
                {displayHeading}
              </h1>
              <div className="cm-hero__divider cm-hero__divider--bento" aria-hidden="true">
                <span className="cm-hero__divider-line" />
                <span className="cm-hero__divider-icon">🍃</span>
                <span className="cm-hero__divider-line" />
              </div>
              <p className="cm-hero__lead cm-hero__lead--bento">
                {displayLead}
              </p>
              <div className="cm-hero__bento-tags">
                <span className="cm-hero__bento-tag">🌾 Single Origin</span>
                <span className="cm-hero__bento-tag">🥐 Hand-Laminated</span>
                <span className="cm-hero__bento-tag">⏱ Brewed to Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. RUSTIC ARCHETYPE: "¡BUENOS! TAQUERIA"
  // Layout Architecture: Diagonal Artisanal Hearth Split (Flame & Sizzle)
  // Sunny warm maize, terracotta red, zigzag Aztec flourish, street tacos
  // =========================================================================
  if (layout === 'rustic') {
    const brandTitle = cafeName && cafeName !== 'CafeMenu' ? cafeName : '¡BUENOS! TAQUERIA';
    const locationStr = cafeCity || (cafeName.toLowerCase().includes('abol') ? 'Piazza • Flame Hearth' : 'Austin, Texas');
    const displayHeading = heroTitle
      ? renderDuoTitle(heroTitle, 'cm-hero__flame')
      : (
        <>
          A little spice, <span className="cm-hero__flame">a lot of flavor</span>
        </>
      );
    const displayLead = heroSub || tagline || 'Bold ingredients. Real taste. Straight from the street.';

    return (
      <div className="cm-hero-full cm-hero--rustic">
        <div className="cm-hero__container cm-hero__container--rustic">
          <div className="cm-hero__rustic-body">
            {/* Left Column: Terracotta Typography */}
            <div className="cm-hero__col-text cm-hero__col-text--rustic">
              <div className="cm-hero__meta cm-hero__meta--rustic">
                <span className="cm-hero__sun-badge">☀️</span>
                <span className="cm-hero__brand-tag cm-hero__brand-tag--rustic">
                  {brandTitle} &bull; HEARTH &amp; GRILL
                </span>
                <span className="cm-hero__sep">&bull;</span>
                <span className="cm-hero__location">📍 {locationStr}</span>
                <span className="cm-hero__live">
                  <span className="cm-hero__dot cm-hero__dot--orange" />
                  Flames Roaring
                </span>
                {tableNumber && <span className="cm-hero__table cm-hero__table--rustic">Table #{tableNumber}</span>}
              </div>

              <h1 className="cm-hero__heading cm-hero__heading--rustic">
                {displayHeading}
              </h1>

              <div className="cm-hero__divider cm-hero__divider--rustic" aria-hidden="true">
                <span className="cm-hero__zigzag">~~~~ 〰 ~~~~</span>
              </div>

              <p className="cm-hero__lead cm-hero__lead--rustic">
                {displayLead}
              </p>

              <div className="cm-hero__foot-notes cm-hero__foot-notes--rustic">
                <span className="cm-hero__note-chip cm-hero__note-chip--rustic">🔥 Mesquite Wood Charcoal</span>
                <span className="cm-hero__note-chip cm-hero__note-chip--rustic">🌮 Hand-Pressed Masa</span>
                <span className="cm-hero__note-chip cm-hero__note-chip--rustic">🌶 Stone-Ground Salsas</span>
              </div>
            </div>

            {/* Right Column: Sizzling Dish Presentation */}
            <div className="cm-hero__col-visual cm-hero__col-visual--rustic">
              {optimizedHero && !hasError ? (
                <div className={`cm-hero__stage cm-hero__stage--rustic ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
                  <img
                    src={optimizedHero}
                    srcSet={heroSrcSet}
                    sizes={heroSizes}
                    alt="Hearth grilled special"
                    className={`cm-hero__img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setHasError(true)}
                  />
                  <div className="cm-hero__badge cm-hero__badge--rustic">
                    <span>🌶</span> 100% Fire-Roasted
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Full Edge Aztec Base Strip */}
        <div className="cm-hero__aztec-strip" aria-hidden="true" />
      </div>
    );
  }

  // =========================================================================
  // 5. BOUTIQUE / LUXURY HOTEL ARCHETYPE: "THE VISTA HOTEL"
  // Layout Architecture: Haute Horlogerie & Penthouse Suite (Image Left, Gold Text Right)
  // Midnight royal navy, champagne gold crest, fleur-de-lis, steak & wine
  // Also applied gracefully to 'minimal' archetype
  // =========================================================================
  const brandTitle = cafeName && cafeName !== 'CafeMenu' ? cafeName : 'THE VISTA HOTEL';
  const locationStr = cafeCity || (cafeName.toLowerCase().includes('abol') ? 'Addis Ababa • Skylight' : 'New York, New York');
  const displayHeading = heroTitle
    ? renderDuoTitle(heroTitle, 'cm-hero__gold-italic')
    : (
      <>
        Dining, <span className="cm-hero__gold-italic">reimagined</span>
      </>
    );
  const displayLead = heroSub || tagline || 'Refined flavors. Exceptional service. Exclusively for you.';

  return (
    <div className="cm-hero-full cm-hero--vista">
      <div className="cm-hero__container cm-hero__container--split-img-left">
        {/* Left Column: 24k Gold Pedestal Stage */}
        <div className="cm-hero__col-visual cm-hero__col-visual--vista">
          {optimizedHero && !hasError ? (
            <div className={`cm-hero__stage cm-hero__stage--vista ${imageLoaded ? 'is-loaded' : 'is-loading'}`}>
              <img
                src={optimizedHero}
                srcSet={heroSrcSet}
                sizes={heroSizes}
                alt="Haute dining presentation"
                className={`cm-hero__img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
                loading="eager"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => setHasError(true)}
              />
              <div className="cm-hero__badge cm-hero__badge--vista">
                <span>⚜</span> Grand Reserve Tasting
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column: Haute Hospitality Typography */}
        <div className="cm-hero__col-text cm-hero__col-text--vista">
          <div className="cm-hero__meta cm-hero__meta--vista">
            <span className="cm-hero__shield-badge">V</span>
            <span className="cm-hero__brand-tag cm-hero__brand-tag--gold">
              {brandTitle} &bull; SALON GASTRONOMIQUE
            </span>
            <span className="cm-hero__sep cm-hero__sep--gold">&bull;</span>
            <span className="cm-hero__location cm-hero__location--gold">📍 {locationStr}</span>
            <span className="cm-hero__live cm-hero__live--gold">
              <span className="cm-hero__dot cm-hero__dot--gold" />
              Tables Available
            </span>
            {tableNumber && <span className="cm-hero__table cm-hero__table--gold">Suite Table #{tableNumber}</span>}
          </div>

          <h1 className="cm-hero__heading cm-hero__heading--vista">
            {displayHeading}
          </h1>

          <div className="cm-hero__divider cm-hero__divider--vista" aria-hidden="true">
            <span className="cm-hero__divider-line cm-hero__divider-line--gold" />
            <span className="cm-hero__divider-icon cm-hero__divider-icon--gold">⚜</span>
            <span className="cm-hero__divider-line cm-hero__divider-line--gold" />
          </div>

          <p className="cm-hero__lead cm-hero__lead--vista">
            {displayLead}
          </p>

          <div className="cm-hero__foot-notes cm-hero__foot-notes--vista">
            <span className="cm-hero__note-chip cm-hero__note-chip--vista">👑 Sommelier Reserve Cellar</span>
            <span className="cm-hero__note-chip cm-hero__note-chip--vista">⭐ Michelin Recommended</span>
            <span className="cm-hero__note-chip cm-hero__note-chip--vista">✨ White Glove Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
}
