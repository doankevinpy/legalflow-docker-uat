# Architecture Decision Record (ADR): Phase 7 - Production Readiness

**Trạng Thái:** Đề xuất (Draft)
**Người Khởi Xướng:** System AI & Project Owner
**Ngày Lập:** 26/05/2026

## 1. MỤC TIÊU (CONTEXT & DISCOVERY)
Dự án LegalFlow đã hoàn thành xuất sắc giai đoạn Public Trial (MVP) sử dụng SQLite và ngrok. Để đáp ứng yêu cầu Production an toàn và sẵn sàng cho dữ liệu thật, kiến trúc hệ thống cần được "đóng băng" (Architecture Freeze) theo bộ stack công nghệ mạnh mẽ hơn.

**Kết quả Audit (Phase 7.0):**
- **Git Status:** Clean (Sẵn sàng).
- **Frontend & Backend Build:** PASS. Mọi mã nguồn compile thành công không lỗi (`npm run build`).
- **Prisma Schema:** Valid (Sử dụng SQLite). Chưa có cảnh báo nghiêm trọng.
- **Docker:** Hệ thống hiện tại *chưa* có `Dockerfile` hay `docker-compose`.
- **Dữ liệu thật:** An toàn, chưa bị xâm phạm. Database cũ `dev.db` giữ nguyên trạng.

## 2. QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE FREEZE)

### 2.1. Cơ Sở Dữ Liệu: PostgreSQL
- **Vì sao chọn:** PostgreSQL hỗ trợ đồng thời nhiều kết nối, có độ tin cậy tuyệt đối, hỗ trợ chuẩn JSONB và Type-safe cực mạnh kết hợp với Prisma. Đây là tiêu chuẩn vàng thay thế cho giới hạn file-locking của SQLite khi ứng dụng đi vào thực tế.

### 2.2. Reverse Proxy: Caddy
- **Vì sao chọn:** Nhanh, nhẹ, hiện đại và hỗ trợ tính năng **Tự động cấp phát/gia hạn chứng chỉ SSL/TLS (Let's Encrypt)** mặc định. Tránh được việc setup Certbot rườm rà như trên Nginx, giảm thiểu effort vận hành.

### 2.3. Hệ Thống Lưu Trữ File (Storage): MinIO
- **Vì sao chọn:** Khả năng tương thích chuẩn API của Amazon S3 (S3-compatible). Cho phép code LegalFlow chạy như thể đang thao tác với S3 Cloud, nhưng dữ liệu vẫn an toàn On-premise (trong mạng nội bộ). Khi cần mở rộng lên AWS thực thụ, mã nguồn gần như không cần thay đổi.

### 2.4. Tự Động Hóa CI/CD: GitHub Actions
- **Vì sao chọn:** Tích hợp sâu sẵn có vào hệ sinh thái GitHub, cộng đồng Workflow khổng lồ. Linh hoạt trong việc trigger build Docker, chạy test và Lint mỗi khi có PR.

## 3. LỘ TRÌNH THỰC THI AN TOÀN (REVISED PLAN)
Nhằm đảo bảo nguyên tắc không phá hủy cấu trúc cũ trước khi phiên bản mới thành hình, Phase 7 được chia nhỏ thành 11 bước (7.0 - 7.10):

- **7.0 Discovery & Architecture Freeze** *(Hoàn thành tại tài liệu này)*
- **7.1 Docker Compose nền tảng:** Setup bộ skeleton PostgreSQL + MinIO + Caddy (Chưa migrate dữ liệu).
- **7.2 Prisma PostgreSQL migration:** Khởi tạo migration trên DB mới. Sao lưu và **KHÔNG** phá hủy thư mục migration SQLite cũ.
- **7.3 Seed strategy & Test Data:** Tách biệt dữ liệu Seed bắt buộc và dữ liệu Mock.
- **7.4 Backend kết nối PostgreSQL:** Viết lại cấu hình kết nối, điều chỉnh .env.
- **7.5 Docker hóa Backend/Frontend:** Xây dựng file `Dockerfile`.
- **7.6 Upload File qua MinIO:** Tích hợp SDK, viết API xử lý chứng từ.
- **7.7 Security hardening:** Cấu hình Redis Rate Limit, CORS, Helmet.
- **7.8 Observability & Logging:** Cấu hình Winston/Pino.
- **7.9 CI/CD Pipeline:** Viết kịch bản `.github/workflows`.
- **7.10 Pre-production UAT & Data wipe:** Quét lỗi bảo mật, chuẩn bị dữ liệu thật.

## 4. CHIẾN LƯỢC ROLLBACK & RỦI RO
- **Rủi ro:** Migration từ SQLite sang PostgreSQL có thể xung đột kiểu dữ liệu (vd: Enum, DateTime mặc định). Upload S3/MinIO có cấu hình policy phức tạp.
- **Rollback Strategy:** Trọng tâm là **Bảo tồn**. DB cũ `dev.db` và cấu trúc `prisma/migrations` SQLite cũ sẽ được đổi tên/sao lưu (ví dụ: `prisma/migrations-sqlite-archive`). Nếu rủi ro xảy ra, chỉ cần đổi lại chuỗi kết nối và thư mục migration để hệ thống trở về y nguyên như sau Public Trial.

## 5. PHÊ DUYỆT BẮT BUỘC TRƯỚC KHI BẮT ĐẦU
*(Chờ xác nhận từ Product Owner)*
1. Chốt thứ tự lộ trình (Từ 7.1 đến 7.10).
2. Cho phép tiến hành tạo nhánh mới hoặc bắt đầu commit cấu trúc Docker Skeleton (7.1).
