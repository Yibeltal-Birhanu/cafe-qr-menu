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
      { 'Content-Type': 'application/json' },
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
  assert.equal(menu.body.cafe.name, 'Prism Cafe');
  assert.equal(menu.body.categories.length, 6);
  assert.ok(menu.body.categories.every((category) => category.items.length > 0));

  for (const page of ['/', '/admin', '/css/style.css', '/js/admin.js']) {
    const response = await fetch(BASE + page);
    assert.equal(response.status, 200, `${page} should be served`);
  }
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
  assert.equal(reset.body.menu.cafe.name, 'Prism Cafe');
  assert.equal(reset.body.menu.categories.length, 6);

  const afterReset = await call('/api/menu');
  assert.equal(afterReset.body.cafe.name, 'Prism Cafe');
  assert.deepEqual(afterReset.body.categories.map((category) => category.id), [
    'burgers', 'pizza', 'coffee', 'breakfast', 'desserts', 'drinks',
  ]);
});

test('rejects unknown API routes with JSON', async () => {
  const response = await call('/api/does-not-exist');
  assert.equal(response.status, 404);
  assert.match(response.body.error, /unknown/i);
});
