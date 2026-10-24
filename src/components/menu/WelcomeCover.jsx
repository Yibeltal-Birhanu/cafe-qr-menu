import React from 'react';
import { CoffeeIcon, PizzaIcon, CakeIcon, FlameIcon, ArrowRightIcon } from '../common/Icons.jsx';

export default function WelcomeCover({
  cafeName = 'CafeMenu',
  tagline = 'Good Food • Great Moments',
  coverImage = '',
  logo = 'coffee',
  theme = null,
  onStart,
}) {
  const layout = theme?.layout || (
    theme?.preset === 'emerald' ? 'editorial' :
    theme?.preset === 'terracotta' ? 'rustic' :
    theme?.preset === 'pastel' ? 'boutique' :
    theme?.preset === 'neon-noir' || theme?.preset === 'noir' ? 'noir' :
    'bento'
  );

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
      badge: 'RESERVE & TASTING MENU',
      title: 'Seasonal Reserve Menu',
      sub: 'An exquisite culinary experience featuring curated dishes and reserve selections.',
      btnText: 'View Selections',
    },
    rustic: {
      badge: 'WOOD-FIRED KITCHEN & GRILL',
      title: 'Wood-Fired Specialties & Grill',
      sub: 'Stone-baked pizzas, flame-grilled specialties, and fresh comfort food.',
      btnText: 'Explore Menu',
    },
    boutique: {
      badge: 'PATISSERIE & SPECIALTY COFFEE',
      title: 'Fresh Bakes & Specialty Coffee',
      sub: 'Freshly baked viennoiserie, delicate pastries, and artisan coffee.',
      btnText: 'Explore Delicacies',
    },
    noir: {
      badge: 'EVENING LOUNGE & COCKTAILS',
      title: 'Signature Beverages & Small Plates',
      sub: 'Craft beverages, late-night bites, and relaxed evening dining.',
      btnText: 'View Lounge Menu',
    },
    bento: {
      badge: 'DIGITAL QR MENU',
      title: 'Scan. Browse. Enjoy.',
      sub: 'Explore our full selection of dishes and beverages freshly prepared for your table.',
      btnText: 'View Menu',
    },
  }[layout] || {
    badge: 'DIGITAL QR MENU',
    title: 'Scan. Browse. Enjoy.',
    sub: 'Explore our full selection of dishes and beverages freshly prepared for your table.',
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
      className={`cm-welcome-screen cm-welcome-screen--${layout}`}
      data-theme-layout={layout}
      role="region"
      aria-label="Welcome screen"
      style={bgStyle}
    >
      {/* Brand Header */}
      <div className="cm-welcome-header">
        <span
          className="cm-welcome-logo"
          aria-hidden="true"
          style={{ color: theme?.accentColor || theme?.primaryColor || '#ffffff' }}
        >
          {renderLogo()}
        </span>
        <div className="cm-welcome-badge-pill">
          {layoutContent.badge}
        </div>
        <h1
          className="cm-welcome-brand"
          style={{
            fontFamily: layout === 'editorial' || theme?.fontFamily === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : undefined,
          }}
        >
          {cafeName}
        </h1>
        <span
          className="cm-welcome-tagline"
          style={{ color: theme?.accentColor || 'rgba(255, 255, 255, 0.8)' }}
        >
          {tagline}
        </span>
      </div>

      {/* Hero Welcome Message */}
      <div className="cm-welcome-body">
        <h2
          className="cm-welcome-title"
          style={{
            fontFamily: layout === 'editorial' || theme?.fontFamily === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : undefined,
          }}
        >
          {layoutContent.title}
        </h2>
        <p className="cm-welcome-sub">{layoutContent.sub}</p>
        <button
          type="button"
          className={`cm-welcome-btn cm-welcome-btn--${layout}`}
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
