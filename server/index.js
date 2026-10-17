'use strict';

const path = require('path');
const express = require('express');
const QRCode = require('qrcode');

const store = require('./store');
const {
  auth,
  toNodeHandler,
  requireAuth,
  requireSuperAdmin,
  checkPassword,
  createToken,
  createManagerUser,
  bootstrapSuperAdmin,
} = require('./auth');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

app.use(express.json({ limit: '256kb' }));

/* ------------------------------------------------------------------ *
 * Better Auth API Handlers
 * ------------------------------------------------------------------ */

app.all('/api/auth/*', toNodeHandler(auth.handler));

/* ------------------------------------------------------------------ *
 * Page Routes
 * ------------------------------------------------------------------ */

/** Central CafeMenu marketing landing page */
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'landing.html'));
});

/** Live demo Cafe digital menu (supports both /cafe, /cafe/:slug, and /abol-cafe) */
app.get(['/cafe', '/abol-cafe', '/cafe/:cafeSlug'], (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'menu.html'));
});

/** Redirect legacy /index or /index.html aliases to the preserved Abol Cafe menu */
app.get(['/index', '/index.html'], (req, res) => {
  res.redirect(301, '/abol-cafe');
});

// Static assets (css, js, images, videos, admin.html)
app.use(express.static(PUBLIC_DIR, { index: false, extensions: ['html'] }));

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()) });
});

/** Default menu endpoint for backward compatibility */
app.get('/api/menu', (req, res) => {
  const tenant = req.query.cafe || 'abol-cafe';
  res.json(store.get(tenant));
});

/** Multi-tenant scoped public menu */
app.get('/api/:cafeSlug/menu', (req, res, next) => {
  if (['auth', 'admin', 'superadmin', 'health', 'menu'].includes(req.params.cafeSlug)) return next();
  res.json(store.get(req.params.cafeSlug));
});

/** PNG QR code default */
app.get('/qr.png', async (req, res) => {
  const target = req.query.url || `${req.protocol}://${req.get('host')}/abol-cafe`;
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

/** Multi-tenant PNG QR code: /api/:cafeSlug/qr.png */
app.get('/api/:cafeSlug/qr.png', async (req, res, next) => {
  if (['auth', 'admin', 'superadmin'].includes(req.params.cafeSlug)) return next();
  const slug = req.params.cafeSlug;
  const target = req.query.url || `${req.protocol}://${req.get('host')}/cafe/${slug}`;
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
 * Super Admin Management API
 * ------------------------------------------------------------------ */

app.use('/api/superadmin', requireSuperAdmin);

/** List all platform cafes with their managers and dish counts */
app.get('/api/superadmin/cafes', async (req, res) => {
  const cafes = await store.listAllCafesWithManagers();
  res.json({ cafes });
});

/** Create a new cafe AND its manager user simultaneously */
app.post('/api/superadmin/cafes', async (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.slug) {
    return res.status(400).json({ error: 'Cafe name and slug are required.' });
  }

  try {
    let manager = null;
    if (body.managerEmail && body.managerPassword) {
      manager = await createManagerUser({
        email: body.managerEmail,
        password: body.managerPassword,
        name: body.managerName || `${body.name} Manager`,
      });
    }

    const created = await store.createCafe({
      slug: body.slug,
      name: body.name,
      tagline: body.tagline || '',
      currency: body.currency || 'ETB',
      ownerId: manager ? manager.id : null,
      phone: body.phone || '',
      wifi_ssid: body.wifi_ssid || '',
      wifi_pass: body.wifi_pass || '',
      status: body.status || 'active',
      template: body.template || 'seed',
    });

    res.status(201).json({
      cafe: created.cafe,
      manager: manager
        ? { id: manager.id, email: manager.email, name: manager.name, role: manager.role }
        : null,
    });
  } catch (err) {
    res.status(400).json({ error: `Could not create cafe: ${err.message}` });
  }
});

/** Update cafe status (active / suspended) */
app.put('/api/superadmin/cafes/:id/status', async (req, res) => {
  const status = req.body && req.body.status;
  if (!status || !['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "active" or "suspended".' });
  }
  const cafe = await store.updateCafeStatus(req.params.id, status);
  if (!cafe) return res.status(404).json({ error: 'Cafe not found.' });
  res.json({ cafe });
});

/** Reassign manager or provision new manager credentials for an existing cafe */
app.put('/api/superadmin/cafes/:id/manager', async (req, res) => {
  const body = req.body || {};
  if (!body.managerEmail || !body.managerPassword) {
    return res.status(400).json({ error: 'managerEmail and managerPassword are required.' });
  }
  try {
    const manager = await createManagerUser({
      email: body.managerEmail,
      password: body.managerPassword,
      name: body.managerName || 'Cafe Manager',
    });
    const cafe = await store.updateCafeManager(req.params.id, manager.id);
    if (!cafe) return res.status(404).json({ error: 'Cafe not found.' });
    res.json({ cafe, manager: { id: manager.id, email: manager.email, name: manager.name, role: manager.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** Delete a cafe and its menu items */
app.delete('/api/superadmin/cafes/:id', async (req, res) => {
  const cafe = await store.deleteCafe(req.params.id);
  if (!cafe) return res.status(404).json({ error: 'Cafe not found.' });
  res.json({ deleted: cafe });
});

/* ------------------------------------------------------------------ *
 * Admin: session & auth
 * ------------------------------------------------------------------ */

app.post('/api/admin/login', (req, res) => {
  if (!checkPassword(req.body && req.body.password)) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  const cafeSlug = req.body && req.body.cafeSlug ? String(req.body.cafeSlug) : 'abol-cafe';
  return res.json({ token: createToken({ cafeSlug }) });
});

/* Everything below requires a valid session token (Better Auth or Legacy). */
app.use('/api/admin', requireAuth);

/** Helper to identify tenant for admin requests */
function resolveTenant(req) {
  return req.query.cafe || req.headers['x-cafe-slug'] || req.cafeSlug || 'abol-cafe';
}

/** Lets the dashboard check whether a stored token is still valid. */
app.get('/api/admin/session', (req, res) => {
  res.json({ ok: true, user: req.user || null });
});

/** List cafes owned by user or all cafes for legacy admin */
app.get('/api/admin/cafes', async (req, res) => {
  const ownerId = req.user && req.user.id !== 'legacy-admin' ? req.user.id : null;
  const cafes = await store.listCafes(ownerId);
  res.json({ cafes });
});

/** Create a new cafe tenant */
app.post('/api/admin/cafes', async (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.slug) {
    return res.status(400).json({ error: 'Cafe name and slug are required.' });
  }
  const ownerId = req.user && req.user.id !== 'legacy-admin' ? req.user.id : null;
  try {
    const created = await store.createCafe({
      slug: body.slug,
      name: body.name,
      tagline: body.tagline || '',
      currency: body.currency || 'ETB',
      ownerId,
      phone: body.phone || '',
      wifi_ssid: body.wifi_ssid || '',
      wifi_pass: body.wifi_pass || '',
      template: body.template || 'empty',
    });
    res.status(201).json({ cafe: created.cafe });
  } catch (err) {
    res.status(400).json({ error: `Could not create cafe: ${err.message}` });
  }
});

/* ------------------------------------------------------------------ *
 * Admin: cafe profile
 * ------------------------------------------------------------------ */

app.get('/api/admin/cafe', (req, res) => {
  const tenant = resolveTenant(req);
  res.json({ cafe: store.get(tenant).cafe });
});

app.put('/api/admin/cafe', (req, res) => {
  const body = req.body || {};
  const tenant = resolveTenant(req);
  const cafe = store.update(tenant, (data) => {
    for (const key of ['name', 'tagline', 'currency', 'footer', 'logo', 'phone', 'wifi_ssid', 'wifi_pass']) {
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
  const tenant = resolveTenant(req);
  if (!body.name || !String(body.name).trim()) {
    return res.status(400).json({ error: 'A category name is required.' });
  }
  const category = store.update(tenant, (data) => {
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
  const tenant = resolveTenant(req);
  const category = store.update(tenant, (data) => {
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
  const tenant = resolveTenant(req);
  const removed = store.update(tenant, (data) => {
    const index = data.categories.findIndex((entry) => entry.id === req.params.id);
    if (index === -1) return null;
    return data.categories.splice(index, 1)[0];
  });
  if (!removed) return res.status(404).json({ error: 'Category not found.' });
  return res.json({ removed });
});

/** Reorder categories */
app.post('/api/admin/categories/reorder', (req, res) => {
  const order = Array.isArray(req.body && req.body.order) ? req.body.order : null;
  const tenant = resolveTenant(req);
  if (!order) return res.status(400).json({ error: 'Send { order: [categoryId, ...] }.' });
  const categories = store.update(tenant, (data) => {
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
  const tenant = resolveTenant(req);
  if (!body.name || !String(body.name).trim()) {
    return res.status(400).json({ error: 'An item name is required.' });
  }
  const item = store.update(tenant, (data) => {
    const category = store.findCategory(data, req.params.id);
    if (!category) return null;
    const taken = new Set(data.categories.flatMap((entry) => entry.items.map((it) => it.id)));
    const created = {
      id: store.newId(body.name, taken),
      name: String(body.name).trim(),
      description: String(body.description || ''),
      price: Number(body.price) || 0,
      badge: body.badge ? String(body.badge).trim() : '',
      prepTime: body.prepTime ? String(body.prepTime).trim() : '',
      dietary: body.dietary ? String(body.dietary).trim() : '',
      available: body.available !== undefined ? Boolean(body.available) : true,
    };
    category.items.push(created);
    return created;
  });
  if (!item) return res.status(404).json({ error: 'Category not found.' });
  return res.status(201).json({ item });
});

app.put('/api/admin/items/:id', (req, res) => {
  const body = req.body || {};
  const tenant = resolveTenant(req);
  const item = store.update(tenant, (data) => {
    const found = store.findItem(data, req.params.id);
    if (!found) return null;
    if (typeof body.name === 'string' && body.name.trim()) found.item.name = body.name.trim();
    if (typeof body.description === 'string') found.item.description = body.description;
    if (body.price !== undefined) found.item.price = Number(body.price) || 0;
    if (typeof body.badge === 'string') found.item.badge = body.badge.trim();
    if (typeof body.prepTime === 'string') found.item.prepTime = body.prepTime.trim();
    if (typeof body.dietary === 'string') found.item.dietary = body.dietary.trim();
    if (body.available !== undefined) found.item.available = Boolean(body.available);
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
  const tenant = resolveTenant(req);
  const removed = store.update(tenant, (data) => {
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
  const tenant = resolveTenant(req);
  res.json({ menu: store.reset(tenant) });
});

/* ------------------------------------------------------------------ */

app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown API route.' }));

/** Unknown cafe / page routes return 404 without serving landing page as if cafe exists */
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cafe Not Found &mdash; CafeMenu</title>
        <link rel="stylesheet" href="/css/style.css" />
        <style>
          body { display: grid; place-items: center; min-height: 100vh; text-align: center; background: #0e0a07; color: #fff8f0; font-family: sans-serif; }
          .error-box { max-width: 460px; margin: 2rem; padding: 2.5rem; background: #17110c; border: 1px solid rgba(230,146,60,0.3); border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
          h1 { color: #fbbf24; margin-top: 0; font-size: 1.8rem; }
          p { color: #a8988a; line-height: 1.6; font-size: 0.95rem; }
          .btn { display: inline-block; margin-top: 1rem; padding: 0.65rem 1.4rem; background: #e6923c; color: #1a0e05; border-radius: 999px; font-weight: 700; text-decoration: none; }
          .btn:hover { background: #f59e0b; }
        </style>
      </head>
      <body>
        <div class="error-box">
          <div style="margin-bottom: 1rem; color: #fbbf24;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin: 0 auto; display: block;">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="2" x2="6" y2="4"/>
              <line x1="10" y1="2" x2="10" y2="4"/>
              <line x1="14" y1="2" x2="14" y2="4"/>
            </svg>
          </div>
          <h1>Cafe Not Found</h1>
          <p>The cafe digital menu you requested does not exist or has not been configured yet.</p>
          <a class="btn" href="/">Return to CafeMenu</a>
        </div>
      </body>
      </html>
    `);
  }
  return res.status(404).send('Not found');
});

app.use((error, req, res, next) => {
  console.error('[server]', error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ error: 'Something went wrong on the server.' });
});

store.load('abol-cafe');
bootstrapSuperAdmin();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n     CafeMenu Multi-Tenant Digital Platform`);
    console.log(`     Landing      http://localhost:${PORT}/`);
    console.log(`     Abol Cafe    http://localhost:${PORT}/abol-cafe`);
    console.log(`     Admin        http://localhost:${PORT}/admin`);
    console.log(`     Super Admin  http://localhost:${PORT}/api/superadmin/cafes`);
    console.log(`     Better Auth  http://localhost:${PORT}/api/auth/ok\n`);
  });
}

module.exports = app;
