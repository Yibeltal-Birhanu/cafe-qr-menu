'use strict';

require('dotenv').config();
const crypto = require('crypto');
const pool = require('./pool');
const seed = require('../seed');

async function initDB() {
  const connection = await pool.getConnection();
  try {
    // 1. Better Auth Tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        role VARCHAR(50) NOT NULL DEFAULT 'manager',
        createdAt DATETIME(3) NOT NULL,
        updatedAt DATETIME(3) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure role column exists if table existed previously
    try {
      await connection.query(`ALTER TABLE user ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'manager'`);
    } catch (_) {}

    await connection.query(`
      CREATE TABLE IF NOT EXISTS session (
        id VARCHAR(36) PRIMARY KEY,
        expiresAt DATETIME(3) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        createdAt DATETIME(3) NOT NULL,
        updatedAt DATETIME(3) NOT NULL,
        ipAddress VARCHAR(255),
        userAgent TEXT,
        userId VARCHAR(36) NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS account (
        id VARCHAR(36) PRIMARY KEY,
        accountId VARCHAR(255) NOT NULL,
        providerId VARCHAR(255) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        accessTokenExpiresAt DATETIME(3),
        refreshTokenExpiresAt DATETIME(3),
        scope TEXT,
        password TEXT,
        createdAt DATETIME(3) NOT NULL,
        updatedAt DATETIME(3) NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS verification (
        id VARCHAR(36) PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        expiresAt DATETIME(3) NOT NULL,
        createdAt DATETIME(3) NOT NULL,
        updatedAt DATETIME(3) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Multi-Tenant Cafe Domain Tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cafes (
        id VARCHAR(36) PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        tagline TEXT,
        currency VARCHAR(20) NOT NULL DEFAULT 'ETB',
        footer TEXT,
        logo VARCHAR(100) DEFAULT 'coffee',
        phone VARCHAR(100) DEFAULT '',
        wifi_ssid VARCHAR(100) DEFAULT '',
        wifi_pass VARCHAR(100) DEFAULT '',
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        theme JSON NULL,
        owner_id VARCHAR(36) NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    try {
      await connection.query(`ALTER TABLE cafes ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active'`);
      await connection.query(`ALTER TABLE cafes ADD COLUMN IF NOT EXISTS theme JSON NULL`);
    } catch (_) {}

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(64) NOT NULL,
        cafeId VARCHAR(36) NOT NULL DEFAULT 'default-abol-cafe',
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(100) DEFAULT 'coffee',
        image VARCHAR(500) DEFAULT '',
        description TEXT,
        sortOrder INT NOT NULL DEFAULT 0,
        PRIMARY KEY (cafeId, id),
        FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    try {
      await connection.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image VARCHAR(500) DEFAULT ''`);
    } catch (_) {}

    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id VARCHAR(64) NOT NULL,
        categoryId VARCHAR(64) NOT NULL,
        cafeId VARCHAR(36) NOT NULL DEFAULT 'default-abol-cafe',
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500) DEFAULT '',
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        badge VARCHAR(100) DEFAULT '',
        prepTime VARCHAR(100) DEFAULT '',
        dietary VARCHAR(100) DEFAULT '',
        available BOOLEAN NOT NULL DEFAULT TRUE,
        sortOrder INT NOT NULL DEFAULT 0,
        PRIMARY KEY (cafeId, id),
        FOREIGN KEY (cafeId) REFERENCES cafes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    try {
      await connection.query(`ALTER TABLE items ADD COLUMN IF NOT EXISTS image VARCHAR(500) DEFAULT ''`);
    } catch (_) {}

    // 3. Seed default cafe (abol-cafe) if none exists
    const [existing] = await connection.query('SELECT id FROM cafes WHERE slug = ?', ['abol-cafe']);
    if (existing.length === 0) {
      console.log('[db] Seeding initial default tenant (abol-cafe)...');
      const cafeId = 'default-abol-cafe';
      await connection.query(
        `INSERT INTO cafes (id, slug, name, tagline, currency, footer, logo, phone, wifi_ssid, wifi_pass, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cafeId,
          'abol-cafe',
          seed.cafe.name || 'Prism Cafe',
          seed.cafe.tagline || '',
          seed.cafe.currency || 'ETB',
          seed.cafe.footer || '',
          seed.cafe.logo || 'coffee',
          seed.cafe.phone || '',
          seed.cafe.wifi_ssid || '',
          seed.cafe.wifi_pass || '',
          'active',
        ]
      );

      for (let cIdx = 0; cIdx < seed.categories.length; cIdx++) {
        const cat = seed.categories[cIdx];
        await connection.query(
          `INSERT INTO categories (id, cafeId, name, icon, description, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [cat.id, cafeId, cat.name, cat.icon || 'coffee', cat.description || '', cIdx]
        );

        if (Array.isArray(cat.items)) {
          for (let iIdx = 0; iIdx < cat.items.length; iIdx++) {
            const item = cat.items[iIdx];
            await connection.query(
              `INSERT INTO items (id, categoryId, cafeId, name, description, image, price, badge, prepTime, dietary, available, sortOrder)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                item.id,
                cat.id,
                cafeId,
                item.name,
                item.description || '',
                item.image || '',
                Number(item.price) || 0,
                item.badge || '',
                item.prepTime || '',
                item.dietary || '',
                item.available !== undefined ? Boolean(item.available) : true,
                iIdx,
              ]
            );
          }
        }
      }
      console.log('[db] Initial tenant seeded successfully.');
    }

    console.log('[db] Database schema verified and ready.');
  } finally {
    connection.release();
  }
}

module.exports = { initDB };

if (require.main === module) {
  initDB()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[db] Error initializing database:', err);
      process.exit(1);
    });
}
