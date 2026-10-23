/**
 * Multi-Tenant Theme Presets and CSS Custom Property Engine
 * Clean, simple aesthetic where the main color is white (#ffffff),
 * with 1st (Primary), 2nd (Secondary), and 3rd (Accent) colors
 * fully configurable by the cafe manager in the admin portal.
 */

export const THEME_PRESETS = [
  {
    id: 'showcase',
    layout: 'bento',
    name: 'Modern Bento (Clean White)',
    archetype: 'Modern Cafe & Fast Casual',
    cardStyle: 'Floating Bento Cards with Quick Badges',
    navStyle: 'Top Floating App Bar with Integrated Search',
    landingStyle: 'Interactive Smartphone Splash Screen',
    tagline: 'Clean white canvas, charcoal slate buttons, cool slate borders & amber honey accents.',
    previewColors: ['#ffffff', '#1c2826', '#64748b', '#e6923c'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#1c2826',     // 1st color (Brand Primary / Buttons / Titles)
    secondaryColor: '#64748b',   // 2nd color (Borders / Sub-Pills / Frames)
    accentColor: '#e6923c',      // 3rd color (Prices / Stars / Highlights)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'emerald',
    layout: 'editorial',
    name: 'Haute Cuisine Editorial (White & Gold)',
    archetype: 'Fine Dining, Rooftops & Wine Lounges',
    cardStyle: 'Magazine Split Cards with Serif Typography',
    navStyle: 'Minimalist Centered Serif Header with Gold Hairlines',
    landingStyle: 'Grand Haute Cuisine Editorial Cover',
    tagline: 'Clean white canvas, deep emerald typography, gold hairline framing & champagne tags.',
    previewColors: ['#ffffff', '#064e3b', '#92400e', '#d97706'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#064e3b',     // 1st color (Haute Emerald)
    secondaryColor: '#92400e',   // 2nd color (Gold Hairline / Crests)
    accentColor: '#d97706',      // 3rd color (Champagne Tasting Badges & Prices)
    fontFamily: 'Playfair Display',
  },
  {
    id: 'terracotta',
    layout: 'rustic',
    name: 'Wood-Fired Rustic Hearth (White & Flame)',
    archetype: 'Pizzerias, Smash Burgers & Steakhouses',
    cardStyle: 'Bold Hearth Cards with Flame Badges & Tactile Borders',
    navStyle: 'Sturdy Bistro Header with Fire Badges & Stamp Tags',
    landingStyle: 'Glowing Embers & Wood-Fired Hearth Cover',
    tagline: 'Clean white canvas, bold flame orange buttons, charred clay borders & ember gold tags.',
    previewColors: ['#ffffff', '#ea580c', '#7c2d12', '#f59e0b'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#ea580c',     // 1st color (Flame Orange)
    secondaryColor: '#7c2d12',   // 2nd color (Charred Clay / Terracotta Borders)
    accentColor: '#f59e0b',      // 3rd color (Ember Gold Price Tags & Stars)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'pastel',
    layout: 'boutique',
    name: 'Parisian Patisserie (White & Rose)',
    archetype: 'Bakeries, Confectioneries & Brunch Tea Rooms',
    cardStyle: 'Soft Rounded Pill Cards with Delicate Rose Badges',
    navStyle: 'Boutique Blush Header with Sweet Confectionery Branding',
    landingStyle: 'Pastel Vignette & French Patisserie Cover',
    tagline: 'Clean white canvas, blush rose branding, velvet petal borders & sweet mint tags.',
    previewColors: ['#ffffff', '#db2777', '#831843', '#059669'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#db2777',     // 1st color (Blush Rose)
    secondaryColor: '#831843',   // 2nd color (Velvet Mauve Borders & Rings)
    accentColor: '#059669',      // 3rd color (Mint Pistachio & Sweet Tags)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'neon-noir',
    layout: 'noir',
    name: 'Tokyo Neon Tech (White & Cyan)',
    archetype: 'Cocktail Lounges, Cyber Cafes & Late-Night Bars',
    cardStyle: 'Glassmorphic Clean Cards with Glowing Cyan Edges',
    navStyle: 'Cyberpunk Luminous App Bar with Neon Cyan Badges',
    landingStyle: 'Tokyo Midnight Skyline & Neon Hologram Cover',
    tagline: 'Clean white canvas, electric cyan cyber borders, neon violet accents & digital teal HUD.',
    previewColors: ['#ffffff', '#0891b2', '#7c3aed', '#0d9488'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
    primaryColor: '#0891b2',     // 1st color (Electric Cyan)
    secondaryColor: '#7c3aed',   // 2nd color (Neon Violet Scanlines & Accents)
    accentColor: '#0d9488',      // 3rd color (Digital Teal HUD Price Chips)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'espresso',
    layout: 'bento',
    name: 'Artisan Roastery & Amber (White & Espresso)',
    archetype: 'Traditional Coffee Roastery & Habesha Dining',
    cardStyle: 'Warm Bento Cards with Caramel Accents',
    navStyle: 'Traditional Roastery Bar with Honey Gold Accents',
    landingStyle: 'Authentic Buna & Roaster Heritage Cover',
    tagline: 'Clean white canvas, dark espresso roast, warm caramel borders & honey gold.',
    previewColors: ['#ffffff', '#78350f', '#92400e', '#d97706'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#78350f',     // 1st color (Dark Espresso Roast)
    secondaryColor: '#92400e',   // 2nd color (Toasted Caramel Borders)
    accentColor: '#d97706',      // 3rd color (Honey Gold Price Chips)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'minimalist',
    layout: 'minimal',
    name: 'Scandinavian Minimalist (Pure White & Sage)',
    archetype: 'High-Concept Cafes & Concept Bakeries',
    cardStyle: 'Ultra-Clean Borderless List with Subtle Sage Dividers',
    navStyle: 'Typography-First Floating Header with Minimal Sans Badges',
    landingStyle: 'Whitespace-Driven Nordic Botanical Cover',
    tagline: 'Pure white canvas, deep charcoal typography, cool slate framing & calm sage accents.',
    previewColors: ['#ffffff', '#0f172a', '#94a3b8', '#059669'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
    primaryColor: '#0f172a',     // 1st color (Deep Charcoal)
    secondaryColor: '#94a3b8',   // 2nd color (Cool Slate Hairline)
    accentColor: '#059669',      // 3rd color (Calm Sage Green)
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
    backgroundColor: theme.backgroundColor || '#ffffff',
    surfaceColor: theme.surfaceColor || '#ffffff',
    textColor: theme.textColor || '#111827',
    primaryColor: theme.primaryColor || preset.primaryColor || '#1c2826',
    secondaryColor: theme.secondaryColor || preset.secondaryColor || '#64748b',
    accentColor: theme.accentColor || preset.accentColor || '#e6923c',
  };

  root.setAttribute('data-theme-layout', effective.layout);
  root.setAttribute('data-theme-preset', effective.id);
  if (typeof document !== 'undefined' && document.body) {
    document.body.setAttribute('data-theme-layout', effective.layout);
    document.body.setAttribute('data-theme-preset', effective.id);
  }

  // Set Core 1st, 2nd, and 3rd Colors + White Canvas
  root.style.setProperty('--cm-bg', effective.backgroundColor);
  root.style.setProperty('--cm-card-bg', effective.surfaceColor);
  root.style.setProperty('--cm-text-dark', effective.textColor);
  root.style.setProperty('--cm-text-muted', '#64748b');
  root.style.setProperty('--cm-primary', effective.primaryColor);
  root.style.setProperty('--cm-secondary', effective.secondaryColor);
  root.style.setProperty('--cm-accent', effective.accentColor);
  root.style.setProperty('--cm-amber', effective.accentColor);
  root.style.setProperty('--cm-star', effective.accentColor);
  root.style.setProperty('--cm-btn-dark', effective.primaryColor);
  root.style.setProperty('--cm-btn-dark-hover', effective.secondaryColor);
  root.style.setProperty('--cm-border', `${effective.secondaryColor}30`);
  root.style.setProperty('--cm-border-strong', `${effective.secondaryColor}60`);

  // Generic platform CSS variable bridges
  root.style.setProperty('--bg', effective.backgroundColor);
  root.style.setProperty('--bg-2', '#f9fafb');
  root.style.setProperty('--bg-3', '#f3f4f6');
  root.style.setProperty('--surface', effective.surfaceColor);
  root.style.setProperty('--surface-card', effective.surfaceColor);
  root.style.setProperty('--surface-strong', effective.surfaceColor);
  root.style.setProperty('--text', effective.textColor);
  root.style.setProperty('--text-secondary', '#4b5563');
  root.style.setProperty('--muted', '#6b7280');
  root.style.setProperty('--accent', effective.primaryColor);
  root.style.setProperty('--accent-2', effective.secondaryColor);
  root.style.setProperty('--accent-gold', effective.accentColor);
  root.style.setProperty('--border', `${effective.secondaryColor}30`);
  root.style.setProperty('--border-glow', `${effective.primaryColor}50`);

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
}
