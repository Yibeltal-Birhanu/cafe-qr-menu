import React from 'react';
import { StarIcon, ClockIcon, FlameIcon, CoffeeIcon, PizzaIcon, CakeIcon } from '../common/Icons.jsx';

export default function MenuHero({
  layout = 'bento',
  cafeName = 'CafeMenu',
  tagline = '',
  heroTitle = '',
  heroSub = '',
  heroImage = '',
  tableNumber = '04',
}) {
  // 1. BENTO HERO (Modern Bento Food App)
  if (layout === 'bento') {
    return (
      <div class="cm-hero-bento">
        <div class="cm-hero-bento__content">
          <div class="cm-hero-bento__tag">
            <span class="cm-hero-bento__sparkle">✨</span>
            <span>Chef's Daily Special</span>
          </div>
          <h2 class="cm-hero-bento__title">{heroTitle || 'Fresh Flavors Every Day'}</h2>
          <p class="cm-hero-bento__sub">{heroSub || 'Quality ingredients & authentic craft.'}</p>
          <div class="cm-hero-bento__chips">
            <span class="cm-hero-bento__chip">
              <StarIcon size={12} />
              <span>4.9 (120+ reviews)</span>
            </span>
            <span class="cm-hero-bento__chip">
              <ClockIcon size={12} />
              <span>Fresh Prep</span>
            </span>
            <span class="cm-hero-bento__chip cm-hero-bento__chip--table">
              Table #{tableNumber}
            </span>
          </div>
        </div>
        <div class="cm-hero-bento__media">
          <img
            src={heroImage || '/images/dishes/classic-beef-burger.jpg'}
            alt={heroTitle || 'Hero Dish'}
            class="cm-hero-bento__img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/dishes/classic-beef-burger.jpg';
            }}
          />
          <span class="cm-hero-bento__popular-badge">Popular 🔥</span>
        </div>
      </div>
    );
  }

  // 2. EDITORIAL HERO (Haute Cuisine Reserve Tasting Menu)
  if (layout === 'editorial') {
    return (
      <div class="cm-hero-editorial">
        <div class="cm-hero-editorial__crest">
          ✦ L'ÉDITION GASTRONOMIQUE • GRAND DEGUSTATION ✦
        </div>
        <h2 class="cm-hero-editorial__title">
          {heroTitle || 'Curated Reserve & Tasting Menu'}
        </h2>
        {heroImage && (
          <div class="cm-hero-editorial__media" style={{ margin: '1.2rem auto', borderRadius: '12px', overflow: 'hidden', maxHeight: '220px', maxWidth: '520px', border: '1px solid var(--cm-secondary, #d4af37)' }}>
            <img
              src={heroImage}
              alt={heroTitle || 'Reserve Special'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
        <div class="cm-hero-editorial__divider" aria-hidden="true"></div>
        <p class="cm-hero-editorial__sub">
          {heroSub || 'An uncompromising culinary journey featuring rare reserve roasts, dry-aged cuts, and artisanal delicacies.'}
        </p>
        <div class="cm-hero-editorial__badges">
          <span class="cm-hero-editorial__badge">✦ RESERVE PAIRINGS</span>
          <span class="cm-hero-editorial__badge">CHEF'S DEGUSTATION</span>
          <span class="cm-hero-editorial__badge">RESERVE • TABLE {tableNumber}</span>
        </div>
      </div>
    );
  }

  // 3. RUSTIC HERO (Wood-Fired Hearth & Open Grill)
  if (layout === 'rustic') {
    return (
      <div class="cm-hero-rustic">
        <div class="cm-hero-rustic__content">
          <div class="cm-hero-rustic__tag">
            <FlameIcon size={13} style={{ color: '#ffffff' }} />
            <span>WOOD-FIRED HEARTH &amp; OPEN GRILL</span>
          </div>
          <h2 class="cm-hero-rustic__title">
            {heroTitle || 'CRAFTED BY FLAME. SMOKED TO PERFECTION.'}
          </h2>
          <p class="cm-hero-rustic__sub">
            {heroSub || 'Stone-baked sourdough crusts, charred prime cuts & open-hearth comfort.'}
          </p>
          <div class="cm-hero-rustic__chips">
            <span class="cm-hero-rustic__chip">🔥 800° STONE HEARTH</span>
            <span class="cm-hero-rustic__chip">🪵 HARDWOOD SMOKED</span>
            <span class="cm-hero-rustic__chip cm-hero-rustic__chip--table">HEARTH #{tableNumber}</span>
          </div>
        </div>
        <div class="cm-hero-rustic__media">
          <img
            src={heroImage || '/images/dishes/margherita.jpg'}
            alt={heroTitle || 'Wood-fired specialty'}
            class="cm-hero-rustic__img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/dishes/margherita.jpg';
            }}
          />
        </div>
      </div>
    );
  }

  // 4. BOUTIQUE HERO (Parisian Patisserie & Sweet Confectionery)
  if (layout === 'boutique') {
    return (
      <div class="cm-hero-boutique">
        <div class="cm-hero-boutique__content">
          <div class="cm-hero-boutique__tag">
            <span>✨ MAISON DE DÉLICES • SALON DE THÉ</span>
          </div>
          <h2 class="cm-hero-boutique__title">
            {heroTitle || 'Sweet Delicacies & Artisanal Bakes'}
          </h2>
          <p class="cm-hero-boutique__sub">
            {heroSub || 'Freshly laminated viennoiserie, strawberry cream choux & ceremonial reserve teas.'}
          </p>
          <div class="cm-hero-boutique__chips">
            <span class="cm-hero-boutique__chip">🥐 FRESH BAKED</span>
            <span class="cm-hero-boutique__chip">🌸 ROSE INFUSIONS</span>
            <span class="cm-hero-boutique__chip cm-hero-boutique__chip--table">SALON #{tableNumber}</span>
          </div>
        </div>
        <div class="cm-hero-boutique__media">
          <img
            src={heroImage || '/images/dishes/tiramisu.jpg'}
            alt={heroTitle || 'Artisanal pastry'}
            class="cm-hero-boutique__img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/dishes/tiramisu.jpg';
            }}
          />
        </div>
      </div>
    );
  }

  // 5. NOIR HERO (Tokyo Neon Noir Cyber Lounge)
  if (layout === 'noir') {
    return (
      <div class="cm-hero-noir">
        <div class="cm-hero-noir__content">
          <div class="cm-hero-noir__tag">
            [SYS: CYBER_LOUNGE // NIGHT_MODE: ACTIVE]
          </div>
          <h2 class="cm-hero-noir__title">
            {heroTitle || 'NEON NIGHTS & CRAFT MIXOLOGY'}
          </h2>
          <p class="cm-hero-noir__sub">
            {heroSub || 'High-tech mixology, late-night fusion bites, and ambient techno soundscapes.'}
          </p>
          <div class="cm-hero-noir__chips">
            <span class="cm-hero-noir__chip">⚡ AMBIENT MIXOLOGY</span>
            <span class="cm-hero-noir__chip">🔮 NEON INFUSION</span>
            <span class="cm-hero-noir__chip cm-hero-noir__chip--table">[BOOTH // {tableNumber}]</span>
          </div>
        </div>
        <div class="cm-hero-noir__media">
          <img
            src={heroImage || '/images/dishes/caramel-latte.jpg'}
            alt={heroTitle || 'Cyber Lounge Special'}
            class="cm-hero-noir__img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/dishes/caramel-latte.jpg';
            }}
          />
        </div>
      </div>
    );
  }

  // 6. MINIMAL HERO (Scandinavian Nordic Botanical)
  return (
    <div class="cm-hero-minimal">
      <div class="cm-hero-minimal__content">
        <div class="cm-hero-minimal__tag">
          <span>NORDIC BOTANICAL &bull; ARTISANAL HARVEST</span>
        </div>
        <h2 class="cm-hero-minimal__title">
          {heroTitle || 'Pure, Minimalist & Mindfully Sourced'}
        </h2>
        <p class="cm-hero-minimal__sub">
          {heroSub || 'Clean single-origin roasts, stone-ground grain sourdough, and seasonal comfort.'}
        </p>
        <div class="cm-hero-minimal__chips">
          <span class="cm-hero-minimal__chip">&bull; Stone Milled</span>
          <span class="cm-hero-minimal__chip">&bull; Organic Harvest</span>
          <span class="cm-hero-minimal__chip cm-hero-minimal__chip--table">Table #{tableNumber}</span>
        </div>
      </div>
      <div class="cm-hero-minimal__media">
        <img
          src={heroImage || '/images/dishes/macchiato.jpg'}
          alt={heroTitle || 'Artisanal specialty'}
          class="cm-hero-minimal__img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/dishes/macchiato.jpg';
          }}
        />
      </div>
    </div>
  );
}
