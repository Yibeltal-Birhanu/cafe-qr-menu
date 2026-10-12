'use strict';

const path = require('path');
const express = require('express');
const QRCode = require('qrcode');

const store = require('./store');
const auth = require('./auth');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

app.use(express.json({ limit: '256kb' }));
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()) });
});

app.get('/api/menu', (req, res) => {
  res.json(store.get());
});

/** PNG QR code the cafe can print: /qr.png?url=https://example.com */
app.get('/qr.png', async (req, res) => {
  const target = req.query.url || `${req.protocol}://${req.get('host')}/`;
  try {
    const png = await QRCode.toBuffer(String(target), {
      type: 'png',
      width: Number(req.query.size) || 512,
      margin: 2,
      color: { dark: '#2b1810ff', light: '#fffaf4ff' },
    });
    res.type('png').set('Cache-Control', 'public, max-age=3600').send(png);
  } catch (error) {
    res.status(400).json({ error: `Could not build a QR code: ${error.message}` });
  }
});

/* ------------------------------------------------------------------ *
 * Admin: session
 * ------------------------------------------------------------------ */

app.post('/api/admin/login', (req, res) => {
  if (!auth.checkPassword(req.body && req.body.password)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  return res.json({ token: auth.createToken() });
});

/* Everything below requires a valid session token. */
app.use('/api/admin', auth.requireAuth);

/** Lets the dashboard check whether a stored token is still valid. */
app.get('/api/admin/session', (req, res) => {
  res.json({ ok: true });
});

/* ------------------------------------------------------------------ *
 * Admin: cafe profile
 * ------------------------------------------------------------------ */

app.put('/api/admin/cafe', (req, res) => {
  const body = req.body || {};
  const cafe = store.update((data) => {
    for (const key of ['name', 'tagline', 'currency', 'footer', 'logo']) {
      if (typeof body[key] === 'string' && body[key].trim()) data.cafe[key] = body[key].trim();
    }
    return data.cafe;
  });
  res.json({ cafe });
});

/* ------------------------------------------------------------------ *
 * Admin: categories
 * ------------------------------------------------------------------ */

app.post('/api/admin/categories', (req, res) => {
  const body = req.body || {};
  if (!body.name || !String(body.name).trim()) {
    return res.status(400).json({ error: 'A category name is required.' });
  }
  const category = store.update((data) => {
    const taken = new Set(data.categories.map((entry) => entry.id));
    const created = {
      id: store.newId(body.name, taken),
      name: String(body.name).trim(),
      icon: String(body.icon || 'coffee'),
      description: String(body.description || ''),
      items: [],
    };
    data.categories.push(created);
    return created;
  });
  res.status(201).json({ category });
});

app.put('/api/admin/categories/:id', (req, res) => {
  const body = req.body || {};
  const category = store.update((data) => {
    const target = store.findCategory(data, req.params.id);
    if (!target) return null;
    if (typeof body.name === 'string' && body.name.trim()) target.name = body.name.trim();
    if (typeof body.icon === 'string' && body.icon.trim()) target.icon = body.icon.trim();
    if (typeof body.description === 'string') target.description = body.description;
    return target;
  });
  if (!category) return res.status(404).json({ error: 'Category not found.' });
  return res.json({ category });
});

app.delete('/api/admin/categories/:id', (req, res) => {
  const removed = store.update((data) => {
    const index = data.categories.findIndex((entry) => entry.id === req.params.id);
    if (index === -1) return null;
    return data.categories.splice(index, 1)[0];
  });
  if (!removed) return res.status(404).json({ error: 'Category not found.' });
  return res.json({ removed });
});

/** Reorder the whole board: { order: ["burgers", "pizza", ...] } */
app.post('/api/admin/categories/reorder', (req, res) => {
  const order = Array.isArray(req.body && req.body.order) ? req.body.order : null;
  if (!order) return res.status(400).json({ error: 'Send { order: [categoryId, ...] }.' });
  const categories = store.update((data) => {
    const ranked = [...data.categories].sort((a, b) => {
      const ai = order.indexOf(a.id);
      const bi = order.indexOf(b.id);
      return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
    });
    data.categories = ranked;
    return data.categories;
  });
  res.json({ categories });
});

/* ------------------------------------------------------------------ *
 * Admin: items
 * ------------------------------------------------------------------ */

app.post('/api/admin/categories/:id/items', (req, res) => {
  const body = req.body || {};
  if (!body.name || !String(body.name).trim()) {
    return res.status(400).json({ error: 'An item name is required.' });
  }
  const item = store.update((data) => {
    const category = store.findCategory(data, req.params.id);
    if (!category) return null;
    const taken = new Set(data.categories.flatMap((entry) => entry.items.map((it) => it.id)));
    const created = {
      id: store.newId(body.name, taken),
      name: String(body.name).trim(),
      description: String(body.description || ''),
      price: Number(body.price) || 0,
      badge: body.badge ? String(body.badge).trim() : '',
    };
    category.items.push(created);
    return created;
  });
  if (!item) return res.status(404).json({ error: 'Category not found.' });
  return res.status(201).json({ item });
});

app.put('/api/admin/items/:id', (req, res) => {
  const body = req.body || {};
  const item = store.update((data) => {
    const found = store.findItem(data, req.params.id);
    if (!found) return null;
    if (typeof body.name === 'string' && body.name.trim()) found.item.name = body.name.trim();
    if (typeof body.description === 'string') found.item.description = body.description;
    if (body.price !== undefined) found.item.price = Number(body.price) || 0;
    if (typeof body.badge === 'string') found.item.badge = body.badge.trim();
    if (typeof body.categoryId === 'string' && body.categoryId !== found.category.id) {
      const next = store.findCategory(data, body.categoryId);
      if (next) {
        found.category.items = found.category.items.filter((entry) => entry.id !== found.item.id);
        next.items.push(found.item);
      }
    }
    return found.item;
  });
  if (!item) return res.status(404).json({ error: 'Item not found.' });
  return res.json({ item });
});

app.delete('/api/admin/items/:id', (req, res) => {
  const removed = store.update((data) => {
    for (const category of data.categories) {
      const index = category.items.findIndex((entry) => entry.id === req.params.id);
      if (index !== -1) return category.items.splice(index, 1)[0];
    }
    return null;
  });
  if (!removed) return res.status(404).json({ error: 'Item not found.' });
  return res.json({ removed });
});

/* ------------------------------------------------------------------ *
 * Admin: danger zone
 * ------------------------------------------------------------------ */

app.post('/api/admin/reset', (req, res) => {
  res.json({ menu: store.reset() });
});

/* ------------------------------------------------------------------ */

app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown API route.' }));

app.use((error, req, res, next) => {
  console.error('[server]', error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ error: 'Something went wrong on the server.' });
});

store.load();
app.listen(PORT, () => {
  console.log(`\n  \u2615  Prism Cafe QR menu`);
  console.log(`     Menu    http://localhost:${PORT}/`);
  console.log(`     Admin   http://localhost:${PORT}/admin`);
  console.log(`     Data    ${store.MENU_FILE}\n`);
});
