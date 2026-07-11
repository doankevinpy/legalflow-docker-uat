# LEGALFLOW V2 - PHASE 11D
# IMPORT GO / NO-GO DECISION

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11D Standard`  
**Ngày ban hành Quyết định:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPORT GO / NO-GO DECISION SIGN-OFF`** *(Phiếu Quyết định Chuyển tiếp Nạp & Diễn tập Kỹ thuật Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Phiếu Quyết định Chuyển tiếp Diễn tập và Nạp Dữ liệu Tri thức Pháp lý (`Import Go / No-Go Decision` - Phase 11D) của hệ thống LegalFlow V2. Tài liệu tổng hợp kết quả thẩm định bộ dữ liệu mẫu (`Sample Dataset Review`), xác lập bảng kiểm soát phán quyết 8 tiêu chí (`Go / No-Go Checklist`), phân tích các lựa chọn quyết định (`Decision Options`), chính thức công bố quyết định đề xuất của Hội đồng Đánh giá (`Recommended Decision`) và quy định bắt buộc 6 điều kiện tiên quyết (`Required Conditions Before Any Real Import`) trước khi cho phép tiến hành diễn tập nạp kỹ thuật bằng lệnh trên môi trường staging (`Phase 11E`).

---

## 2. Decision Context

Quyết định này được ban hành trên nền tảng chuỗi thành quả quản trị tri thức pháp lý liên hoàn và nghiêm ngặt của hệ thống LegalFlow V2:
* **Phase 11B (`v2.11.1`) đã tạo governance:** Ban hành Sổ Đăng ký Nguồn Địa phương và Quy trình thẩm định, phê duyệt văn bản 4 bước (`Review & Approval SOP`), thiết lập chốt chặn Lãnh đạo Phòng (`MANAGER`).
* **Phase 11C (`v2.11.2`) đã tạo template / mapping:** Ban hành Biểu mẫu thuộc tính 29 trường (`Metadata Template`), Quy chuẩn ánh xạ chi tiết (`Mapping Spec`) và Checklist kiểm tra trước import 14 điểm.
* **Phase 11D đã review sample dataset:** Hoàn tất rà soát diễn tập trên tài liệu cho bộ dữ liệu giả lập (`SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`), kết luận `PASS WITH WARNINGS` (100% đạt chuẩn kỹ thuật cấu trúc, cảnh báo dữ liệu mẫu giả lập).
* **Chưa import thật:** Khẳng định tuyệt đối đến thời điểm ban hành phiếu quyết định này, chưa có bất kỳ bản ghi mới nào được nạp, chèn hay chạy script seed vào bảng `LegalKnowledge` trên cơ sở dữ liệu production.
* **Chưa active version:** Huy hiệu hiệu lực (`v2.0-2024-LAND-LAW`) và cờ active trên DB được giữ nguyên 100%, chưa thực hiện bất kỳ thao tác active hay rollback nào.

---

## 3. Go / No-Go Checklist

Bảng kiểm soát phán quyết 8 tiêu chí tối cao trước khi quyết định chuyển bước diễn tập kỹ thuật (`8-Point Go / No-Go Decision Gate Table`):

| Check ID | Requirement (`Decision Gate Item`) | Evidence (`Verified Proof / Document`) | Decision (`GO/WARN/NO-GO`) | Notes & Governance Sign-off |
| :---: | :--- | :--- | :---: | :--- |
| **GNG-01** | **Template đầy đủ (`Template Standardized`)** | `LEGAL_DOCUMENT_METADATA_TEMPLATE.md` đã ban hành chuẩn hóa 29 trường thuộc tính. | **`[ GO ]`** | Đã nghiệm thu trọn vẹn tại Phase 11C. |
| **GNG-02** | **Mapping rõ (`Mapping Spec Verified`)** | `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md` đã quy định rõ 20 quy luật ánh xạ và 8 lỗi ngoại lệ. | **`[ GO ]`** | Bộ chuyển đổi dữ liệu (`Mapping Engine`) đã sẵn sàng 100%. |
| **GNG-03** | **Sample dataset đúng header (`Header Compliant`)** | `SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` tuân thủ chính xác 29 cột tiêu đề header chuẩn. | **`[ GO ]`** | Không lệch cột, định dạng `UTF-8 no BOM` chuẩn xác. |
| **GNG-04** | **Required fields đủ (`Mandatory Complete`)** | 5/5 bản ghi mẫu đạt 100% đầy đủ tại 17 cột bắt buộc (`title, docNumber, effectiveDate...`). | **`[ GO ]`** | Không phát hiện dòng bị khuyết trường định danh pháp lý. |
| **GNG-05** | **Validation checklist có (`Validation Completed`)** | `IMPORT_DRY_RUN_VALIDATION_REPORT.md` đã hoàn tất nghiệm thu 13 tiêu chí rà soát Phase 11D. | **`[ GO ]`** | Bằng chứng kiểm toán rà soát dữ liệu mẫu rõ ràng, minh bạch. |
| **GNG-06** | **No-import confirmed (`Zero DB Ingestion`)** | Tái xác nhận không có bất kỳ lệnh insert/import nào được chạy vào DB production. | **`[ GO ]`** | Bảo vệ tuyệt đối sự an toàn và sạch sẽ của dữ liệu hiện hữu. |
| **GNG-07** | **Active / rollback not performed (`Zero Activation`)** | Huy hiệu phiên bản `v2.0-2024-LAND-LAW` và trạng thái active được giữ nguyên 100% trên DB. | **`[ GO ]`** | Tuân thủ kỷ luật: không tự ý kích hoạt hay bãi bỏ căn cứ luật. |
| **GNG-08** | **Safety warning retained (`Simulated Data Warning`)** | Ghi nhận rõ ràng cảnh báo: bộ file CSV hiện tại là dữ liệu giả lập (`SAMPLE-001 -> 005`). | **`[ WARNING ]`** | Cảnh báo vàng: không dùng file giả lập này nạp vào production. |

---

## 4. Decision Options

Hội đồng Đánh giá Phân hệ Tri thức Pháp lý LegalFlow V2 cân nhắc **3 hướng quyết định phán quyết (`Standard Go/No-Go Decision Options`)**:
1. **`GO TO TECHNICAL IMPORT DRY RUN` *(Chấp thuận chuyển sang Diễn tập Nạp Kỹ thuật):*** Bộ công cụ template 29 trường, quy chuẩn ánh xạ mapping, checklist rà soát và kết quả kiểm thử dữ liệu mẫu đều đạt chuẩn kỹ thuật xuất sắc. Chấp thuận cho phép chuyển sang Phase 11E để chạy thử nghiệm các script import/validation kỹ thuật trên môi trường kiểm thử (Staging / Dev DB) mà không tác động đến Production.
2. **`GO WITH DATA CLEANUP` *(Chấp thuận chuyển tiếp kèm Yêu cầu làm sạch dữ liệu):*** Cấu trúc công cụ đạt yêu cầu nhưng phát hiện một số dòng dữ liệu mẫu hoặc file CSV có lỗi định dạng ngày tháng hay thiếu trường phụ. Yêu cầu sửa đổi file CSV và kiểm tra lại trước khi chạy script.
3. **`NO-GO` *(Kiên quyết dừng, từ chối chuyển tiếp):*** Hệ thống chưa đạt độ chín về quy chuẩn ánh xạ, file template không nhất quán, hoặc phát hiện rủi ro nạp nhầm dữ liệu chưa duyệt/văn bản hết hiệu lực vào DB. Bắt buộc dừng toàn bộ lộ trình import.

---

## 5. Recommended Decision

Dựa trên kết quả rà soát 8 tiêu chí kiểm soát và Báo cáo thẩm định `PASS WITH WARNINGS` Phase 11D, Hội đồng Thẩm định Dự án chính thức ban hành Quyết định Đề xuất (`Official Recommended Decision`):

&rarr; **`GO TO TECHNICAL IMPORT DRY RUN`**  
*(CHẤP THUẬN CHUYỂN TIẾP SANG GIAI ĐOẠN DIỄN TẬP NẠP KỸ THUẬT TRI THỨC PHÁP LÝ - PHASE 11E)*

### 4 Điều kiện Ràng buộc Vận hành (`4 Mandatory Operational Conditions`):
1. 🔒 **Chỉ dùng sample hoặc dữ liệu đã duyệt (`Approved Data Only`):** Tại Phase 11E, khi chạy diễn tập kỹ thuật, chỉ được phép sử dụng file mẫu giả lập (`SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`) hoặc các file dữ liệu thật đã qua phê duyệt chính thức (`Approved` bởi Lãnh đạo Phòng Phase 11B).
2. 🔒 **Backup trước mọi import (`Mandatory Backup Pre-condition`):** Trước khi thực thi bất kỳ lệnh hoặc script import nào tại Phase 11E, Quản trị viên bắt buộc phải thực hiện sao lưu toàn diện cơ sở dữ liệu (`Database Backup - pg_dump`) để sẵn sàng phục hồi khi có sự cố.
3. 🔒 **Import phải có phase riêng (`Isolated Import Phase Mandate`):** Công tác diễn tập nạp kỹ thuật phải được lập thành một giai đoạn độc lập (`Phase 11E`), tách biệt hoàn toàn với việc kích hoạt hiệu lực hay vận hành thực tế.
4. 🔒 **Không active tự động (`Zero Auto-Activation Mandate`):** Khi chạy script nạp kỹ thuật tại Phase 11E, 100% bản ghi nạp vào phải có cờ `active_candidate = false` (chỉ nằm ở vùng chờ Staging). Việc kích hoạt live trên production phải thuộc một quyết định phê duyệt riêng biệt của Lãnh đạo Cơ quan.

---

## 6. Required Conditions Before Any Real Import

Ma trận 6 điều kiện tiên quyết bắt buộc phải hoàn tất và nghiệm thu trước khi cho phép chạy lệnh import trên cơ sở dữ liệu Production chính thức (`6 Mandatory Conditions Before Production Import`):

| Condition Index | Mandatory Pre-Condition (`Prerequisite Requirement`) | Assigned Owner (`RBAC`) | Required Evidence (`Mandatory Proof`) | Status (`Current State`) | Notes & Governance Check |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **COND-01** | **Dữ liệu thật đã được review / approved (`Approved Real Data`)** | `Legal Reviewer` / `MANAGER` | File CSV dữ liệu thật có 100% dòng `approval_status = Approved`, kèm chữ ký Sổ Đăng ký Nguồn Phase 11B. | `[ PENDING ]` *(Sẽ chuẩn bị khi có văn bản thực tế)* | Kiên quyết từ chối nạp bất kỳ bản ghi nháp (`Draft`) hay chờ rà soát (`Pending Review`). |
| **COND-02** | **Backup có (`Verified DB Backup`)** | `Database Admin` | File dump cơ sở dữ liệu `pg_dump` trước thời điểm import được tạo thành công, kiểm tra tính toàn vẹn và lưu an toàn ngoài Git. | `[ MANDATORY ]` *(Bắt buộc trước khi gõ lệnh import)* | Chốt chặn sống còn: không bao giờ chạy script nạp nếu chưa có bản sao lưu DB gần nhất. |
| **COND-03** | **Import script / command được kiểm soát (`Audited Import Engine`)** | `DevOps Engineer` / `ADMIN` | Mã nguồn script import (`import-service` / `seed.ts`) được thẩm định code review, bảo đảm xử lý đúng mapping Phase 11C. | `[ IN PROGRESS ]` *(Sẽ diễn tập kỹ thuật tại Phase 11E)* | Ngăn chặn script tự động gán cờ `active = true` hoặc xóa nhầm dữ liệu cũ. |
| **COND-04** | **Dry-run kỹ thuật pass (`Technical Dry Run Passed`)** | `Database Admin` / `QA Lead` | Báo cáo hoàn tất Phase 11E (`Technical Dry Run Report`) xác nhận nạp thử thành công trên môi trường Staging/Test DB. | `[ PENDING ]` *(Mục tiêu cốt lõi của Phase 11E)* | Đảm bảo 0 lỗi parse định dạng, 0 lỗi trùng khóa, 0 lỗi mất metadata khi nạp batch lớn. |
| **COND-05** | **Rollback plan có (`Verified Rollback Plan`)** | `System Admin` | Kế hoạch và kịch bản phục hồi cơ sở dữ liệu nhanh (`SOP Rollback Command`) được tài liệu hóa và sẵn sàng kích hoạt trong 5 phút. | `[ MANDATORY ]` *(Bắt buộc lập song song ở Phase 11E)* | Bảo đảm hệ thống có thể quay về trạng thái an toàn cũ ngay lập tức nếu dữ liệu mới có sự cố. |
| **COND-06** | **Active version cần phê duyệt riêng (`Independent Activation Approval`)** | `Project Manager` / `Lãnh đạo Phòng` | Phiếu Phê duyệt Kích hoạt Phiên bản Tri thức (`Version Activation Sign-off`) được Lãnh đạo Cơ quan ký duyệt bằng văn bản. | `[ MANDATORY ]` *(Bắt buộc cho giai đoạn Go-Live)* | Tách biệt quyền nạp dữ liệu kỹ thuật (`ADMIN`) và quyền kích hoạt hiệu lực pháp lý (`MANAGER`). |

---

## 7. Next Recommended Phase

Dựa trên việc nghiệm thu thành công bộ dữ liệu mẫu và ban hành phán quyết `GO TO TECHNICAL IMPORT DRY RUN`, Hội đồng Thẩm định Dự án chính thức đề xuất bước chuyển giao lộ trình tiếp theo là:

&rarr; **`Phase 11E: Legal Knowledge Technical Import Dry Run`**  
*(Thực hiện diễn tập nạp kỹ thuật bộ dữ liệu mẫu Legal Knowledge - Technical Dry Run trên môi trường kiểm thử / staging thông qua công cụ script/CLI để kiểm chứng khả năng xử lý ánh xạ của hệ thống trước khi vận hành thực tế)*.

---

### Khẳng định Phê duyệt của Ban Quản trị Dự án Phase 11D:
Tôi xác nhận Quyết định Chuyển tiếp Nạp & Diễn tập Kỹ thuật Tri thức Pháp lý (Phase 11D Decision) đã tuân thủ tuyệt đối 19 ràng buộc an toàn, không can thiệp mã nguồn hay DB, bảo đảm trọn vẹn sự trung thực và minh bạch cho lộ trình phát triển LegalFlow V2.

---
*Phiếu Quyết định Chuyển tiếp Nạp & Diễn tập Kỹ thuật Tri thức Pháp lý (Import Go/No-Go Decision) được lập tự động từ kết quả rà soát Phase 11D.*
