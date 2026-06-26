# Khôi phục Nhanh Môi trường Local Docker PostgreSQL (LOCAL_RESTORE_QUICKSTART)

Dưới đây là các bước và lệnh theo đúng thứ tự để khôi phục và chạy ứng dụng LegalFlow cục bộ trên máy mới.

## 1. Khôi phục Hạ tầng & Backend

```powershell
cd C:\Users\Admin\legalflow-docker-uat

Copy-Item .env.docker.example .env.docker -Force
Copy-Item legalflow-backend\.env.postgres.example legalflow-backend\.env -Force

docker compose -f docker-compose.full.yml down
docker compose -f docker-compose.infra.yml down -v
docker compose -f docker-compose.infra.yml up -d

cd legalflow-backend
npm.cmd install
npx.cmd prisma generate
npx.cmd prisma migrate deploy
npx.cmd prisma db seed
npm.cmd run start:dev
```

## 2. Khôi phục Frontend

```powershell
cd C:\Users\Admin\legalflow-docker-uat
npm.cmd install
npm.cmd run dev
```

## 3. Kiểm tra Đăng nhập API (Test Login)

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:3000/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@legalflow.local","password":"change_me_in_local_only"}'
```
