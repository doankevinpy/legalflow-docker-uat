# LEGALFLOW V2 - PHASE 11L
# CONTROLLED IMPORT UAT PLAN

## 1. Purpose

Kế hoạch kiểm thử nghiệm thu người dùng có kiểm soát (Controlled Import UAT Plan) với bộ dữ liệu mẫu được thẩm định (`approved sample dataset`) được lập nhằm rà soát, đánh giá và nghiệm thu tính năng Nạp tri thức pháp lý (`Legal Knowledge Import UI & Execute Safety API`) trong môi trường thực tế có kiểm soát.  
Mục tiêu chính là xác nhận toàn diện khả năng kiểm chứng mô phỏng (`dry-run validation`), khả năng chặn tường lửa an toàn 8 lớp khi thiếu điều kiện bắt buộc (`backup confirmation`, `reason`, `confirmation text`), rà soát kỹ lưỡng tệp mẫu (`SAMPLE` prefix), và đảm bảo tuyệt đối nguyên tắc không tự động kích hoạt hay ghi đè dữ liệu pháp lý thực tế (`noAutoActive: true`).

## 2. Baseline

- **Previous tag:** `v2.11.11-import-ui-e2e-test-release-candidate`
- **Proposed tag:** `v2.11.12-controlled-import-uat-approved-sample-dataset`
- **Root path:** `C:\Users\Admin\legalflow-docker-uat`
- **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
- **Sample dataset:** `docs/LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv`
- **Ngày lập kế hoạch:** 12/07/2026

## 3. UAT Scope

Phạm vi kiểm thử UAT của Phase 11L bao gồm các hạng mục sau:
- `pre-UAT backup`: Thực hiện tạo bản sao lưu an toàn cơ sở dữ liệu (`pg_dump`) trước khi bắt đầu bất kỳ thao tác kiểm chứng nào trên hệ thống.
- `backend test/build`: Biên dịch NestJS và kiểm tra tự động 150/150 unit & integration tests.
- `frontend build`: Biên dịch gói sản phẩm Vite/TypeScript clean.
- `health-check`: Kiểm tra tình trạng hoạt động 4/4 của toàn bộ Docker stack (`Postgres`, `MinIO`, `Caddy`), Backend API (`port 3000`) và Frontend Dev Server (`port 5173`).
- `sample dataset review`: Rà soát từng trường thông tin, cấu trúc và tính an toàn của 5 bản ghi mẫu (`SAMPLE-001` &rarr; `SAMPLE-005`).
- `validate dry-run`: Thực thi kiểm thử chức năng rà soát mô phỏng với tệp mẫu, kiểm chứng trả về đầy đủ báo cáo thống kê (`dryRun: true`, `noDatabaseWrite: true`).
- `execute blocked tests`: Kiểm thử các kịch bản tường lửa chặn thực thi khi thiếu sao lưu, thiếu lý do hoặc sai chuỗi xác nhận an toàn.
- `optional controlled execute with SAMPLE dataset`: Kiểm chứng quy trình gửi yêu cầu thực thi với đầy đủ tham số hợp lệ (`backupConfirmed = true`, `reason`, `confirmationText`) và xác nhận hành vi bảo vệ của hệ thống.
- `no active version confirmation`: Kiểm chứng tuyệt đối không có sự biến đổi trạng thái `ACTIVE` của bất kỳ phiên bản tri thức pháp lý hay thủ tục nào.

## 4. Out of Scope

Nhằm bảo vệ an toàn tuyệt đối cho hệ thống và tuân thủ 20 ràng buộc kỹ thuật của Phase 11L, các hạng mục sau được xác định ngoài phạm vi kiểm thử (`Out of Scope`):
- Không dùng văn bản pháp luật thật hoặc dữ liệu thực tế của cơ quan quản lý nhà nước.
- Không import dữ liệu thật vào Database production hoặc local đang vận hành.
- Không active version pháp lý (việc kích hoạt thuộc quy trình quản trị 3 bước độc lập tại Phase 8F-E).
- Không rollback version pháp lý.
- Không tạo hay thực thi migration mới.
- Không chạy lệnh seed (`prisma db seed`).
- Không reset hay restore database.
- Không ghi nhận secret, password, token vào báo cáo hay Git repository.

## 5. UAT Test Cases

| Test ID | Area | Scenario | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **UAT-001** | Baseline | Kiểm tra trạng thái mã nguồn baseline (`git status`, `git log --oneline -10`, `git tag --points-at HEAD`). | HEAD trỏ vào tag `v2.11.11-import-ui-e2e-test-release-candidate`. Working tree clean. | Khớp 100%. Working tree clean, tag `v2.11.11` tại commit `cc0e0ab`. | ✅ **PASS** | Đảm bảo tính toàn vẹn lịch sử Git trước UAT. |
| **UAT-002** | Backup | Thực hiện sao lưu DB trước UAT qua lệnh `docker exec legalflow_postgres pg_dump ... > .\backups\...sql`. | Tạo thành công tệp backup `.sql` đầy đủ trong thư mục `backups/`. Thư mục `backups/` được gitignore. | Tệp `legalflow_prod_pre_phase11l_sample_import_uat_20260712-154005.sql` (~951 KB) sinh ra thành công, không lọt vào Git. | ✅ **PASS** | Lớp bảo vệ dữ liệu tiên quyết số 1. |
| **UAT-003** | Backend | Biên dịch và kiểm thử Backend (`npx prisma generate`, `migrate status`, `npm test`, `npm run build`). | Toàn bộ 150/150 tests PASS. `migrate status` up to date. NestJS build clean. | 150/150 tests PASS 100% trong 4.54s. `Database schema is up to date! 6 migrations found`. | ✅ **PASS** | Kiểm chứng không suy thoái chức năng backend. |
| **UAT-004** | Frontend | Biên dịch gói giao diện (`npm run build`). | Vite build thành công, 0 lỗi TypeScript across all modules. | `built in 1.55s across 3178 modules`. Bundle JS/CSS sinh ra clean trong `dist/`. | ✅ **PASS** | Cảnh báo chunk size > 500 kB là non-blocking warning. |
| **UAT-005** | Runtime | Kiểm tra tình trạng hệ thống qua `.\scripts\health-check.ps1` và `docker ps`. | 4/4 kiểm tra đạt PASS (`Postgres`, `MinIO`, `Caddy`, `Backend port 3000`, `Frontend port 5173`). | `STATUS: ALL SYSTEMS HEALTHY & OPERATIONAL`. Containers `Up (healthy)`. | ✅ **PASS** | Đảm bảo môi trường thực thi UAT ổn định. |
| **UAT-006** | Dataset | Rà soát tệp mẫu `docs/LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` trước khi test. | Toàn bộ 5/5 bản ghi có tiền tố `SAMPLE-`, không chứa dữ liệu thật hay secret, đầy đủ `risk_note`, `approval_status`, `legal_status`. | Đã kiểm tra 5 bản ghi (`SAMPLE-001` &rarr; `SAMPLE-005`), 100% đạt tiêu chuẩn an toàn và đầy đủ các cột bắt buộc. | ✅ **PASS** | Đảm bảo dữ liệu đầu vào chuẩn hóa cho UAT. |
| **UAT-007** | Dry-Run | Tải tệp mẫu `SAMPLE` lên Import UI và thực hiện `Validate CSV - Dry Run`. | Gửi request lên API `validateCsvImport`, trả về JSON báo cáo kiểm chứng thành công mà không ghi DB. | Nhận phản hồi `dryRun: true`, `noDatabaseWrite: true`, tổng 5 bản ghi đã rà soát. | ✅ **PASS** | Kiểm chứng cơ chế rà soát 14 quy tắc (`VAL-01` &rarr; `VAL-14`). |
| **UAT-008** | Summary | Kiểm tra số liệu thống kê trong thẻ báo cáo sau rà soát (`Validation Result Summary`). | Hiển thị chính xác tổng số dòng (`5`), hợp lệ (`5`), cảnh báo (`0`), từ chối (`0`), trùng lặp (`0`), cờ `Dry-Run: TRUE`. | Thẻ thống kê màu sắc phản ánh chính xác số liệu từ payload trả về. | ✅ **PASS** | Giúp cán bộ nắm bắt nhanh tỷ lệ hợp lệ của tệp. |
| **UAT-009** | Table | Kiểm tra hiển thị bảng chi tiết từng dòng (`Record-Level Table`). | Hiển thị trọn vẹn 5 dòng dữ liệu mẫu, mã văn bản, trạng thái `VALID` và chi tiết trường rà soát. | Bảng hiển thị rõ 5 row (`SAMPLE-001` &rarr; `SAMPLE-005`) với trạng thái hợp lệ. | ✅ **PASS** | Hiển thị minh bạch kết quả rà soát từng bản ghi. |
| **UAT-010** | Safety | Kiểm thử tường lửa chặn thực thi khi thiếu xác nhận sao lưu (`missing backup confirmation`). | Bấm Thực thi khi `backupConfirmed = false`. Hệ thống lập tức chặn và hiển thị lỗi rõ ràng. | UI chặn tức thì: `"Vui lòng xác nhận bạn đã sao lưu dữ liệu (backup) trước khi thực thi import."` | ✅ **PASS** | Đảm bảo cán bộ không bỏ qua bước backup. |
| **UAT-011** | Safety | Kiểm thử tường lửa chặn thực thi khi để trống lý do (`missing reason`). | Tích chọn backup nhưng để trống ô nhập lý do (`reason = ''`). Hệ thống chặn thực thi. | UI chặn tức thì: `"Vui lòng nhập lý do thực hiện import."` | ✅ **PASS** | Đảm bảo lưu vết kiểm toán rõ ràng cho mỗi lần nạp. |
| **UAT-012** | Safety | Kiểm thử tường lửa chặn thực thi khi sai câu lệnh an toàn (`wrong confirmationText`). | Nhập câu xác nhận sai lệch hoặc viết thường (khác `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`). | UI chặn tức thì: `"Câu xác nhận (confirmation text) không khớp chính xác chuỗi yêu cầu."` | ✅ **PASS** | Buộc cán bộ xác nhận tường minh nguyên tắc quản trị. |
| **UAT-013** | Safety | Kiểm chứng nguyên tắc không tự động kích hoạt phiên bản (`noAutoActive: true`). | Mọi phản hồi API và UI đều khẳng định import không kích hoạt phiên bản đang thi hành. | Cờ `noAutoActive: true` luôn được trả về từ Backend API; trạng thái `ACTIVE` của DB giữ nguyên 100%. | ✅ **PASS** | Bảo vệ tuyệt đối hiệu lực pháp lý của hệ thống. |
| **UAT-014** | Optional | Thực hiện gửi payload thực thi với đầy đủ tham số hợp lệ (`Optional Controlled Execute with SAMPLE Dataset`). | Gửi payload hợp lệ (`backupConfirmed: true`, `reason: 'Phase 11L controlled UAT with approved SAMPLE dataset'`, `confirmationText: 'I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION'`). Backend rà soát và trả về phản hồi an toàn. | `Execute success was not performed against current database. UAT limited to dry-run and blocked safety scenarios.` Backend API bảo vệ bằng `status: 'EXECUTE_BLOCKED_SCHEMA_SUPPORT_REQUIRED'`, không ghi DB trái phép. | ✅ **PASS** | Đảm bảo tuân thủ nguyên tắc không biến đổi DB khi chưa có bảng staging chuyên dụng. |
