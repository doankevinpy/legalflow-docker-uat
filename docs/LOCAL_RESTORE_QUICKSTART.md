# Khôi phục Nhanh Môi trường Local Docker PostgreSQL (LOCAL_RESTORE_QUICKSTART)

Dưới đây là các bước hướng dẫn chuẩn để khôi phục và vận hành hệ thống LegalFlow cục bộ trên máy mới.

---

## Cách 1: Sử dụng Bộ Script Tự động Chuẩn (Khuyên dùng)

Hệ thống cung cấp sẵn bộ script tự động hóa trong thư mục `scripts/` giúp thao tác chỉ với 1 lệnh duy nhất:

### 1. Khởi chạy toàn bộ hệ thống (Hạ tầng + Backend + Frontend)
Mở PowerShell tại thư mục gốc của dự án và chạy:
```powershell
.\scripts\start-legalflow.ps1
```
Script sẽ tự động kiểm tra biến môi trường, bật container Docker (Postgres, MinIO, Caddy), chạy migration/seed DB và mở 2 cửa sổ chạy Backend (`3000`) & Frontend (`5173`).

### 2. Kiểm tra sức khỏe hệ thống
Để kiểm tra toàn diện tình trạng hoạt động của các dịch vụ:
```powershell
.\scripts\health-check.ps1
```

### 3. Dừng toàn bộ hệ thống
Để tắt sạch các tiến trình Node và container Docker:
```powershell
.\scripts\stop-legalflow.ps1
```

---

## Cách 2: Chạy Thủ công từng bước

Nếu bạn muốn kiểm soát chi tiết hoặc gõ lệnh thủ công từng bước:

### 1. Khôi phục Hạ tầng & Backend
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

### 2. Khôi phục Frontend
```powershell
cd C:\Users\Admin\legalflow-docker-uat
npm.cmd install
npm.cmd run dev
```

### 3. Kiểm tra Đăng nhập API (Test Login)
```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:3000/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@legalflow.local","password":"change_me_in_local_only"}'
```
