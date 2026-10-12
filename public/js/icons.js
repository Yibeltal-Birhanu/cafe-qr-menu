'use strict';

/**
 * Handcrafted animated SVG food illustrations for Prism Cafe QR menu.
 * Driven by the CSS animation system (.ill-bob, .ill-steam, .ill-tilt, .ill-pop,
 * .ill-bubble, .ill-sway, .ill-sprinkle, .ill-twinkle, .ill-fry, etc.).
 */
(function () {
  const icons = {
    burger: `
<svg viewBox="0 0 160 160" class="ill ill--burger" role="img" aria-label="Gourmet Burger illustration">
  <defs>
    <linearGradient id="bg-bun-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/><stop offset="60%" stop-color="#d97706"/><stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="bg-bun-bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <linearGradient id="bg-patty" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#78350f"/><stop offset="60%" stop-color="#542407"/><stop offset="100%" stop-color="#3b1704"/>
    </linearGradient>
    <linearGradient id="bg-cheese" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow-warm" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Ambient steam curls rising from the flame-grilled burger -->
  <g class="ill-steam-group" fill="none" stroke="#fde68a" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
    <path class="ill-steam" d="M56 36c-7-7 6-13 0-22"/>
    <path class="ill-steam ill-delay-1" d="M80 30c-7-7 6-13 0-22"/>
    <path class="ill-steam ill-delay-2" d="M104 36c-7-7 6-13 0-22"/>
  </g>

  <!-- Ground contact shadow -->
  <ellipse class="ill-shadow" cx="80" cy="144" rx="46" ry="7" fill="#1e130c" opacity="0.4"/>

  <!-- Interactive bobbing burger stack -->
  <g class="ill-bob">
    <!-- Top Brioche Crown -->
    <path d="M26 72 C 26 34, 134 34, 134 72 Z" fill="url(#bg-bun-top)"/>
    <path d="M30 68 C 34 40, 126 40, 130 68" fill="none" stroke="#fef3c7" stroke-width="2" opacity="0.35"/>

    <!-- Glistening toasted sesame seeds -->
    <g fill="#fffbeb" class="ill-twinkle">
      <ellipse cx="54" cy="48" rx="4" ry="2.2" transform="rotate(-22 54 48)"/>
      <ellipse cx="78" cy="42" rx="4.5" ry="2.2" transform="rotate(-6 78 42)"/>
      <ellipse cx="102" cy="48" rx="4.2" ry="2.2" transform="rotate(20 102 48)"/>
      <ellipse cx="66" cy="58" rx="3.8" ry="2" transform="rotate(-14 66 58)"/>
      <ellipse cx="90" cy="58" rx="3.8" ry="2" transform="rotate(12 90 58)"/>
      <ellipse cx="114" cy="62" rx="3" ry="1.8" transform="rotate(26 114 62)"/>
    </g>

    <!-- Fresh Ruffled Green Lettuce -->
    <path class="ill-sway" d="M22 74 C 28 68, 38 78, 48 72 C 58 78, 68 68, 78 74 C 88 68, 98 78, 108 72 C 118 78, 128 68, 138 74 L 138 80 C 126 84, 116 78, 106 82 C 94 76, 84 84, 72 78 C 60 84, 50 76, 38 82 C 28 76, 20 80, 22 74 Z" fill="#84cc16"/>
    <path d="M26 76 C 36 71, 46 80, 56 74 C 66 80, 76 72, 86 76 C 96 72, 106 80, 116 74 C 126 80, 134 74, 134 76" fill="none" stroke="#bef264" stroke-width="2" opacity="0.6"/>

    <!-- Melted Cheddar draping over patty -->
    <path d="M28 82 L 132 82 L 126 95 L 110 87 L 96 100 L 78 86 L 62 98 L 48 86 L 36 94 Z" fill="url(#bg-cheese)"/>

    <!-- Juicy Grilled Beef Patty with grill marks -->
    <rect x="25" y="94" width="110" height="20" rx="10" fill="url(#bg-patty)"/>
    <!-- Grill marks -->
    <g stroke="#260f03" stroke-width="3" stroke-linecap="round" opacity="0.7">
      <line x1="44" y1="97" x2="40" y2="111"/>
      <line x1="64" y1="97" x2="60" y2="111"/>
      <line x1="84" y1="97" x2="80" y2="111"/>
      <line x1="104" y1="97" x2="100" y2="111"/>
      <line x1="120" y1="98" x2="117" y2="110"/>
    </g>

    <!-- Sliced Pickles / Onion slivers -->
    <g fill="#4ade80" opacity="0.9">
      <ellipse cx="48" cy="94" rx="11" ry="4"/>
      <ellipse cx="112" cy="94" rx="11" ry="4"/>
    </g>

    <!-- Bottom Bun Heel -->
    <path d="M26 114 C 26 114, 28 132, 42 134 L 118 134 C 132 132, 134 114, 134 114 Z" fill="url(#bg-bun-bottom)"/>
  </g>
</svg>`,

    pizza: `
<svg viewBox="0 0 160 160" class="ill ill--pizza" role="img" aria-label="Stone-Baked Pizza illustration">
  <defs>
    <linearGradient id="pz-crust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="pz-cheese" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef08a"/><stop offset="60%" stop-color="#facc15"/><stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
    <linearGradient id="pz-pep" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>

  <g class="ill-steam-group" fill="none" stroke="#fde68a" stroke-width="3" stroke-linecap="round" opacity="0.8">
    <path class="ill-steam" d="M72 26c-6-6 6-12 0-18"/>
    <path class="ill-steam ill-delay-1" d="M92 22c-6-6 6-12 0-18"/>
  </g>

  <ellipse class="ill-shadow" cx="80" cy="144" rx="42" ry="7" fill="#1e130c" opacity="0.38"/>

  <g class="ill-tilt">
    <!-- Outer Crispy Crust Edge -->
    <path d="M80 20 L 136 124 C 130 138, 30 138, 24 124 Z" fill="url(#pz-crust)"/>
    <!-- Thick stone-baked rear crust roll -->
    <path d="M26 122 C 40 140, 120 140, 134 122 C 128 114, 32 114, 26 122 Z" fill="#92400e"/>
    <path d="M30 126 C 50 138, 110 138, 130 126" stroke="#fcd34d" stroke-width="3" fill="none" opacity="0.4"/>

    <!-- Melted Mozzarella Core with pull strings -->
    <path d="M80 28 L 126 118 C 114 128, 46 128, 34 118 Z" fill="url(#pz-cheese)"/>

    <!-- Spicy Pepperoni Slices with sizzling shine -->
    <g>
      <g class="ill-pop">
        <circle cx="68" cy="74" r="9" fill="url(#pz-pep)"/>
        <circle cx="66" cy="71" r="2.5" fill="#fca5a5" opacity="0.75"/>
      </g>
      <g class="ill-pop ill-delay-1">
        <circle cx="94" cy="92" r="8.5" fill="url(#pz-pep)"/>
        <circle cx="92" cy="89" r="2.2" fill="#fca5a5" opacity="0.75"/>
      </g>
      <g class="ill-pop ill-delay-2">
        <circle cx="74" cy="112" r="8" fill="url(#pz-pep)"/>
        <circle cx="72" cy="110" r="2" fill="#fca5a5" opacity="0.75"/>
      </g>
      <circle cx="84" cy="52" r="7" fill="url(#pz-pep)"/>
    </g>

    <!-- Fresh Garden Basil Leaves -->
    <g fill="#65a30d" class="ill-sway">
      <path d="M96 66 C 104 62, 106 72, 94 74 C 92 68, 94 66, 96 66 Z"/>
      <path d="M58 96 C 50 92, 54 104, 64 102 C 62 96, 60 96, 58 96 Z"/>
    </g>

    <!-- Oregano flecks & melting strings -->
    <g fill="#3f6212">
      <circle cx="78" cy="84" r="1.5"/><circle cx="86" cy="72" r="1.2"/>
      <circle cx="60" cy="82" r="1.3"/><circle cx="106" cy="104" r="1.5"/>
    </g>
  </g>
</svg>`,

    coffee: `
<svg viewBox="0 0 160 160" class="ill ill--coffee" role="img" aria-label="Espresso & Latte illustration">
  <defs>
    <linearGradient id="cf-cup" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e5e7eb"/>
    </linearGradient>
    <linearGradient id="cf-liquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#92400e"/><stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="cf-crema" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Steaming aromatic wisps -->
  <g class="ill-steam-group" fill="none" stroke="#fde68a" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
    <path class="ill-steam" d="M68 46c-7-8 7-14 0-24"/>
    <path class="ill-steam ill-delay-1" d="M88 42c-7-8 7-14 0-24"/>
  </g>

  <ellipse class="ill-shadow" cx="84" cy="142" rx="48" ry="7" fill="#1e130c" opacity="0.35"/>

  <g class="ill-bob">
    <!-- Porcelain Saucer -->
    <ellipse cx="84" cy="132" rx="48" ry="9" fill="#d1d5db"/>
    <ellipse cx="84" cy="130" rx="46" ry="8" fill="url(#cf-cup)"/>

    <!-- Cup Handle -->
    <path d="M112 76 C 136 76, 136 108, 112 110" fill="none" stroke="url(#cf-cup)" stroke-width="9" stroke-linecap="round"/>

    <!-- Ceramic Cup Body -->
    <path d="M52 64 L 116 64 C 114 110, 98 126, 84 126 C 70 126, 54 110, 52 64 Z" fill="url(#cf-cup)"/>
    <path d="M54 68 C 66 114, 80 122, 84 122" fill="none" stroke="#f3f4f6" stroke-width="4" opacity="0.7"/>

    <!-- Rich Crema Surface -->
    <ellipse cx="84" cy="66" rx="30" ry="9" fill="url(#cf-crema)"/>
    <ellipse cx="84" cy="66" rx="27" ry="7" fill="url(#cf-liquid)"/>

    <!-- Rosetta / Heart Latte Art Swirl -->
    <path class="ill-swirl" d="M84 62 C 81 59, 75 62, 78 66 C 81 70, 84 72, 84 72 C 84 72, 87 70, 90 66 C 93 62, 87 59, 84 62 Z" fill="#fffbeb"/>
    <path d="M84 61 L 84 71" stroke="#fef3c7" stroke-width="1.2" stroke-linecap="round"/>

    <!-- Single roasted coffee bean at base -->
    <ellipse cx="44" cy="133" rx="7" ry="4.5" fill="#451a03" transform="rotate(-18 44 133)"/>
    <path d="M42 129 C 45 133, 43 135, 46 137" stroke="#78350f" stroke-width="1.2" fill="none"/>
  </g>
</svg>`,

    drinks: `
<svg viewBox="0 0 160 160" class="ill ill--drinks" role="img" aria-label="Iced Refreshment illustration">
  <defs>
    <linearGradient id="dr-liquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="dr-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/>
    </linearGradient>
  </defs>

  <ellipse class="ill-shadow" cx="80" cy="144" rx="38" ry="6" fill="#1e130c" opacity="0.32"/>

  <g class="ill-bob">
    <!-- Striped Straw -->
    <g>
      <line x1="96" y1="20" x2="80" y2="80" stroke="#f43f5e" stroke-width="8" stroke-linecap="round"/>
      <line x1="96" y1="20" x2="80" y2="80" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-dasharray="8 8"/>
    </g>

    <!-- Fresh Lemon Wheel on the Rim -->
    <g transform="translate(102, 54)">
      <circle cx="0" cy="0" r="14" fill="#facc15"/>
      <circle cx="0" cy="0" r="11" fill="#fef08a"/>
      <g stroke="#eab308" stroke-width="1.5">
        <line x1="0" y1="-11" x2="0" y2="11"/>
        <line x1="-11" y1="0" x2="11" y2="0"/>
        <line x1="-8" y1="-8" x2="8" y2="8"/>
        <line x1="-8" y1="8" x2="8" y2="-8"/>
      </g>
    </g>

    <!-- Highball Glass Body -->
    <path d="M50 56 L 110 56 L 98 132 C 96 138, 64 138, 62 132 Z" fill="url(#dr-glass)" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>

    <!-- Cold Beverage Liquid -->
    <path d="M54 78 L 106 78 L 96 130 C 94 134, 66 134, 64 130 Z" fill="url(#dr-liquid)"/>

    <!-- Bobbing Ice Cubes -->
    <g fill="#e0f2fe" opacity="0.85">
      <rect x="62" y="84" width="16" height="16" rx="4" transform="rotate(12 70 92)"/>
      <rect x="80" y="98" width="16" height="16" rx="4" transform="rotate(-15 88 106)"/>
    </g>

    <!-- Effervescent Rising Fizz Bubbles -->
    <g fill="#ffffff" opacity="0.9">
      <circle class="ill-bubble" cx="72" cy="124" r="3.5"/>
      <circle class="ill-bubble ill-delay-1" cx="84" cy="116" r="2.8"/>
      <circle class="ill-bubble ill-delay-2" cx="92" cy="122" r="3"/>
      <circle class="ill-bubble" cx="68" cy="106" r="2.2"/>
      <circle class="ill-bubble ill-delay-1" cx="80" cy="94" r="2"/>
    </g>

    <!-- Glass Condensation Gleam -->
    <path d="M56 64 L 66 128" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  </g>
</svg>`,

    dessert: `
<svg viewBox="0 0 160 160" class="ill ill--dessert" role="img" aria-label="Decadent Dessert illustration">
  <defs>
    <linearGradient id="ds-cup" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
    <linearGradient id="ds-frost" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#fce7f3"/><stop offset="100%" stop-color="#fbcfe8"/>
    </linearGradient>
    <linearGradient id="ds-cherry" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
  </defs>

  <ellipse class="ill-shadow" cx="80" cy="144" rx="42" ry="7" fill="#1e130c" opacity="0.34"/>

  <!-- Twinkling stars around dessert -->
  <g fill="#fbbf24" class="ill-twinkle">
    <path d="M38 42 L 40 36 L 42 42 L 48 44 L 42 46 L 40 52 L 38 46 L 32 44 Z"/>
    <path d="M120 38 L 122 33 L 124 38 L 129 40 L 124 42 L 122 47 L 120 42 L 115 40 Z" class="ill-delay-1"/>
  </g>

  <g class="ill-bob">
    <!-- Fluted Cupcake Base / Mold -->
    <path d="M46 84 L 114 84 L 102 134 C 100 138, 60 138, 58 134 Z" fill="url(#ds-cup)"/>
    <g stroke="rgba(255,255,255,0.3)" stroke-width="2">
      <line x1="60" y1="86" x2="68" y2="134"/>
      <line x1="74" y1="86" x2="78" y2="135"/>
      <line x1="86" y1="86" x2="82" y2="135"/>
      <line x1="100" y1="86" x2="92" y2="134"/>
    </g>

    <!-- Swirled Whipped Vanilla & Strawberry Cream -->
    <path d="M38 84 C 38 68, 56 64, 66 68 C 68 54, 88 50, 96 62 C 108 58, 122 70, 122 84 Z" fill="url(#ds-frost)"/>
    <path d="M48 68 C 58 48, 102 48, 112 68" fill="none" stroke="#f472b6" stroke-width="4" opacity="0.6"/>

    <!-- Dripping Strawberry Glaze -->
    <path class="ill-drip" d="M48 84 C 54 94, 62 90, 68 84 C 76 96, 84 94, 92 84 C 98 94, 106 90, 112 84" fill="none" stroke="#ec4899" stroke-width="4" stroke-linecap="round"/>

    <!-- Rainbow Sprinkles -->
    <g class="ill-sprinkle">
      <rect x="58" y="72" width="7" height="3" rx="1.5" fill="#facc15" transform="rotate(25 58 72)"/>
      <rect x="76" y="62" width="7" height="3" rx="1.5" fill="#38bdf8" transform="rotate(-35 76 62)"/>
      <rect x="94" y="70" width="7" height="3" rx="1.5" fill="#4ade80" transform="rotate(18 94 70)"/>
    </g>

    <!-- Glossy Glazed Cherry with leaf -->
    <g class="ill-pop">
      <circle cx="80" cy="44" r="9" fill="url(#ds-cherry)"/>
      <circle cx="77" cy="41" r="2.5" fill="#ffffff" opacity="0.75"/>
      <path d="M80 35 C 84 25, 96 22, 100 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="94" cy="27" rx="5" ry="3" fill="#22c55e" transform="rotate(-20 94 27)"/>
    </g>
  </g>
</svg>`,

    breakfast: `
<svg viewBox="0 0 160 160" class="ill ill--breakfast" role="img" aria-label="Sunny Breakfast skillet illustration">
  <defs>
    <linearGradient id="bf-egg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f4f6"/>
    </linearGradient>
    <linearGradient id="bf-yolk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>

  <!-- Revolving morning sunbeams -->
  <g class="ill-rays" stroke="#fde68a" stroke-width="4" stroke-linecap="round" opacity="0.6">
    <line x1="80" y1="14" x2="80" y2="28"/>
    <line x1="126" y1="34" x2="116" y2="44"/>
    <line x1="144" y1="80" x2="130" y2="80"/>
    <line x1="34" y1="34" x2="44" y2="44"/>
    <line x1="16" y1="80" x2="30" y2="80"/>
  </g>

  <ellipse class="ill-shadow" cx="80" cy="144" rx="46" ry="7" fill="#1e130c" opacity="0.38"/>

  <g class="ill-bob">
    <!-- Cast Iron Skillet / Ceramic Plate -->
    <ellipse cx="80" cy="100" rx="54" ry="34" fill="#374151"/>
    <ellipse cx="80" cy="98" rx="50" ry="30" fill="#1f2937"/>
    <!-- Skillet Handle -->
    <path d="M128 88 L 148 76" stroke="#374151" stroke-width="12" stroke-linecap="round"/>

    <!-- Fried Egg White with crispy golden edges -->
    <path d="M48 98 C 44 84, 70 80, 84 82 C 102 78, 114 90, 110 104 C 106 116, 88 120, 74 116 C 58 118, 48 110, 48 98 Z" fill="url(#bf-egg)"/>
    <path d="M46 98 C 42 82, 70 78, 84 80" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.4"/>

    <!-- Glossy Golden Bouncy Egg Yolk -->
    <circle class="ill-pop" cx="78" cy="98" r="14" fill="url(#bf-yolk)"/>
    <circle cx="74" cy="93" r="3.8" fill="#ffffff" opacity="0.8"/>

    <!-- Fresh Avocado & Grilled Tomato Slices -->
    <g fill="#65a30d">
      <ellipse cx="56" cy="90" rx="8" ry="4" transform="rotate(-30 56 90)"/>
      <ellipse cx="102" cy="92" rx="8" ry="4" transform="rotate(30 102 92)"/>
    </g>
    <circle cx="98" cy="108" r="7" fill="#ef4444"/>
    <circle cx="96" cy="106" r="2" fill="#ffffff" opacity="0.7"/>
  </g>
</svg>`,

    pasta: `
<svg viewBox="0 0 160 160" class="ill ill--pasta" role="img" aria-label="Steaming Italian Pasta illustration">
  <defs>
    <linearGradient id="ps-sauce" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
  </defs>

  <g class="ill-steam-group" fill="none" stroke="#fde68a" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
    <path class="ill-steam" d="M66 42c-7-8 7-14 0-22"/>
    <path class="ill-steam ill-delay-1" d="M90 38c-7-8 7-14 0-22"/>
  </g>

  <ellipse class="ill-shadow" cx="80" cy="144" rx="46" ry="7" fill="#1e130c" opacity="0.36"/>

  <g class="ill-bob">
    <!-- Porcelain Pasta Bowl -->
    <path d="M30 84 C 30 128, 130 128, 130 84 Z" fill="#ffffff"/>
    <ellipse cx="80" cy="84" rx="50" ry="14" fill="#f3f4f6"/>

    <!-- Spaghetti Swirls with Marinara -->
    <ellipse cx="80" cy="82" rx="42" ry="12" fill="#fde047"/>
    <path d="M48 82 C 60 72, 100 72, 112 82 C 104 94, 56 94, 48 82 Z" fill="url(#ps-sauce)"/>

    <!-- Fork lifting twirled pasta -->
    <g class="ill-tilt">
      <line x1="88" y1="24" x2="88" y2="68" stroke="#9ca3af" stroke-width="5" stroke-linecap="round"/>
      <path d="M82 66 L 94 66 L 94 76 C 94 80, 82 80, 82 76 Z" fill="#9ca3af"/>
      <path d="M78 68 C 88 58, 98 78, 102 68" stroke="#facc15" stroke-width="4" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Basil Garnish -->
    <ellipse cx="74" cy="78" rx="6" ry="3.5" fill="#16a34a" transform="rotate(-25 74 78)"/>
  </g>
</svg>`,

    fries: `
<svg viewBox="0 0 160 160" class="ill ill--fries" role="img" aria-label="Crispy Golden Fries illustration">
  <defs>
    <linearGradient id="fr-box" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
    <linearGradient id="fr-potato" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fde047"/><stop offset="50%" stop-color="#facc15"/><stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>

  <ellipse class="ill-shadow" cx="80" cy="144" rx="42" ry="7" fill="#1e130c" opacity="0.36"/>

  <g class="ill-bob">
    <!-- Golden Crispy Fries poking out -->
    <g fill="url(#fr-potato)">
      <rect class="ill-fry" x="48" y="34" width="12" height="58" rx="5" transform="rotate(-12 54 63)"/>
      <rect class="ill-fry ill-delay-1" x="66" y="24" width="12" height="68" rx="5" transform="rotate(-3 72 58)"/>
      <rect class="ill-fry ill-delay-2" x="84" y="28" width="12" height="64" rx="5" transform="rotate(8 90 60)"/>
      <rect class="ill-fry ill-delay-1" x="100" y="38" width="12" height="54" rx="5" transform="rotate(18 106 65)"/>
    </g>

    <!-- Red Cafe Fry Box with scoop cutout -->
    <path d="M42 74 L 118 74 L 106 134 C 104 138, 56 138, 54 134 Z" fill="url(#fr-box)"/>
    <path d="M42 74 C 64 92, 96 92, 118 74" fill="#991b1b"/>
    <path d="M46 78 C 66 94, 94 94, 114 78" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.5"/>

    <!-- Emblem star on box -->
    <polygon points="80,100 83,107 90,108 85,113 86,120 80,116 74,120 75,113 70,108 77,107" fill="#fef08a"/>
  </g>
</svg>`,

    salad: `
<svg viewBox="0 0 160 160" class="ill ill--salad" role="img" aria-label="Fresh Garden Salad illustration">
  <ellipse class="ill-shadow" cx="80" cy="144" rx="44" ry="7" fill="#1e130c" opacity="0.35"/>

  <g class="ill-sway">
    <!-- Eco Wooden Salad Bowl -->
    <path d="M34 76 C 34 126, 126 126, 126 76 Z" fill="#d97706"/>
    <ellipse cx="80" cy="76" rx="46" ry="12" fill="#b45309"/>

    <g class="ill-bob">
      <!-- Crisp Leafy Greens -->
      <circle cx="62" cy="72" r="18" fill="#4ade80"/>
      <circle cx="96" cy="68" r="20" fill="#22c55e"/>
      <circle cx="80" cy="62" r="16" fill="#16a34a"/>

      <!-- Cherry Tomatoes & Radishes -->
      <circle cx="62" cy="64" r="8" fill="#ef4444"/>
      <circle cx="60" cy="62" r="2.2" fill="#ffffff" opacity="0.7"/>
      <circle cx="98" cy="76" r="8" fill="#ef4444"/>
      <circle cx="78" cy="76" r="7" fill="#facc15"/>
    </g>
  </g>
</svg>`,

    sandwich: `
<svg viewBox="0 0 160 160" class="ill ill--sandwich" role="img" aria-label="Artisan Sandwich illustration">
  <ellipse class="ill-shadow" cx="80" cy="144" rx="44" ry="7" fill="#1e130c" opacity="0.35"/>
  <g class="ill-bob">
    <!-- Toasted Artisan Bread Top -->
    <polygon points="32,46 128,46 120,68 40,68" fill="#f59e0b"/>
    <!-- Layers: Lettuce, Cheese, Ham -->
    <rect x="34" y="68" width="92" height="8" rx="2" fill="#84cc16"/>
    <polygon points="38,76 122,76 114,84 46,84" fill="#facc15"/>
    <rect x="36" y="84" width="88" height="12" rx="4" fill="#b91c1c"/>
    <rect x="34" y="96" width="92" height="8" rx="2" fill="#84cc16"/>
    <!-- Bottom Bread -->
    <polygon points="40,104 120,104 126,126 34,126" fill="#d97706"/>
    <!-- Olive Toothpick -->
    <line x1="80" y1="24" x2="80" y2="46" stroke="#92400e" stroke-width="4"/>
    <circle cx="80" cy="24" r="6" fill="#65a30d"/>
  </g>
</svg>`,

    tea: `
<svg viewBox="0 0 160 160" class="ill ill--tea" role="img" aria-label="Herbal Infusion Tea illustration">
  <g class="ill-steam-group" fill="none" stroke="#fde68a" stroke-width="3" stroke-linecap="round" opacity="0.8">
    <path class="ill-steam" d="M72 48c-6-7 6-12 0-20"/>
    <path class="ill-steam ill-delay-1" d="M88 44c-6-7 6-12 0-20"/>
  </g>
  <ellipse class="ill-shadow" cx="80" cy="142" rx="44" ry="7" fill="#1e130c" opacity="0.35"/>
  <g class="ill-bob">
    <!-- Teacup and Saucer -->
    <ellipse cx="80" cy="130" rx="46" ry="8" fill="#e5e7eb"/>
    <path d="M44 72 L 116 72 C 114 116, 96 126, 80 126 C 64 126, 46 116, 44 72 Z" fill="#ffffff"/>
    <ellipse cx="80" cy="72" rx="34" ry="8" fill="#d97706"/>
    <!-- Teabag tag hanging out -->
    <path class="ill-sway" d="M96 74 L 116 100" stroke="#f3f4f6" stroke-width="2"/>
    <rect class="ill-sway" x="112" y="98" width="10" height="12" rx="2" fill="#f59e0b"/>
  </g>
</svg>`,

    default: `
<svg viewBox="0 0 160 160" class="ill ill--default" role="img" aria-label="Cafe Menu illustration">
  <g class="ill-bob">
    <rect x="36" y="24" width="88" height="114" rx="14" fill="#ffffff" stroke="#d97706" stroke-width="4"/>
    <!-- Menu Ribbon & Star -->
    <path d="M66 24 L 94 24 L 80 44 Z" fill="#d97706"/>
    <circle cx="80" cy="70" r="14" fill="#fef3c7"/>
    <text x="80" y="75" font-size="14" text-anchor="middle" fill="#d97706">&#9749;</text>
    <rect x="52" y="94" width="56" height="6" rx="3" fill="#e5e7eb"/>
    <rect x="52" y="106" width="40" height="6" rx="3" fill="#e5e7eb"/>
  </g>
</svg>`,
  };

  window.CategoryIcons = icons;
  window.CategoryIconKeys = Object.keys(icons);
  window.renderCategoryIcon = function (key) {
    return icons[key] || icons.default;
  };
})();
