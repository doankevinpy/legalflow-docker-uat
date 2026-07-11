# LEGALFLOW V2 - PHASE 11G
# BACKEND IMPLEMENTATION TASK BREAKDOWN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11G Standard`  
**Ngày lập Phân rã:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL BACKEND TASK BREAKDOWN`** *(Phân rã Chi tiết Hạng mục Công việc Lập trình Backend Công cụ Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Phân rã Chi tiết Hạng mục Công việc Lập trình Backend (`Backend Implementation Task Breakdown` - Phase 11G) cho công cụ nạp Tri thức Pháp lý của hệ thống LegalFlow V2. Tài liệu chia nhỏ lộ trình lập trình thành 12 tác vụ chi tiết (`BE-001 -> BE-012`), định hình cấu trúc 5 ứng viên endpoints REST API (`Candidate Endpoints`), xác lập 7 yêu cầu an toàn backend bắt buộc (`Backend Safety Requirements`) và quy định ma trận 9 kịch bản kiểm thử backend (`Backend Test Requirements`) nhằm chuẩn bị nền tảng thực thi hoàn hảo cho các Kỹ sư Backend khi bước vào giai đoạn code (`Phase 11H/I`).

---

## 2. Backend Scope

Bảng phân rã chi tiết 12 tác vụ lập trình Backend (`12 Backend Implementation Task Breakdown Table`):

| Task ID | Task (`Task Title & Component`) | Description (`Detailed Technical Specification & Actions`) | Risk | Dependencies | Acceptance Criteria (`Definition of Done`) | Notes & Safety Enforcement |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **BE-001** | **Review Existing Module** | Rà soát `legal-knowledge.module.ts`, `legal-knowledge.controller.ts`, `legal-knowledge.service.ts` và cấu trúc DI hiện tại. | `LOW` | *None* | Khẳng định không xung đột route hay service injection hiện hữu. Tài liệu hóa điểm neo code. | Chỉ đọc và kiểm tra static code, không sửa file trong Phase 11G. |
| **BE-002** | **Design DTO for CSV Validation** | Viết `ImportRecordDto` với `class-validator` (@IsNotEmpty, @IsEnum, @IsISO8601) cho 16 trường chuẩn Phase 11F. | `LOW` | BE-001 | DTO nhận buffer CSV/JSON, tự động bắt lỗi sai kiểu định dạng ngay tại `ValidationPipe`. | Đảm bảo mapping đúng 9 loại Enum `documentType` và 4 trạng thái `approvalStatus`. |
| **BE-003** | **Implement CSV Parser (Dry-Run)** | Viết service `CsvParserService` sử dụng `csv-parse` xử lý stream UTF-8, chuyển đổi dòng CSV thành array DTO trên RAM. | `MEDIUM` | BE-002 | Parse thành công file CSV 500 dòng dưới 1000ms. Xử lý chuẩn xác ký tự tiếng Việt có dấu và dấu phẩy trong ngoặc kép. | **ZERO DB WRITES.** Bộ nhớ RAM tự dọn dẹp sau khi parse xong. |
| **BE-004** | **Validate Required Fields** | Viết logic kiểm tra 16 trường bắt buộc theo bảng `Validation Rules Spec`. Báo lỗi `VAL-01` nếu thiếu `documentNumber` hay `summary`. | `LOW` | BE-003 | Trả về danh sách chi tiết lỗi trường (`rowNumber, field, error: VAL-01`). | Đảm bảo không bỏ sót bất kỳ trường required nào của Phase 11C. |
| **BE-005** | **Validate Status Rules** | Viết logic rà soát trạng thái (`VAL-03`, `VAL-04`, `VAL-08`). Kiểm tra `approval_status = Approved` và `legal_status != Unknown`. | `HIGH` | BE-004 | Tự động phân loại bản ghi vào danh sách `Rejected` nếu `approval_status != Approved` hoặc `legal_status == Unknown/Draft`. | Chốt chặn cốt lõi chặn dữ liệu chưa duyệt nạp vào Staging. |
| **BE-006** | **Duplicate Detection Service** | Viết logic rà soát `Unique source_id` (`VAL-05`) và cặp `documentNumber + issuingAuthority` (`VAL-06`) với DB. | `HIGH` | BE-005 | Truy vấn `LegalDocument` trên DB ở chế độ `findMany/count` (read-only). Trả lỗi nếu phát hiện trùng lặp. | **Zero Auto-Overwrite.** Chỉ query kiểm tra, không update hay upsert DB. |
| **BE-007** | **Dry-Run Report Generator** | Đóng gói kết quả từ BE-004->006 thành JSON chuẩn hóa 6 chỉ số (`Total/Valid/Warning/Reject/Duplicate/Review`). | `LOW` | BE-006 | JSON trả về khớp 100% cấu trúc quy định tại mục 7 của file `VALIDATION_RULES_SPEC.md`. | Kèm cờ xác nhận `noImportConfirmation: DRY_RUN_ONLY_ZERO_DB_WRITES`. |
| **BE-008** | **RBAC Permission Guard** | Tích hợp `@Roles(Role.ADMIN, Role.MANAGER)` vào `/validate` và `/dry-run`; `@Roles(Role.ADMIN)` vào `/execute`. | `HIGH` | BE-001 | Yêu cầu JWT token hợp lệ. `Role.STAFF` và `Role.VIEWER` bị chặn trả về `403 Forbidden`. | Tuân thủ tuyệt đối quy định phân quyền 8 hành vi của Phase 11F. |
| **BE-009** | **Execute Import Planning** | Viết service `ExecuteBatchImportService` bọc trong `prisma.$transaction`. Nạp các dòng `Valid` vào Staging DB. | `CRITICAL` | BE-008 | Mở transaction, insert `LegalDocument` với `isActive = false`, `status = DRAFT / PENDING_REVIEW`. | Kiểm tra `challengeText` khớp 100% và `confirmDbBackup = true`. |
| **BE-010** | **Audit Trail Planning** | Tích hợp `LegalUpdateLog` vào cùng transaction của BE-009. Ghi 13 trường nhật ký audit bắt buộc. | `HIGH` | BE-009 | Bảng `LegalUpdateLog` nhận đầy đủ bản ghi audit cho lô nạp với `action = BATCH_IMPORT`. | Nhật ký kiểm toán bất biến, tuyệt đối không bị xóa khi rollback. |
| **BE-011** | **Unit Tests Implementation** | Viết `legal-knowledge-import.service.spec.ts` kiểm thử từng rule VAL-01->14 và các path từ chối. | `MEDIUM` | BE-007 | Đạt độ phủ Unit Test `Coverage >= 90%` cho module parser và validator. | Mock toàn bộ Prisma Client, đảm bảo unit test chạy không cần kết nối DB thật. |
| **BE-012** | **Integration Tests** | Viết `legal-knowledge-import.controller.spec.ts` (e2e/integration test) kiểm thử luồng HTTP API và `$transaction rollback`. | `HIGH` | BE-010 | Supertest gọi API `/validate`, `/dry-run` và `/execute` kiểm chứng đúng status code `200/400/403/500`. | Đảm bảo luồng dry-run trả về 200 OK và DB count không thay đổi. |

---

## 3. API Candidate Endpoints

Cấu trúc chi tiết 5 REST API endpoints ứng viên sẽ được khai báo trong `LegalKnowledgeController` tại Phase 11H/I (`5 Candidate REST API Endpoints Layout`):

```text
+----------------------------------------------------------------------------------------------------+
| CANDIDATE REST API ENDPOINTS FOR LEGAL KNOWLEDGE IMPORT MODULE (PHASE 11H & 11I)                   |
+----------------------------------------------------------------------------------------------------+
| 1. POST /api/v2/legal-knowledge/import/validate                                                    |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER)                                                       |
|    - Payload: Multipart CSV file OR { batchRecords: ImportRecordDto[] }                            |
|    - Behavior: Reads RAM, executes BE-003->BE-007. ZERO DB WRITES.                                  |
|    - Output: Validation Report JSON (Total, Valid, Warnings, Rejected, Duplicates).                |
+----------------------------------------------------------------------------------------------------+
| 2. POST /api/v2/legal-knowledge/import/dry-run                                                     |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER)                                                       |
|    - Payload: { batchId / csvBuffer, ignoreWarnings: boolean }                                     |
|    - Behavior: Simulates transaction & staging insertion on RAM / DB with auto-rollback.           |
|    - Output: Dry-Run Sign-off Report with explicit Zero-DB-Write confirmation banner.             |
+----------------------------------------------------------------------------------------------------+
| 3. POST /api/v2/legal-knowledge/import/execute                                                     |
|    - Roles: @Roles(Role.ADMIN)  *(Requires MANAGER approval sign-off reference in payload)*        |
|    - Payload: { batchData, confirmDbBackup: true, backupRefId, importReason, challengeText }       |
|    - Behavior: Opens Prisma $transaction -> Creates Staging LegalDocument -> Writes 13 Audit logs. |
|    - Output: { status: "SUCCESS", stagingCount, updateLogIds, timestamp, batchId }                 |
+----------------------------------------------------------------------------------------------------+
| 4. GET /api/v2/legal-knowledge/import/:id/report                                                   |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)                              |
|    - Behavior: Retrieves immutable historical validation & execution report from UpdateLog/MinIO.  |
+----------------------------------------------------------------------------------------------------+
| 5. GET /api/v2/legal-knowledge/import/history                                                      |
|    - Roles: @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)                              |
|    - Behavior: Returns paginated list of all past import batches, actors, counts and status.       |
+----------------------------------------------------------------------------------------------------+
```

> **LƯU Ý KIỂM TRA ROUTE:**  
> Kỹ sư Backend trước khi khai báo route mới tại Phase 11H phải kiểm tra kỹ file `legal-knowledge.controller.ts` để đảm bảo các path `/import/validate` và `/import/execute` không bị xung đột với các route `@Get(':id')` hay `@Post(':id/version')` hiện có.

---

## 4. Backend Safety Requirements

Ma trận 7 ràng buộc an toàn Backend bất khả xâm phạm (`7 Mandatory Backend Safety Requirements`):
1. 🔒 **Validate không ghi Database (`Zero-Write Validation`):** API `/validate` tuyệt đối không gọi bất kỳ lệnh `prisma.*.create / update / delete / upsert` nào. Trình rà soát 100% hoạt động trên RAM bộ nhớ.
2. 🔒 **Dry-run không ghi Database (`Zero-Write Dry-Run`):** API `/dry-run` phải đảm bảo dữ liệu mô phỏng không bao giờ tồn tại vĩnh viễn trên DB sau khi request kết thúc (hoặc chỉ dùng memory-check hoặc dùng transaction tự động `ROLLBACK`).
3. 🔒 **Execute phải có Confirmation (`Strict Challenge Gate`):** DTO của `/execute` bắt buộc kiểm tra `challengeText === "I UNDERSTAND THIS WILL WRITE TO LEGAL KNOWLEDGE STAGING DB"` và `confirmDbBackup === true`. Nếu sai, `ValidationPipe` lập tức ném `BadRequestException(400)`.
4. 🔒 **Execute không Active tự động (`Pending Candidate Lock`):** Mọi câu lệnh `prisma.legalDocument.create` trong `/execute` bắt buộc phải gán cứng `isActive: false` và `status: 'DRAFT' / 'PENDING_REVIEW'`. Nghiêm cấm gán `isActive: true` từ CSV payload.
5. 🔒 **Execute phải có Audit (`Mandatory 13-Field Logging`):** Không được phép commit giao dịch nạp batch nếu chưa thực thi thành công lệnh insert vào bảng `LegalUpdateLog` với trọn vẹn 13 trường kiểm toán Phase 11F.
6. 🔒 **Không Expose Secret (`Zero Sensitive Data Leakage`):** Exception Filter và Response Interceptor phải lọc bỏ tuyệt đối các chuỗi nhạy cảm (`dbConnectionString, jwtSecret, minioKey, passwordHash`) khỏi JSON trả về cho frontend.
7. 🔒 **Lỗi phải Rõ ràng (`Human-Readable Error Messaging`):** Trình rà soát phải trả về mã lỗi chuẩn (`VAL-01 -> VAL-14`) kèm thông báo tiếng Việt tường minh rõ dòng số mấy, cột nào sai, giúp chuyên viên dễ dàng sửa file CSV.

---

## 5. Backend Test Requirements

Bảng đặc tả 9 kịch bản kiểm thử bắt buộc đối với module Backend Import (`9 Mandatory Backend Test Scenarios Table`):

| Test ID | Scenario (`Test Case Description`) | Expected Result (`Asserted Technical Behavior`) | Priority | Notes & Verification Method |
| :---: | :--- | :--- | :---: | :--- |
| **TEST-BE-01** | **Valid CSV Upload (`All 16 fields perfect`)** | API `/validate` trả về `200 OK`, `validRecordsCount = 50`, `rejectedRecordsCount = 0`, `overallValidationState = PASS`. | `CRITICAL` | Unit test `csv-parser.service.spec.ts`. |
| **TEST-BE-02** | **Missing Required Field (`VAL-01`)** | Dòng CSV thiếu `documentNumber` bị bắt lỗi ngay lập tức. Trả về `rejectedRecords[].errorCode = VAL-01`. | `CRITICAL` | Assert row rejected, total valid count giảm đi 1. |
| **TEST-BE-03** | **Invalid Approval Status (`VAL-03`)** | CSV có `approval_status = Pending Review` hoặc `Draft`. Trình parse từ chối dòng với lỗi `VAL-03`. | `CRITICAL` | Assert chốt chặn: `approval_status != Approved` bị loại bỏ. |
| **TEST-BE-04** | **Legal Status Unknown (`VAL-08 / Lock`)** | CSV có `legal_status = Unknown` hoặc `Draft`. Trình parse từ chối dòng, ngăn chặn nạp vào Staging. | `CRITICAL` | Assert `legal_status != Effective` không được phép nạp active candidate. |
| **TEST-BE-05** | **Duplicate Source ID (`VAL-05 / VAL-06`)** | CSV có `source_id = SAMPLE-001` trùng với 1 bản ghi đã có trong DB. Trình parse trả lỗi `VAL-05 / VAL-06`. | `CRITICAL` | Assert `DuplicateRecordsCount >= 1`, không tự động ghi đè DB. |
| **TEST-BE-06** | **Local Scope Missing (`VAL-09`)** | CSV mang `local_scope = Local` nhưng để trống `local_applicability`. Trình parse trả lỗi `VAL-09 Reject row`. | `HIGH` | Assert bắt buộc xác định rõ địa bàn áp dụng đối với luật địa phương. |
| **TEST-BE-07** | **Non-ADMIN Execute Denied (`RBAC 403`)** | Gọi API `/execute` bằng JWT token mang `Role.STAFF` hoặc `Role.VIEWER`. | `CRITICAL` | `RolesGuard` lập tức chặn request, trả về `403 Forbidden`. DB không thay đổi. |
| **TEST-BE-08** | **Dry-Run No DB Write (`Zero DB Impact`)** | Gọi API `/dry-run` với file CSV 100 dòng hợp lệ. Kiểm tra tổng số dòng trong bảng `LegalDocument` trước và sau. | `CRITICAL` | Assert `DB.count(before) === DB.count(after)`. Xác nhận 0 DB writes. |
| **TEST-BE-09** | **Execute Requires Confirmation (`Challenge Gate`)** | Gọi API `/execute` bởi `ADMIN` nhưng `challengeText` sai hoặc `confirmDbBackup = false`. | `CRITICAL` | API trả về `400 Bad Request - Challenge Failed`. Transaction không mở. |

---
*Phân rã Chi tiết Hạng mục Công việc Lập trình Backend (Backend Task Breakdown) được lập tự động từ kết quả quy chuẩn Phase 11G.*
