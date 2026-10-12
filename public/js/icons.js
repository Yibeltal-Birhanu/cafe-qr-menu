'use strict';

/**
 * Hand-drawn SVG illustrations, one per menu category.
 * Every illustration is built from a few animated parts, driven by the
 * `.ill-*` classes in css/style.css (bob, steam, rays, bubbles, ...).
 */
(function () {
  const icons = {
    burger: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Burger illustration">
  <defs>
    <linearGradient id="bg-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8c77e"/><stop offset="1" stop-color="#d9862f"/>
    </linearGradient>
    <linearGradient id="bg-bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e0a052"/><stop offset="1" stop-color="#b96f22"/>
    </linearGradient>
  </defs>
  <g class="ill-steam-group" fill="none" stroke="#f5e6d3" stroke-width="4" stroke-linecap="round" opacity=".75">
    <path class="ill-steam" d="M62 44c-8-8 8-14 0-24"/>
    <path class="ill-steam ill-delay-1" d="M80 40c-8-8 8-14 0-24"/>
    <path class="ill-steam ill-delay-2" d="M98 44c-8-8 8-14 0-24"/>
  </g>
  <ellipse class="ill-shadow" cx="80" cy="142" rx="44" ry="7" fill="#2b1810" opacity=".16"/>
  <g class="ill-bob">
    <path d="M28 76a52 40 0 0 1 104 0z" fill="url(#bg-top)"/>
    <g fill="#fff6e6" opacity=".9">
      <ellipse cx="58" cy="56" rx="5" ry="3" transform="rotate(-20 58 56)"/>
      <ellipse cx="79" cy="48" rx="5" ry="3" transform="rotate(-8 79 48)"/>
      <ellipse cx="99" cy="58" rx="5" ry="3" transform="rotate(16 99 58)"/>
      <ellipse cx="70" cy="68" rx="4" ry="2.4" transform="rotate(-16 70 68)"/>
      <ellipse cx="92" cy="70" rx="4" ry="2.4" transform="rotate(12 92 70)"/>
    </g>
    <path d="M24 78h112c2 6-8 5-14 9-7-6-15 3-22-3-8 5-14-2-22 3-9-5-16 2-24-4-10 3-18-6-16-5z" fill="#7dc242"/>
    <path d="M30 86h100l-10 13H40z" fill="#f9c74f"/>
    <rect x="28" y="96" width="104" height="19" rx="9.5" fill="#8b4a2b"/>
    <path d="M28 116h104a13 13 0 0 1-13 15H41a13 13 0 0 1-13-15z" fill="url(#bg-bottom)"/>
  </g>
</svg>`,

    pizza: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Pizza illustration">
  <defs>
    <linearGradient id="pz-cheese" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd76e"/><stop offset="1" stop-color="#f2ac3b"/>
    </linearGradient>
  </defs>
  <ellipse class="ill-shadow" cx="80" cy="142" rx="40" ry="7" fill="#2b1810" opacity=".16"/>
  <g class="ill-tilt">
    <path d="M80 24 132 122a10 10 0 0 1-9 15H37a10 10 0 0 1-9-15z" fill="url(#pz-cheese)"/>
    <path d="M80 24 132 122a10 10 0 0 1-9 15H37a10 10 0 0 1-9-15z" fill="none" stroke="#e39a2c" stroke-width="4"/>
    <path d="M80 30 126 120c3 6-3 12-9 12H43c-6 0-12-6-9-12z" fill="#f7b955"/>
    <path d="M62 34h36a9 9 0 0 1 0 12H62a9 9 0 0 1 0-12z" fill="#d9862f"/>
    <g fill="#d94b3d">
      <circle class="ill-pop" cx="70" cy="75" r="8"/>
      <circle class="ill-pop ill-delay-1" cx="92" cy="92" r="7"/>
      <circle class="ill-pop ill-delay-2" cx="76" cy="112" r="7"/>
    </g>
    <g fill="#5e9c3a">
      <ellipse cx="94" cy="66" rx="6" ry="4" transform="rotate(24 94 66)"/>
      <ellipse cx="62" cy="98" rx="6" ry="4" transform="rotate(-30 62 98)"/>
    </g>
  </g>
</svg>`,

    coffee: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Coffee cup illustration">
  <g class="ill-steam-group" fill="none" stroke="#cbb9a8" stroke-width="4" stroke-linecap="round" opacity=".8">
    <path class="ill-steam" d="M66 52c-8-8 8-14 0-24"/>
    <path class="ill-steam ill-delay-1" d="M84 48c-8-8 8-14 0-24"/>
  </g>
  <g class="ill-bob">
    <path d="M104 76h16a16 16 0 0 1 0 32h-8" fill="none" stroke="#e8e3dc" stroke-width="9" stroke-linecap="round"/>
    <path d="M52 68h72l-8 46a14 14 0 0 1-14 12H74a14 14 0 0 1-14-12z" fill="#fdfaf6"/>
    <path d="M56 74h64l-7 38a10 10 0 0 1-10 9H73a10 10 0 0 1-10-9z" fill="#a9683d"/>
    <path d="M56 74h64l-2 10H58z" fill="#c98a55" opacity=".8"/>
    <ellipse cx="88" cy="132" rx="46" ry="8" fill="#e8e3dc"/>
    <ellipse cx="88" cy="130" rx="46" ry="7" fill="#fdfaf6"/>
  </g>
</svg>`,

    tea: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Tea illustration">
  <g class="ill-steam-group" fill="none" stroke="#cbb9a8" stroke-width="4" stroke-linecap="round" opacity=".8">
    <path class="ill-steam" d="M70 52c-8-8 8-14 0-24"/>
    <path class="ill-steam ill-delay-1" d="M88 48c-8-8 8-14 0-24"/>
  </g>
  <g class="ill-bob">
    <path d="M40 74h78v34a22 22 0 0 1-22 22H62a22 22 0 0 1-22-22z" fill="#fdfaf6"/>
    <path d="M46 80h66v26a16 16 0 0 1-16 16H62a16 16 0 0 1-16-16z" fill="#b5893f"/>
    <path d="M118 82h10a14 14 0 0 1 0 28h-12" fill="none" stroke="#fdfaf6" stroke-width="8" stroke-linecap="round"/>
    <path d="M40 74h78" stroke="#e8e3dc" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="79" cy="132" rx="42" ry="8" fill="#e8e3dc"/>
    <ellipse cx="79" cy="130" rx="42" ry="7" fill="#fdfaf6"/>
    <ellipse cx="79" cy="80" rx="30" ry="6" fill="#c9781f" opacity=".85"/>
  </g>
</svg>`,

    drinks: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Cold drink illustration">
  <defs>
    <linearGradient id="dr-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffb457"/><stop offset="1" stop-color="#f0824c"/>
    </linearGradient>
  </defs>
  <g class="ill-bob">
    <path d="M62 42h34l-6 12H68z" fill="none"/>
    <path d="M96 26l-10 44" stroke="#4fb3d9" stroke-width="8" stroke-linecap="round"/>
    <path d="M50 60h64l-9 62a14 14 0 0 1-14 12H73a14 14 0 0 1-14-12z" fill="#eaf6fb" opacity=".95"/>
    <path d="M54 86h56l-6 36a10 10 0 0 1-10 9H70a10 10 0 0 1-10-9z" fill="url(#dr-fill)"/>
    <ellipse cx="82" cy="62" rx="30" ry="7" fill="#f6fbfd"/>
    <g fill="#fff" opacity=".75">
      <circle class="ill-bubble" cx="74" cy="120" r="4"/>
      <circle class="ill-bubble ill-delay-1" cx="86" cy="112" r="3"/>
      <circle class="ill-bubble ill-delay-2" cx="92" cy="126" r="3.5"/>
    </g>
    <g fill="#ffd76e" opacity=".85">
      <rect x="88" y="52" width="14" height="14" rx="3" transform="rotate(18 95 59)"/>
    </g>
    <ellipse cx="82" cy="136" rx="38" ry="7" fill="#2b1810" opacity=".12"/>
  </g>
</svg>`,

    dessert: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Dessert illustration">
  <defs>
    <linearGradient id="ds-cream" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff1f7"/><stop offset="1" stop-color="#f7c6dc"/>
    </linearGradient>
  </defs>
  <ellipse class="ill-shadow" cx="80" cy="140" rx="40" ry="7" fill="#2b1810" opacity=".14"/>
  <g class="ill-bob">
    <path d="M40 70h80l-8 12H48z" fill="#f3a6c4"/>
    <path d="M46 82h68l-6 40a14 14 0 0 1-14 12H66a14 14 0 0 1-14-12z" fill="#a9713f"/>
    <path d="M52 88h56l-3 20H55z" fill="#c98a55" opacity=".7"/>
    <path d="M38 70c0-14 12-22 22-22 4-14 22-16 28-6 14-4 26 6 26 16 8 2 10 12 6 12z" fill="url(#ds-cream)"/>
    <circle class="ill-pop" cx="80" cy="34" r="8" fill="#e0475b"/>
    <path d="M80 26c4-8 12-10 16-8-4 2-6 6-6 10z" fill="#5e9c3a"/>
    <g fill="#f9c74f">
      <rect class="ill-sprinkle" x="58" y="64" width="8" height="3" rx="1.5"/>
      <rect class="ill-sprinkle ill-delay-1" x="72" y="70" width="8" height="3" rx="1.5"/>
      <rect class="ill-sprinkle ill-delay-2" x="92" y="64" width="8" height="3" rx="1.5"/>
    </g>
  </g>
</svg>`,

    breakfast: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Breakfast illustration">
  <g class="ill-rays" stroke="#f9c74f" stroke-width="5" stroke-linecap="round" opacity=".7">
    <path d="M80 14v14"/><path d="M124 30l-10 10"/><path d="M140 74h-14"/>
    <path d="M36 30l10 10"/><path d="M20 74h14"/><path d="M80 118v14"/>
  </g>
  <g class="ill-bob">
    <path d="M32 84h96c0 22-16 38-36 38H68c-20 0-36-16-36-38z" fill="#fdfaf6"/>
    <path d="M42 90h76c0 16-12 26-26 26H68c-14 0-26-10-26-26z" fill="#fffdfa"/>
    <ellipse cx="80" cy="90" rx="22" ry="14" fill="#f9c74f"/>
    <circle cx="80" cy="86" r="10" fill="#f2a33c"/>
    <g fill="#e05e4a" opacity=".9">
      <ellipse cx="60" cy="102" rx="7" ry="5"/>
      <ellipse cx="102" cy="102" rx="7" ry="5"/>
    </g>
    <path d="M118 66l12-22" stroke="#a9713f" stroke-width="7" stroke-linecap="round"/>
    <path d="M126 40l6-10" stroke="#a9713f" stroke-width="9" stroke-linecap="round"/>
  </g>
</svg>`,

    salad: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Salad illustration">
  <g class="ill-sway">
    <path d="M40 74h80c0 26-18 44-40 44S40 100 40 74z" fill="#eef6ea"/>
    <path d="M46 80h68c0 20-14 32-34 32s-34-12-34-32z" fill="#f7fbf3"/>
    <g class="ill-bob">
      <ellipse cx="62" cy="74" rx="20" ry="14" fill="#5e9c3a"/>
      <ellipse cx="92" cy="70" rx="22" ry="15" fill="#7dc242"/>
      <ellipse cx="78" cy="64" rx="18" ry="12" fill="#4f8f2f"/>
      <circle cx="104" cy="80" r="9" fill="#e0475b"/>
      <circle cx="60" cy="82" r="8" fill="#e0475b"/>
      <circle cx="82" cy="84" r="7" fill="#f9c74f"/>
      <ellipse cx="72" cy="74" rx="6" ry="4" fill="#a9713f" transform="rotate(20 72 74)"/>
    </g>
    <path d="M120 58l6-24" stroke="#a9713f" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>`,

    sandwich: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Sandwich illustration">
  <ellipse class="ill-shadow" cx="80" cy="140" rx="42" ry="7" fill="#2b1810" opacity=".14"/>
  <g class="ill-bob">
    <path d="M32 30h96l-6 30H38z" fill="#e8b16a"/>
    <path d="M34 34h92l-4 22H38z" fill="#f5cf95"/>
    <path d="M30 62h100v10H30z" fill="#7dc242"/>
    <path d="M32 74h96v12H32z" fill="#f9c74f"/>
    <circle cx="56" cy="80" r="6" fill="#e0475b" opacity=".9"/>
    <path d="M32 88h96v12H32z" fill="#a9713f"/>
    <path d="M32 102h96v10H32z" fill="#7dc242"/>
    <path d="M32 114h96l-6 18H38z" fill="#e8b16a"/>
  </g>
</svg>`,

    fries: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Fries illustration">
  <ellipse class="ill-shadow" cx="80" cy="140" rx="40" ry="7" fill="#2b1810" opacity=".14"/>
  <g class="ill-bob">
    <g fill="#f9c74f">
      <rect class="ill-fry" x="56" y="30" width="11" height="52" rx="5"/>
      <rect class="ill-fry ill-delay-1" x="72" y="20" width="11" height="62" rx="5"/>
      <rect class="ill-fry ill-delay-2" x="88" y="28" width="11" height="54" rx="5"/>
      <rect class="ill-fry ill-delay-1" x="104" y="36" width="11" height="46" rx="5"/>
    </g>
    <path d="M44 74h72l-8 46a14 14 0 0 1-14 12H66a14 14 0 0 1-14-12z" fill="#e0475b"/>
    <path d="M49 80h62l-3 18H52z" fill="#f06a72" opacity=".8"/>
    <path d="M74 96h12l-6 10z" fill="#fff" opacity=".85"/>
  </g>
</svg>`,

    default: `
<svg viewBox="0 0 160 160" class="ill" role="img" aria-label="Menu illustration">
  <g class="ill-bob">
    <rect x="36" y="26" width="88" height="112" rx="12" fill="#fdfaf6"/>
    <rect x="36" y="26" width="88" height="112" rx="12" fill="none" stroke="#e8d9c5" stroke-width="4"/>
    <path d="M68 20h24v12H68z" fill="#a9713f"/>
    <path d="M82 14a8 8 0 1 0-6 14h12a8 8 0 1 0-6-14z" fill="#c98a55"/>
    <g fill="#e8d9c5">
      <rect x="52" y="56" width="56" height="8" rx="4"/>
      <rect x="52" y="74" width="42" height="8" rx="4"/>
      <rect x="52" y="92" width="50" height="8" rx="4"/>
      <rect x="52" y="110" width="34" height="8" rx="4"/>
    </g>
  </g>
</svg>`,
  };

  window.CategoryIcons = icons;
  window.CategoryIconKeys = Object.keys(icons);
  window.renderCategoryIcon = function (key) {
    return icons[key] || icons.default;
  };
})();
