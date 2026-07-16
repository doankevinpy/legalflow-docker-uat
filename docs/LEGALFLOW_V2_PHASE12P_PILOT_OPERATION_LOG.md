# Nhật Ký Giám Sát Vận Hành Thí Điểm Có Kiểm Soát (`Controlled Pilot Operation Log`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12P
## Phase 12P: Controlled Pilot Operation & Case Activity Log

> [!CAUTION]
> **TÚYÊN BỐ PHẠM VI DỮ LIỆU NHẬT KÝ (`OPERATION LOG SCOPE & LEGAL BOUNDARY`):**
> Nhật ký này ghi nhận toàn bộ hoạt động kiểm thử, rà soát nghiệp vụ và các sự kiện rào chắn phát sinh trong quá trình vận hành thí điểm Phân hệ Nghĩa vụ tài chính. Tuân thủ tuyệt đối quy tắc Phase 12P: **100% CÁC BẢN GHI DƯỚI ĐÂY LÀ HỒ SƠ MÔ PHỎNG (`DEMO-FO-UAT-01..08`)**, **KHÔNG CHỨA THÔNG TIN CÔNG DÂN THẬT**, **KHÔNG CÓ TÁC ĐỘNG ĐẾN HỒ SƠ THẬT (`TTHC-2026-*`)**, và **KHÔNG BAN HÀNH QUYẾT ĐỊNH HÀNH CHÍNH THƯỢNG TẦNG**.

---

## 1. Thông Tin Đường Cơ Sở & Thiết Lập Ca Nhật Ký (`Log Session Baseline`)
* **Thẻ đường cơ sở (`Rollback Baseline Tag`):** `v2.12.14-financial-obligation-controlled-pilot-activation`
* **Môi trường ghi vết (`Environment`):** `Internal UAT Dedicated Server (TCP 3000/5173/9000/5432)`
* **Thời gian ghi nhật ký mẫu (`Log Window`):** `Từ 08:30 đến 16:45 ngày 16/07/2026 (Ngày T+01 Pilot)`

---

## 2. Bảng Theo Dõi Diễn Biến Thụ Lý 08 Hồ Sơ Mô Phỏng (`Demo Cases Activity Log`)

Dưới đây là nhật ký chi tiết quá trình xử lý 08 hồ sơ demo từ khâu tiếp nhận đến thẩm định và hoàn thành thủ tục:

| Thời Gian (`Timestamp`) | Mã Hồ Sơ Demo (`Demo Case ID`) | Tài Khoản Thao Tác (`Actor ID`) | Vai Trò RBAC (`Assigned Role`) | Hành Động Nghiệp Vụ (`Action Taken`) | Phản Hồi API / Hệ Thống (`System Response`) | Trạng Thái Rào Chắn (`Guardrail Status`) | Đối Chiếu Audit Log DB (`Audit Trail Check`) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **08:45:12** | `DEMO-FO-UAT-01` | `RECEIVER_01` | `RECEIVING_OFFICER` | Truy cập trang chiết tính nháp và tải lên bản scan thông báo thuế mô phỏng (`scan_tb_01.pdf`). | `HTTP 200 OK / Scan Uploaded Successfully` | **`PASS`** *(Banner vàng hiển thị đúng rào chắn)* | **`VERIFIED`** (`UPLOAD_TAX_NOTICE_SCAN`, Actor: `RECEIVER_01`) |
| **09:15:00** | `DEMO-FO-UAT-02` | `RECEIVER_01` | `RECEIVING_OFFICER` | Tải lên chứng từ nộp tiền mô phỏng (`scan_nt_02.pdf`) và chuyển hồ sơ sang bộ phận thẩm định. | `HTTP 200 OK / Status -> PENDING_VERIFICATION` | **`PASS`** *(Chặn quyền tự bấm duyệt của Receiver)* | **`VERIFIED`** (`SUBMIT_FOR_VERIFICATION`, Actor: `RECEIVER_01`) |
| **09:40:22** | `DEMO-FO-UAT-03` | `REVIEWER_01` | `REVIEWING_OFFICER` | Rà soát đối chiếu số tiền trên Giấy nộp tiền khớp với Thông báo thuế; bấm xác nhận hợp lệ. | `HTTP 200 OK / OFFICER_VERIFIED -> true` | **`PASS`** *(Yêu cầu nhập lý do xác nhận đầy đủ)* | **`VERIFIED`** (`VERIFY_PAYMENT_EVIDENCE`, Actor: `REVIEWER_01`) |
| **10:12:05** | `DEMO-FO-UAT-04` | `REVIEWER_01` | `REVIEWING_OFFICER` | **[THỬ NGHIỆM RÀO CHẮN]** Thử nhấn nút "Hoàn thành thủ tục" khi chưa bấm xác nhận chứng từ (`OFFICER_VERIFIED = false`). | **`HTTP 400 Bad Request` / Nút UI bị khóa mờ (`Disabled`)** | **`GUARDRAIL TRIGGERED` (BLOCKED SUCCESS)** | **`VERIFIED`** (`BLOCKED_COMPLETION_ATTEMPT`, Reason: `Officer verification missing`) |
| **10:35:18** | `DEMO-FO-UAT-04` | `REVIEWER_01` | `REVIEWING_OFFICER` | Thực hiện xác nhận chứng từ đầy đủ (`OFFICER_VERIFIED -> true`), sau đó nhấn hoàn thành thủ tục. | `HTTP 200 OK / Procedure -> COMPLETED` | **`PASS`** *(Cho phép hoàn thành khi đủ điều kiện)* | **`VERIFIED`** (`COMPLETE_PROCEDURE`, Actor: `REVIEWER_01`) |
| **13:30:00** | `DEMO-FO-UAT-05` | `REVIEWER_01` | `REVIEWING_OFFICER` | Phát hiện hồ sơ thuộc dạng nợ đọng kéo dài rủi ro cao; bấm yêu cầu Lãnh đạo phê duyệt kép. | `HTTP 200 OK / Status -> PENDING_MANAGER_REVIEW` | **`PASS`** *(Chặn quyền tự hoàn thành ca rủi ro)* | **`VERIFIED`** (`REQUEST_MANAGER_REVIEW`, Actor: `REVIEWER_01`) |
| **14:15:40** | `DEMO-FO-UAT-05` | `MANAGER_01` | `APPROVAL_MANAGER` | Lãnh đạo rà soát hồ sơ nợ đọng, đối chiếu chứng từ giải tỏa kho bạc; bấm phê duyệt kép (`MANAGER_APPROVED -> true`). | `HTTP 200 OK / MANAGER_APPROVED -> true` | **`PASS`** *(Ghi nhận chính xác chữ ký số Lãnh đạo)* | **`VERIFIED`** (`MANAGER_DUAL_APPROVAL`, Actor: `MANAGER_01`) |
| **15:00:10** | `DEMO-FO-UAT-06` | `RECEIVER_01` | `RECEIVING_OFFICER` | Kiểm tra hiển thị chiết tính nháp cho ca tách thửa đất ở đô thị; kiểm tra tính năng xuất phiếu kiểm soát nháp. | `HTTP 200 OK / Draft PDF Generated` | **`PASS`** *(Phiếu in đóng dấu chìm `DỰ KIẾN NHÁP`)* | **`VERIFIED`** (`GENERATE_DRAFT_CONTROLLER_SLIP`) |
| **15:45:30** | `DEMO-FO-UAT-07` | `REVIEWER_01` | `REVIEWING_OFFICER` | Đối chiếu chứng từ nộp tiền qua Cổng DVC Quốc gia cho ca chuyển nhượng đất nông nghiệp; xác nhận và hoàn thành. | `HTTP 200 OK / Procedure -> COMPLETED` | **`PASS`** *(Khớp chính xác số tham chiếu DVC)* | **`VERIFIED`** (`COMPLETE_PROCEDURE`, Actor: `REVIEWER_01`) |
| **16:20:00** | `DEMO-FO-UAT-08` | `SYSADMIN_01` | `ADMIN / IT_OPS` | **[KIỂM TRA BẢO MẬT]** Thử gọi endpoint cập nhật trực tiếp vào trường `officialAmount` qua lệnh API `curl` ngầm. | **`HTTP 403 Forbidden` / `ERROR: officialAmount modification strictly prohibited`** | **`GUARDRAIL TRIGGERED` (SECURITY BOUNDARY)** | **`VERIFIED`** (`SECURITY_ALERT_UNAUTHORIZED_AMOUNT_MUTATION`) |

---

## 3. Tổng Hợp Thao Tác Bị Rào Chắn Từ Chối / Chặn (`Guardrail Blocked Actions Log`)

Trong ngày vận hành giám sát đầu tiên, hệ thống đã phát hiện và chặn đứng thành công **02 nỗ lực thao tác** vượt ngưỡng rào chắn (`100% Guardrail Efficacy Rate`):

1. **Sự kiện `BLOCK-LOG-12P-01` (`Ngăn hoàn thành khi thiếu thẩm định chứng từ`):**
   - **Tài khoản thao tác:** `REVIEWER_01` trên hồ sơ `DEMO-FO-UAT-04` lúc 10:12:05.
   - **Hành vi:** Nhấn nút "Hoàn thành thủ tục" khi cờ `OFFICER_VERIFIED` vẫn ở trạng thái `false`.
   - **Cơ chế rào chắn:** Giao diện lập tức khóa mờ nút bấm, đồng thời Backend trả về lỗi `HTTP 400 Bad Request: Thủ tục chưa được thẩm định chứng từ nộp tiền`.
   - **Kết quả bảo vệ:** Ngăn chặn tuyệt đối tình trạng hồ sơ tự động đóng khi cán bộ chưa rà soát đối chiếu kho bạc.

2. **Sự kiện `BLOCK-LOG-12P-02` (`Ngăn ghi đè hoặc can thiệp trường officialAmount`):**
   - **Tài khoản thao tác:** `SYSADMIN_01` lúc 16:20:00 (lệnh kiểm thử bảo mật ngầm).
   - **Hành vi:** Gửi payload API cố gắng gán `officialAmount = 45000000` vào DB của `DEMO-FO-UAT-08`.
   - **Cơ chế rào chắn:** Trục bảo mật API của LegalFlow v2.12 từ chối payload trả về `HTTP 403 Forbidden: officialAmount mutation strictly prohibited`.
   - **Kết quả bảo vệ:** Bảo đảm 100% ranh giới pháp lý, khẳng định hệ thống chỉ hỗ trợ tính nháp dự kiến, không thay thế cơ quan thuế ban hành số tiền chính thức.

---

## 4. Kiểm Báo Bất Biến Dữ Liệu Thực Tế (`Zero Real-Data Mutation Verification`)
Tại thời điểm chốt nhật ký 16:45, Quản trị viên đối chiếu tổng số bản ghi trong bảng `administrative_procedures`:
* **Số lượng hồ sơ thật (`TTHC-2026-*`):** Exactly **03 bản ghi** (`TTHC-2026-0001, 0002, 0003`) -> Trạng thái cấu trúc và dữ liệu duy trì **nguyên bản 100% (`RPO = 0 / No Mutations`)**.
* **Số lượng hồ sơ mô phỏng (`DEMO-FO-UAT-*`):** Exactly **08 bản ghi** (`DEMO-FO-UAT-01..08`) -> Toàn bộ thao tác kiểm thử chỉ diễn ra trong phạm vi an toàn này.

---

## 5. Ký Nhận Của Trưởng Nhóm Giám Sát Ca Làm Việc (`Shift Log Signoff`)
* **Xác nhận của Quản trị viên (`SYSADMIN_01`):** *"Nhật ký ghi nhận 100% trung thực. Các thao tác đều để lại dấu vết rõ ràng trong `audit_logs`."*
* **Xác nhận của Trưởng Đội ngũ Kỹ thuật (`TECH_LEAD`):** *"Các rào chắn bảo mật và nghiệp vụ hoạt động chính xác theo thiết kế Phase 12P. Không phát sinh bất kỳ lỗi can thiệp DB trái phép nào."*
