'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const seed = require('./seed');

// MENU_FILE lets tests (and hosts with a mounted volume) point the store elsewhere.
const MENU_FILE = process.env.MENU_FILE
  ? path.resolve(process.env.MENU_FILE)
  : path.join(__dirname, '..', 'data', 'menu.json');
const DATA_DIR = path.dirname(MENU_FILE);

/** Keep a single copy of the menu in memory, mirrored to disk on every change. */
let menu = null;

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

function ensureShape(raw) {
  const data = raw && typeof raw === 'object' ? raw : {};
  const cafe = data.cafe && typeof data.cafe === 'object' ? data.cafe : {};
  return {
    cafe: {
      name: String(cafe.name || seed.cafe.name),
      tagline: String(cafe.tagline || seed.cafe.tagline),
      currency: String(cafe.currency || seed.cafe.currency),
      footer: String(cafe.footer || seed.cafe.footer),
      logo: String(cafe.logo || seed.cafe.logo),
      phone: typeof cafe.phone === 'string' ? cafe.phone : (seed.cafe.phone || ''),
      wifi_ssid: typeof cafe.wifi_ssid === 'string' ? cafe.wifi_ssid : (seed.cafe.wifi_ssid || ''),
      wifi_pass: typeof cafe.wifi_pass === 'string' ? cafe.wifi_pass : (seed.cafe.wifi_pass || ''),
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

function writeToDisk() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${MENU_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(menu, null, 2)}\n`, 'utf8');
  fs.renameSync(tmp, MENU_FILE);
}

function load() {
  try {
    const raw = fs.readFileSync(MENU_FILE, 'utf8');
    menu = ensureShape(JSON.parse(raw));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`[store] Could not read ${MENU_FILE} (${error.message}); using the default menu.`);
    }
    menu = ensureShape(seed);
    writeToDisk();
  }
  return menu;
}

function get() {
  if (!menu) load();
  return menu;
}

function save(next) {
  menu = ensureShape(next);
  writeToDisk();
  return menu;
}

function update(mutator) {
  const draft = JSON.parse(JSON.stringify(get()));
  const result = mutator(draft);
  save(draft);
  return result;
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

function reset() {
  return save(seed);
}

module.exports = { load, get, save, update, reset, findCategory, findItem, newId, slugify, MENU_FILE };
