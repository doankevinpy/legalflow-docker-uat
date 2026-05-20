async function runTests() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    assert(healthRes.status === 200, 'GET /health returns 200 OK');

    // 2. Login fail (wrong password)
    const loginFailRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalflow.local', password: 'wrongpassword' }),
    });
    assert(loginFailRes.status === 401, 'Login wrong password returns 401');

    // 3. Login success (admin)
    const loginSuccessRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!' }),
    });
    assert(loginSuccessRes.status === 201, 'Login success returns 201');
    const loginData = await loginSuccessRes.json();
    const token = loginData.accessToken;
    assert(!!token, 'Access token is present');
    assert(loginData.user && !loginData.user.passwordHash, 'User object present and passwordHash omitted');

    // 4. GET /auth/profile without token
    const profileNoTokenRes = await fetch(`${baseUrl}/auth/profile`);
    assert(profileNoTokenRes.status === 401, 'Profile without token returns 401');

    // 5. GET /auth/profile with token
    const profileRes = await fetch(`${baseUrl}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(profileRes.status === 200, 'Profile with token returns 200');
    const profileData = await profileRes.json();
    assert(profileData.email === 'admin@legalflow.local' && !profileData.passwordHash, 'Profile data is correct and passwordHash omitted');

    // 6. GET /auth/admin-only with ADMIN token
    const adminOnlyRes = await fetch(`${baseUrl}/auth/admin-only`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(adminOnlyRes.status === 200, 'Admin-only with ADMIN token returns 200');

    // 7. GET /auth/admin-only with VIEWER token
    const viewerLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'viewer@legalflow.local', password: 'Viewer@123!' }),
    });
    const viewerData = await viewerLoginRes.json();
    const viewerToken = viewerData.accessToken;
    const viewerAdminRes = await fetch(`${baseUrl}/auth/admin-only`, {
      headers: { 'Authorization': `Bearer ${viewerToken}` }
    });
    assert(viewerAdminRes.status === 403, 'Admin-only with VIEWER token returns 403');

  } catch (err) {
    console.error('Test execution error:', err);
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
