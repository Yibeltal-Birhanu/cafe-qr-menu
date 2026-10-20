import React from 'react';
import { CoffeeIcon, PizzaIcon, CakeIcon, FlameIcon, ArrowRightIcon, WifiIcon, BatteryIcon, StarIcon } from '../common/Icons.jsx';

export default function WelcomeCover({
  cafeName = 'CafeMenu',
  tagline = 'Good Food • Great Moments',
  coverImage = '',
  logo = 'coffee',
  theme = null,
  onStart,
}) {
  const layout = theme?.layout || (theme?.preset === 'emerald' ? 'editorial' : theme?.preset === 'terracotta' ? 'rustic' : theme?.preset === 'pastel' ? 'boutique' : 'bento');

  const renderLogo = () => {
    switch (logo) {
      case 'pizza':
        return <PizzaIcon size={38} />;
      case 'cake':
      case 'dessert':
        return <CakeIcon size={38} />;
      case 'flame':
      case 'lounge':
        return <FlameIcon size={38} />;
      default:
        return <CoffeeIcon size={38} />;
    }
  };

  const layoutContent = {
    editorial: {
      badge: 'HAUTE CUISINE & RESERVE',
      title: "L'Édition Gastronomique",
      sub: 'An exquisite gastronomic experience featuring curated dishes and reserve selections.',
      btnText: 'Explore the Collection',
    },
    rustic: {
      badge: 'WOOD-FIRED HEARTH & GRILL',
      title: 'Wood-Fired. Crafted by Flame.',
      sub: 'Smoked cuts, stone-baked sourdough pizzas, and open-flame comfort food.',
      btnText: 'Enter Hearth & Menu 🔥',
    },
    boutique: {
      badge: 'PATISSERIE & SALON DE THÉ',
      title: 'Sweet Delicacies & Bakes',
      sub: 'Freshly laminated viennoiserie, strawberry cream choux, and fine artisanal teas.',
      btnText: 'Discover Our Delicacies ✨',
    },
    bento: {
      badge: 'DIGITAL QR MENU',
      title: 'Scan. Browse. Enjoy.',
      sub: 'Explore our curated selections crafted fresh for your table.',
      btnText: 'View Menu',
    },
  }[layout] || {
    badge: 'DIGITAL QR MENU',
    title: 'Scan. Browse. Enjoy.',
    sub: 'Explore our curated selections crafted fresh for your table.',
    btnText: 'View Menu',
  };

  const bgStyle = coverImage
    ? {
        background: `linear-gradient(to bottom, rgba(14, 10, 7, 0.45) 0%, rgba(14, 10, 7, 0.85) 60%, ${theme?.backgroundColor || '#0e0a07'} 100%), url('${coverImage}') center/cover no-repeat`,
      }
    : undefined;

  const btnStyle = theme?.primaryColor
    ? {
        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor || theme.primaryColor})`,
        color: theme?.backgroundMode === 'light' ? '#18181b' : '#ffffff',
        boxShadow: `0 10px 25px -4px ${theme.primaryColor}80`,
      }
    : undefined;

  return (
    <div
      class={`cm-welcome-screen cm-welcome-screen--${layout}`}
      data-theme-layout={layout}
      role="region"
      aria-label="Welcome screen"
      style={bgStyle}
    >
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
        <span
          class="cm-welcome-logo"
          aria-hidden="true"
          style={{ color: theme?.accentColor || theme?.primaryColor || '#ffffff' }}
        >
          {renderLogo()}
        </span>
        <div class="cm-welcome-badge-pill">
          {layoutContent.badge}
        </div>
        <h1
          class="cm-welcome-brand"
          style={{
            fontFamily: layout === 'editorial' || theme?.fontFamily === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : undefined,
          }}
        >
          {cafeName}
        </h1>
        <span
          class="cm-welcome-tagline"
          style={{ color: theme?.accentColor || 'rgba(255, 255, 255, 0.8)' }}
        >
          {tagline}
        </span>
      </div>

      {/* Hero Welcome Message */}
      <div class="cm-welcome-body">
        <h2
          class="cm-welcome-title"
          style={{
            fontFamily: layout === 'editorial' || theme?.fontFamily === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : undefined,
          }}
        >
          {layoutContent.title}
        </h2>
        <p class="cm-welcome-sub">{layoutContent.sub}</p>
        <button
          type="button"
          class={`cm-welcome-btn cm-welcome-btn--${layout}`}
          onClick={onStart}
          aria-label={layoutContent.btnText}
          style={btnStyle}
        >
          <span>{layoutContent.btnText}</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}
