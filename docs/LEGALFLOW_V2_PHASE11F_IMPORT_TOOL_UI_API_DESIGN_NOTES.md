# LEGALFLOW V2 - PHASE 11F
# IMPORT TOOL UI & API DESIGN NOTES

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11F Standard`  
**Ngày ban hành Ghi chú Thiết kế:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL UI & API ARCHITECTURAL DESIGN NOTES`** *(Ghi chú Thiết kế Kiến trúc Giao diện & Giao thức API Công cụ Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Ghi chú Thiết kế Giao diện Người dùng và Giao thức API (`Import Tool UI & API Design Notes` - Phase 11F) cho công cụ nạp Tri thức Pháp lý LegalFlow V2. Tài liệu phác thảo kiến trúc giao diện tương tác (`UI Wireframe Layout`), quy định 5 lời nhắc cảnh báo pháp lý bắt buộc trên màn hình (`Required UI Warnings`), định hướng thiết kế 5 REST API endpoints core (`API Design Notes`), xác lập các yêu cầu an toàn giao thức (`API Safety Requirements`), phân tích những cân nhắc về mô hình dữ liệu (`Data Model Considerations`) và đưa ra cảnh báo triển khai nghiêm ngặt (`Implementation Warning`). Toàn bộ nội dung tại tài liệu này là bản thiết kế kiến trúc phục vụ cho phase triển khai kỹ thuật sau này (`Phase 11G/H`).

---

## 2. UI Design Notes

Kiến trúc màn hình Quản trị Nạp Tri thức Pháp lý (`Legal Knowledge Import Dashboard UI Layout`) được thiết kế theo cấu trúc 10 thành phần tương tác trực quan (`10-Component UI Layout`):

```text
+----------------------------------------------------------------------------------------------------+
| [ LEGALFLOW V2 ]  Quản Trị Tri Thức Pháp Lý > Công Cụ Nạp Dữ Liệu (Import Studio)   [ Role: ADMIN ]|
+----------------------------------------------------------------------------------------------------+
| [ WARNING BANNER ]                                                                                 |
| ⚠️ IMPORT KHÔNG ĐỒNG NGHĨA VỚI ACTIVE. Dữ liệu sau khi nạp sẽ nằm ở vùng Staging chờ Lãnh đạo      |
| duyệt. AI tuyệt đối không tự động trích dẫn dữ liệu chưa active. Cần sao lưu DB trước khi nạp thật.|
+----------------------------------------------------------------------------------------------------+
| 1. UPLOAD CSV FILE: [ Chọn file CSV... ] (LEGALFLOW_V2_PHASE11F_BATCH.csv)    [ Tải Mẫu 29 Cột ]   |
+----------------------------------------------------------------------------------------------------+
| 2. PREVIEW RECORDS & VALIDATE:                                                                     |
| +----+------------+------------------+------------------+---------+----------+-------------------+ |
| | #  | source_id  | document_number  | issuing_authority| status  | approved | Action            | |
| +----+------------+------------------+------------------+---------+----------+-------------------+ |
| | 1  | SAMPLE-001 | 31/2024/QH15     | Quốc hội         |Effective| Approved | [ PASS ]          | |
| | 2  | SAMPLE-002 | 102/2024/NĐ-CP   | Chính phủ        |Effective| Approved | [ PASS ]          | |
| +----+------------+------------------+------------------+---------+----------+-------------------+ |
|                                                    [ RUN DRY-RUN VALIDATION ]  <-- Button 3        |
+----------------------------------------------------------------------------------------------------+
| 4. VALIDATION RESULT TABLE & SUMMARY (Dry-Run Report):                                             |
| -> Total: 50 | Valid: 45 | Warnings: 3 | Rejected: 2 | Duplicates: 0 | State: PASS WITH WARNINGS   |
| 5. WARNINGS / ERRORS DETAIL LIST:                                                                  |
| [!] Row #15: Orphan reference amends_document 05/2020/QĐ-UBND not found in DB.                     |
| [X] Row #28: approval_status is 'Pending Review'. Only 'Approved' allowed. -> REJECTED             |
+----------------------------------------------------------------------------------------------------+
| 7. IMPORT CONFIRMATION & SAFETY GATE:                                                              |
| [X] Xác nhận đã sao lưu toàn vẹn cơ sở dữ liệu (pg_dump Backup Reference ID: dump_20260711_1430)  |
| [X] Xác nhận dữ liệu nạp thuộc phạm vi Staging, không tự active live.                              |
| Nhập đúng văn bản: [ I UNDERSTAND THIS WILL WRITE TO LEGAL KNOWLEDGE STAGING DB ]                  |
|                                                    [ EXECUTE BATCH IMPORT ]    <-- Button 8        |
+----------------------------------------------------------------------------------------------------+
| 8. IMPORT RESULT SUMMARY:                                                                          |
| -> Batch Ingested Successfully! 45 records created in Staging (UpdateLog IDs: ULOG-101 -> 145).    |
| 9. AUDIT HISTORY & TRANSACTION LOGS: [ Xem Nhật Ký Audit Nạp Dữ Liệu ]                             |
| 10. ACTIVE VERSION REMINDER: Chuyển sang màn hình [ Quản Lý Phê Duyệt Version ] để Lãnh đạo duyệt.|
+----------------------------------------------------------------------------------------------------+
```

* **(1) Upload CSV / Chọn file:** Khu vực tải file chuẩn UTF-8, đính kèm nút tải về Biểu mẫu 29 cột Phase 11C.
* **(2) Preview records:** Bảng hiển thị nhanh 10 dòng đầu tiên của file CSV để cán bộ rà soát mắt.
* **(3) Validate button:** Nút kích hoạt lệnh rà soát kiểm định tĩnh (`Run Dry-Run Validation`).
* **(4) Validation result table & Dry-run report:** Bảng tóm tắt 6 chỉ số kiểm định rõ ràng.
* **(5) Warnings / errors:** Danh sách chi tiết từng lỗi, chỉ đúng số dòng và hướng dẫn sửa lỗi.
* **(6) Dry-run report export:** Tùy chọn xuất báo cáo rà soát dưới dạng file Markdown/PDF để trình Lãnh đạo.
* **(7) Import confirmation:** Chốt chặn an toàn 4 bước yêu cầu xác nhận backup và gõ văn bản thử thách.
* **(8) Import result:** Phản hồi kết quả thực thi nạp batch vào Staging DB, hiển thị danh sách ID log.
* **(9) Audit history:** Bảng truy vết toàn bộ các đợt import trước đó (`History & Lineage`).
* **(10) Active version reminder:** Lời nhắc chuyển tiếp sang giao diện phê duyệt của `MANAGER`.

---

## 3. Required UI Warnings

Trên toàn bộ các màn hình của Công cụ Nạp (`Import Dashboard`), hệ thống bắt buộc phải ghim cố định 5 lời nhắc cảnh báo pháp lý và vận hành ở vị trí dễ quan sát nhất (`5 Mandatory Persistent UI Warning Banners`):
1. ⚠️ **`"Import không đồng nghĩa với active."`**  
   *(Dữ liệu sau khi nạp thành công chỉ nằm ở vùng chờ Staging `UpdateLog`. Lãnh đạo Phòng phải phê duyệt kích hoạt riêng tại giao diện Quản lý Phiên bản).*
2. ⚠️ **`"Dữ liệu pháp lý phải được cán bộ kiểm tra."`**  
   *(Phần mềm và AI chỉ là công cụ hỗ trợ rà soát kỹ thuật. Cán bộ Pháp chế chịu trách nhiệm cao nhất về tính chính xác và hiệu lực thực tế của văn bản).*
3. ⚠️ **`"AI không tự xác định văn bản mới nhất / đầy đủ."`**  
   *(Trợ lý AI Khối 3.1 không có quyền tự kết luận kho luật là bao phủ 100%. Cán bộ Một cửa và P2 phải luôn đối chiếu quy định mới nhất khi thụ lý hồ sơ).*
4. ⚠️ **`"Cần backup trước khi import thật."`**  
   *(Nghiêm cấm bấm nút nạp dữ liệu thật nếu chưa thực hiện và kiểm chứng file sao lưu cơ sở dữ liệu `pg_dump` trên máy chủ).*
5. ⚠️ **`"Không dùng dữ liệu chưa duyệt cho hồ sơ chính thức."`**  
   *(Tuyệt đối không sử dụng các bản ghi đang ở trạng thái `Draft`, `Pending Review` hay dữ liệu mẫu giả lập cho việc tham mưu, thẩm định hồ sơ TTHC thực tế).*

---

## 4. API Design Notes

Thiết kế kiến trúc 5 REST API endpoints chuyên dụng cho công cụ nạp (`5 Proposed REST API Endpoints Layout`):

```text
+---------------------------------------------------------------------------------------------+
| PROPOSED REST API ARCHITECTURE FOR LEGAL KNOWLEDGE IMPORT MODULE                            |
+---------------------------------------------------------------------------------------------+
| 1. POST /api/v2/legal-knowledge/import/validate                                             |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER)                                                |
|    - Payload: Multipart CSV file OR JSON batch array.                                       |
|    - Behavior: Static check of 29 columns + 14 Phase 11C criteria. ZERO DB WRITES.          |
|    - Output: { validationSummary, itemizedResults (Valid/Warn/Reject/Duplicate) }          |
+---------------------------------------------------------------------------------------------+
| 2. POST /api/v2/legal-knowledge/import/dry-run                                              |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER)                                                |
|    - Payload: { batchId, options: { ignoreWarnings: boolean } }                             |
|    - Behavior: Full simulation of staging generation without committing transaction.        |
|    - Output: Detailed Dry-Run Sign-off Report with No-import Confirmation.                  |
+---------------------------------------------------------------------------------------------+
| 3. POST /api/v2/legal-knowledge/import/execute                                              |
|    - Roles: @Roles(Role.ADMIN)  *(Requires MANAGER approval sign-off ID in payload)*        |
|    - Payload: { batchId, confirmDbBackup: true, backupRefId, importReason, challengeText }  |
|    - Behavior: Opens Prisma $transaction -> Creates UpdateLog staging rows -> Logs audit.    |
|    - Output: { status: "SUCCESS", batchId, stagingCount, updateLogIds, timestamp }          |
+---------------------------------------------------------------------------------------------+
| 4. GET /api/v2/legal-knowledge/import/:id/report                                            |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)                       |
|    - Output: Returns complete immutable validation and ingestion report for a past batch.   |
+---------------------------------------------------------------------------------------------+
| 5. GET /api/v2/legal-knowledge/import/history                                               |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)                       |
|    - Output: Paginated list of all past import batches, actors, status and lineage links.   |
+---------------------------------------------------------------------------------------------+
```

### Khẳng định Minh bạch Kỹ thuật:
* Toàn bộ 5 endpoints trên **hiện tại chỉ là bản thiết kế kiến trúc (`Design Specification Only`)**.
* Chưa có bất kỳ endpoint nào được viết code hay khai báo trong `LegalKnowledgeController` tại Phase 11F.
* Khi triển khai code ở phase sau, kỹ sư nghiệp vụ phải rà soát và tích hợp khéo léo với kiến trúc `UpdateLog Workflow` hiện có của hệ thống.

---

## 5. API Safety Requirements

Ma trận 8 yêu cầu an toàn bắt buộc phải được thi hành trong lớp Controller và Guard của các endpoints import (`8 API Safety & Security Requirements`):
1. 🔒 **Validate không ghi DB (`Zero-Write Validation`):** Endpoint `/import/validate` chỉ đọc buffer CSV trong bộ nhớ RAM và trả về JSON kết quả, tuyệt đối không mở kết nối ghi hay gọi Prisma create/update.
2. 🔒 **Dry-run không ghi DB (`Zero-Write Dry Run`):** Endpoint `/import/dry-run` mô phỏng trọn vẹn luồng xử lý nhưng được bọc trong một transaction tự động `ROLLBACK` cuối hàm hoặc chỉ tính toán trên bộ nhớ.
3. 🔒 **Execute phải yêu cầu ADMIN / MANAGER theo quy định (`Strict Dual-RBAC`):** Endpoint `/import/execute` kiểm tra `@Roles(Role.ADMIN)` và bắt buộc kiểm chứng chữ ký số hoặc ID phê duyệt hợp lệ của `Role.MANAGER` trong payload.
4. 🔒 **Execute phải có confirmation (`Challenge-Response Gate`):** API kiểm tra chuỗi `challengeText` khớp 100% và cờ `confirmDbBackup = true`. Nếu thiếu, trả về lỗi `400 Bad Request` ngay tại DTO Pipe.
5. 🔒 **Execute không active tự động (`Active Candidate Lock`):** Mọi bản ghi tạo qua `/import/execute` đều bị ép buộc tham số `activeCandidate: false` và `status: 'PENDING_REVIEW' / 'DRAFT'` trong câu lệnh Prisma insert.
6. 🔒 **Execute phải ghi audit (`Mandatory Audit Logging`):** Ngay trước và sau khi thực thi transaction nạp batch, hệ thống ghi nhận sự kiện vào bảng `UpdateLog` với đầy đủ 13 trường quy định tại Tài liệu Spec Phân quyền.
7. 🔒 **Lỗi phải trả message rõ (`Human-Readable Error Feedback`):** Khi phát hiện lỗi parse CSV hoặc vi phạm ràng buộc DB, API phải bắt giữ exception (`Exception Filter`) và trả về chuỗi JSON lỗi cấu trúc rõ ràng (`rowNumber, columnName, vietnameseMessage`), không trả stack trace thô.
8. 🔒 **Không trả secret / token (`Zero Secret Leakage`):** Phản hồi từ toàn bộ 5 endpoints tuyệt đối được lọc bỏ (`Sanitization`) các trường nhạy cảm như `passwordHash, jwtToken, minioSecretKey, dbConnectionString`.

---

## 6. Data Model Considerations

Những cân nhắc về kiến trúc mô hình dữ liệu (`Prisma Schema Architectural Considerations`) phục vụ cho giai đoạn thiết kế triển khai tới:
1. **Có thể cần bảng `ImportBatch / ImportJob`:** Để quản lý các đợt nạp hàng loạt lên tới hàng trăm văn bản, hệ thống có thể cần thiết lập thêm model `ImportBatch` (chứa `batchCode, fileName, totalCount, status, createdById, approvedById`) để tạo khóa ngoại cho các bản ghi log.
2. **Có thể cần bảng `ImportErrorLog`:** Khi chạy validate hoặc import lô lớn, việc lưu trữ chi tiết từng lỗi dòng vào bảng riêng (`ImportErrorLog`) giúp rà soát lịch sử lỗi nhanh hơn là nén tất cả vào chuỗi JSON.
3. **Có thể cần tích hợp vào `UpdateLog`:** Nếu muốn giữ schema tối giản tối đa, có thể mở rộng enum `UpdateLogAction` thêm giá trị `BATCH_CSV_IMPORT` và lưu toàn bộ danh sách bản ghi Staging trong thuộc tính JSON `metadata / payload` của `UpdateLog`.
4. **Mỗi thay đổi schema phải ở phase riêng, có migration riêng, backup riêng:** Khẳng định nguyên tắc quản trị: bất kỳ đề xuất tạo mới bảng `ImportBatch` hay sửa đổi `schema.prisma` nào đều bắt buộc phải được thực thi trong một phase kiến trúc riêng (`Phase 11G/H`), đi kèm file migration `sql` được rà soát code, kiểm thử dry-run và có kịch bản backup `pg_dump` trước khi chạy lệnh `prisma migrate deploy` trên Production.

---

## 7. Implementation Warning

> [!CAUTION]
> **CẢNH BÁO TRIỂN KHAI NGHIÊM NGẶT (`MANDATORY IMPLEMENTATION WARNING`):**  
> **Phase 11F hiện tại là giai đoạn chỉ thiết kế tài liệu đặc tả kiến trúc (`Specification Design Phase Only`). Tuyệt đối không viết code, không tạo component UI, không viết Controller/Service mới và không can thiệp cơ sở dữ liệu tại phase này.**  
> Khi bước sang giai đoạn triển khai thực tế trong tương lai (`Phase 11G: Implementation Planning & Coding`), mọi hoạt động lập trình bắt buộc phải tuân thủ nghiêm ngặt lộ trình chuẩn hóa: **Thiết kế chi tiết DTO -> Viết Unit Test -> Code Review -> Dry-Run Kiểm thử trên Staging DB -> Sao lưu DB Production `pg_dump` -> Triển khai có kiểm soát kèm Rollback Plan**. Bất kỳ hành vi bỏ qua bước kiểm thử hoặc tự ý nạp dữ liệu thẳng vào Production đều vi phạm kỷ luật quản trị hệ thống LegalFlow V2.

---
*Ghi chú Thiết kế Kiến trúc Giao diện & Giao thức API (UI & API Design Notes) được lập tự động từ kết quả Phase 11F.*
