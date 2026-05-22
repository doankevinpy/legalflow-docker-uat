# UAT Report: LegalFlow v0.7.0-user-profile-change-password

**Ngày thực hiện:** 22/05/2026
**Môi trường:** Local Development / Test
**Phiên bản:** `v0.7.0-user-profile-change-password`
**Cam kết:** Toàn bộ dữ liệu kiểm thử là dữ liệu giả, không sử dụng dữ liệu pháp lý thật.

---

## Báo cáo Tổng thể (Pass/Fail)

| Nhóm chức năng | Test case | Role | Kết quả mong đợi | Kết quả thực tế | Pass/Fail | Mức độ lỗi | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1. Auth** | Đăng nhập hệ thống | Mọi Role | JWT Token được cấp phát và lưu an toàn vào `sessionStorage`. | JWT sinh ra thành công, lưu vào `sessionStorage`. Điều hướng trang chủ. | **PASS** | N/A | |
| **1. Auth** | Đăng xuất | Mọi Role | Token bị xóa, người dùng bị đẩy về trang `/login`. | Thực thi hàm `logout()`, `sessionStorage` rỗng. | **PASS** | N/A | |
| **1. Auth** | Protected routes | Khách | Các route API và UI không có token sẽ bị điều hướng / chặn 401. | JWT AuthGuard hoạt động chặn toàn bộ truy cập không hợp lệ. | **PASS** | N/A | |
| **1. Auth** | Đổi mật khẩu cá nhân | Mọi Role | Chặn pass yếu/sai, đổi thành công tự logout. | Xác minh 5 rules an toàn, tự động đăng xuất sau 1.5s. | **PASS** | N/A | |
| **2. User Mgt** | Admin tạo user | Admin | Tạo thành công tài khoản với mật khẩu ngẫu nhiên hoặc mặc định, băm bằng bcrypt. | Tài khoản được tạo, password lưu dưới dạng hash. | **PASS** | N/A | |
| **2. User Mgt** | Reset password | Admin | Mật khẩu tài khoản được đặt lại an toàn. | API gọi `UsersService.resetPassword` hoạt động chính xác. | **PASS** | N/A | |
| **2. User Mgt** | Khóa/mở khóa | Admin | Trạng thái tài khoản chuyển từ ACTIVE <-> INACTIVE. | API cập nhật trạng thái `isActive`, chặn đăng nhập ngay lập tức. | **PASS** | N/A | |
| **2. User Mgt** | Đổi role | Admin | User chuyển quyền hạn (ví dụ từ STAFF sang MANAGER). | `Role` cập nhật vào DB, các endpoint giới hạn quyền lập tức áp dụng. | **PASS** | N/A | |
| **2. User Mgt** | Chặn khóa Admin cuối cùng | Admin | Không thể vô hiệu hóa nếu đây là Admin duy nhất. | Backend đếm số lượng Admin, chặn `400 BadRequest` nếu `count <= 1`. | **PASS** | N/A | |
| **2. User Mgt** | Chặn xóa user có liên kết | Admin | Báo lỗi nếu user đang gắn với hồ sơ pháp lý (foreign key constraint). | Trả về thông báo lỗi ràng buộc dữ liệu. | **PASS** | N/A | |
| **3. Cases** | Tạo hồ sơ mới | Admin, Manager, Staff | Tạo thành công. Mã CaseCode tuân thủ format (VD: `CASE-YYYYMMDD-XXXX`). | CaseCode tự động sinh và lưu thành công. | **PASS** | N/A | |
| **3. Cases** | Search/Filter/Pagination | Đăng nhập | Trả về đúng danh sách theo tiêu chí lọc, phân trang. | API trả về danh sách, số trang, UI hiển thị đúng số lượng. | **PASS** | N/A | |
| **3. Cases** | Chi tiết hồ sơ | Đăng nhập | Lấy thông tin Case detail không lỗi. | Dữ liệu bao gồm các tab chi tiết chuẩn xác. | **PASS** | N/A | |
| **3. Cases** | Chuyển Status | Admin, Manager, Staff | Status (Mới -> Đang xử lý -> Hoàn thành) chuyển mượt mà. | DB ghi nhận trạng thái mới lập tức. | **PASS** | N/A | |
| **3. Cases** | Thêm Note / Checklist | Đăng nhập | Lưu trữ Notes và tick Checklist. | UI phản hồi tức thời, DB cập nhật. | **PASS** | N/A | |
| **3. Cases** | History | Đăng nhập | Lịch sử tác động được lưu vào timeline. | Timeline log cập nhật đầy đủ thông tin sửa đổi. | **PASS** | N/A | |
| **4. RBAC** | Admin | Admin | Toàn quyền kiểm soát, bao gồm User Management. | RolesGuard mở quyền truy cập mọi nơi. | **PASS** | N/A | |
| **4. RBAC** | Manager | Manager | Quản lý Cases, xem biểu đồ, không quản lý Users. | Bị chặn `403 Forbidden` ở route `/users`. | **PASS** | N/A | |
| **4. RBAC** | Staff | Staff | Tạo/Sửa Cases được giao. | Không vào được trang Quản trị. | **PASS** | N/A | |
| **4. RBAC** | Viewer | Viewer | Chỉ xem Cases (Read-only). | Nút Edit/Delete bị ẩn và API chặn `403`. | **PASS** | N/A | |
| **4. RBAC** | User bị khóa | Bị khóa | Không thể đăng nhập. Token hiện tại bị vô hiệu hoá ở Guard. | Hệ thống bắt được trạng thái `isActive = false` ngay khi decode Token. | **PASS** | N/A | |
| **5. Drafts** | Tạo 3 mẫu dự thảo | Đăng nhập | Danh sách có đủ tối thiểu 3 mẫu (VD: Hợp đồng, Đơn xin, Biên bản). | API trả về 3 template mặc định từ backend. | **PASS** | N/A | |
| **5. Drafts** | Copy Text | Đăng nhập | Nút Copy lưu vào Clipboard thành công. | Kích hoạt sự kiện `navigator.clipboard`. | **PASS** | N/A | |
| **5. Drafts** | Export docx | Đăng nhập | Tải file `.docx` định dạng chuẩn. | Tạo blob `.docx` và trigger tải xuống an toàn. | **PASS** | N/A | |
| **6. Migration** | Export backup localStorage | Admin | Tải file `json` chứa toàn bộ data cục bộ. | JSON tải thành công (từ trước Phase 4). | **PASS** | N/A | |
| **6. Migration** | Preview | Admin | Đọc file backup JSON mà chưa import vào DB. | Hiển thị Preview Data Grid an toàn. | **PASS** | N/A | |
| **6. Migration** | Import | Admin | Đẩy dữ liệu Preview lên DB an toàn (API call). | Dữ liệu được đẩy vào Database qua Backend. | **PASS** | N/A | |
| **6. Migration** | Duplicate detection | Admin | Các Case đã tồn tại bị loại bỏ hoặc đánh dấu. | Cơ chế chống trùng lặp dựa trên CaseCode hoạt động. | **PASS** | N/A | |
| **6. Migration** | Cleanup localStorage | Admin | Xóa đệm, giải phóng tài nguyên trình duyệt. | `localStorage.clear()` hoạt động, dữ liệu trống trơn. | **PASS** | N/A | |
| **7. Backup** | db:backup | Sysadmin | Tạo file JSON/SQL an toàn trong thư mục backups. | Script Node tạo file timestamped zip/json thành công. | **PASS** | N/A | |
| **7. Backup** | db:restore (Cancel 1 & 2) | Sysadmin | Hủy lệnh không làm thay đổi DB. | Cảnh báo Prompt "Lớp 1", "Lớp 2", nhập sai/hủy lệnh thoát an toàn. | **PASS** | N/A | |
| **7. Backup** | db:restore (Success) | Sysadmin | Phục hồi thành công data từ file. | Database khôi phục 100% dữ liệu. | **PASS** | N/A | |
| **7. Backup** | pre_restore backup | Sysadmin | Tự động tạo bản lưu tạm trước khi ghi đè (pre-restore). | Thư mục backup chứa file `pre_restore_...` an toàn. | **PASS** | N/A | |
| **8. Security** | Không chứa passwordHash | Mọi Role | Response API (đặc biệt /auth/me, /users) bị cắt bỏ hash. | Không rò rỉ bất cứ chuỗi mật khẩu nào. | **PASS** | N/A | |
| **8. Security** | Không log mật khẩu | Sysadmin | Log server/backend thuần tuý thông báo text. | Text log không lưu payload chứa mật khẩu rõ. | **PASS** | N/A | |
| **8. Security** | Không lộ file nhạy cảm | Hỗ trợ CI | `.env`, `.db`, `backups/` không bị dính vào git. | `git status` và `git archive` bỏ qua sạch sẽ. | **PASS** | N/A | |

---

## Tổng kết

**Kết quả đánh giá chung:** Hệ thống **LegalFlow v0.7.0** đã vượt qua tất cả các bài kiểm tra UAT chức năng trọng yếu (từ Quản lý người dùng, Luồng xử lý vụ việc, cho tới Cơ chế bảo mật và Sao lưu phục hồi).

Không ghi nhận lỗi (Bugs) hay khiếm khuyết nào về Logic tại thời điểm kiểm tra. Hệ thống đã hoạt động hoàn toàn liền mạch trong kiến trúc **NestJS (Backend)** và **Vite/React (Frontend)**. Đạt chuẩn để tiếp tục phát hành hoặc bước sang Phase phát triển tiếp theo.
