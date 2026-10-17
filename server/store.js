'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const seed = require('./seed');
const pool = require('./db/pool');

// MENU_FILE lets tests (and hosts with a mounted volume) point the store elsewhere.
const MENU_FILE = process.env.MENU_FILE
  ? path.resolve(process.env.MENU_FILE)
  : path.join(__dirname, '..', 'data', 'menu.json');
const DATA_DIR = path.dirname(MENU_FILE);

/** Cache of loaded menus in memory, keyed by cafeSlug (default: 'abol-cafe') */
const menus = new Map();

function slugify(value) {
  const base = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'item';
}

function newId(value, taken) {
  const base = slugify(value);
  let id = base;
  while (taken.has(id)) {
    id = `${base}-${crypto.randomBytes(2).toString('hex')}`;
  }
  return id;
}

function ensureShape(raw, fallbackSeed = seed) {
  const data = raw && typeof raw === 'object' ? raw : {};
  const cafe = data.cafe && typeof data.cafe === 'object' ? data.cafe : {};
  const defaultCafe = fallbackSeed.cafe || seed.cafe;
  return {
    cafe: {
      id: cafe.id || 'default-abol-cafe',
      slug: cafe.slug || 'abol-cafe',
      name: String(cafe.name || defaultCafe.name),
      tagline: String(cafe.tagline || defaultCafe.tagline),
      currency: String(cafe.currency || defaultCafe.currency),
      footer: String(cafe.footer || defaultCafe.footer),
      logo: String(cafe.logo || defaultCafe.logo),
      phone: typeof cafe.phone === 'string' ? cafe.phone : (defaultCafe.phone || ''),
      wifi_ssid: typeof cafe.wifi_ssid === 'string' ? cafe.wifi_ssid : (defaultCafe.wifi_ssid || ''),
      wifi_pass: typeof cafe.wifi_pass === 'string' ? cafe.wifi_pass : (defaultCafe.wifi_pass || ''),
      status: cafe.status || 'active',
    },
    categories: (Array.isArray(data.categories) ? data.categories : []).map((category) => ({
      id: String(category.id || slugify(category.name)),
      name: String(category.name || 'Untitled category'),
      icon: String(category.icon || 'coffee'),
      description: String(category.description || ''),
      items: (Array.isArray(category.items) ? category.items : []).map((item) => ({
        id: String(item.id || slugify(item.name)),
        name: String(item.name || 'Untitled item'),
        description: String(item.description || ''),
        price: Number(item.price) || 0,
        badge: item.badge ? String(item.badge) : '',
        prepTime: item.prepTime ? String(item.prepTime) : '',
        dietary: item.dietary ? String(item.dietary) : '',
        available: item.available !== undefined ? Boolean(item.available) : true,
      })),
    })),
  };
}

function writeToDisk(slug, menuData) {
  if (slug === 'abol-cafe') {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = `${MENU_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(menuData, null, 2)}\n`, 'utf8');
    fs.renameSync(tmp, MENU_FILE);
  }
}

/** Asynchronously sync in-memory changes to MySQL database */
async function syncToMySQL(slug, menuData) {
  try {
    const cafe = menuData.cafe;
    const [existing] = await pool.query('SELECT id FROM cafes WHERE slug = ?', [slug]);
    let cafeId = cafe.id;
    if (existing.length === 0) {
      cafeId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO cafes (id, slug, name, tagline, currency, footer, logo, phone, wifi_ssid, wifi_pass, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cafeId, slug, cafe.name, cafe.tagline, cafe.currency, cafe.footer, cafe.logo, cafe.phone, cafe.wifi_ssid, cafe.wifi_pass, cafe.status || 'active']
      );
    } else {
      cafeId = existing[0].id;
      await pool.query(
        `UPDATE cafes SET name = ?, tagline = ?, currency = ?, footer = ?, logo = ?, phone = ?, wifi_ssid = ?, wifi_pass = ?, status = ? WHERE id = ?`,
        [cafe.name, cafe.tagline, cafe.currency, cafe.footer, cafe.logo, cafe.phone, cafe.wifi_ssid, cafe.wifi_pass, cafe.status || 'active', cafeId]
      );
    }

    // Upsert categories
    for (let cIdx = 0; cIdx < menuData.categories.length; cIdx++) {
      const cat = menuData.categories[cIdx];
      await pool.query(
        `INSERT INTO categories (id, cafeId, name, icon, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon), description = VALUES(description), sortOrder = VALUES(sortOrder)`,
        [cat.id, cafeId, cat.name, cat.icon || 'coffee', cat.description || '', cIdx]
      );

      // Upsert items
      if (Array.isArray(cat.items)) {
        for (let iIdx = 0; iIdx < cat.items.length; iIdx++) {
          const item = cat.items[iIdx];
          await pool.query(
            `INSERT INTO items (id, categoryId, cafeId, name, description, price, badge, prepTime, dietary, available, sortOrder)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE categoryId = VALUES(categoryId), name = VALUES(name), description = VALUES(description),
             price = VALUES(price), badge = VALUES(badge), prepTime = VALUES(prepTime), dietary = VALUES(dietary),
             available = VALUES(available), sortOrder = VALUES(sortOrder)`,
            [item.id, cat.id, cafeId, item.name, item.description || '', Number(item.price) || 0, item.badge || '', item.prepTime || '', item.dietary || '', Boolean(item.available), iIdx]
          );
        }
      }
    }
  } catch (err) {
    console.warn(`[store] MySQL sync warning for ${slug}:`, err.message);
  }
}

async function loadAllFromMySQL() {
  try {
    const [cafes] = await pool.query('SELECT * FROM cafes');
    for (const cafe of cafes) {
      if (cafe.slug === 'abol-cafe' && process.env.MENU_FILE) continue;
      const [categories] = await pool.query('SELECT * FROM categories WHERE cafeId = ? ORDER BY sortOrder ASC', [cafe.id]);
      const [items] = await pool.query('SELECT * FROM items WHERE cafeId = ? ORDER BY sortOrder ASC', [cafe.id]);
      const catMap = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        items: items
          .filter((it) => it.categoryId === cat.id)
          .map((it) => ({
            id: it.id,
            name: it.name,
            description: it.description,
            price: Number(it.price) || 0,
            badge: it.badge || '',
            prepTime: it.prepTime || '',
            dietary: it.dietary || '',
            available: Boolean(it.available),
          })),
      }));
      menus.set(
        cafe.slug,
        ensureShape({
          cafe: {
            id: cafe.id,
            slug: cafe.slug,
            name: cafe.name,
            tagline: cafe.tagline,
            currency: cafe.currency,
            footer: cafe.footer,
            logo: cafe.logo,
            phone: cafe.phone,
            wifi_ssid: cafe.wifi_ssid,
            wifi_pass: cafe.wifi_pass,
            status: cafe.status,
          },
          categories: catMap,
        })
      );
    }
  } catch (err) {
    console.warn('[store] Could not preload cafes from DB:', err.message);
  }
}

function load(slug = 'abol-cafe') {
  loadAllFromMySQL().catch(() => {});
  if (slug === 'abol-cafe') {
    try {
      const raw = fs.readFileSync(MENU_FILE, 'utf8');
      const loaded = ensureShape(JSON.parse(raw));
      menus.set(slug, loaded);
      return loaded;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`[store] Could not read ${MENU_FILE} (${error.message}); using default menu.`);
      }
      const loaded = ensureShape(seed);
      menus.set(slug, loaded);
      writeToDisk(slug, loaded);
      return loaded;
    }
  }

  // Non-default cafe fallback
  const fallback = ensureShape({
    cafe: { name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
    categories: [],
  });
  menus.set(slug, fallback);
  return fallback;
}

function get(cafeSlug = 'abol-cafe') {
  const slug = typeof cafeSlug === 'string' ? cafeSlug : 'abol-cafe';
  if (!menus.has(slug)) {
    load(slug);
  }
  return menus.get(slug);
}

function save(cafeSlugOrNext, maybeNext) {
  let slug = 'abol-cafe';
  let next = cafeSlugOrNext;
  if (typeof cafeSlugOrNext === 'string') {
    slug = cafeSlugOrNext;
    next = maybeNext;
  }
  const shaped = ensureShape(next);
  menus.set(slug, shaped);
  writeToDisk(slug, shaped);
  syncToMySQL(slug, shaped);
  return shaped;
}

function update(cafeSlugOrMutator, maybeMutator) {
  let slug = 'abol-cafe';
  let mutator = cafeSlugOrMutator;
  if (typeof cafeSlugOrMutator === 'string') {
    slug = cafeSlugOrMutator;
    mutator = maybeMutator;
  }
  const draft = JSON.parse(JSON.stringify(get(slug)));
  const result = mutator(draft);
  save(slug, draft);
  return result;
}

/**
 * Creates a new cafe, assigns its manager (ownerId), and optionally seeds it with sample categories.
 */
async function createCafe({
  slug,
  name,
  tagline = '',
  currency = 'ETB',
  ownerId = null,
  phone = '',
  wifi_ssid = '',
  wifi_pass = '',
  status = 'active',
  template = 'seed',
}) {
  const cafeId = crypto.randomUUID();
  let safeSlug = slugify(slug);
  const [existing] = await pool.query('SELECT id FROM cafes WHERE slug = ?', [safeSlug]);
  if (existing.length > 0) {
    safeSlug = `${safeSlug}-${crypto.randomBytes(2).toString('hex')}`;
  }

  await pool.query(
    `INSERT INTO cafes (id, slug, name, tagline, currency, footer, logo, phone, wifi_ssid, wifi_pass, status, owner_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cafeId, safeSlug, name, tagline, currency, 'Scan, browse, enjoy.', 'coffee', phone, wifi_ssid, wifi_pass, status, ownerId]
  );

  const initialCategories = template === 'seed' ? seed.categories : [];
  const newMenu = ensureShape({
    cafe: { id: cafeId, slug: safeSlug, name, tagline, currency, phone, wifi_ssid, wifi_pass, status },
    categories: initialCategories,
  });

  menus.set(safeSlug, newMenu);
  await syncToMySQL(safeSlug, newMenu);
  return newMenu;
}

async function listCafes(ownerId) {
  if (ownerId) {
    const [rows] = await pool.query('SELECT * FROM cafes WHERE owner_id = ? ORDER BY created_at DESC', [ownerId]);
    return rows;
  }
  const [rows] = await pool.query('SELECT * FROM cafes ORDER BY created_at DESC');
  return rows;
}

/** Super Admin: List all platform cafes with manager details & menu item counts */
async function listAllCafesWithManagers() {
  const [rows] = await pool.query(`
    SELECT 
      c.id, c.slug, c.name, c.tagline, c.currency, c.status, c.created_at, c.updated_at,
      u.id AS managerId, u.name AS managerName, u.email AS managerEmail,
      (SELECT COUNT(*) FROM categories cat WHERE cat.cafeId = c.id) AS categoryCount,
      (SELECT COUNT(*) FROM items it WHERE it.cafeId = c.id) AS dishCount
    FROM cafes c
    LEFT JOIN user u ON c.owner_id = u.id
    ORDER BY c.created_at DESC
  `);
  return rows;
}

async function getCafeById(cafeId) {
  const [rows] = await pool.query('SELECT * FROM cafes WHERE id = ?', [cafeId]);
  return rows[0] || null;
}

async function getCafeBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM cafes WHERE slug = ?', [slug]);
  return rows[0] || null;
}

async function findCafeForUser(userId) {
  const [rows] = await pool.query('SELECT * FROM cafes WHERE owner_id = ? LIMIT 1', [userId]);
  return rows[0] || null;
}

async function updateCafeStatus(cafeId, status) {
  await pool.query('UPDATE cafes SET status = ? WHERE id = ?', [status, cafeId]);
  const cafe = await getCafeById(cafeId);
  if (cafe && menus.has(cafe.slug)) {
    menus.get(cafe.slug).cafe.status = status;
  }
  return cafe;
}

async function updateCafeManager(cafeId, newOwnerId) {
  await pool.query('UPDATE cafes SET owner_id = ? WHERE id = ?', [newOwnerId, cafeId]);
  return getCafeById(cafeId);
}

async function deleteCafe(cafeId) {
  const cafe = await getCafeById(cafeId);
  if (!cafe) return null;
  await pool.query('DELETE FROM cafes WHERE id = ?', [cafeId]);
  menus.delete(cafe.slug);
  return cafe;
}

function findCategory(data, categoryId) {
  return data.categories.find((category) => category.id === categoryId);
}

function findItem(data, itemId) {
  for (const category of data.categories) {
    const item = category.items.find((entry) => entry.id === itemId);
    if (item) return { category, item };
  }
  return null;
}

function reset(cafeSlug = 'abol-cafe') {
  const slug = typeof cafeSlug === 'string' ? cafeSlug : 'abol-cafe';
  return save(slug, seed);
}

module.exports = {
  load,
  get,
  save,
  update,
  reset,
  findCategory,
  findItem,
  newId,
  slugify,
  createCafe,
  listCafes,
  listAllCafesWithManagers,
  getCafeById,
  getCafeBySlug,
  findCafeForUser,
  updateCafeStatus,
  updateCafeManager,
  deleteCafe,
  MENU_FILE,
};
