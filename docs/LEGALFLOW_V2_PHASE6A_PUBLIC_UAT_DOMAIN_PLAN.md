# Phase 6A: Public UAT Domain, HTTPS & Secure Deployment Plan

**Ngày lập kế hoạch:** 03/07/2026  
**Mốc khởi điểm:** Sau tag `v2.3.9-ai-release-package`  
**Mục tiêu:** Lập kế hoạch kiến trúc, bảo mật và vận hành để đưa hệ thống LegalFlow AI v2.3 lên môi trường Public UAT có kiểm soát với tên miền thật và kết nối mã hóa HTTPS an toàn.

---

## 1. Tuyên Ngôn Phạm Vi & Cam Kết An Toàn

Phase 6A là **giai đoạn lập kế hoạch kỹ thuật thuần túy**. Tuân thủ tuyệt đối 10 nguyên tắc an toàn bắt buộc:
1. **Không sửa đổi source code chức năng** trong Phase 6A.
2. **Không sửa đổi database schema** (`schema.prisma`).
3. **Không tạo migration mới**.
4. **Không chỉnh sửa hay commit tệp `.env` thật** lên kho chứa Git.
5. **Không public dịch vụ PostgreSQL** ra mạng Internet công cộng.
6. **Không public MinIO Console** nếu chưa cấu hình bảo mật chuyên sâu.
7. **Không sử dụng mật khẩu admin mặc định hoặc đã lộ**.
8. **Không loại bỏ hay suy giảm cơ chế xác thực (Authentication/RBAC)**.
9. **Không sử dụng CORS wildcard (`*`)** khi public lên tên miền thật.
10. **Không đưa dữ liệu thật của công dân/cơ quan lên môi trường UAT** khi chưa có phê duyệt chính thức bằng văn bản; chỉ sử dụng dữ liệu mô phỏng giả định.

---

## 2. Kiến Trúc Tổng Thể Đề Xuất

Để giảm thiểu rủi ro bảo mật và tối ưu hóa cấu hình kết nối, hệ thống áp dụng mô hình **Single Domain Architecture (Kiến trúc một tên miền duy nhất)** với Path-based Routing qua Reverse Proxy:

```
[ Người Dùng UAT / Trình Duyệt ]
               │
               ▼  (HTTPS : 443 - TLS 1.3 Encryption)
      https://uat-legalflow.<ten-mien>
               │
               ▼
[ Reverse Proxy (Caddy / Nginx) ] ──(Let's Encrypt Auto Cert)
               │
       ┌───────┴────────────────────────┐
       │ Path: /api/*                   │ Path: /* (UI Static / Container)
       ▼                                ▼
[ Backend API Container ]        [ Frontend App Container ]
 (http://backend:3000)            (http://frontend:80)
       │
       ├────────────────────────────────┐
       ▼ (Private Docker Net)           ▼ (Private Docker Net)
[ PostgreSQL Database ]          [ MinIO Storage ]
 (Port 5432 - Internal Only)      (Port 9000 - Internal Only)
```

### Điểm nổi bật của kiến trúc:
- **01 Tên miền duy nhất:** Người dùng truy cập duy nhất qua `https://uat-legalflow.<ten-mien>`.
- **Định tuyến theo đường dẫn (Path Routing):**
  - Mọi yêu cầu bắt đầu bằng `/api/*` sẽ được Reverse Proxy chuyển tiếp (proxy pass) vào container Backend API ở cổng 3000.
  - Các yêu cầu còn lại (`/*`) được phục vụ giao diện React Single Page Application (SPA).
- **Triệt tiêu rủi ro CORS:** Vì trình duyệt thấy Frontend và Backend chạy chung trên cùng một tên miền và cổng (443), các lỗi liên quan đến Cross-Origin Resource Sharing (CORS) hoặc Preflight `OPTIONS` được loại bỏ hoàn toàn.
- **Cách ly kho dữ liệu:** PostgreSQL và MinIO chỉ giao tiếp bên trong mạng nội bộ của Docker (`docker-network`), tuyệt đối không ánh xạ (bind port) ra địa chỉ `0.0.0.0` của máy chủ VPS public.

---

## 3. So Sánh & Đề Xuất Reverse Proxy: Caddy vs Nginx

| Tiêu chí | Caddy Web Server | Nginx Web Server |
| :--- | :--- | :--- |
| **Cấp chứng chỉ HTTPS (Let's Encrypt)** | **Tự động 100%** (Tự xin, tự gia hạn, tự cấu hình gia hạn tự động qua HTTP/TLS-ALPN challenge). | Thủ công hoặc cần cài đặt thêm công cụ `certbot` kết hợp cronjob gia hạn. |
| **Độ phức tạp cấu hình** | **Cực kỳ ngắn gọn** (Chỉ mất 5-15 dòng trong `Caddyfile`). | Phức tạp hơn (Cần cấu hình chi tiết `nginx.conf`, khối `server`, `location`, SSL cyphers). |
| **Giao thức hiện đại** | Mặc định bật HTTP/2 và HTTP/3 (QUIC). | Cần cấu hình bổ sung tham số cho HTTP/2. |
| **Khả năng Rollback** | Dễ dàng (Cấu hình đơn dạng khai báo, dễ sao lưu từng file nhỏ). | Tốt (Cần quản lý thư mục `sites-available`/`sites-enabled`). |

👉 **Khuyến nghị cho Phase 6B (Triển khai UAT): Chọn Caddy.**  
Nhờ tính năng tự động hóa SSL/TLS tích hợp sẵn và cấu hình siêu tối giản, Caddy giúp nhóm phát triển tiết kiệm thời gian vận hành hệ thống hạ tầng để tập trung tối đa vào kiểm thử nghiệp vụ AI.

### Mẫu `Caddyfile` dự kiến cho UAT:
```caddy
uat-legalflow.example.vn {
    # Định tuyến API cho Backend NestJS
    handle /api/* {
        uri strip_prefix /api
        reverse_proxy backend:3000
    }

    # Định tuyến Giao diện Frontend
    handle /* {
        reverse_proxy frontend:80
    }

    # Cấu hình bảo mật Header cơ bản
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

---

## 4. Kế Hoạch Cấu Hình DNS

1. **Tạo bản ghi DNS (DNS Records):**
   - **Loại bản ghi (Type):** `A`
   - **Tên (Name / Host):** `uat-legalflow` (hoặc `uat-legalflow.example.vn`)
   - **Giá trị (Value / Points to):** `<Địa_chỉ_IP_Public_của_VPS>`
   - **TTL:** `300` (5 phút để ưu tiên cập nhật nhanh).

2. **Chế độ Cloudflare Proxy vs DNS Only:**
   - **Khuyến nghị giai đoạn đầu UAT:** Chọn **DNS Only (Nút đám mây màu xám - Proxy off)** để Let's Encrypt trên máy chủ Caddy tự động xác thực và cấp chứng chỉ SSL trực tiếp mà không bị xung đột với lớp SSL của Cloudflare.
   - **Sau khi cấp chứng chỉ ổn định:** Có thể bật **Cloudflare Proxy (Đám mây màu cam)** ở chế độ *Full (Strict)* nếu muốn tận dụng thêm WAF và Anti-DDoS của Cloudflare.

3. **Kiểm tra lan truyền tên miền (DNS Propagation):**
   - Từ terminal trên máy phát triển, chạy lệnh kiểm tra:
     ```powershell
     nslookup uat-legalflow.example.vn
     # Hoặc: Resolve-DnsName uat-legalflow.example.vn
     ```
   - Xác nhận kết quả trả về đúng địa chỉ IP của VPS public.

---

## 5. Thiết Kế Môi Trường Docker UAT (`docker-compose.uat.yml`)

Khi chuyển sang giai đoạn thực thi (Phase 6B), hệ thống sẽ khởi tạo một tệp orchestration riêng biệt: `docker-compose.uat.yml` kèm tệp biến môi trường `.env.uat`.

### Bảng cấu hình biến môi trường (`.env.uat` mẫu):
| Tên biến | Giá trị mẫu cho UAT | Mô tả & Nguyên tắc bảo mật |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Chạy NestJS và Vite ở chế độ production tối ưu. |
| `PORT` | `3000` | Cổng nội bộ của container backend. |
| `DATABASE_URL` | `postgresql://postgres:StrongUatPass!@postgres:5432/legalflow_uat` | Chỉ kết nối trong mạng `docker-network`. |
| `POSTGRES_PASSWORD` | `StrongUatPass!` | Mật khẩu DB ngẫu nhiên độ phức tạp cao, không trùng local. |
| `JWT_SECRET` | `UatSuperSecureJwtSecretKey2026!@#$` | Chuỗi bí mật ký Token tối thiểu 32 ký tự ngẫu nhiên. |
| `CORS_ORIGIN` | `https://uat-legalflow.example.vn` | **Chỉ cho phép duy nhất tên miền UAT public.** |
| `VITE_API_URL` | `/api` | Frontend gọi API tương đối qua path `/api`. |
| `AI_PROVIDER` | `mock` (hoặc `gemini`) | Cấu hình bộ máy AI (giữ `mock` cho UAT bước 1 để ổn định). |
| `AGENCY_NAME` | `UBND XÃ BÌNH MINH (UAT DEMO)` | Cấu hình cơ quan cho Phase 5C hiển thị trên Word/PDF. |

### Bảo mật Network Isolation trong Docker:
- Chỉ container `caddy` (hoặc `nginx`) mở cổng `80:80` và `443:443` ra ngoài VPS.
- Container `backend`, `frontend`, `postgres`, `minio` **tuyệt đối không ánh xạ cổng (`ports: ...`) ra host public**, chỉ khai báo `expose` bên trong mạng bridge nội bộ.

---

## 6. Chiến Lược Phục Vụ Frontend & Backend API

- **Frontend:** Xây dựng production bundle (`npm run build`), phục vụ qua container Nginx/Vite nội bộ hoặc mount thư mục `dist` trực tiếp vào Caddy để phục vụ dưới dạng tệp tĩnh cực nhanh.
- **Backend:** Xử lý yêu cầu thông qua tiền tố `/api`.
- **CORS Configuration tại NestJS Backend:**
  ```typescript
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'https://uat-legalflow.example.vn',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  ```
- **Health Check Public:** Mở điểm truy cập `/api/health` trả về status `200 OK` và thông tin trạng thái kết nối DB để phục vụ theo dõi uptime tự động.

---

## 7. Kế Hoạch Bảo Mật Toàn Diện (Defense-in-Depth)

1. **Xử lý tài khoản Admin:**
   - Ngay trong lần seed dữ liệu UAT đầu tiên, **bắt buộc đổi mật khẩu mặc định** của tài khoản `admin@legalflow.vn` thành chuỗi mật khẩu mạnh (>14 ký tự, hoa, thường, số, ký tự đặc biệt).
   - Tạo các tài khoản cán bộ UAT riêng biệt (`canbo.uat1@legalflow.vn`) phân quyền `STAFF` để kiểm thử nghiệp vụ, không dùng tài khoản Admin để test luồng thụ lý.
2. **Kiểm soát mã nguồn & `.env`:**
   - Kiểm tra kỹ tệp `.gitignore` đảm bảo `.env`, `.env.uat`, `.env.production` bị loại trừ 100%.
3. **Cấu hình Firewall máy chủ VPS (UFW / Cloud Security Group):**
   - Chỉ cho phép Inbound Traffic tại 3 cổng:
     - `Port 22` (SSH - Khuyến nghị giới hạn chỉ cho phép IP của văn phòng/nhóm phát triển truy cập hoặc chuyển sang cổng SSH phi tiêu chuẩn, bắt buộc xác thực bằng SSH Key Pair, tắt Password Authentication).
     - `Port 80` (HTTP - Phục vụ chuyển hướng tự động 301 sang HTTPS và Let's Encrypt challenge).
     - `Port 443` (HTTPS - Truy cập hệ thống UAT).
   - Chặn tuyệt đối cổng `5432` (PostgreSQL), `3000` (Backend), `9000/9001` (MinIO) từ bên ngoài.

---

## 8. Kế Hoạch Backup & Rollback (An Toàn Vận Hành)

Trước mỗi lần cập nhật phiên bản trên môi trường Public UAT:
1. **Sao lưu Cơ sở dữ liệu:**
   ```bash
   docker exec -t legalflow-postgres-uat pg_dump -U postgres legalflow_uat > backup_uat_$(date +%Y%m%d_%H%M%S).sql
   ```
2. **Sao lưu Image / Mã nguồn:** Đóng gói hoặc lưu vết Git Commit ID hiện tại.
3. **Kế hoạch Rollback khẩn cấp:** Nếu bản triển khai UAT mới phát sinh lỗi nghiêm trọng:
   - Dừng container hiện tại: `docker compose -f docker-compose.uat.yml down`
   - Checkout về Git Tag ổn định gần nhất: `git checkout v2.3.9-ai-release-package`
   - Phục hồi cơ sở dữ liệu từ tệp `.sql` gần nhất:
     ```bash
     cat backup_uat_YYYYMMDD.sql | docker exec -i legalflow-postgres-uat psql -U postgres legalflow_uat
     ```
   - Khởi động lại dịch vụ: `docker compose -f docker-compose.uat.yml up -d --build`

---

## 9. Checklist Triển Khai Chi Tiết (Cho Phase 6B)

- [ ] **Bước 1:** Chuẩn bị VPS Public (Ubuntu 22.04 LTS / Debian 12), cài đặt Docker Engine và Docker Compose v2 mới nhất.
- [ ] **Bước 2:** Cấu hình tường lửa UFW mở cổng 22, 80, 443; chặn các cổng khác.
- [ ] **Bước 3:** Trỏ bản ghi DNS A Record cho tên miền `uat-legalflow.<domain>` về IP máy chủ.
- [ ] **Bước 4:** Clone repository mã nguồn về VPS vào thư mục `/opt/legalflow-uat`.
- [ ] **Bước 5:** Tạo tệp `.env.uat` từ mẫu `.env.example`, điền đầy đủ mật khẩu mạnh và `CORS_ORIGIN`.
- [ ] **Bước 6:** Tạo tệp `Caddyfile` cấu hình tự động HTTPS và reverse proxy sang `/api`.
- [ ] **Bước 7:** Khởi chạy hệ thống bằng lệnh: `docker compose -f docker-compose.uat.yml up -d --build`.
- [ ] **Bước 8:** Kiểm tra nhật ký container (`docker logs caddy`) để xác nhận Let's Encrypt đã cấp chứng chỉ HTTPS thành công.
- [ ] **Bước 9:** Truy cập trình duyệt vào `https://uat-legalflow.<domain>`, đăng nhập và thực hiện seed hồ sơ mẫu.

---

## 10. Checklist Nghiệm Thu UAT Public

Sau khi hệ thống đã lên tên miền HTTPS, cần kiểm thử rà soát toàn diện:
- [ ] **Xác thực HTTPS:** Ổ khóa bảo mật màu xanh hiển thị hợp lệ trên trình duyệt, chứng chỉ TLS không bị lỗi cảnh báo.
- [ ] **Đăng nhập & Quyền hạn:** Đăng nhập mượt mà, JWT Token được lưu trữ và làm mới hợp lệ.
- [ ] **Bảo mật Port:** Thử truy cập từ xa vào `https://uat-legalflow.<domain>:5432` hoặc `:9001` phải bị từ chối kết nối (Connection Refused / Timeout).
- [ ] **Chức năng AI Assistant:** Khối trợ lý AI tại chi tiết hồ sơ thực hiện tóm tắt, phân loại, checklist chính xác.
- [ ] **Chức năng AI Drafting & CaseNote:** Soạn thảo đủ 6 mẫu văn bản nháp, lưu thành công vào ghi chú hồ sơ.
- [ ] **Xuất Word (`.docx`):** Bấm nút "Tải Word", tệp tin `.docx` tải về mượt mà qua kết nối HTTPS, mở trên MS Word đúng cấu hình cơ quan và thể thức hành chính.
- [ ] **Xem trước & In PDF:** Bấm nút "Xem & In PDF", modal A4 hiển thị chuẩn xác, lệnh in `window.print()` hoạt động tốt.
- [ ] **Kiểm toán Audit Log:** Bảng nhật ký ghi nhận đầy đủ các thao tác gọi AI và xuất tài liệu của người dùng UAT.
- [ ] **Tính bất biến của Hồ sơ:** Xác nhận `status` và `assignedToId` tuyệt đối không bị thay đổi tự động trong suốt quá trình UAT.

---

## 11. Kết Luận

Kế hoạch kỹ thuật **Phase 6A** đã tạo dựng một lộ trình rõ ràng, chuẩn mực và bảo mật tối đa để đưa hệ thống **LegalFlow AI v2.3** ra môi trường Public UAT. Kiến trúc đề xuất đảm bảo sự tiện lợi trong vận hành (tự động hóa SSL với Caddy), tối ưu về mặt kết nối (chấm dứt rủi ro CORS nhờ Single Domain & Path Routing) và kiên định với các nguyên tắc an toàn dữ liệu cũng như triết lý **Human-in-the-Loop** đã thiết lập.

Khi nhận được lệnh phê duyệt triển khai **Phase 6B**, đội ngũ phát triển có thể tự tin áp dụng trọn vẹn bản kế hoạch này để xây dựng một môi trường UAT chuyên nghiệp, ổn định và sẵn sàng cho các cán bộ thụ lý trải nghiệm, đánh giá thực tế.
