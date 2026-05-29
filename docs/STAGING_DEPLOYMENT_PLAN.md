# Kế hoạch Triển khai Staging (STAGING_DEPLOYMENT_PLAN)

## 1. Mục tiêu (Scope)
- Tài liệu này áp dụng **chỉ cho môi trường Staging**.
- Mục đích: Tạo ra môi trường thử nghiệm tiền sản xuất an toàn.
- **Quy định dữ liệu**: Môi trường Staging chỉ được phép sử dụng dữ liệu giả lập (dummy/test data). Tuyệt đối **không đưa dữ liệu PII thật** (thông tin định danh cá nhân thật) của khách hàng/người dùng lên môi trường này để test.

## 2. Chiến lược Domain, HTTPS & Caddy
- **Staging Domain**: Cấp phát một subdomain riêng (ví dụ: `staging.legalflow.example.com`).
- **HTTPS**: Sử dụng Caddy làm reverse proxy đảm nhận việc cấp phát chứng chỉ TLS (Let's Encrypt / ZeroSSL).
- **HTTP -> HTTPS**: Cấu hình tự động redirect mọi traffic HTTP sang HTTPS thông qua Caddy.

## 3. Chiến lược Biến Môi Trường (Env Strategy)
- Khởi tạo file `.env.staging.example` lưu trữ trên repo làm mẫu.
- **Không bao giờ commit file `.env.staging` thật** (file chứa secret) lên Git.
- Cấu hình biến môi trường chứa database credential, jwt secret, minio keys thực tế sẽ được đưa trực tiếp vào host staging.

## 4. PostgreSQL Staging & Migration
- Sử dụng PostgreSQL container cho staging.
- Luôn sử dụng luồng `npx prisma migrate deploy` để update schema.
- (Tùy chọn) Kích hoạt flag `SEED_MOCK_DATA=true` thủ công nếu muốn đổ mock data test ban đầu.

## 5. Object Storage (MinIO)
- MinIO staging sẽ sử dụng bucket được cấu hình là **private**.
- Việc tải và truy cập file phải đi qua Backend bằng cơ chế Presigned URL.

## 6. Quy trình Cập nhật Thủ công (Manual Deploy Flow)
- Giai đoạn đầu, staging sẽ được deploy thủ công thông qua CLI bằng SSH (Xem thêm tại `DEPLOYMENT_RUNBOOK.md`) để rà soát log và hiệu năng, chưa tự động hóa hoàn toàn bằng CI/CD để dễ kiểm soát.

## 7. Verification Checklist (Sau khi deploy)
- [ ] **API Health**: Xác minh `/api/health` trả về `200 OK`.
- [ ] **Login**: Chạy script/login thủ công để đảm bảo Auth JWT hoạt động.
- [ ] **Case CRUD**: Tạo, xem, cập nhật trạng thái Case.
- [ ] **Upload/Download**: Thử tải lên và tải xuống 1 file an toàn.
- [ ] **Analytics**: Xem qua dashboard thống kê, kiểm tra phản hồi.
- [ ] **Playwright Smoke**: Chạy bộ E2E UI testing (cục bộ hoặc từ CI trỏ về domain staging) để Pass.
- [ ] **Log Secret Scan**: Quét nhanh các log Docker (`docker compose logs`) để đảm bảo không rò rỉ credential hay jwt token.

## 8. Kế hoạch Khôi phục (Rollback)
- Lùi lại image tag của backend/frontend phiên bản cũ.
- Thực thi restore database dump nếu quá trình migration gây vỡ database.
