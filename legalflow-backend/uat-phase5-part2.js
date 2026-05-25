const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- UAT PHASE 5 (Phần 2) ---');

  // 5. Input hardening
  console.log('\\n[TEST 5] Input Hardening (Forbid Non-Whitelisted)');
  const res5 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!', role: 'ADMIN' })
  });
  if (res5.status === 400) console.log('✅ PASS: Gửi field lạ (role) nhận 400 Bad Request');
  else console.log(`❌ FAIL: Input hardening lỗi (Status: ${res5.status})`);
  
  // 6. Login Privacy
  console.log('\\n[TEST 6] Login Privacy (Sai Email hay Sai Pass đều 401 chung message)');
  const res6 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'notfound@legalflow.local', password: 'ValidPassword123!' })
  });
  const res6Data = await res6.json();
  if (res6.status === 401 && res6Data.message === 'Thông tin đăng nhập không chính xác') {
    console.log('✅ PASS: Không tiết lộ email');
  } else {
    console.log(`❌ FAIL: Login Privacy failed. Status ${res6.status}, Message: ${res6Data.message}`);
  }
}
runTests().catch(console.error);
