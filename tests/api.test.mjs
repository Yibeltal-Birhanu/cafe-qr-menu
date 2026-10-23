import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = 4599;
const BASE = `http://127.0.0.1:${PORT}`;
const PASSWORD = 'test-password';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let server;
let token;

async function call(pathname, options = {}, bearer) {
  const response = await fetch(BASE + pathname, {
    method: options.method || 'GET',
    headers: Object.assign(
      { 'Content-Type': 'application/json', Origin: BASE },
      bearer ? { Authorization: `Bearer ${bearer}` } : {}
    ),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : {} };
}

before(async () => {
  // A throwaway server with its own menu file, so the real data/ is never touched.
  const dir = mkdtempSync(path.join(tmpdir(), 'cafe-menu-test-'));
  server = spawn(process.execPath, ['server/index.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      MENU_FILE: path.join(dir, 'menu.json'),
      ADMIN_PASSWORD: PASSWORD,
      SESSION_SECRET: 'test-secret',
    },
    stdio: 'ignore',
  });

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/api/health`);
      if (response.ok) {
        token = (await call('/api/admin/login', { method: 'POST', body: { password: PASSWORD } })).body.token;
        return;
      }
    } catch {
      /* server still booting */
    }
    await sleep(150);
  }
  throw new Error('The test server did not start in time.');
});

after(() => {
  if (server) server.kill();
});

test('serves the seed menu and the static pages', async () => {
  const menu = await call('/api/menu');
  assert.equal(menu.status, 200);
  assert.equal(menu.body.cafe.name, 'Abol Cafe & Roasters');
  assert.equal(menu.body.categories.length, 7);
  assert.ok(menu.body.categories.every((category) => category.items.length > 0));

  for (const page of ['/', '/abol-cafe', '/admin', '/css/style.css', '/js/admin.js', '/css/landing.css', '/js/landing.js']) {
    const response = await fetch(BASE + page);
    assert.equal(response.status, 200, `${page} should be served`);
  }
});

test('serves the CafeMenu central landing page at /', async () => {
  const response = await fetch(`${BASE}/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('CafeMenu'), 'Page should include CafeMenu wordmark');
  assert.ok(html.includes('Turn Every Table into an'), 'Page should include hero title');
  assert.ok(html.includes('Experience the Digital Cafe Menu') || html.includes('Digital Cafe Menu'), 'Page should include live demo section');
});

test('serves the customer menu at /abol-cafe', async () => {
  const response = await fetch(`${BASE}/abol-cafe`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('id="cafeName"'), 'Page should render cafe header');
  assert.ok(html.includes('menu-view-badge'), 'Page should render digital menu view badge');
});

test('redirects legacy /index and /index.html to /abol-cafe', async () => {
  for (const path of ['/index', '/index.html']) {
    const response = await fetch(`${BASE}${path}`, { redirect: 'manual' });
    assert.equal(response.status, 301, `${path} should return 301 redirect`);
    assert.equal(response.headers.get('location'), '/abol-cafe');
  }
});

test('returns HTTP 404 and branded page for unknown cafe routes', async () => {
  const response = await fetch(`${BASE}/cafe9`, {
    headers: { Accept: 'text/html' },
  });
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.ok(html.includes('Cafe Not Found'), 'Page should state Cafe Not Found');
  assert.ok(html.includes('Return to CafeMenu'), 'Page should link back to landing page');
});

test('builds a default QR code pointing to /abol-cafe when no url query is passed', async () => {
  const response = await fetch(`${BASE}/qr.png`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/png/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.ok(bytes.length > 500);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
});

test('keeps the menu data file private', async () => {
  const response = await fetch(`${BASE}/data/menu.json`);
  assert.equal(response.status, 404);
});

test('builds a QR code PNG', async () => {
  const response = await fetch(`${BASE}/qr.png?url=${encodeURIComponent(`${BASE}/`)}`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/png/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.ok(bytes.length > 500);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
});

test('rejects unauthenticated and forged admin requests', async () => {
  const anonymous = await call('/api/admin/categories', { method: 'POST', body: { name: 'Nope' } });
  assert.equal(anonymous.status, 401);

  const forged = await call('/api/admin/session', {}, 'not.a.real.token');
  assert.equal(forged.status, 401);
});

test('requires the correct admin password', async () => {
  const bad = await call('/api/admin/login', { method: 'POST', body: { password: 'wrong' } });
  assert.equal(bad.status, 401);
  assert.match(bad.body.error, /incorrect/i);

  const login = await call('/api/admin/login', { method: 'POST', body: { password: PASSWORD } });
  assert.equal(login.status, 200);
  assert.ok(login.body.token.includes('.'));

  const session = await call('/api/admin/session', {}, login.body.token);
  assert.equal(session.status, 200);
});

test('updates the cafe profile and ignores empty values', async () => {
  const updated = await call('/api/admin/cafe', { method: 'PUT', body: { name: 'Test Cafe', currency: '' } }, token);
  assert.equal(updated.body.cafe.name, 'Test Cafe');
  assert.equal(updated.body.cafe.currency, 'ETB', 'empty currency should be ignored');
});

test('creates, renames and deletes a category', async () => {
  const created = await call('/api/admin/categories', { method: 'POST', body: { name: 'Test Wraps', icon: 'sandwich' } }, token);
  assert.equal(created.status, 201);
  const id = created.body.category.id;
  assert.equal(created.body.category.items.length, 0);

  const blank = await call('/api/admin/categories', { method: 'POST', body: { name: '  ' } }, token);
  assert.equal(blank.status, 400);

  const renamed = await call(`/api/admin/categories/${id}`, { method: 'PUT', body: { name: 'Wraps & Rolls' } }, token);
  assert.equal(renamed.body.category.name, 'Wraps & Rolls');

  const missing = await call('/api/admin/categories/nope', { method: 'PUT', body: { name: 'x' } }, token);
  assert.equal(missing.status, 404);

  const deleted = await call(`/api/admin/categories/${id}`, { method: 'DELETE' }, token);
  assert.equal(deleted.status, 200);
  assert.ok(!(await call('/api/menu')).body.categories.some((category) => category.id === id));
});

test('adds, edits, moves and deletes a dish', async () => {
  const created = await call('/api/admin/categories', { method: 'POST', body: { name: 'Move Me' } }, token);
  const categoryId = created.body.category.id;

  const dish = await call(`/api/admin/categories/${categoryId}/items`, {
    method: 'POST',
    body: { name: 'Chicken Wrap', description: 'grilled', price: '185', badge: 'New' },
  }, token);
  assert.equal(dish.status, 201);
  assert.equal(dish.body.item.price, 185, 'price should be stored as a number');
  const itemId = dish.body.item.id;

  const edited = await call(`/api/admin/items/${itemId}`, { method: 'PUT', body: { price: 210, badge: '' } }, token);
  assert.equal(edited.body.item.price, 210);
  assert.equal(edited.body.item.badge, '');

  const moved = await call(`/api/admin/items/${itemId}`, { method: 'PUT', body: { categoryId: 'burgers' } }, token);
  assert.equal(moved.status, 200);

  const menu = (await call('/api/menu')).body;
  assert.ok(menu.categories.find((c) => c.id === 'burgers').items.some((item) => item.id === itemId));
  assert.ok(!menu.categories.find((c) => c.id === categoryId).items.some((item) => item.id === itemId));

  const removed = await call(`/api/admin/items/${itemId}`, { method: 'DELETE' }, token);
  assert.equal(removed.status, 200);
  assert.equal((await call(`/api/admin/items/${itemId}`, { method: 'DELETE' }, token)).status, 404);
  await call(`/api/admin/categories/${categoryId}`, { method: 'DELETE' }, token);
});

test('reorders categories', async () => {
  const ids = (await call('/api/menu')).body.categories.map((category) => category.id);
  const reversed = [...ids].reverse();
  const reordered = await call('/api/admin/categories/reorder', { method: 'POST', body: { order: reversed } }, token);
  assert.deepEqual(reordered.body.categories.map((category) => category.id), reversed);

  const malformed = await call('/api/admin/categories/reorder', { method: 'POST', body: {} }, token);
  assert.equal(malformed.status, 400);
});

test('persists changes to disk and can reset to the sample menu', async () => {
  await call('/api/admin/cafe', { method: 'PUT', body: { name: 'Persisted Cafe' } }, token);
  assert.equal((await call('/api/menu')).body.cafe.name, 'Persisted Cafe');

  const reset = await call('/api/admin/reset', { method: 'POST' }, token);
  assert.equal(reset.body.menu.cafe.name, 'Abol Cafe & Roasters');
  assert.equal(reset.body.menu.categories.length, 7);

  const afterReset = await call('/api/menu');
  assert.equal(afterReset.body.cafe.name, 'Abol Cafe & Roasters');
  assert.deepEqual(afterReset.body.categories.map((category) => category.id), [
    'habesha', 'burgers', 'pizza', 'coffee', 'breakfast', 'desserts', 'drinks',
  ]);
});

test('Better Auth API responds on /api/auth/ok', async () => {
  const res = await call('/api/auth/ok');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test('multi-tenant: fetches scoped menu and generated QR code for specific cafe', async () => {
  const uniqueSlug = `test-roasters-${Date.now()}`;
  const createRes = await call(
    '/api/admin/cafes',
    {
      method: 'POST',
      body: { slug: uniqueSlug, name: 'Test Roasters', currency: 'USD' },
    },
    token
  );
  assert.equal(createRes.status, 201);
  const cafeSlug = createRes.body.cafe.slug;
  assert.equal(createRes.body.cafe.name, 'Test Roasters');

  // Verify public multi-tenant menu route
  const menuRes = await call(`/api/${cafeSlug}/menu`);
  assert.equal(menuRes.status, 200);
  assert.equal(menuRes.body.cafe.name, 'Test Roasters');
  assert.equal(menuRes.body.cafe.currency, 'USD');

  // Verify multi-tenant QR code route
  const qrRes = await fetch(`${BASE}/api/${cafeSlug}/qr.png`);
  assert.equal(qrRes.status, 200);
  assert.equal(qrRes.headers.get('content-type'), 'image/png');

  // Verify cafe shows in admin list
  const listRes = await call('/api/admin/cafes', {}, token);
  assert.equal(listRes.status, 200);
  assert.ok(Array.isArray(listRes.body.cafes));
  assert.ok(listRes.body.cafes.some((c) => c.slug === cafeSlug));

  // Clean up temporary test cafe
  if (createRes.body?.cafe?.id) {
    await call(`/api/superadmin/cafes/${createRes.body.cafe.id}`, { method: 'DELETE' }, token);
  }
});

test('multi-tenant theming: updates cafe visual theme and reflects in public menu', async () => {
  const customTheme = {
    preset: 'emerald',
    primaryColor: '#10b981',
    accentColor: '#fbbf24',
    backgroundColor: '#061a14',
    fontFamily: 'Playfair Display',
  };

  const updateRes = await call(
    '/api/admin/cafe',
    {
      method: 'PUT',
      body: {
        theme: customTheme,
      },
    },
    token
  );
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.cafe.theme.preset, 'emerald');
  assert.equal(updateRes.body.cafe.theme.primaryColor, '#10b981');
  assert.equal(updateRes.body.cafe.theme.fontFamily, 'Playfair Display');

  // Verify public menu reflects the updated theme
  const publicMenu = await call('/api/menu');
  assert.equal(publicMenu.status, 200);
  assert.equal(publicMenu.body.cafe.theme.preset, 'emerald');
  assert.equal(publicMenu.body.cafe.theme.primaryColor, '#10b981');

  // Reset cafe back to sample menu
  await call('/api/admin/reset', { method: 'POST' }, token);
});


test('Super Admin: creates a cafe and provisions its manager user', async () => {
  const timestamp = Date.now();
  const slug = `skyline-cafe-${timestamp}`;
  const managerEmail = `manager-${timestamp}@skyline.com`;
  const managerPassword = 'managerPassword123!';

  // 1. Super Admin creates cafe with manager credentials
  const res = await call(
    '/api/superadmin/cafes',
    {
      method: 'POST',
      body: {
        slug,
        name: 'Skyline Cafe & Bakery',
        currency: 'EUR',
        managerEmail,
        managerPassword,
        managerName: 'Skyline Boss',
      },
    },
    token
  );

  assert.equal(res.status, 201);
  assert.equal(res.body.cafe.name, 'Skyline Cafe & Bakery');
  assert.equal(res.body.manager.email, managerEmail);
  assert.equal(res.body.manager.role, 'manager');

  // 2. Super Admin lists all platform cafes and sees manager info
  const list = await call('/api/superadmin/cafes', {}, token);
  assert.equal(list.status, 200);
  const found = list.body.cafes.find((c) => c.slug === res.body.cafe.slug);
  assert.ok(found);
  assert.equal(found.managerEmail, managerEmail);

  // 3. The new manager logs in via Better Auth email and password
  const loginRes = await call('/api/auth/sign-in/email', {
    method: 'POST',
    body: {
      email: managerEmail,
      password: managerPassword,
    },
  });

  assert.equal(loginRes.status, 200);
  assert.ok(loginRes.body.token);
  assert.equal(loginRes.body.user.email, managerEmail);

  // 4. Non-superadmin cannot access Super Admin endpoints
  const forbiddenRes = await call('/api/superadmin/cafes', {}, loginRes.body.token);
  assert.equal(forbiddenRes.status, 403);

  // 5. Super Admin updates venue settings directly from the management modal
  const updateRes = await call(`/api/superadmin/cafes/${res.body.cafe.id}`, {
    method: 'PUT',
    body: {
      name: `Updated Lounge ${timestamp}`,
      tagline: 'Refreshed Tagline',
      currency: 'USD',
      phone: '+251911998877',
      wifi_ssid: 'LoungeGuest',
      wifi_pass: 'LoungeSecret1',
      status: 'active',
    },
  }, token);
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.cafe.name, `Updated Lounge ${timestamp}`);
  assert.equal(updateRes.body.cafe.tagline, 'Refreshed Tagline');
  assert.equal(updateRes.body.cafe.currency, 'USD');
  assert.equal(updateRes.body.cafe.wifi_ssid, 'LoungeGuest');

  // 6. Clean up temporary test cafe
  if (res.body?.cafe?.id) {
    const delRes = await call(`/api/superadmin/cafes/${res.body.cafe.id}`, { method: 'DELETE' }, token);
    assert.equal(delRes.status, 200);
  }
});

test('Manager: performs CRUD on categories and dishes, and generates dynamic table QR codes', async () => {
  const ts = Date.now();
  const cafeSlug = `sunset-cafe-${ts}`;
  const managerEmail = `sunset-manager-${ts}@sunset.com`;
  const managerPassword = 'managerPassword123!';

  // 1. Super Admin creates the cafe and provisions its manager
  const createRes = await call(
    '/api/superadmin/cafes',
    {
      method: 'POST',
      body: {
        slug: cafeSlug,
        name: 'Sunset Bistro',
        currency: 'USD',
        managerEmail,
        managerPassword,
        managerName: 'Sunset Manager',
        template: 'empty',
      },
    },
    token
  );
  assert.equal(createRes.status, 201);
  const realSlug = createRes.body.cafe.slug;

  // 2. Manager signs in with email and password
  const loginRes = await call('/api/auth/sign-in/email', {
    method: 'POST',
    body: { email: managerEmail, password: managerPassword },
  });
  assert.equal(loginRes.status, 200);
  const managerToken = loginRes.body.token;

  // 3. Manager creates a category
  const catRes = await call(
    '/api/admin/categories',
    {
      method: 'POST',
      body: { name: 'Craft Cocktails', icon: 'cocktail', description: 'Handcrafted drinks' },
    },
    managerToken
  );
  assert.equal(catRes.status, 201);
  const categoryId = catRes.body.category.id;
  assert.equal(catRes.body.category.name, 'Craft Cocktails');

  // 4. Manager creates a food/drink dish under that category
  const dishRes = await call(
    `/api/admin/categories/${categoryId}/items`,
    {
      method: 'POST',
      body: {
        name: 'Smoked Old Fashioned',
        price: 18,
        description: 'Bourbon, bitters, orange peel, smoked oak',
        badge: 'Signature',
        available: true,
      },
    },
    managerToken
  );
  assert.equal(dishRes.status, 201);
  const dishId = dishRes.body.item.id;
  assert.equal(dishRes.body.item.name, 'Smoked Old Fashioned');

  // 5. Manager updates the dish (price & badge)
  const updateDishRes = await call(
    `/api/admin/items/${dishId}`,
    {
      method: 'PUT',
      body: { price: 20, badge: 'Popular' },
    },
    managerToken
  );
  assert.equal(updateDishRes.status, 200);
  assert.equal(updateDishRes.body.item.price, 20);
  assert.equal(updateDishRes.body.item.badge, 'Popular');

  // 6. Manager generates dynamic table QR code for table 15
  const qrRes = await fetch(`${BASE}/api/admin/qr?table=15`, {
    headers: { Authorization: `Bearer ${managerToken}` },
  });
  assert.equal(qrRes.status, 200);
  assert.equal(qrRes.headers.get('content-type'), 'image/png');

  // 7. Verify public customer menu reflects manager's changes
  const publicMenu = await call(`/api/${realSlug}/menu`);
  assert.equal(publicMenu.status, 200);
  const foundCat = publicMenu.body.categories.find((c) => c.id === categoryId);
  assert.ok(foundCat);
  const foundDish = foundCat.items.find((d) => d.id === dishId);
  assert.ok(foundDish);
  assert.equal(foundDish.price, 20);

  // 8. Cross-tenant isolation check: Manager cannot tamper with another cafe
  const tamperRes = await call(
    '/api/admin/categories?cafe=abol-cafe',
    {
      method: 'POST',
      body: { name: 'Hacked Category' },
    },
    managerToken
  );
  assert.equal(tamperRes.status, 403);
  assert.match(tamperRes.body.error, /permission/i);

  // 9. Manager deletes dish and category
  const delDish = await call(`/api/admin/items/${dishId}`, { method: 'DELETE' }, managerToken);
  assert.equal(delDish.status, 200);

  const delCat = await call(`/api/admin/categories/${categoryId}`, { method: 'DELETE' }, managerToken);
  assert.equal(delCat.status, 200);

  // 10. Clean up temporary test cafe
  if (createRes.body?.cafe?.id) {
    const cleanupRes = await call(`/api/superadmin/cafes/${createRes.body.cafe.id}`, { method: 'DELETE' }, token);
    assert.equal(cleanupRes.status, 200);
  }
});

test('rejects unknown API routes with JSON', async () => {
  const response = await call('/api/does-not-exist');
  assert.equal(response.status, 404);
  assert.match(response.body.error, /unknown/i);
});
