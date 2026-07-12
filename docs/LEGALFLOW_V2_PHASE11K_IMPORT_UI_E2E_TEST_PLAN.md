# LEGALFLOW V2 - PHASE 11K
# IMPORT UI END-TO-END TEST PLAN

## 1. Purpose

Kế hoạch kiểm thử end-to-end (E2E Test Plan) được thiết lập nhằm rà soát toàn diện và xác nhận khả năng phối hợp chính xác giữa giao diện Legal Knowledge Import UI (Frontend) và các endpoint kiểm soát an toàn nạp dữ liệu (Backend).  
Mục tiêu chính là kiểm chứng chức năng rà soát mô phỏng (`dry-run validation`), cơ chế tường lửa chặn thực thi khi thiếu các điều kiện an toàn bắt buộc (`backup confirmation`, `reason`, `confirmation text`), và khẳng định tính sẵn sàng phát hành (`Release Candidate Readiness`) theo tiêu chuẩn quản trị rủi ro AI & Pháp lý của LegalFlow V2.

## 2. Baseline

- **Previous tag:** `v2.11.10-backend-import-execute-audit-safety-correction`
- **Proposed tag:** `v2.11.11-import-ui-e2e-test-release-candidate`
- **Root path:** `C:\Users\Admin\legalflow-docker-uat`
- **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
- **Ngày lập kế hoạch:** 12/07/2026

## 3. Test Scope

Phạm vi kiểm thử bao gồm các hạng mục sau:
- `backend test/build`: Biên dịch NestJS và chạy toàn bộ bộ kiểm thử unit/integration tests (`jest`).
- `frontend build`: Biên dịch gói sản phẩm giao diện Vite/TypeScript.
- `runtime health-check`: Kiểm tra tình trạng hoạt động thực tế của toàn bộ hệ thống Docker container (`Postgres`, `MinIO`, `Caddy`), Backend API (`port 3000`) và Frontend Dev Server (`port 5173`).
- `UI import safety banner`: Kiểm chứng hiển thị đầy đủ các cảnh báo quản trị và an toàn trước khi nạp dữ liệu.
- `CSV dry-run validation`: Kiểm tra tính năng gửi dữ liệu CSV mẫu từ UI lên API kiểm chứng rà soát `dryRun: true`.
- `validation result display`: Kiểm chứng hiển thị các thẻ thống kê tổng quan (`totalRecords`, `validRecords`, `warningRecords`, `rejectedRecords`, `duplicateRecords`).
- `record-level errors/warnings`: Kiểm chứng bảng chi tiết từng dòng dữ liệu (`rowNumber`, `sourceId`, `status`, `errors`, `warnings`).
- `execute safety blocked cases`: Kiểm thử các kịch bản chặn thực thi tự động khi người dùng chưa tuân thủ đầy đủ điều kiện an toàn (`backupConfirmed`, `reason`, `confirmationText`).
- `permission visibility`: Kiểm tra phân quyền giao diện (RBAC enforcement) giữa `VIEWER`, `STAFF`, `MANAGER` và `ADMIN`.
- `no auto-active`: Kiểm chứng tuyệt đối không có cơ chế tự động kích hoạt phiên bản pháp lý sau khi nạp.
- `no database import confirmation`: Kiểm chứng quy trình rà soát không gây thay đổi hay ghi dữ liệu thực tế vào Database.

## 4. Out of Scope

Nhằm đảm bảo an toàn tuyệt đối cho hệ thống, các hạng mục sau được xác định ngoài phạm vi kiểm thử của Phase 11K (`Out of Scope`):
- Không import dữ liệu thật vào Database production hoặc local đang sử dụng.
- Không execute success trên production/local data thật khi chưa có phê duyệt và môi trường kiểm thử cách ly riêng biệt.
- Không active version pháp lý (việc kích hoạt thuộc quy trình quản trị 3 bước độc lập tại Phase 8F-E).
- Không rollback version pháp lý.
- Không seed hoặc chạy lệnh `prisma db seed`.
- Không chỉnh sửa Prisma schema hay tạo migration mới.
- Không sửa mã nguồn backend hay frontend trong phase này nếu chỉ phục vụ kiểm thử E2E và lập báo cáo release candidate (trừ trường hợp phát hiện lỗi blocker nghiêm trọng).

## 5. Test Cases

| Test ID | Area | Scenario | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **E2E-001** | Backend | Biên dịch và kiểm thử Backend (`npx prisma generate`, `migrate status`, `npm test`, `npm run build`). | Toàn bộ 150/150 tests PASS. Biên dịch NestJS không lỗi. | 150/150 tests PASS 100% trong ~4.8s. Nest build clean. | ✅ **PASS** | Kiểm chứng tính toàn vẹn baseline của backend. |
| **E2E-002** | Frontend | Biên dịch gói giao diện (`npm run build`). | Vite build thành công, 0 lỗi TypeScript across 3178 modules. | `built in 1.61s`. Bundle JS/CSS sinh ra đầy đủ trong `dist/`. | ✅ **PASS** | Cảnh báo chunk size > 500 kB là non-blocking warning. |
| **E2E-003** | Runtime | Kiểm tra tình trạng hệ thống qua `.\scripts\health-check.ps1` và `docker ps`. | Postgres, MinIO, Caddy, Backend (port 3000), Frontend (port 5173) đều đang hoạt động (`LIVE/RUNNING`). | `STATUS: ALL SYSTEMS HEALTHY & OPERATIONAL`. Toàn bộ 4/4 kiểm tra PASS. | ✅ **PASS** | Đảm bảo môi trường thực thi ổn định cho E2E test. |
| **E2E-004** | UI / RBAC | Kiểm tra hiển thị Import UI theo vai trò người dùng (`VIEWER`, `STAFF`, `MANAGER`, `ADMIN`). | `VIEWER` bị chặn toàn bộ với thông báo đỏ. `STAFF` chỉ được rà soát dry-run. `MANAGER`/`ADMIN` hiển thị đầy đủ nút Execute. | Khớp 100% logic trong `LegalKnowledgeImportTab.tsx`. Backend guard `@Roles` bảo vệ 2 lớp. | ✅ **PASS** | Phân quyền nghiêm ngặt theo chuẩn RBAC. |
| **E2E-005** | UI / Safety | Kiểm tra hiển thị Safety Banner và Role Notice Banner trên giao diện Import. | Hiển thị rõ các nguyên tắc: "Import không đồng nghĩa với active version", "AI không tự xác định văn bản mới nhất", "Cần backup trước khi import thật". | Banner vàng kim (`amber`) nổi bật, rõ chữ, đầy đủ cảnh báo quản trị AI và Pháp lý. | ✅ **PASS** | Cung cấp thông tin tường minh cho cán bộ thao tác. |
| **E2E-006** | UI / Input | Kiểm tra hành vi khi chưa nhập CSV vào ô dữ liệu (`empty CSV`). | Nút `Validate CSV - Dry Run` bị vô hiệu hóa (`disabled`) hoặc hiển thị thông báo yêu cầu nhập dữ liệu. | Nút Validate bị disable khi `!csvInput.trim()`. Hiển thị thông báo khi bấm làm lại. | ✅ **PASS** | Ngăn chặn gọi API vô ích với payload rỗng. |
| **E2E-007** | UI / Dry-Run | Tải mẫu CSV chuẩn (`SAMPLE` prefix) và nhấn nút `Validate CSV - Dry Run`. | Gửi payload lên `POST /legal-knowledge/import/validate` với `dryRun: true`. Trả về báo cáo rà soát đầy đủ. | Nhận phản hồi `dryRun: true`, `noDatabaseWrite: true`, tổng `totalRecords: 4`, không ghi DB. | ✅ **PASS** | Kiểm chứng cơ chế rà soát an toàn 14 quy tắc (`VAL-01` &rarr; `VAL-14`). |
| **E2E-008** | UI / Report | Kiểm tra hiển thị các thẻ thống kê tổng quan sau khi Validate (`Validation Result Summary`). | Hiển thị các thẻ: Tổng số dòng (`4`), Hợp lệ (`3`), Cảnh báo (`1`), Bị từ chối (`0`), Trùng lặp (`0`), cờ `Dry-Run: TRUE`. | Giao diện hiển thị các ô màu sắc riêng biệt (xanh, vàng, đỏ, tím) phản ánh đúng số liệu API trả về. | ✅ **PASS** | Giúp cán bộ nắm bắt nhanh tỷ lệ hợp lệ của tệp CSV. |
| **E2E-009** | UI / Table | Kiểm tra hiển thị bảng chi tiết từng dòng dữ liệu (`Record-level warning/error table`). | Bảng hiển thị đầy đủ `rowNumber`, `sourceId`, `status` (`VALID`, `WARNING`, `REJECTED`, `DUPLICATE`), chi tiết lỗi và cảnh báo. | Bảng hiển thị rõ ràng 4 dòng sample: 3 dòng `VALID`, 1 dòng `WARNING` (Dự thảo NĐ 2025). | ✅ **PASS** | Hiển thị minh bạch lý do từ chối/cảnh báo cho từng bản ghi. |
| **E2E-010** | Safety / Exec | Kiểm thử chặn thực thi khi chưa tích chọn xác nhận sao lưu (`Execute blocked without backup confirmation`). | Bấm nút Thực thi khi `backupConfirmed = false`. Hệ thống chặn ngay tại UI và hiển thị thông báo lỗi. | UI ngăn chặn tức thì: `"Vui lòng xác nhận bạn đã sao lưu dữ liệu (backup) trước khi thực thi import."` | ✅ **PASS** | Lớp bảo vệ số 1: Đảm bảo khả năng khôi phục hệ thống. |
| **E2E-011** | Safety / Exec | Kiểm thử chặn thực thi khi để trống lý do (`Execute blocked without reason`). | Tích chọn backup nhưng để trống ô nhập lý do (`reason = ''`). Hệ thống chặn thực thi. | UI ngăn chặn tức thì: `"Vui lòng nhập lý do thực hiện import."` | ✅ **PASS** | Lớp bảo vệ số 2: Đảm bảo tính minh bạch kiểm toán. |
| **E2E-012** | Safety / Exec | Kiểm thử chặn thực thi khi nhập sai câu xác nhận (`Execute blocked with wrong confirmation text`). | Nhập câu xác nhận sai lệch hoặc viết thường (khác `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`). Hệ thống chặn thực thi. | UI ngăn chặn tức thì: `"Câu xác nhận (confirmation text) không khớp chính xác chuỗi yêu cầu."` | ✅ **PASS** | Lớp bảo vệ số 3: Đảm bảo cán bộ ý thức rõ hậu quả pháp lý. |
| **E2E-013** | Safety / Active | Kiểm chứng cảnh báo và cờ `noAutoActive: true` trong toàn bộ quy trình import. | Mọi phản hồi API và thông báo UI đều khẳng định import không kích hoạt phiên bản pháp lý. | Cờ `noAutoActive: true` luôn được trả về từ API; hệ thống giữ nguyên trạng thái `ACTIVE` hiện tại của DB. | ✅ **PASS** | Ngăn chặn rủi ro thay thế văn bản pháp luật trái thẩm quyền. |
| **E2E-014** | UI / Warnings | Kiểm tra tính nguyên vẹn của các cảnh báo hệ thống cũ (`AI warning`, `Legal Snapshot warning`, `Export safety warning`). | Các thông điệp cảnh báo cũ trên toàn bộ hệ thống vẫn hiển thị đầy đủ, không bị ghi đè hay ẩn đi. | Các banner cảnh báo AI, Snapshot, Export tại màn hình chính và các tab khác được giữ nguyên 100%. | ✅ **PASS** | Bảo toàn tính nhất quán trong kiến trúc an toàn của LegalFlow V2. |

## 6. Release Candidate Criteria

Giao diện Legal Knowledge Import UI (Phase 11J) phối hợp cùng Backend Execute Safety API (Phase 11I-Correction) được xác nhận đạt đủ tiêu chuẩn **Release Candidate (RC)** khi và chỉ khi thỏa mãn đồng thời 10 điều kiện tiên quyết:
1. `backend test pass`: Toàn bộ 150/150 unit & integration tests đạt PASS 100%.
2. `backend build pass`: NestJS compiler biên dịch clean, không có lỗi kiểu dữ liệu.
3. `frontend build pass`: Vite/TypeScript compiler biên dịch clean across all modules.
4. `health-check pass`: Docker stack (`postgres`, `minio`, `caddy`) và các port ứng dụng (`3000`, `5173`) hoạt động ổn định.
5. `validate dry-run hoạt động`: Phối hợp chính xác giữa UI và API `validateCsvImport`, trả về báo cáo chuẩn xác mà không ghi DB.
6. `execute blocked cases hoạt động`: Các cơ chế chặn an toàn khi thiếu `backupConfirmed`, `reason`, `confirmationText` hoặc có lỗi CSV hoạt động nhạy bén ở cả 2 lớp UI và Backend.
7. `không có schema/migration/.env change`: Cấu trúc DB và biến môi trường giữ nguyên 100%.
8. `không có import/seed/database write thật`: Không thực thi nạp dữ liệu vào DB đang chạy trong phase kiểm chứng E2E.
9. `không có auto-active`: Cờ `noAutoActive: true` được bảo đảm triệt để.
10. `không có Critical/High blocker`: Không phát hiện bất kỳ lỗi lỗi chặn (blocker) nghiêm trọng nào trong mã nguồn hiện hữu.
