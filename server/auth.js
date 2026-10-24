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

/**
 * Trust the server's own LAN IPs so phones/other devices on the same network
 * can use Better Auth via http://<lan-ip>:3000 (origin varies per network).
 */
function privateLanOrigins() {
  const os = require('os');
  const origins = [];
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets || []) {
      if (net.family === 'IPv4' && !net.internal) {
        origins.push(`http://${net.address}:*`, `https://${net.address}:*`);
      }
    }
  }
  return origins;
}

/** Extra origins can be supplied as a comma-separated list: BETTER_AUTH_EXTRA_ORIGINS=http://x:3000,http://y:5173 */
function extraOrigins() {
  return (process.env.BETTER_AUTH_EXTRA_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

// Initialize Better Auth with MySQL database pool and role management
const auth = betterAuth({
  secret: SESSION_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:*',
    'http://127.0.0.1:*',
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    ...privateLanOrigins(),
    ...extraOrigins(),
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

function decodeJwt(tokenStr) {
  if (!tokenStr || typeof tokenStr !== 'string' || !tokenStr.includes('.')) return null;
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (!payload || typeof payload !== 'object') return null;
    if (process.env.NODE_ENV === 'production' && typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Express middleware guarding admin routes.
 * Accepts Better Auth session (cookie or Bearer header), Supabase JWT, and legacy HMAC tokens.
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
    // Proceed to token check if session lookup errors
  }

  // 2. Try Supabase JWT (from Cookie or Bearer header)
  let supabaseToken = null;
  const cookieHeader = req.headers.cookie || '';
  const matchCookie = cookieHeader.match(/supabase_access_token=([^;]+)/);
  if (matchCookie) {
    supabaseToken = decodeURIComponent(matchCookie[1]);
  }
  const authHeader = req.get('authorization') || '';
  if (!supabaseToken && authHeader.startsWith('Bearer ')) {
    const candidate = authHeader.slice(7);
    if (candidate.split('.').length === 3) {
      supabaseToken = candidate;
    }
  }

  if (supabaseToken) {
    const payload = decodeJwt(supabaseToken);
    if (payload && payload.email) {
      const email = payload.email.trim().toLowerCase();
      const isSuper =
        email === (process.env.SUPERADMIN_EMAIL || 'superadmin@cafemenu.com').toLowerCase() ||
        email === 'tegegnw1997@gmail.com';
      let user = null;
      try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length > 0) {
          user = rows[0];
        } else {
          const userId = payload.sub || crypto.randomUUID();
          const name =
            payload.user_metadata?.full_name ||
            payload.user_metadata?.name ||
            email.split('@')[0] ||
            'Manager';
          const role = isSuper ? 'superadmin' : 'manager';
          await pool.query(
            `INSERT INTO user (id, name, email, emailVerified, role, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role)`,
            [userId, name, email, true, role]
          );
          user = { id: userId, name, email, role, emailVerified: true };
        }
      } catch (err) {
        user = {
          id: payload.sub || 'supabase-user',
          email,
          name: payload.user_metadata?.full_name || email.split('@')[0],
          role: isSuper ? 'superadmin' : 'manager',
        };
      }

      req.user = user;
      req.authType = 'supabase';
      return next();
    }
  }

  // 3. Try Legacy HMAC Bearer token
  const legacyToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const legacyPayload = verifyToken(legacyToken);

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
