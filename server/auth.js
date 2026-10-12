'use strict';

const crypto = require('crypto');

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

if (!process.env.ADMIN_PASSWORD) {
  console.warn('[auth] ADMIN_PASSWORD is not set - falling back to the default "admin123". Set it before going live.');
}

function sign(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
}

function createToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
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
    return typeof decoded.exp === 'number' && decoded.exp > Date.now();
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

/** Express middleware guarding every mutating /api/admin route. */
function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Not signed in. Please sign in again.' });
  }
  return next();
}

module.exports = { createToken, verifyToken, checkPassword, requireAuth };
