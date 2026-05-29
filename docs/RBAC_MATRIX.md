# LegalFlow RBAC & Security Matrix

## 1. Role Definitions
- **ADMIN**: Quyền quản trị tối cao. Được phép thực hiện tất cả các thao tác trên hệ thống bao gồm Quản trị Người dùng (User Management), Xem Logs hệ thống (Audit Logs), Báo cáo thống kê (Analytics) và Toàn quyền quản lý Hồ sơ (Cases).
- **MANAGER**: Quyền quản lý cấp trung. Được phép truy cập các báo cáo thống kê, toàn quyền quản lý Hồ sơ (Tạo, Sửa, Xóa, Phân công) nhưng KHÔNG có quyền truy cập Audit Logs hay quản trị User.
- **STAFF**: Nhân viên nghiệp vụ. Được quyền tạo Hồ sơ và quản lý, chỉnh sửa, tải tài liệu cho các Hồ sơ do mình tạo ra hoặc được phân công (`assignedTo`). KHÔNG có quyền xóa Hồ sơ, KHÔNG có quyền xem Analytics, Audit Logs hay quản trị User.
- **VIEWER**: Quyền chỉ xem (Read-only). Được phép tìm kiếm, xem danh sách và chi tiết các hồ sơ, tải tài liệu. KHÔNG được phép thêm, sửa, xóa bất kỳ dữ liệu nào. KHÔNG có quyền xem Analytics, Audit Logs hay quản trị User.

---

## 2. Backend Endpoint Matrix

| Endpoint | Methods | Roles Allowed | Notes |
| :--- | :--- | :--- | :--- |
| `/auth/login`, `/auth/refresh` | `POST` | Public | Xác thực & cấp phát token |
| `/auth/me` | `GET` | ALL | Lấy thông tin user hiện tại |
| `/cases` | `GET` | ADMIN, MANAGER, STAFF, VIEWER | Danh sách hồ sơ (có phân trang/lọc) |
| `/cases/:id` | `GET` | ADMIN, MANAGER, STAFF, VIEWER | Chi tiết hồ sơ |
| `/cases` | `POST` | ADMIN, MANAGER, STAFF | Tạo mới hồ sơ |
| `/cases/:id` | `PATCH`, `PUT` | ADMIN, MANAGER, STAFF | Sửa hồ sơ (STAFF chỉ sửa case được gán) |
| `/cases/:id` | `DELETE` | ADMIN, MANAGER | Xóa mềm hồ sơ |
| `/cases/:id/notes`, `/status`, `/checklist` | `POST`, `PATCH` | ADMIN, MANAGER, STAFF | Cập nhật luồng xử lý/ghi chú |
| `/cases/:id/documents` | `POST` | ADMIN, MANAGER, STAFF | Tải tài liệu lên MinIO |
| `/cases/:id/documents/:docId/download` | `GET` | ADMIN, MANAGER, STAFF, VIEWER | Xin cấp Presigned URL (chặn STAFF xem case không được gán) |
| `/analytics/*` | `GET` | ADMIN, MANAGER | Bảng điều khiển thống kê |
| `/admin-audit-logs` | `GET` | ADMIN | Lịch sử truy cập & hoạt động hệ thống |
| `/users` | `GET`, `POST`, v.v. | ADMIN | Quản lý người dùng |
| `/health` | `GET` | Public | Liveness / Readiness probe |

---

## 3. Frontend Route/Component Matrix

- **Sidebar Visibility:**
  - `Analytics` (Thống kê & Phân tích): Hiện cho `ADMIN, MANAGER`.
  - `Users` (Quản lý tài khoản): Hiện cho `ADMIN`.
  - `Audit Logs` (Nhật ký hệ thống): Hiện cho `ADMIN`.
  - `Create Case` (Tạo mới): Hiện cho `ADMIN, MANAGER, STAFF`.
- **ProtectedRoute (`App.tsx`):**
  - `/analytics`: Chặn cứng cho `['ADMIN', 'MANAGER']`.
  - `/admin-logs`, `/users`: Chặn cứng cho `['ADMIN']`.
- **CaseDetail UI:**
  - **Upload Component**: Bị ẩn đối với `VIEWER` hoặc `STAFF` không có quyền phụ trách.
  - **Edit/Status/Delete Buttons**: Nút Xóa chỉ hiện với `ADMIN/MANAGER`. Cập nhật trạng thái chỉ dành cho người được uỷ quyền.
  - **Download Document**: Luôn hiện nếu người dùng có quyền xem Case đó.

---

## 4. Data Sanitization & Security Rules

### Data Leakage Prevention (MinIO Keys)
1. **Không trả `minioKey` trong API chung**: Các endpoint `GET /cases` và `GET /cases/:id` TUYỆT ĐỐI không được bao gồm key `minioKey` (đường dẫn nội bộ bucket MinIO) trong mảng `documents` của response trả về.
2. **Không trả URL tĩnh (Internal Bucket URL)**: Không lộ `MINIO_ENDPOINT` hoặc internal domain. 
3. **Không gửi kèm Presigned URL vào response danh sách**: Việc tạo URL có thời hạn quá sớm sẽ tốn tài nguyên và dễ lọt URL khi chưa thực sự click Download.
4. **Endpoint Cấp URL Riêng Biệt**: Người dùng phải gọi đến `GET /cases/:id/documents/:docId/download`. Backend sẽ:
   - Kiểm tra Authentication (JWT).
   - Kiểm tra RBAC Roles (Có quyền Viewer+ không).
   - Kiểm tra Logic (Với Staff, hồ sơ này có phải do họ phụ trách không).
   - Sinh Presigned-URL có giới hạn thời gian (VD: 60 phút) và trả về thông qua giao thức an toàn.
