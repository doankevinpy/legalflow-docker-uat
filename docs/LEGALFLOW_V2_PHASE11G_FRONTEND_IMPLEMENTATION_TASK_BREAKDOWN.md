# LEGALFLOW V2 - PHASE 11G
# FRONTEND IMPLEMENTATION TASK BREAKDOWN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11G Standard`  
**Ngày lập Phân rã:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL FRONTEND TASK BREAKDOWN`** *(Phân rã Chi tiết Hạng mục Công việc Lập trình Frontend Giao diện Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Phân rã Chi tiết Hạng mục Công việc Lập trình Frontend (`Frontend Implementation Task Breakdown` - Phase 11G) cho giao diện nạp Tri thức Pháp lý của hệ thống LegalFlow V2. Tài liệu chia nhỏ lộ trình xây dựng UI thành 11 tác vụ chi tiết (`FE-001 -> FE-011`), quy định 5 lời nhắc cảnh báo persistent banner bắt buộc (`Required UI Warnings`), xác lập các quy tắc hiển thị giao diện theo phân quyền (`Permission UI Rules`) và ban hành ma trận 7 kịch bản kiểm thử frontend (`Frontend Test Requirements`) nhằm chuẩn bị cấu trúc Component hoàn hảo cho Kỹ sư Frontend khi bước vào giai đoạn code (`Phase 11J`).

---

## 2. Frontend Scope

Bảng phân rã chi tiết 11 tác vụ lập trình Frontend (`11 Frontend Implementation Task Breakdown Table`):

| Task ID | Task (`Task Title & Component`) | Description (`Detailed UI/UX & Component Specifications`) | Risk | Dependencies | Acceptance Criteria (`Definition of Done`) | Notes & UI Guard Rails |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **FE-001** | **Review Existing Page** | Rà soát `LegalKnowledgePage.tsx` hiện có, kiểm tra các tab (`Documents, Procedure Type Versions, Update Logs, Snapshots`) và state quản lý. | `LOW` | *None* | Khẳng định điểm neo để chèn tab mới "Công Cụ Nạp (`Import Studio`)" mà không làm xáo trộn bố cục trang. | Chỉ đọc và kiểm tra static code UI, không sửa file trong Phase 11G. |
| **FE-002** | **Add Import Entry Point** | Thêm nút/tab `[ Công Cụ Nạp Dữ Liệu ]` vào header của `LegalKnowledgePage.tsx`, chỉ hiển thị khi `user.role === Role.ADMIN / Role.MANAGER`. | `LOW` | FE-001 | Tài khoản `STAFF` hoặc `VIEWER` đăng nhập sẽ hoàn toàn không nhìn thấy nút hoặc tab này trên giao diện. | Tích hợp RBAC UI hiding chuẩn xác theo Redux/Auth Context. |
| **FE-003** | **Upload CSV UI Component** | Xây dựng component `ImportCsvUploader.tsx` hỗ trợ drag-drop file `.csv`, kiểm tra kích thước `< 10MB`, kèm nút tải Mẫu CSV 29 cột Phase 11C. | `LOW` | FE-002 | Người dùng tải lên file CSV hợp lệ, component đọc tên file, dung lượng và chuẩn bị buffer gửi API `/validate`. | Cảnh báo rõ ràng nếu file không đúng định dạng `.csv`. |
| **FE-004** | **Preview CSV Records Table** | Xây dựng component `ImportRecordsPreview.tsx` render bảng 10 dòng đầu tiên của file CSV ngay trên UI để cán bộ kiểm tra mắt (`Quick Review`). | `LOW` | FE-003 | Bảng hiển thị rõ `source_id, document_number, title, issuing_authority, effective_date` với thanh cuộn ngang mượt mà. | Hiển thị tag màu sắc cho các trạng thái `Effective / Approved`. |
| **FE-005** | **Show Validation Result Dashboard** | Xây dựng component `ImportValidationDashboard.tsx` hiển thị 6 chỉ số Dry-Run (`Total / Valid / Warning / Rejected / Duplicate / Review`). | `MEDIUM` | FE-004 | Hiển thị huy hiệu màu (`Badge`): Xanh lá (`PASS`), Vàng (`PASS WITH WARNINGS`), Đỏ (`REJECTED CRITICAL`). | Khóa nút Execute nếu `Rejected > 0` hoặc `Duplicate > 0` chưa xử lý. |
| **FE-006** | **Show Warning / Error Detail Table** | Xây dựng component `ImportErrorDetailTable.tsx` liệt kê từng dòng lỗi từ API `/validate`, chỉ rõ số dòng, mã lỗi `VAL-xx` và hướng dẫn khắc phục. | `MEDIUM` | FE-005 | Cán bộ nhấp vào từng lỗi có thể xem trích đoạn dòng CSV tương ứng để dễ dàng đối chiếu sửa trên Excel. | Phân loại rõ ràng Tab `Errors (Critical)` vs Tab `Warnings (Info)`. |
| **FE-007** | **Dry-Run Report View & Export** | Xây dựng màn hình/modal xem toàn bộ Báo cáo Dry-Run kèm nút chốt xác nhận rà soát (`Checklist Sign-off`) và xuất ra Markdown/PDF. | `LOW` | FE-006 | Hiển thị banner khẳng định minh bạch: `DRY-RUN ONLY - 0 DB WRITES CONFIRMED`. | Cung cấp bằng chứng kiểm định tĩnh để trình Lãnh đạo Phòng. |
| **FE-008** | **Execute Confirmation Modal** | Xây dựng component `ImportConfirmationModal.tsx` thực thi chốt chặn 4 bước theo Phase 11F: Checkbox `Approved`, Checkbox `Backup`, Input Reason & Input Challenge Text. | `HIGH` | FE-007 | Nút `[ EXECUTE BATCH IMPORT ]` bị disable 100% cho đến khi người dùng gõ chính xác chuỗi thử thách và chọn đủ checkbox. | Yêu cầu `Role.ADMIN`, kèm ô nhập chữ ký/ID Lãnh đạo phê duyệt (`approvedBy`). |
| **FE-009** | **Import History & Report View** | Xây dựng component `ImportHistoryTable.tsx` gọi API `/import/history` hiển thị danh sách các lô đã nạp trước đó (`Batch ID, Date, Actor, Valid Count`). | `LOW` | FE-008 | Cho phép nhấp vào `Batch ID` để xem lại Báo cáo nghiệm thu và danh sách các ID trong bảng `LegalUpdateLog`. | Quyền xem mở rộng cho cả `ADMIN, MANAGER, STAFF, VIEWER`. |
| **FE-010** | **UI Safety Warnings Display** | Ghim cố định 5 lời nhắc cảnh báo pháp lý và vận hành (`5 Persistent Warning Banners`) trên phần đầu và phần chân của `ImportStudio`. | `HIGH` | FE-001 | Banners có viền vàng/đỏ nổi bật, không thể tắt (`Non-dismissible`), nhắc nhở cán bộ và AI về ranh giới thẩm định. | Tuân thủ tuyệt đối điều kiện an toàn số 19 và 20 của hệ thống. |
| **FE-011** | **Frontend Tests & Build Verification** | Viết test Jest/Testing Library cho các components mới (`ImportStudio.test.tsx`) và chạy `npm run build` kiểm chứng không lỗi TypeScript. | `MEDIUM` | FE-010 | `npm run build` hoàn tất 100% không phát sinh lỗi TS hay broken links. Test coverage UI đạt chuẩn. | Đảm bảo không làm ảnh hưởng đến các modal thẩm định Khối 1 & Khối 2 hiện hữu. |

---

## 3. Required UI Warnings

Trên toàn bộ các màn hình thuộc Công cụ Nạp (`Import Studio UI`), hệ thống bắt buộc phải ghim cố định 5 lời nhắc cảnh báo pháp lý ở vị trí dễ nhìn nhất, viền nổi bật (`5 Mandatory Persistent UI Warning Banners`):
1. ⚠️ **`"Import không đồng nghĩa với active."`**  
   *(Dữ liệu sau khi nạp thành công chỉ nằm ở vùng chờ Staging `UpdateLog`. Lãnh đạo Phòng phải phê duyệt kích hoạt riêng tại giao diện Quản lý Phiên bản).*
2. ⚠️ **`"Dữ liệu pháp lý phải được cán bộ kiểm tra."`**  
   *(Phần mềm và AI chỉ là công cụ hỗ trợ rà soát kỹ thuật. Cán bộ Pháp chế chịu trách nhiệm cao nhất về tính chính xác và hiệu lực thực tế của văn bản).*
3. ⚠️ **`"AI không tự xác định văn bản mới nhất / đầy đủ."`**  
   *(Trợ lý AI Khối 3.1 không có quyền tự kết luận kho luật là bao phủ 100%. Cán bộ Một cửa và P2 phải luôn đối chiếu quy định mới nhất khi thụ lý hồ sơ).*
4. ⚠️ **`"Cần backup trước khi import thật."`**  
   *(Nghiêm cấm bấm nút nạp dữ liệu thật nếu chưa thực hiện và kiểm chứng file sao lưu cơ sở dữ liệu `pg_dump` trên máy chủ).*
5. ⚠️ **`"Không dùng dữ liệu chưa duyệt cho hồ sơ chính thức."`**  
   *(Tuyệt đối không sử dụng các bản ghi đang ở trạng thái `Draft`, `Pending Review` hay dữ liệu mẫu giả lập cho việc tham mưu, thẩm định hồ sơ TTHC thực tế).*

---

## 4. Permission UI Rules

Quy tắc điều hướng và ẩn/hiện giao diện theo 4 vai trò người dùng (`4-Role UI Visibility & RBAC Enforcement Rules`):
* 🔒 **`Role.VIEWER`:** Hoàn toàn không nhìn thấy nút `[ Công Cụ Nạp Dữ Liệu ]`. Chỉ có thể xem danh sách văn bản hiện hữu tại tab `Documents` hoặc xem báo cáo lịch sử nếu được cấp link.
* 🔒 **`Role.STAFF` (Chuyên viên thụ lý / Một cửa):** Không được quyền truy cập màn hình Import Studio hay bấm nút `Execute Import`. Có quyền tải về Mẫu CSV 29 cột để chuẩn bị dữ liệu ngoại tuyến và xem lịch sử nạp.
* 🔒 **`Role.MANAGER` (Lãnh đạo Phòng):** Nhìn thấy nút `Import Studio`, được quyền tải CSV lên, chạy rà soát `Run Dry-Run Validation`, ký duyệt Báo cáo Dry-Run (`Digital Sign-off`) và thực hiện thao tác kích hoạt hiệu lực live (`Activate Draft Version`) ở giao diện Quản lý Phiên bản.
* 🔒 **`Role.ADMIN` (Quản trị viên Hệ thống):** Nhìn thấy toàn bộ màn hình `Import Studio`, được quyền chạy Dry-Run, mở modal xác nhận 4 bước (`Execute Confirmation Modal`) và bấm nút `[ EXECUTE BATCH IMPORT ]` sau khi đã nhập lý do, mã tham chiếu backup `pg_dump` và chữ ký của `MANAGER`.

> **MANDATORY SECURITY NOTE:**  
> Việc ẩn nút bấm trên UI chỉ là biện pháp trải nghiệm người dùng (`UX Guard`). Backend API vẫn phải tự thực thi bảo vệ phân quyền độc lập bằng `@RolesGuard`, tuyệt đối không phụ thuộc vào UI hiding.

---

## 5. Frontend Test Requirements

Bảng đặc tả 7 kịch bản kiểm thử bắt buộc đối với giao diện Frontend (`7 Mandatory Frontend Test Scenarios Table`):

| Test ID | Scenario (`UI Test Case Description`) | Expected Result (`Asserted Component Behavior`) | Priority | Notes & Verification Method |
| :---: | :--- | :--- | :---: | :--- |
| **TEST-FE-01** | **Upload CSV Component Render & File Select** | Component `ImportCsvUploader` render đúng, nhận file `.csv`, từ chối file `.exe` / `.pdf` và hiển thị tên file. | `HIGH` | Unit test `ImportCsvUploader.test.tsx`. |
| **TEST-FE-02** | **Show Validation Errors Table** | Khi API `/validate` trả về danh sách `rejectedRecords`, bảng `ImportErrorDetailTable` hiển thị đúng dòng, màu đỏ và mã lỗi `VAL-xx`. | `CRITICAL` | Assert render chính xác message tiếng Việt của lỗi rà soát. |
| **TEST-FE-03** | **Block Execute When Validation Fails** | Khi báo cáo Dry-Run có `rejectedCount > 0` hoặc `duplicateCount > 0`, nút mở Modal Execute bị disable hoàn toàn. | `CRITICAL` | Assert chốt chặn: Không thể mở Modal nạp nếu CSV còn lỗi Critical. |
| **TEST-FE-04** | **Show Persistent Warning Text** | Đảm bảo 5 banner lời nhắc pháp lý và vận hành hiển thị đầy đủ, không bị cuộn mất và không có nút close (`Non-dismissible`). | `CRITICAL` | Assert tìm thấy chính xác các chuỗi text cảnh báo trên DOM. |
| **TEST-FE-05** | **Role-Based Visibility (`STAFF / VIEWER`)** | Render `LegalKnowledgePage` với context `user.role === STAFF / VIEWER`. Nút `[ Công Cụ Nạp ]` không tồn tại trong DOM. | `CRITICAL` | Assert `queryByTestId('import-studio-tab') === null`. |
| **TEST-FE-06** | **Execute Confirmation Challenge Gate** | Trong Modal Execute, nếu người dùng chưa gõ đúng chuỗi `"I UNDERSTAND THIS WILL WRITE TO LEGAL KNOWLEDGE STAGING DB"`, nút Submit bị disabled. | `CRITICAL` | Assert nút Submit disabled cho đến khi input text khớp 100%. |
| **TEST-FE-07** | **No Impact on Existing Print Modals (`Non-Regression`)** | Kiểm chứng các modal thẩm định hiện hữu (`ProcedureReviewPrintModal.tsx`, `PurposeChangeReviewPrintModal.tsx`) render bình thường sau khi chèn Import UI. | `HIGH` | Assert `npm run build` thành công, 0 broken references. |

---
*Phân rã Chi tiết Hạng mục Công việc Lập trình Frontend (Frontend Task Breakdown) được lập tự động từ kết quả quy chuẩn Phase 11G.*
