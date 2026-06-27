# Cẩm nang Vận hành và Bảo mật LegalFlow (RUNBOOK)

> [!IMPORTANT]
> **Khôi phục Nhanh Môi trường Local**: Nếu bạn đang cài đặt lại dự án trên máy mới hoặc khôi phục hạ tầng từ đầu, vui lòng xem hướng dẫn lệnh chuẩn tại [docs/LOCAL_RESTORE_QUICKSTART.md](file:///c:/Users/Admin/legalflow-docker-uat/docs/LOCAL_RESTORE_QUICKSTART.md).

Tài liệu này cung cấp hướng dẫn từng bước và toàn diện cho các quản trị viên để cài đặt, cấu hình, vận hành và bảo mật kiến trúc chính thức **LegalFlow (PostgreSQL & MinIO Docker)** trên môi trường Windows.

---

## Kiến trúc Môi trường Chuẩn (Local & UAT)

> [!WARNING]
> **LƯU Ý KIẾN TRÚC QUAN TRỌNG**:
> - **PostgreSQL Docker** là hệ quản trị cơ sở dữ liệu chuẩn duy nhất (`legalflow_postgres:5432`). Đã loại bỏ hoàn toàn SQLite.
> - **MinIO Docker** là chuẩn lưu trữ tài liệu đối tượng S3 (`legalflow_minio:9000`).
> - Cấu hình hạ tầng local được khởi tạo tự động bằng lệnh `docker compose -f docker-compose.infra.yml up -d`.
> - Không expose trực tiếp cổng database và storage ra mạng công cộng mà không có lớp bảo mật hoặc VPN.
> - Trước khi triển khai Public Trial / UAT, rà soát kỹ các checklist bảo mật trong `docs/`.

---

## 1. Yêu cầu Hệ thống
Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Node.js**: Phiên bản khuyến nghị v24+ (được kiểm thử trên v24.15.0)
- **npm**: Đi kèm sẵn với Node.js
- **Git**: Dùng để quản lý mã nguồn
- **Windows Shell**: PowerShell (Khuyên dùng) hoặc Command Prompt (CMD)

---

## 2. Thiết lập Biến môi trường (.env)

Trước khi khởi chạy hệ thống, bạn cần khởi tạo cấu hình môi trường từ các tệp mẫu chuẩn.

### 2.1. Cấu hình Hạ tầng Docker (.env.docker)
Tại thư mục gốc, sao chép cấu hình hạ tầng từ tệp mẫu:
```powershell
Copy-Item .env.docker.example .env.docker -Force
```

### 2.2. Cấu hình Backend (PostgreSQL & MinIO)
Di chuyển vào thư mục `legalflow-backend/` và sao chép cấu hình mẫu chuẩn Postgres:
```powershell
cd legalflow-backend
Copy-Item .env.postgres.example .env -Force
```
Tệp cấu hình `.env` chuẩn bao gồm các thông số kết nối chính:
```env
DATABASE_URL="postgresql://legalflow_admin:change_me_in_local_only@127.0.0.1:5432/legalflow_prod?schema=public"
JWT_SECRET=legalflow_local_dev_secret_2026_change_later
FRONTEND_ORIGIN=http://localhost:5173

MINIO_ENDPOINT=http://127.0.0.1:9000
MINIO_ACCESS_KEY=admin_minio
MINIO_SECRET_KEY=change_me_in_local_only
MINIO_BUCKET=legalflow-docs
```

---

## 3. Khởi chạy Hạ tầng và Ứng dụng

### 3.1. Khởi chạy Hạ tầng Docker (Postgres & MinIO)
Mở PowerShell tại thư mục gốc và bật các container dịch vụ nền:
```powershell
docker compose -f docker-compose.infra.yml up -d
```

### 3.2. Khởi chạy Backend & Seed dữ liệu
Di chuyển vào `legalflow-backend/`, cài đặt thư viện và khởi tạo DB:
```powershell
cd legalflow-backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```
Backend mặc định chạy tại địa chỉ `http://localhost:3000/`.

### 3.3. Khởi chạy Frontend
Mở một cửa sổ PowerShell mới tại thư mục gốc:
```powershell
npm install
npm run dev
```
Frontend giao diện mặc định chạy tại `http://localhost:5173/`.

---

## 4. Cơ chế Thay đổi Mật khẩu Seed và Cấu hình Security Hardening

### 4.1. Thay đổi Mật khẩu Seed Tài khoản Mẫu
Thay vì cấu hình cứng, mật khẩu của 4 tài khoản seed mẫu được quản lý động qua biến môi trường của backend:
1. Mở file `legalflow-backend/.env`.
2. Thay đổi các giá trị `SEED_ADMIN_PASSWORD`, `SEED_MANAGER_PASSWORD`, `SEED_STAFF_PASSWORD`, `SEED_VIEWER_PASSWORD` sang mật khẩu mạnh mới của bạn.
3. Chạy lệnh seed để cập nhật trực tiếp vào cơ sở dữ liệu hiện hành mà không làm mất các hồ sơ khác:
   ```powershell
   npx prisma db seed
   ```
   *Lưu ý: Script seed được giới hạn nghiêm ngặt chỉ cập nhật thông tin và mật khẩu cho đúng 4 tài khoản seed mặc định này, bảo vệ các tài khoản khác.*

### 4.2. Đổi JWT Secret
1. Tạo một chuỗi ký tự ngẫu nhiên, ví dụ bằng lệnh Node.js sau:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Thay thế giá trị của `JWT_SECRET` trong `legalflow-backend/.env` bằng chuỗi vừa sinh.
3. Restart lại backend để cấu hình mới có hiệu lực.

### 4.3. CORS Security Safeguard
Backend được lập trình để phát hiện nếu quản trị viên cấu hình `FRONTEND_ORIGIN="*"` (CORS wildcard).
- Nếu phát hiện CORS wildcard, backend sẽ in thông báo cảnh báo màu vàng nổi bật tại màn hình console khởi chạy.
- Khuyến nghị: Luôn để `FRONTEND_ORIGIN="http://localhost:5173"` trong đợt chạy thử nội bộ này.

---

## 5. Hướng dẫn Sao lưu dữ liệu an toàn (PostgreSQL Dump)

Hệ thống sử dụng cơ sở dữ liệu PostgreSQL container hóa. Dữ liệu được lưu giữ an toàn trong volume Docker `postgres_data`.

### Sao lưu bằng pg_dump
Để tạo bản sao lưu toàn bộ cơ sở dữ liệu ra tệp `.sql`, chạy lệnh sau từ terminal:
```powershell
docker exec -t legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod > backup_postgres_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

---

## 6. Hướng dẫn Phục hồi dữ liệu (PostgreSQL Restore)

Để khôi phục dữ liệu từ tệp bản sao lưu `.sql` vào container PostgreSQL:
```powershell
Get-Content backup_postgres_YYYYMMDD_HHMMSS.sql | docker exec -i legalflow_postgres psql -U legalflow_admin -d legalflow_prod
```
*Lưu ý: Trước khi khôi phục, đảm bảo container `legalflow_postgres` đang chạy ổn định.*

---

## 7. Khôi phục trắng (Reset Database & Volume)

Trong trường hợp môi trường thử nghiệm bị lỗi hoặc muốn dọn dẹp làm lại từ đầu:
```powershell
docker compose -f docker-compose.infra.yml down -v
docker compose -f docker-compose.infra.yml up -d
cd legalflow-backend
npx prisma migrate deploy
npx prisma db seed
```

---

## 8. Xử lý sự cố thường gặp (Troubleshooting)

### 8.1. Lỗi cổng 3000 / 5173 bị chiếm dụng trên Windows
Nếu server không khởi động được do cổng bị chiếm dụng, hãy xử lý theo các bước:

**Cách 1: Sử dụng PowerShell (Khuyên dùng)**
1. Tìm ID tiến trình (PID) đang chạy trên cổng bị chiếm:
   ```powershell
   Get-NetTCPConnection -LocalPort 3000
   ```
2. Giải phóng cổng bằng cách đóng tiến trình cưỡng bức:
   ```powershell
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
   ```
   *(Thay 3000 bằng 5173 đối với cổng của frontend)*

**Cách 2: Sử dụng Command Prompt (CMD) truyền thống**
1. Tìm ID tiến trình (PID) chiếm cổng:
   ```cmd
   netstat -ano | findstr :3000
   ```
   *Cột cuối cùng hiển thị số PID (Ví dụ: `12456`)*
2. Giải phóng cổng bằng lệnh taskkill:
   ```cmd
   taskkill /PID 12456 /F
   ```

### 8.2. Lỗi kết nối Cơ sở dữ liệu hoặc MinIO Storage
- **Nguyên nhân**: Container Docker chưa khởi chạy hoặc bị dừng do lỗi tài nguyên/cổng.
- **Cách khắc phục**: Kiểm tra trạng thái container bằng lệnh `docker ps`. Nếu dịch vụ chưa chạy, khởi động lại hạ tầng bằng lệnh `docker compose -f docker-compose.infra.yml up -d`.

---

## 9. Hướng dẫn Vận hành Quản lý Người dùng (Phase 4.1)

Tính năng **Quản lý người dùng** được giới hạn nghiêm ngặt và chỉ hiển thị/cho phép truy cập đối với tài khoản có vai trò `ADMIN`.

### 9.1. Phân quyền và Bảo mật Trang Quản trị
- **Sidebar**: Mục menu "Quản lý tài khoản" chỉ hiển thị với vai trò `ADMIN`.
- **Bảo vệ Route**: Nếu bất kỳ tài khoản nào có vai trò `MANAGER`, `STAFF`, hoặc `VIEWER` cố tình truy cập vào `/users` bằng cách nhập trực tiếp URL, hệ thống sẽ tự động chặn và redirect về `/dashboard` lập tức nhờ `ProtectedRoute` kết hợp danh sách `allowedRoles: ['ADMIN']`.
- **JWT Hardening**: Cơ chế JWT Strategy trên Backend thực hiện truy vấn trực tiếp Database trên mỗi request để xác thực trạng thái `isActive` và vai trò `role` hiện tại. Nếu tài khoản bị khóa (`isActive: false`) hoặc vai trò bị thay đổi, hành động tiếp theo của tài khoản đó sẽ lập tức áp dụng quyền mới mà không cần đợi Token JWT cũ hết hạn.

### 9.2. Quy trình Thêm người dùng mới
1. Admin đăng nhập và truy cập trang **Quản lý tài khoản** (`/users`).
2. Bấm nút **Tạo tài khoản mới** để mở modal form.
3. Nhập đầy đủ thông tin: Email, Họ và tên, Vai trò và **Mật khẩu tạm thời**.
   - *Lưu ý*: Mật khẩu tạm thời do Admin tự nhập thủ công (tối thiểu 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt). Hệ thống cung cấp panel kiểm tra độ phức tạp của mật khẩu thời gian thực (live validation).
   - Hệ thống normalizes email thành chữ thường và trim khoảng trắng (`trim().toLowerCase()`) để đảm bảo không trùng lặp.
4. Bấm **Lưu tài khoản**. Hệ thống sẽ mã hóa mật khẩu bằng `bcrypt` trước khi lưu và ghi nhận hành động vào console log của Backend (`[CREATE_USER]`). Mật khẩu tạm thời sẽ được ẩn đi ngay sau khi lưu để bảo mật thông tin.
5. Admin tự gửi mật khẩu tạm này cho người dùng qua các kênh trao đổi an toàn riêng biệt.

### 9.3. Đặt lại Mật khẩu tạm thời (Reset Password)
1. Trong danh sách người dùng, bấm nút biểu tượng **Chìa khóa** (`KeyRound`) tại hàng của người dùng cần đặt lại mật khẩu.
2. Nhập mật khẩu tạm thời mới thỏa mãn đầy đủ các tiêu chuẩn bảo mật tối thiểu 8 ký tự.
3. Xác nhận cập nhật. Backend sẽ băm (hash) mật khẩu mới và ghi nhận log `[RESET_PASSWORD]`.
4. Người dùng sử dụng mật khẩu mới để đăng nhập.

### 9.4. Tạm khóa/Mở khóa người dùng
1. Bấm nút biểu tượng **Khóa/Mở khóa** (`Lock`/`Unlock`) tại hàng của người dùng.
2. Xác nhận tại pop-up cảnh báo.
3. **Cơ chế Bảo vệ đặc biệt**:
   - Quản trị viên **không thể tự khóa tài khoản của chính mình**. Nút khóa trên dòng của bản thân sẽ bị vô hiệu hóa (disabled).
   - **Tài khoản ADMIN duy nhất còn hoạt động** trên hệ thống sẽ bị chặn không cho khóa hoặc chuyển vai trò sang vai trò thấp hơn nhằm tránh tình trạng hệ thống mất đi quyền Admin điều hành tối cao.

### 9.5. Xóa tài khoản vĩnh viễn (Hard Delete)
- **Ràng buộc an toàn dữ liệu**: Hệ thống chỉ cho phép xóa cứng các tài khoản chưa thực hiện bất kỳ hoạt động nghiệp vụ nào có liên kết dữ liệu trong 4 bảng: `LegalCase`, `CaseNote`, `CaseHistory`, `CaseChecklistItem`.
- Nếu tài khoản đã có dữ liệu liên kết, API sẽ lập tức trả về mã lỗi `409 Conflict`. Trình duyệt sẽ hiển thị cảnh báo dễ hiểu: *"Không thể xóa tài khoản này vì đã có dữ liệu nghiệp vụ liên kết. Hãy khóa tài khoản thay thế."*
- Admin được khuyên dùng tính năng **Khóa tài khoản** để chặn truy cập nhưng vẫn bảo toàn tính toàn vẹn của lịch sử nghiệp vụ.
- Admin không thể tự xóa tài khoản của chính mình hoặc xóa tài khoản ADMIN duy nhất còn lại trên hệ thống.

---

## 10. Hướng dẫn Tự Đổi Mật Khẩu và Quản Lý Hồ Sơ (Phase 4.2)

Hệ thống cho phép tất cả người dùng đang hoạt động (không phân biệt vai trò) tự xem thông tin cá nhân và thay đổi mật khẩu của chính mình để bảo mật tài khoản.

### 10.1. Xem thông tin Hồ sơ cá nhân (My Profile)
- Người dùng truy cập menu **Cài đặt** trên thanh điều hướng (hoặc truy cập đường dẫn `/settings`).
- Chọn tab **Tài khoản của tôi** để xem các thông tin chi tiết:
  - **Họ và tên**: Tên hiển thị đầy đủ trên hệ thống.
  - **Địa chỉ Email**: Email tài khoản dùng để đăng nhập.
  - **Vai trò**: Quyền hạn hiện hành (`ADMIN`/`MANAGER`/`STAFF`/`VIEWER`).
  - **Trạng thái**: Tình trạng hoạt động thời gian thực.
- Toàn bộ thông tin này được lấy trực tiếp từ JWT Token đã được xác thực an toàn thông qua API `/auth/profile` hoặc `/auth/me`.

### 10.2. Quy trình Tự Đổi Mật Khẩu
1. Tại tab **Tài khoản của tôi**, di chuyển đến khu vực **Đổi mật khẩu tài khoản**.
2. Nhập các trường thông tin:
   - **Mật khẩu hiện tại**: Phải khớp chính xác với mật khẩu hiện tại (xác thực bằng `bcrypt.compare` phía máy chủ).
   - **Mật khẩu mới**: Phải đạt các tiêu chuẩn an toàn bắt buộc:
     - Độ dài tối thiểu **8 ký tự**.
     - Có ít nhất 1 chữ viết hoa (`A-Z`).
     - Có ít nhất 1 chữ viết thường (`a-z`).
     - Có ít nhất 1 chữ số (`0-9`).
     - Có ít nhất 1 ký tự đặc biệt (`@$!%*?&#`).
     - *Lưu ý*: Mật khẩu mới không được trùng khớp hoàn toàn với mật khẩu hiện tại.
   - **Xác nhận mật khẩu mới**: Phải trùng khớp 100% với mật khẩu mới đã nhập.
3. **Tiện ích Hỗ trợ**:
   - Sử dụng biểu tượng **Mắt ẩn/hiện** ở góc phải mỗi trường để kiểm tra ký tự đã nhập.
   - Theo dõi **Bảng tiêu chuẩn mật khẩu bảo mật (Real-time Checklist)**: Các tiêu chí sẽ tự động chuyển màu xanh lá cây kèm dấu check (`✓`) khi mật khẩu nhập vào đạt yêu cầu, giúp người dùng dễ dàng kiểm soát độ phức tạp.
4. Bấm nút **Cập nhật mật khẩu mới**.
5. **Cơ chế Hủy phiên và Đăng xuất tự động**:
   - Sau khi Backend xử lý đổi mật khẩu thành công và trả về mã `200 OK`, Frontend sẽ hiển thị thông điệp thành công.
   - Hệ thống trì hoãn **đúng 1.5 giây** để người dùng đọc thông tin, sau đó gọi phương thức `logout()` của `AuthContext`.
   - Token truy cập (`lf_access_token`) sẽ bị xóa sạch khỏi `sessionStorage`, phiên làm việc cũ kết thúc ngay lập tức.
   - Người dùng được chuyển hướng về màn hình `/login` để thực hiện đăng nhập lại bằng mật khẩu mới.
   - Ghi nhận Audit Log phía Backend: `[CHANGE_PASSWORD] User (email) changed password successfully` (Tuyệt đối không log thông tin clear-text của mật khẩu cũ/mới).


### Xử lý Lỗi Rate Limiting (HTTP 429)
- Khi người dùng báo lỗi *"Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau ít phút."*, nghĩa là họ đã gọi quá 5 request login/đổi mật khẩu trong 1 phút.
- **Khắc phục**: Người dùng chỉ cần chờ 60 giây và thử lại. Backend không khóa vĩnh viễn tài khoản trong cơ sở dữ liệu.
- **Log**: Lỗi 429 được ghi nhận ở Server Console (`RATE_LIMIT_HIT`), không lưu vào bảng AdminAuditLog. 

---

## 11. Checklist Kiểm thử sau Phục hồi (Post-Restoration Checklist)

Để đảm bảo hệ thống đã phục hồi trọn vẹn và sẵn sàng hoạt động sau khi cài đặt trên máy mới, hãy tuần tự thực hiện các bước kiểm tra sau:

- [ ] **1. Kiểm tra Hạ tầng Docker**: Đảm bảo container `legalflow_postgres`, `legalflow_minio` và `legalflow_caddy` đều có trạng thái `Up` (kiểm tra bằng `docker ps`).
- [ ] **2. Kiểm tra Đăng nhập & Xác thực JWT**: Truy cập `http://localhost:5173/login`, đăng nhập thành công bằng tài khoản `admin@legalflow.local` và mật khẩu trong `.env`.
- [ ] **3. Kiểm tra Duy trì Phiên làm việc**: Làm mới trang (F5) tại `/dashboard` và xác minh không bị văng ra trang đăng nhập.
- [ ] **4. Kiểm tra Quản lý Người dùng & RBAC**: Vào menu **Quản lý tài khoản**, thử tạo mới một người dùng thử nghiệm và kiểm tra quyền truy cập tương ứng.
- [ ] **5. Kiểm tra Tải lên Tài liệu MinIO**: Vào nghiệp vụ quản lý tài liệu, thử tải lên 1 tệp PDF thử nghiệm và bấm tải về để xác minh kết nối cổng `9000`.
- [ ] **6. Kiểm tra Endpoint Metrics**: Gửi request tới `GET http://127.0.0.1:3000/metrics` kèm header `x-internal-metrics-token` để đảm bảo hệ thống giám sát Prometheus nhận dữ liệu.
