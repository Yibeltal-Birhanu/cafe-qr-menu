'use strict';

/**
 * Realistic cinematic animated food video showcases for Prism Cafe QR menu.
 * Built with realistic textures, multi-layer depth, sizzling embers, steam wisps,
 * and live video overlay badges.
 */
(function () {
  const icons = {
    habesha: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--habesha ill-sizzle" role="img" aria-label="Sizzling Habesha Special Tibs in Clay Pan">
    <defs>
      <linearGradient id="hb-clay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#854d0e"/><stop offset="50%" stop-color="#713f12"/><stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
      <linearGradient id="hb-meat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#260e03"/>
      </linearGradient>
      <linearGradient id="hb-injera" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#e7e5e4"/><stop offset="50%" stop-color="#d6d3d1"/><stop offset="100%" stop-color="#a8a29e"/>
      </linearGradient>
      <radialGradient id="hb-ember" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f97316"/><stop offset="60%" stop-color="#dc2626"/><stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="hb-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Rising aromatic steam curls from the hot clay dish -->
    <g class="ill-steam-group" fill="none" stroke="#fed7aa" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
      <path class="ill-steam" d="M68 44c-8-8 7-15 0-26"/>
      <path class="ill-steam ill-delay-1" d="M92 38c-8-8 7-15 0-26"/>
      <path class="ill-steam ill-delay-2" d="M116 44c-8-8 7-15 0-26"/>
    </g>

    <!-- Hot floating embers/sparks rising from charcoal stand -->
    <g fill="#ea580c" class="ill-spark">
      <circle cx="56" cy="130" r="2.2" opacity="0.9"/>
      <circle cx="124" cy="126" r="2.5" opacity="0.9"/>
      <circle cx="90" cy="134" r="2" opacity="0.85"/>
      <circle cx="108" cy="120" r="1.8" opacity="0.8"/>
    </g>

    <!-- Ground charcoal reflection shadow -->
    <ellipse cx="90" cy="154" rx="58" ry="8" fill="#180e07" opacity="0.45"/>

    <!-- Charcoal Stove Base with glowing embers -->
    <path d="M58 136 L 122 136 L 112 152 L 68 152 Z" fill="#29180d"/>
    <ellipse cx="90" cy="138" rx="34" ry="7" fill="url(#hb-ember)" filter="url(#hb-glow)"/>

    <!-- Clay Shekla / Serving Pan -->
    <g class="ill-simmer">
      <ellipse cx="90" cy="116" rx="64" ry="24" fill="url(#hb-clay)"/>
      <ellipse cx="90" cy="112" rx="58" ry="20" fill="#261206"/>
      <ellipse cx="90" cy="112" rx="54" ry="17" fill="#b91c1c" opacity="0.35"/>

      <!-- Sizzling Beef Tibs Cubes in spiced butter sauce -->
      <g>
        <!-- Meat cube 1 -->
        <rect x="62" y="102" width="16" height="13" rx="4" fill="url(#hb-meat)"/>
        <line x1="64" y1="104" x2="76" y2="104" stroke="#f59e0b" stroke-width="1.5" opacity="0.7"/>
        <!-- Meat cube 2 -->
        <rect x="82" y="98" width="18" height="14" rx="4" fill="url(#hb-meat)"/>
        <line x1="84" y1="100" x2="98" y2="100" stroke="#f59e0b" stroke-width="1.8" opacity="0.8"/>
        <!-- Meat cube 3 -->
        <rect x="104" y="104" width="16" height="13" rx="4" fill="url(#hb-meat)"/>
        <!-- Meat cube 4 (center) -->
        <rect x="76" y="110" width="17" height="13" rx="4" fill="url(#hb-meat)"/>
        <!-- Meat cube 5 -->
        <rect x="96" y="112" width="16" height="12" rx="4" fill="url(#hb-meat)"/>
      </g>

      <!-- Sliced fiery green jalapeños / Awaze accents -->
      <g fill="#22c55e">
        <ellipse cx="72" cy="116" rx="5" ry="3" transform="rotate(-20 72 116)"/>
        <ellipse cx="112" cy="114" rx="5" ry="3" transform="rotate(30 112 114)"/>
      </g>
      <circle cx="72" cy="116" r="1.5" fill="#15803d"/>
      <circle cx="112" cy="114" r="1.5" fill="#15803d"/>

      <!-- Fresh green rosemary sprig -->
      <g stroke="#15803d" stroke-width="2" stroke-linecap="round" class="ill-sway">
        <line x1="90" y1="106" x2="84" y2="84"/>
        <line x1="84" y1="84" x2="80" y2="82"/>
        <line x1="85" y1="89" x2="91" y2="87"/>
        <line x1="86" y1="95" x2="80" y2="93"/>
        <line x1="87" y1="100" x2="93" y2="98"/>
      </g>

      <!-- Rolled Teff Injera pieces on pan edge -->
      <g>
        <path d="M38 108 C 34 100, 48 94, 52 102 C 54 110, 42 116, 38 108 Z" fill="url(#hb-injera)"/>
        <ellipse cx="44" cy="104" rx="4" ry="2.5" fill="#a8a29e"/>
        <path d="M128 102 C 132 94, 146 100, 142 108 C 138 116, 124 110, 128 102 Z" fill="url(#hb-injera)"/>
        <ellipse cx="136" cy="104" rx="4" ry="2.5" fill="#a8a29e"/>
      </g>
    </g>
  </svg>
</div>`,

    burger: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--burger ill-sizzle" role="img" aria-label="Realistic Sizzling Gourmet Burger">
    <defs>
      <linearGradient id="bg-bun-crown" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fde68a"/><stop offset="30%" stop-color="#f59e0b"/><stop offset="85%" stop-color="#d97706"/><stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <linearGradient id="bg-bun-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <linearGradient id="bg-patty-char" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#260e03"/>
      </linearGradient>
      <linearGradient id="bg-cheese-melt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef08a"/><stop offset="60%" stop-color="#facc15"/><stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
    </defs>

    <!-- Rising grill steam curls -->
    <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
      <path class="ill-steam" d="M65 40c-8-8 7-14 0-24"/>
      <path class="ill-steam ill-delay-1" d="M90 34c-8-8 7-14 0-24"/>
      <path class="ill-steam ill-delay-2" d="M115 40c-8-8 7-14 0-24"/>
    </g>

    <!-- Ground contact shadow -->
    <ellipse class="ill-shadow" cx="90" cy="154" rx="54" ry="8" fill="#180e07" opacity="0.45"/>

    <g class="ill-bob">
      <!-- Top Toasted Brioche Crown -->
      <path d="M30 76 C 30 34, 150 34, 150 76 Z" fill="url(#bg-bun-crown)"/>
      <path d="M36 72 C 40 42, 140 42, 144 72" fill="none" stroke="#fffbeb" stroke-width="2.5" opacity="0.4"/>

      <!-- Toasted Glistening Sesame Seeds -->
      <g fill="#fffbeb" class="ill-twinkle">
        <ellipse cx="60" cy="50" rx="4.5" ry="2.2" transform="rotate(-20 60 50)"/>
        <ellipse cx="86" cy="44" rx="5" ry="2.2" transform="rotate(-5 86 44)"/>
        <ellipse cx="114" cy="50" rx="4.8" ry="2.2" transform="rotate(18 114 50)"/>
        <ellipse cx="74" cy="62" rx="4.2" ry="2" transform="rotate(-12 74 62)"/>
        <ellipse cx="100" cy="62" rx="4.2" ry="2" transform="rotate(10 100 62)"/>
        <ellipse cx="128" cy="66" rx="3.5" ry="1.8" transform="rotate(24 128 66)"/>
      </g>

      <!-- Fresh Wavy Green Lettuce Leaf -->
      <path class="ill-sway" d="M26 78 C 32 72, 44 82, 56 76 C 68 82, 80 72, 92 78 C 104 72, 116 82, 128 76 C 140 82, 150 72, 154 78 L 154 84 C 142 88, 130 82, 118 86 C 106 80, 94 88, 82 82 C 70 88, 58 80, 46 86 C 34 80, 24 84, 26 78 Z" fill="#65a30d"/>
      <path d="M30 80 C 42 75, 54 84, 66 78 C 78 84, 90 76, 102 80 C 114 76, 126 84, 138 78 C 148 84, 150 78, 150 80" fill="none" stroke="#a3e635" stroke-width="2" opacity="0.6"/>

      <!-- Ripe Red Tomato Slices -->
      <rect x="34" y="84" width="112" height="10" rx="5" fill="#ef4444"/>
      <rect x="38" y="86" width="30" height="6" rx="3" fill="#f87171" opacity="0.6"/>
      <rect x="112" y="86" width="30" height="6" rx="3" fill="#f87171" opacity="0.6"/>

      <!-- Melting Cheddar Cheese Draping Over Patty -->
      <path class="ill-drip" d="M30 92 L 150 92 L 142 106 L 126 98 L 110 114 L 92 98 L 74 112 L 58 98 L 44 108 L 30 92 Z" fill="url(#bg-cheese-melt)"/>

      <!-- Thick Flame-Grilled Beef Patty with Sear Marks -->
      <rect x="28" y="104" width="124" height="22" rx="11" fill="url(#bg-patty-char)"/>
      <g stroke="#1a0a03" stroke-width="3" stroke-linecap="round" opacity="0.75">
        <line x1="48" y1="107" x2="44" y2="123"/>
        <line x1="72" y1="107" x2="68" y2="123"/>
        <line x1="96" y1="107" x2="92" y2="123"/>
        <line x1="120" y1="107" x2="116" y2="123"/>
        <line x1="138" y1="108" x2="135" y2="122"/>
      </g>

      <!-- Bottom Toasted Bun Heel -->
      <path d="M30 126 C 30 126, 32 144, 48 146 L 132 146 C 148 144, 150 126, 150 126 Z" fill="url(#bg-bun-base)"/>
    </g>
  </svg>
</div>`,

    pizza: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--pizza ill-sizzle" role="img" aria-label="Stone-Baked Pizza Slice with Melting Cheese Pull">
    <defs>
      <linearGradient id="pz-crust-rich" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <linearGradient id="pz-cheese-pull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef08a"/><stop offset="60%" stop-color="#facc15"/><stop offset="100%" stop-color="#eab308"/>
      </linearGradient>
      <linearGradient id="pz-pep-disc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/>
      </linearGradient>
    </defs>

    <!-- Oven heat vapor steam -->
    <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.85">
      <path class="ill-steam" d="M80 30c-7-7 7-14 0-22"/>
      <path class="ill-steam ill-delay-1" d="M104 26c-7-7 7-14 0-22"/>
    </g>

    <ellipse class="ill-shadow" cx="90" cy="154" rx="50" ry="8" fill="#180e07" opacity="0.42"/>

    <g class="ill-tilt">
      <!-- Outer Crispy Crust Body -->
      <path d="M90 22 L 154 134 C 146 150, 34 150, 26 134 Z" fill="url(#pz-crust-rich)"/>
      <!-- Puffy Stone-Baked Rear Edge with oven char -->
      <path d="M28 132 C 44 152, 136 152, 152 132 C 144 124, 36 124, 28 132 Z" fill="#78350f"/>
      <path d="M34 136 C 54 148, 126 148, 146 136" stroke="#fbbf24" stroke-width="3" fill="none" opacity="0.45"/>

      <!-- Melted Golden Mozzarella Layer -->
      <path d="M90 32 L 142 128 C 128 138, 52 138, 38 128 Z" fill="url(#pz-cheese-pull)"/>

      <!-- Sizzling Pepperoni Discs -->
      <g>
        <g class="ill-pop">
          <circle cx="76" cy="80" r="10" fill="url(#pz-pep-disc)"/>
          <circle cx="74" cy="77" r="3" fill="#fca5a5" opacity="0.75"/>
        </g>
        <g class="ill-pop ill-delay-1">
          <circle cx="106" cy="100" r="9.5" fill="url(#pz-pep-disc)"/>
          <circle cx="104" cy="97" r="2.8" fill="#fca5a5" opacity="0.75"/>
        </g>
        <g class="ill-pop ill-delay-2">
          <circle cx="82" cy="120" r="9" fill="url(#pz-pep-disc)"/>
          <circle cx="80" cy="118" r="2.5" fill="#fca5a5" opacity="0.75"/>
        </g>
        <circle cx="94" cy="56" r="7.5" fill="url(#pz-pep-disc)"/>
      </g>

      <!-- Fresh Garden Basil Leaves -->
      <g fill="#65a30d" class="ill-sway">
        <path d="M108 72 C 118 68, 120 78, 106 80 C 104 74, 106 72, 108 72 Z"/>
        <path d="M64 104 C 54 100, 58 112, 70 110 C 68 104, 66 104, 64 104 Z"/>
      </g>
    </g>
  </svg>
</div>`,

    coffee: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--coffee" role="img" aria-label="Steaming Ethiopian Coffee and Jebena">
    <defs>
      <linearGradient id="cf-porcelain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e5e7eb"/>
      </linearGradient>
      <linearGradient id="cf-crema-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/><stop offset="50%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <linearGradient id="cf-jebena-clay" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0b02"/>
      </linearGradient>
    </defs>

    <!-- Aromatic steam ribbons rising from freshly poured coffee -->
    <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
      <path class="ill-steam" d="M74 50c-8-9 8-15 0-26"/>
      <path class="ill-steam ill-delay-1" d="M96 44c-8-9 8-15 0-26"/>
    </g>

    <ellipse class="ill-shadow" cx="94" cy="154" rx="54" ry="8" fill="#180e07" opacity="0.4"/>

    <g class="ill-bob">
      <!-- Traditional Clay Jebena in background -->
      <g opacity="0.85">
        <path d="M124 74 L 128 54 L 132 54 L 136 74" fill="url(#cf-jebena-clay)"/>
        <ellipse cx="130" cy="54" rx="3.5" ry="1.5" fill="#f59e0b"/>
        <circle cx="130" cy="94" r="22" fill="url(#cf-jebena-clay)"/>
        <path d="M142 82 C 158 88, 154 110, 140 110" fill="none" stroke="url(#cf-jebena-clay)" stroke-width="5" stroke-linecap="round"/>
        <path d="M116 88 L 108 82" stroke="url(#cf-jebena-clay)" stroke-width="4" stroke-linecap="round"/>
      </g>

      <!-- Porcelain Saucer -->
      <ellipse cx="88" cy="142" rx="52" ry="10" fill="#d1d5db"/>
      <ellipse cx="88" cy="140" rx="50" ry="9" fill="url(#cf-porcelain)"/>

      <!-- Cup Handle -->
      <path d="M118 84 C 144 84, 144 118, 118 120" fill="none" stroke="url(#cf-porcelain)" stroke-width="10" stroke-linecap="round"/>

      <!-- Ceramic Cup Body -->
      <path d="M52 70 L 122 70 C 120 120, 102 136, 88 136 C 74 136, 54 120, 52 70 Z" fill="url(#cf-porcelain)"/>

      <!-- Rich Crema Surface -->
      <ellipse cx="87" cy="72" rx="33" ry="10" fill="url(#cf-crema-gold)"/>

      <!-- Rosetta Latte Art Swirl -->
      <path class="ill-swirl" d="M87 67 C 84 64, 78 67, 81 71 C 84 75, 87 77, 87 77 C 87 77, 90 75, 93 71 C 96 67, 90 64, 87 67 Z" fill="#fffbeb"/>
      <path d="M87 66 L 87 76" stroke="#fef3c7" stroke-width="1.5" stroke-linecap="round"/>

      <!-- Roasted Ethiopian Coffee Beans on Saucer -->
      <ellipse cx="44" cy="143" rx="7.5" ry="5" fill="#451a03" transform="rotate(-18 44 143)"/>
      <path d="M42 139 C 45 143, 43 145, 46 147" stroke="#78350f" stroke-width="1.2" fill="none"/>
    </g>
  </svg>
</div>`,

    drinks: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--drinks" role="img" aria-label="Iced Refreshing Chilled Beverage">
    <defs>
      <linearGradient id="dr-tropical" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="dr-glass-tint" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25"/>
      </linearGradient>
    </defs>

    <ellipse class="ill-shadow" cx="90" cy="154" rx="42" ry="7" fill="#180e07" opacity="0.35"/>

    <g class="ill-bob">
      <!-- Festive Striped Straw -->
      <line x1="108" y1="20" x2="90" y2="88" stroke="#f43f5e" stroke-width="9" stroke-linecap="round"/>
      <line x1="108" y1="20" x2="90" y2="88" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-dasharray="9 9"/>

      <!-- Fresh Lemon Wheel on the Rim -->
      <g transform="translate(114, 58)">
        <circle cx="0" cy="0" r="15" fill="#facc15"/>
        <circle cx="0" cy="0" r="12" fill="#fef08a"/>
        <g stroke="#eab308" stroke-width="1.5">
          <line x1="0" y1="-12" x2="0" y2="12"/>
          <line x1="-12" y1="0" x2="12" y2="0"/>
          <line x1="-9" y1="-9" x2="9" y2="9"/>
          <line x1="-9" y1="9" x2="9" y2="-9"/>
        </g>
      </g>

      <!-- Highball Glass Body -->
      <path d="M56 60 L 124 60 L 110 144 C 108 150, 72 150, 70 144 Z" fill="url(#dr-glass-tint)" stroke="rgba(255,255,255,0.7)" stroke-width="2.5"/>

      <!-- Iced Liquid Surface -->
      <path d="M60 84 L 120 84 L 108 142 C 106 146, 74 146, 72 142 Z" fill="url(#dr-tropical)"/>

      <!-- Bobbing Ice Cubes -->
      <g fill="#e0f2fe" opacity="0.88">
        <rect x="70" y="90" width="18" height="18" rx="4" transform="rotate(14 79 99)"/>
        <rect x="90" y="106" width="18" height="18" rx="4" transform="rotate(-16 99 115)"/>
      </g>

      <!-- Rising Effervescent Fizz Bubbles -->
      <g fill="#ffffff" opacity="0.95">
        <circle class="ill-bubble" cx="80" cy="136" r="3.8"/>
        <circle class="ill-bubble ill-delay-1" cx="94" cy="126" r="3"/>
        <circle class="ill-bubble ill-delay-2" cx="102" cy="134" r="3.2"/>
        <circle class="ill-bubble" cx="76" cy="114" r="2.5"/>
        <circle class="ill-bubble ill-delay-1" cx="90" cy="100" r="2.2"/>
      </g>

      <!-- Glass Condensation Gleam -->
      <path d="M64 68 L 74 140" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.55"/>
    </g>
  </svg>
</div>`,

    desserts: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--desserts" role="img" aria-label="Decadent Molten Lava Cake and Berries">
    <defs>
      <linearGradient id="ds-lava-cake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#451a03"/><stop offset="70%" stop-color="#260e03"/><stop offset="100%" stop-color="#170802"/>
      </linearGradient>
      <linearGradient id="ds-berry-glaze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#9f1239"/>
      </linearGradient>
    </defs>

    <ellipse class="ill-shadow" cx="90" cy="154" rx="48" ry="7" fill="#180e07" opacity="0.38"/>

    <!-- Twinkling Golden Star Sparkles -->
    <g fill="#fbbf24" class="ill-twinkle">
      <path d="M44 46 L 46 40 L 48 46 L 54 48 L 48 50 L 46 56 L 44 50 L 38 48 Z"/>
      <path d="M136 42 L 138 37 L 140 42 L 145 44 L 140 46 L 138 51 L 136 46 L 131 44 Z" class="ill-delay-1"/>
    </g>

    <g class="ill-bob">
      <!-- Porcelain Dessert Plate -->
      <ellipse cx="90" cy="142" rx="60" ry="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>

      <!-- Molten Chocolate Gateau Body -->
      <path d="M52 92 L 128 92 L 120 138 C 118 142, 62 142, 60 138 Z" fill="url(#ds-lava-cake)"/>

      <!-- Warm Molten Chocolate Glaze Dripping Down -->
      <path class="ill-drip" d="M50 92 C 58 106, 68 100, 76 92 C 86 108, 96 104, 104 92 C 112 106, 122 100, 130 92" fill="none" stroke="#be123c" stroke-width="6" stroke-linecap="round"/>

      <!-- Vanilla Bean Ice Cream Scoop on Top -->
      <path d="M68 88 C 68 64, 112 64, 112 88 Z" fill="#fffbeb"/>
      <path d="M72 82 C 78 72, 102 72, 108 82" stroke="#fef08a" stroke-width="2" fill="none" opacity="0.6"/>

      <!-- Glossy Maraschino Cherry with stem -->
      <g class="ill-pop">
        <circle cx="90" cy="54" r="10" fill="url(#ds-berry-glaze)"/>
        <circle cx="87" cy="50" r="3" fill="#ffffff" opacity="0.8"/>
        <path d="M90 44 C 95 32, 108 28, 114 30" fill="none" stroke="#15803d" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="106" cy="34" rx="6" ry="3.5" fill="#22c55e" transform="rotate(-20 106 34)"/>
      </g>
    </g>
  </svg>
</div>`,

    breakfast: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--breakfast ill-sizzle" role="img" aria-label="Sizzling Sunny Skillet Breakfast">
    <defs>
      <linearGradient id="bf-egg-white" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f4f6"/>
      </linearGradient>
      <linearGradient id="bf-yolk-glow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef08a"/><stop offset="45%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>

    <!-- Morning Sunshine Revolving Radiance -->
    <g class="ill-rays" stroke="#fde68a" stroke-width="4" stroke-linecap="round" opacity="0.65">
      <line x1="90" y1="16" x2="90" y2="30"/>
      <line x1="140" y1="38" x2="130" y2="48"/>
      <line x1="160" y1="90" x2="146" y2="90"/>
      <line x1="40" y1="38" x2="50" y2="48"/>
      <line x1="20" y1="90" x2="34" y2="90"/>
    </g>

    <ellipse class="ill-shadow" cx="90" cy="154" rx="52" ry="8" fill="#180e07" opacity="0.4"/>

    <g class="ill-bob">
      <!-- Heavy Cast Iron Skillet Body -->
      <ellipse cx="90" cy="110" rx="60" ry="36" fill="#374151"/>
      <ellipse cx="90" cy="108" rx="55" ry="32" fill="#1f2937"/>
      <!-- Skillet Handle -->
      <path d="M144 98 L 166 84" stroke="#374151" stroke-width="14" stroke-linecap="round"/>

      <!-- Sizzling Fried Egg White with crispy lace edges -->
      <path d="M54 108 C 50 92, 80 88, 96 90 C 116 86, 128 100, 124 114 C 118 128, 98 132, 82 128 C 64 130, 54 122, 54 108 Z" fill="url(#bf-egg-white)"/>
      <path d="M52 108 C 48 90, 80 86, 96 88" stroke="#f59e0b" stroke-width="2.5" fill="none" opacity="0.45"/>

      <!-- Glossy Golden Bouncy Egg Yolk -->
      <circle class="ill-pop" cx="88" cy="108" r="16" fill="url(#bf-yolk-glow)"/>
      <circle cx="83" cy="102" r="4.2" fill="#ffffff" opacity="0.85"/>

      <!-- Fresh Sliced Avocado Rose & Grilled Cherry Tomato -->
      <g fill="#65a30d">
        <ellipse cx="64" cy="98" rx="9" ry="4.5" transform="rotate(-30 64 98)"/>
        <ellipse cx="114" cy="102" rx="9" ry="4.5" transform="rotate(30 114 102)"/>
      </g>
      <circle cx="110" cy="118" r="8" fill="#ef4444"/>
      <circle cx="107" cy="116" r="2.5" fill="#ffffff" opacity="0.8"/>
    </g>
  </svg>
</div>`,

    default: `
<div class="card__video-inner">
  <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
  <svg viewBox="0 0 180 180" class="ill ill--default" role="img" aria-label="Artisan Cafe Selection">
    <g class="ill-bob">
      <rect x="42" y="30" width="96" height="124" rx="16" fill="#ffffff" stroke="#d97706" stroke-width="4"/>
      <circle cx="90" cy="80" r="16" fill="#fef3c7"/>
      <text x="90" y="86" font-size="16" text-anchor="middle" fill="#d97706">&#9749;</text>
      <rect x="60" y="106" width="60" height="7" rx="3.5" fill="#e5e7eb"/>
      <rect x="60" y="120" width="44" height="7" rx="3.5" fill="#e5e7eb"/>
    </g>
  </svg>
</div>`,
  };

  window.CategoryIcons = icons;
  window.CategoryIconKeys = Object.keys(icons);
  window.renderCategoryIcon = function (key) {
    return icons[key] || icons.default;
  };
})();
