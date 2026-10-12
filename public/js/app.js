'use strict';

/**
 * Public menu page.
 * Pulls the live menu from /api/menu and renders animated category cards.
 */
(function () {
  const state = {
    menu: null,
    query: '',
    activeCategory: 'all',
  };

  const els = {
    logo: document.getElementById('cafeLogo'),
    name: document.getElementById('cafeName'),
    tagline: document.getElementById('cafeTagline'),
    heroTitle: document.getElementById('heroTitle'),
    heroText: document.getElementById('heroText'),
    heroArt: document.getElementById('heroArt'),
    statCategories: document.getElementById('statCategories'),
    statItems: document.getElementById('statItems'),
    statCurrency: document.getElementById('statCurrency'),
    footerCafe: document.getElementById('footerCafe'),
    footerNote: document.getElementById('footerNote'),
    chips: document.getElementById('chips'),
    grid: document.getElementById('grid'),
    empty: document.getElementById('emptyState'),
    search: document.getElementById('search'),
    qrModal: document.getElementById('qrModal'),
    qrImage: document.getElementById('qrImage'),
    qrUrl: document.getElementById('qrUrl'),
  };

  /* ------------------------------------------------------------------ */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('.item').forEach((item, index) => {
          item.style.animationDelay = `${Math.min(index * 70, 700)}ms`;
        });
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
  );

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

  function badgeClass(badge) {
    const hot = /spicy|hot|new/i.test(badge);
    return hot ? 'badge badge--hot' : 'badge';
  }

  /* ------------------------------------------------------------------ */

  function renderHeader(menu) {
    const { cafe } = menu;
    document.title = `${cafe.name} \u2014 Menu`;
    els.logo.textContent = cafe.logo || '\u2615';
    els.name.textContent = cafe.name;
    els.tagline.textContent = cafe.tagline;
    els.heroTitle.textContent = cafe.name;
    els.heroText.textContent = cafe.tagline;
    els.footerCafe.textContent = cafe.name;
    els.footerNote.textContent = cafe.footer;

    const totalItems = menu.categories.reduce((sum, category) => sum + category.items.length, 0);
    els.statCategories.textContent = menu.categories.length;
    els.statItems.textContent = totalItems;
    els.statCurrency.textContent = cafe.currency || '\u2014';
    els.heroArt.innerHTML = renderCategoryIcon(menu.categories[0] ? menu.categories[0].icon : 'coffee');
  }

  function renderChips(menu) {
    const total = menu.categories.reduce((sum, category) => sum + category.items.length, 0);
    const chips = [
      `<button class="chip" data-category="all" type="button">All<span class="chip__count">${total}</span></button>`,
      ...menu.categories.map(
        (category) =>
          `<button class="chip" data-category="${escapeHtml(category.id)}" type="button">` +
          `${escapeHtml(category.name)}<span class="chip__count">${category.items.length}</span></button>`
      ),
    ];
    els.chips.innerHTML = chips.join('');
  }

  function itemMarkup(item, currency) {
    const badge = item.badge ? `<span class="${badgeClass(item.badge)}">${escapeHtml(item.badge)}</span>` : '';
    const desc = item.description ? `<div class="item__desc">${escapeHtml(item.description)}</div>` : '';
    return `
      <li class="item">
        <div class="item__main">
          <div class="item__top">
            <span class="item__name">${escapeHtml(item.name)}${badge}</span>
            <span class="item__leader"></span>
            <span class="item__price">${escapeHtml(money(item.price, currency))}</span>
          </div>
          ${desc}
        </div>
      </li>`;
  }

  function cardMarkup(category, currency) {
    const items = category.items.map((item) => itemMarkup(item, currency)).join('');
    const note = category.description ? `<p class="card__note">${escapeHtml(category.description)}</p>` : '';
    return `
      <article class="card" id="cat-${escapeHtml(category.id)}" data-category="${escapeHtml(category.id)}">
        <div class="card__art">${renderCategoryIcon(category.icon)}</div>
        <div class="card__body">
          <div class="card__head">
            <div>
              <h2 class="card__title">${escapeHtml(category.name)}</h2>
              ${note}
            </div>
            <span class="card__count">${category.items.length} items</span>
          </div>
          <ul class="items">${items}</ul>
        </div>
      </article>`;
  }

  /* ------------------------------------------------------------------ */

  function visibleCategories() {
    const query = state.query.trim().toLowerCase();
    return state.menu.categories
      .filter((category) => state.activeCategory === 'all' || category.id === state.activeCategory)
      .map((category) => {
        if (!query) return category;
        const items = category.items.filter((item) =>
          `${item.name} ${item.description} ${item.badge}`.toLowerCase().includes(query)
        );
        return { ...category, items };
      })
      .filter((category) => !query || category.items.length > 0 || category.name.toLowerCase().includes(query));
  }

  function renderBoard() {
    const categories = visibleCategories();
    const currency = state.menu.cafe.currency;

    if (!categories.length) {
      els.grid.innerHTML = '';
      els.empty.hidden = false;
      els.empty.className = 'empty';
      els.empty.innerHTML = '<strong>Nothing matched that search</strong>Try another dish or clear the search box.';
      return;
    }

    els.empty.hidden = true;
    els.grid.innerHTML = categories.map((category) => cardMarkup(category, currency)).join('');

    els.grid.querySelectorAll('.card').forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
      revealObserver.observe(card);
    });

    applyActiveChip();
  }

  function applyActiveChip() {
    els.chips.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.toggle('is-active', chip.dataset.category === state.activeCategory);
    });
  }

  /* ------------------------------------------------------------------ */

  function bindEvents() {
    els.chips.addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      state.activeCategory = chip.dataset.category;
      renderBoard();
      const target = document.getElementById(`cat-${state.activeCategory}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let searchTimer;
    els.search.addEventListener('input', (event) => {
      window.clearTimeout(searchTimer);
      const value = event.target.value;
      searchTimer = window.setTimeout(() => {
        state.query = value;
        state.activeCategory = 'all';
        renderBoard();
      }, 140);
    });

    // Cursor-following glow on cards
    els.grid.addEventListener('pointermove', (event) => {
      const card = event.target.closest('.card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });

    document.getElementById('openQr').addEventListener('click', () => {
      const url = window.location.origin + '/';
      els.qrUrl.textContent = url;
      els.qrImage.src = `/qr.png?url=${encodeURIComponent(url)}&size=600`;
      els.qrModal.classList.add('is-open');
    });
    document.getElementById('closeQr').addEventListener('click', () => els.qrModal.classList.remove('is-open'));
    els.qrModal.addEventListener('click', (event) => {
      if (event.target === els.qrModal) els.qrModal.classList.remove('is-open');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') els.qrModal.classList.remove('is-open');
    });
  }

  async function boot() {
    bindEvents();
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.menu = await response.json();
      renderHeader(state.menu);
      renderChips(state.menu);
      renderBoard();
    } catch (error) {
      els.grid.innerHTML =
        `<div class="empty"><strong>The menu could not be loaded</strong>` +
        `${escapeHtml(error.message)}<br />Start the server with <code>npm start</code> and refresh.</div>`;
      els.empty.hidden = true;
    }
  }

  boot();
})();
