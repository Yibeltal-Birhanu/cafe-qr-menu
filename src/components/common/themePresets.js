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
    accentColor: '#e6923c',      // 3rd color (Prices / Highlights)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'emerald',
    layout: 'editorial',
    name: 'Editorial Reserve (White & Gold)',
    archetype: 'Fine Dining, Rooftops & Wine Lounges',
    cardStyle: 'Magazine Split Cards with Serif Typography',
    navStyle: 'Minimalist Centered Serif Header with Gold Hairlines',
    landingStyle: 'Editorial Reserve Cover',
    tagline: 'Clean white canvas, deep emerald typography, gold hairline framing & warm amber tags.',
    previewColors: ['#ffffff', '#064e3b', '#92400e', '#d97706'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#064e3b',     // 1st color (Haute Emerald)
    secondaryColor: '#92400e',   // 2nd color (Gold Hairline / Borders)
    accentColor: '#d97706',      // 3rd color (Amber Highlights & Prices)
    fontFamily: 'Playfair Display',
  },
  {
    id: 'terracotta',
    layout: 'rustic',
    name: 'Wood-Fired Hearth (White & Terracotta)',
    archetype: 'Pizzerias, Smash Burgers & Grills',
    cardStyle: 'Bold Cards with Flame Badges & Clean Borders',
    navStyle: 'Sturdy Bistro Header with Stamp Tags',
    landingStyle: 'Wood-Fired Kitchen Cover',
    tagline: 'Clean white canvas, warm terracotta buttons, clay borders & amber accents.',
    previewColors: ['#ffffff', '#ea580c', '#7c2d12', '#f59e0b'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#ea580c',     // 1st color (Flame Terracotta)
    secondaryColor: '#7c2d12',   // 2nd color (Charred Clay Borders)
    accentColor: '#f59e0b',      // 3rd color (Amber Price Tags)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'pastel',
    layout: 'boutique',
    name: 'Artisan Patisserie (White & Rose)',
    archetype: 'Bakeries, Confectioneries & Brunch Cafes',
    cardStyle: 'Soft Rounded Cards with Rose Badges',
    navStyle: 'Boutique Header with Clean Branding',
    landingStyle: 'Artisan Patisserie Cover',
    tagline: 'Clean white canvas, blush rose branding, velvet mauve borders & mint accents.',
    previewColors: ['#ffffff', '#db2777', '#831843', '#059669'],
    backgroundColor: '#ffffff',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#111827',
    primaryColor: '#db2777',     // 1st color (Blush Rose)
    secondaryColor: '#831843',   // 2nd color (Velvet Mauve Borders)
    accentColor: '#059669',      // 3rd color (Mint Green Highlights)
    fontFamily: 'Plus Jakarta Sans',
  },
  {
    id: 'neon-noir',
    layout: 'noir',
    name: 'Evening Lounge & Cyan (Midnight & Neon Teal)',
    archetype: 'Cocktail Lounges, Rooftops & Evening Dining',
    cardStyle: 'Obsidian Glass Cards with Electric Cyan Accents',
    navStyle: 'Sleek Midnight Glass Header with Cyan Glow',
    landingStyle: 'Evening Lounge & Signature Drinks Cover',
    tagline: 'Deep obsidian canvas, electric cyan accents, subtle glassmorphic glow.',
    previewColors: ['#090a0f', '#06b6d4', '#1e293b', '#22d3ee'],
    backgroundColor: '#090a0f',
    backgroundMode: 'dark',
    surfaceColor: '#12151e',
    textColor: '#f8fafc',
    primaryColor: '#06b6d4',     // 1st color (Electric Cyan)
    secondaryColor: '#334155',   // 2nd color (Midnight Slate Borders)
    accentColor: '#22d3ee',      // 3rd color (Vibrant Neon Teal Price Chips)
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
    archetype: 'Specialty Cafes & Modern Kitchens',
    cardStyle: 'Porcelain Nordic Cards with Botanical Badges',
    navStyle: 'Architectural Minimalist Header with Location Pin',
    landingStyle: 'Nordic Atelier Dining Cover',
    tagline: 'Warm limestone canvas, deep charcoal typography, botanical sage framing & warm clay accents.',
    previewColors: ['#faf9f5', '#191c1b', '#5d7a68', '#c86245'],
    backgroundColor: '#faf9f5',
    backgroundMode: 'light',
    surfaceColor: '#ffffff',
    textColor: '#191c1b',
    primaryColor: '#191c1b',     // 1st color (Deep Charcoal Smoked Oak)
    secondaryColor: '#5d7a68',   // 2nd color (Botanical Sage Green)
    accentColor: '#c86245',      // 3rd color (Warm Nordic Clay / Terracotta)
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

  // Set Core 1st, 2nd, and 3rd Colors + Canvas
  root.style.setProperty('--cm-bg', effective.backgroundColor);
  root.style.setProperty('--cm-card-bg', effective.surfaceColor);
  root.style.setProperty('--cm-text-dark', effective.textColor);
  root.style.setProperty('--cm-text-muted', effective.layout === 'noir' ? '#94a3b8' : '#64748b');
  root.style.setProperty('--cm-primary', effective.primaryColor);
  root.style.setProperty('--cm-secondary', effective.secondaryColor);
  root.style.setProperty('--cm-accent', effective.accentColor);
  root.style.setProperty('--cm-amber', effective.accentColor);
  root.style.setProperty('--cm-star', effective.accentColor);
  root.style.setProperty('--cm-btn-dark', effective.primaryColor);
  root.style.setProperty('--cm-btn-dark-hover', effective.secondaryColor);
  root.style.setProperty('--cm-border', effective.layout === 'noir' ? 'rgba(6, 182, 212, 0.22)' : `${effective.secondaryColor}30`);
  root.style.setProperty('--cm-border-strong', effective.layout === 'noir' ? '#06b6d4' : `${effective.secondaryColor}60`);

  // Generic platform CSS variable bridges
  root.style.setProperty('--bg', effective.backgroundColor);
  root.style.setProperty('--bg-2', effective.layout === 'noir' ? '#0f1118' : '#f9fafb');
  root.style.setProperty('--bg-3', effective.layout === 'noir' ? '#161922' : '#f3f4f6');
  root.style.setProperty('--surface', effective.surfaceColor);
  root.style.setProperty('--surface-card', effective.surfaceColor);
  root.style.setProperty('--surface-strong', effective.layout === 'noir' ? '#161922' : effective.surfaceColor);
  root.style.setProperty('--text', effective.textColor);
  root.style.setProperty('--text-secondary', effective.layout === 'noir' ? '#94a3b8' : '#4b5563');
  root.style.setProperty('--muted', effective.layout === 'noir' ? '#64748b' : '#6b7280');
  root.style.setProperty('--accent', effective.primaryColor);
  root.style.setProperty('--accent-2', effective.secondaryColor);
  root.style.setProperty('--accent-gold', effective.accentColor);
  root.style.setProperty('--border', effective.layout === 'noir' ? 'rgba(6, 182, 212, 0.22)' : `${effective.secondaryColor}30`);
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
