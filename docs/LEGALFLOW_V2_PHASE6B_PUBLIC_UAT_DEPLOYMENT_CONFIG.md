# Phase 6B: Public UAT Deployment Config Preparation & Guide

**Ngày lập tài liệu:** 03/07/2026  
**Phiên bản chuẩn bị:** LegalFlow AI v2.3 (Mốc sau `v2.4.0-public-uat-domain-plan`)  
**Mục tiêu:** Cung cấp tài liệu hướng dẫn và bộ tệp cấu hình mẫu (`docker-compose.uat.yml`, `Caddyfile.uat.example`, `.env.uat.example`) để chuẩn bị sẵn sàng cho việc triển khai hệ thống lên môi trường Public UAT có kiểm soát (`https://uat-legalflow.<domain>`).

---

## 1. Kiến Trúc UAT Public

Hệ thống triển khai theo kiến trúc **Single Domain & Path Routing** trên nền tảng Docker Container, sử dụng Caddy làm Reverse Proxy và tự động hóa quản lý SSL/TLS:

```
[ Người Dùng UAT / Trình Duyệt ]
               │
               ▼  (HTTPS : 443)
    https://uat-legalflow.<domain>
               │
               ▼
[ Caddy Reverse Proxy Container ] ── (Let's Encrypt SSL)
               │
       ┌───────┴────────────────────────┐
       │ Path: /api/*                   │ Path: /*
       ▼                                ▼
[ Backend Container ]            [ Frontend Container ]
 (expose : 3000)                  (expose : 8080)
       │
       ├────────────────────────────────┐
       ▼ (Internal Network Only)        ▼ (Internal Network Only)
[ PostgreSQL Container ]         [ MinIO Container ]
 (expose : 5432 - NO PUBLIC)      (expose : 9000/9001 - NO PUBLIC)
```

### Đặc tính bảo mật cốt lõi:
- **01 Tên miền duy nhất:** Trình duyệt kết nối tới một endpoint duy nhất `https://uat-legalflow.<domain>`.
- **Cô lập hoàn toàn Cơ sở dữ liệu:** PostgreSQL (`5432`) và MinIO (`9000/9001`) chỉ giao tiếp với Backend trong mạng nội bộ `legalflow_uat_network`, không ánh xạ ra Host Public.
- **Triệt tiêu lỗi CORS:** Frontend và Backend dùng chung một origin HTTPS, giao tiếp qua tiền tố `/api`.

---

## 2. Cách Chuẩn Bị Domain / DNS A Record

1. **Đăng nhập vào trang quản trị tên miền** (Cloudflare, Tenten, PA Vietnam, Namecheap...).
2. **Tạo bản ghi DNS mới:**
   - **Loại (Type):** `A`
   - **Tên (Host/Name):** `uat-legalflow` (hoặc subdomain mong muốn).
   - **Giá trị (Points to / IPv4):** `<Địa_chỉ_IP_Public_của_VPS>`
   - **TTL:** `300` giây hoặc `Auto`.
3. **Chế độ Proxy (nếu dùng Cloudflare):**
   - Khuyến nghị chọn **DNS Only (Đám mây màu xám)** trong lần khởi chạy đầu tiên để Caddy tự động xác thực Let's Encrypt thành công 100%.

---

## 3. Cách Chuẩn Bị VPS

1. **Yêu cầu cấu hình tối thiểu:**
   - OS: Ubuntu 22.04 LTS hoặc Debian 12.
   - CPU: 2 vCPU | RAM: 4GB | Disk: 40GB SSD.
2. **Cài đặt Docker & Docker Compose v2:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
3. **Cấu hình Firewall tường lửa (UFW):**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp    # SSH (Khuyến nghị giới hạn IP)
   sudo ufw allow 80/tcp    # HTTP (Phục vụ ACME Challenge)
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

---

## 4. Cách Copy Repo Lên VPS

Từ máy phát triển cá nhân, sao chép mã nguồn lên VPS qua Git hoặc SSH:
```bash
# Cách 1: Clone trực tiếp từ Git repository
ssh user@<IP_VPS>
cd /opt
sudo git clone <URL_REPO_CUA_BAN> legalflow-uat
cd legalflow-uat

# Cách 2: Hoặc rsync từ máy local (không copy node_modules và .git)
rsync -avz --exclude 'node_modules' --exclude '.git' . user@<IP_VPS>:/opt/legalflow-uat/
```

---

## 5. Cách Tạo `.env.uat` Từ `.env.uat.example`

Trên máy chủ VPS, tạo tệp môi trường thực tế từ tệp mẫu:
```bash
cd /opt/legalflow-uat
cp .env.uat.example .env.uat
cp Caddyfile.uat.example Caddyfile.uat
```

Chỉnh sửa nội dung `Caddyfile.uat`:
```bash
nano Caddyfile.uat
# Thay thế uat-legalflow.example.com bằng tên miền thật của bạn
```

Chỉnh sửa nội dung `.env.uat`:
```bash
nano .env.uat
# 1. Cập nhật FRONTEND_URL, BACKEND_URL, CORS_ORIGIN thành tên miền thật
# 2. Thay thế toàn bộ các chuỗi CHANGE_ME bằng mật khẩu bảo mật (POSTGRES_PASSWORD, JWT_SECRET, MINIO_ROOT_PASSWORD)
```

---

## 6. Cách Chạy Docker Compose UAT

Khởi chạy hệ thống UAT bằng Docker Compose với tệp cấu hình chuyên biệt:
```bash
docker compose --env-file .env.uat -f docker-compose.uat.yml up -d --build
```

Kiểm tra trạng thái các container đang hoạt động:
```bash
docker compose --env-file .env.uat -f docker-compose.uat.yml ps
```

---

## 7. Cách Kiểm Tra HTTPS

1. Xem nhật ký hoạt động của Caddy để xác nhận tiến trình cấp chứng chỉ TLS:
   ```bash
   docker logs legalflow_caddy_proxy_uat --tail 50
   ```
   *Tìm dòng log xác nhận: `Successfully obtained certificate`.*
2. Mở trình duyệt truy cập vào địa chỉ `https://uat-legalflow.<domain>`.
3. Kiểm tra biểu tượng **Ổ khóa bảo mật màu xanh**, bấm vào để xác nhận chứng chỉ hợp lệ do Let's Encrypt cấp.

---

## 8. Cách Kiểm Tra Frontend / Backend / API

1. **Frontend:** Mở trình duyệt tải trang chủ `https://uat-legalflow.<domain>`, xác nhận trang đăng nhập tải mượt mà, không có lỗi console tải tài nguyên tĩnh.
2. **Backend Health Check:** Mở tab mới hoặc chạy `curl` kiểm tra endpoint sức khỏe API:
   ```bash
   curl -i https://uat-legalflow.<domain>/api/health
   ```
   *Phản hồi trả về `HTTP/1.1 200 OK` kèm JSON trạng thái.*

---

## 9. Cách Kiểm Tra Không Public PostgreSQL

Xác minh cơ sở dữ liệu hoàn toàn kín đáo, không bị lộ ra mạng Internet công cộng:
```bash
# Từ một máy tính bên ngoài VPS (máy local của bạn), chạy thử kết nối tới cổng 5432 của domain:
nc -zv uat-legalflow.<domain> 5432
# Hoặc: telnet uat-legalflow.<domain> 5432
```
👉 **Kết quả mong đợi:** `Connection refused` hoặc `Operation timed out`.  
*(Kiểm tra tương tự với cổng `9000` và `9001` của MinIO).*

---

## 10. Cách Kiểm Tra CORS

Kiểm tra chính sách bảo mật CORS từ xa thông qua cờ `-H "Origin: ..."`:
```bash
# 1. Thử gửi request với Origin hợp lệ (đúng domain UAT)
curl -I -X OPTIONS https://uat-legalflow.<domain>/api/auth/login \
  -H "Origin: https://uat-legalflow.<domain>" \
  -H "Access-Control-Request-Method: POST"

# 2. Thử gửi request với Origin giả mạo/không hợp lệ
curl -I -X OPTIONS https://uat-legalflow.<domain>/api/auth/login \
  -H "Origin: https://attacker-website.com" \
  -H "Access-Control-Request-Method: POST"
```
👉 **Kết quả mong đợi:** Request hợp lệ trả về header `Access-Control-Allow-Origin: https://uat-legalflow.<domain>`. Request giả mạo **hoàn toàn không trả về** header cho phép CORS.

---

## 11. Cách Backup Database Trước / Sau Deploy

Để thực hiện sao lưu toàn bộ dữ liệu hồ sơ UAT ra tệp `.sql`:
```bash
# Backup cơ sở dữ liệu UAT
docker exec -t legalflow_postgres_uat pg_dump -U postgres legalflow_uat > backup_uat_$(date +%Y%m%d_%H%M%S).sql
```

Để phục hồi dữ liệu từ tệp backup `.sql`:
```bash
cat backup_uat_YYYYMMDD_HHMMSS.sql | docker exec -i legalflow_postgres_uat psql -U postgres legalflow_uat
```

---

## 12. Cách Rollback Về Tag Ổn Định

Trong trường hợp đợt triển khai UAT gặp sự cố nghiêm trọng cần khôi phục về mốc ổn định trước đó:
```bash
# 1. Dừng cụm container UAT hiện tại
docker compose --env-file .env.uat -f docker-compose.uat.yml down

# 2. Checkout mã nguồn về mốc tag ổn định đã được kiểm chứng
git fetch --tags
git checkout v2.4.0-public-uat-domain-plan

# 3. Khôi phục lại database từ bản backup trước deploy (nếu cần)
# 4. Rebuild và khởi động lại dịch vụ
docker compose --env-file .env.uat -f docker-compose.uat.yml up -d --build
```

---

## 13. Checklist Bảo Mật Trước Khi Public UAT

Trước khi chính thức mở kết nối cho cán bộ nghiệp vụ vào test:
- [ ] **Secret Kiểm Tra:** Tệp `.env.uat` đã được điền mật khẩu mạnh ngẫu nhiên cho DB, JWT và MinIO (không dùng `admin123` hay mật khẩu mặc định).
- [ ] **Git Tracking:** Chạy lệnh `git status` đảm bảo tệp `.env.uat` và `Caddyfile.uat` thực tế không bị tracking vào Git.
- [ ] **Port Exposure:** Lệnh `docker ps` xác nhận container Postgres và MinIO không có ánh xạ `0.0.0.0:5432->5432/tcp`.
- [ ] **Admin Password Seed:** Mật khẩu của tài khoản `admin@legalflow.vn` đã được đổi ngay sau lần khởi chạy đầu tiên.
- [ ] **CORS Verification:** CORS không được cấu hình dạng wildcard (`*`).

---

## 14. Checklist Test Sau Deploy

Sau khi hệ thống đã lên sóng thành công tại `https://uat-legalflow.<domain>`:
- [ ] **UI & Auth:** Đăng nhập thành công bằng tài khoản UAT, thao tác mượt mà trên cả giao diện Desktop và Mobile.
- [ ] **AI Assistant:** Khối Trợ lý AI thực hiện tóm tắt, phân loại và gợi ý checklist nhanh chóng.
- [ ] **AI Drafting:** Soạn thảo thành công 6 mẫu văn bản dự thảo, lưu vào `CaseNote`.
- [ ] **Xuất Word (`.docx`):** Bấm "Tải Word" stream file về máy, mở lên hiển thị đúng cấu hình cơ quan từ biến môi trường Phase 5C.
- [ ] **Xem trước & In PDF:** Bấm "Xem & In PDF" hiển thị modal A4, lệnh `window.print()` hoạt động hoàn hảo.
- [ ] **Audit Logging:** Bảng kiểm toán `AiAuditLog` ghi nhận chính xác 100% các thao tác quan trọng.
- [ ] **Data Integrity:** Trạng thái hồ sơ (`status`) và người thụ lý (`assignedToId`) giữ nguyên bất biến.
