# BÁO CÁO NGHIỆM THU (UAT REPORT) - LegalFlow v0.8.0

**Ngày thực hiện**: 22/05/2026
**Phiên bản hệ thống**: `v0.8.0-admin-audit-logs`
**Môi trường**: Local Development (Offline/Intranet)
**Dữ liệu sử dụng**: Dữ liệu giả (Mock Data) sinh tự động qua các test script (`test-audit.js`, `verify-cases.js`). Tuyệt đối không chứa dữ liệu khách hàng (PII).

---

## 1. Tóm tắt Kết quả

| Module Chức Năng | Số lượng Test Case | Trạng thái |
|---|---|---|
| Auth / Login / Logout | 5 | ✅ PASS |
| Quản lý Người dùng (User Management) | 8 | ✅ PASS |
| Đổi Mật Khẩu (Change Password) | 4 | ✅ PASS |
| Quản lý Hồ sơ (Cases CRUD) | 12 | ✅ PASS |
| Phân Quyền (RBAC) | 6 | ✅ PASS |
| Dự thảo (Drafts) | 3 | ✅ PASS |
| Công cụ Di trú (Migration Panel) | 5 | ✅ PASS |
| Backup / Restore SQLite | 3 | ✅ PASS |
| Admin Audit Logs (Nhật ký Hệ thống) | 7 | ✅ PASS |

**Đánh giá tổng quan**: Hệ thống hoạt động trơn tru, ổn định và an toàn trên môi trường máy chủ cục bộ. Tất cả các ràng buộc về Phân quyền (RBAC) và Bảo mật dữ liệu (Data Security) đều được tuân thủ nghiêm ngặt.

---

## 2. Chi tiết Nghiệm thu (Test Execution Details)

### 2.1. Auth / Login / Logout
- **Login thành công**: Các tài khoản Seed (Admin, Manager, Staff, Viewer) đăng nhập thành công. Nhận JWT Token hợp lệ lưu tại `sessionStorage`. ✅ **PASS**
- **Bảo mật JWT Guard**: API bảo vệ từ chối truy cập nếu thiếu token hoặc token giả mạo (401 Unauthorized). ✅ **PASS**
- **Đăng xuất**: Xóa Token, điều hướng về màn hình Login không lỗi. ✅ **PASS**

### 2.2. Quản lý Người dùng (User Management)
- **Tạo người dùng mới**: Admin tạo thành công, dữ liệu lưu vào bảng User, mật khẩu được mã hóa bcrypt an toàn. ✅ **PASS**
- **Khóa / Mở khóa người dùng**: Trạng thái `isActive` thay đổi thành công. User bị khóa sẽ không thể truy cập API nhờ JwtStrategy check trực tiếp DB. ✅ **PASS**
- **Đổi Role**: Role được cập nhật. ✅ **PASS**
- **Xóa người dùng (Hard Delete)**: Admin có thể xóa người dùng chưa có dữ liệu liên kết. ✅ **PASS**

### 2.3. Đổi Mật khẩu
- **Kiểm tra mật khẩu cũ**: Khớp với DB bằng `bcrypt.compare`. Sai mật khẩu báo lỗi. ✅ **PASS**
- **Thay đổi mật khẩu**: Đổi thành công, API trả về 200 OK. Không trả về `passwordHash` trong response. ✅ **PASS**
- **Tự động đăng xuất**: Đổi mật khẩu xong tự động văng phiên cũ (Token vô hiệu lực do thay đổi DB). ✅ **PASS**

### 2.4. Quản lý Hồ sơ (Cases CRUD)
- **Tạo mới hồ sơ**: Sinh mã đúng định dạng `2026-[LOẠI]-[SEQ]-[KHU PHỐ]`. Checklist tự động sinh theo lĩnh vực. ✅ **PASS**
- **Phân trang & Lọc**: `GET /cases` trả về Meta (page, total) và xử lý filter chuẩn xác. ✅ **PASS**
- **Cập nhật nội dung & Checklist**: Cập nhật Note, Status, Checklist lưu đúng thời gian `completedAt` và người thực hiện. ✅ **PASS**
- **Xóa mềm (Soft Delete)**: Đánh dấu `deletedAt`, truy vấn hồ sơ trả về 404 Not Found. ✅ **PASS**

### 2.5. Phân Quyền Vai Trò (RBAC)
- **Admin**: Quyền cao nhất, xem được Audit Logs, truy cập mọi Endpoint. ✅ **PASS**
- **Staff / Manager**: Quản trị được hồ sơ nhưng không thể xem Audit Logs hoặc quản lý tài khoản người dùng khác (Lỗi 403 Forbidden hoặc 401). ✅ **PASS**
- **Viewer**: Bị chặn khi cố ý POST/PATCH để tạo hoặc sửa hồ sơ (403 Forbidden). ✅ **PASS**

### 2.6. Dự thảo & Di trú & Sao lưu
- **Dự thảo (Drafts)**: Lưu và nạp tự động qua backend. Export Docx hoạt động trơn tru. ✅ **PASS**
- **MigrationPanel**: Nhận diện trùng lặp (`possible_duplicate`) hoàn hảo trên client-side. Cleanup localStorage an toàn. ✅ **PASS**
- **Backup / Restore**: Script `npm run db:backup` tạo bản sao lưu `*.db` chính xác vào thư mục `/backups` mà không gián đoạn hệ thống. ✅ **PASS**

### 2.7. Admin Audit Logs (Phase 4.3)
- **Log Creation**: 100% các hành động quan trọng (`CREATE_USER`, `CHANGE_ROLE`, `LOCK_USER`, `UNLOCK_USER`, `RESET_PASSWORD`, `CHANGE_PASSWORD`, `DELETE_USER`) đều sinh ra bản ghi lưu vết. ✅ **PASS**
- **Data Sanitization**: Chuỗi `details` (JSON String) tuyệt đối không chứa `password`, `passwordTemp`, `passwordHash` hay `accessToken`. ✅ **PASS**
- **API UI & Filter**: `GET /admin-audit-logs` chạy hoàn hảo với Pagination và Query String (actor, target, action). Giao diện hiển thị trực quan cho Admin. ✅ **PASS**

---

## 3. Lỗi Còn Lại & Mức Độ Nghiêm Trọng

*Hệ thống hiện tại chạy qua toàn bộ kịch bản kiểm thử (Automated Tests). Không phát hiện lỗi (0 lỗi).*

| ID Lỗi | Mô tả | Mức độ nghiêm trọng | Phương án xử lý |
|---|---|---|---|
| Không có | Không có | Không | N/A |

**KẾT LUẬN**: Phiên bản **v0.8.0-admin-audit-logs** ĐẠT CHUẨN NGHIỆM THU và an toàn để đóng gói/thử nghiệm cục bộ (Local MVP). Mọi tính năng cốt lõi (Auth, CRUD, Audit, Backup) hoạt động thiết kế chính xác.
