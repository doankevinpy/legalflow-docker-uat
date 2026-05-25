# Danh sách Kiểm tra Bảo mật Trước Public Trial (Pre-Public Trial Security Checklist)

> [!WARNING]
> Hoàn thành 100% checklist này trước khi gửi URL Public cho bất cứ ai tham gia thử nghiệm.

## 1. Dữ liệu & Cơ sở dữ liệu (Database)
- [ ] Chạy lệnh sao lưu: `npm run db:backup` để đảm bảo có bản Snapshot an toàn trước giờ G.
- [ ] Không có dữ liệu thật: Đảm bảo toàn bộ Hồ sơ, người dùng đang lưu trong SQLite đều là dữ liệu giả, ẩn danh (Dummy Data).
- [ ] Xác nhận không có thao tác upload tài liệu thật (Hệ thống MVP chưa mã hóa file trên đĩa).

## 2. Quản trị Tài khoản (Accounts)
- [ ] **Khởi tạo lại JWT_SECRET:** Cập nhật biến `JWT_SECRET` trong `.env` thành một chuỗi ngẫu nhiên, dài và phức tạp (VD: dùng `openssl rand -base64 32`). Khởi động lại Backend.
- [ ] **Vô hiệu hóa Seed Accounts:** Khóa (Lock) hoặc đổi mật khẩu toàn bộ các tài khoản Seed mặc định (`admin@legalflow.local`, `manager@...`, `staff@...`, v.v.).
- [ ] **Tài khoản riêng lẻ:** Đã tạo tài khoản với mật khẩu mạnh riêng biệt cho từng cá nhân tham gia Trial. Không dùng chung tài khoản.

## 3. Cấu hình Mạng & Hệ thống (Network & Settings)
- [ ] **Chạy Production Mode:** Xác nhận đang dùng `npm run start:prod` (Backend) và build phục vụ từ thư mục `dist/` (Frontend). Không dùng Dev Server (`npm run dev`).
- [ ] **Khóa Port 3000:** Đảm bảo `HOST=127.0.0.1` trong `.env` của Backend. Không bind ra `0.0.0.0`. Không mở Port 3000 trên Windows Firewall/Router.
- [ ] **HTTPS Bắt buộc:** Xác nhận URL Public được phân phối bởi Tunnel/Proxy đã có chứng chỉ SSL (bắt đầu bằng `https://`).
- [ ] **CORS Kỷ luật:** Xác nhận `FRONTEND_ORIGIN` trong `.env` Backend đang được set đúng chính xác domain Frontend. Không dùng `*`.

## 4. Kiểm tra Nhanh (Smoke Test)
- [ ] Thử truy cập từ một thiết bị ẩn danh/mạng di động (4G) vào URL Public. Đảm bảo giao diện hiện lên và kết nối bảo mật (Biểu tượng khóa ổ khóa).
- [ ] Thử đăng nhập sai mật khẩu 6 lần liên tiếp. Đảm bảo hệ thống trả về thông báo lỗi **429 (Bạn đã thao tác quá nhiều lần...)** - chứng nhận Rate Limit (Throttler) đang hoạt động chuẩn xác.
- [ ] Xác nhận Admin Audit Logs đang ghi nhận sự kiện `LOGIN_FAILED` khi đăng nhập sai.
- [ ] Xác nhận hệ thống không ghi nhận mật khẩu, token dạng raw text vào trong bảng log ở Database.
