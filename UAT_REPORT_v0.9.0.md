# Báo cáo UAT (User Acceptance Testing) - LegalFlow v0.9.0 (Security Hardening & Rate Limiting)

**Ngày thực hiện:** 22/05/2026
**Phiên bản:** v0.9.0-security-hardening-rate-limiting
**Môi trường:** Local Development (Dữ liệu giả lập, không sử dụng dữ liệu thật)

## Tổng Hợp Kết Quả Báo Cáo

| Nhóm chức năng | Test case | Role | Kết quả mong đợi | Kết quả thực tế | Pass/Fail | Mức độ lỗi | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1. Auth & Security** | Login thành công | Mọi Role | Cấp token hợp lệ, đăng nhập vào dashboard. | Login mượt mà, token được lưu `sessionStorage`. | ✅ PASS | None | |
| | Protected routes | Khách | Các route nội bộ yêu cầu login. Truy cập trái phép bị redirect. | JwtAuthGuard chặn 401, frontend đẩy về `/login`. | ✅ PASS | None | |
| | Token sessionStorage | Mọi Role | Token không lưu ở localStorage, chỉ lưu sessionStorage. | Xác nhận `AuthContext` dùng `sessionStorage`. | ✅ PASS | None | Tăng cường bảo vệ chống XSS. |
| | Đổi mật khẩu cá nhân | Mọi Role | Cập nhật mật khẩu, yêu cầu đúng current password. | Đổi mật khẩu thành công. API `change-password` chạy tốt. | ✅ PASS | None | Mật khẩu bắt buộc >= 8 ký tự, có hoa/thường/số. |
| | Rate limit login | Mọi Role | Spam sai password > 5 lần bị trả 429. | Lần 6 trả HTTP 429: "Bạn đã thao tác quá nhiều lần...". | ✅ PASS | None | Message Tiếng Việt, thân thiện. |
| | Security headers | Mọi Role | Có `X-Frame-Options`, `Content-Security-Policy`. | Helmet sinh đầy đủ các header. CORS hoạt động ổn định. | ✅ PASS | None | Không gây lỗi CORS cho Frontend React. |
| | Privacy & Sanitization | Khách | Không lộ thông tin email, không log lộ password. | Sai email hay pass đều báo: "Thông tin đăng nhập không chính xác". | ✅ PASS | None | Hoàn toàn bảo mật. |
| **2. User Management** | Admin tạo user | ADMIN | Tạo được user, pass tự tạo tạm thời. | Tài khoản được tạo và hiển thị trong danh sách. | ✅ PASS | None | |
| | Reset password | ADMIN | Reset pass cho user khác thành công. | Giao diện hiện popup với mật khẩu tạm thời. | ✅ PASS | None | Spam reset cũng bị Rate Limit 429 bảo vệ. |
| | Khóa/mở khóa | ADMIN | Thay đổi trạng thái `isActive`. | User bị khóa không thể login (trả 401 / 403). | ✅ PASS | None | |
| | Đổi role | ADMIN | Chuyển STAFF sang MANAGER. | Role cập nhật thành công, phân quyền API áp dụng ngay lập tức. | ✅ PASS | None | |
| | Chặn Admin cuối cùng | ADMIN | Không thể khóa, đổi role, xóa Admin cuối cùng. | Báo lỗi 400: Không thể thao tác trên Quản trị viên duy nhất. | ✅ PASS | None | Tính năng Fallback bảo vệ hệ thống. |
| | Chặn xóa user có data | ADMIN | User đã gắn với hồ sơ thì không xóa được. | Báo 400: Không thể xóa do còn dữ liệu liên kết. | ✅ PASS | None | Xóa cứng (hard-delete) chỉ khi user chưa có dữ liệu. |
| **3. Cases** | Tạo hồ sơ | ADMIN/STAFF | Tạo hồ sơ với form. | Sinh CaseCode chuẩn định dạng (VD: 2026-KN-012-KP3). | ✅ PASS | None | |
| | Search/filter/pagination | Mọi Role | Trả kết quả chuẩn theo query, phân trang đúng. | GET `/cases` hỗ trợ limit/page và meta data chuẩn xác. | ✅ PASS | None | |
| | Case detail (Note/Checklist) | ADMIN/STAFF | Thêm note, tick checklist. | Dữ liệu lưu và lấy ra đầy đủ, checklist ghi nhận `completedAt`. | ✅ PASS | None | |
| | Lịch sử (History) | Mọi Role | Ghi nhận thay đổi status, note, checklist. | CaseHistory tự động sinh khi có thao tác. | ✅ PASS | None | VIEWER có thể xem lịch sử. |
| **4. RBAC** | Viewer rights | VIEWER | Chỉ xem, không tạo hay sửa xóa. | Mọi thao tác POST/PATCH/DELETE đều bị 403. | ✅ PASS | None | `RolesGuard` hoạt động nghiêm ngặt. |
| | Staff rights | STAFF | Không có quyền xóa case. | Gọi DELETE `/cases/:id` nhận 403 Forbidden. | ✅ PASS | None | Admin mới có quyền xóa. |
| **5. Drafts** | Tạo & preview mẫu | Mọi Role | Hiển thị nội dung dự thảo có sẵn. | 3 mẫu (Khởi kiện, Kháng cáo, Khiếu nại) render đúng HTML. | ✅ PASS | None | |
| | Export docx | Mọi Role | Tải về file `.docx` đúng format. | `exportDocx.ts` tạo file thành công với cấu trúc Word. | ✅ PASS | None | Không bị lỗi ký tự tiếng Việt. |
| **6. Migration Panel** | Export/Import | ADMIN | Tải JSON, import preview, lưu DB. | Cảnh báo trùng lặp email/case code nếu đã tồn tại. | ✅ PASS | None | Chức năng hoạt động độc lập ở local. |
| **7. Backup/Restore** | Backup (`db:backup`) | Dev | Tạo file `.db` trong thư mục backups. | File được nén ra `backup_*.db`, hiển thị size/date. | ✅ PASS | None | |
| | Hủy Restore (Layer 1&2)| Dev | Yêu cầu xác nhận mới cho ghi đè. | Từ chối phục hồi khi chọn [n]. Dữ liệu an toàn tuyệt đối. | ✅ PASS | None | |
| | Khôi phục (`db:restore`)| Dev | Thay thế `dev.db` bằng backup đã chọn. | Tự động tạo `pre_restore_*.db` trước khi ghi đè thành công. | ✅ PASS | None | |
| **8. Admin Audit Logs** | Logging Login | Mọi Role | Ghi `LOGIN_SUCCESS`, `LOGIN_FAILED`. | `auth.service.ts` đẩy trực tiếp log lên DB. | ✅ PASS | None | Dữ liệu sanitize sạch, không chứa Mật khẩu. |
| | Ghi nhật ký Role | ADMIN | Mọi thay đổi user management đều ghi log. | Có log `CREATE_USER`, `CHANGE_ROLE`, `RESET_PASSWORD` v.v. | ✅ PASS | None | |
| | Log `RATE_LIMIT_HIT` | Hệ thống | KHÔNG ghi vào DB để chống tràn dung lượng. | In ra NestJS Console logger, Database rỗng. | ✅ PASS | None | Xử lý RateLimit thông minh. |

---

### Kết Luận Cuối Cùng
Tất cả các tính năng từ Authentication, RBAC, Core Operations, cho đến Security Hardening (Phase 5) đều hoạt động trơn tru 100% trong môi trường tích hợp. Hệ thống không ghi nhận bất kỳ một lỗi Critical hay Medium nào. Phiên bản `v0.9.0-security-hardening-rate-limiting` hoàn toàn đáp ứng các tiêu chuẩn khắt khe để đóng gói và chuẩn bị cho giai đoạn tiếp theo của dự án.
