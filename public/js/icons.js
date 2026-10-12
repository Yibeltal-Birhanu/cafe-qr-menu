'use strict';

/**
 * 4K Realistic Cinematic Animated Food Video Showcases for Prism Cafe QR Menu.
 * Built with multi-layer depth, sizzling embers, steam wisps, melting cheese physics,
 * camera viewfinder HUDs, recording indicators, and continuous playback timelines.
 */
(function () {
  function makeVideoFrame(svgContent, label, duration) {
    const dur = duration || '00:30';
    return `
<div class="card__video-inner" role="region" aria-label="${label}">
  <div class="video-hud-top">
    <span class="video-live-badge"><span class="video-live-dot"></span> 4K LIVE</span>
    <span class="video-cam-mode">REC &bull; 60 FPS</span>
  </div>
  <div class="video-screen">
    ${svgContent}
  </div>
  <div class="video-hud-bottom">
    <div class="video-controls">
      <span class="video-play-status">&bull; LIVE STREAM</span>
      <div class="video-timeline">
        <div class="video-timeline-progress"></div>
      </div>
      <span class="video-timestamp">${dur}</span>
      <span class="video-badge-hd">HDR</span>
    </div>
  </div>
</div>`;
  }

  const icons = {};

  /* ------------------------------------------------------------- 1. Habesha Specials */
  icons.habesha = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--habesha ill-sizzle" role="img" aria-label="Sizzling Habesha Special Tibs in Clay Pan">
      <defs>
        <linearGradient id="hb-clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#854d0e"/><stop offset="50%" stop-color="#713f12"/><stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
        <linearGradient id="hb-meat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#260e03"/>
        </linearGradient>
        <linearGradient id="hb-injera" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#f5f5f4"/><stop offset="50%" stop-color="#e7e5e4"/><stop offset="100%" stop-color="#d6d3d1"/>
        </linearGradient>
        <radialGradient id="hb-ember" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fbbf24"/><stop offset="40%" stop-color="#ea580c"/><stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <radialGradient id="hb-heat-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff4500" stop-opacity="0.45"/><stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>

      <!-- Charcoal Stand Ambient Heat Aura -->
      <circle cx="90" cy="130" r="50" fill="url(#hb-heat-glow)"/>

      <!-- Rising Aromatic Steam & Spiced Smoke -->
      <g class="ill-steam-group" fill="none" stroke="#fed7aa" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
        <path class="ill-steam" d="M68 44c-8-8 7-15 0-26"/>
        <path class="ill-steam ill-delay-1" d="M92 38c-8-8 7-15 0-26"/>
        <path class="ill-steam ill-delay-2" d="M116 44c-8-8 7-15 0-26"/>
      </g>

      <!-- Hot Floating Spark Embers -->
      <g fill="#ea580c" class="ill-spark">
        <circle cx="56" cy="130" r="2.2" opacity="0.9"/>
        <circle cx="124" cy="126" r="2.5" opacity="0.9"/>
        <circle cx="90" cy="134" r="2" opacity="0.85"/>
        <circle cx="108" cy="120" r="1.8" opacity="0.8"/>
      </g>

      <!-- Ground Charcoal Shadow -->
      <ellipse cx="90" cy="154" rx="58" ry="8" fill="#04090d" opacity="0.55"/>

      <!-- Charcoal Stove Base with Glowing Fire -->
      <path d="M58 136 L 122 136 L 112 152 L 68 152 Z" fill="#1e130c"/>
      <ellipse cx="90" cy="138" rx="34" ry="7" fill="url(#hb-ember)"/>

      <!-- Clay Shekla / Sizzling Pan with Berber Butter Stew -->
      <g class="ill-simmer">
        <ellipse cx="90" cy="116" rx="64" ry="24" fill="url(#hb-clay)"/>
        <ellipse cx="90" cy="112" rx="58" ry="20" fill="#240f06"/>
        <ellipse cx="90" cy="112" rx="54" ry="17" fill="#b91c1c" opacity="0.45"/>

        <!-- Sizzling Beef Tibs Cubes in Spiced Butter Sauce -->
        <g>
          <rect x="62" y="102" width="16" height="13" rx="4" fill="url(#hb-meat)"/>
          <line x1="64" y1="104" x2="76" y2="104" stroke="#f59e0b" stroke-width="1.5" opacity="0.8"/>
          <rect x="82" y="98" width="18" height="14" rx="4" fill="url(#hb-meat)"/>
          <line x1="84" y1="100" x2="98" y2="100" stroke="#f59e0b" stroke-width="1.8" opacity="0.85"/>
          <rect x="104" y="104" width="16" height="13" rx="4" fill="url(#hb-meat)"/>
          <rect x="76" y="110" width="17" height="13" rx="4" fill="url(#hb-meat)"/>
          <rect x="96" y="112" width="16" height="12" rx="4" fill="url(#hb-meat)"/>
        </g>

        <!-- Fresh Fiery Sliced Jalapeños -->
        <g fill="#22c55e">
          <ellipse cx="72" cy="116" rx="5" ry="3" transform="rotate(-20 72 116)"/>
          <ellipse cx="112" cy="114" rx="5" ry="3" transform="rotate(30 112 114)"/>
        </g>
        <circle cx="72" cy="116" r="1.5" fill="#15803d"/>
        <circle cx="112" cy="114" r="1.5" fill="#15803d"/>

        <!-- Fresh Rosemary Sprig -->
        <g stroke="#16a34a" stroke-width="2" stroke-linecap="round" class="ill-sway">
          <line x1="90" y1="106" x2="84" y2="84"/>
          <line x1="84" y1="84" x2="80" y2="82"/>
          <line x1="85" y1="89" x2="91" y2="87"/>
          <line x1="86" y1="95" x2="80" y2="93"/>
          <line x1="87" y1="100" x2="93" y2="98"/>
        </g>

        <!-- Rolled Teff Injera Rolls on Pan Rim -->
        <g>
          <path d="M38 108 C 34 100, 48 94, 52 102 C 54 110, 42 116, 38 108 Z" fill="url(#hb-injera)"/>
          <ellipse cx="44" cy="104" rx="4" ry="2.5" fill="#a8a29e"/>
          <path d="M128 102 C 132 94, 146 100, 142 108 C 138 116, 124 110, 128 102 Z" fill="url(#hb-injera)"/>
          <ellipse cx="136" cy="104" rx="4" ry="2.5" fill="#a8a29e"/>
        </g>
      </g>
    </svg>`, 'Sizzling Ethiopian Clay Shekla Tibs & Injera', '00:30');

  /* ------------------------------------------------------------- 2. Gourmet Burgers */
  icons.burgers = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--burger ill-sizzle" role="img" aria-label="Flame-Grilled Gourmet Burger Video">
      <defs>
        <linearGradient id="bg-bun-crown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde68a"/><stop offset="30%" stop-color="#f59e0b"/><stop offset="85%" stop-color="#d97706"/><stop offset="100%" stop-color="#92400e"/>
        </linearGradient>
        <linearGradient id="bg-bun-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <linearGradient id="bg-patty-char" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#1f0c03"/>
        </linearGradient>
        <linearGradient id="bg-cheese-melt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef08a"/><stop offset="60%" stop-color="#facc15"/><stop offset="100%" stop-color="#ea580c"/>
        </linearGradient>
      </defs>

      <!-- Rising Grill Steam Curls -->
      <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
        <path class="ill-steam" d="M65 40c-8-8 7-14 0-24"/>
        <path class="ill-steam ill-delay-1" d="M90 34c-8-8 7-14 0-24"/>
        <path class="ill-steam ill-delay-2" d="M115 40c-8-8 7-14 0-24"/>
      </g>

      <!-- Ground Shadow -->
      <ellipse class="ill-shadow" cx="90" cy="154" rx="54" ry="8" fill="#04090d" opacity="0.5"/>

      <g class="ill-bob">
        <!-- Top Toasted Brioche Bun Crown -->
        <path d="M30 76 C 30 34, 150 34, 150 76 Z" fill="url(#bg-bun-crown)"/>
        <path d="M36 72 C 40 42, 140 42, 144 72" fill="none" stroke="#fffbeb" stroke-width="2.5" opacity="0.4"/>

        <!-- Glistening Toasted Sesame Seeds -->
        <g fill="#fffbeb" class="ill-twinkle">
          <ellipse cx="60" cy="50" rx="4.5" ry="2.2" transform="rotate(-20 60 50)"/>
          <ellipse cx="86" cy="44" rx="5" ry="2.2" transform="rotate(-5 86 44)"/>
          <ellipse cx="114" cy="50" rx="4.8" ry="2.2" transform="rotate(18 114 50)"/>
          <ellipse cx="74" cy="62" rx="4.2" ry="2" transform="rotate(-12 74 62)"/>
          <ellipse cx="100" cy="62" rx="4.2" ry="2" transform="rotate(10 100 62)"/>
          <ellipse cx="128" cy="66" rx="3.5" ry="1.8" transform="rotate(24 128 66)"/>
        </g>

        <!-- Fresh Ruffled Green Lettuce -->
        <path class="ill-sway" d="M26 78 C 32 72, 44 82, 56 76 C 68 82, 80 72, 92 78 C 104 72, 116 82, 128 76 C 140 82, 150 72, 154 78 L 154 84 C 142 88, 130 82, 118 86 C 106 80, 94 88, 82 82 C 70 88, 58 80, 46 86 C 34 80, 24 84, 26 78 Z" fill="#65a30d"/>
        <path d="M30 80 C 42 75, 54 84, 66 78 C 78 84, 90 76, 102 80 C 114 76, 126 84, 138 78 C 148 84, 150 78, 150 80" fill="none" stroke="#a3e635" stroke-width="2" opacity="0.6"/>

        <!-- Juicy Ripe Tomato Slices -->
        <rect x="34" y="84" width="112" height="10" rx="5" fill="#ef4444"/>
        <rect x="38" y="86" width="30" height="6" rx="3" fill="#f87171" opacity="0.6"/>
        <rect x="112" y="86" width="30" height="6" rx="3" fill="#f87171" opacity="0.6"/>

        <!-- Dripping Melting Cheddar Layer -->
        <path class="ill-drip" d="M30 92 L 150 92 L 142 106 L 126 98 L 110 114 L 92 98 L 74 112 L 58 98 L 44 108 L 30 92 Z" fill="url(#bg-cheese-melt)"/>

        <!-- Thick Sizzling Flame-Grilled Beef Patty -->
        <rect x="28" y="104" width="124" height="22" rx="11" fill="url(#bg-patty-char)"/>
        <g stroke="#1a0a03" stroke-width="3" stroke-linecap="round" opacity="0.8">
          <line x1="48" y1="107" x2="44" y2="123"/>
          <line x1="72" y1="107" x2="68" y2="123"/>
          <line x1="96" y1="107" x2="92" y2="123"/>
          <line x1="120" y1="107" x2="116" y2="123"/>
        </g>

        <!-- Toasted Bottom Bun -->
        <path d="M30 126 C 30 126, 32 144, 48 146 L 132 146 C 148 144, 150 126, 150 126 Z" fill="url(#bg-bun-base)"/>
      </g>
    </svg>`, 'Flame-Grilled Double Cheddar Smash Burger', '00:25');
  icons.burger = icons.burgers;

  /* ------------------------------------------------------------- 3. Stone-Baked Pizza */
  icons.pizza = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--pizza ill-sizzle" role="img" aria-label="Stone-Baked Pizza with Bubbly Mozzarella">
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

      <!-- Oven Steam Vapor -->
      <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.85">
        <path class="ill-steam" d="M80 30c-7-7 7-14 0-22"/>
        <path class="ill-steam ill-delay-1" d="M104 26c-7-7 7-14 0-22"/>
      </g>

      <ellipse class="ill-shadow" cx="90" cy="154" rx="50" ry="8" fill="#04090d" opacity="0.45"/>

      <g class="ill-tilt">
        <!-- Golden Crispy Crust -->
        <path d="M90 22 L 154 134 C 146 150, 34 150, 26 134 Z" fill="url(#pz-crust-rich)"/>
        <!-- Blistered Puffy Leopard Edge -->
        <path d="M28 132 C 44 152, 136 152, 152 132 C 144 124, 36 124, 28 132 Z" fill="#78350f"/>
        <path d="M34 136 C 54 148, 126 148, 146 136" stroke="#fbbf24" stroke-width="3" fill="none" opacity="0.45"/>

        <!-- Bubbling Golden Mozzarella Layer -->
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

        <!-- Fresh Basil Leaves -->
        <g fill="#65a30d" class="ill-sway">
          <path d="M108 72 C 118 68, 120 78, 106 80 C 104 74, 106 72, 108 72 Z"/>
          <path d="M64 104 C 54 100, 58 112, 70 110 C 68 104, 66 104, 64 104 Z"/>
        </g>
      </g>
    </svg>`, 'Stone-Baked Mozzarella Pepperoni Pizza', '00:35');
  icons.pizzas = icons.pizza;

  /* ------------------------------------------------------------- 4. Buna / Coffee Ceremony */
  icons.coffee = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--coffee" role="img" aria-label="Steaming Ethiopian Coffee and Jebena Ceremony">
      <defs>
        <linearGradient id="cf-porcelain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <linearGradient id="cf-crema-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef3c7"/><stop offset="50%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <linearGradient id="cf-jebena-clay" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#1c0b02"/>
        </linearGradient>
      </defs>

      <!-- Steaming Aromatic Frankincense & Buna Clouds -->
      <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
        <path class="ill-steam" d="M74 50c-8-9 8-15 0-26"/>
        <path class="ill-steam ill-delay-1" d="M96 44c-8-9 8-15 0-26"/>
      </g>

      <ellipse class="ill-shadow" cx="94" cy="154" rx="54" ry="8" fill="#04090d" opacity="0.45"/>

      <g class="ill-bob">
        <!-- Traditional Clay Jebena in Background -->
        <g opacity="0.88">
          <path d="M124 74 L 128 54 L 132 54 L 136 74" fill="url(#cf-jebena-clay)"/>
          <ellipse cx="130" cy="54" rx="3.5" ry="1.5" fill="#f59e0b"/>
          <circle cx="130" cy="94" r="22" fill="url(#cf-jebena-clay)"/>
          <path d="M142 82 C 158 88, 154 110, 140 110" fill="none" stroke="url(#cf-jebena-clay)" stroke-width="5" stroke-linecap="round"/>
          <path d="M116 88 L 108 82" stroke="url(#cf-jebena-clay)" stroke-width="4" stroke-linecap="round"/>
        </g>

        <!-- Porcelain Saucer -->
        <ellipse cx="88" cy="142" rx="52" ry="10" fill="#cbd5e1"/>
        <ellipse cx="88" cy="140" rx="50" ry="9" fill="url(#cf-porcelain)"/>

        <!-- Cup Handle -->
        <path d="M118 84 C 144 84, 144 118, 118 120" fill="none" stroke="url(#cf-porcelain)" stroke-width="10" stroke-linecap="round"/>

        <!-- Ceramic Cup Body -->
        <path d="M52 70 L 122 70 C 120 120, 102 136, 88 136 C 74 136, 54 120, 52 70 Z" fill="url(#cf-porcelain)"/>

        <!-- Rich Golden Crema Surface -->
        <ellipse cx="87" cy="72" rx="33" ry="10" fill="url(#cf-crema-gold)"/>

        <!-- Latte Art Rosette -->
        <path class="ill-swirl" d="M87 67 C 84 64, 78 67, 81 71 C 84 75, 87 77, 87 77 C 87 77, 90 75, 93 71 C 96 67, 90 64, 87 67 Z" fill="#fffbeb"/>
        <path d="M87 66 L 87 76" stroke="#fef3c7" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Roasted Coffee Beans -->
        <ellipse cx="44" cy="143" rx="7.5" ry="5" fill="#451a03" transform="rotate(-18 44 143)"/>
        <path d="M42 139 C 45 143, 43 145, 46 147" stroke="#78350f" stroke-width="1.2" fill="none"/>
      </g>
    </svg>`, 'Single-Origin Ethiopian Coffee & Jebena Ceremony', '00:28');
  icons.coffees = icons.coffee;

  /* ------------------------------------------------------------- 5. Chilled Drinks */
  icons.drinks = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--drinks" role="img" aria-label="Iced Artisan Beverage with Carbonation">
      <defs>
        <linearGradient id="dr-tropical" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
        <linearGradient id="dr-glass-tint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25"/>
        </linearGradient>
      </defs>

      <ellipse class="ill-shadow" cx="90" cy="154" rx="42" ry="7" fill="#04090d" opacity="0.4"/>

      <g class="ill-bob">
        <!-- Striped Straw -->
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

        <!-- Chilled Blue/Teal Liquid -->
        <path d="M60 84 L 120 84 L 108 142 C 106 146, 74 146, 72 142 Z" fill="url(#dr-tropical)"/>

        <!-- Translucent Bobbing Ice Cubes -->
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

        <!-- Condensation Gleam -->
        <path d="M64 68 L 74 140" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
      </g>
    </svg>`, 'Artisan Chilled Iced Beverage with Effervescence', '00:20');
  icons.drink = icons.drinks;

  /* ------------------------------------------------------------- 6. Desserts */
  icons.desserts = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--desserts" role="img" aria-label="Decadent Chocolate Cake Pastry Video">
      <defs>
        <linearGradient id="ds-cake-sponge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#78350f"/><stop offset="50%" stop-color="#451a03"/><stop offset="100%" stop-color="#271004"/>
        </linearGradient>
        <linearGradient id="ds-cream-layer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fffbeb"/><stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
        <linearGradient id="ds-choco-drip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2e1065"/><stop offset="50%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      <ellipse class="ill-shadow" cx="90" cy="154" rx="54" ry="8" fill="#04090d" opacity="0.45"/>

      <g class="ill-bob">
        <!-- Ceramic Plate -->
        <ellipse cx="90" cy="144" rx="64" ry="12" fill="#e2e8f0"/>
        <ellipse cx="90" cy="142" rx="60" ry="10" fill="#ffffff"/>

        <!-- Multi-Layer Chocolate Gateau Slice -->
        <path d="M42 128 L 138 128 L 134 76 L 46 88 Z" fill="url(#ds-cake-sponge)"/>
        <!-- Cream Strips -->
        <rect x="44" y="104" width="92" height="6" rx="2" fill="url(#ds-cream-layer)"/>
        <rect x="45" y="118" width="91" height="4" rx="2" fill="url(#ds-cream-layer)"/>

        <!-- Glossy Dark Chocolate Ganache Drip -->
        <path class="ill-drip" d="M44 88 L 136 76 L 134 94 L 122 86 L 110 102 L 96 88 L 82 104 L 68 88 L 54 98 L 44 88 Z" fill="url(#ds-choco-drip)"/>

        <!-- Glossy Strawberry Garnish -->
        <g class="ill-pop" transform="translate(86, 52)">
          <path d="M0 22 C -14 22, -16 6, 0 0 C 16 6, 14 22, 0 22 Z" fill="#ef4444"/>
          <circle cx="-3" cy="8" r="1.5" fill="#ffffff" opacity="0.85"/>
          <!-- Strawberry Leaf Crown -->
          <path d="M-6 0 C -12 -6, -4 -10, 0 -6 C 4 -10, 12 -6, 6 0 Z" fill="#22c55e"/>
        </g>
      </g>
    </svg>`, 'Handcrafted Belgian Chocolate Gateau & Strawberry', '00:30');
  icons.dessert = icons.desserts;

  /* ------------------------------------------------------------- 7. Breakfast Skillet */
  icons.breakfast = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--breakfast ill-sizzle" role="img" aria-label="Sizzling Breakfast Skillet with Fried Egg">
      <defs>
        <radialGradient id="bf-skillet-pan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#374151"/><stop offset="80%" stop-color="#1f2937"/><stop offset="100%" stop-color="#111827"/>
        </radialGradient>
        <radialGradient id="bf-egg-white" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="75%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#fef08a"/>
        </radialGradient>
        <radialGradient id="bf-yolk-glow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fef08a"/><stop offset="40%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
      </defs>

      <!-- Sizzling Steam -->
      <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.85">
        <path class="ill-steam" d="M78 40c-6-7 6-13 0-22"/>
        <path class="ill-steam ill-delay-1" d="M102 36c-6-7 6-13 0-22"/>
      </g>

      <ellipse class="ill-shadow" cx="90" cy="154" rx="54" ry="8" fill="#04090d" opacity="0.5"/>

      <g class="ill-simmer">
        <!-- Cast Iron Skillet Body -->
        <circle cx="90" cy="110" r="54" fill="url(#bf-skillet-pan)"/>
        <circle cx="90" cy="110" r="48" fill="#111827"/>

        <!-- Skillet Handle -->
        <path d="M144 98 L 166 84" stroke="#374151" stroke-width="14" stroke-linecap="round"/>

        <!-- Sizzling Fried Egg White with Crispy Lace Edges -->
        <path d="M54 108 C 50 92, 80 88, 96 90 C 116 86, 128 100, 124 114 C 118 128, 98 132, 82 128 C 64 130, 54 122, 54 108 Z" fill="url(#bf-egg-white)"/>

        <!-- Bouncy Golden Liquid Egg Yolk -->
        <circle class="ill-pop" cx="88" cy="108" r="16" fill="url(#bf-yolk-glow)"/>
        <circle cx="83" cy="102" r="4.2" fill="#ffffff" opacity="0.85"/>

        <!-- Avocado & Cherry Tomato Slices -->
        <g fill="#65a30d">
          <ellipse cx="64" cy="98" rx="9" ry="4.5" transform="rotate(-30 64 98)"/>
          <ellipse cx="114" cy="102" rx="9" ry="4.5" transform="rotate(30 114 102)"/>
        </g>
        <circle cx="110" cy="118" r="8" fill="#ef4444"/>
        <circle cx="107" cy="116" r="2.5" fill="#ffffff" opacity="0.8"/>
      </g>
    </svg>`, 'Farm-Fresh Sizzling Cast Iron Breakfast Skillet', '00:25');
  icons.breakfasts = icons.breakfast;

  /* ------------------------------------------------------------- 8. Fresh Pasta & Artisan */
  icons.pasta = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--pasta ill-sizzle" role="img" aria-label="Steaming Handcrafted Artisan Pasta">
      <defs>
        <linearGradient id="ps-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
        <linearGradient id="ps-sauce" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>

      <!-- Steaming Ribbon Curls -->
      <g class="ill-steam-group" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.85">
        <path class="ill-steam" d="M76 40c-6-7 6-13 0-22"/>
        <path class="ill-steam ill-delay-1" d="M104 36c-6-7 6-13 0-22"/>
      </g>

      <ellipse class="ill-shadow" cx="90" cy="154" rx="52" ry="8" fill="#04090d" opacity="0.45"/>

      <g class="ill-bob">
        <!-- Artisan Pasta Bowl -->
        <ellipse cx="90" cy="120" rx="58" ry="24" fill="url(#ps-bowl)"/>
        <ellipse cx="90" cy="116" rx="52" ry="18" fill="#e2e8f0"/>

        <!-- Swirled Ribbon Pasta -->
        <g stroke="#fde047" stroke-width="4.5" stroke-linecap="round" fill="none">
          <path d="M56 112 C 64 96, 84 94, 94 104 C 104 114, 122 108, 128 114"/>
          <path d="M60 118 C 72 106, 88 122, 102 110 C 114 100, 124 118, 124 118"/>
          <path d="M70 110 C 80 92, 100 92, 110 108"/>
        </g>

        <!-- Fresh Marinara & Basil -->
        <ellipse cx="90" cy="110" rx="28" ry="10" fill="url(#ps-sauce)" opacity="0.85"/>
        <g fill="#16a34a">
          <ellipse cx="86" cy="104" rx="6" ry="3.5" transform="rotate(-20 86 104)"/>
          <ellipse cx="96" cy="106" rx="6" ry="3.5" transform="rotate(30 96 106)"/>
        </g>
      </g>
    </svg>`, 'Handmade Italian Fettuccine with Fresh Herbs', '00:30');

  /* ------------------------------------------------------------- 9. Garden Salad */
  icons.salad = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--salad" role="img" aria-label="Garden Fresh Crisp Salad">
      <ellipse class="ill-shadow" cx="90" cy="154" rx="50" ry="8" fill="#04090d" opacity="0.4"/>
      <g class="ill-bob">
        <ellipse cx="90" cy="124" rx="56" ry="22" fill="#f8fafc"/>
        <ellipse cx="90" cy="120" rx="50" ry="18" fill="#65a30d" opacity="0.2"/>
        <!-- Crisp Greens Leaves -->
        <g fill="#4ade80">
          <ellipse cx="72" cy="114" rx="14" ry="8" transform="rotate(-30 72 114)"/>
          <ellipse cx="108" cy="114" rx="14" ry="8" transform="rotate(30 108 114)"/>
          <ellipse cx="90" cy="106" rx="16" ry="9"/>
        </g>
        <!-- Cherry Tomatoes & Cucumber -->
        <circle cx="76" cy="108" r="6" fill="#ef4444"/>
        <circle cx="104" cy="110" r="6" fill="#ef4444"/>
        <circle cx="90" cy="116" r="7" fill="#84cc16"/>
        <circle cx="90" cy="116" r="5" fill="#bef264"/>
      </g>
    </svg>`, 'Garden Crisp Artisan Greens & Vinaigrette', '00:20');

  /* ------------------------------------------------------------- 10. Default / Chef Selection */
  icons.default = makeVideoFrame(`
    <svg viewBox="0 0 180 180" class="ill ill--default" role="img" aria-label="Prism Cafe Signature Selection">
      <g class="ill-bob">
        <rect x="42" y="34" width="96" height="120" rx="18" fill="#111c26" stroke="#00f090" stroke-width="3"/>
        <circle cx="90" cy="80" r="22" fill="rgba(0, 240, 144, 0.15)"/>
        <text x="90" y="88" font-size="24" text-anchor="middle" fill="#00f090">&#9749;</text>
        <rect x="60" y="112" width="60" height="7" rx="3.5" fill="#334155"/>
        <rect x="60" y="126" width="44" height="7" rx="3.5" fill="#1e293b"/>
      </g>
    </svg>`, 'Artisan Cafe Fresh Daily Selection', '00:30');

  // Comprehensive aliases
  icons.pastas = icons.pasta;
  icons.salads = icons.salad;

  window.CategoryIcons = icons;
  window.CategoryIconKeys = Object.keys(icons);

  /**
   * Resolves category icon key with plural, singular, and lowercase fallbacks
   */
  window.renderCategoryIcon = function (key) {
    if (!key) return icons.default;
    const k = String(key).toLowerCase().trim();
    if (icons[k]) return icons[k];
    const singular = k.replace(/s$/, '');
    if (icons[singular]) return icons[singular];
    const plural = k + 's';
    if (icons[plural]) return icons[plural];
    return icons.default;
  };
})();
