import React, { useState } from 'react';
import { SparklesIcon } from '../common/Icons.jsx';
import {
  getHeroBannerImage,
  getHeroBannerSrcSet,
  getHeroBannerSizes,
} from '../common/imageUtils.js';

export default function MenuHero({
  layout = 'minimal',
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

  // =========================================================================
  // 1. SCANDINAVIAN MINIMALIST ARCHITECTURE (layout === 'minimal')
  // Specialty Cafes & Modern Kitchens — Clean Minimalist Architecture
  // Clean warm limestone canvas, botanical sage accents, professional dining
  // =========================================================================
  if (layout === 'minimal') {
    const defaultNordicFallback = 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1200&q=90';
    const displayImage = heroImage || defaultNordicFallback;
    const optimizedHero = getHeroBannerImage(displayImage);
    const heroSrcSet = getHeroBannerSrcSet(displayImage);
    const heroSizes = getHeroBannerSizes('minimal');

    const displayTitle = heroTitle || (cafeName ? `Welcome to ${cafeName}` : 'Craft Kitchen & Dining');
    const displaySubtitle = heroSub || tagline || 'Handcrafted dishes, specialty beverages, and fresh ingredients.';

    return (
      <div className="cm-nordic-hero-wrap">
        <section aria-labelledby="nordic-welcome-heading" className="cm-nordic-hero-card">
          {/* Top Visual Staging */}
          <div className="cm-nordic-hero-stage">
            <img
              src={hasError ? defaultNordicFallback : (optimizedHero || defaultNordicFallback)}
              srcSet={hasError ? undefined : heroSrcSet}
              sizes={heroSizes}
              alt={displayTitle}
              className={`cm-nordic-hero-img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                if (!hasError) {
                  setHasError(true);
                  setImageLoaded(true);
                }
              }}
            />
            <div className="cm-nordic-hero-gradient" aria-hidden="true" />
            <div className="cm-nordic-hero-badge">
              <span className="cm-nordic-badge-dot" />
              <span>FRESH MENU</span>
            </div>
          </div>

          {/* Clean Content Body */}
          <div className="cm-nordic-hero-body">
            <div className="cm-nordic-eyebrow-row">
              <span className="cm-nordic-eyebrow">
                SPECIALTY DINING &bull; FRESH KITCHEN
              </span>
              {tableNumber ? (
                <span className="cm-nordic-table-tag">Table #{tableNumber}</span>
              ) : null}
            </div>

            <h1 id="nordic-welcome-heading" className="cm-nordic-title">
              {displayTitle}
            </h1>

            <p className="cm-nordic-lead">
              {displaySubtitle}
            </p>
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // 2. EVENING LOUNGE & CYAN (layout === 'noir')
  // Modern, clean, simple black UI design — uncluttered, punchy & elegant
  // =========================================================================
  if (layout === 'noir') {
    const defaultNoirFallback = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=90';
    const displayImage = heroImage || defaultNoirFallback;
    const optimizedHero = getHeroBannerImage(displayImage);
    const heroSrcSet = getHeroBannerSrcSet(displayImage);
    const heroSizes = getHeroBannerSizes('noir');

    const displayTitle = heroTitle || 'Evening Lounge & Dining';
    const displaySubtitle = heroSub || tagline || 'Cocktails & chef-fired specialties under the city lights.';

    return (
      <div className="cm-noir-hero-wrap">
        <section aria-labelledby="noir-welcome-heading" className="cm-noir-hero-card">
          {/* Uncropped High-Contrast Visual Staging */}
          <div className="cm-noir-hero-stage">
            <img
              src={hasError ? defaultNoirFallback : (optimizedHero || defaultNoirFallback)}
              srcSet={hasError ? undefined : heroSrcSet}
              sizes={heroSizes}
              alt={displayTitle}
              className={`cm-noir-hero-img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                if (!hasError) {
                  setHasError(true);
                  setImageLoaded(true);
                }
              }}
            />
            <div className="cm-noir-hero-gradient" aria-hidden="true" />
          </div>

          {/* Clean, Modern, Slop-Free Content */}
          <div className="cm-noir-hero-body">
            {tableNumber ? (
              <div className="cm-noir-eyebrow-row">
                <span className="cm-noir-table-tag">Table #{tableNumber}</span>
              </div>
            ) : null}

            <h1 id="noir-welcome-heading" className="cm-noir-title">
              {displayTitle}
            </h1>

            {displaySubtitle ? (
              <p className="cm-noir-lead">
                {displaySubtitle}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // 2. DEFAULT / MAGICPATH SHARP SUMMER CARD (All other presets)
  // =========================================================================
  const defaultHeroFallback = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=90';
  const displayImage = heroImage || defaultHeroFallback;
  const optimizedHero = getHeroBannerImage(displayImage);
  const heroSrcSet = getHeroBannerSrcSet(displayImage);
  const heroSizes = getHeroBannerSizes(layout);

  const displayTitle = heroTitle || (cafeName ? `Welcome to ${cafeName}` : 'Welcome to our Kitchen');
  const displaySubtitle = heroSub || tagline || 'Fresh dishes, specialty beverages, and quality ingredients made for your table.';

  return (
    <div className="cm-sharp-hero-wrap">
      <section
        aria-labelledby="welcome-heading"
        className="cm-sharp-hero-card"
      >
        <img
          src={hasError ? defaultHeroFallback : (optimizedHero || defaultHeroFallback)}
          srcSet={hasError ? undefined : heroSrcSet}
          sizes={hasError ? undefined : heroSizes}
          alt={displayTitle}
          className={`cm-sharp-hero-img ${imageLoaded ? 'is-loaded' : 'is-loading'}`}
          loading="eager"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (!hasError) {
              setHasError(true);
              setImageLoaded(true);
            }
          }}
        />

        {/* Gradient Overlay */}
        <div className="cm-sharp-hero-gradient" aria-hidden="true" />

        {/* Content Box */}
        <div className="cm-sharp-hero-body">
          <div className="cm-sharp-hero-badge">
            <SparklesIcon size={13} strokeWidth={2} />
            <span>Fresh &bull; Made Daily</span>
          </div>

          <h2 id="welcome-heading" className="cm-sharp-hero-title">
            {displayTitle}
          </h2>

          <p className="cm-sharp-hero-sub">
            {displaySubtitle}
          </p>
        </div>
      </section>
    </div>
  );
}
