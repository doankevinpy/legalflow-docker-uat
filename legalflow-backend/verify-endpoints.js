async function runVerification() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;
  const results = [];

  function record(name, isPass, note) {
    if (isPass) passed++;
    else failed++;
    results.push({ name, isPass, note });
    console.log(`${isPass ? '✅ PASS' : '❌ FAIL'}: ${name} ${note ? `(${note})` : ''}`);
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    record('GET /health trả 200 OK', healthRes.status === 200);

    // 2. Login fail
    const loginFailRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalflow.local', password: 'wrongpassword' }),
    });
    record('POST /auth/login với sai password trả 401', loginFailRes.status === 401);

    // 3. Login success
    const loginSuccessRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!' }),
    });
    
    let token = null;
    if (loginSuccessRes.status === 201) {
      const loginData = await loginSuccessRes.json();
      token = loginData.accessToken;
      
      const hasTokenAndUser = !!token && !!loginData.user;
      record('POST /auth/login với admin đúng trả accessToken và user', hasTokenAndUser);
      
      const u = loginData.user;
      const hasNoSensitiveData = !u.password && !u.passwordHash && !u.JWT_SECRET && !u.DATABASE_URL && !loginData.JWT_SECRET;
      record('Response login không có passwordHash/secrets', hasNoSensitiveData);
      
      const hasRightFields = u.id && u.email && u.fullName && u.role && u.isActive === true;
      record('Response login có format đúng (id, email, fullName, role, isActive)', !!hasRightFields);
      
    } else {
      record('POST /auth/login với admin đúng trả accessToken và user', false, `Status was ${loginSuccessRes.status}`);
      record('Response login không có passwordHash/secrets', false);
      record('Response login có format đúng', false);
    }

    // 4. GET profile without token
    const profileNoTokenRes = await fetch(`${baseUrl}/auth/profile`);
    record('GET /auth/profile không token trả 401', profileNoTokenRes.status === 401);

    // 5. GET profile with token
    if (token) {
      const profileRes = await fetch(`${baseUrl}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.status === 200) {
        const pData = await profileRes.json();
        record('GET /auth/profile có token admin trả user profile', pData.email === 'admin@legalflow.local');
        const hasNoSensitive = !pData.password && !pData.passwordHash;
        record('Response profile không có passwordHash', hasNoSensitive);
      } else {
        record('GET /auth/profile có token admin trả user profile', false);
        record('Response profile không có passwordHash', false);
      }

      // 6. Admin only with ADMIN token
      const adminOnlyRes = await fetch(`${baseUrl}/auth/admin-only`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      record('GET /auth/admin-only với ADMIN token trả 200', adminOnlyRes.status === 200);
    }

    // 7. Viewer login
    const viewerLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'viewer@legalflow.local', password: 'Viewer@123!' }),
    });
    if (viewerLoginRes.status === 201) {
      const viewerData = await viewerLoginRes.json();
      const viewerAdminRes = await fetch(`${baseUrl}/auth/admin-only`, {
        headers: { 'Authorization': `Bearer ${viewerData.accessToken}` }
      });
      record('GET /auth/admin-only với VIEWER token trả 403', viewerAdminRes.status === 403);
    } else {
      record('GET /auth/admin-only với VIEWER token trả 403', false, 'Failed to login viewer');
    }

  } catch (err) {
    console.error('Test error', err);
  }

  console.log('\n--- VERIFICATION REPORT ---');
  results.forEach(r => {
    console.log(`${r.isPass ? 'PASS' : 'FAIL'} | ${r.name} | ${r.note || ''}`);
  });
  console.log(`\nTotals: ${passed} passed, ${failed} failed.`);
  
  // Write to a JSON file for the orchestrator to read easily if needed
  require('fs').writeFileSync('verification-results.json', JSON.stringify({ passed, failed, results }, null, 2));
}

runVerification();
