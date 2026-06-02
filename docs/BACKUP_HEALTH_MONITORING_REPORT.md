# Backup Health Monitoring Report

**Version**: v1.12.0-weekday-scheduled-backup-enabled  
**Patch Commit**: `c677364`  
**Date**: 2026-06-02  
**Environment**: Local / UAT  
**Status**: Health Check Script Created & Verified  

---

## 1. Scope

* **Môi trường giám sát:** Bản sao lưu cục bộ/UAT (Local/UAT backup health monitoring).
* **Lịch biểu chạy:** Nhận diện lịch hoạt động các ngày trong tuần Thứ Hai đến Thứ Sáu lúc 09:00 (Weekdays 09:00 schedule aware).
* **Ngày nghỉ cuối tuần:** Không phát cảnh báo lỗi giả vào Thứ Bảy và Chủ Nhật (No weekend false alarm).
* **Cảnh báo từ xa:** Không gửi webhook hoặc cảnh báo cloud trong giai đoạn này (No webhook/cloud alert in this phase).

---

## 2. Script Details & Policy (Thông tin Script)

Script giám sát sức khỏe bản sao lưu mới nhất được cài đặt tại [check-latest-backup-health.ps1](file:///C:/Users/Admin/.gemini/antigravity/scratch/LegalFlow/scripts/check-latest-backup-health.ps1):
* **Quy tắc Exit Code:**
  * **`0` (PASS):** Bản sao lưu thành công gần nhất khỏe mạnh và mới.
  * **`2` (WARNING):** Cảnh báo vận hành (bản backup bị cũ quá 36 giờ, hoặc quá giờ ân hạn 10:00 sáng Thứ Hai mà chưa có backup mới của ngày Thứ Hai).
  * **`1` (FAIL):** Lỗi nghiêm trọng (mất tệp manifest, sai lệch mã hash, hoặc xuất hiện folder lỗi mới hơn folder thành công).

---

## 3. Dummy Validation Results (Kết quả chạy giả lập)

Script đã vượt qua 6 kịch bản thử nghiệm giả lập (Dummy scenarios) với kết quả chính xác:

1. **FreshWeekday:** Giả lập Thứ Ba, backup thành công cách 2.5 giờ. Kết quả: **PASS** (Exit 0) ✅
2. **StaleWeekday:** Giả lập Thứ Tư, backup thành công cách 48.5 giờ (> 36 giờ). Kết quả: **WARNING** (Exit 2) ✅
3. **MondayBeforeGrace:** Giả lập Thứ Hai 08:30 sáng, backup gần nhất từ Thứ Sáu (~71.5 giờ). Kết quả: **PASS** (Exit 0) ✅
4. **MondayAfterGrace:** Giả lập Thứ Hai 11:30 trưa, chưa có backup mới cho ngày Thứ Hai. Kết quả: **WARNING** (Exit 2) ✅
5. **FailedNewer:** Thư mục lỗi (`status.failed`) được tạo ra sau bản success gần nhất. Kết quả: **FAIL** (Exit 1) ✅
6. **ManifestMismatch:** Checksum file `manifest.sha256` chứa sai hash của tệp dữ liệu. Kết quả: **FAIL** (Exit 1) ✅

---

## 4. Real Verification Results (Xác minh trên dữ liệu thật)

Chạy thực tế script chống lại thư mục sao lưu UAT thực tế tại `LegalFlow_ARTIFACTS/backups`:
* **Trạng thái (Status):** **PASS** (Exit Code: `0`) ✅
* **Tên thư mục thành công gần nhất:** `20260602_091424` (tạo từ Phase 9.6D).
* **Tuổi bản backup gần nhất:** **0.5 giờ (30 phút)** tại thời điểm chạy. ✅
* **Kết quả xác minh Manifest:** **PASS** (Checksum verified thành công cho cả tệp Postgres dump và các tệp MinIO PDF). ✅
* **Kết quả kiểm tra Failed-Newer:** **PASS** (Không có thư mục lỗi nào mới hơn bản success). ✅
* **Git Status:** Sạch sẽ (`working tree clean`). ✅

---

## 5. Known Limitations (Hạn chế đã biết)

* **Không có webhook/email:** Chưa cấu hình cảnh báo đẩy từ xa lên các hệ thống giám sát hoặc chat apps.
* **Không tự động sửa lỗi (No auto-repair):** Khi phát hiện lỗi hoặc cảnh báo, script chỉ hiển thị trạng thái và không can thiệp sửa chữa dữ liệu.
* **Không thực hiện dọn dẹp (No cleanup execution):** Script chỉ kiểm tra tính hợp lệ của bản backup cũ mà không thực hiện xóa bỏ vật lý.
* **Không hỗ trợ Cloud/S3:** Chỉ hỗ trợ giám sát bản sao lưu trên bộ nhớ cục bộ (local backup root).

---

## 6. Security Safeguards (Bảo mật & Phòng ngừa)

* **Không commit dữ liệu:** Tuyệt đối không commit tệp ZIP/SHA256 hoặc thư mục `LegalFlow_ARTIFACTS` chứa dữ liệu backup vào Git.
* **Không lưu secrets:** Không in thông tin nhạy cảm (như key hay URL kết nối) vào logs hoặc báo cáo.
* **Chỉ in siêu dữ liệu (Metadata only):** Chỉ in các thông tin an toàn bao gồm tên thư mục, tuổi đời bản sao lưu và danh sách file dữ liệu được so khớp checksum.
