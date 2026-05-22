const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- Bắt đầu test Spam Endpoints ---');

  // Spam change-password (no token needed to hit rate limit, guard sequence: Throttler -> JWT)
  console.log('\\n1. Spam /auth/change-password...');
  let hit429_cp = false;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: '1', newPassword: '2', confirmPassword: '2' })
    });
    if (res.status === 429) hit429_cp = true;
  }
  if (hit429_cp) console.log('✅ PASS: Spam /auth/change-password bị 429');
  else console.log('❌ FAIL: Không bị 429 khi spam /auth/change-password');

  // Spam reset-password
  console.log('\\n2. Spam /users/abc/reset-password...');
  let hit429_rp = false;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/users/abc/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordTemp: '2' })
    });
    if (res.status === 429) hit429_rp = true;
  }
  if (hit429_rp) console.log('✅ PASS: Spam /users/abc/reset-password bị 429');
  else console.log('❌ FAIL: Không bị 429 khi spam /users/abc/reset-password');
}

runTests().catch(console.error);
