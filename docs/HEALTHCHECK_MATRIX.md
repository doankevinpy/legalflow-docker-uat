# Healthcheck Matrix

Tài liệu này vạch ra kiến trúc kiểm tra sức khỏe hệ thống (Healthcheck) và độ sẵn sàng (Readiness) cho LegalFlow, bảo đảm ứng dụng có khả năng tự chẩn đoán và tự phục hồi khi có sự cố.

## 1. Hiện trạng
- Backend hiện tại có một endpoint `/api/health` tĩnh trả về object cứng `{ status: 'ok', timestamp: '...' }`, không mang ý nghĩa về tình trạng hệ thống thực tế.

## 2. Thiết kế Endpoints Đề xuất
- **`/api/health` (Liveness):**
  - **Public-safe:** An toàn khi mở public (không chứa dữ liệu nhạy cảm).
  - Không phụ thuộc vào DB hay MinIO. Chỉ xác định quá trình runtime của Node.js (event loop) có đang sống hay không.
- **`/api/ready` (Readiness):**
  - Kiểm tra trạng thái kết nối tới Database và MinIO.
  - Phục vụ mục đích định tuyến lưu lượng (ví dụ: proxy chỉ trỏ request vào khi node sẵn sàng) và chẩn đoán nội bộ.
  - Ở local/docker có thể dùng để test, nhưng trên Production, tài liệu quy định đây là route Internal / Admin-only.
- **`/api/metrics`:**
  - Chưa triển khai. Nếu triển khai trong tương lai, endpoint này sẽ là internal / protected only (KHÔNG expose ra ngoài internet qua Caddy public route).

## 3. Kiến trúc Readiness Check
- **DB Connectivity:** Ping cơ sở dữ liệu PostgreSQL (qua thư viện Prisma hoặc query `SELECT 1`).
- **MinIO Reachability:**
  - Thực hiện các thao tác nhẹ nhàng nhất.
  - Ưu tiên gọi hàm `HeadBucket` qua S3-compatible SDK.
  - Nếu `HeadBucket` không khả dụng hoặc bị cấm do policy, dùng fallback là `ListObjectsV2` với tham số `MaxKeys=1`.
  - **Không** tạo thêm rác bằng việc upload file hay cố gắng download toàn bộ file lớn chỉ để kiểm tra sức khỏe.

## 4. Security Rules (Cấm hiển thị Secret)
Response của mọi lệnh healthcheck/readiness **TUYỆT ĐỐI KHÔNG** chứa các thông tin sau:
- Connection String (ví dụ `DATABASE_URL`).
- Tên bucket thật sự, endpoint URL, hoặc bất kỳ access key/secret key nào của MinIO.
- Mật khẩu, token.

## 5. Expected Status Shape (Cấu trúc trả về chuẩn)
Kết quả trả về dạng JSON an toàn, gọn gàng và không tiết lộ nội dung hệ thống:
```json
{
  "status": "up",
  "timestamp": "2026-06-01T10:00:00.000Z",
  "checks": {
    "database": { "status": "up" },
    "minio": { "status": "up" }
  }
}
```

## 6. Matrix Healthcheck cho các Service
Hệ thống Docker sẽ dựa vào Matrix này để thiết lập Healthcheck và restart container khi cần.

| Service | Mô tả Check | Hành vi khi lỗi (Failure Behavior) |
| --- | --- | --- |
| **frontend_caddy** | Quét cổng proxy `localhost:80` | Proxy down. Caddy tự khởi động lại. |
| **backend** | Curl tới `localhost:3000/api/health` | Backend down. Tự động restart container sau N lần thất bại. |
| **postgres** | `pg_isready` | DB down. Lệnh kiểm tra readiness của Backend (nếu chạy) sẽ báo lỗi DB. |
| **minio** | `curl` tới port 9000 (ping `/minio/health/live`) | MinIO down. Readiness báo lỗi, tính năng tài liệu sẽ bị gián đoạn. |
