# LEGALFLOW V2 - PHASE 11D
# IMPORT DRY RUN & SAMPLE DATASET REVIEW PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.11.2-legal-knowledge-import-template-mapping` -> `Phase 11D Standard`  
**Ngày ban hành Kế hoạch:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPORT DRY RUN & SAMPLE DATASET REVIEW PLAN`** *(Kế hoạch Diễn tập & Rà soát Bộ Dữ liệu Mẫu Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Diễn tập Kiểm tra và Rà soát Bộ Dữ liệu Mẫu Tri thức Pháp lý (`Import Dry Run & Sample Dataset Review Plan` - Phase 11D) của hệ thống LegalFlow V2. Kế hoạch được ban hành nhằm thiết lập quy chế rà soát trên giấy và trên file (`Document & CSV Level Review`) cho một tập dữ liệu giả lập (`Sample Dataset`) trước khi bước vào giai đoạn nạp kỹ thuật thực tế (`Phase 11E`). Tài liệu xác lập phạm vi diễn tập (`Dry Run Scope`), quy trình 10 bước rà soát (`Dry Run Workflow`), các lựa chọn phán quyết (`Dry Run Decision Options`) và khẳng định cam kết an toàn tuyệt đối: **chỉ kiểm tra mô phỏng trên tài liệu, không nạp dữ liệu thật vào cơ sở dữ liệu production và không cho phép AI tự động kích hoạt hay tự khẳng định dữ liệu là đầy đủ tuyệt đối**.

---

## 2. Background

Trong các giai đoạn trước, LegalFlow V2 đã hoàn thiện khung quản trị vững chắc cho phân hệ tri thức Khối 3.2:
* **Phase 11B (`v2.11.1`) đã chuẩn hóa quy trình thu thập, rà soát, phê duyệt nguồn pháp lý:** Ban hành Sổ Đăng ký Nguồn Địa phương (`Local Regulation Source Register`) và SOP thẩm định của Cán bộ Pháp chế (`Legal Reviewer`).
* **Phase 11C (`v2.11.2`) đã chuẩn hóa template và mapping:** Ban hành Mẫu metadata 29 trường (`Metadata Template`), Quy chuẩn ánh xạ (`Field Mapping Spec`) và Checklist kiểm chứng (`Validation Checklist`).
* **Phase 11D chỉ kiểm tra dữ liệu mẫu / dry-run ở mức tài liệu:** Để bảo đảm bộ ánh xạ hoạt động không lỗi trước khi chạy trên cơ sở dữ liệu thực, dự án xây dựng một bộ dữ liệu mô phỏng gồm 5 bản ghi giả lập (`SAMPLE-001 -> SAMPLE-005`) đại diện cho 5 loại văn bản lõi (Luật trung ương, Quyết định địa phương, Quy hoạch SDĐ, Quy trình nội bộ và Biểu mẫu hướng dẫn) để diễn tập đánh giá chất lượng rà soát.
* **Không import thật vào database:** Không chạy bất kỳ script nạp hay lệnh SQL insert nào vào bảng `LegalKnowledge` trên DB production `legalflow_prod`.
* **Không active version:** Huy hiệu hiệu lực (`v2.0-2024-LAND-LAW`) và cờ active trên DB được giữ nguyên 100%, không tự active và không tự rollback.
* **Không khẳng định dữ liệu pháp lý là đầy đủ tuyệt đối:** Hệ thống quán triệt nguyên tắc tối thượng: AI chỉ hỗ trợ tra cứu và tham mưu sơ bộ; mọi thẩm quyền kết luận tính hợp pháp và đầy đủ của căn cứ thụ lý thuộc về Chuyên viên P2 và Lãnh đạo Phòng.

---

## 3. Dry Run Scope

Bảng phân định 9 hạng mục kiểm tra chuyên sâu trong phạm vi diễn tập rà soát dữ liệu mẫu Phase 11D (`Dry Run Scope & Verification Matrix`):

| Scope Item | Description | Expected Output | Owner (`RBAC`) | Notes & Governance Check |
| :--- | :--- | :--- | :---: | :--- |
| **1. Kiểm tra sample dataset** | Rà soát cấu trúc file `SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`, bảo đảm header đúng 29 cột chuẩn Phase 11C và không chứa dữ liệu nhạy cảm hay văn bản thật chưa được duyệt. | File CSV đạt chuẩn định dạng `UTF-8 no BOM`, 5 bản ghi `SAMPLE-001 -> 005`. | `Legal Reviewer` / `ADMIN` | 100% dữ liệu phải có tiền tố `SAMPLE-`. Không dùng dữ liệu thật bí mật. |
| **2. Kiểm tra field bắt buộc** | Kiểm tra sự hiện diện của 17 trường bắt buộc (`Required Fields`: title, docNumber, issuingAuthority, effectiveDate, status, reviewer, approvalStatus...). | 5/5 bản ghi không bị khuyết trường bắt buộc (`Missing Mandatory = 0`). | `Legal Reviewer` / `Data Clerk` | Khẳng định tính toàn vẹn thông tin định danh và hiệu lực văn bản. |
| **3. Kiểm tra mapping** | Đối chiếu kiểu dữ liệu và định dạng theo `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md` (ngày chuẩn ISO `YYYY-MM-DD`, enum chuẩn `Decision, Plan, SOP`). | Báo cáo ánh xạ 100% đúng chuẩn format (`Type Validation Pass`). | `Database Admin` / `Operator` | Ngăn chặn lỗi parse định dạng khi nạp batch kỹ thuật ở Phase 11E. |
| **4. Kiểm tra legal status** | Kiểm tra tình trạng hiệu lực pháp lý (`legal_status`), khẳng định các bản ghi đưa vào luồng import mẫu đều đạt `Effective` (`ACTIVE`). | 100% bản ghi mẫu có `legal_status = Effective`. Lọc bỏ `Expired / Unknown`. | `Legal Reviewer` | Thẩm định chặt chẽ ranh giới hiệu lực thi hành. |
| **5. Kiểm tra approval status** | Kiểm tra chữ ký và trạng thái phê duyệt (`approval_status`), bảo đảm 100% bản ghi được rà soát đều ghi nhận `Approved` và có ngày duyệt hợp lệ. | 5/5 bản ghi có `approval_status = Approved` bởi `Sample Manager`. | `MANAGER Approver` | Chốt chặn then chốt: cấm nạp dữ liệu `Draft` hay `Pending Review`. |
| **6. Kiểm tra local scope** | Rà soát trường `local_scope` (`National` vs. `Local`) và địa bàn `local_applicability` (Toàn tỉnh vs. cấp huyện/xã), không để mơ hồ. | Ánh xạ chuẩn xác quy định tỉnh/huyện đúng phạm vi hành chính. | `Land Specialist` / `Reviewer` | Ngăn chặn áp dụng nhầm hạn mức giao đất giữa các đơn vị hành chính. |
| **7. Kiểm tra planning / land use relevance** | Rà soát chỉ dẫn đối chiếu bản đồ quy hoạch sử dụng đất (`planning_land_use_relevance`) đối với các bản ghi thủ tục Đất đai (`LAW-02`). | Ghi nhận đầy đủ chỉ dẫn rà soát quy hoạch cấp huyện trên E-Office. | `Land Specialist` | Bảo đảm chốt chặn rà soát thủ công Khối `LAW-02` được duy trì. |
| **8. Kiểm tra risk note** | Kiểm tra trường cảnh báo ngoại lệ (`risk_note`), đảm bảo các điều khoản chuyển tiếp và rủi ro được trích xuất đầy đủ cho AI/UI Khối 3.1 &amp; Khối 3.2. | 100% bản ghi mẫu có `risk_note` nhắc nhở chuyên viên rà soát lại. | `Legal Reviewer` | Nhắc nhở cán bộ không ỷ lại tuyệt đối vào kết quả gợi ý của phần mềm. |
| **9. Quyết định Go/No-Go cho phase import thật** | Tổng hợp kết quả rà soát 8 hạng mục trên vào Báo cáo thẩm định để Hội đồng Đánh giá ra quyết định chuyển tiếp sang Phase 11E. | Phiếu Quyết định `IMPORT_GO_NO_GO_DECISION.md` được ký duyệt chính thức. | `Project Manager` / `MANAGER` | Quyết định cao nhất của con người trước khi diễn tập nạp kỹ thuật. |

---

## 4. Out of Scope

Nhằm bảo vệ sự an toàn tuyệt đối của hệ thống production và tuân thủ kỷ luật Phase 11D, 6 hành vi sau đây **TẠI THỜI ĐIỂM NÀY NẰM HOÀN TOÀN NGOÀI PHẠM VI (`Out of Scope Strict Mandates`)**:
1. 🛑 **Không sửa code (`Zero Code Modification`):** Không chỉnh sửa, thêm mới hay viết lại bất kỳ dòng code nào trong `legalflow-backend` hoặc `legalflow-frontend`.
2. 🛑 **Không sửa database (`Zero DB Modification / Alteration`):** Không can thiệp cấu trúc schema, không tạo migration, không chạy `migrate reset` và không `pg_restore`.
3. 🛑 **Không chạy import script (`Zero Script Execution`):** Không thực thi các lệnh `npm run import`, `python seed.py` hay bất kỳ script nạp dữ liệu nào tác động đến DB.
4. 🛑 **Không seed dữ liệu (`Zero DB Seeding`):** Không chèn hay tạo bản ghi trong bảng `LegalKnowledge` trên cơ sở dữ liệu `legalflow_prod`.
5. 🛑 **Không active / rollback (`Zero Version Activation / Rollback`):** Không thực hiện bất kỳ thao tác thay đổi huy hiệu hiệu lực, chuyển đổi cờ `active = true` hay bãi bỏ luật cũ.
6. 🛑 **Không dùng dữ liệu chưa duyệt cho AI review chính thức (`Zero Unverified AI Usage`):** Trợ lý AI Khối 3.1 không được phép truy cập hay sử dụng các bản ghi mẫu hoặc văn bản chưa qua rà soát chính thức.

---

## 5. Dry Run Workflow

Quy trình 10 bước rà soát, thẩm định mô phỏng và chốt quyết định cho bộ dữ liệu mẫu (`10-Step Sample Dataset Dry Run Workflow`):
1. **Bước 1: Chuẩn bị sample dataset giả lập (`Sample Dataset Preparation`):** Thiết lập file `SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` với cấu trúc header 29 cột chuẩn Phase 11C và 5 dòng dữ liệu mẫu (`SAMPLE-001 -> 005`).
2. **Bước 2: Kiểm tra đủ field theo template Phase 11C (`Header & Schema Audit`):** Đối chiếu danh sách 29 cột trong file CSV với biểu mẫu `LEGAL_DOCUMENT_METADATA_TEMPLATE.md` để đảm bảo không sai lệch tên trường.
3. **Bước 3: Kiểm tra field bắt buộc (`Mandatory Field Check`):** Rà soát từng dòng bản ghi, khẳng định 100% không để trống 17 trường bắt buộc (`title, docNumber, effectiveDate, status...`).
4. **Bước 4: Kiểm tra status (`Legal Validity Check`):** Đánh giá cột `legal_status`, xác nhận 5/5 bản ghi mẫu đạt trạng thái `Effective` (Đang có hiệu lực thi hành).
5. **Bước 5: Kiểm tra approval (`Approval Lineage Check`):** Rà soát cột `approval_status` và `reviewer`, khẳng định các bản ghi đều ghi nhận `Approved` và có người rà soát chịu trách nhiệm.
6. **Bước 6: Kiểm tra local scope (`Territorial Scope Check`):** Kiểm tra cẩn trọng cột `local_scope` và `local_applicability` cho các bản ghi địa phương (`SAMPLE-002, SAMPLE-003, SAMPLE-004`).
7. **Bước 7: Kiểm tra duplicate (`Duplicate Code Audit`):** Chạy rà soát số hiệu `document_number` (`SAMPLE-101 -> 105`), khẳng định không có mã nào bị lặp lại trong nội bộ file mẫu.
8. **Bước 8: Kiểm tra risk note (`Risk Note Verification`):** Xác minh sự hiện diện của nội dung nhắc nhở cảnh báo trong cột `risk_note` trên toàn bộ 5 dòng bản ghi.
9. **Bước 9: Lập validation report (`Validation Report Compilation`):** Tổng hợp kết quả kiểm tra 8 bước trên vào Báo cáo kiểm chứng rà soát (`IMPORT_DRY_RUN_VALIDATION_REPORT.md`).
10. **Bước 10: Kết luận Go/No-Go cho import thật ở phase sau (`Go/No-Go Decision Gate`):** Lãnh đạo Đơn vị dựa trên báo cáo rà soát để ban hành Quyết định chuyển tiếp (`IMPORT_GO_NO_GO_DECISION.md`) sang Phase 11E (`Technical Import Dry Run`).

---

## 6. Dry Run Decision Options

Sau khi hoàn tất rà soát bộ dữ liệu mẫu trên Sổ kiểm tra (`Review Register`) và Báo cáo thẩm định (`Validation Report`), Hội đồng Đánh giá đưa ra **1 trong 4 lựa chọn phán quyết (`Standard Dry Run Decision Options`)**:
1. **`GO TO IMPORT PREPARATION` *(Đủ điều kiện chuyển sang chuẩn bị nạp kỹ thuật):*** Toàn bộ cấu trúc CSV và 100% bản ghi mẫu đạt chuẩn 29 trường Phase 11C, không phát hiện lỗi định dạng hay thiếu trường bắt buộc. Sẵn sàng cho Phase 11E (Diễn tập nạp kỹ thuật trên DB môi trường kiểm thử/staging).
2. **`GO WITH WARNINGS` *(Đủ điều kiện chuyển tiếp kèm Cảnh báo nghiệp vụ):*** Cấu trúc CSV đạt chuẩn kỹ thuật hoàn hảo, tuy nhiên dữ liệu hiện tại đang là bộ dữ liệu mẫu giả lập (`SAMPLE-001 -> 005`). Cho phép chuyển sang Phase 11E để kiểm thử script kỹ thuật, nhưng **cảnh báo bắt buộc thay thế bằng dữ liệu thật đã duyệt trước khi vận hành production**. *(Đây là lựa chọn đề xuất chính thức cho Phase 11D)*.
3. **`NEEDS DATA CLEANUP` *(Yêu cầu làm sạch và rà soát lại dữ liệu):*** Phát hiện có bản ghi mẫu bị thiếu trường bắt buộc (`effective_date`), lỗi định dạng ngày tháng hoặc có số hiệu trùng lặp. Yêu cầu tổ dữ liệu chỉnh sửa file CSV và chạy lại dry-run rà soát.
4. **`NO-GO` *(Kiên quyết dừng, từ chối chuyển tiếp):*** Phát hiện lỗi cấu trúc nghiêm trọng, file CSV không tuân thủ template 29 cột Phase 11C, hoặc có dấu hiệu đưa văn bản thật chưa được kiểm duyệt/văn bản hết hiệu lực vào luồng import mẫu gây rủi ro an toàn pháp lý.

---

## 7. Safety Confirmation

Tôi xác nhận và tuyên bố tuân thủ tuyệt đối **5 Cam kết An toàn Bất khả xâm phạm Phase 11D (`5 Inviolable Phase 11D Safety Confirmations`)**:
1. ✅ **KHÔNG IMPORT THẬT (`Zero Real DB Ingestion`):** Toàn bộ hoạt động Phase 11D là rà soát tài liệu và kiểm tra file CSV mẫu. Không nạp, không chèn và không chạy script seed dữ liệu vào bảng `LegalKnowledge` trên DB production `legalflow_prod`.
2. ✅ **KHÔNG ACTIVE VERSION (`Zero Version Activation`):** Huy hiệu hiệu lực (`v2.0-2024-LAND-LAW`) và trạng thái active được bảo toàn nguyên vẹn, không có bất kỳ thao tác active hay rollback tự động nào.
3. ✅ **KHÔNG SỬA DATABASE (`Zero DB Alteration / Reset`):** Cơ sở dữ liệu production được giữ nguyên 100%, không sửa đổi schema, không tạo migration, không reset và không restore.
4. ✅ **KHÔNG KHẲNG ĐỊNH DỮ LIỆU PHÁP LÝ LÀ ĐẦY ĐỦ (`No Absolute Completeness Claim`):** Quán triệt nghiêm ngặt trên mọi Sổ rà soát và Báo cáo nguyên tắc: hệ thống không tự kết luận văn bản pháp luật là mới nhất hay bao phủ 100%.
5. ✅ **CÁN BỘ VẪN PHẢI KIỂM TRA CĂN CỨ PHÁP LÝ HIỆN HÀNH (`Human-in-the-Loop Supremacy`):** Khẳng định thông điệp pháp lý tối thượng: AI chỉ là công cụ gợi ý tham mưu sơ bộ. Chuyên viên thụ lý P2, Chuyên viên Một cửa và Lãnh đạo Phòng chịu trách nhiệm cao nhất và duy nhất trong việc đối chiếu hiệu lực thực tế của văn bản và bản đồ quy hoạch trước khi ra quyết định TTHC.

---
*Kế hoạch Diễn tập & Rà soát Bộ Dữ liệu Mẫu (Phase 11D Plan) được lập tự động từ Kế hoạch Chuẩn bị Nạp Phase 11C.*
