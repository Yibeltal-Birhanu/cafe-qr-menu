'use strict';

require('dotenv').config();
const crypto = require('crypto');
const { betterAuth } = require('better-auth');
const { bearer } = require('better-auth/plugins');
const { toNodeHandler, fromNodeHeaders } = require('better-auth/node');
const pool = require('./db/pool');

const SESSION_SECRET = process.env.BETTER_AUTH_SECRET || process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Initialize Better Auth with MySQL database pool and role management
const auth = betterAuth({
  secret: SESSION_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:*',
    'http://127.0.0.1:*',
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  ],
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'manager',
        input: false, // Prevents regular signups from elevating themselves to superadmin
      },
    },
  },
  plugins: [bearer()],
});

/* ------------------------------------------------------------------ *
 * User & Role Management Helpers
 * ------------------------------------------------------------------ */

/**
 * Creates or retrieves/updates a manager account with a dedicated password.
 */
async function createManagerUser({ email, password, name = 'Cafe Manager' }) {
  const safeEmail = String(email || '').trim().toLowerCase();
  const [existing] = await pool.query('SELECT id, email, name, role FROM user WHERE email = ?', [safeEmail]);
  if (existing.length > 0) {
    const existingUser = existing[0];
    if (password) {
      const { hashPassword } = require('better-auth/crypto');
      const hashedPassword = await hashPassword(String(password));
      await pool.query('UPDATE account SET password = ? WHERE userId = ? AND providerId = ?', [
        hashedPassword,
        existingUser.id,
        'credential',
      ]);
    }
    if (name && name !== existingUser.name) {
      await pool.query('UPDATE user SET name = ? WHERE id = ?', [String(name), existingUser.id]);
    }
    return { ...existingUser, name: name || existingUser.name };
  }

  const res = await auth.api.signUpEmail({
    body: {
      email: safeEmail,
      password: String(password),
      name: String(name),
    },
  });

  // Ensure role is explicitly manager
  await pool.query('UPDATE user SET role = ? WHERE id = ?', ['manager', res.user.id]);
  return { ...res.user, role: 'manager' };
}

/**
 * Automatically provisions the default Super Admin from .env if none exists.
 */
async function bootstrapSuperAdmin() {
  const email = (process.env.SUPERADMIN_EMAIL || 'superadmin@cafemenu.com').trim().toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD || 'superadmin123!';

  try {
    const [rows] = await pool.query('SELECT id, email, role FROM user WHERE email = ?', [email]);
    if (rows.length === 0) {
      const res = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: 'Super Administrator',
        },
      });
      await pool.query('UPDATE user SET role = ? WHERE id = ?', ['superadmin', res.user.id]);
      console.log(`[auth] Super Admin account created: ${email}`);
    } else if (rows[0].role !== 'superadmin') {
      await pool.query('UPDATE user SET role = ? WHERE id = ?', ['superadmin', rows[0].id]);
    }
  } catch (err) {
    console.warn('[auth] Super Admin bootstrap notice:', err.message);
  }
}

/* ------------------------------------------------------------------ *
 * Legacy Auth Helpers (Maintains 100% Backward Compatibility)
 * ------------------------------------------------------------------ */

function sign(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

function createToken(extra = {}) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS, role: 'superadmin', ...extra })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  if (!signature || signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof decoded.exp === 'number' && decoded.exp > Date.now() ? decoded : false;
  } catch {
    return false;
  }
}

function checkPassword(candidate) {
  const given = Buffer.from(String(candidate || ''));
  const real = Buffer.from(ADMIN_PASSWORD);
  if (given.length !== real.length) return false;
  return crypto.timingSafeEqual(given, real);
}

/**
 * Express middleware guarding admin routes.
 * Accepts Better Auth session (cookie or Bearer header) AND legacy HMAC tokens.
 */
async function requireAuth(req, res, next) {
  try {
    // 1. Try Better Auth session
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session && session.user) {
      req.user = session.user;
      req.session = session.session;
      req.authType = 'better-auth';
      return next();
    }
  } catch (err) {
    // Proceed to legacy check if session lookup errors
  }

  // 2. Try Legacy HMAC Bearer token
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const legacyPayload = verifyToken(token);

  if (legacyPayload) {
    req.user = { id: legacyPayload.sub || 'legacy-admin', role: legacyPayload.role || 'superadmin', legacy: true };
    req.cafeSlug = legacyPayload.cafeSlug || 'abol-cafe';
    req.authType = 'legacy';
    return next();
  }

  return res.status(401).json({ error: 'Not signed in. Please sign in again.' });
}

/**
 * Express middleware ensuring the user is a Super Administrator.
 */
async function requireSuperAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user && (req.user.role === 'superadmin' || req.user.id === 'legacy-admin')) {
      return next();
    }
    return res.status(403).json({ error: 'Super Admin access required.' });
  });
}

module.exports = {
  auth,
  toNodeHandler,
  createToken,
  verifyToken,
  checkPassword,
  requireAuth,
  requireSuperAdmin,
  createManagerUser,
  bootstrapSuperAdmin,
};
