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

---

## 4. Đổi Mật Khẩu Admin Local An Toàn (`reset-admin-password.ts`)

Trong quá trình phát triển cục bộ (Local Development), nếu mật khẩu cũ bị lộ trong log hoặc cần thay đổi, bạn có thể sử dụng kịch bản chuyên dụng `legalflow-backend/scripts/reset-admin-password.ts` mà không làm mất dữ liệu hiện có.

> [!WARNING]
> **Nguyên Tắc Bảo Mật Bắt Buộc:**
> - **Chỉ dùng cho Local Development:** Kịch bản này được thiết kế dành riêng cho môi trường phát triển cục bộ.
> - **Không hardcode vào Git:** Tuyệt đối không ghi chết (hardcode) mật khẩu thật vào bất kỳ file source code hay script nào trước khi commit.
> - **Đăng xuất / Đăng nhập lại:** Sau khi đổi mật khẩu thành công, bạn cần nhấn **Đăng xuất (Logout)** trên trình duyệt hoặc xóa token cũ để tiến hành đăng nhập lại bằng mật khẩu mới.

### Cách 1: Chạy Tương Tác trực tiếp trên Terminal (Ưu tiên khuyên dùng)
Cách này đảm bảo mật khẩu không bị lưu vào lịch sử lệnh shell:
```powershell
cd C:\Users\Admin\legalflow-docker-uat\legalflow-backend
npx ts-node scripts/reset-admin-password.ts
```
*Hệ thống sẽ hỏi email (mặc định `admin@legalflow.local`) và yêu cầu bạn gõ mật khẩu mới trực tiếp vào màn hình.*

### Cách 2: Truyền qua Biến môi trường (`NEW_ADMIN_PASSWORD`)
Phù hợp khi cần viết script tự động hóa trong môi trường local:
```powershell
cd C:\Users\Admin\legalflow-docker-uat\legalflow-backend

# Thiết lập biến môi trường tạm thời
$env:NEW_ADMIN_PASSWORD = "MatKhauMoiCuaBan@2026!"
npx ts-node scripts/reset-admin-password.ts

# Xóa biến môi trường ngay sau khi chạy xong để bảo mật
Remove-Item Env:\NEW_ADMIN_PASSWORD
```
