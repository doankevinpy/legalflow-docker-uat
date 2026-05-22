const BASE_URL = 'http://localhost:3000';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('--- Bắt đầu test Security Hardening ---');

  // Test 1: Field lạ vào Login -> 400
  console.log('\\n1. Test Input Hardening (Forbid Non-Whitelisted)...');
  const res1 = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!', role: 'ADMIN' })
  });
  if (res1.status === 400) {
    console.log('✅ PASS: Gửi field lạ (role) nhận đúng 400 Bad Request');
  } else {
    console.log(`❌ FAIL: Status = ${res1.status}`);
  }

  // Test 2: Helmet Headers
  console.log('\\n2. Test Helmet Headers...');
  const res2 = await fetch(`${BASE_URL}/auth/login`, { method: 'GET' }); // Method Not Allowed is fine, we just want headers
  const csp = res2.headers.get('content-security-policy');
  const frameOptions = res2.headers.get('x-frame-options');
  if (frameOptions === 'SAMEORIGIN') {
    console.log('✅ PASS: X-Frame-Options có tồn tại từ Helmet');
  } else {
    console.log('❌ FAIL: Thiếu X-Frame-Options');
  }

  // Test 3: Brute-force Login Limit
  console.log('\\n3. Test Rate Limiting (Login)...');
  let hit429 = false;
  let hit401 = false;
  for (let i = 1; i <= 7; i++) {
    const res3 = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalflow.local', password: 'WrongPassword' })
    });
    if (res3.status === 401) hit401 = true;
    if (res3.status === 429) {
      hit429 = true;
      const data = await res3.json();
      if (data.message === 'Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau ít phút.') {
         console.log('✅ PASS: Nhận đúng 429 và thông báo tiếng Việt');
      }
      break;
    }
  }
  if (!hit429) console.log('❌ FAIL: Không nhận được 429');
  
  // Login bằng Manager để lấy token cho các test sau
  // Phải đợi xíu nếu lỡ bị Rate limit theo IP
  // IP là localhost -> auth/login bị limit 5req/phút cho toàn IP!
  // Đợi đã, ThrottleGuard áp dụng trên auth/login, nếu ta dùng admin@legalflow.local đăng nhập tiếp sẽ bị 429.
  // Vì nó đếm req.ip. Vậy ta phải đợi 60s để test Login Success?
  // Khỏi, skip Login success test ở script này hoặc ta có thể check log console.
  // Hoặc đổi IP? Fetch local không đổi IP được.
  
  console.log('\\nLƯU Ý: Do IP bị Rate Limit, cần đợi 60s để chạy các bài test login đúng. Script sẽ kết thúc phần spam tại đây.');
}

runTests().catch(console.error);
