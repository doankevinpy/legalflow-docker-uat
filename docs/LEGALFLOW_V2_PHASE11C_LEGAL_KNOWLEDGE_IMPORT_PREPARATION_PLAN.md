# LEGALFLOW V2 - PHASE 11C
# LEGAL KNOWLEDGE IMPORT PREPARATION PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.11.1-legal-knowledge-data-enrichment-local-governance` -> `Phase 11C Standard`  
**Ngày ban hành Kế hoạch:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LEGAL KNOWLEDGE IMPORT PREPARATION PLAN`** *(Kế hoạch & Quy chế Chuẩn bị Nạp/Mapping Dữ liệu Cơ sở Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Chuẩn bị Nạp và Ánh xạ Dữ liệu Tri thức Pháp lý (`Legal Knowledge Import Preparation Plan` - Phase 11C) của hệ thống LegalFlow V2. Kế hoạch được thiết lập ngay sau khi hoàn thành Phase 11B (chuẩn hóa quy trình thu thập, rà soát và Sổ Đăng ký Nguồn địa phương) nhằm thiết lập cấu trúc mẫu (`Metadata Template`), bảng quy chuẩn ánh xạ (`Field Mapping Spec`), bộ tiêu chí kiểm tra dữ liệu trước nạp (`Pre-import Validation & Dry-Run Checklist`) và biểu mẫu CSV chuẩn (`Sample CSV Template`). Mục tiêu then chốt là chuẩn bị sẵn sàng nền tảng kỹ thuật và dữ liệu sạch 100% cho việc import Legal Knowledge một cách có kiểm soát vào Khối 3.2 trong các giai đoạn tiếp theo (`Phase 11D`), đồng thời khẳng định tuân thủ nghiêm ngặt nguyên tắc: **tuyệt đối không import dữ liệu thật ngay trong Phase 11C và không bao giờ cho phép AI tự động kích hoạt hay tự khẳng định dữ liệu là đầy đủ tuyệt đối**.

---

## 2. Background

Trong quá trình chuẩn hóa Phase 11B (`v2.11.1`), hệ thống đã ban hành Sổ Đăng ký Nguồn Pháp lý Địa phương (`Local Regulation Source Register`) cùng Quy trình SOP Rà soát Phê duyệt (`Review & Approval SOP`). Tuy nhiên, để chuyển hóa các tài liệu pháp quy (Quyết định của UBND tỉnh, Quy hoạch sử dụng đất cấp huyện, Bộ quy trình nội bộ TTHC) từ dạng file scan/văn bản thô sang cấu trúc cơ sở dữ liệu tri thức (`LegalKnowledge` / Khối 3.2) mà không gây rủi ro sai lệch, dự án cần một bước đệm chuẩn bị khắt khe:
* **Phase 11B đã chuẩn hóa quy trình thu thập, rà soát, phê duyệt nguồn pháp lý:** Đã xác lập ma trận trách nhiệm (`RBAC`) cho `Source Collector`, `Legal Reviewer`, `MANAGER Approver` và `ADMIN`.
* **Phase 11C chỉ chuẩn bị template và mapping:** Tập trung 100% vào việc định nghĩa trường dữ liệu (`29 metadata fields`), quy luật biến đổi (`Transformation Rules`) và bộ kiểm tra dry-run.
* **Phase này không import thật vào database:** Không chạy bất kỳ script seed hay import nào tác động đến bảng `LegalKnowledge` trên DB production `legalflow_prod`.
* **Không active version pháp lý:** Huy hiệu hiệu lực (`v2.0-2024-LAND-LAW`) và trạng thái active được giữ nguyên, không có bất kỳ thao tác active hay rollback tự động nào.
* **Không khẳng định dữ liệu là đầy đủ tuyệt đối:** Hệ thống tiếp tục duy trì nguyên tắc quản trị AI Khối 3.1: căn cứ tri thức chỉ là thông tin tham khảo tại thời điểm số hóa; chuyên viên thụ lý P2 bắt buộc đối chiếu thực tế trước khi ra quyết định.

---

## 3. Import Preparation Scope

Bảng phân loại và mô tả chi tiết phạm vi 7 hạng mục công việc chuẩn bị import tri thức pháp lý trong Phase 11C (`Import Preparation Scope Matrix`):

| Scope Item | Description | Output | Owner (`RBAC`) | Notes & Governance Check |
| :--- | :--- | :--- | :---: | :--- |
| **1. Chuẩn hóa metadata văn bản** | Định nghĩa chi tiết 29 trường thuộc tính dữ liệu (`29 metadata fields`) cho mỗi bản ghi văn bản quy phạm pháp luật hoặc quy định địa phương. | `LEGAL_DOCUMENT_METADATA_TEMPLATE.md` | `Legal Reviewer` / `ADMIN` | Đảm bảo bao phủ đủ trường thông tin về hiệu lực, địa bàn và quan hệ sửa đổi. |
| **2. Chuẩn hóa nhóm dữ liệu** | Phân loại dữ liệu theo các nhóm nghiệp vụ rõ ràng (`Procedure Group`: Land, Construction) và loại văn bản (`Document Type`: Decision, Plan, SOP). | Danh mục phân nhóm trong Template &amp; Mapping Spec | `Procedure Lead` / `MANAGER` | Hỗ trợ bộ lọc tra cứu Khối 3.2 nhanh chóng và chính xác. |
| **3. Mapping trường nguồn sang Legal Knowledge** | Thiết lập bảng ánh xạ 20 trường dữ liệu nguồn sang cấu trúc bảng DB `LegalKnowledge` hiện hữu hoặc dự kiến, kèm theo quy luật biến đổi. | `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md` | `Database Admin` / `Legal Reviewer` | Ngăn chặn lỗi nhầm lẫn trường dữ liệu khi nạp batch CSV. |
| **4. Checklist validation trước import** | Xây dựng bộ 14 tiêu chí kiểm tra dữ liệu trước import (`Pre-import Validation Checklist`), bảo đảm dữ liệu có nguồn, có hiệu lực và đã duyệt. | `IMPORT_VALIDATION_AND_DRY_RUN_CHECKLIST.md` *(Section 2)* | `Legal Reviewer` / `MANAGER` | Chốt chặn loại bỏ 100% bản ghi rác hoặc chưa qua thẩm định. |
| **5. Dry-run checklist** | Xây dựng bộ quy trình kiểm thử mô phỏng 10 bước (`Dry-Run Checklist`) để đánh giá tính toàn vẹn của batch dữ liệu mẫu trước khi nạp thật. | `IMPORT_VALIDATION_AND_DRY_RUN_CHECKLIST.md` *(Section 3)* | `ADMIN` / `Technical Operator` | Phục vụ trực tiếp cho việc diễn tập nạp dữ liệu tại Phase 11D. |
| **6. Error handling khi dữ liệu thiếu** | Quy định rõ các hướng xử lý (`Validation Decision`: Reject, Needs More Info, Approved with Warning, Hold) đối với các bản ghi thiếu trường bắt buộc. | Section 5 trong Mapping Spec &amp; Checklist | `Legal Reviewer` / `ADMIN` | Tuyệt đối không tự suy diễn điều khoản hay tự điền giá trị hiệu lực giả định. |
| **7. Quy tắc không import dữ liệu chưa duyệt** | Quán triệt kỷ luật thép: mọi bản ghi có trạng thái `approval_status` khác `Approved` (`Draft`, `Pending Review`, `Rejected`) đều bị loại bỏ khỏi luồng import. | Section 7 Plan &amp; Section 4 Checklist | `MANAGER` / `ADMIN` | Bảo vệ sự thanh lọc và hợp pháp tuyệt đối cho Khối 3.2. |

---

## 4. Out of Scope

Nhằm bảo đảm tính ổn định tối đa của hệ thống production và tuân thủ kỷ luật quản trị Phase 11C, 7 hành vi sau đây **TẠI THỜI ĐIỂM NÀY NẰM HOÀN TOÀN NGOÀI PHẠM VI (`Out of Scope Strict Mandates`)**:
1. 🛑 **Không sửa code import (`Zero Import Code Modification`):** Không chỉnh sửa hay viết thêm mã nguồn backend/import service trong Phase 11C.
2. 🛑 **Không tạo migration (`Zero Migration Creation`):** Không tạo file migration `sql` mới hay thay đổi schema Prisma.
3. 🛑 **Không thay đổi database (`Zero DB Alteration`):** Không chạy các lệnh can thiệp cấu trúc bảng, không `reset` và không `restore` DB.
4. 🛑 **Không import dữ liệu thật (`Zero Real Data Ingestion`):** Tuyệt đối không chạy script hay nạp bất kỳ dữ liệu thật nào vào bảng `LegalKnowledge` trên môi trường production.
5. 🛑 **Không active version (`Zero Version Activation`):** Không thực hiện chuyển đổi trạng thái hiệu lực (`active: true`) hay kích hoạt phiên bản luật mới.
6. 🛑 **Không rollback version (`Zero Version Rollback`):** Không bãi bỏ hay quay lui bất kỳ căn cứ pháp lý hiện hữu nào trên DB.
7. 🛑 **Không tự động cập nhật pháp luật (`Zero Auto-Scraping / Auto-Ingestion`):** Không tự động cào hay đồng bộ văn bản pháp luật từ các cổng thông tin điện tử bên ngoài mà không có con người kiểm duyệt.

---

## 5. Import Readiness Workflow

Quy trình 10 bước chuẩn bị, kiểm chứng và đánh giá độ sẵn sàng trước khi thực thi nạp dữ liệu tri thức pháp lý (`10-Step Legal Knowledge Import Readiness Workflow`):
1. **Bước 1: Thu thập nguồn văn bản (`Source Collection`):** `Source Collector` tải file scan/pdf gốc từ Công báo tỉnh hoặc cổng UBND tỉnh.
2. **Bước 2: Điền Source Register (`Source Register Logging`):** Ghi nhận đầy đủ metadata ban đầu vào Sổ Đăng ký Nguồn (`Local Regulation Source Register` - Phase 11B).
3. **Bước 3: Kiểm tra metadata (`Metadata Verification`):** `Legal Reviewer` đối chiếu chi tiết 29 trường thông tin thuộc tính (`Title, Doc Number, Issuing Authority, Effective Date...`) với văn bản gốc.
4. **Bước 4: Chạy Legal Data Validation Checklist (`Pre-import Audit`):** Kiểm tra 14 tiêu chí bắt buộc theo Bảng kiểm trước import (`VAL-01 -> VAL-14`).
5. **Bước 5: Reviewer xác nhận (`Reviewer Sign-off`):** `Legal Reviewer` ký nháy xác nhận đạt chuẩn và chuyển trạng thái bản ghi sang `Reviewed`.
6. **Bước 6: Manager / Approver phê duyệt (`Manager Approval`):** `MANAGER Approver` thẩm định hồ sơ, ký quyết định phê duyệt và gán trạng thái `approval_status = Approved`.
7. **Bước 7: Chuẩn hóa dữ liệu theo template import (`Template Formatting`):** `ADMIN` chuẩn hóa các bản ghi đã duyệt vào cấu trúc file mẫu `SAMPLE_IMPORT_CSV_TEMPLATE.md` (`29 columns`).
8. **Bước 8: Kiểm tra mapping (`Mapping Verification`):** Đối chiếu quy chuẩn ánh xạ dữ liệu theo `LEGAL_KNOWLEDGE_FIELD_MAPPING_SPEC.md` để đảm bảo định dạng ngày tháng và kiểu dữ liệu chính xác 100%.
9. **Bước 9: Dry-run checklist (`Simulated Dry-Run Audit`):** Chạy kiểm thử mô phỏng 10 bước (`Dry-Run Checklist`) trên file CSV mẫu để phát hiện lỗi trùng lặp số hiệu hay thiếu trường bắt buộc.
10. **Bước 10: Chỉ sau phase riêng mới được import thật nếu có phê duyệt (`Controlled Execution Phase Gate`):** Khi toàn bộ 9 bước trên đạt `[PASS]`, dữ liệu được niêm phong chờ lệnh phê duyệt chính thức từ Lãnh đạo Dự án để thực hiện nạp diễn tập/nạp thật tại **Phase 11D (`Legal Knowledge Import Dry Run & Sample Dataset Review`)**.

---

## 6. Required Import Inputs

Bảng danh mục 17 trường thông tin thuộc tính đầu vào bắt buộc và quan trọng nhất (`Required Import Inputs Matrix`) khi lập hồ sơ chuẩn bị import:

| Input Field Name | Required? (`Yes/No`) | Source Document Mapping | Validation Needed (`Yes/No`) | Notes & Governance Standard |
| :--- | :---: | :--- | :---: | :--- |
| **1. `title`** *(Tên văn bản)* | `YES` | Tên/trích yếu văn bản trên quyết định gốc. | `YES` | Phải phản ánh chính xác toàn văn bản gốc, dùng làm tiêu đề tra cứu Khối 3.2. |
| **2. `document number`** *(Số hiệu)* | `YES` | Số và ký hiệu văn bản (`25/2024/QĐ-UBND`). | `YES` | Định danh duy nhất, kiểm tra chống trùng lặp (`Duplicate Check`). |
| **3. `issuing authority`** *(Cơ quan ban hành)* | `YES` | Tên cơ quan ban hành (`UBND tỉnh X`). | `YES` | Phân loại cấp thẩm quyền Trung ương vs. Địa phương. |
| **4. `document type`** *(Loại văn bản)* | `YES` | Quyết định, Kế hoạch, Quy hoạch, Quy trình nội bộ. | `YES` | Ánh xạ vào danh mục `Document Type Guide` chuẩn. |
| **5. `issue date`** *(Ngày ban hành)* | `YES` | Ngày tháng năm ký ban hành trên văn bản gốc. | `YES` | Chuẩn hóa định dạng `YYYY-MM-DD`. |
| **6. `effective date`** *(Ngày hiệu lực)* | `YES` | Ngày chính thức bắt đầu có hiệu lực thi hành. | `YES` | Chuẩn hóa định dạng `YYYY-MM-DD`, mốc thời gian AI Khối 3.1 đối chiếu hồ sơ. |
| **7. `expiry date`** *(Ngày hết hiệu lực nếu có)* | `OPTIONAL` | Ngày hết hiệu lực hoặc bị bãi bỏ (`YYYY-MM-DD` hoặc `NULL`). | `YES` | Nếu văn bản còn hiệu lực, để trống (`NULL`). |
| **8. `status`** *(Tình trạng hiệu lực)* | `YES` | Trạng thái hiệu lực (`Effective / Expired / Superseded`). | `YES` | Chỉ nạp văn bản có hiệu lực hợp pháp vào luồng active. |
| **9. `scope`** *(Phạm vi cấp độ)* | `YES` | Cấp độ ban hành (`NATIONAL` hoặc `LOCAL`). | `YES` | Giúp phân tách rõ ràng luật trung ương và quy định địa phương. |
| **10. `local applicability`** *(Địa bàn áp dụng)* | `YES` | Toàn tỉnh X / riêng Huyện A / Thành phố B. | `YES` | Ngăn chặn áp dụng nhầm hạn mức tách thửa giữa các địa bàn hành chính. |
| **11. `related procedure`** *(Thủ tục liên quan)* | `YES` | Mã thủ tục TTHC (`TTHC-LAND-01`, `TTHC-LAND-05`...). | `YES` | Ánh xạ chính xác vào Khối 3.1 khi thẩm định hồ sơ tương ứng. |
| **12. `legal basis content / summary`** *(Nội dung/Tóm tắt)* | `YES` | Tóm tắt các điều khoản lõi liên quan trực tiếp đến TTHC. | `YES` | Hiển thị ngay trên giao diện `Knowledge` để cán bộ đọc nhanh. |
| **13. `source URL / location`** *(Nguồn lưu trữ)* | `YES` | URL Công báo tỉnh hoặc đường dẫn file scan gốc (`minio://...`). | `YES` | Bằng chứng kiểm toán (`Audit Trail`) để cán bộ bấm mở kiểm chứng tức thì. |
| **14. `reviewer`** *(Người rà soát)* | `YES` | Tài khoản/Họ tên Cán bộ Pháp chế thẩm định. | `YES` | Ghi nhận trách nhiệm rà soát con người trước khi số hóa. |
| **15. `approval status`** *(Trạng thái phê duyệt)* | `YES` | Trạng thái quy trình (`Approved` / `Reviewed` / `Draft`). | `YES` | **BẮT BUỘC KHÓA CHẶT ở giá trị `Approved` mới được đưa vào CSV import.** |
| **16. `active candidate flag`** *(Cờ chờ kích hoạt)* | `YES` | Cờ logic boolean (`true` / `false`). | `YES` | Trong giai đoạn import, mặc định thiết lập `false` (`Active Candidate`). |
| **17. `notes`** *(Ghi chú quản trị)* | `OPTIONAL` | Các lưu ý, cảnh báo rủi ro, hướng dẫn áp dụng linh hoạt. | `NO` | Hiển thị trong tooltip nhắc nhở chuyên viên khi thụ lý Khối 3.1. |

---

## 7. Import Safety Rules

Nhằm bảo đảm tuyệt đối an toàn cho dữ liệu pháp lý Khối 3.2, Kế hoạch thiết lập **7 Quy tắc An toàn Nạp Dữ liệu (`7 Inviolable Import Safety Rules`)**:
1. 🛑 **Không import nếu thiếu nguồn (`Zero Unverified Source Import`):** Bản ghi không có URL Công báo tỉnh, cổng thông tin điện tử UBND tỉnh hoặc đường dẫn file scan gốc có dấu đỏ lưu tại Văn thư kiên quyết bị loại bỏ khỏi batch CSV.
2. 🛑 **Không import nếu chưa xác định hiệu lực (`Zero Ambiguous Validity Import`):** Bản ghi có trường `effective_date` bỏ trống, hoặc tình trạng hiệu lực `legal_status = Unknown / Needs Review` bị từ chối import.
3. 🛑 **Không import nếu chưa kiểm tra sửa đổi / bổ sung / thay thế (`Mandatory Amendment Audit`):** Đối với văn bản cũ, bắt buộc phải đối chiếu xem có bị Nghị định/Quyết định mới nào sửa đổi hay thay thế chưa trước khi lập template nạp.
4. 🛑 **Không import nếu chưa xác định phạm vi địa phương (`Strict Territorial Mapping`):** Các quyết định hạn mức đất, quy hoạch cấp huyện phải ghi rõ ràng trường `local_applicability` (Huyện nào, Xã nào); không được để mặc định "Toàn quốc" hay "Toàn tỉnh" một cách cẩu thả.
5. 🛑 **Không import nếu chưa có reviewer / approver (`No Unapproved Data Ingestion`):** Bản ghi thiếu chữ ký xác nhận của `Legal Reviewer` hoặc chưa đạt `approval_status = Approved` từ `MANAGER` kiên quyết bị từ chối nạp DB.
6. 🛑 **Không active tự động sau import (`Zero Auto-Activation Upon Import`):** Mọi bản ghi sau khi nạp thành công vào DB chỉ được nằm ở trạng thái `Active Candidate` (`active: false`). Quyền kích hoạt (`active: true`) thuộc về quy trình phê duyệt riêng biệt của Lãnh đạo Đơn vị.
7. ✅ **Phải giữ warning cán bộ kiểm tra lại (`Mandatory Human Verification Warning`):** Trong metadata và trên mọi giao diện hiển thị Khối 3.2 sau import, bắt buộc duy trì thông điệp cảnh báo: *"Căn cứ tri thức chỉ mang tính tham khảo tại thời điểm số hóa. Cán bộ thụ lý bắt buộc đối chiếu văn bản gốc và thực tế trước khi tham mưu quyết định."*

---

## 8. Proposed Next Phase

Sau khi hoàn tất Kế hoạch, Mẫu Metadata, Bảng Mapping Spec, Checklist Kiểm tra và CSV Template của Phase 11C, bước tiếp theo được đề xuất là:

&rarr; **`Phase 11D: Legal Knowledge Import Dry Run & Sample Dataset Review`**  
*(Thực hiện kiểm thử diễn tập nạp bộ dữ liệu mẫu Legal Knowledge - Dry Run trên môi trường kiểm thử/staging, đánh giá kết quả ánh xạ và rà soát báo cáo tính toàn vẹn dữ liệu trước khi vận hành chính thức)*.

---
*Kế hoạch Chuẩn bị Nạp và Ánh xạ Dữ liệu Tri thức Pháp lý (Phase 11C Plan) được lập tự động từ Sổ Backlog chuẩn hóa.*
