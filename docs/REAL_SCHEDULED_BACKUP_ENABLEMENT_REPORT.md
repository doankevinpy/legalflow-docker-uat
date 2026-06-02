# Real Scheduled Backup Enablement Report

**Version**: v1.12.0-weekday-scheduled-backup-enabled  
**Patch Commit**: `ad5d5c6`  
**Date**: 2026-06-02  
**Environment**: Local / UAT / Windows Task Scheduler  
**Status**: Real Registration Enabled & Verified  

---

## 1. Scope

* **Môi trường:** Chỉ áp dụng trên môi trường cục bộ/UAT (Local/UAT only).
* **Trạng thái lịch biểu:** Tác vụ sao lưu tự động hàng ngày thực tế đã được đăng ký và kích hoạt chạy nền thành công (Real scheduled backup enabled).
* **Đồng bộ hóa đám mây:** Không đồng bộ lên dịch vụ Cloud/S3 thực tế (No cloud/S3 sync).
* **Dữ liệu kiểm thử:** Không sử dụng dữ liệu sản xuất thực tế (No production data).

---

## 2. Schedule & Task Settings (Cấu hình lịch biểu)

Tác vụ được đăng ký dưới tên `LegalFlow_AutomatedBackup` trong Windows Task Scheduler với các cấu hình tối ưu hóa vận hành:
* **Tần suất chạy (Frequency):** Thứ Hai đến Thứ Sáu hàng tuần (`Weekdays` - không chạy Thứ Bảy và Chủ Nhật).
* **Thời gian trigger (Time):** **09:00** hàng ngày.
* **Cơ chế tự động chạy lại (Retry settings):** Tự động thử lại **3 lần** (RestartCount: 3), mỗi lần cách nhau **30 phút** (RestartInterval: 30 minutes) nếu tác vụ thoát với mã lỗi khác 0.
* **Giới hạn thời gian chạy (Execution timeout):** Tối đa **2 giờ** (ExecutionTimeLimit: 2 hours). Tác vụ sẽ bị tắt cưỡng bức nếu chạy vượt quá thời gian này để bảo vệ tài nguyên hệ thống.
* **Xử lý song song (Multiple Instances Policy):** **IgnoreNew** (Không khởi chạy phiên bản mới nếu phiên bản cũ đang chạy).

---

## 3. Manual Validation Run (Chạy kiểm thử thủ công)

Để xác minh cấu hình chạy thực tế, tác vụ đã được kích hoạt thủ công thông qua lệnh `Start-ScheduledTask` vào lúc `09:14` sáng ngày 2026-06-02:
* **LastTaskResult:** `0` (SUCCESS) — Tác vụ hoàn thành thành công.
* **LastRunTime:** `2026-06-02 09:14:23`
* **NextRunTime:** `2026-06-03 09:00:00` (Ngày làm việc tiếp theo lúc 09:00)
* **Số lượng thư mục backup:** Tăng từ **6** lên **7** thư mục.
* **Đường dẫn thư mục lưu trữ ngoài repo:** `C:\Users\Admin\.gemini\antigravity\scratch\LegalFlow_ARTIFACTS\backups\20260602_091424`
* **Kết quả chi tiết phần Postgres backup:** **PASS** (Tạo tệp SQL dump thành công với kích thước `26,736 bytes`).
* **Kết quả chi tiết phần MinIO backup:** **PASS** (Đồng bộ thành công `5` tệp tin PDF giả lập trong bucket cases).
* **Trạng thái manifest/status:**
  * File checksum `manifest.sha256` được tạo thành công và chứa thông tin hash của các tệp tin backup.
  * File trạng thái `status.success` được ghi nhận.
  * Không xuất hiện file lỗi `status.failed`.

---

## 4. Verification (Xác minh an toàn)

* **`verify-latest-backup.ps1` (dry-run):** **PASS** — Xác nhận khớp mã hash SHA256 của tệp dump database và tệp đồng bộ của bản backup mới.
* **`cleanup-old-backups.ps1` (dry-run):** **PASS** — Nhận diện chính xác thư mục backup mới nhất là an toàn, không thực hiện xóa tệp tin nào.
* **`scan-container-logs-for-secrets.ps1`:** **PASS** — Không phát hiện bất kỳ thông tin nhạy cảm hay thông tin đăng nhập nào bị lộ lọt trong log của container.
* **Git Status:** Sạch sẽ (`working tree clean`), không có tệp tin ZIP/SHA256 hay file backup nào bị commit nhầm vào repo.

---

## 5. Retention Decision (Quyết định duy trì)

* Tác vụ `LegalFlow_AutomatedBackup` **được giữ lại ở trạng thái ENABLED** trên Windows Task Scheduler để tiếp tục chạy tự động hàng ngày lúc 09:00 từ Thứ Hai đến Thứ Sáu.
* **Lệnh hoàn tác (Rollback Command) khi cần gỡ bỏ task:**
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts/register-windows-task.ps1 -Unregister -Execute
  ```
  *(Lưu ý: Lệnh rollback không xóa các bản sao lưu vật lý đã được tạo ngoài repo)*

---

## 6. Known Risks (Rủi ro đã biết)

1. **Docker stack tắt lúc 09:00:** Nếu Docker Desktop hoặc các container của LegalFlow không chạy trước 09:00, tác vụ sao lưu sẽ thất bại (ghi nhận lỗi `postgres_backup_failed`).
2. **Cơ chế tự động thử lại:** Chính sách thử lại (retry) 3 lần giúp giảm thiểu rủi ro khi stack khởi động chậm hoặc quá tải tạm thời, nhưng không thể thay thế cho việc giám sát trạng thái container.
3. **Chính sách không backup cuối tuần:** Việc không có bản sao lưu vào Thứ Bảy/Chủ Nhật là chủ động và phù hợp với lịch nghỉ vận hành.
4. **Giám sát sức khỏe:** Cần xây dựng kịch bản kiểm tra sức khỏe bản backup phù hợp ở Phase 9.7 sắp tới.

---

## 7. Security Safeguards (Bảo mật & Phòng ngừa)

* **Không lưu trữ thông tin đăng nhập:** Tác vụ chạy trực tiếp dưới quyền Interactive User hiện hành (`Admin`), không lưu trữ mật-khẩu hay Windows Credentials trong Task Definition.
* **Cô lập thư mục sao lưu:** Toàn bộ thư mục `LegalFlow_ARTIFACTS` nằm ngoài Git repository, loại trừ hoàn toàn khả năng vô tình push mã nguồn chứa dữ liệu backup lên remote.
* **Không lưu trữ secrets:** Không có bất kỳ thông tin cấu hình nhạy cảm nào (như key hay URL kết nối) được ghi nhận vào logs hoặc báo cáo.
