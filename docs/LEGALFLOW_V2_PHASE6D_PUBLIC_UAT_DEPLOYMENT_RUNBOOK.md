# Phase 6D: Public UAT Domain Deployment Runbook

**Ngày phát hành tài liệu:** 03/07/2026  
**Phiên bản chuẩn đích:** LegalFlow AI v2.3 (Mốc kế thừa `v2.4.2-public-uat-security-hardening`)  
**Tài liệu hướng dẫn thao tác triển khai thực tế (Runbook) hệ thống LegalFlow lên môi trường Public UAT có kiểm soát.**

---

## 1. Mục Tiêu Phase 6D

Tài liệu Runbook này định nghĩa chuẩn mực quy trình thao tác kỹ thuật từng bước (Step-by-Step) để thực thi triển khai hệ thống LegalFlow AI lên máy chủ đám mây (VPS/Public Server) có kết nối Internet công cộng với tên miền HTTPS bảo mật (`uat-legalflow.example.com`).

**Khẳng định nguyên tắc:** Đây là môi trường phục vụ kiểm thử chấp nhận người dùng (UAT) nâng cao và trình diễn (Demo) có kiểm soát cho các đơn vị cấp xã/phường, **hoàn toàn không phải là môi trường Production ban hành chính thức**. Toàn bộ quy trình tuân thủ triệt để các tiêu chuẩn bảo mật đã thiết lập tại Phase 6B và Phase 6C.

---

## 2. Điều Kiện Tiên Quyết (Prerequisites)

Trước khi bắt đầu thực hiện thao tác theo Runbook, quản trị viên hệ thống cần xác nhận đáp ứng đầy đủ 8 điều kiện tiên quyết:
- [ ] **Sở hữu tên miền:** Đã có quyền quản trị tên miền hoặc subdomain chuyên biệt cho đợt UAT (ví dụ: `uat-legalflow.example.com`).
- [ ] **Bản ghi DNS:** Đã khởi tạo bản ghi DNS A Record trỏ subdomain về địa chỉ IPv4 Public của máy chủ VPS.
- [ ] **Hạ tầng máy chủ VPS:** Máy chủ VPS (Ubuntu 22.04 LTS / Debian 12) đã cài đặt sẵn Docker Engine và Docker Compose v2.
- [ ] **Quyền truy cập:** Có quyền truy cập SSH (ưu tiên qua SSH Key Pair) vào tài khoản có thẩm quyền quản trị `sudo` hoặc `root` trên VPS.
- [ ] **Mã nguồn chuẩn mực:** Mã nguồn dự án đã được gắn tag ổn định tại mốc `v2.4.2-public-uat-security-hardening`.
- [ ] **Bảo mật tài khoản:** Đã chuẩn bị phương án đổi mật khẩu quản trị viên mặc định (`admin@legalflow.vn`) ngay sau khi seed CSDL.
- [ ] **Dữ liệu kiểm thử:** Đã chuẩn bị sẵn tập dữ liệu đơn thư mẫu giả định (hoặc dữ liệu đã ẩn danh hóa PII 100%).
- [ ] **An toàn dữ liệu:** Đã thực hiện sao lưu (backup) cơ sở dữ liệu hiện tại (nếu VPS đang chứa dữ liệu cũ cần giữ lại).

---

## 3. Sơ Đồ Kiến Trúc Triển Khai

Hệ thống vận hành theo kiến trúc cô lập mạng nhiều lớp (Multi-layer Network Isolation):

```
[ Người Dùng UAT / Trình Duyệt ]
               │
               ▼  (HTTPS : 443 - TLS 1.3 Auto Cert)
    https://uat-legalflow.example.com
               │
               ▼
[ Caddy Reverse Proxy Container ] (Port 80/443 Public)
               │
       ┌───────┴────────────────────────┐
       │ Path: /api/*                   │ Path: /*
       ▼                                ▼
[ Backend Container ]            [ Frontend Container ]
 (expose: 3000 - Private Net)     (expose: 8080 - Private Net)
       │
       ├────────────────────────────────┐
       ▼                                ▼
[ PostgreSQL Container ]         [ MinIO Container ]
 (expose: 5432 - NO PUBLIC)       (expose: 9000/9001 - NO PUBLIC)
```

---

## 4. Checklist Chuẩn Bị DNS

Thao tác cấu hình tại bảng điều khiển nhà cung cấp tên miền:
1. **Tạo bản ghi A Record:**
   - Name: `uat-legalflow`
   - Type: `A`
   - Value: `<IPv4_Public_của_VPS>`
   - TTL: `300` (5 phút).
2. **Lưu ý cấu hình Cloudflare:** Nếu tên miền được quản lý trên Cloudflare, hãy chuyển trạng thái sang **DNS Only (Đám mây màu xám - Proxy Off)** trong lần khởi chạy đầu tiên. Điều này giúp Caddy hoàn tất quá trình xác thực Let's Encrypt TLS-ALPN-01 dễ dàng nhất.
3. **Kiểm tra lan truyền DNS (DNS Propagation):**
   Mở terminal tại máy local chạy lệnh:
   ```bash
   nslookup uat-legalflow.example.com
   # Hoặc: dig +short uat-legalflow.example.com
   ```
   *Xác nhận địa chỉ IP trả về khớp chính xác 100% với IP của VPS.*

---

## 5. Checklist Chuẩn Bị VPS

Khởi tạo môi trường trên máy chủ VPS từ terminal:
```bash
# 1. Cập nhật hệ điều hành
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt Docker & Docker Compose v2 (nếu chưa cài)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Tạo thư mục chứa ứng dụng và gán quyền
sudo mkdir -p /opt/legalflow-uat
sudo chown -R $USER:$USER /opt/legalflow-uat
cd /opt/legalflow-uat

# 4. Clone repository mã nguồn
git clone <URL_GIT_REPOSITORY_CUA_BAN> .

# 5. Checkout về mốc tag ổn định đã nghiệm thu
git fetch --tags
git checkout v2.4.2-public-uat-security-hardening

# 6. Kiểm tra trạng thái Git
git status
```

---

## 6. Chuẩn Bị Biến Môi Trường (`.env.uat`)

Tại thư mục gốc dự án trên VPS, khởi tạo tệp cấu hình môi trường:
```bash
cp .env.uat.example .env.uat
nano .env.uat
```

**Thực hiện chỉnh sửa và điền các thông số bắt buộc:**
- Thay thế toàn bộ các từ khóa `CHANGE_ME` bằng mật khẩu ngẫu nhiên độ phức tạp cao (sử dụng công cụ tạo mật khẩu hoặc `openssl rand -base64 32`).
- Cấu hình chuẩn tên miền UAT:
  ```env
  NODE_ENV=production
  FRONTEND_URL=https://uat-legalflow.example.com
  BACKEND_URL=https://uat-legalflow.example.com/api
  CORS_ORIGIN=https://uat-legalflow.example.com
  VITE_API_URL=/api
  ```
- Khóa bảo mật JWT & Database:
  ```env
  JWT_SECRET=<Chuỗi_Ngẫu_Nhiên_Mạnh_Tối_Thiểu_32_Ký_Tự>
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=<Mật_Khẩu_Database_Siêu_Bảo_Mật>
  POSTGRES_DB=legalflow_uat
  DATABASE_URL=postgresql://postgres:<Mật_Khẩu_Database_Siêu_Bảo_Mật>@postgres:5432/legalflow_uat?schema=public
  ```
- Khóa bảo mật MinIO:
  ```env
  MINIO_ROOT_USER=admin
  MINIO_ROOT_PASSWORD=<Mật_Khẩu_MinIO_Siêu_Bảo_Mật>
  MINIO_BUCKET=legalflow-documents
  ```
- Cấu hình thông tin cơ quan Phase 5C:
  ```env
  AGENCY_PARENT_NAME=UBND HUYỆN BÌNH CHÁNH (UAT DEMO)
  AGENCY_NAME=UBND XÃ BÌNH MINH (UAT DEMO)
  AGENCY_LOCATION=Bình Minh
  AGENCY_SIGNER_TITLE=TM. ỦY BAN NHÂN DÂN\nCHỦ TỊCH
  AGENCY_SIGNER_NAME=Nguyễn Văn A
  AGENCY_DOC_PREFIX=/QĐ-UBND
  AGENCY_DEFAULT_RECIPIENTS=- Như trên;,- Thanh tra huyện;,- Lưu: VT, Hồ sơ.
  ```

> [!WARNING]
> **BẢO MẬT TUYỆT ĐỐI:** Tệp `.env.uat` chứa mật khẩu thực tế, chỉ được phép lưu cục bộ trên máy chủ VPS (`chmod 600 .env.uat`). **TUYỆT ĐỐI KHÔNG COMMIT HOẶC PUSH TỆP NÀY LÊN GIT REPOSITORY.**

---

## 7. Chuẩn Bị Cấu Hình Reverse Proxy (`Caddyfile`)

Khởi tạo tệp cấu hình Caddy thực tế từ mẫu:
```bash
cp Caddyfile.uat.example Caddyfile
nano Caddyfile
```

**Thực hiện thay thế tên miền:** Thay thế toàn bộ từ khóa placeholder `uat-legalflow.example.com` thành tên miền thật của bạn:
```caddy
uat-legalflow.example.com {
    encode gzip zstd

    handle /api/metrics* {
        respond 403
    }

    handle_path /api/* {
        reverse_proxy backend:3000
    }

    handle /* {
        reverse_proxy frontend:8080
    }

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
}
```

---

## 8. Chuỗi Lệnh Triển Khai Thực Tế

Khởi chạy hệ thống bằng cụm lệnh chuẩn xác:

```bash
# 1. Kiểm tra tính hợp lệ cú pháp của cấu hình Docker Compose
docker compose --env-file .env.uat -f docker-compose.uat.yml config

# 2. Rebuild các container (Frontend, Backend) và khởi chạy ngầm (-d)
docker compose --env-file .env.uat -f docker-compose.uat.yml up -d --build

# 3. Kiểm tra trạng thái danh sách container vừa khởi chạy
docker compose --env-file .env.uat -f docker-compose.uat.yml ps

# 4. Kiểm tra nhật ký Caddy để theo dõi quá trình cấp chứng chỉ HTTPS Let's Encrypt
docker logs legalflow_caddy_proxy_uat -f
```
*(Bấm `Ctrl+C` khi thấy dòng xác nhận `Successfully obtained certificate`).*

```bash
# 5. Xem nhật ký khởi động của Backend NestJS
docker logs legalflow_backend_uat --tail 50
```

---

## 9. Kiểm Tra & Thẩm Định Sau Triển Khai (Post-Deploy Verification)

Thực hiện rà soát trực tiếp từ trình duyệt trên máy cá nhân:
1. **Truy cập HTTPS:** Mở `https://uat-legalflow.example.com`, ổ khóa bảo mật màu xanh hiển thị hợp lệ.
2. **Chứng chỉ TLS:** Nhấp vào ổ khóa xác nhận chứng chỉ do Let's Encrypt cấp, không có lỗi cảnh báo bảo mật.
3. **Đăng nhập hệ thống:** Đăng nhập thành công, JWT token lưu trữ trong bộ nhớ/cookie hợp lệ.
4. **Health Check API:** Truy cập `https://uat-legalflow.example.com/api/health` trả về `HTTP/2 200 OK`.
5. **AI Assistant:** Bấm tóm tắt đơn, phân loại đơn, gợi ý checklist xử lý hoạt động nhanh nhạy.
6. **AI Drafting:** Tạo thành công 6 mẫu bản nháp AI và lưu lại tại ghi chú hồ sơ (`CaseNote`).
7. **Tải Word `.docx`:** Bấm nút **"📄 Tải Word (.docx)"**, tệp tin tải về thành công, mở lên hiển thị đúng thông tin cơ quan UBND XÃ BÌNH MINH (UAT DEMO).
8. **Xem trước & In PDF:** Bấm nút **"🖨️ Xem & In PDF"**, modal A4 hiển thị rõ ràng, lệnh in `window.print()` hoạt động.
9. **Nhật ký kiểm toán (`AiAuditLog`):** Vào trang lịch sử xác nhận các thao tác gọi AI và tải tài liệu được ghi nhận đầy đủ.
10. **Tính bất biến nghiệp vụ:** Kiểm tra hồ sơ xác nhận `LegalCase.status` và `assignedToId` giữ nguyên không thay đổi.

---

## 10. Kiểm Tra Củng Cố Bảo Mật (Security Auditing)

Thực hiện quét bảo mật từ terminal VPS để khẳng định không rò rỉ cổng dịch vụ:

```bash
# 1. Kiểm tra danh sách cổng đang lắng nghe public trên VPS
sudo ss -tulpn | grep -E ':(22|80|443|5432|9000|3000)'
```
👉 **Đạt chuẩn:** Chỉ có tiến trình SSH (22) và docker-proxy (80, 443) hiển thị. Cổng `5432` (Postgres) và `9000/9001` (MinIO) **tuyệt đối không xuất hiện**.

```bash
# 2. Kiểm tra Git tracking các file nhạy cảm
git status
git ls-files | grep -E '(\.env|Caddyfile$)'
```
👉 **Đạt chuẩn:** Tệp `.env.uat` không bị theo dõi bởi Git.

---

## 11. Lệnh Kiểm Tra Trực Tiếp Trong Cơ Sở Dữ Liệu

Thao tác kiểm tra tính toàn vẹn dữ liệu từ bên trong container PostgreSQL:

```bash
# 1. Kiểm tra các bản ghi nhật ký kiểm toán AI gần nhất
docker exec -i legalflow_postgres_uat psql -U postgres -d legalflow_uat -c "
SELECT id, \"userId\", \"actionType\", status, \"createdAt\" 
FROM \"AiAuditLog\" 
ORDER BY \"createdAt\" DESC LIMIT 5;
"

# 2. Kiểm tra trạng thái hồ sơ và người thụ lý (Đảm bảo không bị AI tự ý thay đổi)
docker exec -i legalflow_postgres_uat psql -U postgres -d legalflow_uat -c "
SELECT id, code, status, \"assignedToId\" 
FROM \"LegalCase\" 
LIMIT 5;
"
```

---

## 12. Quy Trình Backup (Sao Lưu Định Kỳ)

Trước và sau các đợt kiểm thử lớn, chạy lệnh sao lưu CSDL ra tệp `.sql`:

```bash
# 1. Tạo bản backup dữ liệu UAT mới nhất
docker exec -t legalflow_postgres_uat pg_dump -U postgres legalflow_uat > /opt/legalflow-uat/backup_uat_$(date +%Y%m%d_%H%M%S).sql

# 2. Kiểm tra danh sách file backup
ls -lh /opt/legalflow-uat/backup_uat_*.sql

# 3. Khuyến nghị: Tải file backup về máy cá nhân hoặc chuyển sang Storage chuyên dụng qua rsync/scp
```

---

## 13. Quy Trình Rollback Khẩn Cấp (Emergency Rollback)

Nếu bản triển khai UAT gặp lỗi nghiêm trọng, thực hiện khôi phục theo 5 bước:

```bash
# Bước 1: Dừng cụm container hiện tại
docker compose --env-file .env.uat -f docker-compose.uat.yml down

# Bước 2: Checkout về Git Tag ổn định trước đó
git checkout v2.4.2-public-uat-security-hardening

# Bước 3: Rebuild và khởi chạy lại cụm container
docker compose --env-file .env.uat -f docker-compose.uat.yml up -d --build

# Bước 4: Khôi phục lại cơ sở dữ liệu từ tệp backup gần nhất (nếu CSDL bị hỏng)
cat /opt/legalflow-uat/backup_uat_YYYYMMDD_HHMMSS.sql | docker exec -i legalflow_postgres_uat psql -U postgres legalflow_uat

# Bước 5: Kiểm tra lại hoạt động trên trình duyệt https://uat-legalflow.example.com
```

---

## 14. Troubleshooting (Xử Lý Sự Cố Thường Gặp)

| Hiện tượng sự cố | Nguyên nhân gốc rễ | Cách xử lý & Khắc phục |
| :--- | :--- | :--- |
| **Trình duyệt báo lỗi `DNS_PROBE_FINISHED_NXDOMAIN`** | DNS A Record chưa được tạo hoặc chưa lan truyền toàn cầu. | Kiểm tra bằng `nslookup uat-legalflow.example.com`. Chờ thêm 10-15 phút để DNS propagation hoàn tất. |
| **Caddy báo lỗi `SSL Certificate Error / Alert Bad Certificate`** | Tường lửa VPS chưa mở Port 80 hoặc Cloudflare đang bật Proxy (Đám mây màu cam) gây cản trở ACME challenge. | Chạy `sudo ufw allow 80/tcp`. Nếu dùng Cloudflare, tạm chuyển sang chế độ **DNS Only (Đám mây màu xám)** rồi restart Caddy. |
| **Lỗi `CORS policy: No 'Access-Control-Allow-Origin' header`** | Biến `CORS_ORIGIN` trong `.env.uat` bị cấu hình sai tên miền hoặc thiếu `https://`. | Mở `.env.uat` sửa lại `CORS_ORIGIN=https://uat-legalflow.example.com`, sau đó chạy lại `docker compose up -d backend`. |
| **Lỗi `502 Bad Gateway` khi gọi `/api/...`** | Container `backend` chưa khởi động xong hoặc kết nối Database thất bại. | Chạy `docker logs legalflow_backend_uat --tail 50` để xem lỗi cụ thể. Kiểm tra lại chuỗi `DATABASE_URL` trong `.env.uat`. |
| **Cổng 80/443 báo lỗi `address already in use`** | Máy chủ VPS đang chạy sẵn dịch vụ Nginx, Apache hoặc một container Caddy khác chiếm cổng. | Chạy `sudo ss -tulpn | grep -E ':(80|443)'` để tìm ID tiến trình (PID) và dừng dịch vụ đó (`sudo systemctl stop nginx`). |
| **Lỗi xuất Word `.docx` trả về trang trắng / lỗi mạng** | Biến môi trường Phase 5C trong `.env.uat` có ký tự xuống dòng sai cú pháp. | Kiểm tra lại các trường cấu hình `AGENCY_*` trong `.env.uat`, restart container backend. |

---

## 15. Checklist Nghiệm Thu Phase 6D (Runbook Sign-off)

Quản trị viên hạ tầng và cán bộ QA cần đánh dấu hoàn tất toàn bộ 9 tiêu chí nghiệm thu sau khi hoàn thành Runbook:
- [ ] **Hoạt động tên miền:** Truy cập `https://uat-legalflow.example.com` nhanh chóng, không gián đoạn.
- [ ] **Bảo mật HTTPS:** Chứng chỉ Let's Encrypt TLS 1.3 hợp lệ, tự động gia hạn an toàn.
- [ ] **Khả năng xác thực:** Đăng nhập/Đăng xuất mượt mà, phân quyền theo nhóm tài khoản chính xác.
- [ ] **Nghiệp vụ AI Trợ lý:** 100% tính năng AI tóm tắt, phân loại, checklist trả kết quả ổn định.
- [ ] **Tài liệu Word & PDF:** Xuất Word `.docx` và in PDF A4 đạt chuẩn thể thức hành chính, đầy đủ cấu hình cơ quan.
- [ ] **Tính toàn vẹn kiểm toán:** Bảng `AiAuditLog` ghi nhận chính xác từng thao tác.
- [ ] **Độ kín cấu hình hạ tầng:** Không bị lộ cổng PostgreSQL (`5432`) hay MinIO ra mạng công cộng.
- [ ] **Quản lý mật mã:** Mật khẩu Admin mặc định đã thay đổi, không tồn tại secret hardcode trên Git.
- [ ] **Sẵn sàng ứng phó:** Quy trình sao lưu và rollback khẩn cấp đã được kiểm chứng tính hiệu quả.

---

## 16. Kết Luận

Tài liệu **Phase 6D: Public UAT Domain Deployment Runbook** hoàn tất trọn vẹn bộ cẩm nang vận hành thực tiễn, định hướng chuẩn xác từng thao tác từ khâu chuẩn bị hạ tầng, cấu hình mạng, khởi chạy dịch vụ đến kiểm tra an ninh và xử lý sự cố.

> [!NOTE]
> **TIÊU CHÍ CHUYỂN TIẾP GIAI ĐOẠN:**  
> Hệ thống **chỉ chính thức bước sang Phase 6E (Go-Live Public UAT & Kiểm thử người dùng thực tế)** sau khi kỹ sư hệ thống thực thi thành công toàn bộ chuỗi lệnh trong Runbook này trên VPS thực tế và hoàn tất ký nhận vào **Checklist Nghiệm Thu Phase 6D**.
