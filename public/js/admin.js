'use strict';

/**
 * Admin dashboard controller.
 * Authenticates with admin password, then provides full CRUD control over
 * cafe categories, dishes, prices, operational settings, and table QR codes.
 */
(function () {
  const TOKEN_KEY = 'cafe-menu-admin-token';
  const AUTOSAVE_MS = 500;

  const state = {
    token: localStorage.getItem(TOKEN_KEY) || '',
    menu: null,
    searchFilter: '',
    selectedTable: '1',
  };

  const els = {
    loginView: document.getElementById('loginView'),
    dashView: document.getElementById('dashView'),
    loginForm: document.getElementById('loginForm'),
    password: document.getElementById('password'),
    loginError: document.getElementById('loginError'),
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    saveState: document.getElementById('saveState'),
    cafeLogo: document.getElementById('cafeLogo'),
    stats: document.getElementById('stats'),
    cats: document.getElementById('cats'),
    catsEmpty: document.getElementById('catsEmpty'),
    adminSearchInput: document.getElementById('adminSearchInput'),
    adminTableSelect: document.getElementById('adminTableSelect'),
    adminQrPreview: document.getElementById('adminQrPreview'),
    adminQrUrl: document.getElementById('adminQrUrl'),
    adminPrintTableBtn: document.getElementById('adminPrintTableBtn'),
    formModal: document.getElementById('formModal'),
    formTitle: document.getElementById('formTitle'),
    formBody: document.getElementById('formBody'),
    toast: document.getElementById('toast'),
  };

  /* ------------------------------------------------------------- Helpers */
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  let toastTimer;
  function toast(message, kind) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.className = `toast is-on${kind ? ` is-${kind}` : ''}`;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      els.toast.className = 'toast';
    }, 2600);
  }

  function setSaveState(text) {
    if (els.saveState) els.saveState.textContent = text;
  }

  function iconOptions(selected) {
    return window.CategoryIconKeys
      .map((key) => `<option value="${key}"${key === selected ? ' selected' : ''}>${key}</option>`)
      .join('');
  }

  async function api(path, options) {
    const config = Object.assign({ method: 'GET' }, options);
    config.headers = Object.assign({ 'Content-Type': 'application/json' }, config.headers);
    if (state.token) config.headers.Authorization = `Bearer ${state.token}`;
    if (config.body !== undefined && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(path, config);
    if (response.status === 401 && !config.noAuthRedirect) {
      signOut('Your session expired. Please sign in again.');
      throw new Error('Unauthorized');
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }

  /* --------------------------------------------------------------- Login */
  async function signIn(password) {
    const data = await api('/api/admin/login', { method: 'POST', body: { password }, noAuthRedirect: true });
    state.token = data.token;
    localStorage.setItem(TOKEN_KEY, data.token);
    await enterDashboard();
  }

  function signOut(message) {
    state.token = '';
    state.menu = null;
    localStorage.removeItem(TOKEN_KEY);
    els.dashView.hidden = true;
    els.loginView.hidden = false;
    els.logoutBtn.hidden = true;
    setSaveState('Not signed in');
    if (message) toast(message, 'bad');
  }

  async function enterDashboard() {
    els.loginView.hidden = true;
    els.dashView.hidden = false;
    els.logoutBtn.hidden = false;
    setSaveState('Loading\u2026');
    await reload();
  }

  /* ------------------------------------------------------------ Rendering */
  async function reload() {
    const menu = await api('/api/menu');
    state.menu = menu;
    render();
    setSaveState('All changes saved');
  }

  function render() {
    const { cafe, categories } = state.menu;
    document.title = `Admin \u2014 ${cafe.name}`;
    els.cafeLogo.textContent = cafe.logo || '\u2699';

    document.querySelectorAll('[data-cafe]').forEach((input) => {
      if (document.activeElement !== input) input.value = cafe[input.dataset.cafe] || '';
    });

    const items = categories.reduce((sum, category) => sum + category.items.length, 0);
    const prices = categories.flatMap((category) => category.items.map((item) => Number(item.price) || 0));
    const average = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

    els.stats.innerHTML = `
      <div class="stat"><b>${categories.length}</b><span>Categories</span></div>
      <div class="stat"><b>${items}</b><span>Dishes</span></div>
      <div class="stat"><b>${average}</b><span>Avg. price (${escapeHtml(cafe.currency)})</span></div>
      <div class="stat"><b>${escapeHtml(cafe.currency)}</b><span>Currency</span></div>`;

    updateTableQrStudio();
    renderCategories();
  }

  function updateTableQrStudio() {
    if (!els.adminQrPreview) return;
    const table = els.adminTableSelect ? els.adminTableSelect.value : state.selectedTable;
    const url = `${window.location.origin}/?table=${encodeURIComponent(table)}`;
    els.adminQrPreview.src = `/qr.png?url=${encodeURIComponent(url)}&size=300`;
    if (els.adminQrUrl) els.adminQrUrl.textContent = url;
  }

  function renderCategories() {
    const { categories, cafe } = state.menu;
    const query = state.searchFilter.trim().toLowerCase();

    const filteredCats = categories.filter((category) => {
      if (!query) return true;
      if (category.name.toLowerCase().includes(query)) return true;
      return category.items.some((item) =>
        `${item.name} ${item.description} ${item.badge}`.toLowerCase().includes(query)
      );
    });

    els.catsEmpty.hidden = filteredCats.length > 0;

    els.cats.innerHTML = filteredCats
      .map((category, index) => {
        const categorySelect = categories
          .map(
            (entry) =>
              `<option value="${escapeHtml(entry.id)}"${entry.id === category.id ? ' selected' : ''}>${escapeHtml(entry.name)}</option>`
          )
          .join('');

        const displayItems = query
          ? category.items.filter((item) =>
              `${item.name} ${item.description} ${item.badge}`.toLowerCase().includes(query)
            )
          : category.items;

        const rows = displayItems
          .map(
            (item) => `
          <div class="item-row" data-item-row="${escapeHtml(item.id)}">
            <input data-item-id="${escapeHtml(item.id)}" data-field="name" value="${escapeHtml(item.name)}" placeholder="Dish name" title="Dish name" />
            <input data-item-id="${escapeHtml(item.id)}" data-field="description" value="${escapeHtml(item.description)}" placeholder="Description" title="Description" />
            <input data-item-id="${escapeHtml(item.id)}" data-field="price" type="number" step="0.01" min="0" value="${Number(item.price) || 0}" title="Price" />
            <input data-item-id="${escapeHtml(item.id)}" data-field="badge" value="${escapeHtml(item.badge)}" placeholder="Badge (e.g. Popular)" title="Badge" />
            <select data-item-id="${escapeHtml(item.id)}" data-field="categoryId" title="Category">${categorySelect}</select>
            <button class="btn btn--danger btn--tiny" data-delete-item="${escapeHtml(item.id)}" type="button" title="Delete dish">Delete</button>
          </div>`
          )
          .join('');

        return `
      <article class="cat" data-cat="${escapeHtml(category.id)}">
        <div class="cat__head">
          <div class="cat__art" data-art="${escapeHtml(category.id)}">${renderCategoryIcon(category.icon)}</div>
          <div class="cat__fields">
            <label class="field">
              <span>Category name</span>
              <input data-cat-id="${escapeHtml(category.id)}" data-field="name" value="${escapeHtml(category.name)}" />
            </label>
            <label class="field">
              <span>Illustration</span>
              <select data-cat-id="${escapeHtml(category.id)}" data-field="icon">${iconOptions(category.icon)}</select>
            </label>
            <label class="field cat__desc">
              <span>Description</span>
              <input data-cat-id="${escapeHtml(category.id)}" data-field="description" value="${escapeHtml(category.description)}" />
            </label>
          </div>
          <div class="cat__actions">
            <button class="btn btn--ghost btn--tiny" data-move="up" data-cat-id="${escapeHtml(category.id)}" type="button"${index === 0 ? ' disabled' : ''}>&uarr;</button>
            <button class="btn btn--ghost btn--tiny" data-move="down" data-cat-id="${escapeHtml(category.id)}" type="button"${index === categories.length - 1 ? ' disabled' : ''}>&darr;</button>
            <button class="btn btn--danger btn--tiny" data-delete-cat="${escapeHtml(category.id)}" type="button">Delete</button>
          </div>
        </div>
        <div class="cat__body">
          <div class="item-row item-row--head">
            <span>Name</span><span>Description</span><span>Price</span><span>Badge</span><span>Category</span><span></span>
          </div>
          ${rows || '<p class="hint">No dishes yet &mdash; add the first one below.</p>'}
          <div class="cat__foot">
            <button class="btn btn--primary btn--tiny" data-add-item="${escapeHtml(category.id)}" type="button">+ Add Dish</button>
            <span class="hint">${category.items.length} dish${category.items.length === 1 ? '' : 'es'} in ${escapeHtml(cafe.currency)}</span>
          </div>
        </div>
      </article>`;
      })
      .join('');
  }

  /* ------------------------------------------------------------- Autosave */
  const timers = new WeakMap();

  function queueSave(element, run) {
    window.clearTimeout(timers.get(element));
    timers.set(element, window.setTimeout(async () => {
      try {
        setSaveState('Saving\u2026');
        await run();
        setSaveState('All changes saved');
      } catch (error) {
        setSaveState('Save failed');
        toast(error.message, 'bad');
      }
    }, AUTOSAVE_MS));
  }

  function saveField(element, field, context) {
    const value = element.value;
    queueSave(element, async () => {
      if (context.type === 'cafe') {
        await api('/api/admin/cafe', { method: 'PUT', body: { [field]: value } });
        state.menu.cafe[field] = value;
      } else if (context.type === 'category') {
        await api(`/api/admin/categories/${context.id}`, { method: 'PUT', body: { [field]: value } });
        const category = state.menu.categories.find((entry) => entry.id === context.id);
        if (category) category[field] = value;
      } else {
        await api(`/api/admin/items/${context.id}`, { method: 'PUT', body: { [field]: value } });
        for (const category of state.menu.categories) {
          const item = category.items.find((entry) => entry.id === context.id);
          if (item) item[field] = field === 'price' ? Number(value) || 0 : value;
        }
      }
    });
  }

  function attachAutoSave(element, field, context) {
    const eventName = element.tagName === 'SELECT' ? 'change' : 'input';
    element.addEventListener(eventName, () => saveField(element, field, context));
  }

  /* --------------------------------------------------------------- Modal */
  function openModal(title, html, onSubmit) {
    els.formTitle.textContent = title;
    els.formBody.innerHTML = html;
    els.formModal.classList.add('is-open');
    const first = els.formBody.querySelector('input, select, textarea');
    if (first) first.focus();

    els.formBody.onsubmit = async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(els.formBody).entries());
      try {
        await onSubmit(data);
        closeModal();
      } catch (error) {
        toast(error.message, 'bad');
      }
    };
  }

  function closeModal() {
    els.formModal.classList.remove('is-open');
    els.formBody.innerHTML = '';
  }

  function addCategoryModal() {
    openModal(
      'Add Category',
      `<label class="field"><span>Category Name</span><input name="name" required placeholder="e.g. Gourmet Wraps" /></label>
       <label class="field"><span>Animated Illustration</span><select name="icon">${iconOptions('burger')}</select></label>
       <label class="field"><span>Description</span><input name="description" placeholder="Shown under the category title" /></label>
       <div class="row">
         <button class="btn btn--ghost" type="button" data-close-modal>Cancel</button>
         <button class="btn btn--primary" type="submit">Create Category</button>
       </div>`,
      async (data) => {
        await api('/api/admin/categories', { method: 'POST', body: data });
        await reload();
        toast('Category added', 'good');
      }
    );
  }

  function addItemModal(categoryId) {
    const category = state.menu.categories.find((entry) => entry.id === categoryId);
    openModal(
      `Add Dish to ${escapeHtml(category ? category.name : '')}`,
      `<label class="field"><span>Dish Name</span><input name="name" required placeholder="e.g. Crispy Jalapeño Crunch" /></label>
       <label class="field"><span>Description</span><input name="description" placeholder="Ingredients, garnishes, and flavor profile" /></label>
       <div class="settings">
         <label class="field"><span>Price (${escapeHtml(state.menu.cafe.currency)})</span><input name="price" type="number" min="0" step="0.01" value="0" required /></label>
         <label class="field"><span>Badge</span>
           <select name="badge">
             <option value="">None</option>
             <option value="Popular">Popular 🔥</option>
             <option value="Spicy">Spicy 🌶️</option>
             <option value="New">New ✨</option>
             <option value="Signature">Signature ⭐</option>
             <option value="Veg">Vegetarian 🌱</option>
           </select>
         </label>
       </div>
       <div class="row">
         <button class="btn btn--ghost" type="button" data-close-modal>Cancel</button>
         <button class="btn btn--primary" type="submit">Add Dish</button>
       </div>`,
      async (data) => {
        await api(`/api/admin/categories/${categoryId}/items`, { method: 'POST', body: data });
        await reload();
        toast('Dish added', 'good');
      }
    );
  }

  /* -------------------------------------------------------------- Events */
  function bindEvents() {
    els.loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      els.loginError.hidden = true;
      els.loginBtn.disabled = true;
      els.loginBtn.textContent = 'Signing in\u2026';
      try {
        await signIn(els.password.value);
        els.password.value = '';
        toast('Welcome back to Cafe Admin', 'good');
      } catch (error) {
        els.loginError.hidden = false;
        els.loginError.textContent = error.message;
      } finally {
        els.loginBtn.disabled = false;
        els.loginBtn.textContent = 'Sign in';
      }
    });

    els.logoutBtn.addEventListener('click', () => signOut('Signed out.'));

    document.getElementById('refreshBtn').addEventListener('click', () =>
      reload().then(() => toast('Menu reloaded', 'good'))
    );

    document.getElementById('addCategoryBtn').addEventListener('click', addCategoryModal);

    document.getElementById('resetBtn').addEventListener('click', async () => {
      if (!window.confirm('Reset menu to sample data? All custom dishes and categories will be restored to defaults.')) return;
      try {
        await api('/api/admin/reset', { method: 'POST' });
        await reload();
        toast('Sample menu restored', 'good');
      } catch (error) {
        toast(error.message, 'bad');
      }
    });

    // Admin search filter
    if (els.adminSearchInput) {
      els.adminSearchInput.addEventListener('input', (e) => {
        state.searchFilter = e.target.value;
        renderCategories();
      });
    }

    // Admin Table select
    if (els.adminTableSelect) {
      els.adminTableSelect.addEventListener('change', () => {
        state.selectedTable = els.adminTableSelect.value;
        updateTableQrStudio();
      });
    }

    // Admin print table stand
    if (els.adminPrintTableBtn) {
      els.adminPrintTableBtn.addEventListener('click', () => {
        const table = els.adminTableSelect ? els.adminTableSelect.value : state.selectedTable;
        window.open(`/?table=${encodeURIComponent(table)}`, '_blank');
      });
    }

    // Static cafe settings autosave
    document.querySelectorAll('[data-cafe]').forEach((input) => {
      attachAutoSave(input, input.dataset.cafe, { type: 'cafe' });
    });

    // Delegated edits inside category board
    els.cats.addEventListener('input', (event) => {
      const element = event.target;
      if (element.dataset.catId) {
        saveField(element, element.dataset.field, { type: 'category', id: element.dataset.catId });
        return;
      }
      if (element.dataset.itemId && element.dataset.field !== 'categoryId') {
        saveField(element, element.dataset.field, { type: 'item', id: element.dataset.itemId });
      }
    });

    els.cats.addEventListener('change', (event) => {
      const element = event.target;
      if (element.tagName !== 'SELECT') return;

      if (element.dataset.catId) {
        const catId = element.dataset.catId;
        queueSave(element, async () => {
          await api(`/api/admin/categories/${catId}`, { method: 'PUT', body: { icon: element.value } });
          const category = state.menu.categories.find((entry) => entry.id === catId);
          if (category) category.icon = element.value;
          const art = els.cats.querySelector(`[data-art="${catId}"]`);
          if (art) art.innerHTML = renderCategoryIcon(element.value);
        });
        return;
      }

      if (element.dataset.itemId && element.dataset.field === 'categoryId') {
        const itemId = element.dataset.itemId;
        queueSave(element, async () => {
          await api(`/api/admin/items/${itemId}`, { method: 'PUT', body: { categoryId: element.value } });
          await reload();
          toast('Dish moved to new category', 'good');
        });
      }
    });

    els.cats.addEventListener('click', async (event) => {
      const target = event.target;
      if (target.closest('[data-close-modal]')) return;

      const moveBtn = target.closest('[data-move]');
      if (moveBtn) {
        const id = moveBtn.dataset.catId;
        const order = state.menu.categories.map((entry) => entry.id);
        const index = order.indexOf(id);
        const next = moveBtn.dataset.move === 'up' ? index - 1 : index + 1;
        if (next < 0 || next >= order.length) return;
        [order[index], order[next]] = [order[next], order[index]];
        await api('/api/admin/categories/reorder', { method: 'POST', body: { order } });
        await reload();
        return;
      }

      const addItemBtn = target.closest('[data-add-item]');
      if (addItemBtn) {
        addItemModal(addItemBtn.dataset.addItem);
        return;
      }

      const deleteItemBtn = target.closest('[data-delete-item]');
      if (deleteItemBtn) {
        const id = deleteItemBtn.dataset.deleteItem;
        if (!window.confirm('Delete this dish?')) return;
        try {
          await api(`/api/admin/items/${id}`, { method: 'DELETE' });
          await reload();
          toast('Dish deleted', 'good');
        } catch (error) {
          toast(error.message, 'bad');
        }
        return;
      }

      const deleteCatBtn = target.closest('[data-delete-cat]');
      if (deleteCatBtn) {
        const id = deleteCatBtn.dataset.deleteCat;
        if (!window.confirm('Delete this category and all of its dishes?')) return;
        try {
          await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
          await reload();
          toast('Category deleted', 'good');
        } catch (error) {
          toast(error.message, 'bad');
        }
      }
    });

    els.formModal.addEventListener('click', (event) => {
      if (event.target === els.formModal || event.target.closest('[data-close-modal]')) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  }

  /* --------------------------------------------------------------- Boot */
  async function boot() {
    bindEvents();
    if (!state.token) return;
    try {
      await api('/api/admin/session');
      await enterDashboard();
    } catch {
      /* signOut already handled the 401 case */
    }
  }

  boot();
})();
