import { createSession, clearSession, getSessionUser, hashPassword, newUserId, verifyPassword } from './_lib/auth.js';
import { db } from './_lib/db.js';

function publicUser(row) {
  return row ? { id: row.id, email: row.email, name: row.name } : null;
}
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const user = await getSessionUser(req);
      return user
        ? res.status(200).json({ user: publicUser(user) })
        : res.status(401).json({ error: 'No active session.' });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
    const action = String(req.body?.action || '');

    if (action === 'logout') {
      await clearSession(req, res);
      return res.status(200).json({ ok: true });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
      return res.status(400).json({ error: 'Enter a valid email and a password of at least 6 characters.' });
    }

    if (action === 'login') {
      const rows = await db()`select id, email, password_hash, name from users where lower(email) = ${email} limit 1`;
      const user = rows[0];
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
      }
      await createSession(res, user.id);
      return res.status(200).json({ user: publicUser(user) });
    }

    if (action === 'signup') {
      const name = String(req.body?.name || '').trim().slice(0, 100);
      if (!name) return res.status(400).json({ error: 'Name is required.' });
      const id = newUserId();
      const passwordHash = await hashPassword(password);
      try {
        const rows = await db()`with new_user as (
          insert into users (id, email, password_hash, name)
          values (${id}, ${email}, ${passwordHash}, ${name})
          returning id, email, name
        ), new_profile as (
          insert into profiles (id, name) select id, name from new_user
        )
        select id, email, name from new_user`;
        await createSession(res, rows[0].id);
        return res.status(201).json({ user: publicUser(rows[0]) });
      } catch (error) {
        if (error?.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' });
        throw error;
      }
    }

    return res.status(400).json({ error: 'Unknown authentication action.' });
  } catch (error) {
    console.error('Auth API failed:', error);
    return res.status(500).json({ error: 'Authentication is temporarily unavailable.' });
  }
}
