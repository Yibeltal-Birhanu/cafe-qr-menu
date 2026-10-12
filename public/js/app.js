'use strict';

/**
 * Public animated QR menu application.
 * Pulls live menu from /api/menu and provides animated category cards,
 * interactive order tray, table recognition, synthesized Web Audio, and table QR tools.
 */
(function () {
  const SOUND_KEY = 'cafe-menu-sound-enabled';

  const state = {
    menu: null,
    query: '',
    activeCategory: 'all',
    dietaryFilter: 'all',
    table: new URLSearchParams(window.location.search).get('table') || '1',
    tray: {},
    sound: localStorage.getItem(SOUND_KEY) !== 'false',
  };

  const els = {
    logo: document.getElementById('cafeLogo'),
    name: document.getElementById('cafeName'),
    tagline: document.getElementById('cafeTagline'),
    tablePill: document.getElementById('tablePill'),
    tablePillText: document.getElementById('tablePillText'),
    heroTitle: document.getElementById('heroTitle'),
    heroText: document.getElementById('heroText'),
    heroArt: document.getElementById('heroArt'),
    wifiCard: document.getElementById('wifiCard'),
    wifiSsid: document.getElementById('wifiSsid'),
    wifiPass: document.getElementById('wifiPass'),
    copyWifi: document.getElementById('copyWifi'),
    statCategories: document.getElementById('statCategories'),
    statItems: document.getElementById('statItems'),
    statCurrency: document.getElementById('statCurrency'),
    footerCafe: document.getElementById('footerCafe'),
    footerNote: document.getElementById('footerNote'),
    chips: document.getElementById('chips'),
    filtersRow: document.getElementById('filtersRow'),
    grid: document.getElementById('grid'),
    empty: document.getElementById('emptyState'),
    search: document.getElementById('search'),
    soundBtn: document.getElementById('soundBtn'),
    soundIcon: document.getElementById('soundIcon'),
    trayBar: document.getElementById('trayBar'),
    trayCount: document.getElementById('trayCount'),
    trayTotal: document.getElementById('trayTotal'),
    openTrayBtn: document.getElementById('openTrayBtn'),
    trayDrawerBackdrop: document.getElementById('trayDrawerBackdrop'),
    closeTrayBtn: document.getElementById('closeTrayBtn'),
    trayList: document.getElementById('trayList'),
    trayEmpty: document.getElementById('trayEmpty'),
    trayNotes: document.getElementById('trayNotes'),
    drawerTotal: document.getElementById('drawerTotal'),
    drawerTableLabel: document.getElementById('drawerTableLabel'),
    sendWhatsappBtn: document.getElementById('sendWhatsappBtn'),
    callWaiterBtn: document.getElementById('callWaiterBtn'),
    clearTrayBtn: document.getElementById('clearTrayBtn'),
    qrModal: document.getElementById('qrModal'),
    qrImage: document.getElementById('qrImage'),
    qrUrl: document.getElementById('qrUrl'),
    qrTableSelect: document.getElementById('qrTableSelect'),
    openQr: document.getElementById('openQr'),
    closeQr: document.getElementById('closeQr'),
    printQrBtn: document.getElementById('printQrBtn'),
    printCafeName: document.getElementById('printCafeName'),
    printTableNum: document.getElementById('printTableNum'),
    printQrImg: document.getElementById('printQrImg'),
    printWifiInfo: document.getElementById('printWifiInfo'),
    toast: document.getElementById('toast'),
  };

  /* ------------------------------------------------------------- Audio FX */
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPop() {
    if (!state.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch { /* Audio not allowed */ }
  }

  function playChime() {
    if (!state.sound) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [880, 1320, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.5);
      });
    } catch { /* Audio not allowed */ }
  }

  /* -------------------------------------------------------------- Helpers */
  function money(value, currency) {
    const amount = Number(value) || 0;
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return currency ? `${formatted} ${currency}` : formatted;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  let toastTimer;
  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.className = 'toast is-on is-good';
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.className = 'toast';
    }, 2800);
  }

  function badgeClass(badge) {
    const b = String(badge || '').toLowerCase();
    if (b.includes('spicy') || b.includes('hot')) return 'badge badge--spicy';
    if (b.includes('new')) return 'badge badge--new';
    if (b.includes('signature')) return 'badge badge--signature';
    if (b.includes('veg')) return 'badge badge--veg';
    return 'badge badge--popular';
  }

  function categoryBannerTag(categoryId) {
    const tags = {
      habesha: 'Sizzling Clay Skillet • Injera',
      burgers: 'Flame-Grilled • Brioche',
      pizza: 'Stone-Baked • 30cm',
      coffee: 'Single Origin • Fresh Buna',
      drinks: 'Artisan Chilled • Iced',
      desserts: 'House Baked Daily',
      breakfast: 'Fresh Mornings',
      pasta: 'Handcrafted Pasta',
      fries: 'Crispy Golden',
      salad: 'Garden Fresh',
      sandwich: 'Toasted Artisan',
      tea: 'Steeped Herbal',
    };
    return tags[categoryId] || 'Chef Special';
  }

/* ------------------------------------------------------------- Observer */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('.item').forEach((item, index) => {
        item.style.animationDelay = `${Math.min(index * 60, 600)}ms`;
      });
      revealObserver.unobserve(entry.target);
    });
  },
  { rootMargin: '0px 0px -40px 0px', threshold: 0.06 }
);

/* ------------------------------------------------------------ Rendering */
function renderHeader(menu) {
  const { cafe } = menu;
  document.title = `${cafe.name} \u2014 Digital QR Menu`;
  if (els.logo) els.logo.textContent = cafe.logo || '\u2615';
  if (els.name) els.name.textContent = cafe.name;
  if (els.tagline) els.tagline.textContent = cafe.tagline;
  if (els.footerCafe) els.footerCafe.textContent = cafe.name;
  if (els.footerNote) els.footerNote.textContent = cafe.footer;

  // Table display
  if (els.tablePillText) els.tablePillText.textContent = `Table #${state.table}`;
  if (els.drawerTableLabel) els.drawerTableLabel.textContent = `Table #${state.table} \u2022 Dine-In`;

  // WiFi display
  if (els.wifiCard) {
    if (cafe.wifi_ssid) {
      els.wifiCard.hidden = false;
      if (els.wifiSsid) els.wifiSsid.textContent = cafe.wifi_ssid;
      if (els.wifiPass) els.wifiPass.textContent = cafe.wifi_pass || 'No password';
    } else {
      els.wifiCard.hidden = true;
    }
  }

  const totalItems = menu.categories.reduce((sum, category) => sum + category.items.length, 0);
  if (els.statCategories) els.statCategories.textContent = menu.categories.length;
  if (els.statItems) els.statItems.textContent = totalItems;
  if (els.statCurrency) els.statCurrency.textContent = cafe.currency || '\u2014';
  if (els.heroArt) els.heroArt.innerHTML = renderCategoryIcon(menu.categories[0] ? menu.categories[0].icon : 'habesha');
}

  function renderChips(menu) {
    const total = menu.categories.reduce((sum, category) => sum + category.items.length, 0);
    const chips = [
      `<button class="chip${state.activeCategory === 'all' ? ' is-active' : ''}" data-category="all" type="button">All Categories<span class="chip__count">${total}</span></button>`,
      ...menu.categories.map(
        (category) =>
          `<button class="chip${state.activeCategory === category.id ? ' is-active' : ''}" data-category="${escapeHtml(category.id)}" type="button">` +
          `${escapeHtml(category.name)}<span class="chip__count">${category.items.length}</span></button>`
      ),
    ];
    els.chips.innerHTML = chips.join('');
  }

  function itemMarkup(item, currency) {
    const badge = item.badge ? `<span class="${badgeClass(item.badge)}">${escapeHtml(item.badge)}</span>` : '';
    const desc = item.description ? `<div class="item__desc">${escapeHtml(item.description)}</div>` : '';
    const prep = item.prepTime ? `<span style="font-size:0.75rem;color:var(--accent);margin-left:0.4rem">\u23F1 ${escapeHtml(item.prepTime)}</span>` : '';

    return `
      <li class="item" data-item-id="${escapeHtml(item.id)}">
        <div class="item__main" data-add="${escapeHtml(item.id)}" title="Add to table order">
          <div class="item__top">
            <span class="item__name">${escapeHtml(item.name)}${badge}${prep}</span>
            <span class="item__leader"></span>
            <span class="item__price">${escapeHtml(money(item.price, currency))}</span>
          </div>
          ${desc}
        </div>
        <button class="item__add-btn" data-add="${escapeHtml(item.id)}" type="button" title="Add to table tray" aria-label="Add ${escapeHtml(item.name)}">+</button>
      </li>`;
  }

  function cardMarkup(category, currency) {
    const items = category.items.map((item) => itemMarkup(item, currency)).join('');
    const note = category.description ? `<p class="card__note">${escapeHtml(category.description)}</p>` : '';
    const tag = categoryBannerTag(category.id);

    return `
      <article class="card card--${escapeHtml(category.id)}" id="cat-${escapeHtml(category.id)}" data-category="${escapeHtml(category.id)}">
        <div class="card__art" data-art-bounce="${escapeHtml(category.id)}" title="Tap for live animation & sound!">
          <span class="card__tag-pill">${escapeHtml(tag)}</span>
          ${renderCategoryIcon(category.icon || category.id)}
        </div>
        <div class="card__body">
          <div class="card__head">
            <div>
              <h2 class="card__title">${escapeHtml(category.name)}</h2>
              ${note}
            </div>
            <span class="card__count">${category.items.length} dishes</span>
          </div>
          <ul class="items">${items}</ul>
        </div>
      </article>`;
  }

  function visibleCategories() {
    const query = state.query.trim().toLowerCase();
    const filter = state.dietaryFilter.toLowerCase();

    return state.menu.categories
      .filter((category) => state.activeCategory === 'all' || category.id === state.activeCategory)
      .map((category) => {
        let items = category.items;
        if (query) {
          items = items.filter((item) =>
            `${item.name} ${item.description} ${item.badge}`.toLowerCase().includes(query)
          );
        }
        if (filter !== 'all') {
          items = items.filter((item) => {
            const b = (item.badge || '').toLowerCase();
            const d = (item.description || '').toLowerCase();
            const n = (item.name || '').toLowerCase();
            if (filter === 'popular') return b.includes('popular') || b.includes('signature');
            if (filter === 'spicy') return b.includes('spicy') || b.includes('hot') || d.includes('chilli');
            if (filter === 'new') return b.includes('new');
            if (filter === 'signature') return b.includes('signature') || b.includes('chef');
            return true;
          });
        }
        return { ...category, items };
      })
      .filter((category) => !query && filter === 'all' || category.items.length > 0 || (query && category.name.toLowerCase().includes(query)));
  }

  function renderBoard() {
    const categories = visibleCategories();
    const currency = state.menu.cafe.currency;

    if (!categories.length) {
      els.grid.innerHTML = '';
      els.empty.hidden = false;
      els.empty.className = 'empty';
      els.empty.innerHTML = '<strong>No dishes found</strong>Try searching for burgers, pizza, or coffee.';
      return;
    }

    els.empty.hidden = true;
    els.grid.innerHTML = categories.map((category) => cardMarkup(category, currency)).join('');

    els.grid.querySelectorAll('.card').forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
      card.classList.add('is-visible');
      revealObserver.observe(card);
    });

    applyActiveChip();
  }

  function applyActiveChip() {
    els.chips.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.category === state.activeCategory);
    });
  }

  /* ---------------------------------------------------------- Order Tray */
  function findItemById(itemId) {
    for (const cat of state.menu.categories) {
      const it = cat.items.find((entry) => entry.id === itemId);
      if (it) return it;
    }
    return null;
  }

  function addToTray(itemId) {
    playPop();
    const item = findItemById(itemId);
    if (!item) return;

    if (!state.tray[itemId]) {
      state.tray[itemId] = { item, qty: 1 };
    } else {
      state.tray[itemId].qty += 1;
    }
    updateTrayUI();
    showToast(`Added ${item.name} to tray`);
  }

  function updateQty(itemId, delta) {
    playPop();
    if (!state.tray[itemId]) return;
    state.tray[itemId].qty += delta;
    if (state.tray[itemId].qty <= 0) {
      delete state.tray[itemId];
    }
    updateTrayUI();
  }

  function updateTrayUI() {
    const entries = Object.values(state.tray);
    const count = entries.reduce((sum, e) => sum + e.qty, 0);
    const currency = state.menu ? state.menu.cafe.currency : 'ETB';
    const total = entries.reduce((sum, e) => sum + e.qty * (Number(e.item.price) || 0), 0);

    els.trayCount.textContent = count;
    els.trayTotal.textContent = money(total, currency);
    els.drawerTotal.textContent = money(total, currency);

    if (count > 0) {
      els.trayBar.classList.add('is-visible');
    } else {
      els.trayBar.classList.remove('is-visible');
    }

    // Render inside drawer
    if (count === 0) {
      els.trayList.innerHTML = '';
      els.trayEmpty.hidden = false;
    } else {
      els.trayEmpty.hidden = true;
      els.trayList.innerHTML = entries
        .map(
          (e) => `
        <li class="tray-row">
          <div>
            <div class="tray-row__name">${escapeHtml(e.item.name)}</div>
            <div class="tray-row__price">${escapeHtml(money(e.item.price * e.qty, currency))}</div>
          </div>
          <div class="tray-row__qty">
            <button class="tray-qty-btn" data-qty-change="${escapeHtml(e.item.id)}" data-delta="-1" type="button" aria-label="Decrease">&minus;</button>
            <span style="font-weight:700;min-width:18px;text-align:center">${e.qty}</span>
            <button class="tray-qty-btn" data-qty-change="${escapeHtml(e.item.id)}" data-delta="1" type="button" aria-label="Increase">&plus;</button>
          </div>
        </li>`
        )
        .join('');
    }
  }

  function openTrayDrawer() {
    playPop();
    els.trayDrawerBackdrop.classList.add('is-open');
  }

  function closeTrayDrawer() {
    els.trayDrawerBackdrop.classList.remove('is-open');
  }

  function sendWhatsAppOrder() {
    const entries = Object.values(state.tray);
    if (!entries.length) {
      showToast('Your tray is empty!');
      return;
    }
    playChime();
    const cafe = state.menu.cafe;
    const phone = (cafe.phone || '').replace(/[^0-9]/g, '');
    const currency = cafe.currency || 'ETB';
    const total = entries.reduce((sum, e) => sum + e.qty * (Number(e.item.price) || 0), 0);
    const notes = els.trayNotes.value.trim();

    let msg = `*Order from Table #${state.table} - ${cafe.name}*\n`;
    msg += `----------------------------------------\n`;
    entries.forEach((e) => {
      msg += `\u2022 ${e.qty}x ${e.item.name} (${money(e.item.price * e.qty, currency)})\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `*Total: ${money(total, currency)}*\n`;
    if (notes) msg += `Notes: ${notes}\n`;

    const targetUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(targetUrl, '_blank');
  }

  function callWaiter() {
    playChime();
    showToast(`\uD83D\uDD14 Waiter called for Table #${state.table}! Staff is on the way.`);
  }

  /* --------------------------------------------------------- QR Code Modal */
  function openQrModal() {
    playPop();
    const tableVal = els.qrTableSelect.value || state.table;
    const url = `${window.location.origin}/?table=${encodeURIComponent(tableVal)}`;
    els.qrUrl.textContent = url;
    els.qrImage.src = `/qr.png?url=${encodeURIComponent(url)}&size=600`;
    els.qrModal.classList.add('is-open');

    // Setup printable stand
    els.printCafeName.textContent = state.menu.cafe.name;
    els.printTableNum.textContent = `Table #${tableVal}`;
    els.printQrImg.src = `/qr.png?url=${encodeURIComponent(url)}&size=600`;
    if (state.menu.cafe.wifi_ssid) {
      els.printWifiInfo.textContent = `Guest WiFi: ${state.menu.cafe.wifi_ssid} \u2022 Pass: ${state.menu.cafe.wifi_pass || 'None'}`;
    }
  }

  function closeQrModal() {
    els.qrModal.classList.remove('is-open');
  }

  /* ------------------------------------------------------------- Events */
  function bindEvents() {
    // Chips navigation
    els.chips.addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      playPop();
      state.activeCategory = chip.dataset.category;
      renderBoard();
      const target = document.getElementById(`cat-${state.activeCategory}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Secondary filter pills
    els.filtersRow.addEventListener('click', (event) => {
      const pill = event.target.closest('.filter-pill');
      if (!pill) return;
      playPop();
      els.filtersRow.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      state.dietaryFilter = pill.dataset.filter;
      renderBoard();
    });

    // Search input
    let searchTimer;
    els.search.addEventListener('input', (event) => {
      window.clearTimeout(searchTimer);
      const val = event.target.value;
      searchTimer = window.setTimeout(() => {
        state.query = val;
        renderBoard();
      }, 130);
    });

    // Sound toggle
    els.soundBtn.addEventListener('click', () => {
      state.sound = !state.sound;
      localStorage.setItem(SOUND_KEY, state.sound ? 'true' : 'false');
      els.soundIcon.textContent = state.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
      if (state.sound) playPop();
    });

    // Copy WiFi button
    els.copyWifi.addEventListener('click', () => {
      playPop();
      const pass = els.wifiPass.textContent;
      navigator.clipboard.writeText(pass).then(() => {
        showToast('WiFi password copied to clipboard!');
      });
    });

    // Table Pill click: opens QR modal to select/view table
    els.tablePill.addEventListener('click', () => {
      els.qrTableSelect.value = state.table;
      openQrModal();
    });

    // Add to tray clicks inside grid (delegated)
    els.grid.addEventListener('click', (event) => {
      const addBtn = event.target.closest('[data-add]');
      if (addBtn) {
        addToTray(addBtn.dataset.add);
        return;
      }
      const bounceArt = event.target.closest('[data-art-bounce]');
      if (bounceArt) {
        playPop();
        const svg = bounceArt.querySelector('svg');
        if (svg) {
          svg.style.transition = 'transform 0.15s cubic-bezier(0.2, 1.8, 0.5, 1)';
          svg.style.transform = 'scale(1.22) rotate(-6deg)';
          setTimeout(() => {
            svg.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            svg.style.transform = '';
          }, 240);
        }
      }
    });

    // 3D Card cursor glow
    els.grid.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });

    // Tray interactions
    els.openTrayBtn.addEventListener('click', openTrayDrawer);
    els.closeTrayBtn.addEventListener('click', closeTrayDrawer);
    els.trayDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === els.trayDrawerBackdrop) closeTrayDrawer();
    });

    els.trayList.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-qty-change]');
      if (!btn) return;
      updateQty(btn.dataset.qtyChange, Number(btn.dataset.delta) || 0);
    });

    els.sendWhatsappBtn.addEventListener('click', sendWhatsAppOrder);
    els.callWaiterBtn.addEventListener('click', callWaiter);
    els.clearTrayBtn.addEventListener('click', () => {
      state.tray = {};
      updateTrayUI();
      closeTrayDrawer();
      showToast('Tray cleared');
    });

    // QR / Table modal interactions
    if (els.openQr) els.openQr.addEventListener('click', openQrModal);
    if (els.closeQr) els.closeQr.addEventListener('click', closeQrModal);
    if (els.qrModal) {
      els.qrModal.addEventListener('click', (e) => {
        if (e.target === els.qrModal) closeQrModal();
      });
    }

    if (els.qrTableSelect) {
      els.qrTableSelect.addEventListener('change', () => {
        state.table = els.qrTableSelect.value;
        if (els.tablePillText) els.tablePillText.textContent = `Table #${state.table}`;
        if (els.drawerTableLabel) els.drawerTableLabel.textContent = `Table #${state.table} \u2022 Dine-In`;
        openQrModal();
      });
    }

    if (els.printQrBtn) els.printQrBtn.addEventListener('click', () => window.print());

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeQrModal();
        closeTrayDrawer();
      }
    });
  }

  /* --------------------------------------------------------------- Boot */
  async function boot() {
    els.soundIcon.textContent = state.sound ? '\uD83D\uDD0A' : '\uD83D\uDD07';
    bindEvents();
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.menu = await response.json();
      renderHeader(state.menu);
      renderChips(state.menu);
      renderBoard();
      updateTrayUI();
    } catch (error) {
      els.grid.innerHTML =
        `<div class="empty"><strong>Menu could not be loaded</strong>` +
        `${escapeHtml(error.message)}<br />Ensure server is running with <code>npm start</code>.</div>`;
      els.empty.hidden = true;
    }
  }

  boot();
})();
