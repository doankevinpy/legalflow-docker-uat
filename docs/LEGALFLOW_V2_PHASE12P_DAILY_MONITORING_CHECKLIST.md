# Danh Mục Rà Soát Giám Sát Vận Hành Hằng Ngày (`Daily Pilot Monitoring Checklist`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12P
## Phase 12P: Daily Pilot Monitoring & Health Checklist

> [!WARNING]
> **QUY ĐỊNH RÀ SOÁT HẰNG NGÀY (`DAILY AUDIT MANDATE`):**
> Danh mục kiểm tra này bắt buộc thực hiện **02 lần mỗi ngày làm việc (`08:00 trước giờ mở cửa thụ lý` & `17:00 chốt ca làm việc`)** bởi Quản trị viên (`IT_OPS / ADMIN`). Mọi kết quả rà soát phải ghi nhận trung thực. Nếu phát hiện bất kỳ hạng mục nào có trạng thái `FAIL` thuộc nhóm Hạ tầng hoặc Bảo mật, Quản trị viên phải lập tức báo cáo Trưởng Đội ngũ Kỹ thuật và kích hoạt cờ tạm dừng (`PILOT SUSPENDED`).

---

## 1. Thông Tin Ca Giám Sát Mẫu Chuẩn (`Standard Daily Checklist Record`)
* **Ngày kiểm tra mẫu (`Verification Date`):** `16/07/2026 (Ngày vận hành T+01)`
* **Thẻ đường cơ sở (`Rollback Baseline Tag`):** `v2.12.14-financial-obligation-controlled-pilot-activation`
* **Người thực hiện kiểm tra (`Inspector`):** `DEMO_UAT_SYSADMIN_01` (`IT_OPS Admin`)
* **Trạng thái môi trường mạng (`Network Scope`):** `Internal UAT Pilot LAN (No Public Tunnel)`

---

## 2. Bảng Rà Soát Đầu Ca Làm Việc (`08:00 Pre-Shift Health Checklist`)

| Mã Mục (`Check ID`) | Hạng Mục Rà Soát (`Audit Item`) | Phương Pháp / Câu Lệnh Kiểm Tra (`Command / Verification Method`) | Tiêu Chuẩn Đạt (`Acceptance Criteria`) | Kết Quả Kiểm Tra (`Status`) | Ghi Chú Kỹ Thuật (`Technical Notes`) | Người Ký Nhận (`Signoff`) |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **`DCHK-M01`** | **Khách quan Docker Stack** | `docker ps --format "table {{.Names}}\t{{.Status}}"` | Toàn bộ 4 container `backend, frontend, postgres, minio` đều ở trạng thái `Up (healthy)`. | **`PASS`** | 4/4 container hoạt động ổn định, RAM sử dụng trong ngưỡng an toàn (`< 65%`). | `SYSADMIN_01` |
| **`DCHK-M02`** | **Khả năng Phục vụ API & Cổng** | `netstat -ano \| findstr :3000` & `curl -I http://localhost:3000/health` | API trả về `HTTP 200 OK`; cổng 3000 và 5173 mở trên mạng nội bộ UAT. | **`PASS`** | Tốc độ phản hồi API trung bình `14ms`, không có nghẽn mạch hay xung đột cổng. | `SYSADMIN_01` |
| **`DCHK-M03`** | **Kiểm tra Cờ Tính năng (`Feature Flag`)** | `docker exec legalflow_backend env \| findstr FEATURE_FLAG_FINANCIAL` | Biến môi trường trả về `FEATURE_FLAG_FINANCIAL_OBLIGATIONS_ENABLED=true`. | **`PASS`** | Cờ phân hệ Nghĩa vụ tài chính hiển thị chính xác cho các tài khoản RBAC hợp lệ. | `SYSADMIN_01` |
| **`DCHK-M04`** | **Dung lượng Ổ cứng & MinIO Storage** | `docker exec legalflow_minio df -h /data` | Dung lượng trống đạt `> 75%`; Bucket `legalflow-documents` có quyền `Read/Write`. | **`PASS`** | Dung lượng MinIO trống `82%`, đủ khả năng lưu trữ chứng từ scan cho 08 ca DEMO. | `SYSADMIN_01` |
| **`DCHK-M05`** | **Rà soát Trang thái Cân bằng DB** | `docker exec legalflow_postgres pg_isready -U legalflow` | Trả về `accepting connections`; không có kết nối treo hay deadlock. | **`PASS`** | Postgres DB hoạt động mượt mà, pool kết nối duy trì ở mức `6/20`. | `SYSADMIN_01` |

---

## 3. Bảng Rà Soát Cuối Ca Làm Việc (`17:00 Post-Shift Compliance & Audit Checklist`)

| Mã Mục (`Check ID`) | Hạng Mục Rà Soát (`Audit Item`) | Phương Pháp / Câu Lệnh Kiểm Tra (`Command / Verification Method`) | Tiêu Chuẩn Đạt (`Acceptance Criteria`) | Kết Quả Kiểm Tra (`Status`) | Ghi Chú Kỹ Thuật (`Technical Notes`) | Người Ký Nhận (`Signoff`) |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **`DCHK-E01`** | **Đối chiếu Gia tăng Nhật ký Kiểm toán (`Audit Log Increment`)** | Kiểm tra số lượng bản ghi mới trong bảng `financial_obligation_audit_logs`. | Số lượng dòng tăng lên khớp chính xác 100% với số lượng thao tác thụ lý hồ sơ DEMO trong ngày. | **`PASS`** | Ghi nhận tăng **18 bản ghi mới**, khớp hoàn toàn với thao tác trên 8 ca `DEMO-FO-UAT-01..08`. | `SYSADMIN_01` |
| **`DCHK-E02`** | **Kiểm tra Ranh giới Pháp lý (`No Official Amount & Tax Notice`)** | Rà soát trường `officialAmount` trong DB và log xuất báo cáo. | `100% officialAmount IS NULL`; không có bất kỳ lệnh gửi email/SMS thông báo thuế tự động nào được thực thi. | **`PASS`** | Tất cả 08 ca DEMO đều duy trì ranh giới banner vàng, không có số tiền pháp lý chính thức. | `SYSADMIN_01` |
| **`DCHK-E03`** | **Kiểm tra Thao tác Vượt quyền (`Unauthorized Access Audit`)** | Kiểm tra nhật ký lỗi API trả về `HTTP 401 Unauthorized` và `HTTP 403 Forbidden`. | Mọi nỗ lực truy cập trái phép hoặc vượt quyền đều bị rào chắn chặn lại thành công và ghi vết đầy đủ. | **`PASS`** | Ghi nhận 02 lần `HTTP 403` khi cán bộ thử bấm nút hoàn thành chưa thẩm định (Rào chắn chặn chuẩn). | `SYSADMIN_01` |
| **`DCHK-E04`** | **Kiểm tra Tính Toàn Vẹn Dữ Liệu (`Data Integrity Check`)** | Kiểm tra tổng số bản ghi thủ tục hành chính thật (`TTHC-2026-*`) và bản ghi demo (`DEMO-FO-UAT-*`). | Dữ liệu công dân thật hoàn toàn không bị tác động (`RPO = 0`); chỉ có 08 ca demo phát sinh dữ liệu thử nghiệm. | **`PASS`** | Bảng `administrative_procedures` duy trì nguyên bản 100% cho hồ sơ thật. | `SYSADMIN_01` |
| **`DCHK-E05`** | **Rà soát Ngưỡng Dừng Khẩn Cấp (`Emergency Stop Conditions`)** | Đối chiếu danh sách 08 điều kiện dừng (`STOP-01 to STOP-08`). | `0 / 08 điều kiện dừng bị kích hoạt`. Hệ thống duy trì độ ổn định tuyệt đối. | **`PASS`** | Không xuất hiện bất kỳ rủi ro hay sự cố nào đạt ngưỡng đình chỉ đợt thí điểm. | `SYSADMIN_01` |

---

## 4. Khối Ký Xác Nhận Kết Thúc Ca Giám Sát (`Daily Audit Signoff Block`)

| Trách Nhiệm Ký (`Signoff Role`) | Họ Tên & Mã Tài Khoản (`Inspector Name / ID`) | Ý Kiến Đánh Giá (`Assessment Opinion`) | Trạng Thái Phán Quyết (`Daily Verdict`) | Chữ Ký Xác Nhận (`Signature`) |
| :--- | :--- | :--- | :---: | :---: |
| **SYSADMIN_INSPECTOR** | Cán bộ Quản trị Hạ tầng UAT (`SYSADMIN_01`) | *"Hạ tầng 4 container hoạt động mượt mà, log kiểm toán đầy đủ, không phát sinh xung đột tài nguyên."* | **`PASS / HEALTHY`** | *[Đã xác nhận trên log UAT]* |
| **PILOT_UNIT_LEAD** | Lãnh đạo Bộ phận Một cửa & Tài nguyên | *"Các rào chắn nghiệp vụ hoạt động ổn định, 08 hồ sơ demo thụ lý suôn sẻ, không bị ảnh hưởng hồ sơ thật."* | **`PASS / COMPLIANT`** | *[Đã xác nhận trên log UAT]* |

> **KẾT LUẬN CUỐI NGÀY T+01:** Toàn bộ 10 hạng mục rà soát (`DCHK-M01..M05` và `DCHK-E01..E05`) đạt chuẩn **`100% PASS`**. Không phát sinh sự cố `Critical/High`. Phán quyết vận hành: **`PILOT MONITORING CONTINUED (HEALTHY)`**.
