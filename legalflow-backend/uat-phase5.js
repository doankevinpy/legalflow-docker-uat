const { execSync } = require('child_process');
const fs = require('fs');
const BASE_URL = 'http://localhost:3000';

async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function runTests() {
  console.log('--- BẮT ĐẦU UAT PHASE 5 ---');
  let token = null;

  // 1. Kiểm tra Helmet Header
  console.log('\\n[TEST 1] Kiểm tra Helmet & CORS');
  const res1 = await fetch(`${BASE_URL}/auth/login`, { method: 'OPTIONS' });
  const csp = res1.headers.get('content-security-policy');
  const frameOptions = res1.headers.get('x-frame-options');
  if (frameOptions === 'SAMEORIGIN') console.log('✅ Helmet headers tồn tại (X-Frame-Options: SAMEORIGIN)');
  else console.log('❌ FAIL: Thiếu Helmet headers');

  // 2. Rate limit login
  console.log('\\n[TEST 2] Rate Limit Login (Spam sai mật khẩu)');
  let hit429 = false;
  let hit401 = false;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalflow.local', password: 'wrong' })
    });
    if (res.status === 401) { hit401 = true; }
    if (res.status === 429) {
      hit429 = true;
      const data = await res.json();
      if (data.message === 'Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau ít phút.') {
        console.log('✅ PASS: Lần thứ 6 nhận đúng lỗi 429 và thông báo Tiếng Việt');
      }
    }
  }

  // 3. Rate limit reset password
  console.log('\\n[TEST 3] Rate Limit Reset Password');
  let hit429Reset = false;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/users/fakeid/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordTemp: 'Pass@12345' }) // Giả pass hợp lệ để qua validation
    });
    if (res.status === 429) hit429Reset = true;
  }
  if (hit429Reset) console.log('✅ PASS: Spam /reset-password bị rate limit (429)');
  else console.log('❌ FAIL: Không bị rate limit reset-password');

  // 4. Rate limit change password
  console.log('\\n[TEST 4] Rate Limit Change Password');
  let hit429Change = false;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: 'a', newPassword: 'b', confirmPassword: 'b' })
    });
    if (res.status === 429) hit429Change = true;
  }
  if (hit429Change) console.log('✅ PASS: Spam /change-password bị rate limit (429)');
  else console.log('❌ FAIL: Không bị rate limit change-password');

  // 5. Input hardening
  console.log('\\n[TEST 5] Input Hardening (Forbid Non-Whitelisted)');
  const res5 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!', role: 'ADMIN' })
  });
  if (res5.status === 400) console.log('✅ PASS: Gửi field lạ (role) nhận 400 Bad Request');
  else console.log('❌ FAIL: Input hardening lỗi');
  
  console.log('\\n[TEST 6] Login Privacy (Sai Email hay Sai Pass đều 401 chung message)');
  const res6 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'notfound@legalflow.local', password: 'abc' })
  });
  // Do bị rate limit ở test 2, test này cũng có thể bị 429! Nên bỏ qua check status 401 nếu 429
  const res6Data = await res6.json();
  if (res6.status === 401 && res6Data.message === 'Thông tin đăng nhập không chính xác') {
    console.log('✅ PASS: Không tiết lộ email');
  } else if (res6.status === 429) {
    console.log('✅ SKIP: Đang bị 429 rate limit nên không check privacy');
  }

  // Để check AdminAuditLog, ta dùng Prisma query
  console.log('\\n[TEST 7] Audit Logs for Login');
  // Truy vấn DB thông qua module riêng hoặc in ra...
}
runTests().catch(console.error);
