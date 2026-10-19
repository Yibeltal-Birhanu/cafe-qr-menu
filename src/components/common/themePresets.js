/**
 * Multi-Tenant Theme Presets and CSS Custom Property Engine
 * Allows every cafe or restaurant to customize their visual identity instantly.
 */

export const THEME_PRESETS = [
  {
    id: 'showcase',
    layout: 'bento',
    name: 'Modern Bento & Clean App',
    archetype: 'Modern Cafe & Fast Casual',
    cardStyle: 'Floating Bento Cards with Quick Badges',
    navStyle: 'Top Floating App Bar with Integrated Search',
    landingStyle: 'Interactive Smartphone Splash Screen',
    tagline: 'Clean off-white canvas, floating bento cards & modern app navigation.',
    previewColors: ['#f8f9fa', '#1c2826', '#e6923c'],
    primaryColor: '#1c2826',
    accentColor: '#e6923c',
    backgroundColor: '#f8f9fa',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'emerald',
    layout: 'editorial',
    name: 'Editorial & Fine Dining Luxury',
    archetype: 'Fine Dining, Rooftops & Wine Lounges',
    cardStyle: 'Magazine Split Cards with Serif Typography',
    navStyle: 'Minimalist Centered Serif Header with Gold Hairlines',
    landingStyle: 'Grand Haute Cuisine Editorial Cover',
    tagline: 'Full-bleed luxury photography, Playfair serif typography & champagne gold accents.',
    previewColors: ['#061a14', '#10b981', '#fbbf24'],
    primaryColor: '#10b981',
    accentColor: '#fbbf24',
    backgroundColor: '#061a14',
    backgroundMode: 'dark',
    surfaceColor: 'rgba(11, 41, 32, 0.92)',
    textColor: '#f0fdf4',
    fontFamily: 'Playfair Display',
  },
  {
    id: 'terracotta',
    layout: 'rustic',
    name: 'Wood-Fired & Rustic Flame Bistro',
    archetype: 'Pizzerias, Smash Burgers & Steakhouses',
    cardStyle: 'Bold Hearth Cards with Flame Badges & Tactile Borders',
    navStyle: 'Sturdy Bistro Header with Fire Badges & Stamp Tags',
    landingStyle: 'Glowing Embers & Wood-Fired Hearth Cover',
    tagline: 'Deep charcoal hearth, flame orange badges, bold stamps & tactile cards.',
    previewColors: ['#140805', '#ea580c', '#f59e0b'],
    primaryColor: '#ea580c',
    accentColor: '#f59e0b',
    backgroundColor: '#140805',
    backgroundMode: 'dark',
    surfaceColor: 'rgba(38, 16, 11, 0.92)',
    textColor: '#fff7ed',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'pastel',
    layout: 'boutique',
    name: 'Parisian Patisserie & Boutique Cafe',
    archetype: 'Bakeries, Confectioneries & Brunch Tea Rooms',
    cardStyle: 'Soft Rounded Pill Cards with Delicate Rose Badges',
    navStyle: 'Boutique Blush Header with Sweet Confectionery Branding',
    landingStyle: 'Pastel Vignette & French Patisserie Cover',
    tagline: 'Blush rose velvet, strawberry cream badges & delicate confectionery elegance.',
    previewColors: ['#160d14', '#ec4899', '#10b981'],
    primaryColor: '#ec4899',
    accentColor: '#10b981',
    backgroundColor: '#160d14',
    backgroundMode: 'dark',
    surfaceColor: 'rgba(42, 24, 38, 0.92)',
    textColor: '#fdf2f8',
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'espresso',
    layout: 'bento',
    name: 'Roasted Espresso & Amber',
    archetype: 'Traditional Coffee Roastery & Habesha Dining',
    cardStyle: 'Warm Mocha Bento Cards with Caramel Accents',
    navStyle: 'Traditional Roastery Bar with Honey Gold Accents',
    landingStyle: 'Authentic Buna & Roaster Heritage Cover',
    tagline: 'Velvet mocha, toasted caramel & honey gold.',
    previewColors: ['#0e0a07', '#e6923c', '#fbbf24'],
    primaryColor: '#e6923c',
    accentColor: '#fbbf24',
    backgroundColor: '#0e0a07',
    backgroundMode: 'dark',
    surfaceColor: 'rgba(28, 20, 15, 0.85)',
    textColor: '#fff8f0',
    fontFamily: 'Plus Jakarta Sans',
  },
];

export function applyThemeToDocument(theme) {
  if (!theme || typeof window === 'undefined') return;
  const root = document.documentElement;

  const preset = THEME_PRESETS.find((p) => p.id === theme.preset) || THEME_PRESETS[0];
  const effective = {
    ...preset,
    ...theme,
    layout: theme.layout || preset.layout || 'bento',
  };

  root.setAttribute('data-theme-layout', effective.layout);
  root.setAttribute('data-theme-preset', effective.id);

  if (effective.primaryColor) {
    root.style.setProperty('--accent', effective.primaryColor);
    root.style.setProperty('--border-glow', effective.primaryColor + '70');
    root.style.setProperty('--shadow-glow', `0 0 35px ${effective.primaryColor}50`);
  }
  if (effective.accentColor) {
    root.style.setProperty('--accent-gold', effective.accentColor);
    root.style.setProperty('--accent-2', effective.accentColor);
    root.style.setProperty('--border-focus', effective.accentColor);
  } else if (effective.primaryColor) {
    root.style.setProperty('--accent-2', effective.primaryColor);
  }
  if (effective.backgroundColor) {
    root.style.setProperty('--bg', effective.backgroundColor);
    if (effective.backgroundColor === '#fcfbf9' || effective.backgroundMode === 'light') {
      root.style.setProperty('--bg-2', '#f3efe8');
      root.style.setProperty('--bg-3', '#ebe4d8');
    } else {
      root.style.setProperty('--bg-2', '#140e0a');
      root.style.setProperty('--bg-3', '#1c140f');
    }
  }
  if (effective.surfaceColor) {
    root.style.setProperty('--surface', effective.surfaceColor);
    root.style.setProperty('--surface-card', effective.surfaceColor);
    root.style.setProperty('--surface-strong', effective.surfaceColor);
  }
  if (effective.textColor) {
    root.style.setProperty('--text', effective.textColor);
    if (effective.textColor === '#18181b' || effective.backgroundMode === 'light') {
      root.style.setProperty('--text-secondary', '#3f3f46');
      root.style.setProperty('--muted', '#71717a');
      root.style.setProperty('--border', 'rgba(0, 0, 0, 0.12)');
      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.06)');
    } else {
      root.style.setProperty('--text-secondary', '#a8988a');
      root.style.setProperty('--muted', '#7d6f63');
      root.style.setProperty('--border', 'rgba(230, 146, 60, 0.15)');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.06)');
    }
  }
  if (effective.fontFamily) {
    const isSerif = effective.fontFamily === 'Playfair Display' || effective.fontFamily.toLowerCase().includes('serif');
    root.style.setProperty('--font', `"${effective.fontFamily}", "Plus Jakarta Sans", sans-serif`);
    if (isSerif) {
      root.style.setProperty('--serif', `"${effective.fontFamily}", Georgia, serif`);
      root.style.setProperty('--cm-font-serif', `"${effective.fontFamily}", Georgia, serif`);
    } else {
      root.style.setProperty('--cm-font-sans', `"${effective.fontFamily}", -apple-system, sans-serif`);
    }
  }

  // Bind showcase mobile variables so whole customer experience dynamically adapts
  root.style.setProperty('--cm-bg', effective.backgroundColor || '#0e0a07');
  if (effective.primaryColor) {
    root.style.setProperty('--cm-amber', effective.primaryColor);
    root.style.setProperty('--cm-btn-dark', effective.primaryColor);
    root.style.setProperty('--cm-btn-dark-hover', effective.accentColor || effective.primaryColor);
  }
  if (effective.accentColor) {
    root.style.setProperty('--cm-star', effective.accentColor);
    root.style.setProperty('--cm-accent-green', effective.accentColor);
  }

  if (effective.backgroundMode === 'light') {
    root.style.setProperty('--cm-card-bg', '#ffffff');
    root.style.setProperty('--cm-surface-dark', '#18181b');
    root.style.setProperty('--cm-text-dark', effective.textColor || '#18181b');
    root.style.setProperty('--cm-text-muted', '#71717a');
    root.style.setProperty('--cm-border', '#f0f0f2');
    root.style.setProperty('--cm-border-strong', '#e5e7eb');
  } else {
    root.style.setProperty('--cm-card-bg', effective.surfaceColor || 'rgba(28, 20, 15, 0.95)');
    root.style.setProperty('--cm-surface-dark', effective.backgroundColor || '#0e0a07');
    root.style.setProperty('--cm-text-dark', effective.textColor || '#fff8f0');
    root.style.setProperty('--cm-text-muted', '#a8988a');
    root.style.setProperty('--cm-border', `${effective.primaryColor || '#ffffff'}22`);
    root.style.setProperty('--cm-border-strong', `${effective.primaryColor || '#ffffff'}40`);
  }

  // Exact classic showcase theme variable mapping
  if (effective.preset === 'showcase') {
    root.style.setProperty('--cm-amber', '#e6923c');
    root.style.setProperty('--cm-star', '#f59e0b');
    root.style.setProperty('--cm-accent-green', '#10b981');
    root.style.setProperty('--cm-btn-dark', '#1c2826');
    root.style.setProperty('--cm-btn-dark-hover', '#273835');
    root.style.setProperty('--cm-text-dark', '#111827');
    root.style.setProperty('--cm-text-muted', '#6b7280');
    root.style.setProperty('--cm-border', '#f0f0f2');
    root.style.setProperty('--cm-border-strong', '#e5e7eb');
    root.style.setProperty('--cm-bg', '#f8f9fa');
    root.style.setProperty('--cm-card-bg', '#ffffff');
  }
}

