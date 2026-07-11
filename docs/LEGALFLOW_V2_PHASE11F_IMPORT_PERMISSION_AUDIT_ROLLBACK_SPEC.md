# LEGALFLOW V2 - PHASE 11F
# IMPORT PERMISSION, AUDIT & ROLLBACK SPEC

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11F Standard`  
**Ngày ban hành Đặc tả:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPORT PERMISSION, AUDIT & ROLLBACK SPECIFICATION`** *(Đặc tả Quy chuẩn Phân quyền, Nhật ký Kiểm toán & Chiến lược Phục hồi / Quay lui Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Đặc tả Quy chuẩn Phân quyền, Nhật ký Kiểm toán & Chiến lược Phục hồi Nạp Tri thức Pháp lý (`Import Permission, Audit & Rollback Specification` - Phase 11F) của hệ thống LegalFlow V2. Tài liệu thiết lập ranh giới bảo mật nghiêm ngặt đối với công cụ nạp dữ liệu pháp lý (`Role-Based Access Control - RBAC`), đặc tả các yêu cầu kiểm chứng đa bước (`Multi-step Confirmation`), chuẩn hóa 13 trường dữ liệu bắt buộc cho nhật ký kiểm toán bất biến (`Audit Trail Requirements`), ban hành chiến lược quay lui an toàn (`Rollback Strategy`) và quy định 8 điều kiện dừng khẩn cấp (`Stop Conditions`) nhằm đảm bảo sự an toàn tuyệt đối và tính có thể phục hồi 100% cho kho tri thức Khối 3.2.

---

## 2. Permission Rules

Bảng đặc tả phân quyền thao tác công cụ import theo 4 vai trò hệ thống (`8-Action RBAC Permission Rules Table`):

| Action (`Import Tool Operation`) | Allowed Role | Not Allowed Role | Required Confirmation | Notes & Security Guard Check |
| :--- | :---: | :---: | :---: | :--- |
| **1. View import template (`Download Template`)** | `ADMIN`, `MANAGER`, `STAFF` | `VIEWER` *(trừ khi cấp quyền)* | *NO* | Chuyên viên Pháp chế (`STAFF`) được phép tải file mẫu 29 cột để chuẩn bị dữ liệu. |
| **2. Run dry-run validation (`Check CSV File`)** | `ADMIN`, `MANAGER` | `STAFF`, `VIEWER` | *NO* *(Read-Only)* | Chỉ Quản trị viên và Lãnh đạo Phòng được quyền chạy kiểm định tĩnh file CSV trên UI. |
| **3. Submit import request (`Upload Batch to Staging`)** | `ADMIN` | `MANAGER`, `STAFF`, `VIEWER` | **YES** *(Checklist sign-off)* | Kỹ thuật viên / Quản trị viên (`ADMIN`) chịu trách nhiệm nạp lô dữ liệu hợp lệ vào vùng chờ Staging. |
| **4. Approve import (`Review Dry-Run & Authorize`)** | `MANAGER` | `ADMIN`, `STAFF`, `VIEWER` | **YES** *(Digital Sign-off)* | Lãnh đạo Phòng (`MANAGER`) thẩm định Báo cáo Dry-Run và chấp thuận cho nạp batch. |
| **5. Execute import (`Commit Batch to Staging DB`)** | `ADMIN` | `MANAGER`, `STAFF`, `VIEWER` | **YES** *(Multi-step text + Backup confirm)* | Thực thi Prisma transaction nạp lô dữ liệu `Approved` vào DB (cờ `active_candidate = false`). |
| **6. View import report / history (`Audit Log Access`)** | `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` | *None* | *NO* | Tất cả người dùng trong nội bộ cơ quan được quyền xem lịch sử và báo cáo nạp để bảo đảm tính minh bạch. |
| **7. Activate version (`Activate Legal Document Live`)** | `MANAGER` | `ADMIN`, `STAFF`, `VIEWER` | **YES** *(Individual workflow sign-off)* | **Chỉ Lãnh đạo Phòng (`MANAGER`)** có quyền ký duyệt chuyển cờ `status = ACTIVE` cho từng văn bản. |
| **8. Rollback version / batch (`Revert Ingested Data`)** | `MANAGER` *(Approve)* + `ADMIN` *(Execute)* | `STAFF`, `VIEWER` | **YES** *(Mandatory Reason + Backup)* | Phân quyền kép: `MANAGER` quyết định bãi bỏ/quay lui; `ADMIN` thực thi lệnh kỹ thuật. |

### 5 Nguyên tắc Phân quyền Bất khả xâm phạm (`5 Inviolable RBAC Mandates`):
* 🔒 **`Role.VIEWER` bị cấm import:** Tài khoản khách hoặc chỉ có quyền xem không bao giờ được phép thao tác các API kiểm tra hay nạp dữ liệu.
* 🔒 **`Role.STAFF` không được execute import thật:** Chuyên viên thụ lý thông thường không được quyền chạy lệnh nạp batch hay kích hoạt phiên bản để ngăn chặn lỗi thao tác cá nhân.
* 🔒 **`Role.MANAGER` review / approve:** Lãnh đạo Phòng chịu trách nhiệm cao nhất về mặt nội dung pháp lý (`Content Supremacy`), giữ quyền phê duyệt cho phép nạp (`Approve Import`) và quyền kích hoạt live (`Activate Version`).
* 🔒 **`Role.ADMIN` execute import sau phê duyệt:** Quản trị viên hệ thống chịu trách nhiệm về mặt kỹ thuật (`Technical Execution`), chỉ được gõ lệnh/bấm nút execute import sau khi có chữ ký phê duyệt của `MANAGER` và đã hoàn tất backup DB.
* 🔒 **`AI System` không được tự import / approve / active / rollback:** Trợ lý AI Khối 3.1 là hệ thống thụ động tham mưu (`Advisory Engine`). AI không có tài khoản RBAC, không có token thao tác và bị cấm 100% quyền gọi các endpoints nạp, duyệt, kích hoạt hoặc quay lui dữ liệu pháp lý.

---

## 3. Multi-step Confirmation

Để loại bỏ rủi ro thao tác nhầm hoặc " bấm nút vô ý" của Quản trị viên, thao tác `execute import` thực tế bắt buộc phải trải qua cơ chế xác nhận 4 bước tuần tự trên giao diện và API (`Mandatory 4-Step Import Confirmation Gate`):

```text
+---------------------------------------------------------------------------------------------+
| STEP 1: PRE-IMPORT SAFETY CHECKLIST SIGN-OFF                                                |
| [X] I confirm that all records in this batch have approval_status = 'Approved'.             |
| [X] I confirm that I have verified the Dry-Run Validation Report (0 Critical Errors).       |
| [X] I confirm that this import will NOT automatically activate any legal version to live.    |
+---------------------------------------------------------------------------------------------+
                                              |
                                              v
+---------------------------------------------------------------------------------------------+
| STEP 2: DB BACKUP CONFIRMATION GATE                                                         |
| [X] I confirm that a complete pg_dump database backup has been created prior to this import.|
| Backup File Name / Reference ID: [ pg_dump_legalflow_prod_20260711_1430.sql ]               |
+---------------------------------------------------------------------------------------------+
                                              |
                                              v
+---------------------------------------------------------------------------------------------+
| STEP 3: REASON & ACCOUNTABILITY SPECIFICATION                                               |
| Reason for Import: [ Nạp đợt 3 văn bản hướng dẫn Luật Đất đai 2024 của UBND Tỉnh X ]        |
| Responsible Officer / Approver: [ Lãnh đạo Phòng - Trần Văn B (tranvanb.manager) ]          |
+---------------------------------------------------------------------------------------------+
                                              |
                                              v
+---------------------------------------------------------------------------------------------+
| STEP 4: EXACT TEXT VERIFICATION CHALLENGE                                                   |
| Please type exactly: "I UNDERSTAND THIS WILL WRITE TO LEGAL KNOWLEDGE STAGING DB"           |
| Text Input: [ I UNDERSTAND THIS WILL WRITE TO LEGAL KNOWLEDGE STAGING DB ]                   |
+---------------------------------------------------------------------------------------------+
```

* **Yêu cầu Confirmation Text:** API `POST /legal-knowledge/import/execute` bắt buộc kiểm tra trường payload `confirmationChallengeText`. Nếu chuỗi nhập vào không khớp chính xác 100% văn bản quy định, transaction bị từ chối với mã lỗi `400 Bad Request - Challenge Failed`.
* **Yêu cầu Reason & Approver:** Không cho phép nạp lô dữ liệu nếu để trống lý do (`importReason`) hoặc thông tin Lãnh đạo phê duyệt (`approvedBy`).

---

## 4. Audit Trail Requirements

Bảng đặc tả 13 trường dữ liệu bắt buộc phải được ghi nhận vào nhật ký kiểm toán (`UpdateLog / Audit Table`) cho mỗi sự kiện nạp hoặc quay lui (`13 Mandatory Audit Trail Fields Table`):

| Audit Field (`Attribute Name`) | Required | Description (`Field Definition & Content`) | Notes & Compliance Check |
| :--- | :---: | :--- | :--- |
| **`audit_id`** | **YES** | Mã định danh duy nhất của bản ghi nhật ký kiểm toán (`AUD-IMP-20260711-001`). | UUID hoặc mã chuỗi tuần tự theo timestamp. |
| **`actor`** | **YES** | Tài khoản thực thi lệnh nạp hoặc quay lui (`admin.sys` / `tranvanb.manager`). | Ghi nhận từ JWT Token `req.user.username`. |
| **`role`** | **YES** | Vai trò của tài khoản tại thời điểm thực thi (`ADMIN` hoặc `MANAGER`). | Ghi nhận từ `req.user.role`. |
| **`action`** | **YES** | Loại hành động thực thi (`VALIDATE_DRY_RUN`, `EXECUTE_BATCH_IMPORT`, `ACTIVATE_VERSION`, `ROLLBACK_BATCH`). | Phân loại rõ nhóm thao tác đọc/validate vs. ghi DB. |
| **`timestamp`** | **YES** | Mốc thời gian chính xác đến mili-giây theo chuẩn ISO UTC `YYYY-MM-DDTHH:mm:ss.sssZ`. | Đồng bộ đồng hồ máy chủ hệ thống. |
| **`file_name`** | **YES** | Tên gốc của file CSV được tải lên và rà soát (`LEGALFLOW_V2_PHASE11F_BATCH_01.csv`). | Tạo bằng chứng đối chiếu với kho lưu trữ MinIO. |
| **`record_count`** | **YES** | Tổng số lượng dòng bản ghi được xử lý trong lô (`Total: 50, Valid: 45, Rejected: 5`). | Minh bạch hóa khối lượng dữ liệu tác động. |
| **`validation_result`** | **YES** | Trạng thái rà soát kiểm định (`PASS_WITH_WARNINGS`, `REJECTED_CRITICAL_ERRORS`). | Lưu lại kết quả Dry-Run trước nạp. |
| **`import_result`** | **YES** | Trạng thái thực thi transaction (`SUCCESS_STAGING_CREATED`, `FAILED_ROLLBACK_EXECUTED`). | Xác nhận transaction thành công hay thất bại. |
| **`reason`** | **YES** | Lý do nạp, cập nhật hoặc quay lui dữ liệu (`importReason`). | Cung cấp ngữ cảnh giải trình thanh tra. |
| **"confirmation_text"** | **YES** | Chuỗi xác nhận văn bản mà Quản trị viên đã nhập tại Bước 4 Multi-step confirmation. | Chứng minh Quản trị viên đã đọc và hiểu rõ rủi ro. |
| **`previous_version` / `new_version_candidate`** | **YES** | Danh sách ID hoặc mã hiệu các phiên bản trước đó và phiên bản ứng viên được tạo ra trong Staging. | Tạo chuỗi truy vết gia phả (`Data Lineage`). |
| **`errors_warnings`** | *NO* *(If any)* | Danh sách mã lỗi và thông báo chi tiết nếu lô nạp phát sinh cảnh báo hoặc bị từ chối. | Đóng gói JSON chi tiết phục vụ truy vết kỹ thuật. |

---

## 5. Rollback Strategy

Chiến lược và nguyên tắc xử lý quay lui (`Rollback Strategy`) khi phát hiện lỗi dữ liệu nghiêm trọng sau khi nạp:
1. 🛡️ **Rollback không được xóa audit trail (`Immutable Audit Preservation`):** Khi thực hiện lệnh `ROLLBACK_BATCH` hoặc `rollbackActivatedVersion`, hệ thống **tuyệt đối không được xóa (`No DELETE`)** các bản ghi nhật ký kiểm toán trong bảng `UpdateLog`. Lịch sử về thao tác nạp sai và thao tác quay lui phải được lưu giữ vĩnh viễn để phục vụ kiểm toán.
2. 🛡️ **Rollback phải có lý do (`Mandatory Rollback Justification`):** Lệnh quay lui bắt buộc phải đính kèm lý do giải trình rõ ràng (`rollbackReason` tối thiểu 20 ký tự, ví dụ: *"Phát hiện file CSV nạp nhầm bản dự thảo chưa có chữ ký đóng dấu chính thức của UBND Tỉnh"*).
3. 🛡️ **Rollback phải có người duyệt (`Dual-Approval Rollback Gate`):** Thao tác bãi bỏ lô dữ liệu hoặc quay lui phiên bản luật đang áp dụng phải được sự phê duyệt của Lãnh đạo Phòng (`Role.MANAGER`) trước khi Quản trị viên (`Role.ADMIN`) thực hiện.
4. 🛡️ **Rollback không tự động xóa toàn bộ dữ liệu nếu chưa có strategy (`No Blind Data Wiping`):** Lệnh quay lui batch chỉ chuyển trạng thái các bản ghi `UpdateLog` hoặc `LegalDocument` trong lô bị lỗi sang `REJECTED` / `ROLLBACKED`. Không thực hiện các lệnh `DELETE FROM LegalKnowledge` toàn cục gây mất dữ liệu nền tảng.
5. 🛡️ **Rollback phải xác định phạm vi (`Precise Rollback Scope`):** Hệ thống chỉ quay lui chính xác các bản ghi thuộc `batch_id` hoặc `source_id` bị lỗi. Các văn bản luật hợp lệ khác được nạp trước đó hoặc cùng thời điểm phải được giữ nguyên.
6. 🛡️ **Critical Error Emergency Stop & User Notification (`Emergency Circuit Breaker`):** Nếu phát hiện lỗi nghiêm trọng (chẳng hạn văn bản vừa kích hoạt gây sai lệch toàn bộ báo cáo thẩm định Khối 2), Lãnh đạo Phòng có quyền kích hoạt nút dừng khẩn cấp (`Emergency Circuit Breaker`) để chuyển `status = SUSPENDED / DRAFT` ngay lập tức, đồng thời hệ thống phát đi thông báo khẩn (`System Broadcast Banner`) cho toàn bộ cán bộ Một cửa và P2: *"Văn bản [QĐ 102/2024] đang được tạm dừng để rà soát kỹ thuật; Cán bộ tạm thời áp dụng quy định trước đó hoặc liên hệ Phòng Pháp chế"*.

---

## 6. Stop Conditions

Danh mục 8 Điều kiện Dừng Khẩn cấp (`8 Mandatory Emergency Stop Conditions`), khi xảy ra bất kỳ điều kiện nào trong số này, trình import hoặc quy trình nạp batch bắt buộc phải **tự động ngắt kết nối và hủy bỏ toàn bộ giao dịch (`Immediate Transaction Abort & Circuit Breaker`)**:
1. 🛑 **Backup chưa có (`Missing DB Backup Confirmation`):** Cờ xác nhận `confirmDbBackup` bị bỏ trống hoặc kiểm tra file dump `pg_dump` không tồn tại trên hệ thống lưu trữ.
2. 🛑 **Dữ liệu chưa approved (`Unapproved Data Presence`):** Phát hiện bất kỳ bản ghi nào trong lô nạp có trường `approval_status` khác `Approved` (`Draft`, `Pending Review`, `Rejected`).
3. 🛑 **Có lỗi Critical (`Critical Validation Errors Detected`):** Báo cáo Dry-Run phát hiện từ 1 lỗi `CRITICAL` trở lên (sai ngày ISO, sai Enum loại văn bản, khuyết ID).
4. 🛑 **Duplicate chưa xử lý (`Unresolved Duplicate Collision`):** Trùng lặp `source_id` hoặc số hiệu văn bản với DB active nhưng Quản trị viên chưa chọn phương án phân giải hợp lệ (`HOLD / REJECT`).
5. 🛑 **`legal_status` không rõ (`Ambiguous Legal Status`):** File CSV chứa văn bản mang trạng thái `Unknown` hoặc `Needs Review`.
6. 🛑 **`local_scope` không rõ (`Ambiguous Territorial Scope`):** Văn bản có địa bàn áp dụng tại địa phương nhưng bỏ trống trường `local_scope` hoặc `local_applicability`.
7. 🛑 **Người dùng không có quyền (`Unauthorized Actor / RBAC Violation`):** Tài khoản gọi API nạp là `STAFF` hoặc `VIEWER` vi phạm phân quyền `RolesGuard`.
8. 🛑 **Hệ thống health-check fail (`Infrastructure Health Failure`):** Kiểm tra trạng thái dịch vụ trước nạp (`Pre-import Health Check`) phát hiện container `legalflow_postgres` bị lỗi, kết nối DB chập chờn hoặc chỉ mục bảng bị khóa (`Database Lock / Degradation`).

---
*Đặc tả Phân quyền, Kiểm toán & Quay lui Nạp Tri thức Pháp lý (Permission, Audit & Rollback Spec) được lập tự động từ kết quả Phase 11F.*
