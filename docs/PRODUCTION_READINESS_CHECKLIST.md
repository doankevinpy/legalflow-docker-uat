# Danh sách Chuẩn bị Production (PRODUCTION_READINESS_CHECKLIST)

Tài liệu này xác định các yêu cầu bắt buộc (Blockers) trước khi ứng dụng LegalFlow được phát hành hoặc cập nhật trên môi trường Production.

## 1. Cổng Phê Duyệt Triển Khai (Production Approval Gate)
Mọi lượt deploy lên production phải PASS tất cả các tiêu chí sau:
- [ ] **GitHub Actions CI PASS**: Toàn bộ luồng build, lint, unit test, security scan đều xanh.
- [ ] **Playwright smoke PASS**: Bộ E2E test cho tính năng cốt lõi (Login, Case CRUD) vượt qua.
- [ ] **Backup snapshot created**: Đã tạo snapshot/dump DB và Storage hiện hành thành công.
- [ ] **Restore drill status**: Trạng thái xác nhận đợt diễn tập khôi phục (restore drill) gần nhất là THÀNH CÔNG.
- [ ] **Rollback plan reviewed**: Đã xem xét và chuẩn bị sẵn các bước lùi (khi có sự cố bất ngờ).
- [ ] **Secrets injected via runtime/secret manager**: KHÔNG hard-code hay load qua file `.env` đã commit.
- [ ] **HTTPS/domain verified**: Đã cấp và verify chứng chỉ TLS cho domain chính thức, HTTP redirect chuẩn.
- [ ] **No debug logs**: Các cờ debug ở framework/backend đều tắt.
- [ ] **No mock seed flags**: Các cờ `SEED_MOCK_*` tuyệt đối không được kích hoạt.
- [ ] **CORS whitelist**: Đã cấu hình chỉ cho phép request từ domain Front-End hợp lệ (KHÔNG dùng `*`).
- [ ] **Rate limit**: Hệ thống proxy/backend đã bật giới hạn request để chặn abuse.
- [ ] **Swagger/debug endpoints off/protected**: Tắt Swagger API docs công khai hoặc đưa vào sau lớp Auth/Internal.

## 2. Quản lý Dữ liệu và PII (Data Policy/PII handling)
- 100% dữ liệu PII được mã hóa tại tầng TLS khi truyền tải (in-transit).
- Không in dữ liệu PII của khách hàng, token truy cập hoặc payload chi tiết vào file log ứng dụng.

## 3. Quản lý Tệp tin (Object Storage)
- Bucket lưu trữ production luôn ở trạng thái **Private**.
- Tài liệu tải xuống chỉ thông qua **Presigned URL** với thời gian sống (TTL) giới hạn khắt khe (VD: 15 phút).

## 4. Bảo mật RBAC và Xử lý Response (Sanitization Check)
- Đảm bảo ma trận phân quyền (ADMIN, MANAGER, STAFF, VIEWER) không bị vượt rào.
- Controller Backend đã đảm bảo xóa/lọc sạch thuộc tính nhạy cảm nội bộ (vd: `minioKey`) khỏi phản hồi JSON trước khi gửi cho client.

## 5. Sao Lưu và Khôi Phục (Backup/Restore Requirement)
- Luôn phải đảm bảo CSDL có thể được dump ra và khôi phục lại không lỗi (tested backup integrity).
- Storage bucket replication/backup phải khả dụng.

## 6. Giám sát & Lưu trữ Log (Observability and Log retention)
- **Log Retention**: Không lưu log vô thời hạn gây tràn ổ, cấu hình log rotate chuẩn xác.
- Theo dõi các metrics quan trọng về uptime và trạng thái (Health probes).
