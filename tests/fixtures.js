import { test as base } from '@playwright/test';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function adminHeaders(){
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };
}

// Creates a real, pre-confirmed Supabase user for a test (bypasses the email
// confirmation flow — that flow itself isn't what these tests are verifying)
// and deletes it (cascades to all owned rows) when the test finishes, so
// e2e runs never leave junk behind in the real project.
export async function createTestUser(request, { name = 'Test User' } = {}){
  const email = `pw-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@gmail.com`;
  const password = 'PlaywrightTest123!';
  const res = await request.post(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: adminHeaders(),
    data: { email, password, email_confirm: true, user_metadata: { name } },
  });
  if(!res.ok()) throw new Error(`createTestUser failed: ${res.status()} ${await res.text()}`);
  const user = await res.json();
  return { id: user.id, email, password };
}

export async function deleteTestUser(request, userId){
  if(!userId) return;
  await request.delete(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    headers: adminHeaders(),
  });
}

export const test = base.extend({
  testUser: async ({ request }, use) => {
    const user = await createTestUser(request);
    await use(user);
    await deleteTestUser(request, user.id);
  },
});

export { expect } from '@playwright/test';
