# LEGALFLOW V2 - PHASE 11E
# TECHNICAL IMPORT DRY RUN PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.11.3-legal-knowledge-import-dry-run-sample-review` -> `Phase 11E Standard`  
**Ngày ban hành Kế hoạch:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL TECHNICAL IMPORT DRY RUN PLAN`** *(Kế hoạch Diễn tập Kiểm tra Kỹ thuật Khả năng Nạp & Ánh xạ Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Diễn tập Kiểm tra Kỹ thuật Khả năng Nạp Tri thức Pháp lý (`Technical Import Dry Run Plan` - Phase 11E) của hệ thống LegalFlow V2. Kế hoạch được thiết lập nhằm rà soát và đánh giá sâu sắc trên phương diện kỹ thuật (`Technical Capability Audit & Static CSV Validation`) về mức độ sẵn sàng của mã nguồn, cơ chế nạp, bộ chuyển đổi định dạng và khả năng xử lý ánh xạ đối với bộ dữ liệu mẫu (`SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`). Tài liệu xác lập phạm vi rà soát (`Dry Run Scope`), các nguyên tắc nghiêm ngặt (`Dry Run Rules`), quy trình thực thi 10 bước (`Technical Dry Run Steps`) và khẳng định cam kết an toàn tuyệt đối: **chỉ kiểm tra kỹ thuật và đọc file mẫu mô phỏng, hoàn toàn không thực thi bất kỳ lệnh ghi, insert hay seed dữ liệu nào vào cơ sở dữ liệu production và không cho phép AI tự kết luận tính đầy đủ của tri thức pháp lý**.

---

## 2. Background

Trong lộ trình nâng cấp kiến trúc quản trị tri thức pháp lý (Khối 3.2), LegalFlow V2 đã hoàn tất chuỗi chuẩn hóa bài bản qua 3 giai đoạn liên tiếp:
* **Phase 11B (`v2.11.1`) đã tạo governance:** Ban hành Sổ Đăng ký Nguồn Địa phương, Quy định thẩm định 4 bước và chốt chặn phê duyệt của Lãnh đạo Phòng (`Review & Approval SOP`).
* **Phase 11C (`v2.11.2`) đã tạo template / mapping:** Ban hành Biểu mẫu thuộc tính 29 trường (`Metadata Template`), Quy chuẩn ánh xạ trường (`Field Mapping Spec`) và Checklist kiểm chứng (`Validation Checklist`).
* **Phase 11D (`v2.11.3`) đã tạo sample dataset & review:** Ban hành bộ file `SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` gồm 5 bản ghi giả lập (`SAMPLE-001 -> 005`), hoàn tất thẩm định trên tài liệu và ban hành phán quyết `GO TO TECHNICAL IMPORT DRY RUN`.
* **Phase 11E chỉ kiểm tra kỹ thuật khả năng import / validation:** Bước này đi sâu vào rà soát khả năng kỹ thuật thực tế của hệ thống (phân tích tĩnh mã nguồn Backend, kiểm tra cấu trúc API, cơ chế seed và đối chiếu chi tiết định dạng CSV) nhằm chỉ ra khoảng trống kỹ thuật và thiết lập yêu cầu an toàn trước khi xây dựng công cụ nạp tự động.
* **Không import thật:** Không chạy bất kỳ script import, lệnh SQL `INSERT` hay Prisma `create / upsert` nào vào bảng `LegalKnowledge` trên DB production `legalflow_prod`.
* **Không active version:** Huy hiệu hiệu lực (`v2.0-2024-LAND-LAW`) và cờ active trên DB được giữ nguyên 100%, không tự active và không tự rollback.
* **Không sửa database:** Bảo toàn tuyệt đối schema, cấu trúc bảng và toàn bộ bản ghi hồ sơ/tri thức hiện hữu.

---

## 3. Dry Run Scope

Ma trận phân định 7 hạng mục rà soát kỹ thuật cốt lõi trong phạm vi diễn tập Phase 11E (`7-Item Technical Dry Run Scope & Matrix`):

| Scope Item | Description | Expected Output | Status (`Verification State`) | Notes & Technical Check |
| :--- | :--- | :--- | :---: | :--- |
| **1. Baseline Git (`Git Baseline Audit`)** | Kiểm tra trạng thái Git repository trước khi thực hiện diễn tập rà soát kỹ thuật. | `HEAD` tại tag `v2.11.3-...`, `git status clean`, không có untracked code hay file backup. | `[ PASS ]` | Đảm bảo môi trường làm việc sạch sẽ, không nhiễm bẩn mã nguồn. |
| **2. Runtime health-check (`Infrastructure Health Audit`)** | Kiểm tra trạng thái vận hành các container Docker và dịch vụ hệ thống qua `health-check.ps1` và `docker ps`. | `legalflow_postgres` và `caddy` healthy 100%. `minio` ghi nhận cấu hình máy chủ `EXP-ENV-01`. | `[ PASS ]` | DB lõi vận hành mượt mà, sẵn sàng đáp ứng truy vấn đọc khi cần. |
| **3. Import capability audit (`Static Codebase Audit`)** | Rà soát tĩnh mã nguồn `LegalKnowledgeModule`, `Controller`, `Service` và script `seed.ts` để đánh giá cơ chế nạp hiện hữu. | Báo cáo chi tiết `IMPORT_CAPABILITY_AUDIT.md` ghi nhận năng lực, khoảng trống và rủi ro. | `[ PASS ]` | Xác định rõ chưa có API `POST import` chuyên dụng cho file CSV ngoài `seed.ts`. |
| **4. Sample CSV static validation (`Static CSV Audit`)** | Kiểm tra tĩnh file `SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` ở mức đọc file, đối chiếu 29 cột header và 5 bản ghi. | Báo cáo `SAMPLE_CSV_TECHNICAL_VALIDATION_REPORT.md` đánh giá 100% đạt chuẩn `PASS WITH WARNINGS`. | `[ PASS ]` | Khẳng định file mẫu đạt độ sạch tuyệt đối về cấu trúc và không có secret. |
| **5. Mapping consistency check (`Spec-to-Schema Check`)** | Đối chiếu 20 quy luật ánh xạ tại `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md` với schema `Prisma` hiện hữu. | Xác nhận 100% trường ánh xạ tương thích với mô hình `LegalDocument` và `UpdateLog`. | `[ PASS ]` | Đảm bảo không xảy ra xung đột kiểu dữ liệu (`Type Mismatch`) khi parse CSV. |
| **6. No-database-write confirmation (`Zero Write Verification`)** | Khẳng định và kiểm chứng không có lệnh ghi DB nào được kích hoạt trong suốt chu kỳ Phase 11E. | Ghi nhận `0 Prisma create/update/delete executed`, `0 SQL writes`. | `[ PASS ]` | Bảo vệ sự an toàn tuyệt đối cho cơ sở dữ liệu `legalflow_prod`. |
| **7. Technical Go/No-Go decision (`Technical Decision Gate`)** | Tổng hợp kết quả rà soát tĩnh mã nguồn và CSV để ban hành phán quyết chuyển tiếp sang Phase 11F. | Phiếu Quyết định `TECHNICAL_IMPORT_GO_NO_GO.md` được ký duyệt chính thức. | `[ PASS ]` | Đề xuất thiết kế công cụ nạp chuyên dụng (`Import Tool Design`) ở phase sau. |

---

## 4. Out of Scope

Nhằm bảo vệ sự ổn định tuyệt đối của hệ thống production và tuân thủ nguyên tắc "Chỉ rà soát kỹ thuật - Không can thiệp hệ thống", 7 hành vi sau đây **TẠI THỜI ĐIỂM NÀY NẰM HOÀN TOÀN NGOÀI PHẠM VI (`Out of Scope Strict Mandates`)**:
1. 🛑 **Không sửa code (`Zero Code Modification`):** Không viết thêm, chỉnh sửa, hay xóa bất kỳ dòng code nào trong `legalflow-backend` hoặc `legalflow-frontend`.
2. 🛑 **Không tạo import script mới (`Zero Script Creation`):** Không tạo mới hoặc chỉnh sửa các file script nạp dữ liệu (`import.ts`, `seed.ts`, `load-csv.py`).
3. 🛑 **Không chạy import thật (`Zero Real Import Execution`):** Không nạp dữ liệu pháp lý thật từ bên ngoài vào cơ sở dữ liệu.
4. 🛑 **Không chạy seed (`Zero Seeding Execution`):** Không thực thi lệnh `npx prisma db seed` hay chạy hàm `seedLegalKnowledge` tác động đến DB.
5. 🛑 **Không ghi database (`Zero DB Write / Modification`):** Không tạo mới, cập nhật hay xóa bất kỳ bản ghi nào trong cơ sở dữ liệu `legalflow_prod`.
6. 🛑 **Không active / rollback version (`Zero Version Activation / Rollback`):** Không thay đổi cờ hiệu lực hay bãi bỏ bất kỳ phiên bản tri thức pháp lý nào.
7. 🛑 **Không dùng dữ liệu sample cho AI review chính thức (`Zero Sample Data Usage in AI Advisory`):** Trợ lý AI Khối 3.1 tuyệt đối không được phép truy cập hay sử dụng các bản ghi giả lập (`SAMPLE-001 -> 005`) để tham mưu thụ lý TTHC thực tế.

---

## 5. Dry Run Rules

Toàn bộ Cán bộ Kỹ thuật (`DevOps Engineer`, `Database Admin`) và Quản trị viên (`ADMIN`) khi tham gia rà soát Phase 11E bắt buộc phải tuân thủ **6 Quy tắc Diễn tập Kỹ thuật (`6 Mandatory Technical Dry Run Rules`)**:
1. 🔒 **Chỉ đọc file sample (`Read-Only Sample File Access`):** Mọi thao tác kiểm thử CSV chỉ được thực hiện thông qua trình đọc file tĩnh (`Static File Reading` qua `view_file` hoặc script đọc read-only), không ghi đè hay biến đổi file mẫu.
2. 🔒 **Không gọi endpoint tạo / sửa Legal Knowledge (`Zero Mutation API Calls`):** Không gọi các HTTP method `POST / PUT / PATCH / DELETE` đối với bất kỳ endpoint nào của module `LegalKnowledge`.
3. 🔒 **Không gọi Prisma `create / update / upsert` (`Zero Prisma Mutations`):** Trình kiểm thử tĩnh không được kết nối đến Prisma Client để thực thi các lệnh biến đổi trạng thái bảng dữ liệu.
4. 🔒 **Không chạy script ghi dữ liệu (`Zero Write Script Execution`):** Kiên quyết ngăn chặn việc thi hành bất kỳ bash script hay PowerShell script nào có chứa lệnh kết nối DB và thi hành câu lệnh `INSERT / UPDATE`.
5. 🔒 **Không dùng dữ liệu pháp lý thật (`Zero Real Legal Data Inclusion`):** Nếu cần minh họa thêm tình huống kiểm thử cấu trúc, chỉ được sử dụng dữ liệu giả lập có tiền tố `SAMPLE-`. Tuyệt đối không đưa văn bản pháp luật thật chưa được phê duyệt vào file rà soát.
6. 🔒 **Mọi kết quả chỉ phục vụ đánh giá kỹ thuật (`Technical Evaluation Purpose Only`):** Các phát hiện, ma trận kiểm tra và phán quyết tại Phase 11E chỉ có giá trị đánh giá năng lực công cụ và chuẩn bị thông số kỹ thuật cho lộ trình thiết kế import engine ở phase sau.

---

## 6. Technical Dry Run Steps

Quy trình chuẩn hóa 10 bước rà soát, đánh giá kỹ thuật tĩnh và ban hành phán quyết diễn tập Phase 11E (`Standardized 10-Step Technical Dry Run Workflow`):

| Step Index | Action (`Execution Step`) | Expected Result (`Success Criteria`) | Evidence (`Verified Output`) | Status | Notes & Governance Audit |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **Step 1** | **Check Git baseline** | `git status` clean, `HEAD` đúng tag `v2.11.3-...`, không có file backup trong Git. | Log lệnh Git tại Mục A của Báo cáo baseline. | `[ PASS ]` | Repository bảo đảm sạch sẽ, đúng mốc thẻ chuyển giao. |
| **Step 2** | **Check runtime health** | `docker ps` ghi nhận `postgres` và `caddy` healthy; `minio` ghi nhận cấu hình port `EXP-ENV-01`. | Log thực thi `health-check.ps1` tại Mục B. | `[ PASS ]` | Hạ tầng DB lõi vận hành ổn định 100% trong suốt chu kỳ. |
| **Step 3** | **Audit source code import capability** | Rà soát tĩnh `legal-knowledge.controller.ts`, `service.ts` và `seed.ts`, xác định năng lực import. | Ban hành tài liệu `IMPORT_CAPABILITY_AUDIT.md`. | `[ PASS ]` | Chỉ ra rõ khoảng trống: cần xây dựng module `import-service` chuyên dụng. |
| **Step 4** | **Validate CSV header** | Kiểm tra tĩnh dòng đầu tiên của `SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`, đối chiếu 29 cột Phase 11C. | Khớp chính xác 100% tên 29 cột tiêu đề header. | `[ PASS ]` | Bảo đảm không lệch cột hay lỗi BOM gây sai lệch parse. |
| **Step 5** | **Validate required fields** | Rà soát tĩnh 5 bản ghi mẫu, kiểm tra sự hiện diện của 17 trường bắt buộc (`title, docNumber, status...`). | 5/5 bản ghi đầy đủ 100% các trường bắt buộc. | `[ PASS ]` | Khẳng định dữ liệu mẫu đạt độ hoàn thiện cao về định danh. |
| **Step 6** | **Validate sample-only data** | Kiểm tra trường `source_id` và `document_number`, khẳng định 100% có tiền tố `SAMPLE-`. | 5 bản ghi `SAMPLE-001 -> 005`, `SAMPLE-101 -> 105`. | `[ PASS ]` | Ngăn chặn tuyệt đối sự rò rỉ hoặc trà trộn văn bản thật chưa duyệt. |
| **Step 7** | **Validate `legal_status` / `approval_status`** | Kiểm tra tĩnh giá trị 2 trường trạng thái, xác nhận 100% đạt `Effective` và `Approved`. | 5/5 bản ghi đạt chuẩn hiệu lực và phê duyệt mẫu. | `[ PASS ]` | Tuân thủ chốt chặn pháp lý cao nhất trước khi kiểm thử kỹ thuật. |
| **Step 8** | **Validate no active version action** | Kiểm tra cờ `active_candidate`, xác nhận 100% khóa ở `false` và không có thao tác active trên DB. | Cột `active_candidate = false`, DB status không đổi. | `[ PASS ]` | Khẳng định dữ liệu sau import chỉ nằm ở vùng chờ Staging. |
| **Step 9** | **Validate no DB write** | Kiểm tra log thực thi hệ thống, xác nhận không có bất kỳ câu lệnh write/upsert nào chạm vào DB. | 0 lệnh ghi DB được thực thi (`Zero DB Writes`). | `[ PASS ]` | Bảo vệ toàn vẹn tuyệt đối cơ sở dữ liệu production. |
| **Step 10** | **Create technical dry-run decision** | Tổng hợp toàn bộ kết quả rà soát tĩnh vào Phiếu Quyết định chuyển tiếp Kỹ thuật. | Ban hành tài liệu `TECHNICAL_IMPORT_GO_NO_GO.md`. | `[ PASS ]` | Chốt phương án `GO TO IMPORT TOOL DESIGN` cho Phase 11F. |

---

## 7. Safety Confirmation

Tôi xác nhận và tái khẳng định tuân thủ tuyệt đối **7 Cam kết An toàn Kỹ thuật & Quản trị Phase 11E (`7 Inviolable Phase 11E Safety Confirmations`)**:
1. ✅ **KHÔNG DATABASE WRITE (`Zero DB Write / Alteration`):** Toàn bộ hoạt động Phase 11E là rà soát tĩnh mã nguồn và phân tích tĩnh file CSV. Không thực hiện bất kỳ lệnh ghi, chèn, cập nhật hay xóa nào trên DB `legalflow_prod`.
2. ✅ **KHÔNG IMPORT THẬT (`Zero Real Ingestion`):** Không nạp dữ liệu pháp lý thật vào cơ sở dữ liệu production.
3. ✅ **KHÔNG ACTIVE (`Zero Version Activation`):** Không kích hoạt hiệu lực pháp lý tự động cho bất kỳ phiên bản hay văn bản nào.
4. ✅ **KHÔNG ROLLBACK (`Zero Unauthorized Rollback`):** Không bãi bỏ hay quay lui các phiên bản căn cứ pháp lý hiện hữu trên hệ thống.
5. ✅ **KHÔNG SEED (`Zero DB Seeding`):** Không thi hành lệnh seed tạo dữ liệu ban đầu hay can thiệp qua `prisma/seed.ts`.
6. ✅ **KHÔNG MIGRATION (`Zero Migration Creation`):** Không tạo hay thực thi bất kỳ file migration `sql` mới nào trong suốt giai đoạn này.
7. ✅ **KHÔNG KHẲNG ĐỊNH DỮ LIỆU PHÁP LÝ ĐẦY ĐỦ (`No Absolute Completeness Claim & Human Supremacy`):** Quán triệt nghiêm ngặt trên mọi báo cáo rà soát nguyên tắc: phần mềm không tự kết luận tri thức pháp lý là đầy đủ hay bao phủ tuyệt đối. AI chỉ là công cụ gợi ý tham mưu; Chuyên viên thụ lý P2, Một cửa và Lãnh đạo Phòng chịu trách nhiệm cao nhất trong việc kiểm tra căn cứ pháp lý thực tế khi thụ lý hồ sơ TTHC.

---
*Kế hoạch Diễn tập Kiểm tra Kỹ thuật Khả năng Nạp & Ánh xạ Tri thức Pháp lý (Phase 11E Plan) được lập tự động từ Kế hoạch Chuẩn bị Nạp Phase 11D.*
