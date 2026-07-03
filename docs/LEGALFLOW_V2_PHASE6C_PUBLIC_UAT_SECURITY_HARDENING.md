# Phase 6C: Public UAT Security Hardening Checklist

**Ngày ban hành tài liệu:** 03/07/2026  
**Phiên bản hệ thống:** LegalFlow AI v2.3 (Mốc kế thừa `v2.4.1-public-uat-config`)  
**Tài liệu rà soát an ninh bắt buộc trước khi triển khai môi trường Public UAT.**

---

## 1. Mục Tiêu Phase 6C

Mục tiêu cốt lõi của **Phase 6C** là thiết lập một bộ tiêu chuẩn kiểm tra an ninh (Security Hardening Checklist) toàn diện, khắt khe và bắt buộc phải đạt 100% trước khi hệ thống LegalFlow AI v2.3 chính thức được tiếp xúc với mạng Internet công cộng trên tên miền UAT (`https://uat-legalflow.<domain>`).

Việc rà soát bảo mật nhằm loại bỏ triệt các lỗ hổng rò rỉ dữ liệu, ngăn chặn tấn công xâm nhập trái phép, bảo vệ quyền riêng tư công dân (PII) và đảm bảo môi trường kiểm thử hoạt động ổn định.

---

## 2. Nguyên Tắc Vận Hành Môi Trường Public UAT

1. **UAT Public là Môi trường có kiểm soát:** Mặc dù truy cập qua mạng Internet công cộng để tiện lợi cho cán bộ nghiệp vụ tại các xã/phường dùng thử từ xa, đây tuyệt đối **không phải là môi trường Production chính thức**.
2. **Nguyên tắc Quyền tối thiểu (Least Privilege):** Chỉ mở những dịch vụ, cổng mạng và quyền tài khoản tối thiểu cần thiết phục vụ việc kiểm thử nghiệp vụ thụ lý đơn thư và trợ lý AI.
3. **Cách ly dữ liệu tuyệt đối:** Tuyệt đối không đưa dữ liệu đơn thư thật có tính chất mật hoặc thông tin cá nhân nhạy cảm lên môi trường UAT khi chưa được sự phê duyệt bằng văn bản của lãnh đạo cơ quan có thẩm quyền.

---

## 3. Checklist Tài Khoản & Quyền Truy Cập (IAM & RBAC)

Trước khi mở truy cập public, cần kiểm toán toàn bộ danh sách tài khoản trong CSDL:
- [ ] **Đổi mật khẩu Quản trị viên (Admin):** Mật khẩu của tài khoản `admin@legalflow.vn` bắt buộc phải được thay đổi ngay sau lần seed đầu tiên thành chuỗi mật khẩu mạnh (>14 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt).
- [ ] **Chấm dứt mật khẩu mặc định/đã lộ:** Tuyệt đối không sử dụng các mật khẩu yếu, mặc định hay từng lộ như `admin123`, `Password123!`, `secret`.
- [ ] **Tạo tài khoản Cán bộ UAT chuyên biệt:** Tạo các tài khoản kiểm thử riêng cho từng cán bộ/phòng ban (`canbo.uat1@legalflow.vn`, `chuyenvien.uat2@legalflow.vn`) phân quyền `STAFF`, không cho phép dùng chung tài khoản Admin để test luồng nghiệp vụ.
- [ ] **Vô hiệu hóa tài khoản Demo thừa:** Khóa hoặc xóa các tài khoản thử nghiệm cũ không còn giá trị sử dụng.
- [ ] **Thẩm định phân quyền tối thiểu:** Xác nhận tài khoản `STAFF` chỉ có quyền thao tác trên hồ sơ được giao, không có quyền quản trị hệ thống hoặc xem toàn bộ nhật ký hệ thống.

---

## 4. Checklist Biến Môi Trường (`.env.uat`)

- [ ] **Lưu trữ cục bộ trên VPS:** Tệp cấu hình `.env.uat` thực tế chỉ tồn tại cục bộ trong thư mục `/opt/legalflow-uat/` trên VPS, có phân quyền truy cập hạn chế (`chmod 600 .env.uat`).
- [ ] **Tuyệt đối không commit Git:** Đã kiểm tra `.gitignore` và `git status`, đảm bảo không có bất kỳ tệp `.env` hay `.env.uat` nào bị theo dõi (track) hoặc đẩy lên Git repository.
- [ ] **Khóa bảo mật `JWT_SECRET` mạnh:** Đảm bảo `JWT_SECRET` là chuỗi ngẫu nhiên siêu bảo mật tối thiểu 32 ký tự, không dùng lại secret của môi trường dev/local.
- [ ] **Mật khẩu `POSTGRES_PASSWORD` mạnh:** Đặt mật khẩu chuyên biệt có độ phức tạp cao cho cơ sở dữ liệu PostgreSQL.
- [ ] **Mật khẩu `MINIO_ROOT_PASSWORD` mạnh:** Đặt mật khẩu mạnh cho tài khoản quản trị MinIO Object Storage.
- [ ] **Chuẩn hóa `CORS_ORIGIN`:** Giá trị `CORS_ORIGIN` phải khớp chính xác với tên miền UAT (ví dụ: `https://uat-legalflow.example.com`), tuyệt đối không dùng ký tự tự do wildcard (`*`).
- [ ] **Khớp URL Frontend & Backend:** `FRONTEND_URL` và `BACKEND_URL` trỏ chuẩn xác về domain UAT hoặc đường dẫn tương đối `/api`.
- [ ] **Cấu hình thông tin cơ quan Phase 5C:** Các biến `AGENCY_NAME`, `AGENCY_PARENT_NAME`, `AGENCY_LOCATION`, `AGENCY_SIGNER_TITLE`, `AGENCY_SIGNER_NAME` đã được điền thông tin mô phỏng hợp lệ để kiểm thử xuất Word/PDF.

---

## 5. Checklist Docker & Cách Ly Mạng (Network Isolation)

- [ ] **Chặn Public PostgreSQL:** Kiểm tra tệp `docker-compose.uat.yml`, container `postgres` chỉ khai báo `expose: ["5432"]` bên trong mạng bridge `legalflow_uat_network`, tuyệt đối không có `ports: ["5432:5432"]` ra host.
- [ ] **Chặn Public MinIO Console:** Container `minio` chỉ khai báo `expose: ["9000", "9001"]`, không ánh xạ ra Host Public 0.0.0.0 nếu chưa thiết lập rào chắn tường lửa chuyên sâu.
- [ ] **Chỉ Caddy Reverse Proxy mở port Public:** Duy nhất container `caddy` được quyền ánh xạ ra mạng ngoài qua `ports: ["80:80", "443:443"]`.
- [ ] **Đóng gói container nội bộ:** Container `backend` (`expose: ["3000"]`) và `frontend` (`expose: ["8080"]`) hoàn toàn ẩn sau lớp Reverse Proxy.
- [ ] **Dọn dẹp container/image thừa:** Gỡ bỏ các dịch vụ không cần thiết cho đợt UAT để tối ưu tài nguyên và giảm diện tích tấn công (Attack Surface).

---

## 6. Checklist Tường Lửa & An Ninh Máy Chủ VPS (OS Hardening)

- [ ] **Tường lửa UFW / Cloud Security Group:** Cấu hình chính sách mặc định `DENY INCOMING`, chỉ mở đúng 3 cổng inbound:
  - `Port 80/tcp` (HTTP - Phục vụ ACME Let's Encrypt Challenge & Redirect 301).
  - `Port 443/tcp` (HTTPS - Giao tiếp ứng dụng).
  - `Port 22/tcp` (SSH - Quản trị VPS).
- [ ] **Siết chặt SSH (Port 22):**
  - Khuyến nghị giới hạn địa chỉ IP được phép SSH vào VPS (IP Whitelist của văn phòng/nhóm phát triển).
  - Tắt đăng nhập trực tiếp bằng tài khoản `root` (`PermitRootLogin no` trong `/etc/ssh/sshd_config`).
  - Tắt xác thực bằng mật khẩu (`PasswordAuthentication no`), bắt buộc đăng nhập bằng SSH Key Pair (Ed25519 hoặc RSA 4096).
- [ ] **Cập nhật Bản vá Hệ điều hành:** Chạy `apt update && apt upgrade -y` để vá lỗi bảo mật nhân Linux mới nhất.
- [ ] **Giám sát dung lượng ổ đĩa:** Kiểm tra `df -h` bảo đảm ổ cứng còn trống tối thiểu 40% để chứa log docker và dữ liệu backup.

---

## 7. Checklist Domain & Giao Thức HTTPS

- [ ] **Bản ghi DNS chuẩn xác:** Bản ghi `A Record` của subdomain UAT trỏ chính xác về IPv4 Public của máy chủ VPS.
- [ ] **Chứng chỉ SSL/TLS Hợp lệ:** Trình duyệt nhận diện chứng chỉ do Let's Encrypt cấp, chuẩn mã hóa TLS 1.3/1.2 mạnh mẽ.
- [ ] **Cơ chế Tự gia hạn ACME:** Container Caddy cấu hình mount volume `caddy_uat_data` an toàn để lưu trữ chứng chỉ, đảm bảo tự động gia hạn trước khi hết hạn.
- [ ] **Tự động chuyển hướng HTTP sang HTTPS:** Mọi truy cập vào `http://uat-legalflow.<domain>` phải bị redirect 301 sang `https://`.
- [ ] **Không lỗi Mixed Content:** Tất cả các tài nguyên ảnh, font, API call từ Frontend đều gọi qua giao thức `https://` hoặc đường dẫn tương đối `/api/...`.

---

## 8. Checklist An Toàn Nghiệp Vụ Ứng Dụng

- [ ] **Luồng Đăng nhập / Đăng xuất:** Kiểm tra đăng nhập mượt mà, JWT Token được cấp phát và hủy đúng quy trình.
- [ ] **Hoạt động AI Assistant:** Các chức năng tóm tắt, phân loại và gợi ý checklist phản hồi ổn định (dùng Mock Engine hoặc Gemini Pro thực tế đã giới hạn Quota).
- [ ] **Soạn thảo Bản nháp AI:** Khởi tạo thành công 6 mẫu văn bản, lưu trữ an toàn vào ghi chú `CaseNote`.
- [ ] **Xuất Word (`.docx`):** Bấm "Tải Word" stream tệp tin nhị phân chuẩn xác qua HTTPS, bóc tách cấu hình cơ quan Phase 5C thành công.
- [ ] **Xem trước & In PDF:** Modal trang A4 hiển thị đúng chuẩn, thao tác in trình duyệt hoạt động mượt mà.
- [ ] **Kiểm toán `AiAuditLog`:** Nhật ký hệ thống ghi vết chính xác 100% các thao tác gọi AI, tải Word và xem PDF.
- [ ] **Bất biến Trạng thái Hồ sơ:** Cán bộ kiểm thử rà soát xác nhận trường `LegalCase.status` và `assignedToId` tuyệt đối không bị AI tự động chỉnh sửa dưới bất kỳ hình thức nào.

---

## 9. Checklist Quản Trị Dữ Liệu & Backup

- [ ] **Dữ liệu Chuẩn UAT:** Chỉ sử dụng bộ dữ liệu mẫu tiêu chuẩn hoặc dữ liệu đã được ẩn danh hóa/làm giả thông tin PII để kiểm thử.
- [ ] **Không lưu trữ trái phép:** Cam kết không import dữ liệu vụ việc khiếu nại, tố cáo thực tế nhạy cảm khi chưa có quyết định cho phép.
- [ ] **Sao lưu trước Triển khai:** Đã thực hiện lệnh `pg_dump` sao lưu CSDL hiện tại ra tệp `.sql` lưu trữ an toàn ngoài VPS.
- [ ] **Kế hoạch Phục hồi Khẩn cấp:** Có sẵn quy trình và lệnh khôi phục database lập tức nếu quá trình nâng cấp phát sinh lỗi.
- [ ] **Chỉ mục Git Tag rõ ràng:** Mã nguồn triển khai được neo cố định vào mốc Git Tag đã kiểm thử kỹ lưỡng (`v2.4.1-public-uat-config`).

---

## 10. Các Lệnh Kiểm Tra Đề Xuất (Verification Commands)

Quản trị viên hệ thống bắt buộc thực thi bộ lệnh kiểm tra sau trên terminal VPS trước khi thông báo UAT go-live:

1. **Kiểm tra trạng thái Git & rò rỉ file cấu hình:**
   ```bash
   git status
   git ls-files | grep -i env
   ```
   *(Xác nhận không có tệp `.env.uat` nào trong danh sách được track bởi Git).*

2. **Kiểm tra tính hợp lệ của cấu hình Docker Compose:**
   ```bash
   docker compose --env-file .env.uat -f docker-compose.uat.yml config
   ```
   *(Xác nhận không có lỗi cú pháp YAML hoặc biến môi trường bị thiếu).*

3. **Kiểm tra các cổng mạng đang mở trên Host Public:**
   ```bash
   sudo ss -tulpn | grep -E ':(22|80|443|5432|9000|3000)'
   ```
   *(Xác nhận chỉ có tiến trình SSH, Caddy/Docker proxy lắng nghe trên 22, 80, 443. Không có tiến trình nào lắng nghe trên cổng 5432 hay 9000 ở Host).*

4. **Kiểm tra sức khỏe các Container:**
   ```bash
   docker compose --env-file .env.uat -f docker-compose.uat.yml ps
   ```
   *(Tất cả các container `postgres`, `minio`, `backend`, `frontend`, `caddy` đều đạt trạng thái `Up (healthy)`).*

5. **Kiểm tra trực tiếp HTTP Health Check từ VPS:**
   ```bash
   curl -i https://localhost/api/health --insecure
   ```
   *(Phản hồi `HTTP/2 200` chứng minh Caddy đã định tuyến thành công sang Backend).*

6. **Giám sát nhật ký Backend API:**
   ```bash
   docker logs legalflow_backend_uat --tail 30
   ```
   *(Không phát hiện lỗi kết nối Database hay MinIO).*

7. **Kiểm tra truy vấn dữ liệu Nhật ký Kiểm toán AI:**
   ```bash
   docker exec -i legalflow_postgres_uat psql -U postgres -d legalflow_uat -c "SELECT id, \"userId\", \"actionType\", status, \"createdAt\" FROM \"AiAuditLog\" ORDER BY \"createdAt\" DESC LIMIT 5;"
   ```
   *(Xác nhận các bản ghi kiểm toán AI được ghi nhận chính xác theo thời gian thực).*

---

## 11. Rủi Ro Còn Lại & Biện Pháp Giảm Thiểu

| Rủi ro | Mức độ | Biện pháp giảm thiểu |
| :--- | :---: | :--- |
| **Người dùng UAT thao tác nhầm / xóa dữ liệu** | Trung bình | Cấp quyền `STAFF` giới hạn; thiết lập lịch cronjob tự động reset/restore cơ sở dữ liệu mẫu vào 00:00 hàng ngày. |
| **Rò rỉ thông tin cá nhân (PII)** | Cao | Tuân thủ nghiêm checklist Không dùng dữ liệu thật; áp dụng module tự động ẩn danh hóa trước khi xử lý AI. |
| **Cấu hình CORS sai dẫn đến chặn UI** | Trung bình | Kiểm tra kỹ header `Access-Control-Allow-Origin` khớp với HTTPS domain trước khi thông báo người dùng vào test. |
| **Lộ cổng PostgreSQL / MinIO do lỗi Compose** | Rất cao | Luôn chạy lệnh kiểm tra `ss -tulpn` và quét port từ ngoài Internet trước khi chốt hạ tầng. |
| **Tấn công dò mật khẩu SSH / Admin Brute-force** | Cao | Sử dụng SSH Key Pair, tắt Root Login, cài đặt công cụ `fail2ban` chặn IP dò mật khẩu. |

---

## 12. Kết Luận & Cổng Quyết Định (Phase Gate Decision)

Tài liệu **Phase 6C: Public UAT Security Hardening Checklist** đóng vai trò là "chốt chặn an ninh" cao nhất của dự án trước thềm mở cửa môi trường kiểm thử công cộng.

> [!IMPORTANT]
> **QUYẾT ĐỊNH GO / NO-GO:**  
> Đội ngũ kỹ thuật và vận hành **CHỈ ĐƯỢC PHÉP CHUYỂN SANG PHASE 6D (THỰC THI DEPLOY PUBLIC UAT)** khi và chỉ khi **100% CÁC HẠNG MỤC TRONG CHECKLIST NÀY ĐÃ ĐƯỢC KIỂM TRA VÀ ĐÁNH DẤU HOÀN TẤT `[x]`**. Bất kỳ hạng mục bảo mật nào chưa đạt đều phải được khắc phục triệt để trước khi tiến hành triển khai.
