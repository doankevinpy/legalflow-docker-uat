# LEGALFLOW V2 - PHASE 11C
# LEGAL KNOWLEDGE FIELD MAPPING SPEC

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11C Standard`  
**Ngày ban hành Mapping Spec:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL LEGAL KNOWLEDGE FIELD MAPPING SPECIFICATION`** *(Quy chuẩn Ánh xạ Trường Dữ liệu Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Quy chuẩn Ánh xạ Trường Dữ liệu Tri thức Pháp lý (`Legal Knowledge Field Mapping Spec` - Phase 11C) của hệ thống LegalFlow V2. Tài liệu mô tả chi tiết cơ chế ánh xạ (`Mapping Engine`) chuyển đổi 20 trường thông tin thuộc tính từ các nguồn dữ liệu bên ngoài (Sổ Đăng ký Nguồn Phase 11B, file CSV/Excel thu thập) sang cấu trúc trường của bảng `LegalKnowledge` hiện hữu hoặc dự kiến trên cơ sở dữ liệu hệ thống (Khối 3.2). Quy chuẩn xác lập các nguyên tắc ánh xạ (`Mapping Principles`), bảng đối chiếu chi tiết (`Field Mapping Table`), quy luật biến đổi chuỗi/ngày tháng (`Transformation Rules`), quy tắc xử lý khi dữ liệu không đạt chuẩn (`Validation Failure Handling`) và các chốt chặn an toàn (`Import Safety`), phục vụ trực tiếp cho quá trình chuẩn bị import có kiểm soát mà không gây bất kỳ xáo trộn hay lỗi dữ liệu nào.

---

## 2. Mapping Principles

Nhằm bảo đảm 100% tính chính xác và an toàn pháp lý khi ánh xạ dữ liệu, hệ thống thiết lập **6 Nguyên tắc Ánh xạ Bất khả xâm phạm (`6 Inviolable Field Mapping Principles`)**:
1. **Mapping phải rõ nguồn (`Absolute Source Traceability`):** Mọi trường dữ liệu ánh xạ vào DB phải duy trì liên kết truy vết với `source_id` và `source_url`. Tuyệt đối không ánh xạ các bản ghi ẩn danh, mất nguồn hoặc không xác định được cơ quan ban hành.
2. **Không bỏ qua trường hiệu lực (`Mandatory Effective Date Preservation`):** Trường `effective_date` và `legal_status` là 2 trường sống còn xác định quyền áp dụng luật của Khối 3.1. Tuyệt đối không được phép bỏ qua (`skip`) hoặc để mặc định khi ánh xạ sang DB.
3. **Không bỏ qua trường phạm vi địa phương (`Mandatory Territorial Mapping`):** Trường `local_scope` (`National` vs. `Local`) và `local_applicability` (Toàn tỉnh vs. Huyện/Xã) phải được chuyển giao trọn vẹn, không được phép làm mất thông tin giới hạn địa bàn áp dụng.
4. **Không bỏ qua reviewer / approval status (`Mandatory Human Approval Lineage`):** Trạng thái phê duyệt (`approval_status`) và người thẩm định (`reviewer`) bắt buộc ánh xạ vào metadata bản ghi DB để làm bằng chứng kiểm toán (`Audit Trail`), khẳng định trách nhiệm rà soát của con người.
5. **Không tự động active (`Zero Auto-Activation Upon Mapping`):** Quá trình ánh xạ trường dữ liệu chỉ tạo cấu trúc dữ liệu sẵn sàng cho lệnh `insert / upsert` với cờ `active_candidate = false` (hoặc `active = false`). Việc ánh xạ tuyệt đối không kích hoạt hiệu lực pháp lý trên giao diện người dùng.
6. **Không suy diễn điều khoản nếu dữ liệu không có (`Zero Speculative Inference`):** Nếu văn bản nguồn không chia nhỏ điều, khoản hoặc không trích xuất sẵn `article_clause_reference`, bộ ánh xạ giữ nguyên giá trị `NULL` hoặc để trống. Tuyệt đối không dùng AI để tự ý suy diễn, chế định hay tự động sinh số điều/khoản giả định.

---

## 3. Field Mapping Table

Bảng đối chiếu chuẩn hóa ánh xạ 20 trường dữ liệu nguồn sang cấu trúc đối tượng `LegalKnowledge` của hệ thống (`Standardized 20-Point Field Mapping Table`):

| Source Field (`Input Schema`) | Target Field / Concept (`DB Target`) | Required (`Yes/No`) | Transformation Rule (`Formatting`) | Validation Rule (`Constraint Check`) | Concrete Example (`Sample Value`) | Notes & Mapping Rationale |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **1. `document_title`** | `title` | `YES` | Trim leading/trailing whitespace. Remove control characters. | Must be 10 - 500 characters long. Not empty. | Quyết định hạn mức giao đất tỉnh X | Tiêu đề hiển thị trên danh sách tra cứu Khối 3.2. |
| **2. `document_number`** | `docNumber` / `code` | `YES` | Uppercase letters, standard slash formatting (`25/2024/QĐ-UBND`). | Must be unique across all active entries (`Unique Index`). | `25/2024/QĐ-UBND` | Khóa định danh tra cứu và trích dẫn văn bản Word Khối 3.3. |
| **3. `issuing_authority`** | `issuingAuthority` | `YES` | Trim whitespace. Standardize common abbreviations (`UBND`, `TNMT`). | Must match known authorities or valid non-empty string. | `UBND tỉnh X` | Phân cấp cơ quan ban hành Trung ương hay Địa phương. |
| **4. `document_type`** | `type` / `docType` | `YES` | Map to standard enumeration (`Decision`, `Plan`, `MasterPlan`, `SOP`). | Must belong to valid `Document Type Guide` enum. | `Decision` *(Quyết định)* | Bộ lọc phân loại dữ liệu trên menu `Knowledge`. |
| **5. `issue_date`** | `issueDate` | `YES` | Parse raw string (`DD/MM/YYYY`) and convert to ISO string (`YYYY-MM-DD`). | Valid date, `issueDate <= CURRENT_DATE`. | `2024-09-15` | Trình tự thời gian ban hành của văn bản. |
| **6. `effective_date`** | `effectiveDate` | `YES` | Parse string and format to ISO string (`YYYY-MM-DD`). | Valid date, `effectiveDate >= issueDate`. | `2024-10-01` | Mốc thời gian AI Khối 3.1 đối chiếu ngày nộp hồ sơ. |
| **7. `legal_status`** | `status` | `YES` | Map raw string to DB enum (`ACTIVE`, `EXPIRED`, `PENDING`, `SUPERSEDED`). | Must be strictly `ACTIVE` (`Effective`) for active inclusion. | `ACTIVE` | Xác định tình trạng hiệu lực thi hành hợp pháp. |
| **8. `local_scope`** | `scope` | `YES` | Uppercase enum mapping (`NATIONAL`, `LOCAL`). | Must be `NATIONAL` or `LOCAL`. | `LOCAL` | Phân tách luật trung ương và quy định đặc thù địa phương. |
| **9. `related_procedure`** | `procedureCodes` | `YES` | Split comma-separated string into JSON array of procedure strings (`[]`). | Each element must match valid `CASELIST-02` procedure code. | `["TTHC-LAND-01", "TTHC-LAND-05"]` | Ánh xạ chính xác vào Khối 3.1 khi thẩm định thủ tục. |
| **10. `legal_topic`** | `topic` / `category` | `YES` | Trim whitespace. Map to standardized legal topic taxonomy. | Not empty. | `Land Subdivision Limits` | Gom nhóm các điều khoản liên quan theo chủ đề chuyên sâu. |
| **11. `article_clause_reference`** | `articleRef` | `OPTIONAL` | Trim string. Preserve exact Vietnamese text (`Điều X, Khoản Y`). | If provided, max 200 chars. No speculative generation. | `Điều 5, Khoản 2` | Chỉ dẫn trực tiếp cho cán bộ đọc thẳng vào điều khoản. |
| **12. `summary`** | `summary` / `content` | `YES` | Trim whitespace. Preserve line breaks for clean markdown display. | Must be 20 - 2000 characters long. Not empty. | Quy định hạn mức tách thửa đất ở... | Tóm tắt hiển thị ngay trên giao diện `Knowledge`. |
| **13. `full_text_location`** | `storageUri` | `YES` | Standardize URI prefix (`minio://...` or `file://...`). | Must be valid non-empty storage path. | `minio://legal-docs/25_2024_QD_UBND.pdf` | Bằng chứng tra cứu file scan gốc cho chuyên viên thẩm định. |
| **14. `source_url`** | `sourceUrl` | `YES` | Validate `http://` or `https://` protocol prefix. | Valid URL format. Not empty. | `https://congbothongtin.tinhX.gov.vn/...` | Bằng chứng xác thực nguồn gốc hợp pháp (`Audit Trail`). |
| **15. `amends_document`** | `amendsDocNo` | `OPTIONAL` | Trim string. Extract document number if embedded in text. | If provided, target doc number must exist or be logged. | `12/2020/QĐ-UBND` | Liên kết ánh xạ truy vết biến động sửa đổi pháp lý. |
| **16. `replaces_document`** | `replacesDocNo` | `OPTIONAL` | Trim string. Exact target document number of abrogated text. | If provided, flags target document as `SUPERSEDED`. | `15/2018/QĐ-UBND` | Giúp hệ thống tự động lưu vết bãi bỏ văn bản cũ. |
| **17. `replaced_by_document`** | `replacedByDocNo` | `OPTIONAL` | Trim string. Exact successor document number. | If provided, marks current record as successor-linked. | `NULL` | Hỗ trợ quản lý chuỗi vòng đời văn bản pháp quy. |
| **18. `reviewer`** | `reviewedBy` | `YES` | Map username or full name of Legal Reviewer. | Must not be empty. Must correspond to valid officer. | `nguyenvana.legal` | Ghi nhận trách nhiệm rà soát con người trước khi số hóa. |
| **19. `approval_status`** | `approvalStatus` | `YES` | Map strictly to uppercase enum (`APPROVED`, `REVIEWED`, `DRAFT`). | **MUST BE `APPROVED` (`Approved`). Else reject mapping.** | `APPROVED` | **Chốt chặn an toàn: chỉ bản ghi `Approved` mới được chuyển DB.** |
| **20. `risk_note`** | `riskNote` / `metadata` | `OPTIONAL` | Embed into `metadata` JSON object under key `riskNote` (`{"riskNote": "..."}`). | If provided, max 1000 chars. Preserved verbatim. | `Lưu ý điều khoản chuyển tiếp tại Điều 15` | Hiển thị cảnh báo vàng (`Warning Alert`) trên Khối 3.1 &amp; Khối 3.2. |

---

## 4. Transformation Rules

Quy tắc kỹ thuật chuẩn hóa dữ liệu trong quá trình chạy script hoặc batch mapping (`Data Transformation Rules`):
1. **Chuẩn hóa ngày theo định dạng `YYYY-MM-DD` (`Strict ISO Date Formatting`):** Mọi trường ngày tháng đầu vào ở dạng `DD/MM/YYYY`, `D/M/YYYY` hoặc `YYYY.MM.DD` đều phải được chuyển đổi bằng bộ phân tích ngày chuẩn về chuỗi ISO `YYYY-MM-DD` (ví dụ: `15/09/2024 -> 2024-09-15`). Nếu chuỗi ngày không hợp lệ, trả về lỗi `INVALID_DATE_FORMAT`.
2. **Chuẩn hóa document type (`Document Type Standardization`):** Chuyển đổi các chuỗi tiếng Việt hoặc chuỗi tự do sang chuỗi định danh chuẩn: `Quyết định -> Decision`, `Kế hoạch sử dụng đất -> LandUsePlan`, `Quy hoạch -> MasterPlan`, `Quy trình nội bộ -> InternalSOP`, `Biểu mẫu -> AdministrativeTemplate`.
3. **Chuẩn hóa legal status (`Status Mapping standardization`):** Ánh xạ giá trị hiệu lực sang chuẩn DB: `Effective / Còn hiệu lực -> ACTIVE`, `Expired / Hết hiệu lực -> EXPIRED`, `Superseded / Bị thay thế -> SUPERSEDED`, `Not Yet Effective / Chưa có hiệu lực -> PENDING`.
4. **Tách document number khỏi title nếu cần (`Number Extraction Rule`):** Nếu trường `title` bị gộp cả số hiệu ban đầu (ví dụ: *"Quyết định số 25/2024/QĐ-UBND về hạn mức..."*), bộ chuyển đổi được phép tách phần ký hiệu `25/2024/QĐ-UBND` sang `docNumber` và giữ lại phần tên sạch cho `title` nếu `document_number` bị để trống.
5. **Không tự sinh article/clause nếu không có (`Zero Clause Generation Rule`):** Nếu trường `article_clause_reference` bỏ trống (`NULL`), bộ chuyển đổi giữ nguyên `NULL`. Tuyệt đối không dùng AI hay biểu thức chính quy để tự ý bóc tách, đoán định hay sinh số điều/khoản không chắc chắn từ phần `summary`.
6. **Giữ nguyên ghi chú rủi ro (`Verbatim Risk Note Preservation`):** Toàn bộ nội dung trong trường `risk_note` (cảnh báo chuyển tiếp, hạn chế địa bàn) phải được giữ nguyên từng câu chữ (`verbatim string`), chuyển thẳng vào thuộc tính metadata trên DB để hiển thị chính xác cho cán bộ thụ lý.

---

## 5. Validation Failure Handling

Quy trình xử lý ngoại lệ và phán quyết điều hướng (`Mapping Failure Decision Matrix`) khi dữ liệu đầu vào vi phạm quy tắc kiểm chứng trong lúc thực hiện ánh xạ:

| Validation Failure Scenario (`Error Condition`) | Root Cause & Risk Evaluation | Mandatory Mapping Decision (`Decision Action`) | Automated System Behavior & Log Output |
| :--- | :--- | :---: | :--- |
| **1. Thiếu `title` hoặc `docNumber`** | Dữ liệu nguồn bị khuyết trường thông tin định danh cốt lõi, không thể tra cứu hay trích dẫn. | **`REJECT`** | Loại bỏ ngay lập tức khỏi batch mapping. Ghi log `ERROR: MISSING_MANDATORY_TITLE_OR_NUMBER`. |
| **2. Thiếu `source_url` hoặc `storageUri`** | Bản ghi không có bằng chứng file scan gốc hoặc Công báo tỉnh, vi phạm nguyên tắc truy vết (`Audit Trail`). | **`REJECT`** | Loại bỏ khỏi batch mapping. Ghi log `ERROR: UNVERIFIED_SOURCE_LOCATION_MISSING`. |
| **3. Thiếu `effective_date` hoặc sai ISO date** | Không có mốc thời gian hiệu lực thi hành, AI Khối 3.1 không thể đối chiếu ngày nộp hồ sơ hợp lệ. | **`REJECT`** | Loại bỏ khỏi batch mapping. Ghi log `ERROR: INVALID_OR_MISSING_EFFECTIVE_DATE`. |
| **4. `legal_status` là `Unknown / Needs Review`** | Tình trạng hiệu lực pháp lý đang có tranh chấp hoặc chưa được Cán bộ Pháp chế thẩm định xong. | **`REJECT`** | Kiên quyết từ chối ánh xạ vào luồng nạp DB. Ghi log `ERROR: LEGAL_STATUS_UNKNOWN_EXCLUDED`. |
| **5. `approval_status` chưa đạt `Approved`** | Bản ghi đang ở trạng thái `Draft`, `Pending Review` hoặc `Rejected` (chưa có chữ ký Lãnh đạo Phòng). | **`REJECT`** | Loại bỏ khỏi batch mapping. Ghi log `ERROR: UNAPPROVED_ENTRY_EXCLUDED_FROM_IMPORT`. |
| **6. `local_scope` / `local_applicability` không rõ** | Quyết định hạn mức đất hoặc quy hoạch không ghi rõ áp dụng cho huyện/xã nào, nguy cơ áp dụng nhầm địa bàn. | **`NEEDS MORE INFORMATION`** | Đưa bản ghi vào danh sách chờ (`Quarantine Queue`). Trả lại cho `Source Collector` bổ sung địa bàn. |
| **7. Văn bản có dấu hiệu bị thay thế (`Replaced Sign`)** | Ghi nhận có Nghị định/Quyết định mới ban hành nhưng `status` vẫn để `Effective`, chưa cập nhật ánh xạ `SUPERSEDED`. | **`APPROVED WITH WARNING`** | Cho phép ánh xạ vào DB nhưng buộc gán cờ `status = PENDING_REPLACEMENT_REVIEW` và hiển thị cảnh báo vàng (`Warning Flag`). |
| **8. Trùng lặp `docNumber` (`Duplicate Code Check`)** | Số hiệu văn bản (`docNumber`) đã tồn tại trong bảng `LegalKnowledge` trên DB (trùng bản ghi cũ). | **`HOLD FOR REVIEW`** | Dừng nạp bản ghi bị trùng. Báo cáo `ADMIN` và `Legal Reviewer` kiểm tra xem là bản ghi lặp hay là bản sửa đổi điều khoản (`Update/Upsert Audit`). |

---

## 6. Import Safety

Nhằm thắt chặt kỷ luật an toàn kỹ thuật và pháp lý, Quy chuẩn Ánh xạ khẳng định **4 Chốt chặn An toàn Vận hành (`4 Inviolable Mapping & Import Safety Rules`)**:
1. **Mapping không đồng nghĩa với import (`Mapping is NOT Ingestion`):** Quá trình chạy ánh xạ dữ liệu theo `Mapping Spec` chỉ là bước chuyển đổi định dạng trên bộ nhớ hoặc tạo file dữ liệu chuẩn (`.json/.csv`). Việc ánh xạ hoàn tất không có nghĩa là dữ liệu đã được nạp vào cơ sở dữ liệu production.
2. **Import không đồng nghĩa với active (`Ingestion is NOT Activation`):** Khi bản ghi được nạp (`insert`) vào bảng `LegalKnowledge` trên DB, thuộc tính trạng thái kích hoạt bắt buộc phải khóa ở giá trị `active_candidate = false` (hoặc `active: false`). Bản ghi nằm ở vùng đệm (`Staging Buffer`), chưa có hiệu lực trên Khối 3.2.
3. **Active cần workflow riêng (`Activation Requires Independent Workflow`):** Việc kích hoạt một phiên bản luật hay căn cứ địa phương (`active: true`) là một quy trình rà soát độc lập (`Controlled Activation Workflow`), đòi hỏi quyết định ký duyệt của Lãnh đạo Đơn vị và lệnh thực thi thủ công của `ADMIN`.
4. **AI không được tự quyết định active (`Zero AI Activation Mandate`):** Trợ lý AI Khối 3.1 và các script tự động hóa tuyệt đối không có quyền ra lệnh hay thực thi việc kích hoạt hiệu lực văn bản pháp luật. Mọi hành vi tự động active đều bị cấm ngặt theo đúng 17 nguyên tắc an toàn Phase 11C.

---
*Quy chuẩn Ánh xạ Trường Dữ liệu Tri thức Pháp lý (Mapping Spec) được lập tự động từ cấu trúc chuẩn hóa Phase 11C.*
