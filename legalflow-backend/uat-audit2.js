const assert = require('assert');
const BASE_URL = 'http://localhost:3000';

async function test() {
  console.log('--- Kiểm tra Audit Log Database qua API ---');
  // 1. Đăng nhập Admin
  const adminRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!' })
  });
  const adminData = await adminRes.json();
  const token = adminData.accessToken;

  const logsRes = await fetch(`${BASE_URL}/admin-audit-logs?limit=50`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const logsData = await logsRes.json();
  if (!logsData || !logsData.data) {
     console.log("Lỗi lấy logsData:", logsData);
     return;
  }
  const logs = logsData.data;

  // Lọc ra LOGIN_SUCCESS và LOGIN_FAILED
  const loginLogs = logs.filter(l => l.action === 'LOGIN_SUCCESS' || l.action === 'LOGIN_FAILED');
  console.log(`Tìm thấy ${loginLogs.length} logs liên quan đến LOGIN`);
  
  let hasSuccess = loginLogs.some(l => l.action === 'LOGIN_SUCCESS');
  let hasFailed = loginLogs.some(l => l.action === 'LOGIN_FAILED');

  if (hasSuccess && hasFailed) {
    console.log('✅ PASS: Ghi nhận đầy đủ LOGIN_SUCCESS và LOGIN_FAILED');
  } else {
    console.log(`❌ FAIL: Thiếu. SUCCESS: ${hasSuccess}, FAILED: ${hasFailed}`);
  }
  
  let rateLimitHit = logs.some(l => l.action === 'RATE_LIMIT_HIT');
  if (!rateLimitHit) {
    console.log('✅ PASS: RATE_LIMIT_HIT không bị ghi vào CSDL');
  } else {
    console.log('❌ FAIL: RATE_LIMIT_HIT bị ghi vào CSDL!');
  }

  // Kiểm tra secret
  const rawDataStr = JSON.stringify(loginLogs);
  const secrets = ['password', 'passwordHash', 'passwordTemp', 'currentPassword', 'newPassword', 'confirmPassword', 'accessToken', 'JWT_SECRET', 'DATABASE_URL'];
  let noSecret = true;
  for (const s of secrets) {
    if (rawDataStr.includes(s)) {
      console.log(`❌ FAIL: Phát hiện thông tin nhạy cảm '${s}' trong Audit Log`);
      loginLogs.forEach(log => {
        if (JSON.stringify(log).includes(s)) {
           console.log(`Bị lộ trong log:`, log);
        }
      });
      noSecret = false;
    }
  }
  if (noSecret) console.log('✅ PASS: Audit details hoàn toàn sạch sẽ không chứa thông tin nhạy cảm');
}

test().catch(console.error);
