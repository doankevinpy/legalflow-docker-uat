# Bảng Kiểm thử Nghiệm thu Dành cho Phiên bản Public Trial (UAT_PUBLIC_TRIAL_CHECKLIST)

> [!TIP]
> Sử dụng tài liệu này để kiểm tra chéo độ ổn định và tính bảo mật của hệ thống khi chạy trên môi trường Public Internet qua Private Tunnel.

| Hạng mục Kiểm tra | Trạng thái | Ghi chú / Người test |
| :--- | :---: | :--- |
| **1. Khởi động (Deployment & Build)** | | |
| Frontend Production Build (Không lỗi `npm run build`) | `[ ]` | |
| Backend Production Build (Không lỗi `npm run build`) | `[ ]` | |
| Đã kiểm tra `.env` và `.env.local` không bị Git track | `[ ]` | |
| Đã đổi `JWT_SECRET` bằng chuỗi ngẫu nhiên mạnh | `[ ]` | |
| **2. Truy cập & Mạng lưới (Network & Access)** | | |
| Truy cập được giao diện người dùng qua Public HTTPS URL | `[ ]` | |
| Gửi API thành công thông qua HTTPS endpoint | `[ ]` | |
| Kiểm tra CORS: Test `curl` với Origin lạ bị chặn hoàn toàn | `[ ]` | |
| Backend Port 3000 **KHÔNG** thể truy cập trực tiếp từ Internet | `[ ]` | |
| **3. Xác thực & Phân quyền (Auth & RBAC)** | | |
| Đăng nhập (Login) thành công với tài khoản Test | `[ ]` | |
| Đăng xuất (Logout) thành công, Session Storage bị xóa sạch | `[ ]` | |
| Xác nhận User Trial KHÔNG mang quyền `ADMIN` (Chỉ dùng VIEWER hoặc STAFF) | `[ ]` | |
| Rate Limit chặn thành công (Lỗi 429) khi liên tục Spam Request Login | `[ ]` | |
| Helmet Headers xuất hiện đầy đủ trong Network Response | `[ ]` | |
| Token KHÔNG nằm trong Response Body, LocalStorage, Query String, hoặc Backend logs | `[ ]` | |
| Tuyệt đối KHÔNG lộ `passwordHash`, `JWT_SECRET`, hay `DATABASE_URL` trong Response/Logs | `[ ]` | |
| **4. Hệ thống Audit & Dữ liệu** | | |
| `AdminAuditLog` ghi nhận sự kiện `LOGIN_SUCCESS` và `LOGIN_FAILED` chính xác | `[ ]` | |
| Đã tiến hành Sao lưu DB thành công (chạy `npm run db:backup`) SAU KHI phiên trial kết thúc | `[ ]` | |
