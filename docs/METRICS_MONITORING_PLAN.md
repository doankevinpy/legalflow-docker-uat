# Kế hoạch Giám sát và Đo lường (Metrics & Monitoring Plan)

## 1. Metrics Endpoint Strategy
- **Trạng thái hiện tại**: Endpoint `/metrics` **CHƯA** được triển khai trong Phase 9.2.
- **Yêu cầu bảo mật khi triển khai**:
  - Endpoint `/metrics` phải là **internal-only** hoặc được bảo vệ (protected) chặt chẽ bằng xác thực nội bộ.
  - **TUYỆT ĐỐI KHÔNG** được public qua Caddy (Internet route). Caddy phải drop bất kỳ request ngoại mạng nào tới đường dẫn này.
  - Nhãn (Labels) của metrics **KHÔNG ĐƯỢC CHỨA** PII (thông tin cá nhân), token, `minioKey`, presigned URL hay dữ liệu nhạy cảm.

## 2. Nhóm Metrics Cần Đo (Metrics Groups)
Khi hệ thống metrics được kích hoạt, cần thu thập các chỉ số sau:
1. **HTTP request count**: Tổng số request HTTP (phân chia theo method, status, path).
2. **HTTP latency**: Độ trễ xử lý request HTTP (histogram/summary).
3. **HTTP error count/rate**: Số lượng và tỷ lệ các lỗi 4xx, 5xx.
4. **Upload success/failure**: Bộ đếm cho luồng upload tài liệu thành công và thất bại.
5. **Download presigned URL generation success/failure**: Bộ đếm cho việc sinh URL thành công và thất bại.
6. **DB readiness status**: Trạng thái kết nối DB (Gauge: 1 = UP, 0 = DOWN).
7. **MinIO readiness status**: Trạng thái kết nối MinIO (Gauge: 1 = UP, 0 = DOWN).
8. **Backup drill status**: Trạng thái thành công/thất bại của cronjob backup mô phỏng (drill).
9. **Container health/restart count**: Các chỉ số ở mức hạ tầng, thu thập thông qua cAdvisor hoặc Docker daemon (không lấy từ backend app).

## 3. Chiến lược Prometheus/Grafana
- **Môi trường**: Chỉ triển khai trước cho local/staging. Môi trường production sẽ được cấu hình sau khi đã ổn định.
- **Docker Compose Profile**: Đặt các dịch vụ observability (Prometheus, Grafana) vào một Docker Compose profile riêng biệt (ví dụ: `--profile observability`).
- **Tối ưu tài nguyên**: Không bật stack observability theo mặc định khi khởi chạy full stack để tiết kiệm tài nguyên hệ thống.
- **Quản lý cấu hình & Mật khẩu**: Không commit Grafana admin password thật vào repository. Mật khẩu phải được cấp phát thông qua biến môi trường.
- **Retention Policy**: Thiết lập thời gian lưu trữ dữ liệu giới hạn (ví dụ: 15 ngày) để tránh cạn kiệt dung lượng ổ đĩa.
- **Dashboard an toàn**: Các cấu hình Dashboard (provisioning files) tuyệt đối không chứa secret hay mật khẩu tĩnh.

## 4. Quản trị Rủi ro (Risks & Mitigation)
- **Rủi ro Metrics endpoint bị public**: Khắc phục bằng thiết kế deny-by-default trên Caddy proxy.
- **Rủi ro Labels lộ PII**: Tuân thủ nghiêm ngặt nguyên tắc chỉ gán label tĩnh (như route paths `/users/:id`), không gán label theo giá trị động (như `/users/123` hay email).
- **Rủi ro Resource overhead**: Khắc phục bằng Docker profile, chỉ boot khi cần phân tích/debug.
- **Rủi ro Dashboard lộ operational details**: Sử dụng generic variable names trong dashboard, tránh lộ topology hạ tầng cụ thể khi share snapshot.
