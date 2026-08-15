import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from './db.js';

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = 'hanzika_session';
const SESSION_DAYS = 30;

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${Buffer.from(derived).toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [algorithm, salt, expectedHex] = String(stored || '').split(':');
  if (algorithm !== 'scrypt' || !salt || !expectedHex) return false;
  const actual = Buffer.from(await scrypt(password, salt, 64));
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function cookie(value, maxAge) {
  const secure = process.env.VERCEL || process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export async function createSession(res, userId) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await db()`insert into sessions (token_hash, user_id, expires_at)
    values (${tokenHash(token)}, ${userId}, ${expiresAt.toISOString()})`;
  res.setHeader('Set-Cookie', cookie(token, SESSION_DAYS * 86400));
}

export async function clearSession(req, res) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (token) await db()`delete from sessions where token_hash = ${tokenHash(token)}`;
  res.setHeader('Set-Cookie', cookie('', 0));
}

export async function getSessionUser(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  const rows = await db()`select u.id, u.email, p.name, p.sessions_completed, p.last_studied_at, p.created_at
    from sessions s
    join users u on u.id = s.user_id
    join profiles p on p.id = u.id
    where s.token_hash = ${tokenHash(token)} and s.expires_at > now()
    limit 1`;
  return rows[0] || null;
}

export async function requireUser(req, res) {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: 'You need to be signed in.' });
    return null;
  }
  return user;
}

export function newUserId() {
  return randomUUID();
}
