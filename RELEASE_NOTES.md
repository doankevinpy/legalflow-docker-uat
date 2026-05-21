# Release Notes

## v0.4.0-frontend-backend-integration (21/05/2026)

### Tính năng chính (Phase 3 Frontend ↔ Backend Integration)
- **Auth UI**: Tích hợp màn hình đăng nhập an toàn, lưu token trong `sessionStorage`, phân quyền Route.
- **Dashboard dùng backend**: Lấy số liệu thống kê realtime từ API (`GET /cases/stats`).
- **Cases dùng backend**: Tất cả CRUD thao tác trực tiếp trên DB, thay vì localStorage.
- **Notes/checklist/status dùng backend**: Các tương tác cập nhật case detail ghi nhận ngay trên backend và lưu lịch sử chuẩn xác.
- **MigrationPanel**: Cung cấp công cụ thủ công (Settings > Migration) gồm 6 bước rõ ràng để di chuyển dữ liệu từ localStorage cũ sang hệ thống mới một cách an toàn.
- **Drafts vẫn localStorage**: Tạm giữ nguyên theo kế hoạch cho MVP.

### Bug Fixes
- Đã sửa lỗi `POST /cases/:id/notes` trả về `CaseNote` mismatch type trên Frontend (`casesApi.ts`).
- Đã sửa lỗi `POST /cases` khởi tạo checklist nhưng không trả về ngay trong response, giúp Frontend hiện checklist ngay lập tức.

### Known limitations
- `documents` chỉ lưu metadata JSON, chưa upload file thật.
- Drafts chưa được migrate sang backend.
- localStorage cũ (của version cũ) chưa được tự động xóa, phải bấm tay xoá sau khi Migration.
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
