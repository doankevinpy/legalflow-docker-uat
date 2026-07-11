# LEGALFLOW V2 - PHASE 11F
# IMPORT VALIDATION RULES SPEC

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11F Standard`  
**Ngày ban hành Đặc tả:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPORT VALIDATION RULES SPECIFICATION`** *(Đặc tả Bộ Quy tắc Kiểm tra & Xác thực Hợp lệ Dữ liệu Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Đặc tả Bộ Quy tắc Kiểm tra & Xác thực Hợp lệ Dữ liệu Nạp Tri thức Pháp lý (`Import Validation Rules Specification` - Phase 11F) của hệ thống LegalFlow V2. Tài liệu được thiết lập nhằm chuẩn hóa toàn bộ logic kiểm tra hợp lệ (`Validation Engine Logic`) bắt buộc phải thực thi trước khi bất kỳ dòng bản ghi CSV nào được phép parse vào cơ sở dữ liệu. Đặc tả quy định chi tiết 16 trường thông tin bắt buộc (`Required Field Rules`), quy tắc rà soát trạng thái (`Status Validation Rules`), quy tắc kiểm tra trùng lặp (`Duplicate Rules`), quy tắc kiểm soát văn bản địa phương (`Local Regulation Rules`), ma trận xử lý lỗi 14 tình huống (`Error Handling`) và chuẩn hóa cấu trúc đầu ra Báo cáo kiểm định (`Validation Output`).

---

## 2. Required Field Rules

Bảng đặc tả 16 trường thuộc tính bắt buộc theo chuẩn Phase 11C (`16 Mandatory Field Validation Rules Table`):

| Field (`Column Name`) | Required | Rule (`Validation Criteria & Format Requirement`) | Error Severity | Notes & Action on Failure |
| :--- | :---: | :--- | :---: | :--- |
| **`source_id`** | **YES** | Chuỗi ký tự định danh nguồn từ Sổ Đăng ký Phase 11B (`SAMPLE-001...` hoặc `LOC-LAND-001`). Không chứa ký tự khoảng trắng hoặc ký tự đặc biệt bất hợp lệ. | `CRITICAL` | Reject row. Ngăn chặn nạp bản ghi vô danh không có nguồn gốc rõ ràng. |
| **`document_title`** | **YES** | Tiêu đề văn bản đầy đủ, độ dài tối thiểu 10 ký tự và tối đa 1000 ký tự. Không được để trống hoặc chỉ chứa chuỗi khoảng trắng. | `CRITICAL` | Reject row. Tiêu đề là thông tin hiển thị core trên UI Khối 1 & Khối 2. |
| **`document_number`** | **YES** | Số và ký hiệu văn bản chuẩn theo quy chuẩn pháp luật (`31/2024/QH15`, `102/2024/NĐ-CP`, `QĐ-TTHC-DAT-DAI`). | `CRITICAL` | Reject row. Mã số là khóa định danh nghiệp vụ cốt lõi để tra cứu căn cứ. |
| **`issuing_authority`** | **YES** | Tên cơ quan ban hành (`Quốc hội`, `Chính phủ`, `Bộ Tài nguyên và Môi trường`, `UBND Tỉnh...`). Khớp danh mục cơ quan hợp lệ. | `HIGH` | Reject row. Xác định thẩm quyền pháp lý và cấp bậc quy phạm của văn bản. |
| **`document_type`** | **YES** | Enum chuẩn: `Law, Decree, Circular, Decision, Directive, Plan, SOP, AdministrativeTemplate, OfficialLetter`. | `CRITICAL` | Reject row. Nếu không thuộc 9 loại chuẩn trên, trình parse báo lỗi Type Mismatch. |
| **`issue_date`** | *NO* *(Rec)* | Ngày ký ban hành theo định dạng chuẩn ISO `YYYY-MM-DD`. Nếu nhập thì không được lớn hơn ngày hiện tại (`Future Date Violation`). | `MEDIUM` | Warning / Reject nếu định dạng sai. Khuyến khích nhập để quản lý lịch sử. |
| **`effective_date`** | **YES** | Ngày bắt đầu hiệu lực theo định dạng chuẩn ISO `YYYY-MM-DD`. Phải hợp lệ và theo quy tắc không nhỏ hơn ngày ban hành (`issue_date`). | `CRITICAL` | Reject row. Khóa mốc thời gian để AI Khối 3.1 tính toán hiệu lực theo ngày nộp hồ sơ. |
| **`legal_status`** | **YES** | Enum chuẩn: `Effective, Expired, Superseded, Suspended, Draft, Unknown`. Chỉ cho phép `Effective` bước vào lô nạp active candidate. | `CRITICAL` | Reject row nếu `Unknown` hoặc `Draft`. Chốt chặn hiệu lực pháp lý cao nhất. |
| **`local_scope`** | **YES** | Enum chuẩn: `National` *(Toàn quốc)* hoặc `Local` *(Địa phương)*. | `CRITICAL` | Reject row. Xác định phạm vi điều chỉnh địa bàn theo quy chuẩn Phase 11B. |
| **`related_procedure`** | *NO* *(Rec)* | Mã thủ tục TTHC liên quan (`TTHC-LAND-01`, `TTHC-LAND-05`... phân tách bằng dấu phẩy). Phải khớp mã thủ tục hiện hữu trong DB. | `HIGH` | Warning nếu mã thủ tục không tồn tại trong bảng `AdministrativeProcedure`. |
| **`legal_topic`** | **YES** | Chủ đề pháp lý cụ thể (`Land General Framework`, `Land Subdivision Limits`, `Land Use Planning`...). Độ dài tối thiểu 5 ký tự. | `HIGH` | Reject row. Phục vụ phân loại cụm tri thức cho bộ tìm kiếm ngữ cảnh AI. |
| **`summary`** | **YES** | Tóm tắt cô đọng nội dung quy định ảnh hưởng đến thụ lý TTHC. Độ dài tối thiểu 20 ký tự, tối đa 2000 ký tự. | `CRITICAL` | Reject row. AI Khối 3.1 sử dụng summary để đọc hiểu nhanh nguyên tắc áp dụng. |
| **`source_url` / `full_text_location`** | **YES** *(At least 1)* | Bắt buộc phải có ít nhất 1 trong 2 trường: URL Công báo/cổng thông tin (`source_url`) hoặc đường dẫn file lưu trữ nội bộ (`minio://...`). | `CRITICAL` | Reject row nếu cả 2 đều trống. Đảm bảo nguyên tắc "có văn bản gốc để kiểm chứng". |
| **`reviewer`** | **YES** | Tài khoản / họ tên chuyên viên Pháp chế chịu trách nhiệm rà soát và đóng gói thông tin (`nguyenvana.legal`). | `CRITICAL` | Reject row. Gán trách nhiệm cá nhân đối với từng bản ghi nạp vào hệ thống. |
| **`approval_status`** | **YES** | Enum chuẩn: `Approved, Pending Review, Draft, Rejected`. **Bắt buộc phải là `Approved`** mới được phép import vào Staging candidate. | `CRITICAL` | Reject row nếu khác `Approved`. Thực thi chốt chặn phê duyệt của Lãnh đạo Phòng. |
| **`risk_note`** | **YES** | Ghi chú rủi ro, điều khoản chuyển tiếp hoặc lời nhắc kiểm tra thực tế cho chuyên viên thụ lý P2 / Một cửa. | `HIGH` | Reject row nếu để trống đối với các thủ tục tách thửa, chuyển mục đích hoặc SLA. |

---

## 3. Status Validation Rules

Quy chuẩn kiểm soát chặt chẽ các trường thuộc tính trạng thái pháp lý và thẩm định (`Status & Lifecycle Rules`):
1. 🔒 **`approval_status = Approved` Mandate:** Mọi bản ghi trong batch CSV bắt buộc phải mang giá trị `approval_status = Approved`. Các trạng thái `Draft`, `Pending Review`, `Needs Revision` hay `Rejected` bị trình kiểm tra từ chối tự động (`Auto-Rejection`) nhằm giữ sạch vùng dữ liệu nạp.
2. 🔒 **`legal_status != Unknown / Needs Review` Mandate:** Không cho phép nạp dữ liệu có hiệu lực pháp lý không rõ ràng (`Unknown`, `Needs Review`) vào luồng nạp thực tế. Bản ghi chuẩn bị nạp phải mang trạng thái `Effective` (`ACTIVE`).
3. 🔒 **`active_candidate = false` Safety Lock:** Trường `active_candidate` trong file CSV nếu mang giá trị `true` sẽ bị cảnh báo hoặc override về `false` trong khâu nạp Staging. Việc kích hoạt live bắt buộc phải đi qua quy trình phê duyệt riêng (`activate-draft-version`).
4. 🔒 **`expiry_date` Logic Check:** Nếu trường `expiry_date` (Ngày hết hiệu lực) có dữ liệu, bộ kiểm tra phải xác minh `expiry_date > effective_date`. Nếu `expiry_date <= Current Date`, bản ghi tự động bị chuyển `legal_status` sang `Expired` và bị chặn nạp vào luồng active.
5. 🔒 **`Superseded / Expired` Warning Mandate:** Đối với các văn bản bị thay thế (`Superseded`) hoặc hết hiệu lực (`Expired`) nạp vào với mục đích lưu trữ lịch sử, hệ thống phải sinh ra cảnh báo rõ ràng (`Explicit Warning Flag`) trên Báo cáo Validation để ngăn chặn dùng nhầm cho thụ lý hiện tại.

---

## 4. Duplicate Rules

Quy tắc phát hiện, phân giải và xử lý xung đột trùng lặp bản ghi (`Duplicate Resolution Rules`):
1. 🛡️ **`source_id` Uniqueness:** Trường `source_id` là khóa chính liên kết với Sổ Đăng ký Nguồn Phase 11B (`Local Regulation Source Register`). Bất kỳ bản ghi nào trong file CSV trùng `source_id` với một văn bản đã tồn tại trong DB hoặc trùng nhau trong cùng file CSV đều bị báo lỗi `Duplicate Source ID Violation` và dừng nạp dòng đó.
2. 🛡️ **`document_number + issuing_authority` Composite Uniqueness:** Cặp thuộc tính `(Số hiệu văn bản + Cơ quan ban hành)` phải duy nhất. Trường hợp ngoại lệ duy nhất là khi cùng một số hiệu văn bản nhưng được ban hành lại dưới dạng phiên bản sửa đổi (`Version Update`) với ngày hiệu lực mới; trong trường hợp này bắt buộc phải khai báo trường `amends_document` hoặc `replaces_document` hợp lệ.
3. 🛡️ **Amendment / Replacement Relational Enforcement:** Nếu văn bản mới là văn bản sửa đổi, bổ sung (`amends_document != null`) hoặc thay thế (`replaces_document != null`), bộ kiểm tra phải xác minh số hiệu văn bản bị sửa đổi/thay thế có tồn tại hợp lệ trong DB hoặc trong cùng batch nạp hay không. Nếu không tìm thấy, hệ thống ghi nhận cảnh báo `Orphan Reference Warning`.
4. 🛡️ **Zero Auto-Overwrite Policy:** Khi phát hiện trùng lặp (`Duplicate Record Identified`), trình parse **tuyệt đối không tự động ghi đè (`No Auto-Overwrite / No Auto-Upsert`)** lên dữ liệu đang active trên production. Toàn bộ các ca trùng lặp được gom vào danh sách `Duplicate Records` trong Báo cáo Dry-Run để Quản trị viên (`ADMIN`) quyết định xử lý thủ công.

---

## 5. Local Regulation Rules

Quy chuẩn rà soát an toàn dành riêng cho các quy định, quyết định hạn mức và kế hoạch sử dụng đất địa phương (`Local Regulation & Land Use Plan Rules`):
1. 📍 **Mandatory `local_scope` Specification:** Mọi văn bản quy phạm do HĐND/UBND cấp tỉnh hoặc sở ngành địa phương ban hành bắt buộc phải gán `local_scope = Local` và khai báo chi tiết địa bàn áp dụng tại trường `local_applicability` (`Tỉnh X`, `Huyện A`, `Thành phố B`).
2. 📍 **Planning / Land Use Plan Granularity:** Đối với các văn bản thuộc loại hình `Plan` hoặc có chủ đề `Land Use Planning` (Quy hoạch/Kế hoạch sử dụng đất), bắt buộc phải điền đầy đủ trường `planning_land_use_relevance` ghi rõ thời kỳ quy hoạch (`2021-2030` hoặc kế hoạch hàng năm) và quy mô cấp huyện/tỉnh áp dụng.
3. 📍 **Cross-Territorial Isolation:** Trợ lý AI Khối 3.1 và bộ tra cứu thụ lý được thiết lập ranh giới địa bàn (`Territorial Boundary Guard`). Không cho phép sử dụng dữ liệu địa phương của Tỉnh X / Huyện A cho hồ sơ xin cấp phép tại Tỉnh Y / Huyện B nếu chưa có sự xác nhận bằng tay của chuyên viên.
4. 📍 **Mandatory Officer Reverification Warning:** Mọi bản ghi quy định hạn mức tách thửa hoặc chuyển mục đích sử dụng đất địa phương sau nạp đều phải tự động đính kèm lời nhắc cố định trên UI Khối 1 & Khối 2: *"Quy định địa phương thường xuyên có điều khoản chuyển tiếp phức tạp theo từng thời kỳ; Cán bộ thụ lý bắt buộc phải đối chiếu bản đồ quy hoạch thực tế trên E-Office trước khi ký duyệt"*.

---

## 6. Error Handling

Ma trận 14 tình huống phân loại lỗi, mức độ nghiêm trọng và hành vi xử lý của trình nạp (`14-Case Error Handling & Import Behavior Matrix`):

| Error Code | Error Type (`Violation Category`) | Example Scenario | Severity | Import Behavior (`Engine Action`) | Notes & Corrective Guidance |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **VAL-01** | **Missing Mandatory Field** | Trường `document_number` hoặc `summary` bị bỏ trống hoàn toàn. | `CRITICAL` | **Reject row** | Loại bỏ dòng khỏi lô nạp. Yêu cầu chuyên viên bổ sung thông tin thiếu. |
| **VAL-02** | **Invalid ISO Date Format** | Trường `effective_date` ghi `25/12/2026` hoặc `2026-13-40` thay vì chuẩn `YYYY-MM-DD`. | `CRITICAL` | **Reject row** | Ngăn chặn lỗi parse date trên cơ sở dữ liệu Postgres. |
| **VAL-03** | **Unapproved Approval Status** | Trường `approval_status` mang giá trị `Draft`, `Pending Review` hoặc `Rejected`. | `CRITICAL` | **Reject row** | Tuân thủ tuyệt đối quy định: chỉ văn bản đã `Approved` mới được import. |
| **VAL-04** | **Invalid Document Type Enum** | Trường `document_type` ghi `Thông tư hướng dẫn` thay vì Enum chuẩn `Circular`. | `CRITICAL` | **Reject row** | Yêu cầu chuẩn hóa giá trị về đúng 9 loại Enum quy định tại Phase 11C. |
| **VAL-05** | **Duplicate Source ID** | `source_id = LOC-LAND-001` xuất hiện 2 lần trong CSV hoặc đã có trong DB. | `CRITICAL` | **Reject row / Hold file** | Chuyển bản ghi sang danh sách Duplicate để Quản trị viên kiểm tra. |
| **VAL-06** | **Duplicate Document Number** | Cặp `(102/2024/NĐ-CP + Chính phủ)` trùng khớp với bản ghi đang active trên DB. | `CRITICAL` | **Reject row** | Ngăn chặn ghi đè sai quy tắc hoặc vi phạm Unique Index DB. |
| **VAL-07** | **Effective Date > Expiry Date** | `effective_date = 2026-06-01` nhưng `expiry_date = 2026-01-01` (Ngày hết hiệu lực trước ngày ban hành). | `CRITICAL` | **Reject row** | Lỗi logic thời gian nghiêm trọng, không thể tính toán hiệu lực. |
| **VAL-08** | **Expired / Superseded Ingestion** | Nạp văn bản mang `legal_status = Expired` vào luồng tra cứu active của hệ thống. | `HIGH` | **Warning only / Hold** | Cho phép nạp với cờ cảnh báo lưu trữ lịch sử, không kích hoạt live. |
| **VAL-09** | **Missing Local Applicability** | `local_scope = Local` nhưng để trống trường địa bàn áp dụng `local_applicability`. | `HIGH` | **Reject row** | Bắt buộc xác định rõ văn bản áp dụng tại tỉnh/huyện nào. |
| **VAL-10** | **Missing Risk Note for Land TTHC** | Nhóm thủ tục `Land` (`TTHC-LAND-05` tách thửa) nhưng bỏ trống lời nhắc `risk_note`. | `HIGH` | **Reject row / Needs review** | Bắt buộc ghi nhận điều khoản rủi ro nghiệp vụ cho chuyên viên thụ lý. |
| **VAL-11** | **Orphan Reference Document** | Trường `amends_document = 99/2020/NĐ-CP` nhưng văn bản 99 chưa từng có trong DB/batch. | `MEDIUM` | **Warning only** | Cho phép nạp dòng nhưng đính kèm cảnh báo tham chiếu thiếu gốc (`Orphan`). |
| **VAL-12** | **Invalid Procedure Reference** | `related_procedure = TTHC-UNKNOWN-99` không khớp danh mục thủ tục trong `AdministrativeProcedure`. | `MEDIUM` | **Warning only** | Cho phép nạp văn bản luật nhưng cảnh báo mã thủ tục không liên kết được. |
| **VAL-13** | **Summary Text Too Short / Generic** | Trường `summary` chỉ ghi `"Luật đất đai mới"` (dưới 20 ký tự). | `MEDIUM` | **Warning / Needs review** | Cảnh báo tóm tắt quá sơ sài, AI Khối 3.1 sẽ thiếu ngữ cảnh để phân tích. |
| **VAL-14** | **Missing Full Text & Source URL** | Cả `source_url` lẫn `full_text_location` đều bị bỏ trống. | `CRITICAL` | **Reject row** | Bắt buộc phải có đường dẫn file PDF gốc hoặc URL công báo để cán bộ kiểm chứng. |

---

## 7. Validation Output

Đặc tả cấu trúc dữ liệu trả về chuẩn hóa của trình kiểm tra hợp lệ (`Standardized Validation Report JSON / Markdown Output Structure`):

```json
{
  "validationSummary": {
    "reportId": "VAL-REP-20260711-001",
    "validationTimestamp": "2026-07-11T14:30:00Z",
    "batchFileName": "LEGALFLOW_V2_PHASE11F_PROPOSED_BATCH.csv",
    "totalRecordsProcessed": 50,
    "validRecordsCount": 42,
    "warningRecordsCount": 5,
    "rejectedRecordsCount": 3,
    "duplicateRecordsCount": 2,
    "recordsNeedingReviewCount": 5,
    "overallValidationState": "PASS_WITH_WARNINGS",
    "auditedBy": "nguyenvana.legal",
    "role": "ADMIN",
    "noImportConfirmation": "DRY_RUN_ONLY_ZERO_DB_WRITES_CONFIRMED"
  },
  "itemizedResults": {
    "validRecords": [
      { "rowNumber": 2, "sourceId": "LOC-LAND-101", "docNumber": "15/2026/QĐ-UBND", "status": "Ready for Staging" }
    ],
    "warningRecords": [
      { "rowNumber": 15, "sourceId": "LOC-LAND-114", "docNumber": "10/2025/QĐ-UBND", "warningCode": "VAL-11", "message": "Orphan reference to amends_document 05/2020/QĐ-UBND not found in DB." }
    ],
    "rejectedRecords": [
      { "rowNumber": 28, "sourceId": "LOC-LAND-127", "docNumber": "22/2026/QĐ-UBND", "errorCode": "VAL-03", "message": "approval_status is 'Pending Review'. Only 'Approved' records are allowed." }
    ],
    "duplicateRecords": [
      { "rowNumber": 40, "sourceId": "LOC-LAND-139", "docNumber": "31/2024/QH15", "errorCode": "VAL-06", "message": "Document number already exists and is active in DB (id: seed-legal-doc-land-2024)." }
    ]
  },
  "safetySignOff": {
    "preImportBackupRequired": true,
    "autoActivationBlocked": true,
    "humanReviewMandatory": true
  }
}
```

* **`total records`:** Tổng số dòng bản ghi được quét trong file CSV.
* **`valid records`:** Số lượng bản ghi hợp lệ 100%, sẵn sàng nạp vào vùng Staging.
* **`warning records`:** Số lượng bản ghi hợp lệ nhưng đi kèm cảnh báo (`Orphan reference`, `Short summary`...).
* **`rejected records`:** Số lượng dòng vi phạm lỗi `CRITICAL` bị từ chối tuyệt đối khỏi lô nạp.
* **`duplicate records`:** Số lượng dòng trùng lặp mã hiệu hoặc số hiệu văn bản với DB.
* **`records needing review`:** Số dòng cần Quản trị viên/Lãnh đạo xem xét thêm trước khi quyết định nạp.
* **`validation timestamp` & `reviewer`:** Mốc thời gian rà soát và tài khoản thực hiện xác thực.
* **`no-import confirmation`:** Khẳng định minh bạch báo cáo được tạo trong chế độ `Dry-Run`, hoàn toàn `0 DB writes`.

---
*Đặc tả Bộ Quy tắc Kiểm tra & Xác thực Hợp lệ Dữ liệu Nạp (Import Validation Rules Spec) được lập tự động từ kết quả Phase 11F.*
