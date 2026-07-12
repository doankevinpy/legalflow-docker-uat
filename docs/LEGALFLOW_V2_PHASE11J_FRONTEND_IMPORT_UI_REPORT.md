# LEGALFLOW V2 - PHASE 11J
# FRONTEND IMPORT UI REPORT

**Mã phiên bản đề xuất (Proposed Tag):** `v2.11.9-frontend-legal-knowledge-import-ui`  
**Phiên bản kế thừa (Previous Tag):** `v2.11.8-backend-import-execute-audit-safety`  
**Thư mục gốc (Root Path):** `C:\Users\Admin\legalflow-docker-uat`  
**Ngày hoàn thành:** 12/07/2026  

---

## 1. Purpose

Báo cáo này ghi nhận chi tiết kết quả triển khai giao diện người dùng (Frontend UI) cho tính năng **Legal Knowledge Import** trong module Tri thức Pháp lý (`LegalKnowledgePage.tsx`). Phục vụ các quy trình kiểm thử và vận hành an toàn từ giai đoạn nhập liệu CSV, rà soát trước (Dry-Run Validation), thẩm định báo cáo kiểm tra đến thực thi nạp tri thức có kiểm soát (Controlled Execute).

Giao diện được thiết kế tuân thủ tuyệt đối **18 yêu cầu bất di bất dịch (Absolute Constraints)** và nguyên tắc quản trị **Human-in-the-Loop**, đảm bảo AI và công cụ tự động chỉ đóng vai trò tham mưu sơ bộ, cán bộ nghiệp vụ và lãnh đạo phải chịu trách nhiệm kiểm tra căn cứ pháp lý thực tế trước khi áp dụng.

---

## 2. Baseline

| Thông số | Giá trị |
| :--- | :--- |
| **Previous Tag** | `v2.11.8-backend-import-execute-audit-safety` |
| **Proposed Tag** | `v2.11.9-frontend-legal-knowledge-import-ui` |
| **Root Path** | `C:\Users\Admin\legalflow-docker-uat` |
| **Backend Environment** | Giữ nguyên 100% từ Phase 11I (`zero modifications to backend code, Prisma schema, migrations, and .env`) |

---

## 3. Frontend Changes

| File Path | Change Type | Description | Safety Impact | Notes |
| :--- | :---: | :--- | :--- | :--- |
| `src/lib/legalKnowledgeApi.ts` | **MODIFY** | Bổ sung 2 phương thức API client: `validateCsvImport` (`POST /legal-knowledge/import/validate`) và `executeCsvImport` (`POST /legal-knowledge/import/execute`). | **SAFE** | Kết nối trực tiếp vào các endpoint đã được kiểm chứng ở Phase 11H/I, không can thiệp logic backend. |
| `src/components/legal-knowledge/LegalKnowledgeImportTab.tsx` | **NEW** | Tạo mới component độc lập cho khu vực Nhập dữ liệu CSV (`Import Studio`), tích hợp đủ 8 phần UI theo yêu cầu chuẩn hóa. | **SAFE** | Đóng gói toàn bộ logic upload, dry-run validate, bảng báo cáo lỗi/cảnh báo, và form thực thi an toàn. |
| `src/pages/LegalKnowledgePage.tsx` | **MODIFY** | Cập nhật `TabType` thêm `'import'`, bổ sung nút chuyển tab `Nhập dữ liệu CSV (Import)` trên thanh điều hướng (chỉ hiển thị cho `ADMIN, MANAGER, STAFF`), và render `LegalKnowledgeImportTab`. | **SAFE** | Không làm ảnh hưởng đến 7 tab hiện hữu và các cảnh báo AI Governance/Legal Snapshot. |
| `docs/LEGALFLOW_V2_PHASE11J_FRONTEND_IMPORT_UI_REPORT.md` | **NEW** | Tài liệu tổng kết chi tiết Phase 11J (Frontend Report). | **DOCS** | Minh bạch hóa toàn bộ thay đổi và quy trình bảo vệ. |
| `docs/LEGALFLOW_V2_PHASE11J_FRONTEND_IMPORT_UI_COMPLETION.md` | **NEW** | Tài liệu xác nhận hoàn thành Phase 11J (Completion Confirmation). | **DOCS** | Xác nhận không vi phạm ràng buộc kỹ thuật. |

---

## 4. UI Implemented

Giao diện `LegalKnowledgeImportTab.tsx` triển khai đầy đủ 8 khu vực nghiệp vụ và bảo vệ:

1. **Import Safety Banner:**
   - Cụm banner nổi bật với tiêu đề `CẢNH BÁO AN TOÀN TRƯỚC KHI NẠP DỮ LIỆU PHÁP LÝ (IMPORT GOVERNANCE)`.
   - Hiển thị đầy đủ 5 nguyên tắc chỉ đạo:
     1. *IMPORT KHÔNG ĐỒNG NGHĨA VỚI ACTIVE VERSION.*
     2. *AI KHÔNG TỰ XÁC ĐỊNH VĂN BẢN MỚI NHẤT / ĐẦY ĐỦ.*
     3. *CẦN BACKUP TRƯỚC KHI IMPORT THẬT.*
     4. *KHÔNG DÙNG DỮ LIỆU CHƯA DUYỆT CHO HỒ SƠ CHÍNH THỨC.*
     5. *CÁN BỘ PHẢI ĐỐI CHIẾU CĂN CỨ PHÁP LÝ THỰC TẾ.*

2. **CSV Input / Upload Area:**
   - Hỗ trợ tải lên file `.csv` thông qua `FileReader` (`readAsText` với bộ mã hóa `UTF-8`).
   - Khung `textarea` cho phép dán trực tiếp hoặc chỉnh sửa nội dung CSV.
   - Nút `Tải mẫu CSV (SAMPLE)` cung cấp ngay bộ dữ liệu mẫu chuẩn hóa với tiền tố `SAMPLE-` (`SAMPLE-LAW-2024-01`, `SAMPLE-ND-2024-102`, `SAMPLE-LOCAL-QD-01`...) để kiểm thử UI mà không cần dùng văn bản thật chưa phê duyệt.
   - Nút `Xóa làm lại (Reset)` giúp dọn dẹp nhanh khu vực nhập và trạng thái kết quả.
   - **Bảo đảm an toàn:** Tuyệt đối không tự động chạy `validate` hay `execute` khi mở trang hoặc tải file.

3. **Validate Button (`Validate CSV - Dry Run`):**
   - Nút gọi kiểm tra trước không ghi DB (`dryRun: true`).
   - Hiển thị loading spinner (`Đang rà soát Dry-Run...`) trong lúc chờ phản hồi.
   - Xử lý và hiển thị thông báo lỗi rõ ràng nếu CSV trống hoặc máy chủ trả về lỗi phân tích.

4. **Validation Result Summary & Record-Level Table:**
   - Thẻ thống kê trực quan: `Tổng số dòng (totalRecords)`, `Hợp lệ (validRecords)`, `Cảnh báo (warningRecords)`, `Bị từ chối (rejectedRecords)`, và `Trùng lặp (duplicateRecords)`.
   - Huy hiệu `Dry-Run: TRUE` và `No DB Write: TRUE`.
   - Danh sách cảnh báo tổng thể (`errors`, `warnings`) từ hệ thống theo 14 quy tắc `VAL-01` &rarr; `VAL-14`.
   - **Bảng chi tiết từng dòng (`records`):** Hiển thị `Row Number`, `Source ID`, `Status` (VALID/WARNING/REJECTED/DUPLICATE) cùng danh sách lỗi và cảnh báo cụ thể của từng bản ghi, giúp cán bộ dễ dàng định vị lỗi để sửa trong CSV.

5. **Execute Import Safety Section (Controlled Execute):**
   - Chỉ xuất hiện khi đã có kết quả rà soát từ nút `Validate CSV - Dry Run`.
   - **Tự động vô hiệu hóa / Khóa thực thi (`Execution Blocked`):** Nếu `rejectedRecords > 0`, `duplicateRecords > 0`, hoặc `errors.length > 0`, phần thực thi bị ẩn/khóa và hiển thị thông báo yêu cầu sửa CSV trước.
   - **Cơ chế 3 lớp xác nhận bắt buộc trước khi thực thi:**
     - Checkbox: `Tôi xác nhận đã kiểm tra an toàn và đã thực hiện sao lưu dữ liệu (backup) trước khi thực thi nạp tri thức pháp lý.` (`backupConfirmed`).
     - Text input: `Lý do thực hiện nạp tri thức (Reason)` (`reason`).
     - Text input chính xác 100%: `I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION` (`confirmationText`).
   - Cảnh báo quy trình 2 bước: `Execute import vẫn không được tự active legal version (noAutoActive: true). Active version là bước riêng rẽ có kiểm soát.`

6. **Role-Based Visibility (RBAC Enforcement UI):**
   - **Tài khoản `VIEWER`:** Tab `Nhập dữ liệu CSV` ẩn hoàn toàn trên thanh điều hướng. Nếu truy cập trực tiếp component, hiển thị thẻ cảnh báo đỏ cấm truy cập (`Quyền hạn hạn chế`).
   - **Tài khoản `STAFF`:** Thấy và thao tác được khu vực `CSV Input` và `Validate CSV - Dry Run` để hỗ trợ rà soát, kiểm tra tệp CSV. Tuy nhiên khu vực `Execute Import Safety Section` hiển thị thông báo màu vàng: `Tài khoản STAFF chỉ được phép kiểm tra trước (Validate CSV - Dry Run). Chức năng Thực thi Import (Execute) chỉ dành cho Lãnh đạo (ADMIN / MANAGER).`
   - **Tài khoản `MANAGER` / `ADMIN`:** Có đầy đủ quyền hạn thao tác rà soát và thực thi theo quy trình 3 lớp xác nhận.

7. **Error / Empty States:**
   - Trang bị đủ 7 trạng thái rỗng và lỗi chuẩn: Khung CSV trống, lỗi parse CSV, lỗi API/Network, từ chối quyền truy cập `403 Forbidden`, cảnh báo nghiệp vụ, khóa thực thi do dữ liệu lỗi, và phản hồi thực thi thành công với cờ `noAutoActive: true`.

---

## 5. API Integration

### 5.1. Validate Endpoint
- **URL:** `POST /legal-knowledge/import/validate`
- **Request Body:**
  ```json
  {
    "csvText": "source_id,document_code,...",
    "dryRun": true
  }
  ```
- **Response Mapping:** Nhận về đối tượng `ValidationReport` gồm `totalRecords`, `validRecords`, `warningRecords`, `rejectedRecords`, `duplicateRecords`, `dryRun: true`, `noDatabaseWrite: true`, `errors`, `warnings`, và `records[]` để render lên UI.

### 5.2. Execute Endpoint
- **URL:** `POST /legal-knowledge/import/execute`
- **Request Body:**
  ```json
  {
    "csvText": "source_id,document_code,...",
    "dryRun": false,
    "reason": "Nạp bổ sung Luật Đất đai 2024...",
    "confirmationText": "I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION",
    "backupConfirmed": true
  }
  ```
- **Response Mapping:** Nhận về đối tượng phản hồi thực thi (đảm bảo `noAutoActive: true`, `auditRequired: true`, chi tiết `audit log`) hiển thị trong hộp thông báo `Execute Response Card`.

---

## 6. Safety Controls Verification

- [x] **Zero Auto-Validation on Load:** Không gọi API validate hoặc tự động phân tích khi mở trang.
- [x] **Zero Auto-Execution:** Không tự động thực thi dưới bất kỳ hình thức nào.
- [x] **Execution Prerequisites:** Nút Execute bị `disabled` tuyệt đối nếu thiếu bất kỳ điều kiện nào trong 3 điều kiện (chưa chọn checkbox backup, lý do rỗng, hoặc sai chuỗi xác nhận).
- [x] **No Auto-Active & No Rollback:** Đảm bảo hiển thị rõ cờ `noAutoActive: true` và nhắc nhở cán bộ phải kích hoạt riêng qua quy trình quản trị phiên bản hiện hữu.
- [x] **Backend RBAC Enforcement Authority:** Nhắc nhở rõ ràng trên UI rằng Frontend chỉ đóng vai trò rà soát; Backend vẫn là chốt chặn cuối cùng kiểm tra quyền hạn `@Roles(Role.ADMIN, Role.MANAGER)`.

---

## 7. Test / Build Results

| Check / Command | Environment | Result | Notes |
| :--- | :--- | :---: | :--- |
| `tsc -b && vite build` | Frontend (`C:\Users\Admin\legalflow-docker-uat`) | ✅ **PASS** | Hoàn thành trong `1.62s`. 0 lỗi TypeScript across all 3178 modules. Bundle `dist/` hợp lệ. |
| `npm test` | Backend (`legalflow-backend`) | ✅ **PASS** | `11 passed, 150 total tests across all 11 test suites`. Chứng minh zero regressions cho backend API. |
| `npm run build` (`nest build`) | Backend (`legalflow-backend`) | ✅ **PASS** | Build thành công 100%, không bị ảnh hưởng bởi thay đổi UI. |

---

## 8. Known Limitations

1. **Import Audit History UI:** Trong Phase 11J, phản hồi thực thi được hiển thị ngay sau khi thực hiện thành công. Việc xây dựng một trang hoặc bảng riêng để tra cứu lịch sử các lần import trước đó sẽ được thực hiện khi cấu trúc schema có bảng `ImportAuditLog` chuyên dụng trong phase tương lai.
2. **Real Legal Document Ingestion:** Quá trình kiểm thử và nghiệm thu UI trong phase này chỉ sử dụng bộ dữ liệu mẫu có tiền tố `SAMPLE-`. Việc nạp các văn bản pháp luật chính thức của tỉnh/thành phố sẽ do Lãnh đạo thẩm định và thực hiện trong phase triển khai nghiệp vụ chính thức.

---

## 9. Next Recommended Phase

**`Phase 11K: Import UI End-to-End Test & Release Candidate`**
- Thực hiện kiểm thử toàn trình (End-to-End Testing) trên môi trường UAT kết hợp cả Frontend UI và Backend API.
- Lập kịch bản kiểm thử cho các vai trò `VIEWER`, `STAFF`, `MANAGER`, và `ADMIN`.
- Đóng gói Release Candidate chuẩn bị cho việc đào tạo và nghiệm thu vận hành thực tế.
