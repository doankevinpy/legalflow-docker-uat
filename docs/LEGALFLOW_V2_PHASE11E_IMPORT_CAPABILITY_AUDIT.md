# LEGALFLOW V2 - PHASE 11E
# IMPORT CAPABILITY AUDIT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11E Standard`  
**Ngày ban hành Báo cáo Audit:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPORT CAPABILITY AUDIT REPORT`** *(Báo cáo Rà soát Tĩnh Khả năng & Năng lực Nạp Dữ liệu Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Báo cáo Rà soát Tĩnh Khả năng và Năng lực Nạp Dữ liệu Tri thức Pháp lý (`Import Capability Audit Report` - Phase 11E) của hệ thống LegalFlow V2. Báo cáo được ban hành dựa trên quá trình rà soát, kiểm tra và phân tích sâu sát trên mã nguồn hiện hữu (`Static Codebase Audit` trên `legalflow-backend`) mà không sửa đổi bất kỳ dòng code nào và hoàn toàn không thực hiện bất kỳ thao tác ghi nào vào cơ sở dữ liệu. Tài liệu làm rõ phạm vi rà soát (`Audit Scope`), liệt kê chính xác các phát hiện kỹ thuật (`Findings`), chỉ ra các rủi ro hệ thống tiềm ẩn (`Technical Risks`) và ban hành khuyến nghị giải pháp (`Recommendation`) làm nền tảng chuẩn bị cho giai đoạn thiết kế công cụ nạp chuyên dụng (`Phase 11F`).

---

## 2. Audit Scope

Bảng phân định 9 khu vực rà soát tĩnh kỹ thuật chuyên sâu trên mã nguồn và kiến trúc cơ sở dữ liệu hiện hữu (`9-Area Technical Audit Scope Table`):

| Area (`Codebase / System Component`) | What to Check (`Verification Target`) | Finding (`Static Audit Observation`) | Risk (`Identified Technical Risk`) | Recommendation (`Corrective Direction`) | Notes & Governance Check |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Backend Legal Knowledge module** | Rà soát `legal-knowledge.module.ts`, `controller.ts` và `service.ts` để kiểm tra các API endpoints hiện có. | Module hiện tại cung cấp đầy đủ các endpoints đọc (`GET documents/:id`) và workflow quản lý phiên bản (`activateDraftVersion`, `createDraftVersion`...). **Chưa có API `POST /import` hay `POST /documents` chuyên dụng cho việc nạp batch CSV**. | Rủi ro phải nạp dữ liệu thủ công qua câu lệnh trực tiếp hoặc phụ thuộc vào seed script thiếu kiểm soát nạp batch. | Thiết lập một endpoint chuyên dụng `POST /legal-knowledge/import-csv` hoặc module `import-service` ở giai đoạn thiết kế tới. | Xác nhận nguyên tắc chỉ rà soát tĩnh - không can thiệp code (`Zero Code Modification`). |
| **2. Service / controller liên quan** | Kiểm tra sự liên kết giữa `LegalKnowledgeService` và `ProcedureAiService` trong việc đọc ngữ cảnh pháp lý. | `ProcedureAiService` gọi `resolveActiveLegalContext()` và `createLegalSnapshot()`. Hệ thống chỉ đọc các văn bản có trạng thái `ACTIVE` hợp lệ. | Nếu nạp nhầm văn bản chưa duyệt (`Draft / Pending`) và gán cờ active, AI Khối 3.1 sẽ trích dẫn sai căn cứ luật ngay lập tức. | Khóa chặt cơ chế: mọi bản ghi mới nạp từ CSV đều phải bắt buộc đi qua luồng rà soát `START_REVIEW -> APPROVE_FOR_VERSIONING -> ACTIVATE`. | Chốt chặn an toàn: AI chỉ đọc phiên bản active đã được Lãnh đạo Cơ quan phê duyệt. |
| **3. Seed / import script nếu có** | Kiểm tra file `prisma/seed.ts` và thư mục `scripts/` để xác định công cụ nạp dữ liệu ban đầu. | Phát hiện hàm `seedLegalKnowledge(adminId)` trong `prisma/seed.ts`. Hàm này hardcode mảng 4 văn bản (`seed-legal-doc-land-2024...`) và thực thi `prisma.legalDocument.upsert()`. **Không có standalone CLI tool cho việc đọc dynamic CSV**. | Script `seed.ts` hiện tại tạo bản ghi thẳng ở trạng thái `ACTIVE` mà không qua bước staging, gây rủi ro lớn nếu dùng cho production import. | **`Existing script must not be used for production import until reviewed, backed up, dry-run tested and approved.`** | Phân định ranh giới rõ ràng giữa Dev Seeding (`seed.ts`) và Production Ingestion (`Import Engine`). |
| **4. Prisma model liên quan Legal Knowledge** | Đối chiếu cấu trúc model `LegalDocument`, `LegalDocumentVersion` và `UpdateLog` trong `prisma/schema.prisma`. | Schema hiện hữu có đầy đủ các trường cơ bản (`documentCode, documentTitle, documentType, issuingAuthority, effectiveFrom, status, summary`). | Một số trường metadata mở rộng của Phase 11C (`localApplicability, riskNote, amendsDocument...`) hiện chưa có cột riêng trên `LegalDocument` mà cần ánh xạ qua JSON metadata/UpdateLog. | Xây dựng bộ biến đổi ánh xạ (`JSON Metadata Adapter`) trong `import-service` để lưu trữ trọn vẹn 29 trường Phase 11C mà không cần alter table. | Bảo đảm tuân thủ tuyệt đối nguyên tắc không sửa đổi schema DB (`Zero Schema Modification`). |
| **5. API create / update** | Kiểm tra khả năng tạo mới và cập nhật từng văn bản thông qua REST API. | Các thao tác tạo mới hiện được dẫn dắt thông qua quy trình `UpdateLog` (`createDraftVersion`, `createProcedureTypeDraft`). Không có API CRUD tự do cho `LegalDocument`. | Nếu mở API CRUD tự do thiếu kiểm soát, nhân viên có thể sửa đổi trực tiếp nội dung văn bản luật đang active trên DB. | Duy trì kiến trúc hiện tại: mọi thay đổi tri thức pháp lý bắt buộc phải đi qua luồng nhật ký cập nhật (`UpdateLog Workflow`). | Giữ vững tính bất biến (`Immutability`) của các phiên bản luật đã công bố. |
| **6. Review / activation workflow** | Kiểm tra cơ chế `handleWorkflowAction` (`START_REVIEW`, `APPROVE_FOR_VERSIONING`, `ACTIVATE`, `ROLLBACK`). | Cơ chế quản trị workflow hiện hữu được thiết kế rất chặt chẽ và an toàn, phân tách rõ quyền hạn giữa rà soát nháp và kích hoạt chính thức. | Hệ thống nạp CSV mới nếu không móc nối vào workflow này sẽ tạo ra "lỗ hổng đường vòng" (`Bypass Vulnerability`). | Công cụ import CSV ở phase sau bắt buộc phải sinh ra các bản ghi `UpdateLog` ở trạng thái `DRAFT / PENDING_REVIEW` thay vì ghi thẳng `ACTIVE`. | Chuyển hóa file CSV thành các phiếu đề xuất cập nhật tri thức pháp lý chuẩn. |
| **7. Audit trail** | Kiểm tra khả năng truy vết lịch sử cập nhật và kích hoạt phiên bản tri thức. | Hệ thống cung cấp đầy đủ các endpoints truy vết: `GET update-logs`, `GET activation-verification`, `GET rollback-verification`. | Không có rủi ro mất dấu vết đối với các thao tác đi qua `LegalKnowledgeController`. | Tiếp tục kế thừa và tận dụng tối đa hệ thống log truy vết này cho toàn bộ lịch sử import CSV sau này. | Đảm bảo tính minh bạch và khả năng kiểm toán 100% (`100% Auditability`). |
| **8. Permission guard** | Rà soát phân quyền Role-Based Access Control (`RolesGuard`) trên các endpoints. | Các endpoints thay đổi trạng thái (`analyzeImpact, startReview, approveForVersioning, activateDraftVersion`) đều được bảo vệ nghiêm ngặt bởi `@Roles(Role.ADMIN, Role.MANAGER)`. | An toàn cao. Chỉ có `ADMIN` và `MANAGER` mới có quyền tác động đến luồng phiên bản. | Thiết lập phân quyền `@Roles(Role.ADMIN)` cho endpoint `POST import-csv` và `@Roles(Role.MANAGER)` cho bước phê duyệt kích hoạt batch. | Phân định rõ trách nhiệm: Kỹ thuật viên nạp batch (`ADMIN`) - Lãnh đạo Phòng duyệt live (`MANAGER`). |
| **9. Validation logic** | Kiểm tra bộ kiểm tra hợp lệ dữ liệu đầu vào (`DTO Validation` và Business logic checks). | Controller hiện sử dụng `Body()` và kiểm tra logic trạng thái bên trong `service.handleWorkflowAction()`. Chưa có DTO chuyên dụng validate 29 cột CSV. | Rủi ro nạp file CSV chứa ngày tháng sai chuẩn ISO hoặc khuyết trường bắt buộc nếu không xây dựng bộ lọc trước nạp. | Xây dựng class `ImportLegalKnowledgeCsvDto` tích hợp bộ kiểm tra 14 tiêu chí Phase 11C trước khi cho phép parse dữ liệu. | Bảo đảm chỉ dữ liệu đạt chuẩn 100% mới được phép bước vào vùng chờ Staging. |

---

## 3. Findings

Bảng tổng hợp 5 phát hiện kỹ thuật cốt lõi qua quá trình rà soát tĩnh trên mã nguồn `legalflow-backend` (`5-Point Static Codebase Findings Table`):

| Finding ID | Area (`Reviewed Module`) | Description (`Technical Observation & Analysis`) | Severity (`Low/Med/High`) | Recommendation (`Required Engineering Action`) | Status | Notes & Governance Sign-off |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| **AUD-01** | **Import Mechanism (`Controller / Service`)** | **`No production import mechanism confirmed during static audit. A future technical implementation phase is required before real import.`** | **`HIGH`** *(Khoảng trống kiến trúc)* | Thiết lập một module chuyên dụng (`LegalKnowledgeImportService`) và endpoint an toàn tại Phase 11F để xử lý đọc, parse và validate batch file CSV theo tiêu chuẩn 29 trường Phase 11C. | `[ IDENTIFIED ]` | Khẳng định không thể nạp CSV động vào production nếu không có công cụ kiểm soát nạp chuẩn. |
| **AUD-02** | **Seed Script (`prisma/seed.ts`)** | **`Existing script must not be used for production import until reviewed, backed up, dry-run tested and approved.`** | **`HIGH`** *(Rủi ro quy trình)* | Nghiêm cấm sử dụng hàm `seedLegalKnowledge` trong `seed.ts` để chạy nạp dữ liệu thực tế trên production, vì hàm này ghi thẳng trạng thái `ACTIVE` mà không qua rà soát của Lãnh đạo Phòng. | `[ MANDATORY WARNING ]` | Bảo vệ sự thanh khiết của dữ liệu production khỏi các script dev seeding ban đầu. |
| **AUD-03** | **Metadata Mapping (`Prisma Schema`)** | Schema `LegalDocument` có các trường cơ bản (`documentCode, documentTitle, documentType, effectiveFrom...`). Các trường mở rộng Phase 11C (`localApplicability, riskNote, amendsDocument...`) cần được ánh xạ vào JSON metadata/UpdateLog. | `MEDIUM` *(Yêu cầu ánh xạ)* | Xây dựng bộ biến đổi ánh xạ (`JSON Metadata Adapter`) để đóng gói các trường mở rộng vào thuộc tính JSON cấu trúc, bảo đảm không cần can thiệp hay sửa đổi schema DB. | `[ IDENTIFIED ]` | Tuân thủ cam kết 100% giữ nguyên cấu trúc database hiện hữu (`Zero Schema Modification`). |
| **AUD-04** | **Staging Workflow (`Workflow Engine`)** | Kiến trúc workflow `UpdateLog` (`handleWorkflowAction`) rất vững chắc. Mọi thay đổi tri thức đều phải qua `DRAFT -> REVIEW -> APPROVED -> ACTIVATED`. | `LOW` *(Kiến trúc tốt)* | Kế thừa trọn vẹn luồng workflow này: công cụ import CSV chỉ được phép sinh ra các phiếu đề xuất `UpdateLog` ở trạng thái chờ rà soát (`Staging Candidate`). | `[ VERIFIED ]` | Bảo đảm sự nhất quán tuyệt đối về quy trình quản trị tri thức trên toàn hệ thống. |
| **AUD-05** | **Access Control (`RBAC Guard`)** | Hệ thống `RolesGuard` hoạt động chặt chẽ, khóa quyền tác động workflow cho `Role.ADMIN` và `Role.MANAGER`. | `LOW` *(Bảo mật tốt)* | Tiếp tục áp dụng phân quyền kép: `ADMIN` chịu trách nhiệm chạy lệnh/endpoint nạp batch CSV vào vùng Staging; `MANAGER` chịu trách nhiệm ký duyệt kích hoạt live. | `[ VERIFIED ]` | Nguyên tắc bất kiêm nhiệm (`Separation of Duties`) được thực thi triệt để. |

---

## 4. Technical Risks

Danh mục 8 rủi ro kỹ thuật nghiêm trọng cần được kiểm soát và vô hiệu hóa trước khi vận hành nạp dữ liệu thực tế (`8 Mandatory Technical Risk Mitigations`):
1. 🛑 **Import thiếu validation (`Missing Pre-import Validation Risk`):** Nạp thẳng file CSV vào DB mà không chạy qua bộ lọc 14 tiêu chí Phase 11C, dẫn đến lỗi sai ngày tháng ISO (`YYYY-MM-DD`) hoặc khuyết thông tin định danh văn bản (`docNumber`).
2. 🛑 **Import bỏ qua `approval_status` (`Unapproved Data Ingestion Risk`):** Cho phép nạp các bản ghi có `approval_status != Approved` (`Draft`, `Pending Review`, `Rejected`), làm ô nhiễm kho dữ liệu tri thức chính thức.
3. 🛑 **Import tự active (`Unauthorized Auto-Activation Risk`):** Script nạp tự động gán cờ `status = ACTIVE` hoặc `active_candidate = true` ngay khi insert, bypass hoàn toàn thẩm quyền phê duyệt kiểm duyệt của Lãnh đạo Phòng.
4. 🛑 **Import duplicate (`Duplicate Document Number Risk`):** Nạp trùng lặp số hiệu văn bản (`31/2024/QH15`) gây crash hệ thống do vi phạm chỉ mục duy nhất (`Unique Index Violation`) trên database.
5. 🛑 **Import sai hiệu lực (`Expired / Invalid Status Ingestion Risk`):** Nạp nhầm các văn bản đã hết hiệu lực thi hành (`Expired`) hoặc chưa xác định (`Unknown`) vào luồng tra cứu active của AI Khối 3.1.
6. 🛑 **Import thiếu local scope (`Ambiguous Territorial Scope Risk`):** Văn bản địa phương quy định hạn mức đất hoặc quy hoạch nhưng thiếu trường `local_applicability`, khiến hệ thống áp dụng nhầm quy tắc giữa các huyện/xã.
7. 🛑 **Import không có rollback / audit (`Zero Audit / Rollback Risk`):** Chạy script SQL thuần hoặc công cụ bên thứ ba không ghi nhận nhật ký `UpdateLog`, khiến hệ thống mất khả năng truy vết người nạp và không thể quay lui khi xảy ra lỗi dữ liệu lớn.
8. 🛑 **Import dữ liệu chưa duyệt (`Sensitive / Secret Data Leakage Risk`):** Sơ ý nạp các file CSV chứa thông tin nội bộ mật, token hay mật khẩu vào cơ sở dữ liệu hoặc commit lên Git repository.

---

## 5. Recommendation

Dựa trên kết quả rà soát tĩnh mã nguồn và phân tích 8 rủi ro kỹ thuật trên, Hội đồng Đánh giá Kỹ thuật ban hành **4 Khuyến nghị Quản trị & Kỹ thuật cốt lõi (`4 Fundamental Technical Recommendations`)**:
1. **Chưa import thật tại thời điểm này (`Pre-import Hold Mandate`):** Khẳng định tại Phase 11E, hệ thống chỉ kiểm thử và đánh giá trên giấy/tài liệu. Tuyệt đối không chạy bất kỳ lệnh nạp dữ liệu thật nào vào DB cho đến khi công cụ import an toàn được thiết kế và kiểm chứng trọn vẹn.
2. **Cần phase riêng nếu muốn xây import tool (`Dedicated Import Tool Design Phase`):** Để lấp đầy khoảng trống kỹ thuật (`AUD-01`), dự án cần thiết lập một giai đoạn thiết kế chuyên sâu độc lập &rarr; **`Phase 11F: Legal Knowledge Import Tool Design & Safety Specification`** nhằm tài liệu hóa kiến trúc, DTO validation và cơ chế staging của module nạp tự động.
3. **Import thật phải có backup, validation, approval, rollback plan (`4-Pillar Real Import Pre-conditions`):** Khi bước vào giai đoạn nạp thật trong tương lai, mọi thao tác import bắt buộc phải đi kèm 4 trụ cột an toàn: (1) Sao lưu DB `pg_dump` trước nạp, (2) Validate 100% dòng CSV theo Phase 11C, (3) Chỉ nạp bản ghi `Approved`, và (4) Sẵn sàng kịch bản phục hồi khẩn cấp (`Rollback Plan`).
4. **Active version phải là bước riêng có kiểm soát (`Decoupled Activation Gate`):** Quán triệt nguyên tắc tách biệt hai giai đoạn: Giai đoạn 1 là Nạp kỹ thuật vào vùng chờ (`Staging Ingestion` bởi `ADMIN`); Giai đoạn 2 là Thẩm định và Kích hoạt hiệu lực pháp lý (`Version Activation` bởi `MANAGER`). Không bao giờ cho phép gộp 2 bước này làm một trong các script tự động.

---
*Báo cáo Rà soát Tĩnh Khả năng & Năng lực Nạp Dữ liệu Tri thức Pháp lý (Import Capability Audit) được lập tự động từ kết quả Phase 11E.*
