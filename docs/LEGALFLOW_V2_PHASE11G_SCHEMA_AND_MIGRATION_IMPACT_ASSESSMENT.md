# LEGALFLOW V2 - PHASE 11G
# SCHEMA & MIGRATION IMPACT ASSESSMENT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11G Standard`  
**Ngày lập Đánh giá:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL SCHEMA & MIGRATION IMPACT ASSESSMENT`** *(Báo cáo Đánh giá Tác động Cấu trúc Cơ sở Dữ liệu & Kế hoạch Chuyển đổi Schema Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Báo cáo Đánh giá Tác động Cấu trúc Cơ sở Dữ liệu và Kế hoạch Chuyển đổi (`Schema & Migration Impact Assessment` - Phase 11G) của hệ thống LegalFlow V2. Tài liệu rà soát toàn diện cấu trúc cơ sở dữ liệu hiện hữu tại `prisma/schema.prisma`, phân tích tính tương thích của các model `LegalDocument`, `LegalDocumentVersion`, `LegalUpdateLog`, `User` và `Role`, đề xuất các cấu trúc dữ liệu mới tiềm năng (`Potential New Data Structures`), đánh giá rủi ro migration (`Migration Risk Matrix`) và đưa ra khuyến nghị chuẩn hóa kiến trúc trước khi bước vào giai đoạn lập trình mã nguồn công cụ import.

---

## 2. Current State Review

Bảng rà soát cấu trúc cơ sở dữ liệu hiện có theo `prisma/schema.prisma` và đánh giá độ tương thích với công cụ nạp Phase 11F (`Current DB Architecture Review Table`):

| Area (`Database Module / Model`) | Existing Structure (`Current Prisma Definition`) | Finding (`Architectural Analysis`) | Impact (`Suitability for Phase 11F Import`) | Notes & Recommended Adaptation |
| :--- | :--- | :--- | :--- | :--- |
| **1. Legal Knowledge Model (`LegalDocument`)** | Bảng `LegalDocument` chứa `code, title, documentNumber, issuingAuthority, documentType, issueDate, effectiveDate, expiryDate, status, category, scope, summary, fullTextUrl, isActive`. | Đáp ứng 90% cấu trúc trường thông tin cốt lõi của biểu mẫu nạp 29 cột (`Metadata Template`). Có sẵn các trường `code` (tương ứng `source_id`), `status`, `scope`. | `LOW IMPACT` *(High Compatibility)* | Có thể trực tiếp sử dụng `LegalDocument` để lưu trữ văn bản luật sau khi nạp. Các thuộc tính mở rộng địa phương (`local_applicability`) có thể lưu vào trường JSON `metadata` hoặc bổ sung trường. |
| **2. Legal Version Model (`LegalDocumentVersion`)** | Bảng `LegalDocumentVersion` chứa `documentId, versionNumber, effectiveFrom, effectiveTo, changeSummary, contentSnapshot, isCurrent`. | Quản lý tốt chuỗi lịch sử phiên bản (`Lineage`) của từng văn bản luật cụ thể, cho phép truy vết nội dung tại thời điểm t. | `LOW IMPACT` | Cho phép trình nạp batch tạo mới bản ghi `LegalDocumentVersion` khi một văn bản sửa đổi, bổ sung được import vào hệ thống. |
| **3. Audit & Log Model (`LegalUpdateLog`)** | Bảng `LegalUpdateLog` chứa `documentId, updateType, oldVersion, newVersion, reason, changedById, createdAt, status, reviewerNotes`. | Cấu trúc log hiện tại tập trung vào việc ghi nhận thay đổi cho **từng văn bản đơn lẻ (`Single Document Update`)**. Chưa có bảng chuyên dụng để quản lý **Lô nạp hàng loạt (`Import Batch / Job`)**. | `MEDIUM IMPACT` | Để ghi nhận đủ 13 trường audit cho một lô CSV gồm 50 văn bản (gồm `file_name, record_count, validation_result`), cần đóng gói vào trường JSON `reviewerNotes/metadata` hoặc tạo thêm model `ImportBatch`. |
| **4. User & Role Model (`User`, `Role Enum`)** | Bảng `User` chứa `username, role, isActive`. Enum `Role` gồm `ADMIN, MANAGER, STAFF, VIEWER`. | Hoàn toàn tương thích và khớp chính xác 100% với ma trận phân quyền RBAC 8 hành vi ban hành tại Phase 11F. | `ZERO IMPACT` | Sử dụng trực tiếp `Role.ADMIN` để phân quyền chạy endpoint `/execute` và `Role.MANAGER` để duyệt `/approve` và `/activate`. |
| **5. Document - Procedure Relation (`LegalDocumentRelation`)** | Bảng `LegalDocumentRelation` chứa `documentId, relatedType, relatedId, relationType`. | Liên kết mềm giữa văn bản pháp lý và các thủ tục hành chính (`AdministrativeProcedure`) thông qua `relatedId`. | `LOW IMPACT` | Khi parse trường `related_procedure` trong CSV (`TTHC-LAND-05`), trình import kiểm tra sự tồn tại trong DB và tự động tạo các bản ghi `LegalDocumentRelation`. |
| **6. Batch & Error Storage Capability** | Hiện tại **chưa có (`NOT EXISTING`)** các bảng như `ImportBatch`, `ImportJob` hay `ImportErrorLog` trong `schema.prisma`. | Việc quản lý file CSV tải lên, theo dõi trạng thái Dry-Run của một lô hay lưu trữ danh sách 15 lỗi dòng riêng biệt hiện phải xử lý hoàn toàn trên bộ nhớ RAM hoặc JSON. | `MEDIUM IMPACT` | Cần đánh giá kỹ việc có nên tạo migration mới để thêm bảng `ImportBatch` hay giữ nguyên schema hiện hữu và nén thông tin lô vào `UpdateLog`. |

---

## 3. Potential New Data Structures

Bảng phân tích 5 cấu trúc dữ liệu mới tiềm năng có thể đề xuất bổ sung vào cơ sở dữ liệu (`5 Candidate Data Structures Evaluation Table`):

| Candidate Structure (`Model Name`) | Purpose (`Architectural Objective`) | Required Now (`Phase 11G/H Need`) | Risk (`Migration & Complexity Risk`) | Notes & Architectural Recommendation |
| :--- | :--- | :---: | :---: | :--- |
| **1. `ImportBatch`** *(Model)* | Lưu trữ thông tin tổng quan về một đợt tải lên file CSV (`batchCode, fileName, totalRecords, validCount, warningCount, rejectedCount, status, createdById, approvedById`). | `NO` *(Can use JSON in UpdateLog)* | `LOW` | **Khuyến nghị không tạo migration ngay trong Phase 11H (`Validation API`).** Có thể bổ sung ở Phase 11I (`Execute API`) nếu cần truy vết gia phả lô độc lập. |
| **2. `ImportRowError`** *(Model)* | Lưu trữ chi tiết lỗi cho từng dòng của file CSV (`batchId, rowNumber, sourceId, errorCode, columnName, message`). | `NO` | `LOW` | Phase 11H rà soát Dry-Run hoàn toàn trên RAM và trả kết quả qua JSON payload, không cần lưu table `ImportRowError` vào DB. |
| **3. `ImportAuditLog`** *(Model)* | Bảng nhật ký kiểm toán chuyên dụng cho công cụ import, cô lập hoàn toàn với `LegalUpdateLog`. | `NO` *(Rec to reuse LegalUpdateLog)* | `MEDIUM` | Tránh phân mảnh hệ thống log. Khuyến nghị tái sử dụng và mở rộng model `LegalUpdateLog` hiện có bằng cách thêm Enum `updateType = BATCH_IMPORT`. |
| **4. `LegalKnowledgeImportJob`** *(Model)* | Quản lý hàng đợi xử lý nạp bất đồng bộ (`Async Background Job`) cho các file CSV cực lớn (> 10,000 dòng). | `NO` | `HIGH` | Không cần thiết trong giai đoạn hiện tại do quy mô mỗi đợt nạp pháp luật của phòng Pháp chế thường dưới 500 văn bản (xử lý đồng bộ RAM < 2 giây). |
| **5. `ImportValidationReport`** *(Model / JSON)* | Lưu trữ Snapshot Báo cáo Dry-Run kèm chữ ký số xác nhận không ghi DB để Lãnh đạo thẩm định. | `NO` | `LOW` | Có thể lưu trữ dưới dạng file JSON/Markdown trên kho MinIO (`minio://legalflow-reports/`) thay vì tạo thêm bảng trong Postgres DB. |

---

## 4. Migration Risk

Ma trận phân tích 6 rủi ro chuyển đổi cơ sở dữ liệu và biện pháp giảm thiểu (`6-Point Migration Risk Matrix`):

| Risk Item (`Migration Threat`) | Severity | Mitigation Strategy (`Strict Technical Countermeasure`) | Notes & Guard Rails |
| :--- | :---: | :--- | :--- |
| **1. Ảnh hưởng dữ liệu Production (`Production Lock / Data Loss`)** | `CRITICAL` | Bất kỳ lệnh `prisma migrate deploy` nào cũng có nguy cơ khóa bảng (`Table Lock`). Yêu cầu bắt buộc phải thực hiện sao lưu toàn vẹn `pg_dump` trước khi chạy migration. | Không tạo bất kỳ migration nào trong Phase 11G và Phase 11H (`Validation only`). |
| **2. Migration không tương thích (`Backward Incompatibility`)** | `HIGH` | Nếu sửa các trường hiện hữu của `LegalDocument` (chẳng hạn đổi `code` từ String sang Int hoặc set `NOT NULL` cho trường đang `NULL`), hệ thống sụp đổ ngay lập tức. | Mọi model mới (`ImportBatch`) nếu thêm vào phải hoàn toàn độc lập (`Additive Only`), tuyệt đối không sửa đổi cột hiện hữu của bảng cũ. |
| **3. Thiếu Rollback Plan (`Unreversible Schema Change`)** | `CRITICAL` | Prisma ORM không hỗ trợ `prisma migrate rollback` tự động như các framework khác. | Mỗi migration phải đi kèm file kịch bản SQL hạ cấp (`Down Migration SQL Script`) được rà soát thủ công để khôi phục trạng thái trước đó. |
| **4. Audit không đầy đủ (`Audit Trail Fragmentation`)** | `HIGH` | Nếu nạp batch thẳng vào `LegalDocument` mà quên tạo bản ghi tương ứng trong `LegalUpdateLog`, gia phả tri thức bị đứt gãy. | Bọc toàn bộ thao tác nạp văn bản và ghi log trong một giao dịch duy nhất `prisma.$transaction([...])`. |
| **5. Import Duplicate (`Unique Constraint Violation`)** | `HIGH` | Nếu CSV chứa 2 dòng cùng `documentNumber` và `issuingAuthority`, lệnh insert batch bị crash giữa chừng vì vi phạm `Unique Index`. | Trình rà soát Phase 11H phải phát hiện trước (`Pre-check Uniqueness`) và phân lọc bản ghi trùng vào danh sách `Duplicate` trước khi gọi Prisma transaction. |
| **6. Active Version sai (`Accidental Production Overwrite`)** | `CRITICAL` | Nếu migration hoặc seed script nạp dữ liệu mang trạng thái `isActive = true`, AI Khối 3.1 sẽ lập tức trích dẫn luật chưa thẩm định. | Đặt giá trị mặc định của schema (`@default(false)`) cho `isActive` và gán cứng `status = DRAFT / PENDING_REVIEW` trong code backend. |

---

## 5. Migration Recommendation

Dựa trên kết quả rà soát kiến trúc hiện hữu và đánh giá tác động kỹ thuật, Hội đồng Thẩm định chính thức ban hành khuyến nghị chuyển đổi Schema (`Official Migration Recommendation`):

&rarr; **`NO MIGRATION NEEDED FOR VALIDATION API (PHASE 11H)`**  
*(Giai đoạn Phase 11H tập trung 100% vào việc xây dựng bộ parse CSV và kiểm tra hợp lệ Dry-Run trên RAM, hoàn toàn không tương tác ghi với cơ sở dữ liệu nên **tuyệt đối không cần tạo hay thay đổi bất kỳ migration nào**).*

&rarr; **`MIGRATION LIKELY NEEDED FOR IMPORT AUDIT (PHASE 11I)`**  
*(Khi bước sang Phase 11I - Viết API Execute Import thật, đội ngũ kỹ thuật sẽ quyết định chính thức việc bổ sung model `ImportBatch` vào `schema.prisma` để tối ưu truy vết lô, hoặc tiếp tục giữ nguyên schema và lưu metadata lô vào bảng `LegalUpdateLog` hiện có).*

> **LƯU Ý QUẢN TRỊ KỸ THUẬT:**  
> `Migration decision must be finalized in the implementation phase (Phase 11I) after reviewing actual Prisma models and running staging simulations.`

---

## 6. Safety Note

> [!IMPORTANT]
> **CAM KẾT AN TOÀN MIGRATION (`MANDATORY SCHEMA SAFETY NOTE`):**  
> **Trong suốt Phase 11G (Lập kế hoạch) và Phase 11H (Xây dựng API Validate Dry-Run), tuyệt đối KHÔNG TẠO, KHÔNG CHỈNH SỬA và KHÔNG THỰC THI bất kỳ file migration hay lệnh thay đổi schema `prisma.schema` nào.**  
> Mọi nhu cầu chuyển đổi cơ sở dữ liệu nếu phát sinh trong tương lai (`Phase 11I`) đều bắt buộc phải được cô lập thành một phase kiến trúc độc lập, phải được Code Review tường tận, kiểm thử mô phỏng trên Staging DB, thực hiện sao lưu toàn vẹn `pg_dump` Production DB và ban hành Kịch bản Phục hồi hạ cấp (`Rollback SQL Script`) trước khi gõ lệnh `npx prisma migrate deploy`.

---
*Báo cáo Đánh giá Tác động Cấu trúc Cơ sở Dữ liệu & Kế hoạch Chuyển đổi Schema (Schema & Migration Impact Assessment) được lập tự động từ kết quả rà soát Phase 11G.*
