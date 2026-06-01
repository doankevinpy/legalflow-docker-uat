# Observability & Monitoring Runbook

Tài liệu này định nghĩa chiến lược quan sát (Observability) và vận hành hệ thống LegalFlow. Các thiết lập dưới đây được định hướng triển khai trong các Phase tiếp theo.

## 1. Logging Strategy

- **Thư viện Logging:** Pino là lựa chọn đề xuất cho phase implementation sau nhờ tốc độ và khả năng sinh JSON log tự nhiên (JSON structured logs).
- **Log Levels:**
  - `debug`: Cung cấp luồng dữ liệu chi tiết cho development.
  - `info`: Log tiêu chuẩn (request lifecycle, system events).
  - `warn`: Lỗi có thể phục hồi, cảnh báo.
  - `error`: Lỗi nghiêm trọng, lỗi 5xx.
  - **Lưu ý:** Production không bật `debug`.

- **Redaction / Masking Policy (Lọc Secret):**
  Các thông tin nhạy cảm dưới đây bắt buộc phải bị loại bỏ hoặc mask trước khi ghi ra log:
  - Header `Authorization`
  - Tokens: `accessToken`, `JWT` (các token bắt đầu bằng `eyJ...`)
  - `password` (plaintext hoặc hashed)
  - `DATABASE_URL`
  - Cấu hình MinIO: `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
  - Presigned URL từ MinIO
  - Full `minioKey` (có thể bị mask nếu chứa PII, chỉ log phần không nhạy cảm nếu cần thiết).

## 2. Request ID / Correlation ID Strategy
- Mỗi request đi qua hệ thống cần được gắn một mã định danh duy nhất (Request ID / Correlation ID) xuyên suốt từ tầng proxy (Caddy) cho tới backend. Mọi log sinh ra trong vòng đời của request đó đều phải chứa ID này để phục vụ truy xuất (traceability).

## 3. Secret Log Scan Policy
- Bắt buộc phải có kịch bản/script thường xuyên quét các log sinh ra từ hệ thống để phát hiện các secret bị rò rỉ (như password, token, access key). Mọi dấu hiệu bất thường phải được đánh dấu FAIL ngay lập tức.

## 4. Operational Monitoring Checklist
Các chỉ số sau đây phải được theo dõi liên tục trong quá trình vận hành hệ thống:
- **CPU / RAM / Disk usage** của từng container và host server.
- **Container restart count:** Số lần container bị khởi động lại ngoài ý muốn.
- **Backend error rate:** Tỷ lệ lỗi trả về từ API Backend.
- **Request latency:** Thời gian phản hồi API trung bình và các điểm nghẽn.
- **Upload / Download failure count:** Tỷ lệ thất bại khi xử lý tệp với Storage.
- **Backup success / failure status:** Trạng thái hệ thống sao lưu dự phòng định kỳ.

## 5. Alerting Proposal (Cảnh báo)
Hệ thống giám sát sẽ tự động sinh cảnh báo (Alert) dựa trên các điều kiện sau:
- **Health fail:** Endpoint `/api/health` của Backend bị down.
- **Readiness fail:** Endpoint `/api/ready` báo lỗi kết nối DB hoặc MinIO.
- **High error rate:** Tỷ lệ lỗi 5xx vượt ngưỡng an toàn.
- **Disk low:** Ổ cứng vật lý sắp đầy.
- **Backup failed:** Quá trình backup DB/Storage thất bại hoặc không diễn ra theo lịch trình.
- **Container restart loop:** Container liên tục bị crash và restart lại.

## 6. Known Limitations (Hạn chế hiện hành)
- Chưa tích hợp metrics thật vào mã nguồn (sẽ tích hợp sau).
- Chưa có hệ thống Prometheus / Grafana để trực quan hóa số liệu.
- Chưa có giải pháp Centralized Logging (ELK/Loki) để gom log từ các container vào một nơi duy nhất.
