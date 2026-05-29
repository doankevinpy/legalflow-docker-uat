# Hướng Dẫn Kịch Bản Diễn Tập Sao Lưu & Khôi Phục (BACKUP_RESTORE_DRILL)

Tài liệu này xác định các quy trình tiêu chuẩn để thực hiện sao lưu (Backup) và diễn tập khôi phục (Restore Drill) cho cơ sở dữ liệu PostgreSQL và MinIO Object Storage trong hệ thống LegalFlow.

## A. Phạm Vi Áp Dụng (Scope)
- Kịch bản này **chỉ áp dụng cho môi trường Local và Staging** để phục vụ việc diễn tập khôi phục.
- **Dữ liệu**: Tuyệt đối không sử dụng dữ liệu thật (Production Data / PII) cho các cuộc diễn tập này. Chỉ sử dụng dữ liệu giả lập (mock data).
- **Production**: Tài liệu này không được áp dụng trực tiếp lên Production nếu chưa vượt qua cổng phê duyệt (Approval Gate).

## B. Kế Hoạch Sao Lưu PostgreSQL (PostgreSQL Backup Plan)
- **Công cụ**: Sử dụng lệnh `pg_dump` thực thi qua Docker exec.
- **Định dạng file**: File backup sẽ được gắn timestamp tự động (vd: `backup_postgres_YYYYMMDD_HHMMSS.dump`).
- **Nơi lưu trữ**: File backup được xuất trực tiếp ra ngoài kho lưu trữ mã nguồn. Đường dẫn dự kiến:
  `C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups\postgres\`
- **Bảo mật**: Lệnh thực thi sẽ đọc biến môi trường ngầm định, tuyệt đối không in chuỗi kết nối `DATABASE_URL` ra console/log.
- **Git**: File backup (`.dump`) sẽ không bao giờ được commit lên repository.
- **Tính toàn vẹn**: Sau khi tạo backup, một file chứa mã băm `SHA256` của tệp dump sẽ được khởi tạo tự động.

## C. Kịch Bản Diễn Tập Khôi Phục PostgreSQL (PostgreSQL Restore Drill)
- **Database Khôi phục**: Quy trình sẽ tạo và import dữ liệu vào một database tách biệt mang tên `legalflow_restore_drill`.
- **Ranh giới an toàn**: Tuyệt đối **không ghi đè (overwrite)** lên DB chính của ứng dụng.
- **Xác thực dữ liệu (Validation)**:
  - Bảng `_prisma_migrations` tồn tại và đúng số lượng migration.
  - Số lượng bản ghi `users`, `cases`, `documents` khớp với source.
  - Chạy query SQL mẫu: có thể truy vấn case và thông tin documents tương ứng (nếu có mock data).
- **Dọn dẹp (Cleanup)**: Chỉ thực hiện lệnh `DROP DATABASE legalflow_restore_drill`. **Tuyệt đối cấm dùng `docker compose down -v`**.

## D. Kế Hoạch Sao Lưu MinIO (MinIO Backup Plan)
- **Công cụ**: Sử dụng MinIO Client (`mc mirror` hoặc `mc cp`) qua S3-compatible API. (Việc copy trực tiếp raw Docker volume bị nghiêm cấm trong luồng chuẩn, chỉ dành cho emergency manual fallback).
- **Nơi lưu trữ**: Xuất bucket backup ra ngoài kho lưu trữ mã nguồn:
  `C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups\minio\`
- **Bảo mật**: Thông tin `MINIO_ACCESS_KEY` và `MINIO_SECRET_KEY` được inject thông qua cấu hình host/mc config, tuyệt đối không in plaintext ra stdout hay log file.
- **Tính toàn vẹn**: (Tùy chọn) Khởi tạo manifest/checksum cho danh sách file đã sao lưu nếu được thiết lập cấu hình.

## E. Kịch Bản Diễn Tập Khôi Phục MinIO (MinIO Restore Drill)
- **Bucket Khôi phục**: Quy trình sẽ import dữ liệu vào một bucket tạm mang tên `legalflow-docs-restore-drill`.
- **Ranh giới an toàn**: Không ghi đè bucket lưu trữ chính của ứng dụng.
- **Xác thực dữ liệu (Validation)**:
  - Lệnh list objects (`mc ls`) hiển thị cấu trúc thư mục/file tồn tại.
  - Tải xuống thử 1 object bất kỳ thành công.
  - Xác nhận bucket tạm vẫn được khóa an toàn ở chế độ Private.

## F. Kiểm Tra Tính Nhất Quán (Consistency Check)
Đảm bảo liên kết chéo giữa DB và Storage sau khi restore.
- **Quy trình**: Đối chiếu Document metadata trong Database và các Object Key thực tế trên MinIO.
- **Báo cáo sẽ cung cấp**:
  - `Matched count`: Số tài liệu có trong DB và có file trên Storage.
  - `Missing object count`: Có trong DB nhưng file không tồn tại trên Storage.
  - `Orphan object count`: File rác tồn tại trên Storage nhưng không có metadata trong DB.
- **Bảo mật Output**: Không in full `minioKey` trong báo cáo. Tự động che dấu (mask) thông tin thành định dạng an toàn: `cases/<caseId>/<docId>/...`

## G. Yêu Cầu An Toàn Chung (Security & Compliance)
- KHÔNG sử dụng dữ liệu thật tham gia diễn tập.
- KHÔNG commit bất kỳ artifacts (dump, zip) sinh ra từ quy trình backup.
- KHÔNG commit các biến môi trường cấu hình production/staging thực tế (`.env` thật).
- KHÔNG in cấu hình secret/token vào hệ thống log file.
- KHÔNG dùng lệnh phá hủy volume `down -v`.
- KHÔNG lưu password hay keys trực tiếp dưới dạng plain text trong script hoặc tài liệu hướng dẫn.

## H. Danh Sách Kiểm Tra Đánh Giá (Verification Checklist)
- [ ] PostgreSQL backup file created.
- [ ] PostgreSQL backup checksum created.
- [ ] Restore DB created.
- [ ] Restore validation PASS.
- [ ] MinIO backup created.
- [ ] Restore bucket created.
- [ ] Object validation PASS.
- [ ] Consistency check PASS.
- [ ] Cleanup drill DB/bucket PASS.
- [ ] Git status clean.

## I. Tự Động Hóa Tương Lai (Future Scripts)
Các kịch bản dưới đây nằm trong lộ trình Phase 9.1B (chưa triển khai thực tế):
- `scripts/backup-postgres.ps1`
- `scripts/restore-postgres-drill.ps1`
- `scripts/backup-minio.ps1`
- `scripts/restore-minio-drill.ps1`
- `scripts/check-storage-consistency.ps1`

## J. Rủi Ro & Kế Hoạch Đảo Ngược (Risks & Rollback)
- **Ranh giới**: Không bao giờ thực hiện hành động GHI ĐÈ (Overwrite) lên Database chính và Bucket chính trong bất kỳ tình huống nào.
- Dọn dẹp (Cleanup) chỉ được phép chạy trên các `Target DB` và `Target Bucket` được khởi tạo riêng biệt cho Drill.
- Nếu tiến trình Backup gặp lỗi, kịch bản phải Dừng lại ngay lập tức.
- Nếu tiến trình Restore gặp lỗi, KHÔNG ĐƯỢC xóa nguồn tệp Backup (Backup Source) gốc để bảo toàn dữ liệu phòng hờ.
