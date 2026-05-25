# DEPLOYMENT PLAN - LegalFlow (Phase 6: Secure Internet Trial)

Tài liệu này mô tả kiến trúc triển khai để đưa hệ thống LegalFlow MVP ra public internet với mục tiêu **chạy thử nghiệm nội bộ có kiểm soát (Zero-Trust/Private Tunnel)**.

> [!WARNING]
> Kiến trúc này chỉ phục vụ mục đích Trial MVP. Tuyệt đối không đưa dữ liệu thật vào hệ thống và không xem đây là Production chính thức.

## 1. Kiến trúc Triển khai (Private Tunnel / Zero Trust)

Mô hình này không yêu cầu mở port công khai trên Router và không cần thuê VPS. Mọi kết nối đi qua đường hầm (Tunnel) bảo mật từ máy local ra internet.

```mermaid
graph TD
    Client[Người dùng (Trình duyệt)] -- HTTPS --> Tunnel[Tunnel Service (ngrok/Cloudflare/Tailscale)]
    Tunnel -- "Chuyển tiếp local" --> FE[Frontend (Port 5173)]
    Tunnel -- "Chuyển tiếp local" --> BE[Backend API (Port 3000)]
    FE -- "API Requests" --> BE
    BE -- "ORM" --> DB[(SQLite dev.db)]
```

### 1.1 Cấu hình URL (Khuyến nghị 2 Domain/Subdomain)
Để tránh xung đột đường dẫn, kiến trúc Tunnel nên được thiết lập trên hai URL riêng biệt:
- **Frontend URL:** `https://legalflow-demo.example.com`
- **Backend API URL:** `https://api.legalflow-demo.example.com`

*Khi cấu hình tunnel, Backend (127.0.0.1:3000) sẽ được map vào domain `api`, và Frontend Static Server (dist folder) sẽ được map vào domain Frontend.*

## 2. Quy trình Khởi chạy (Production Mode)

Hệ thống LegalFlow trong Phase 6 yêu cầu khởi chạy bằng các lệnh build production để mô phỏng chính xác môi trường thực tế.

### 2.1 Backend
1. **Môi trường:**
   - `.env` cấu hình `NODE_ENV=production` và `HOST=127.0.0.1`.
   - `FRONTEND_ORIGIN` được trỏ chính xác đến danh sách các domain Frontend hợp lệ, cách nhau bởi dấu phẩy.
2. **Khởi chạy:**
   ```bash
   cd legalflow-backend
   npm run build
   npm run start:prod
   ```
   *Lưu ý: NestJS sẽ bind vào `127.0.0.1:3000`. Không ai từ mạng LAN/Internet có thể truy cập trực tiếp ngoại trừ qua Tunnel.*

### 2.2 Frontend
1. **Môi trường:**
   - `.env.production` (hoặc `.env.local` nếu override) cấu hình `VITE_API_BASE_URL` trỏ vào domain API của Backend.
2. **Khởi chạy:**
   ```bash
   npm run build
   ```
   - Quá trình này sẽ tạo ra thư mục `dist/`.
   - Sử dụng một Static File Server cục bộ (như `serve`, `http-server` hoặc cấu hình Nginx/Tunnel trực tiếp) để host thư mục `dist/`. Không dùng `npm run dev`.

## 3. Cấu hình Bảo mật Mạng (Firewall & CORS)

- **CORS:** 
  Backend chỉ chấp nhận các truy cập gửi từ đúng origin đã khai báo (VD: `https://legalflow-demo.example.com`). Wildcard `*` đã bị vô hiệu hóa. Request từ domain khác sẽ nhận `CORS Policy: Origin not allowed`.
- **Firewall:**
  Port `3000` của máy tính đang chạy Backend phải đóng chặt. Máy tính nội bộ hoặc Tunnel chỉ giao tiếp với Backend qua giao diện loopback `127.0.0.1`.
- **Giao thức:**
  Không được phép truy cập qua HTTP (không mã hóa). Hệ thống Tunnel phải chịu trách nhiệm cung cấp chứng chỉ SSL và chuyển hướng tự động sang HTTPS.
