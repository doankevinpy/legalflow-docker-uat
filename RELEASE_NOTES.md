# Release Notes

## v0.4.2-migration-cleanup (21/05/2026)

### Tính năng chính (Phase 3.2 Safe localStorage Migration & Cleanup Dashboard)
- **Cổng An Toàn 3 Tầng**:
  - Dữ liệu cục bộ cũ tuyệt đối **không tự động xóa**.
  - Nút **"Xóa dữ liệu localStorage cũ"** chỉ hiển thị khi:
    - Đã tải xuống file sao lưu JSON an toàn (`legalflow_migration_backed_up === 'true'`).
    - Đã hoàn thành xử lý 100% hồ sơ local cũ (`legalflow_migration_completed === 'true'`).
    - Báo cáo di chuyển ghi nhận không còn hồ sơ chưa xử lý (`pendingCount === 0`) và không còn hồ sơ lỗi (`failedCount === 0`).
  - Thực thi luồng **Double Confirm** (Xác nhận 2 lớp) cực kỳ chi tiết, nhấn mạnh hành động chỉ dọn dẹp trình duyệt cục bộ và hoàn toàn không ảnh hưởng tới dữ liệu máy chủ backend.
- **Migration Report (`legalflow_migration_report`)**:
  - Theo dõi chi tiết trạng thái của từng hồ sơ local cũ với các trạng thái: `pending`, `imported`, `already_migrated`, `possible_duplicate`, `failed`, `skipped`.
  - Hỗ trợ nút thao tác nhanh **"Bỏ qua (Skip)"** để loại bỏ hồ sơ rác khỏi tiến trình di chuyển, hoặc **"Kích hoạt lại"** để linh hoạt xử lý dữ liệu.
- **Chống Trùng Lặp Đa Yếu Tố (Multi-factor Duplicate Protection)**:
  - Đầu tiên, đối sánh trực tiếp `caseCode === c.caseId` trên Backend (nếu không phải định dạng mã cũ `HS-`).
  - Nếu không khớp mã trực tiếp, so sánh sâu kết hợp 5 yếu tố nội dung: `senderName` (so khớp tương đối không dấu), `receivedDate`, `type`, `neighborhood`, và `summary`.
  - Nếu phát hiện nghi trùng, gán trạng thái `"possible_duplicate"`, hiển thị cảnh báo màu cam và **không tự động tạo bản ghi trùng rác trên backend**, yêu cầu người dùng xác nhận thủ công (Vẫn import tiếp hoặc Xác nhận trùng/Skip).
- **Hỗ Trợ Mã Cũ `HS-`**:
  - Nhận diện mã cũ dạng `HS-YYMM-XXXX` và preview rõ cho người dùng biết mã dự kiến sau import sẽ được backend sinh tự động theo sequence mới an toàn của hệ thống, không ghi đè mã HS cũ lên DB.
- **Marker Dọn Dẹp Vĩnh Viễn**:
  - Lưu cờ `legalflow_local_cleanup_completed` kèm timestamp để luôn hiển thị trạng thái hoàn thành sạch sẽ ("Đã dọn dẹp bộ nhớ localStorage cục bộ thành công") trong Settings, ẩn hoàn toàn các widget di chuyển không còn cần thiết.

### Quyết định thiết kế & Giới hạn đã biết (Known limitations)
- Mọi logic so khớp, tìm kiếm, đánh giá trùng lặp nội dung và báo cáo đều được xử lý 100% Client-side giúp giảm tải cho Server và tuyệt đối không sửa đổi API hay Schema của Backend.
- **Giới hạn kiểm thử**: Tính năng hiện tại chỉ mới được nghiệm thu độc lập và chạy thử nghiệm bằng dữ liệu giả lập (mock data), chưa được đưa vào chạy thực tế và kiểm thử với các hồ sơ nghiệp vụ pháp lý thực tế (real production records).

## v0.4.0-frontend-backend-integration (21/05/2026)

### Tính năng chính (Phase 3 Frontend ↔ Backend Integration & Phase 3.1 Drafts Backend Migration)
- **Auth UI**: Tích hợp màn hình đăng nhập an toàn, lưu token trong `sessionStorage`, phân quyền Route.
- **Dashboard dùng backend**: Lấy số liệu thống kê realtime từ API (`GET /cases/stats`).
- **Cases dùng backend**: Tất cả CRUD thao tác trực tiếp trên DB, thay vì localStorage.
- **Notes/checklist/status dùng backend**: Các tương tác cập nhật case detail ghi nhận ngay trên backend và lưu lịch sử chuẩn xác.
- **MigrationPanel**: Cung cấp công cụ thủ công (Settings > Migration) gồm 6 bước rõ ràng để di chuyển dữ liệu từ localStorage cũ sang hệ thống mới một cách an toàn.
- **Drafts dùng Backend (Phase 3.1)**: Loại bỏ hoàn toàn sự phụ thuộc vào `localStorage` của Drafts. Toàn bộ danh sách hồ sơ và dữ liệu chi tiết (checklist, tài liệu, thông tin người dùng) được nạp realtime từ Backend API.

### Bug Fixes
- Đã sửa lỗi `POST /cases/:id/notes` trả về `CaseNote` mismatch type trên Frontend (`casesApi.ts`).
- Đã sửa lỗi `POST /cases` khởi tạo checklist nhưng không trả về ngay trong response, giúp Frontend hiện checklist ngay lập tức.

### Quyết định thiết kế & Giới hạn đã biết (Known limitations)
- **Không ghi log Drafts vào Backend**: Trong Phase 3.1, việc tạo/copy/export dự thảo không ghi log vào Backend. Không dùng endpoint `POST /cases/:id/notes` để tránh nhiễu dữ liệu nghiệp vụ của hồ sơ (Notes chỉ dùng cho chuyên môn). Thao tác audit sẽ được thiết kế riêng ở phase sau.
- `documents` chỉ lưu metadata JSON, chưa upload file thật.
- localStorage cũ (của phiên bản cũ) chưa được tự động xóa, người dùng cần bấm nút thủ công trong Settings sau khi di chuyển dữ liệu thành công.
- Chưa deploy production (vẫn ở môi trường dev).


---## v0.3.0-backend-cases-api (20/05/2026)

**Commit:** `9dddcf5` – `feat: implement backend cases api phase 2`
**Tag:** `v0.3.0-backend-cases-api`

### Tính năng chính (Backend Phase 2 – Cases API)

#### Database & Schema
- **`LegalCase`**: Model hồ sơ pháp lý đầy đủ. Hỗ trợ soft delete (`deletedAt`, `deletedById`), tracking người tạo (`createdById`) và người được phân công (`assignedToId`).
- **`CaseSequence`**: Bảng cấp phát số thứ tự theo năm. Dùng atomic increment trong Prisma transaction – không dùng random, không đếm tổng.
- **`CaseNote`**: Ghi chú liên kết hồ sơ và người dùng.
- **`CaseChecklistItem`**: Danh sách kiểm tra tự động sinh từ lĩnh vực (`field`). Ghi nhận `completedAt` và `completedById` khi tick.
- **`CaseHistory`**: Audit log đầy đủ với 6 action type: `CREATE_CASE`, `UPDATE_CASE`, `CHANGE_STATUS`, `ADD_NOTE`, `UPDATE_CHECKLIST`, `SOFT_DELETE_CASE`.

#### API Endpoints (9 endpoints)
- `GET /cases` – Danh sách có phân trang, filter, search
- `POST /cases` – Tạo hồ sơ, tự sinh `caseCode`, tự tạo checklist mặc định
- `GET /cases/stats` – Thống kê tổng hợp (byStatus, byType, byField, byNeighborhood, overdue, needsMoreInfo)
- `GET /cases/:id` – Chi tiết kèm nested notes, checklist, histories
- `PATCH /cases/:id` – Cập nhật nội dung
- `DELETE /cases/:id` – **Soft delete** (ghi `deletedAt`, không xóa vật lý)
- `POST /cases/:id/notes` – Thêm ghi chú
- `PATCH /cases/:id/checklist/:itemId` – Tick/untick checklist
- `PATCH /cases/:id/status` – Đổi trạng thái

#### Format Mã Hồ Sơ Backend
Format: `[YYYY]-[TYPE_CODE]-[SEQ_3_DIGITS]-[NEIGHBORHOOD_CODE]`
Ví dụ: `2026-KN-001-KP3`, `2026-TC-002-KP2`, `2026-KNG-003-KP1`, `2026-KHAC-004-KHAC`

#### Phân quyền RBAC
- **ADMIN**: Toàn quyền
- **MANAGER**: Tạo, sửa, assign, soft delete, xem stats
- **STAFF**: Tạo hồ sơ; chỉ sửa/note/checklist/status trên case do mình tạo hoặc được phân công
- **VIEWER**: Read-only (GET cases, GET /:id, GET stats)

### Giới hạn MVP
- `documents` chỉ lưu metadata JSON (`[{ name, url, note }]`) – **chưa upload file thật**, không lưu binary/base64
- **Chưa tích hợp frontend** với backend trong phase này – frontend vẫn dùng localStorage
- **Chưa dùng dữ liệu thật** – seed accounts chỉ dành cho development
- Sau này sẽ tách `documents` thành bảng `CaseDocument` kết hợp S3/storage service

### Kết quả nghiệm thu
- `npm run build`: ✅ Pass
- `prisma migrate/generate/seed`: ✅ Pass
- `verify-cases.js`: ✅ **21/21 test cases pass**
- RBAC edge cases (STAFF sửa case không phải của mình → 403): ✅ Pass
- Soft delete (record còn DB, API trả 404): ✅ Pass
- Không rò rỉ `passwordHash`: ✅ Pass
- Frontend nguyên vẹn: ✅ Pass
- Git status clean: ✅ Pass

---

## v0.2.0-case-id-format (20/05/2026)

### Features
- **Format Mã Hồ Sơ Mới**: Chuyển đổi format từ `HS-YYMM-XXXX` sang `[YYYY]-[Mã loại đơn]-[Số thứ tự]-[Khu phố]` (VD: `2026-KN-015-KP3`).
- **Trường "Khu phố"**: Thêm lựa chọn khu phố bắt buộc vào luồng tạo mới hồ sơ. Hỗ trợ hiển thị và lọc theo khu phố tại danh sách. Tự động chuyển tên `Khác` thành `KHAC` trong mã hồ sơ.

### Improvements
- Cơ chế sinh mã hồ sơ hoàn toàn khép kín, tránh lặp lại bằng thuật toán tự động tìm mốc và lặp.
- Migration Data Script được tích hợp: Tự động phát hiện format cũ và tạo mã mới tương ứng với hệ thống khu phố, đồng thời backup json an toàn sang biến cục bộ.

### Bug Fixes
- Khắc phục lỗ hổng trùng lặp mã ở các phiên bản trước do hàm random.
- Khắc phục sự cố build TypeScript liên quan tới biến không sử dụng và Component không hợp lệ.
