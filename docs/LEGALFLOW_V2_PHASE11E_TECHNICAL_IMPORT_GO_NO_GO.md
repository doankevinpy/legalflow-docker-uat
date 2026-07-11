# LEGALFLOW V2 - PHASE 11E
# TECHNICAL IMPORT GO / NO-GO

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11E Standard`  
**Ngày ban hành Quyết định:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL TECHNICAL IMPORT GO / NO-GO DECISION SIGN-OFF`** *(Phiếu Quyết định Chuyển tiếp Thiết kế Công cụ Nạp & Diễn tập Kỹ thuật Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Phiếu Quyết định Chuyển tiếp Kỹ thuật đối với Năng lực Nạp Dữ liệu Tri thức Pháp lý (`Technical Import Go / No-Go Decision` - Phase 11E) của hệ thống LegalFlow V2. Tài liệu tổng hợp kết quả rà soát khả năng kỹ thuật tĩnh trên mã nguồn (`Import Capability Audit`), thẩm định tĩnh cấu trúc file CSV mẫu (`Sample CSV Technical Validation`), thiết lập bảng kiểm soát phán quyết 10 tiêu chí (`Go / No-Go Checklist`), phân tích các hướng lựa chọn quyết định (`Decision Options`), chính thức công bố phán quyết kỹ thuật đề xuất (`Recommended Decision`) và quy định bắt buộc 9 điều kiện tiên quyết (`Required Conditions Before Any Real Import`) trước khi cho phép tiến hành thiết kế và triển khai công cụ nạp tự động (`Phase 11F`).

---

## 2. Decision Context

Quyết định kỹ thuật này được ban hành trên nền tảng chuỗi thành quả quản trị và rà soát kỹ thuật liên hoàn của hệ thống LegalFlow V2:
* **Phase 11B (`v2.11.1`) governance đã có:** Ban hành Sổ Đăng ký Nguồn Địa phương và Quy định thẩm định 4 bước, thiết lập chốt chặn phê duyệt của Lãnh đạo Phòng (`Review & Approval SOP`).
* **Phase 11C (`v2.11.2`) template / mapping đã có:** Ban hành Biểu mẫu thuộc tính 29 trường (`Metadata Template`), Quy chuẩn ánh xạ trường (`Mapping Spec`) và Checklist kiểm chứng 14 điểm.
* **Phase 11D (`v2.11.3`) sample dataset đã có:** Ban hành bộ dữ liệu mẫu CSV giả lập (`SAMPLE-001 -> 005`), nghiệm thu báo cáo thẩm định trên tài liệu và ban hành phán quyết `GO TO TECHNICAL IMPORT DRY RUN`.
* **Phase 11E audit / validation đã thực hiện:** Hoàn tất rà soát tĩnh năng lực mã nguồn (`IMPORT_CAPABILITY_AUDIT.md`) và thẩm định tĩnh file CSV (`SAMPLE_CSV_TECHNICAL_VALIDATION_REPORT.md`). Ghi nhận hệ thống chưa có API `POST /import` chuyên dụng ngoài script `seed.ts` và file CSV mẫu đạt chuẩn 100% cấu trúc (`PASS WITH WARNINGS`).
* **Chưa import thật:** Khẳng định tuyệt đối đến thời điểm ban hành phiếu quyết định này, chưa có bất kỳ bản ghi mới nào được nạp, chèn hay chạy script seed vào bảng `LegalKnowledge` trên cơ sở dữ liệu production.
* **Chưa active version:** Huy hiệu hiệu lực (`v2.0-2024-LAND-LAW`) và cờ active trên DB được giữ nguyên 100%, chưa thực hiện bất kỳ thao tác active hay rollback nào.

---

## 3. Go / No-Go Checklist

Bảng kiểm soát phán quyết kỹ thuật 10 tiêu chí tối cao trước khi quyết định chuyển bước thiết kế công cụ (`10-Point Technical Go / No-Go Decision Gate Table`):

| Check ID | Requirement (`Technical Decision Gate Item`) | Evidence (`Verified Proof / Audit Report`) | Decision (`GO/WARN/NO-GO`) | Notes & Governance Sign-off |
| :---: | :--- | :--- | :---: | :--- |
| **GNG-01** | **Sample CSV validated (`CSV Structure Verified`)** | `SAMPLE_CSV_TECHNICAL_VALIDATION_REPORT.md` đã nghiệm thu cấu trúc 29 cột tiêu đề header. | **`[ GO ]`** | Khớp chính xác 100% tên trường Phase 11C, định dạng `UTF-8 no BOM`. |
| **GNG-02** | **Mapping available (`Mapping Engine Ready`)** | `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md` đã quy định rõ 20 quy luật ánh xạ và 8 lỗi xử lý. | **`[ GO ]`** | Bộ chuyển đổi format ISO Date và Enum sẵn sàng tích hợp vào code. |
| **GNG-03** | **`approval_status` considered (`Approval Gate Safe`)** | Khẳng định cơ chế lọc: chỉ bản ghi đạt `Approved` mới được phép bước vào luồng nạp batch. | **`[ GO ]`** | Chốt chặn then chốt: ngăn chặn tuyệt đối dữ liệu `Draft / Pending Review`. |
| **GNG-04** | **`legal_status` considered (`Status Validity Safe`)** | Khẳng định cơ chế lọc: 100% bản ghi nạp phải có `status = Effective` (`ACTIVE`). | **`[ GO ]`** | Thanh lọc hoàn toàn dữ liệu hết hiệu lực khỏi luồng tra cứu của AI. |
| **GNG-05** | **`local_scope` considered (`Territorial Scope Safe`)** | Khẳng định rà soát rõ `local_scope` (`Local vs. National`) và địa bàn áp dụng (`local_applicability`). | **`[ GO ]`** | Ngăn chặn rủi ro áp dụng nhầm hạn mức tách thửa giữa các đơn vị hành chính. |
| **GNG-06** | **No-import confirmed (`Zero DB Write Audited`)** | Log kiểm toán hệ thống xác nhận 0 lệnh SQL write hay Prisma create/update được chạy. | **`[ GO ]`** | Bảo vệ tuyệt đối sự an toàn và nguyên vẹn của dữ liệu production. |
| **GNG-07** | **No DB write (`Read-Only Static Audit`)** | Tái xác nhận toàn bộ quá trình Phase 11E chỉ đọc tĩnh mã nguồn và file CSV mẫu tham khảo. | **`[ GO ]`** | 100% tuân thủ ranh giới rà soát kỹ thuật không can thiệp hệ thống. |
| **GNG-08** | **Active / rollback not performed (`Zero Activation`)** | Huy hiệu phiên bản `v2.0-2024-LAND-LAW` và cờ active được bảo toàn nguyên vẹn trên DB. | **`[ GO ]`** | Tuân thủ kỷ luật: không tự ý kích hoạt hay bãi bỏ phiên bản căn cứ luật. |
| **GNG-09** | **Audit / permission concerns identified (`RBAC Audited`)** | `IMPORT_CAPABILITY_AUDIT.md` đã chỉ rõ yêu cầu bảo vệ kép bởi `RolesGuard` (`ADMIN / MANAGER`). | **`[ GO ]`** | Phân quyền bất kiêm nhiệm: Kỹ thuật nạp batch (`ADMIN`) - Lãnh đạo duyệt live (`MANAGER`). |
| **GNG-10** | **Backup requirement documented (`Backup Mandate`)** | Ghi nhận bắt buộc điều kiện tiên quyết: sao lưu DB `pg_dump` trước bất kỳ lệnh import thật nào. | **`[ GO ]`** | Chốt chặn sống còn sẵn sàng phục hồi khi có sự cố bất khả kháng. |

---

## 4. Decision Options

Hội đồng Đánh giá Kỹ thuật Phân hệ Tri thức Pháp lý LegalFlow V2 cân nhắc **4 hướng quyết định phán quyết (`Standard Technical Go/No-Go Decision Options`)**:
1. **`GO TO IMPORT TOOL DESIGN` *(Chấp thuận chuyển sang Thiết kế Công cụ Nạp Kỹ thuật):*** Bộ quy chuẩn template 29 cột, quy chế ánh xạ mapping, validation checklist và kết quả rà soát tĩnh mã nguồn/CSV mẫu đều đạt yêu cầu kỹ thuật xuất sắc. Phát hiện rõ khoảng trống chưa có import engine chuẩn (`AUD-01`). Chấp thuận chuyển sang Phase 11F để chính thức tài liệu hóa thiết kế và đặc tả kỹ thuật an toàn của công cụ nạp (`Import Tool Design & Safety Spec`). *(Đây là lựa chọn đề xuất chính thức cho Phase 11E)*.
2. **`GO TO REAL DATASET REVIEW` *(Chấp thuận chuyển tiếp rà soát bộ dữ liệu thật):*** Bỏ qua bước thiết kế công cụ nạp, chuyển thẳng sang rà soát và thu thập bộ dữ liệu thực tế từ công báo địa phương để nạp thủ công. *(Không đề xuất vì tiềm ẩn rủi ro thiếu kiểm soát validation tự động)*.
3. **`GO WITH WARNINGS` *(Chấp thuận chuyển tiếp kèm Cảnh báo kỹ thuật):*** Chấp thuận chuyển tiếp sang thiết kế công cụ nhưng kèm theo các cảnh báo nghiêm khắc về việc phải xử lý triệt để các trường Phase 11C mở rộng thông qua JSON Metadata Adapter thay vì sửa schema DB.
4. **`NO-GO` *(Kiên quyết dừng, từ chối chuyển tiếp):*** Phát hiện mã nguồn có lỗi bảo mật lớn, cơ chế workflow hiện hữu bị bypass hoặc file CSV mẫu vi phạm nghiêm trọng cấu trúc 29 cột. Bắt buộc dừng toàn bộ lộ trình.

---

## 5. Recommended Decision

Dựa trên kết quả rà soát 10 tiêu chí kiểm soát kỹ thuật và Báo cáo thẩm định `PASS WITH WARNINGS` Phase 11E, Hội đồng Thẩm định Kỹ thuật chính thức ban hành Quyết định Đề xuất (`Official Recommended Technical Decision`):

&rarr; **`GO TO IMPORT TOOL DESIGN`**  
*(CHẤP THUẬN CHUYỂN TIẾP SANG GIAI ĐOẠN THIẾT KẾ CÔNG CỤ NẠP & ĐẶC TẢ AN TOÀN TRI THỨC PHÁP LÝ - PHASE 11F)*

### 3 Lý do Phán quyết (`Technical Justification`):
1. **Hiện đã có template, mapping và sample validation (`Full Foundation Readiness`):** Dự án đã sở hữu một nền tảng kỹ thuật và quy chuẩn cực kỳ chín muồi từ Phase 11C đến Phase 11E (Template 29 cột, Mapping Spec 20 trường, Checklist 14 điểm và File CSV mẫu đã thẩm định 100%).
2. **Cần thiết kế công cụ / quy trình import kỹ thuật có kiểm soát trước khi import thật (`Controlled Import Tool Necessity`):** Báo cáo Audit (`AUD-01`) chỉ rõ hệ thống hiện chưa có một engine nạp batch CSV chuyên dụng. Việc thiết kế một công cụ nạp bài bản (`Import Engine / Service`) với đầy đủ DTO validation, error handling và staging log trước khi viết code thật là bước đi kỹ thuật chuẩn xác và an toàn nhất.
3. **Không nên import thật thủ công nếu chưa có validation / rollback / audit rõ (`Risk Prevention Mandate`):** Kiên quyết từ chối mọi ý tưởng nạp dữ liệu thật bằng các script SQL thủ công hay gõ lệnh trực tiếp trên DB, vì cách làm này bypass hoàn toàn chốt chặn phê duyệt của Lãnh đạo Phòng và làm mất khả năng kiểm toán truy vết.

---

## 6. Required Conditions Before Any Real Import

Ma trận 9 điều kiện tiên quyết bắt buộc phải hoàn tất, kiểm chứng và ký xác nhận trước khi cho phép chạy lệnh import trên cơ sở dữ liệu Production chính thức (`9 Mandatory Conditions Before Production Real Import`):

| Condition Index | Mandatory Pre-Condition (`Prerequisite Technical & Governance Requirement`) | Assigned Owner (`RBAC`) | Required Evidence (`Mandatory Proof`) | Status (`Current State`) | Notes & Governance Check |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **COND-01** | **Dữ liệu thật đã approved (`Approved Real Dataset Verified`)** | `Legal Reviewer` / `MANAGER` | File CSV dữ liệu thật có 100% dòng `approval_status = Approved`, kèm chữ ký Sổ Đăng ký Nguồn Phase 11B. | `[ PENDING ]` *(Sẽ thu thập khi go-live)* | Kiên quyết loại bỏ mọi bản ghi `Draft / Pending Review`. |
| **COND-02** | **Backup trước import (`Pre-import DB Backup Verified`)** | `Database Admin` | File dump cơ sở dữ liệu `pg_dump` trước thời điểm import được tạo thành công, kiểm tra tính toàn vẹn và lưu ngoài Git. | `[ MANDATORY ]` *(Bắt buộc trước khi gõ lệnh import)* | Chốt chặn sống còn: không bao giờ chạy script nạp nếu chưa có bản sao lưu DB gần nhất. |
| **COND-03** | **Import tool / script đã review (`Audited Import Engine`)** | `DevOps Lead` / `Architect` | Mã nguồn `import-service` được code review, tích hợp bộ kiểm tra 14 tiêu chí Phase 11C và DTO validation. | `[ PENDING ]` *(Sẽ thiết kế tại Phase 11F)* | Ngăn chặn script tự động gán cờ `active = true` hoặc ghi đè sai schema. |
| **COND-04** | **Dry-run kỹ thuật không ghi DB đã pass (`Read-Only Dry Run Passed`)** | `Database Admin` / `QA Lead` | Báo cáo hoàn tất nạp thử nghiệm read-only trên môi trường Staging / Test DB với kết quả `0 errors`. | `[ PENDING ]` *(Sẽ kiểm thử khi có tool)* | Đảm bảo 0 lỗi parse định dạng, 0 lỗi trùng khóa, 0 lỗi mất metadata. |
| **COND-05** | **DB import có transaction / rollback strategy (`Transactional Safety`)** | `Backend Lead` / `DBA` | Trình nạp CSV sử dụng Prisma Transaction (`$transaction`). Nếu 1 dòng trong batch lỗi, toàn bộ batch tự động `ROLLBACK`. | `[ MANDATORY ]` *(Bắt buộc đặc tả ở Phase 11F)* | Bảo đảm DB không bị trạng thái nửa vời (`Half-baked / Partial Ingestion State`). |
| **COND-06** | **Duplicate handling rõ (`Duplicate Conflict Strategy`)** | `Data Engineer` | Cơ chế xử lý khi trùng `docNumber` (`SKIP`, `UPSERT` hay `REJECT_BATCH`) được tài liệu hóa rõ ràng và thẩm định phê duyệt. | `[ MANDATORY ]` *(Bắt buộc đặc tả ở Phase 11F)* | Bảo vệ tính duy nhất của chỉ mục (`Unique Index`) trên bảng `LegalKnowledge`. |
| **COND-07** | **Active version là bước riêng (`Decoupled Activation Step`)** | `Project Manager` / `MANAGER` | Quy định kỹ thuật khóa cờ `active_candidate = false` khi nạp CSV. Kích hoạt live phải đi qua endpoint `POST activate-draft-version`. | `[ VERIFIED ]` *(Đã quy định tại AUD-04)* | Tách biệt quyền nạp dữ liệu kỹ thuật (`ADMIN`) và quyền kích hoạt hiệu lực pháp lý (`MANAGER`). |
| **COND-08** | **Audit trail có (`Full Auditability Confirmed`)** | `System Admin` | Mọi thao tác nạp batch CSV đều phải sinh ra các bản ghi nhật ký trong bảng `UpdateLog` với đầy đủ thông tin người thực hiện. | `[ VERIFIED ]` *(Kế thừa log hiện hữu)* | Đảm bảo tính minh bạch và khả năng truy vết trách nhiệm 100%. |
| **COND-09** | **Quyền `ADMIN / MANAGER` kiểm soát (`Strict RBAC Enforcement`)** | `Security Lead` | Endpoints nạp CSV và kích hoạt batch được bảo vệ tuyệt đối bởi `@Roles(Role.ADMIN)` và `@Roles(Role.MANAGER)`. | `[ VERIFIED ]` *(Đã xác nhận tại AUD-05)* | Ngăn chặn nhân viên không đủ thẩm quyền truy cập công cụ import. |

---

## 7. Next Recommended Phase

Dựa trên việc nghiệm thu thành công Báo cáo Audit Khả năng Nạp và ban hành phán quyết `GO TO IMPORT TOOL DESIGN`, Hội đồng Thẩm định Kỹ thuật chính thức đề xuất bước chuyển giao lộ trình tiếp theo là:

&rarr; **`Phase 11F: Legal Knowledge Import Tool Design & Safety Specification`**  
*(Thực hiện thiết kế kiến trúc, xây dựng đặc tả kỹ thuật an toàn, DTO validation chuẩn 29 trường và kịch bản xử lý transaction/rollback cho Công cụ Nạp Tri thức Pháp lý tự động trước khi bước vào triển khai mã nguồn thực tế)*.

---

### Khẳng định Phê duyệt của Ban Quản trị Dự án Phase 11E:
Tôi xác nhận Quyết định Chuyển tiếp Thiết kế Công cụ Nạp Kỹ thuật (Phase 11E Technical Decision) đã tuân thủ tuyệt đối 21 ràng buộc an toàn, không can thiệp mã nguồn hay DB, bảo đảm trọn vẹn sự trung thực và minh bạch cho lộ trình phát triển LegalFlow V2.

---
*Phiếu Quyết định Chuyển tiếp Thiết kế Công cụ Nạp Kỹ thuật (Technical Import Go/No-Go Decision) được lập tự động từ kết quả rà soát Phase 11E.*
