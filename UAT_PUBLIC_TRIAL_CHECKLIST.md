# Bảng Kiểm thử Nghiệm thu Dành cho Phiên bản Public Trial (UAT_PUBLIC_TRIAL_CHECKLIST)

> [!TIP]
> Sử dụng tài liệu này để kiểm tra chéo độ ổn định và tính bảo mật của hệ thống khi chạy trên môi trường Public Internet qua Private Tunnel.

| Hạng mục Kiểm tra | Trạng thái | Ghi chú / Người test |
| :--- | :---: | :--- |
| **1. Khởi động (Deployment & Build)** | | |
| Frontend Production Build (Không lỗi `npm run build`) | `[ ]` | |
| Backend Production Build (Không lỗi `npm run build`) | `[ ]` | |
| **2. Truy cập & Mạng lưới (Network & Access)** | | |
| Truy cập được giao diện người dùng qua Public HTTPS URL | `[ ]` | |
| Gọi API thành công thông qua HTTPS endpoint (Tích hợp thành công) | `[ ]` | |
| Thử truy cập bằng URL lạ / Origin lạ bị chặn bởi CORS | `[ ]` | |
| Backend Port 3000 **KHÔNG** thể truy cập trực tiếp từ Internet (Bị chặn ở cấp độ Tunnel/Firewall) | `[ ]` | |
| **3. Xác thực & Phân quyền (Auth & RBAC)** | | |
| Đăng nhập (Login) thành công với mật khẩu đúng | `[ ]` | |
| Đăng xuất (Logout) thành công, Session Storage bị xóa sạch | `[ ]` | |
| Rate Limit chặn thành công (Lỗi 429) khi liên tục Spam Request Login | `[ ]` | |
| Tài khoản bị khóa không thể đăng nhập (Lỗi 401/403) | `[ ]` | |
| Helmet Headers xuất hiện đầy đủ trong Network Response | `[ ]` | |
| Không Response API nào để lộ mật khẩu, JWT Secret, Token hay PasswordHash | `[ ]` | |
| **4. Hệ thống Audit & Dữ liệu** | | |
| `AdminAuditLog` ghi nhận sự kiện `LOGIN_SUCCESS` và `LOGIN_FAILED` chính xác từ trial session | `[ ]` | |
| Đã tiến hành Sao lưu DB thành công (chạy `npm run db:backup`) SAU KHI phiên trial kết thúc | `[ ]` | |
