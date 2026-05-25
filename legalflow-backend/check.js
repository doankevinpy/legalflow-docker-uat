const BASE_URL = 'http://localhost:3000';
async function test() {
  const adminRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@legalflow.local', password: 'Admin@123!' })
  });
  console.log(adminRes.status);
  console.log(await adminRes.json());
}
test().catch(console.error);
