import { test as base } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from '../api/_lib/auth.js';

function sql(){
  if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for e2e tests.');
  return neon(process.env.DATABASE_URL);
}

// Creates a real Neon user and deletes it after the test; foreign-key cascades
// remove all progress created by that user.
export async function createTestUser(_request, { name = 'Test User' } = {}){
  const email = `pw-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@gmail.com`;
  const password = 'PlaywrightTest123!';
  const id = randomUUID();
  const passwordHash = await hashPassword(password);
  await sql()`with new_user as (
    insert into users (id, email, password_hash, name) values (${id}, ${email}, ${passwordHash}, ${name})
  ) insert into profiles (id, name) values (${id}, ${name})`;
  return { id, email, password };
}

export async function deleteTestUser(_request, userId){
  if(!userId) return;
  await sql()`delete from users where id = ${userId}`;
}

export async function deleteTestUserByEmail(email){
  await sql()`delete from users where lower(email) = ${String(email).toLowerCase()}`;
}

export const test = base.extend({
  testUser: async ({ request }, use) => {
    const user = await createTestUser(request);
    await use(user);
    await deleteTestUser(request, user.id);
  },
});

export { expect } from '@playwright/test';
