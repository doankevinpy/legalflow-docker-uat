# Release Notes

## v0.7.0-user-profile-change-password (22/05/2026)

### Tính năng chính (Phase 4.2: Hồ sơ Người dùng & Tự đổi Mật khẩu)
- **Tự đổi mật khẩu bảo mật**:
  - Triển khai endpoint `POST /auth/change-password` bảo vệ bởi `JwtAuthGuard`, tuyệt đối chống giả mạo bằng cách trích xuất `userId` trực tiếp từ JWT payload đã xác thực (`req.user.id`).
  - Tích hợp so khớp mật khẩu hiện tại bằng `bcrypt.compare` với cơ sở dữ liệu.
  - Áp dụng các quy tắc validate mật khẩu nghiêm ngặt: độ dài $\ge 8$, bắt buộc chứa cả chữ hoa, chữ thường, chữ số và ký tự đặc biệt, đồng thời không cho phép trùng mật khẩu hiện tại.
  - Bảo mật tuyệt đối: Không phản hồi `passwordHash` hay mật khẩu rõ, không in các thông tin nhạy cảm này ra console hay file log.
- **Alias Endpoint `/auth/me`**:
  - Thêm endpoint `GET /auth/me` chạy song song cùng `GET /auth/profile` để trả về thông tin người dùng hiện tại an toàn.
- **Tái cấu trúc UI Settings thành dạng Tabs**:
  - **Tab "Tài khoản của tôi"**: 
    - Hiển thị thông tin cá nhân hiện thời của người dùng: Họ tên, Email, Vai trò, Trạng thái hoạt động đọc động từ `useAuth().user`.
    - Form tự đổi mật khẩu hoàn chỉnh: hỗ trợ icon mắt để ẩn/hiện mật khẩu, checklist tiêu chuẩn độ mạnh mật khẩu kiểm tra theo thời gian thực (Real-time strength checklist) đổi màu xanh khi đạt tiêu chí.
    - Cơ chế **Đăng xuất tự động (Auto Logout)**: Đổi mật khẩu thành công sẽ báo xanh lá, đợi 1.5 giây để tăng trải nghiệm người dùng, sau đó xóa token khỏi `sessionStorage` và điều hướng về trang đăng nhập `/login`.
  - **Tab "Cài đặt hệ thống"**: Bảo toàn 100% các tính năng cũ (sao lưu dữ liệu local dưới dạng JSON, khôi phục từ tệp JSON, Migration Panel di trú dữ liệu lên backend, dọn dẹp localStorage an toàn).

### Quyết định thiết kế & Giới hạn đã biết (Known limitations)
- **Hủy phiên hoạt động**: Nhờ cơ chế tự động đăng xuất phía Client (xóa token), người dùng đổi mật khẩu sẽ bị kết thúc phiên cũ ngay lập tức, đảm bảo an toàn tối đa mà không làm phức tạp hóa database schema.
- **Trạng thái sẵn sàng**: Thử nghiệm nội bộ cục bộ bằng dữ liệu giả, chưa triển khai internet công cộng và chưa sử dụng dữ liệu pháp lý thật.

## v0.6.0-user-management (22/05/2026)


### Tính năng chính (Phase 4.1: Quản lý Người dùng)
- **Hệ thống API CRUD Quản trị Người dùng**:
  - Triển khai đầy đủ các endpoint `/users` (GET, POST, PATCH, DELETE, reset-password) được bảo mật nghiêm ngặt bằng `JwtAuthGuard` + `RolesGuard` chỉ cho phép vai trò `ADMIN` truy cập.
- **Bảo mật và Phức tạp mật khẩu tạm thời**:
  - Cho phép Admin tự nhập mật khẩu tạm thời thủ công (tối thiểu 8 ký tự, bắt buộc chứa chữ hoa, chữ thường, chữ số và ký tự đặc biệt).
  - Tích hợp công cụ kiểm tra độ phức tạp của mật khẩu trong thời gian thực (live validation) tại Frontend để hỗ trợ Admin tạo mật khẩu mạnh.
  - Bảo mật tuyệt đối: Ẩn mật khẩu sau khi lưu, không bao giờ ghi nhận mật khẩu thô hoặc `passwordHash` trong Backend console log hay trả về trong Response payload.
- **Bảo vệ tài khoản tối cao và tài khoản hiện tại**:
  - Vô hiệu hóa tính năng tự khóa hoặc tự xóa tài khoản của chính quản trị viên đang đăng nhập.
  - Cơ chế chặn nghiêm ngặt trên Backend không cho phép khóa, xóa hoặc hạ cấp vai trò (`demote`) của tài khoản ADMIN cuối cùng đang hoạt động trên hệ thống.
- **Chống Trùng lặp & Chuẩn hóa email**:
  - Chuẩn hóa email trước khi lưu và khi đăng nhập bằng hàm `trim().toLowerCase()`.
  - Kiểm tra trùng lặp email và trả về mã lỗi `409 Conflict` nếu email đã tồn tại.
- **Chặn Xóa cứng theo liên kết dữ liệu (Hard Delete Safeguard)**:
  - Trước khi xóa người dùng, hệ thống kiểm tra sự tồn tại của dữ liệu liên kết trên 4 bảng nghiệp vụ: `LegalCase`, `CaseNote`, `CaseHistory`, `CaseChecklistItem`.
  - Nếu đã phát sinh dữ liệu nghiệp vụ liên kết, Backend sẽ chặn hành động xóa cứng và trả lỗi 409 Conflict. Giao diện Frontend hiển thị thông báo khuyên dùng tính năng **Khóa tài khoản** thay thế để bảo toàn tính toàn vẹn của lịch sử nghiệp vụ.
- **JWT Hardening & Khóa người dùng tức thì (Real-time Lockout)**:
  - Cấu hình lại `JwtStrategy` thực hiện truy vấn trực tiếp cơ sở dữ liệu trên mỗi request để xác minh trạng thái `isActive` và `role` hiện hành.
  - Nếu một tài khoản bị Admin khóa hoặc thay đổi vai trò, các yêu cầu API tiếp theo của tài khoản đó sẽ lập tức bị chặn hoặc áp dụng phân quyền mới theo thời gian thực mà không cần chờ Token JWT cũ hết hạn.
- **Frontend Quản trị Hiện đại**:
  - Thêm trang Quản lý tài khoản `/users` với thiết kế cao cấp, bảng thống kê thành viên trực quan kèm các badge vai trò (Rose cho Admin, Purple cho Manager, Blue cho Staff, Slate cho Viewer) và avatar tự động.
  - Sidebar hiển thị linh hoạt: ẩn menu "Quản lý tài khoản" đối với non-ADMIN.
  - Tích hợp tìm kiếm và lọc thời gian thực.
  - Toàn bộ thao tác khóa/mở khóa, đặt lại mật khẩu, đổi role, xóa tài khoản đều tích hợp hộp thoại xác nhận chi tiết.

### Quyết định thiết kế & Giới hạn đã biết (Known limitations)
- **Trạng thái sẵn sàng**: Đủ điều kiện chạy thử nội bộ cục bộ bằng dữ liệu giả.
- **Chưa dùng dữ liệu thật**: Tuyệt đối chưa dùng dữ liệu pháp lý thật hay thông tin cá nhân thực tế (PII).
- **Chưa deploy public internet**: Hệ thống chỉ chạy cục bộ (Offline/Intranet) thông qua cổng localhost để phục vụ đợt thử nghiệm.
- **Chưa có upload file thật**: Các tệp đính kèm trong hồ sơ vẫn ở dạng thông tin metadata JSON giả lập, chưa tải file vật lý thật lên máy chủ.
- **SQLite chỉ dùng cho MVP/local trial**: SQLite là hệ quản trị cơ sở dữ liệu dạng tệp tin cục bộ, chỉ phục vụ cho giai đoạn thử nghiệm MVP hiện hành.

---

## v0.5.0-safe-ops-backup-restore (22/05/2026)


### Tính năng chính (Phase 4: Safe Operations & Backup/Restore)
- **Động cơ Sao lưu & Khôi phục SQLite Khép Kín**:
  - Tích hợp script sao lưu an toàn `db:backup` đọc trực tiếp đường dẫn cơ sở dữ liệu động từ biến môi trường `DATABASE_URL` trong `.env`.
  - Tích hợp script khôi phục thông minh `db:restore` cho phép lựa chọn từ danh sách 10 bản sao lưu gần nhất.
- **Xác nhận 2 lớp (Double Confirmation)**:
  - Lớp 1: Hỏi người dùng có đồng ý ghi đè dữ liệu (`y` / `yes`).
  - Lớp 2: Yêu cầu nhập chính xác từ khóa bảo mật `RESTORE-CONFIRM`.
- **Mốc khôi phục khẩn cấp (`pre_restore_*`)**:
  - Tự động nhân bản và sao lưu cơ sở dữ liệu hiện tại trước khi thực hiện ghi đè với định dạng tệp có timestamp `pre_restore_YYYYMMDD_HHMMSS.db` để hỗ trợ rollback khẩn cấp lập tức.
- **Mật khẩu Seed động**:
  - Đọc mật khẩu trực tiếp từ cấu hình biến môi trường `.env` (`SEED_*_PASSWORD`).
  - Scoped upsert: Giới hạn nghiêm ngặt chỉ tác động và cập nhật thông tin/mật khẩu đúng 4 tài khoản seed demo mặc định.
- **Cảnh báo CORS Wildcard**:
  - Tự động phát hiện cấu hình CORS `FRONTEND_ORIGIN="*"` và in cảnh báo màu vàng có độ hiển thị cao tại console khởi động backend.
- **Tài liệu Hướng dẫn và Nghiệm thu**:
  - **RUNBOOK.md**: Cẩm nang chi tiết thiết lập môi trường, vận hành hệ thống, quy trình backup/restore/rollback và cách giải quyết xung đột cổng hoặc lỗi khóa tệp DB trên Windows.
  - **UAT_CHECKLIST.md**: Bộ kịch bản nghiệm thu trực quan từ phân quyền vai trò (RBAC) đến tính năng nâng cao và kiểm thử an toàn cơ sở dữ liệu SQLite.

### Quyết định thiết kế & Giới hạn đã biết (Known limitations)
- **Chưa deploy public internet**: Hệ thống chỉ chạy cục bộ (Offline/Intranet) thông qua cổng localhost để thử nghiệm nội bộ.
- **Chưa dùng dữ liệu thật**: Chỉ sử dụng các thông tin và tài liệu giả định (mock data). Tuyệt đối không nhập thông tin cá nhân khách hàng (PII) trong giai đoạn dùng thử này.
- **Chưa có file upload thật**: Trường `documents` của hồ sơ chỉ lưu thông tin metadata JSON giả lập, chưa tải file thực tế lên máy chủ.
- **SQLite chỉ dùng cho MVP/local trial**: SQLite là hệ quản trị cơ sở dữ liệu dạng tệp tin cục bộ, phù hợp cho thử nghiệm cục bộ MVP. Sau này sẽ chuyển đổi sang Postgres/MySQL để đảm bảo an toàn chịu tải cao hơn.

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
