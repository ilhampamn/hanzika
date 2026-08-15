import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const schema = await readFile(new URL('../neon/schema.sql', import.meta.url), 'utf8');
const sql = neon(process.env.DATABASE_URL);
for (const statement of schema.split(';').map(part => part.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log('Neon schema is up to date.');
