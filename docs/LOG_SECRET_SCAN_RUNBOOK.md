# Runbook Quét Secret trong Container Logs

## 1. Mục tiêu
- Rà soát tự động và quét các container logs nhằm phát hiện sớm các secret, token, hay dữ liệu nhạy cảm vô tình bị rò rỉ thông qua console output của ứng dụng.
- Đảm bảo an toàn tuyệt đối: Script quét sẽ bắt (match) các mẫu chuỗi, nhưng **không in lại full log line** nếu có match để tránh làm rò rỉ secret ra các hệ thống báo cáo hoặc CI log.

## 2. Patterns Cần Quét (Target Patterns)
Công cụ quét hỗ trợ nhận diện các mẫu chuỗi nhạy cảm sau:
- **Bearer token**: Chuỗi Authorization token (VD: `Bearer <token>`).
- **JWT**: Chuỗi token dưới định dạng JSON Web Token, thường bắt đầu bằng `eyJ...`.
- **Database Connection String**: Chuỗi cấu hình DB bắt đầu với `DATABASE_URL=`.
- **MinIO Credentials**: Khóa bảo mật MinIO `MINIO_ACCESS_KEY` hoặc `MINIO_SECRET_KEY`.
- **Password fields**: Bất kỳ object key hoặc biến nào mang ý nghĩa mật khẩu (Ví dụ: `password=`, `"password":`).
- **AWS/S3 Signatures**: Các param ký xác thực như `X-Amz-Credential` và `X-Amz-Signature`.
- **Presigned URL parameters**: Liên kết tải file có chứa mã xác thực.
- **minioKey**: Khóa định danh file trên storage (trong trường hợp không cần thiết log raw data).

## 3. Chính sách Báo cáo (Reporting Policy)
Khi phát hiện ra nguy cơ rò rỉ secret trong log, script chỉ báo cáo các thông tin rủi ro ở dạng tổng quát:
- Tên **Container** phát sinh rò rỉ log.
- **Pattern Type** bị vướng (Ví dụ: `JWT`, `DatabaseUrl`).
- **Số lượng (Count)** số dòng log vi phạm.
- (Tùy chọn) Có thể xuất kèm Timestamp nhưng phải đảm bảo an toàn.
- **TUYỆT ĐỐI KHÔNG** in raw matched content hoặc toàn bộ log line bị lỗi.

## 4. Biện pháp Khắc phục (Remediation)
Nếu có secret bị phát hiện trong log:
1. **Xóa/Mask Log Source**: Chỉnh sửa source code (bổ sung Redact rule vào Logger như Pino) để thay thế thông tin nhạy cảm thành ký tự ẩn (`***`).
2. **Rotate Secret**: Nếu mật khẩu hoặc key bị lộ là secret thực tế của môi trường Production/Staging, phải tiến hành thu hồi (revoke) và tạo mới (rotate) ngay lập tức.
3. **Report Incident**: Tạo issue bảo mật (Security Incident) theo đúng quy trình phát triển.
4. **No Copying**: Nghiêm cấm copy/dán giá trị thật của secret vào báo cáo, slack, hoặc jira ticket.
