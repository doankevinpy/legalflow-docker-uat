# LEGALFLOW V2 - PHASE 11H
# BACKEND IMPORT VALIDATION API REPORT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.11.6-legal-knowledge-import-tool-implementation-planning` -> `Phase 11H Standard`  
**Ngày hoàn tất Báo cáo:** 11/07/2026  
**Trạng thái Báo cáo:** **`OFFICIAL PHASE 11G/11H BACKEND VALIDATION API REPORT`** *(Báo cáo Kỹ thuật Triển khai API Kiểm định Nạp Tri thức Pháp lý ở chế độ Dry-Run)*

---

## 1. Purpose

Tài liệu này ghi nhận kết quả triển khai backend API validate CSV Khối dữ liệu Tri thức Pháp lý (`Legal Knowledge`) ở chế độ chạy kiểm thử giả lập (`dry-run`) thuộc Giai đoạn **Phase 11H: Backend Import Validation API Implementation**. API này đảm trách nhiệm vụ phân tích cú pháp (`CSV parsing`), kiểm tra tính hợp lệ toàn diện theo 16 tiêu chí quy phạm, phát hiện lỗi cú pháp, trùng lặp và rủi ro pháp lý, trả về báo cáo kiểm định rõ ràng (`validation report`) mà **hoàn toàn không ghi database (`Zero DB Writes`)**, không import dữ liệu và không tự động kích hoạt phiên bản (`No Active Version`).

---

## 2. Baseline

* **Previous tag:** `v2.11.6-legal-knowledge-import-tool-implementation-planning`  
* **Proposed tag:** `v2.11.7-backend-import-validation-api`  
* **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`  
* **Trạng thái làm việc ban đầu:** Working tree clean trên nhánh `main` trước khi thực hiện thi công.

---

## 3. Backend Changes

Toàn bộ các thay đổi kỹ thuật trên Backend được kiểm soát chặt chẽ trong phạm vi 3 file (`legal-knowledge.service.ts`, `legal-knowledge.controller.ts` và bộ test tương ứng), không chạm đến bất kỳ module hay cấu trúc dữ liệu nào khác:

| File | Change Type | Description | Safety Impact | Notes |
| :--- | :---: | :--- | :--- | :--- |
| `src/legal-knowledge/legal-knowledge.service.ts` | **MODIFY** | Bổ sung hàm tiện ích `parseCsvLines(csvText)` chuẩn RFC 4180 và hàm nghiệp vụ cốt lõi `validateCsvImport(csvText, dryRun)` tại cuối lớp `LegalKnowledgeService`. | **Zero DB Writes:** Chỉ thực hiện thao tác tính toán bộ nhớ (`in-memory`) và gọi `findFirst` (read-only) để kiểm tra trùng lặp `documentCode`. Không có bất kỳ lệnh mutation nào (`create/update/delete`). | Xử lý trọn vẹn chuỗi CSV chứa nháy kép `""`, xuống dòng `\r\n` trong cell và xuất ra cấu trúc `summary`, `records`, `errors`, `warnings`. |
| `src/legal-knowledge/legal-knowledge.controller.ts` | **MODIFY** | Đăng ký endpoint `POST import/validate` tại `LegalKnowledgeController`. Gắn decorator `@Roles(Role.ADMIN, Role.MANAGER)` để kiểm soát quyền. | **RBAC Secured:** Chỉ cho phép tài khoản quản trị viên (`ADMIN`) và quản lý nghiệp vụ (`MANAGER`) truy cập endpoint kiểm định. Phối hợp cùng `JwtAuthGuard` hiện hữu. | Đặt ngay sau `constructor` để đảm bảo không xung đột routing với `@Get('documents/:id')`. |
| `src/legal-knowledge/legal-knowledge.service.spec.ts` | **MODIFY** | Bổ sung `mockPrismaService.legalDocument.findFirst / create / update` và suite `describe('Phase 11H: validateCsvImport (Dry-Run Validation)')` gồm 8 unit tests chuyên sâu. | **Quality Assurance:** Kiểm chứng 100% các tình huống lỗi bắt buộc (`VAL-01 -> VAL-14`) và chứng minh `legalDocument.create/update` hay `$transaction` không bao giờ bị gọi. | Đạt 100% test pass (`138 tests passed across 11 test suites`). |
| `src/legal-knowledge/legal-knowledge.controller.spec.ts` | **MODIFY** | Cập nhật `mockService` với `validateCsvImport: jest.fn()`, kiểm chứng RBAC metadata và kiểm thử ủy quyền endpoint controller (`validateCsvImport should call service...`). | **Test Coverage:** Đảm bảo controller định tuyến đúng tham số `dryRun` và thi hành nghiêm ngặt phân quyền RBAC. | Đạt 100% test pass. |

---

## 4. API Implemented

* **Endpoint:**  
  `POST /legal-knowledge/import/validate`
* **HTTP Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`  
  `Content-Type: application/json`
* **Request Body:**  
  ```json
  {
    "csvText": "source_id,document_title,document_number,issuing_authority,document_type,issue_date,effective_date,legal_status,local_scope,legal_topic,summary,source_url,reviewer,approval_status,risk_note,active_candidate\nSAMPLE-001,Luật Đất đai sample,43/2024/QH15,Quốc hội,Law,2024-01-18,2024-08-01,Effective,National,Land Use Planning,Summary of land law,http://example.com/law,Admin,Approved,Low risk,false",
    "dryRun": true
  }
  ```
* **Response Shape (`Validation Report`):**  
  ```json
  {
    "dryRun": true,
    "noDatabaseWrite": true,
    "summary": {
      "totalRecords": 1,
      "validRecords": 1,
      "warningRecords": 1,
      "rejectedRecords": 0,
      "duplicateRecords": 0
    },
    "records": [
      {
        "rowNumber": 2,
        "sourceId": "SAMPLE-001",
        "status": "VALID_WITH_WARNINGS",
        "errors": [],
        "warnings": [
          "Sample dataset only. Not approved for real import."
        ]
      }
    ],
    "errors": [],
    "warnings": [
      "Validation only. No database write performed.",
      "Import does not mean active version.",
      "AI does not automatically determine if legal documents are the latest or complete. Human officers must verify legal grounds."
    ]
  }
  ```
* **Dry-Run Behavior:** API luôn mặc định hoạt động ở chế độ giả lập (`dryRun = true`). Ngay cả khi tham số `dryRun` được truyền `false` trong giai đoạn Phase 11H, API vẫn giữ nguyên trạng thái không thực thi bất kỳ thao tác ghi DB nào, chờ Phase 11I (`Execute API`) triển khai logic thực thi tách biệt.
* **No Database Write Confirmation:** Trong suốt tiến trình gọi `validateCsvImport`, hệ thống chỉ truy vấn chỉ mục tĩnh (`SELECT id, documentCode FROM "LegalDocument" WHERE documentCode = $1`) để rà soát trùng lặp mã căn cứ. Cờ `noDatabaseWrite: true` luôn được đóng dấu trong JSON trả về.

---

## 5. Validation Rules Implemented

Động cơ kiểm định (`Validation Engine`) Phase 11H thực thi nghiêm ngặt các quy tắc sau trên từng bản ghi CSV:
1. **Header Validation (`VAL-01`, `VAL-14`):** Rà soát đủ 14 cột bắt buộc (`source_id`, `document_title`, `document_number`, `issuing_authority`, `document_type`, `issue_date`, `effective_date`, `legal_status`, `local_scope`, `legal_topic`, `summary`, `reviewer`, `approval_status`, `risk_note`) kèm ít nhất một trong hai trường định vị nguồn (`source_url` hoặc `full_text_location`). Trả về `errors` toàn cục nếu header bị thiếu.
2. **Required Fields Check (`VAL-01`):** Kiểm tra tính đầy đủ của tất cả các trường dữ liệu bắt buộc trên từng dòng. Nếu trường trống (`""`), tự động gán mã lỗi `VAL-01` và chuyển trạng thái bản ghi thành `REJECTED`.
3. **Duplicate `source_id` Check (`VAL-05`):**
   * *Trùng lặp nội bộ:* Kiểm tra mã `source_id` có bị trùng lặp ngay bên trong tập tin CSV hay không thông qua bộ nhớ `seenSourceIds`.
   * *Trùng lặp DB:* Thực hiện truy vấn read-only vào bảng `LegalDocument` theo cột `documentCode`. Nếu tồn tại, gán lỗi `VAL-05: Duplicate source_id ... already exists in active database` và đổi trạng thái sang `DUPLICATE`.
4. **Date Format Verification (`VAL-02`):** Kiểm định trường `effective_date` (và `issue_date` nếu có) phải chuẩn định dạng ngày tháng hợp lệ (`YYYY-MM-DD` / ISO format).
5. **Approval Status Check (`VAL-03`):** Căn cứ theo quy định *“Import thật chỉ được xem xét khi approval_status = Approved”*, hệ thống kiểm tra trường `approval_status`. Nếu khác `"Approved"` (ví dụ: `"Pending Review"`, `"Draft"`, `"Rejected"`), hệ thống gán lỗi `VAL-03` ngăn chặn import thật trong tương lai.
6. **Legal Status Enforcement (`VAL-08`):** Căn cứ quy định *“legal_status không được là Unknown / Needs Review nếu đánh dấu sẵn sàng import”*, hệ thống từ chối (`REJECTED`) các bản ghi có trạng thái pháp lý mập mờ (`Unknown`, `Needs Review`, `Draft`).
7. **Mandatory `local_scope` for Planning/Local Documents (`VAL-09`):** Nếu văn bản thuộc thể loại Quy hoạch/Kế hoạch (`document_type = Plan`, `local_scope = Local` hoặc `legal_topic` chứa từ khóa `planning`, `land use`, `quy hoạch`), trường `local_scope` bắt buộc phải có thông tin phạm vi áp dụng. Nếu trống, báo lỗi `VAL-09` ngay lập tức.
8. **Mandatory `risk_note` Check (`VAL-10`):** Trường `risk_note` bắt buộc phải có nội dung đánh giá rủi ro áp dụng. Nếu thiếu, từ chối bản ghi.
9. **Active Candidate Warning (`Rule 12 & 13`):** Nếu cờ `active_candidate` trong CSV được đặt bằng `true`, hệ thống tự động gắn lời nhắc cảnh báo mức độ cao vào `warnings` của dòng: `"Active candidate requires separate human approval and must not auto-activate."`
10. **Sample-Only & Non-Sample Verification (`Rule 14`):**
    * Nếu `source_id` bắt đầu bằng tiền tố `SAMPLE` (`SAMPLE-xxx`), gắn cảnh báo: `"Sample dataset only. Not approved for real import."`
    * Nếu `source_id` **không** có tiền tố `SAMPLE`, hệ thống lập tức gắn cảnh báo quản trị mạnh mẽ: `"Warning: Non-SAMPLE prefix detected. Real legal documents must undergo strict human verification and approval before production import."`
11. **Global AI & Completeness Disclaimer (`Rule 15 & 19`):** Trong khối `warnings` tổng của báo cáo luôn đính kèm lời nhắc cố định: `"AI does not automatically determine if legal documents are the latest or complete. Human officers must verify legal grounds."`

---

## 6. Permission / Guard Notes

* **Guards đã áp dụng:** Endpoint `@Post('import/validate')` được bảo vệ hai lớp bởi `JwtAuthGuard` (kiểm tra tính hợp lệ của token JWT người dùng) và `RolesGuard` (phân quyền vai trò).
* **Role được phép:** Chỉ các tài khoản mang vai trò `Role.ADMIN` (Quản trị viên) hoặc `Role.MANAGER` (Lãnh đạo Phòng/Quản lý nghiệp vụ) mới được phép gọi API kiểm định.
* **Hạn chế còn lại / Kế hoạch tiếp theo:** Các vai trò `STAFF` (Chuyên viên) và `VIEWER` (Khách xem) bị chặn truy cập (`Forbidden 403`). Giao diện người dùng (`FE ImportStudio`) sẽ được liên kết với API này tại Phase 11J, trong khi API nạp dữ liệu thực (`Execute API`) sẽ được thiết lập tại Phase 11I với cùng mức phân quyền `ADMIN/MANAGER`.

---

## 7. Test Results

Tất cả 8 kịch bản kiểm thử bắt buộc theo yêu cầu Phase 11H đã được bổ sung vào bộ kiểm thử tự động `legal-knowledge.service.spec.ts` và chạy thành công 100%:

| Test | Result | Notes |
| :--- | :---: | :--- |
| **Test 1: Valid sample CSV returns `dryRun: true`** | **PASS** | Kiểm chứng CSV mẫu chuẩn trả về `dryRun: true`, `noDatabaseWrite: true`, `validRecords: 1`, `rejectedRecords: 0` kèm cảnh báo Sample-only. |
| **Test 2: Missing required field returns errors** | **PASS** | Kiểm chứng dòng CSV bị thiếu `document_title`, `document_number`, `issuing_authority` hoặc sai định dạng ngày bị từ chối (`status: REJECTED`, `VAL-01`, `VAL-02`). |
| **Test 3: Duplicate `source_id` returns duplicate warning/error** | **PASS** | Kiểm chứng 2 dòng có cùng `source_id` bên trong CSV khiến dòng thứ hai bị gán `status: DUPLICATE` và lỗi `VAL-05`. |
| **Test 4: Invalid `approval_status` returns error** | **PASS** | Kiểm chứng bản ghi có `approval_status = "Pending Review"` bị từ chối với mã lỗi `VAL-03` ngăn chặn import vào hệ thống. |
| **Test 5: Unknown `legal_status` returns warning/error** | **PASS** | Kiểm chứng bản ghi có `legal_status = "Unknown"` bị gán mã lỗi `VAL-08` (`REJECTED`) do tình trạng pháp lý không rõ ràng. |
| **Test 6: Missing `local_scope` for planning returns error** | **PASS** | Kiểm chứng văn bản có `document_type = "Plan"` nhưng trống `local_scope` lập tức bị báo lỗi `VAL-09` (`REJECTED`). |
| **Test 7: `active_candidate = true` returns strong warning** | **PASS** | Kiểm chứng bản ghi có cờ `active_candidate = true` tự động gắn lời nhắc cảnh báo `"Active candidate requires separate human approval and must not auto-activate."` |
| **Test 8: Validate endpoint does zero database write** | **PASS** | Kiểm chứng `mockPrismaService.legalDocument.create`, `update`, `upsert` và `$transaction` hoàn toàn không bị gọi (`not.toHaveBeenCalled()`) khi chạy validate. |

*Tổng thể kiểm thử toàn hệ thống Backend:* **`138 passed across 11 test suites`** (`0 failed`).

---

## 8. Safety Confirmation

Tôi xác nhận và cam kết tuân thủ tuyệt đối **20 Quy định An toàn Bất khả xâm phạm (`20 Inviolable Safety & Governance Mandates`)** trong Phase 11H:
1. ✅ **Chỉ sửa backend và docs cần thiết (`Backend & Docs Only`):** Các thay đổi code chỉ giới hạn trong module `src/legal-knowledge/` của `legalflow-backend` và tài liệu trong `docs/`.
2. ✅ **Không sửa frontend (`Zero Frontend Alteration`):** Mã nguồn thư mục `legalflow-frontend` được giữ nguyên vẹn 100%.
3. ✅ **Không sửa Prisma schema (`Zero Schema Modification`):** Cấu trúc `prisma/schema.prisma` được giữ nguyên trạng (`0 modifications`).
4. ✅ **Không tạo migration (`Zero Migration Creation`):** Không sinh bất kỳ file `.sql` migration nào mới trong Phase 11H.
5. ✅ **Không chỉnh `.env` (`Zero Environment Tampering`):** Các file biến môi trường giữ nguyên trạng.
6. ✅ **Không reset database (`Zero DB Reset`):** Không thực thi `prisma migrate reset` hay lệnh xóa bảng.
7. ✅ **Không restore database (`Zero DB Restore`):** Không thi hành `pg_restore` hay khôi phục bản lưu trữ cũ.
8. ✅ **Không seed (`Zero DB Seeding`):** Không gọi lệnh `prisma db seed` hay can thiệp dữ liệu khởi tạo.
9. ✅ **Không import dữ liệu vào database (`Zero Real Data Ingestion`):** Khẳng định API Phase 11H chỉ phân tích giả lập (`Dry-Run Validation Only`), không chèn dữ liệu thật vào DB.
10. ✅ **Không gọi Prisma create/update/upsert/delete (`Zero Mutation Calls`):** API kiểm định không thi hành bất kỳ câu lệnh mutation nào đối với dữ liệu Tri thức Pháp lý.
11. ✅ **Không active version pháp lý (`Zero Version Activation`):** Không thay đổi cờ `status` hay tự động kích hoạt bất kỳ phiên bản luật nào.
12. ✅ **Không rollback version pháp lý (`Zero Unauthorized Rollback`):** Không quay lui hay bãi bỏ các phiên bản hiện đang có hiệu lực.
13. ✅ **Không dùng văn bản pháp luật thật nếu chưa được phê duyệt (`No Unapproved Real Docs`):** Chỉ dùng bộ dữ liệu mẫu có kiểm soát để kiểm nghiệm thuật toán.
14. ✅ **Chỉ dùng sample dataset có tiền tố `SAMPLE` khi test (`SAMPLE Prefix Mandatory`):** Toàn bộ unit tests chỉ sử dụng các mã định danh `SAMPLE-001 -> SAMPLE-008`.
15. ✅ **Không ghi password/token/secret (`Zero Secret Exposure`):** Không lưu trữ thông tin nhạy cảm hay hardcode secret vào mã nguồn.
16. ✅ **Không commit/tag thay người dùng (`No Unauthorized Git Action`):** Tôi chưa thực hiện lệnh commit hay tạo Git tag.
17. ✅ **Không đưa backup vào Git (`No Backup Files in Repo`):** Không có file dump hay file sao lưu tạm thời nào trong repository.
18. ✅ **Không để AI tự kết luận văn bản pháp luật là mới nhất/đầy đủ (`No AI Completeness Claim`):** Hệ thống luôn đính kèm lời nhắc từ chối trách nhiệm AI trong mọi báo cáo kiểm định.
19. ✅ **AI vẫn chỉ là gợi ý; cán bộ phải kiểm tra căn cứ pháp lý (`Human Supremacy & Mandatory Verification`):** Khẳng định vai trò quyết định tối cao và trách nhiệm kiểm tra thẩm định căn cứ pháp lý thuộc về Chuyên viên Một cửa và Lãnh đạo Phòng thủ tục hành chính.

---

## 9. Next Recommended Phase

Sau khi nghiệm thu thành công API Kiểm định (`Validation API - Phase 11H`) với độ tin cậy và an toàn tuyệt đối, bước thi công tiếp theo được đề xuất là:

&rarr; **`Phase 11I: Backend Import Execute + Audit Planning/Implementation`**  
*(Triển khai API `POST /legal-knowledge/import/execute` cho phép nạp chính thức các bản ghi đã đạt kiểm tra hợp lệ vào cơ sở dữ liệu ở trạng thái `DRAFT / PENDING_REVIEW`, đồng thời tự động khởi tạo nhật ký kiểm tra (`LegalUpdateLog`) ghi nhận đầy đủ dấu vết tác giả, lý do và phạm vi ảnh hưởng, tuân thủ nguyên tắc "Import không tự động kích hoạt active version")*.

---
*Báo cáo được lập tự động từ kết quả thi công thực tế Phase 11H: Backend Import Validation API Implementation.*
