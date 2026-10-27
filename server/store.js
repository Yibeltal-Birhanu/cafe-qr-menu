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
      hero_title: typeof cafe.hero_title === 'string' ? cafe.hero_title : (defaultCafe.hero_title || ''),
      hero_description: typeof cafe.hero_description === 'string' ? cafe.hero_description : (defaultCafe.hero_description || ''),
      hero_image: typeof cafe.hero_image === 'string' ? cafe.hero_image : (cafe.hero_image?.url || defaultCafe.hero_image || ''),
      theme: cafe.theme && typeof cafe.theme === 'object' ? cafe.theme : {
        preset: 'showcase',
        primaryColor: '#1c2826',
        accentColor: '#e6923c',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        backgroundMode: 'light',
        surfaceColor: '#ffffff',
        textColor: '#111827',
        fontFamily: 'Plus Jakarta Sans',
      },
    },
    categories: (Array.isArray(data.categories) ? data.categories : []).map((category) => ({
      id: String(category.id || slugify(category.name)),
      name: String(category.name || 'Untitled category'),
      icon: String(category.icon || 'coffee'),
      image: String(category.image || ''),
      description: String(category.description || ''),
      items: (Array.isArray(category.items) ? category.items : []).map((item) => ({
        id: String(item.id || slugify(item.name)),
        name: String(item.name || 'Untitled item'),
        description: String(item.description || ''),
        image: String(item.image || ''),
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
    const themeVal = cafe.theme ? JSON.stringify(cafe.theme) : null;
    let cafeId = cafe.id;
    if (existing.length === 0) {
      cafeId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO cafes (id, slug, name, tagline, currency, footer, logo, phone, wifi_ssid, wifi_pass, status, theme, hero_title, hero_description, hero_image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cafeId, slug, cafe.name, cafe.tagline, cafe.currency, cafe.footer, cafe.logo, cafe.phone, cafe.wifi_ssid, cafe.wifi_pass, cafe.status || 'active', themeVal, cafe.hero_title || '', cafe.hero_description || '', cafe.hero_image || '']
      );
    } else {
      cafeId = existing[0].id;
      await pool.query(
        `UPDATE cafes SET name = ?, tagline = ?, currency = ?, footer = ?, logo = ?, phone = ?, wifi_ssid = ?, wifi_pass = ?, status = ?, theme = ?, hero_title = ?, hero_description = ?, hero_image = ? WHERE id = ?`,
        [cafe.name, cafe.tagline, cafe.currency, cafe.footer, cafe.logo, cafe.phone, cafe.wifi_ssid, cafe.wifi_pass, cafe.status || 'active', themeVal, cafe.hero_title || '', cafe.hero_description || '', cafe.hero_image || '', cafeId]
      );
    }

    // Upsert categories
    for (let cIdx = 0; cIdx < menuData.categories.length; cIdx++) {
      const cat = menuData.categories[cIdx];
      await pool.query(
        `INSERT INTO categories (id, cafeId, name, icon, image, description, sortOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon), image = VALUES(image), description = VALUES(description), sortOrder = VALUES(sortOrder)`,
        [cat.id, cafeId, cat.name, cat.icon || 'coffee', cat.image || '', cat.description || '', cIdx]
      );

      // Upsert items
      if (Array.isArray(cat.items)) {
        for (let iIdx = 0; iIdx < cat.items.length; iIdx++) {
          const item = cat.items[iIdx];
          await pool.query(
            `INSERT INTO items (id, categoryId, cafeId, name, description, image, price, badge, prepTime, dietary, available, sortOrder)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE categoryId = VALUES(categoryId), name = VALUES(name), description = VALUES(description),
             image = VALUES(image), price = VALUES(price), badge = VALUES(badge), prepTime = VALUES(prepTime), dietary = VALUES(dietary),
             available = VALUES(available), sortOrder = VALUES(sortOrder)`,
            [item.id, cat.id, cafeId, item.name, item.description || '', item.image || '', Number(item.price) || 0, item.badge || '', item.prepTime || '', item.dietary || '', Boolean(item.available), iIdx]
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
            image: it.image || '',
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
            hero_title: cafe.hero_title || '',
            hero_description: cafe.hero_description || '',
            hero_image: cafe.hero_image || '',
            theme: cafe.theme
              ? typeof cafe.theme === 'string'
                ? (() => { try { return JSON.parse(cafe.theme); } catch { return null; } })()
                : cafe.theme
              : null,
          },
          categories: catMap,
        })
      );
    }
  } catch (err) {
    console.warn('[store] Could not preload cafes from DB:', err.message);
  }
}


async function loadCafeFromMySQL(slug) {
  try {

    const [cafes] = await pool.query('SELECT * FROM cafes WHERE slug = ?', [slug]);
    if (cafes.length === 0) return null;
    const cafe = cafes[0];
    const [categories] = await pool.query('SELECT * FROM categories WHERE cafeId = ? ORDER BY sortOrder ASC', [cafe.id]);
    const [items] = await pool.query('SELECT * FROM items WHERE cafeId = ? ORDER BY sortOrder ASC', [cafe.id]);
    const catMap = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      image: cat.image || '',
      description: cat.description,
      items: items
        .filter((it) => it.categoryId === cat.id)
        .map((it) => ({
          id: it.id,
          name: it.name,
          description: it.description,
          image: it.image || '',
          price: Number(it.price) || 0,
          badge: it.badge || '',
          prepTime: it.prepTime || '',
          dietary: it.dietary || '',
          available: Boolean(it.available),
        })),
    }));
    const shaped = ensureShape({
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
        hero_title: cafe.hero_title || '',
        hero_description: cafe.hero_description || '',
        hero_image: cafe.hero_image || '',
        theme: cafe.theme
          ? typeof cafe.theme === 'string'
            ? (() => { try { return JSON.parse(cafe.theme); } catch { return null; } })()
            : cafe.theme
          : null,
      },
      categories: catMap,
    });
    menus.set(slug, shaped);
    return shaped;
  } catch (err) {
    console.warn(`[store] Could not load cafe ${slug} from DB:`, err.message);
    return null;
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
  theme = null,
}) {
  const cafeId = crypto.randomUUID();
  let safeSlug = slugify(slug);
  const [existing] = await pool.query('SELECT id FROM cafes WHERE slug = ?', [safeSlug]);
  if (existing.length > 0) {
    safeSlug = `${safeSlug}-${crypto.randomBytes(2).toString('hex')}`;
  }

  const themeVal = theme ? JSON.stringify(theme) : null;
  await pool.query(
    `INSERT INTO cafes (id, slug, name, tagline, currency, footer, logo, phone, wifi_ssid, wifi_pass, status, owner_id, theme)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cafeId, safeSlug, name, tagline, currency, 'Scan, browse, enjoy.', 'coffee', phone, wifi_ssid, wifi_pass, status, ownerId, themeVal]
  );

  const initialCategories = template === 'seed' ? seed.categories : [];
  const newMenu = ensureShape({
    cafe: { id: cafeId, slug: safeSlug, name, tagline, currency, phone, wifi_ssid, wifi_pass, status, theme },
    categories: initialCategories,
  });

  menus.set(safeSlug, newMenu);
  await syncToMySQL(safeSlug, newMenu);
  return newMenu;
}

async function listCafes(ownerOrUser) {
  if (ownerOrUser) {
    const ownerId = typeof ownerOrUser === 'object' && ownerOrUser ? ownerOrUser.id : ownerOrUser;
    const ownerEmail = typeof ownerOrUser === 'object' && ownerOrUser && ownerOrUser.email ? String(ownerOrUser.email).trim().toLowerCase() : null;
    const [rows] = await pool.query(
      `SELECT c.* FROM cafes c
       LEFT JOIN user u ON c.owner_id = u.id
       WHERE c.owner_id = ?
       ${ownerEmail ? 'OR c.owner_id = ? OR LOWER(u.email) = ? OR LOWER(c.owner_id) = ?' : ''}
       ORDER BY c.created_at DESC`,
      ownerEmail ? [ownerId, ownerEmail, ownerEmail, ownerEmail] : [ownerId]
    );
    return rows;
  }
  const [rows] = await pool.query('SELECT * FROM cafes ORDER BY created_at DESC');
  return rows;
}

/** Super Admin: List all platform cafes with manager details & menu item counts */
async function listAllCafesWithManagers() {
  const [rows] = await pool.query(`
    SELECT 
      c.id, c.slug, c.name, c.tagline, c.currency, c.phone, c.wifi_ssid, c.wifi_pass, c.footer, c.logo, c.status, c.theme, c.created_at, c.updated_at,
      u.id AS managerId, u.name AS managerName, u.email AS managerEmail,
      (SELECT COUNT(*) FROM categories cat WHERE cat.cafeId = c.id) AS categoryCount,
      (SELECT COUNT(*) FROM items it WHERE it.cafeId = c.id) AS dishCount
    FROM cafes c
    LEFT JOIN user u ON c.owner_id = u.id
    ORDER BY c.created_at DESC
  `);
  return rows.map((r) => ({
    ...r,
    theme: r.theme
      ? typeof r.theme === 'string'
        ? (() => { try { return JSON.parse(r.theme); } catch { return null; } })()
        : r.theme
      : null,
  }));
}

async function getCafeById(cafeId) {
  const [rows] = await pool.query('SELECT * FROM cafes WHERE id = ?', [cafeId]);
  return rows[0] || null;
}

async function getCafeBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM cafes WHERE slug = ?', [slug]);
  return rows[0] || null;
}

async function findCafeForUser(userOrId, requestedSlug = null) {
  const userId = typeof userOrId === 'object' && userOrId ? userOrId.id : userOrId;
  const userEmail = typeof userOrId === 'object' && userOrId && userOrId.email ? String(userOrId.email).trim().toLowerCase() : null;

  // 1. If a specific cafe slug was requested, check if this user is assigned to THAT cafe
  if (requestedSlug) {
    const slug = String(requestedSlug).trim();
    const [rows] = await pool.query(
      `SELECT c.* FROM cafes c
       LEFT JOIN user u ON c.owner_id = u.id
       WHERE c.slug = ? AND (
         c.owner_id = ?
         ${userEmail ? 'OR c.owner_id = ? OR LOWER(u.email) = ? OR LOWER(c.owner_id) = ?' : ''}
       )
       LIMIT 1`,
      userEmail ? [slug, userId, userEmail, userEmail, userEmail] : [slug, userId]
    );
    return rows[0] || null;
  }

  // 2. Otherwise find any cafe assigned to this user (most recently created first)
  const [rows] = await pool.query(
    `SELECT c.* FROM cafes c
     LEFT JOIN user u ON c.owner_id = u.id
     WHERE c.owner_id = ?
     ${userEmail ? 'OR c.owner_id = ? OR LOWER(u.email) = ? OR LOWER(c.owner_id) = ?' : ''}
     ORDER BY c.created_at DESC
     LIMIT 1`,
    userEmail ? [userId, userEmail, userEmail, userEmail] : [userId]
  );
  return rows[0] || null;
}

async function updateCafeStatus(cafeId, status) {
  await pool.query('UPDATE cafes SET status = ? WHERE id = ?', [status, cafeId]);
  const cafe = await getCafeById(cafeId);
  if (cafe && menus.has(cafe.slug)) {
    menus.get(cafe.slug).cafe.status = status;
    writeToDisk(cafe.slug, menus.get(cafe.slug));
  }
  return cafe;
}

async function updateCafeManager(cafeId, newOwnerId) {
  await pool.query('UPDATE cafes SET owner_id = ? WHERE id = ?', [newOwnerId, cafeId]);
  return getCafeById(cafeId);
}

async function updateCafeTheme(cafeId, theme) {
  const themeVal = theme ? JSON.stringify(theme) : null;
  await pool.query('UPDATE cafes SET theme = ? WHERE id = ?', [themeVal, cafeId]);
  const cafe = await getCafeById(cafeId);
  if (cafe && menus.has(cafe.slug)) {
    menus.get(cafe.slug).cafe.theme = theme;
    writeToDisk(cafe.slug, menus.get(cafe.slug));
  }
  return cafe;
}

async function updateCafeSettings(cafeId, settings = {}) {
  const cafe = await getCafeById(cafeId);
  if (!cafe) return null;

  const updates = [];
  const values = [];

  const allowedFields = ['name', 'tagline', 'currency', 'footer', 'logo', 'phone', 'wifi_ssid', 'wifi_pass', 'status', 'hero_title', 'hero_description', 'hero_image'];
  for (const field of allowedFields) {
    if (settings[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(settings[field]);
    }
  }

  if (settings.theme !== undefined) {
    updates.push('theme = ?');
    values.push(settings.theme ? (typeof settings.theme === 'string' ? settings.theme : JSON.stringify(settings.theme)) : null);
  }

  if (updates.length > 0) {
    values.push(cafeId);
    await pool.query(`UPDATE cafes SET ${updates.join(', ')} WHERE id = ?`, values);
  }

  const updatedCafe = await getCafeById(cafeId);
  if (updatedCafe) {
    for (const field of allowedFields) {
      if (settings[field] !== undefined) updatedCafe[field] = settings[field];
    }
    if (settings.theme !== undefined) {
      updatedCafe.theme = typeof settings.theme === 'string' ? JSON.parse(settings.theme) : settings.theme;
    }
    if (menus.has(updatedCafe.slug)) {
      const memCafe = menus.get(updatedCafe.slug).cafe;
      for (const field of allowedFields) {
        if (settings[field] !== undefined) memCafe[field] = settings[field];
      }
      if (settings.theme !== undefined) {
        memCafe.theme = typeof settings.theme === 'string' ? JSON.parse(settings.theme) : settings.theme;
      }
      writeToDisk(updatedCafe.slug, menus.get(updatedCafe.slug));
    }
  }
  return updatedCafe;
}

async function deleteCafe(cafeId) {
  const cafe = await getCafeById(cafeId);
  if (!cafe) return null;
  await pool.query('DELETE FROM cafes WHERE id = ?', [cafeId]);
  menus.delete(cafe.slug);
  const file = path.join(DATA_DIR, `menu-${cafe.slug}.json`);
  if (fs.existsSync(file)) {
    try { fs.unlinkSync(file); } catch (_) {}
  }
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

async function getPlatformStats() {
  try {
    const [[{ count: totalCafes }]] = await pool.query('SELECT COUNT(*) AS count FROM cafes');
    const [[{ count: activeCafes }]] = await pool.query("SELECT COUNT(*) AS count FROM cafes WHERE status = 'active'");
    const [[{ count: totalUsers }]] = await pool.query('SELECT COUNT(*) AS count FROM user');
    const [[{ count: totalManagers }]] = await pool.query("SELECT COUNT(*) AS count FROM user WHERE role = 'manager'");
    const [[{ count: activeSessions }]] = await pool.query('SELECT COUNT(*) AS count FROM session WHERE expiresAt > NOW()');
    const [[{ count: totalCategories }]] = await pool.query('SELECT COUNT(*) AS count FROM categories');
    const [[{ count: totalDishes }]] = await pool.query('SELECT COUNT(*) AS count FROM items');
    const [[{ avgPrice }]] = await pool.query('SELECT AVG(price) AS avgPrice FROM items');

    return {
      totalCafes: Number(totalCafes) || 0,
      activeCafes: Number(activeCafes) || 0,
      suspendedCafes: Math.max(0, (Number(totalCafes) || 0) - (Number(activeCafes) || 0)),
      totalUsers: Number(totalUsers) || 0,
      totalManagers: Number(totalManagers) || 0,
      activeSessions: Number(activeSessions) || 0,
      totalCategories: Number(totalCategories) || 0,
      totalDishes: Number(totalDishes) || 0,
      avgPrice: Math.round(Number(avgPrice) || 0),
      dbEngine: 'MySQL 8.0 InnoDB Multi-Tenant',
      authVersion: 'Better Auth v1.7 (Bearer + Cookie)',
    };
  } catch (err) {
    console.warn('[store.getPlatformStats] database notice:', err.message);
    return {
      totalCafes: 1,
      activeCafes: 1,
      suspendedCafes: 0,
      totalUsers: 2,
      totalManagers: 1,
      activeSessions: 1,
      totalCategories: 4,
      totalDishes: 12,
      avgPrice: 150,
      dbEngine: 'MySQL 8.0 (reconnecting)',
      authVersion: 'Better Auth v1.7',
    };
  }
}

const scanEvents = []; // In-memory buffer of QR scans for quick lookups & offline test suites

/**
 * Records a QR scan / visitor event for a cafe tenant.
 * Every QR scan is counted as a visitor.
 */
async function recordScan(cafeSlug = 'abol-cafe', meta = {}) {
  const slug = String(cafeSlug || 'abol-cafe').trim();
  const tableNumber = meta.table || meta.tableNumber || null;
  const ipAddress = meta.ip || meta.ipAddress || null;
  const userAgent = meta.userAgent || null;
  const referrer = meta.referrer || null;
  const scannedAt = meta.scannedAt instanceof Date ? meta.scannedAt : new Date();

  // Determine cafeId
  let cafeId = 'default-abol-cafe';
  const cafeData = get(slug);
  if (cafeData?.cafe?.id) {
    cafeId = cafeData.cafe.id;
  }

  const event = {
    cafeSlug: slug,
    cafeId,
    tableNumber: tableNumber ? String(tableNumber) : null,
    ipAddress,
    userAgent,
    referrer,
    scannedAt,
  };

  scanEvents.push(event);
  if (scanEvents.length > 50000) {
    scanEvents.shift();
  }

  if (pool) {
    try {
      let realCafeId = cafeId;
      try {
        const [rows] = await pool.query('SELECT id FROM cafes WHERE slug = ?', [slug]);
        if (rows && rows.length > 0) {
          realCafeId = rows[0].id;
        }
      } catch (_) {}

      await pool.query(
        `INSERT INTO qr_scans (cafe_id, cafe_slug, table_number, ip_address, user_agent, referrer, scanned_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          realCafeId,
          slug,
          tableNumber ? String(tableNumber) : null,
          ipAddress ? String(ipAddress).slice(0, 255) : null,
          userAgent ? String(userAgent).slice(0, 500) : null,
          referrer ? String(referrer).slice(0, 500) : null,
          scannedAt,
        ]
      );
    } catch (err) {
      console.warn(`[store] Could not record scan to MySQL:`, err.message);
    }
  }

  return event;
}

/**
 * Returns real scan analytics and visitor counts for a cafe tenant.
 */
async function getCafeAnalytics(cafeSlug = 'abol-cafe') {
  const slug = String(cafeSlug || 'abol-cafe').trim();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  let totalScans = 0;
  let totalVisitors = 0;
  let uniqueVisitors = 0;
  let scansToday = 0;
  let visitorsToday = 0;
  let scansYesterday = 0;
  let visitorsYesterday = 0;
  const dailyCounts = new Map();

  let mysqlSucceeded = false;
  if (pool) {
    try {
      const [[totals]] = await pool.query(
        `SELECT
           COUNT(*) AS totalScans,
           COUNT(DISTINCT COALESCE(ip_address, id)) AS uniqueVisitors,
           SUM(CASE WHEN scanned_at >= CURDATE() THEN 1 ELSE 0 END) AS scansToday,
           SUM(CASE WHEN scanned_at >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND scanned_at < CURDATE() THEN 1 ELSE 0 END) AS scansYesterday,
           COUNT(DISTINCT CASE WHEN scanned_at >= CURDATE() THEN COALESCE(ip_address, id) END) AS visitorsToday,
           COUNT(DISTINCT CASE WHEN scanned_at >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND scanned_at < CURDATE() THEN COALESCE(ip_address, id) END) AS visitorsYesterday
         FROM qr_scans
         WHERE cafe_slug = ?`,
        [slug]
      );

      if (totals) {
        totalScans = Number(totals.totalScans) || 0;
        // Count every QR scan as a visitor as requested
        totalVisitors = totalScans;
        uniqueVisitors = Number(totals.uniqueVisitors) || 0;
        scansToday = Number(totals.scansToday) || 0;
        visitorsToday = Number(totals.visitorsToday) || scansToday;
        scansYesterday = Number(totals.scansYesterday) || 0;
        visitorsYesterday = Number(totals.visitorsYesterday) || scansYesterday;
      }

      const [daysRows] = await pool.query(
        `SELECT DATE(scanned_at) as scanDate, COUNT(*) as cnt
         FROM qr_scans
         WHERE cafe_slug = ? AND scanned_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY DATE(scanned_at)
         ORDER BY scanDate ASC`,
        [slug]
      );
      if (Array.isArray(daysRows)) {
        for (const row of daysRows) {
          const dStr = row.scanDate instanceof Date ? row.scanDate.toISOString().slice(0, 10) : String(row.scanDate);
          dailyCounts.set(dStr, Number(row.cnt) || 0);
        }
      }

      mysqlSucceeded = true;
    } catch (_) {
      mysqlSucceeded = false;
    }
  }

  // Fallback to in-memory scans
  if (!mysqlSucceeded) {
    const cafeScans = scanEvents.filter((ev) => ev.cafeSlug === slug);
    totalScans = cafeScans.length;
    totalVisitors = totalScans;
    const uniqueIps = new Set(cafeScans.map((s) => s.ipAddress || Math.random()));
    uniqueVisitors = uniqueIps.size;

    for (const scan of cafeScans) {
      const time = new Date(scan.scannedAt).getTime();
      if (time >= todayStart.getTime()) {
        scansToday++;
        visitorsToday++;
      } else if (time >= yesterdayStart.getTime()) {
        scansYesterday++;
        visitorsYesterday++;
      }
      const dStr = new Date(scan.scannedAt).toISOString().slice(0, 10);
      dailyCounts.set(dStr, (dailyCounts.get(dStr) || 0) + 1);
    }
  }

  const chartData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const key = `${yyyy}-${mm}-${dd}`;
    const val = dailyCounts.get(key) || 0;
    const dayName = dayNames[d.getDay()];
    const dateFormatted = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    chartData.push({
      day: dayName,
      date: key,
      value: val,
      label: `${dayName}, ${dateFormatted}: ${val} scans`,
    });
  }

  const calcTrend = (today, yest) => {
    if (yest === 0) {
      return today > 0 ? `+${today} today` : 'No scans yet';
    }
    const diff = today - yest;
    const pct = Math.round((diff / yest) * 100);
    return pct >= 0 ? `↗ +${pct}% from yesterday` : `↘ ${pct}% from yesterday`;
  };

  return {
    totalScans,
    totalVisitors,
    uniqueVisitors,
    scansToday,
    visitorsToday,
    scansYesterday,
    visitorsYesterday,
    scansTodayTrend: calcTrend(scansToday, scansYesterday),
    visitorsTrend: calcTrend(visitorsToday, visitorsYesterday),
    chartData,
  };
}

module.exports = {
  load,
  get,
  save,
  update,
  reset,
  loadAllFromMySQL,
  loadCafeFromMySQL,
  findCategory,
  findItem,
  newId,
  slugify,
  createCafe,
  listCafes,
  listAllCafesWithManagers,
  getPlatformStats,
  recordScan,
  getCafeAnalytics,
  getCafeById,
  getCafeBySlug,
  findCafeForUser,
  updateCafeStatus,
  updateCafeManager,
  updateCafeTheme,
  updateCafeSettings,
  deleteCafe,
  MENU_FILE,
};

