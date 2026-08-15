import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from '../api/_lib/auth.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const email = 'demo@hanzika.app';
const password = process.env.DEMO_PASSWORD || 'demo1234';
const passwordHash = await hashPassword(password);
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`insert into users (id, email, password_hash, name)
  values (${randomUUID()}, ${email}, ${passwordHash}, 'Demo Learner')
  on conflict (lower(email)) do update set password_hash = excluded.password_hash, name = excluded.name
  returning id`;
await sql`insert into profiles (id, name) values (${rows[0].id}, 'Demo Learner')
  on conflict (id) do update set name = excluded.name`;
console.log(`Demo account is ready: ${email}`);
