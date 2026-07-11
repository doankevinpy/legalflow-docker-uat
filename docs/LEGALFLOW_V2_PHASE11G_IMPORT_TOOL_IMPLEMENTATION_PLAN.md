# LEGALFLOW V2 - PHASE 11G
# LEGAL KNOWLEDGE IMPORT TOOL IMPLEMENTATION PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11G Standard`  
**Ngày lập Kế hoạch:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPLEMENTATION PLAN`** *(Kế hoạch Triển khai Kỹ thuật Công cụ Nạp Tri thức Pháp lý An toàn)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Triển khai Kỹ thuật Công cụ Nạp Tri thức Pháp lý (`Legal Knowledge Import Tool Implementation Plan` - Phase 11G) của hệ thống LegalFlow V2. Tài liệu xác lập phương án, lộ trình thi công, cấu trúc phân chia giai đoạn lập trình (`Phasing`) và các chốt chặn an toàn (`Safety Controls`) nhằm chuyển hóa toàn bộ bộ tài liệu đặc tả thiết kế kiến trúc Phase 11F thành mã nguồn thực thi chính xác trên cả Backend và Frontend, đồng thời tuân thủ 100% nguyên tắc kiểm soát rủi ro, phân quyền và bảo toàn hiệu lực dữ liệu pháp lý của cơ quan.

---

## 2. Background

Quá trình nâng cấp, quản trị và nạp tri thức pháp lý của hệ thống LegalFlow V2 đã trải qua các giai đoạn rà soát và thiết kế bài bản, chặt chẽ:
* **Phase 11B (`Local Governance Pack`):** Đã ban hành bộ quy chế quản trị dữ liệu pháp lý địa phương (`Legal Knowledge Data Enrichment Plan`, `Local Regulation Source Register`, `SOP`, `Validation Checklist`, `Completion Report`).
* **Phase 11C (`Template & Mapping Pack`):** Đã xây dựng bộ biểu mẫu cấu trúc 29 cột (`Metadata Template`), đặc tả ánh xạ trường (`Field Mapping Spec`) và kịch bản chuẩn bị nạp kiểm soát.
* **Phase 11D (`Sample Dataset Review`):** Đã thiết lập bộ dữ liệu mẫu giả lập (`SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`), thực hiện rà soát tĩnh và ban hành quyết định `GO TO TECHNICAL IMPORT DRY RUN`.
* **Phase 11E (`Technical Dry-Run Audit`):** Đã kiểm định năng lực parse/verify ở mức tài liệu, xác nhận 0 rủi ro ghi đè và đề xuất `GO TO IMPORT TOOL DESIGN`.
* **Phase 11F (`Design & Safety Spec`):** Đã hoàn tất kiến trúc công cụ nạp với Đặc tả Thiết kế (`Design Spec`), Quy tắc Validation (`Validation Rules Spec`), Phân quyền/Kiểm toán/Quay lui (`Permission, Audit & Rollback Spec`) và Ghi chú UI/API (`UI/API Notes`).
* **Phase 11G (`Current Planning Phase`):** **Chỉ lập kế hoạch kỹ thuật, phân rã công việc DTO/Service/Component và xây dựng kịch bản kiểm thử (`Technical Planning Only - Zero Coding`).** Toàn bộ việc viết mã nguồn thực tế (`Coding`) sẽ được khởi động từ Phase 11H/I/J.

---

## 3. Implementation Objectives

Kế hoạch triển khai kỹ thuật đặt ra 8 mục tiêu cốt lõi (`8 Core Technical Implementation Objectives`):
1. **Có Import Tool an toàn (`Secure Import Engine`):** Xây dựng bộ parse CSV và kiểm tra hợp lệ chuyên dụng, không gây sụp đổ dịch vụ (`Zero Service Crash`) khi gặp file lỗi định dạng lớn.
2. **Có Dry-run Validation (`Simulation-First Verification`):** Cung cấp cơ chế rà soát kiểm định trước nạp trên bộ nhớ RAM hoặc giao dịch mô phỏng, bảo đảm 0 dòng nào bị ghi vào DB (`Zero DB Writes in Dry-Run`).
3. **Có Import Execution có kiểm soát (`Controlled Ingestion`):** Nạp dữ liệu vào vùng chờ Staging (`UpdateLog / Pending Candidates`) dưới sự kiểm soát chặt chẽ của Prisma Transaction (`$transaction`).
4. **Có Audit Trail (`100% Traceability`):** Ghi nhận đầy đủ nhật ký kiểm toán bất biến (`Audit Log`) gồm 13 thuộc tính quy định tại Phase 11F cho mọi thao tác validate, execute, active và rollback.
5. **Có Permission Guard (`Dual-Layer RBAC`):** Enforce nghiêm ngặt phân quyền Role-Based Access Control tại lớp API Controller (`@Roles(Role.ADMIN, Role.MANAGER)`) và ẩn/hiện nút bấm trên UI theo đúng vai trò.
6. **Không Active tự động (`Zero Auto-Activation`):** Chặn tuyệt đối mọi luồng tự động chuyển dữ liệu vừa nạp sang trạng thái `ACTIVE / Effective`. Trách nhiệm kích hoạt hiệu lực pháp lý thuộc quyền thẩm định cá nhân của Lãnh đạo Phòng (`Role.MANAGER`).
7. **Có Rollback Strategy (`Safe Reversibility`):** Đảm bảo khả năng bãi bỏ hoặc quay lui các lô dữ liệu nạp sai (`Rollback Batch`) mà không làm tổn hại đến nhật ký kiểm toán hay các văn bản luật hiện hữu.
8. **Có Test đầy đủ trước khi Release (`Zero-Regress Testing`):** Xây dựng bộ test suite tự động (`Unit & Integration Tests`) và kịch bản kiểm thử nghiệm thu người dùng (`UAT`) đạt 100% tiêu chí an toàn mới được ban hành bản Release Candidate.

---

## 4. Proposed Implementation Scope

Bảng đặc tả phạm vi kỹ thuật triển khai cho công cụ nạp (`Technical Implementation Scope Breakdown Table`):

| Scope Item (`Technical Component`) | Description (`Detailed Technical Action`) | Included | Excluded | Notes & Architectural Constraint |
| :--- | :--- | :---: | :---: | :--- |
| **1. Backend Validation Endpoint** | Xây dựng API `POST /api/v2/legal-knowledge/import/validate` xử lý parse buffer CSV 29 cột, kiểm định 16 trường bắt buộc theo Phase 11F. | **YES** | *NO* | Chỉ đọc RAM, 100% `Zero DB Writes`. Trả về JSON rà soát chi tiết (`Valid/Warning/Reject/Duplicate`). |
| **2. Backend Dry-Run Endpoint** | Xây dựng API `POST /api/v2/legal-knowledge/import/dry-run` mô phỏng tạo bản ghi Staging trong Prisma `$transaction` kèm lệnh `ROLLBACK` tự động. | **YES** | *NO* | Giúp xác minh tính toàn vẹn khóa ngoại (`Foreign Key constraints`) mà không ghi dữ liệu thật. |
| **3. Backend Execute Import Endpoint** | Xây dựng API `POST /api/v2/legal-knowledge/import/execute` nạp lô hợp lệ vào bảng Staging (`UpdateLog / Pending Candidates`) với `activeCandidate = false`. | **YES** | *NO* | Yêu cầu `Role.ADMIN`, kiểm tra chữ ký duyệt của `MANAGER`, xác nhận backup và `challengeText`. |
| **4. Import Report & History Endpoints** | Xây dựng API `GET /import/:id/report` và `GET /import/history` truy xuất kết quả rà soát, lịch sử nạp lô và gia phả dữ liệu (`Lineage`). | **YES** | *NO* | Phục vụ cán bộ Pháp chế, Lãnh đạo Phòng và Quản trị viên tra cứu kiểm toán mọi lúc. |
| **5. Permission Guard Integration** | Tích hợp `@Roles(Role.ADMIN, Role.MANAGER)` vào Controller và bổ sung kiểm tra nghiệp vụ chặn `Role.STAFF` và `Role.VIEWER`. | **YES** | *NO* | Đảm bảo tính bất kiêm nhiệm: `ADMIN` nạp kỹ thuật, `MANAGER` duyệt nội dung pháp lý. |
| **6. Audit Trail Logging Service** | Viết service `ImportAuditService` ghi nhận 13 trường bắt buộc vào bảng `LegalUpdateLog` / `UpdateLog` cho mỗi sự kiện nạp/quay lui. | **YES** | *NO* | Nhật ký kiểm toán không bao giờ bị xóa (`Immutable Log Policy`). |
| **7. Frontend Import Studio UI** | Thêm tab/màn hình "Công Cụ Nạp Dữ Liệu (`Import Studio`)" vào `LegalKnowledgePage.tsx` với 10 thành phần UI chuẩn Phase 11F. | **YES** | *NO* | Hiển thị bảng Preview 10 dòng, bảng thống kê Dry-Run, danh sách lỗi cụ thể và modal xác nhận 4 bước. |
| **8. UI Safety Warnings Display** | Ghim cố định 5 lời nhắc cảnh báo pháp lý và vận hành (`Persistent Warning Banners`) trên tất cả các màn hình nạp dữ liệu. | **YES** | *NO* | Cảnh báo rõ AI không thay thế con người và Import không đồng nghĩa với Active. |
| **9. Test Suite (Unit + Integration)** | Viết các file `.spec.ts` kiểm thử backend parser, validator, RBAC guard, transaction rollback và frontend component render. | **YES** | *NO* | Đảm bảo độ phủ kiểm thử cao đối với các luồng từ chối lỗi (`Error / Rejection Paths`). |
| **10. Migration Assessment** | Rà soát `schema.prisma` xem có cần bổ sung model chuyên dụng cho import hay tái sử dụng model hiện hữu (`UpdateLog`). | **YES** *(Plan)* | *NO* *(Code)* | Trong Phase 11G chỉ đánh giá tác động (`Impact Assessment`), không viết migration thực tế. |

---

## 5. Out of Scope

Nhằm đảm bảo sự an toàn tuyệt đối và ngăn chặn sự phình to không kiểm soát của dự án (`Scope Creep Prevention`), các hạng mục sau đây được **lại trừ hoàn toàn khỏi phạm vi triển khai công cụ import (`Out of Scope Mandates`)**:
1. ❌ **Không tự cập nhật pháp luật từ Internet (`No Web Crawling / Auto-Scraping`):** Công cụ không tự động kết nối cổng Thông tin điện tử Chính phủ, Công báo hay Thư viện Pháp luật để cào dữ liệu. Mọi dữ liệu nạp phải do chuyên viên Pháp chế chuẩn bị dưới dạng file CSV qua thẩm định.
2. ❌ **Không tự xác định hiệu lực (`No AI Automated Status Determination`):** Công cụ không tự động suy luận hay đổi trạng thái một văn bản từ `Draft` sang `Effective` dựa trên ngày tháng.
3. ❌ **Không tự Active version (`No Auto-Activation`):** Trình import tuyệt đối không gán cờ `ACTIVE` cho bất kỳ dòng dữ liệu nào sau khi nạp.
4. ❌ **Không tự Rollback version (`No Auto-Reversal`):** Hệ thống không tự động bãi bỏ văn bản luật đang áp dụng nếu không có lệnh thực thi thủ công từ Lãnh đạo Phòng.
5. ❌ **Không thay thế Cán bộ Pháp chế / Nghiệp vụ (`No Human Replacement`):** AI Khối 3.1 và trình Validate chỉ đóng vai trò rà soát định dạng kỹ thuật. Việc đánh giá tính đúng đắn của điều khoản và hạn mức đất đai là trách nhiệm của con người (`Human Supremacy`).
6. ❌ **Không dùng dữ liệu chưa duyệt cho AI review chính thức (`Zero Unapproved Data Usage`):** Trợ lý thẩm định TTHC (Khối 1 & Khối 2) bị cách ly 100% khỏi các bản ghi Staging, Draft hoặc Pending Review từ công cụ import.

---

## 6. Implementation Phasing

Lộ trình thi công mã nguồn được phân chia tuần tự thành 4 giai đoạn độc lập (`4-Stage Implementation Phasing Blueprint`), mỗi giai đoạn có tiêu chí hoàn thành (`DoD`) và kiểm thử riêng:

```text
+---------------------------------------------------------------------------------------------------+
| PHASE 11H: BACKEND IMPORT VALIDATION API IMPLEMENTATION                                           |
| -> Viết DTO (`ImportRecordDto`), CSV Parser Service, 16 Validation Rules, Error Matrix (`VAL-01->14`). |
| -> Endpoints: POST /validate, POST /dry-run. Zero DB Writes. Unit Test Coverage >= 90%.          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| PHASE 11I: BACKEND IMPORT EXECUTE + AUDIT IMPLEMENTATION                                          |
| -> Viết Service `ExecuteBatchImport`, Prisma `$transaction`, RBAC RolesGuard, Audit Logging 13 fields.|
| -> Endpoints: POST /execute, GET /report, GET /history. Pre-import Backup Check. Integration Tests.|
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| PHASE 11J: FRONTEND IMPORT UI IMPLEMENTATION                                                      |
| -> Tích hợp `LegalKnowledgePage.tsx` -> `ImportStudio` Component, Upload CSV, Dry-Run Report Table.|
| -> 4-step Confirmation Modal (`challengeText`), 5 Persistent Warning Banners, RBAC UI hiding.      |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| PHASE 11K: END-TO-END TEST, UAT & RELEASE CANDIDATE                                               |
| -> Kiểm thử toàn trình E2E (Upload CSV -> Validate -> Dry-Run -> Confirm -> Staging -> Audit log).|
| -> Kịch bản kiểm thử UAT với người dùng, rà soát hiệu năng nạp batch lớn và ban hành Release.    |
+---------------------------------------------------------------------------------------------------+
```

---

## 7. Key Safety Controls

Tổng hợp 9 chốt chặn an toàn kỹ thuật bắt buộc phải được thi hành trong từng dòng code ở các phase tiếp theo (`9 Mandatory Technical Safety Controls`):
1. 🛡️ **Dry-run không ghi DB (`Zero-Write Dry Run`):** Chế độ rà soát và mô phỏng tuyệt đối không tạo bản ghi mới hay cập nhật bảng `LegalDocument` / `UpdateLog`.
2. 🛡️ **Execute cần ADMIN / MANAGER (`Strict RBAC Enforcement`):** Endpoint thực thi import kiểm tra xác nhận kép: tài khoản gọi API là `ADMIN`, đồng thời payload chứa chữ ký/ID phê duyệt hợp lệ của `MANAGER`.
3. 🛡️ **Execute cần Confirmation Text (`Exact Text Challenge`):** Kiểm tra chính xác chuỗi `"I UNDERSTAND THIS WILL WRITE TO LEGAL KNOWLEDGE STAGING DB"`. Sai 1 ký tự tự động từ chối giao dịch (`400 Bad Request`).
4. 🛡️ **Execute cần Reason (`Mandatory Justification`):** Yêu cầu tham số `importReason` tối thiểu 20 ký tự giải thích lý do nạp lô.
5. 🛡️ **Execute cần Backup Confirmation (`Pre-import Backup Verification`):** Cờ `confirmDbBackup: true` và mã tham chiếu file `pg_dump` (`backupRefId`) là thông số bắt buộc của payload.
6. 🛡️ **Không Active tự động (`Pending Candidate Lock`):** Dữ liệu nạp vào luôn mang trạng thái `PENDING_REVIEW / DRAFT` và `activeCandidate = false`.
7. 🛡️ **Rejected rows không import (`Strict Rejection Exclusion`):** Mọi bản ghi vi phạm lỗi `CRITICAL` (chẳng hạn `VAL-01 -> 07`) đều bị loại bỏ khỏi danh sách transaction insert.
8. 🛡️ **Duplicate không tự ghi đè (`Zero Auto-Overwrite Policy`):** Phát hiện trùng `source_id` hoặc số hiệu văn bản đang active sẽ chuyển bản ghi vào danh sách `Duplicate` chờ Quản trị viên xử lý, không tự động `UPSERT`.
9. 🛡️ **Audit trail bắt buộc (`100% Immutable Audit`):** Mọi lệnh nạp batch hay quay lui batch đều phải sinh bản ghi nhật ký kiểm toán với đầy đủ 13 trường trước khi commit transaction.

---

## 8. Recommended Next Phase

Dựa trên Kế hoạch Triển khai Kỹ thuật tổng thể Phase 11G đã được xác lập, bước thi công mã nguồn đầu tiên được đề xuất chuyển giao là:

&rarr; **`Phase 11H: Backend Import Validation API Implementation`**  
*(Tập trung lập trình lớp DTO, bộ parse CSV chuẩn UTF-8, động cơ kiểm tra hợp lệ 16 tiêu chí và ma trận lỗi 14 tình huống trên Backend, bảo đảm hoàn toàn `Zero DB Writes`).*

---
*Kế hoạch Triển khai Kỹ thuật Công cụ Nạp (Import Tool Implementation Plan) được lập tự động từ kết quả rà soát và lập kế hoạch Phase 11G.*
