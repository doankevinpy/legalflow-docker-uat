# Hướng Dẫn Thiết Lập Public Trial bằng ngrok (Zero Trust)

Tài liệu này cung cấp hướng dẫn cách thiết lập 2 đường hầm (tunnels) thông qua `ngrok` nhằm phục vụ đợt Public Trial cho hệ thống LegalFlow.

> [!IMPORTANT]
> Cảnh Báo An Toàn: 
> - Tuyệt đối **không** lưu ngrok authtoken, file `ngrok.yml`, hoặc cấu hình `.env` thật vào Git.
> - **Chỉ gửi frontend public URL** cho người tham gia. Không gửi backend URL cho người dùng cuối.

## 1. Cài Đặt ngrok
- **Windows (Khuyên dùng qua Scoop hoặc Choco):**
  ```powershell
  choco install ngrok
  ```
- Hoặc tải tệp `.zip` trực tiếp từ [trang chủ ngrok](https://ngrok.com/download), giải nén và đưa vào biến môi trường `PATH`.

## 2. Xác Thực và Cấu Hình Tunnels (Thủ công)
- Lấy mã **Authtoken** từ bảng điều khiển ngrok.
- Mở terminal, chạy lệnh sau để thiết lập token cục bộ:
  ```powershell
  ngrok config add-authtoken <MÃ_TOKEN_CỦA_BẠN>
  ```
- Cấu hình file `ngrok.yml` song song tại thư mục mặc định của máy (ví dụ: `C:\Users\<Tên_User>\AppData\Local\ngrok\ngrok.yml`):
  ```yaml
  version: "2"
  authtoken: <MÃ_TOKEN_CỦA_BẠN>
  tunnels:
    legalflow-backend:
      proto: http
      addr: 127.0.0.1:3000
    legalflow-frontend:
      proto: http
      addr: 127.0.0.1:5173
  ```

## 3. Quy Trình Khởi Động Dry Run (Tuần Tự)
Làm chính xác theo thứ tự sau để tránh lỗi CORS và URL:

**A. Backup Database**
```powershell
cd legalflow-backend
npm run db:backup
```

**B. Đổi JWT_SECRET Thủ Công**
Mở file `legalflow-backend/.env` và đổi `JWT_SECRET` sang một chuỗi ngẫu nhiên mạnh. (Không dùng chuỗi gõ đại hoặc MD5).
*Ví dụ sinh chuỗi random 32 bytes:*
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**C. Chuẩn bị Tài Khoản Test (Bằng UI Admin)**
- Khởi động tạm server dev, đăng nhập Admin qua UI và tạo 1 tài khoản test.
- **Quy định Role:** Chỉ sử dụng Role `VIEWER` hoặc `STAFF`. Không dùng `ADMIN` cho người tham gia. (Hệ thống không hỗ trợ role `USER`).
- Đảm bảo DB không có dữ liệu pháp lý thật và không upload tài liệu thật.

**D. Chuẩn Bị Backend Local**
```powershell
cd legalflow-backend
npm run build
npm run start:prod
```
*(Backend chạy ở `127.0.0.1:3000`)*

**E. Chạy ngrok (Mở Tunnels)**
Mở một terminal mới:
```powershell
ngrok start --all
```
Lấy 2 HTTPS URL cấp phát:
- `127.0.0.1:3000` -> `<BACKEND_NGROK_HTTPS_URL>`
- `127.0.0.1:5173` -> `<FRONTEND_NGROK_HTTPS_URL>`

**F. Cập Nhật Môi Trường Backend**
Mở `legalflow-backend/.env`:
```env
FRONTEND_ORIGIN="<FRONTEND_NGROK_HTTPS_URL>"
```

**G. Cập Nhật Môi Trường Frontend**
Mở `.env.local` hoặc `.env.production` ở gốc dự án:
```env
VITE_API_BASE_URL="<BACKEND_NGROK_HTTPS_URL>"
```

**H. Restart Backend**
Tắt tiến trình backend đang chạy ở bước D, và bật lại `npm run start:prod` để backend nạp `FRONTEND_ORIGIN` mới.

**I. Rebuild Frontend**
Mở terminal ở gốc dự án:
```powershell
npm run build
```
*(Bắt buộc build lại vì Frontend cần ghim tĩnh URL API mới)*

**J. Serve Frontend**
```powershell
npx serve -s dist -p 5173
```

**K. Kiểm Thử Public URL**
Truy cập vào `<FRONTEND_NGROK_HTTPS_URL>` để bắt đầu thử nghiệm.

## 4. Kế Hoạch Ứng Phó (Rollback)
- **Tắt ngrok ngay lập tức:** Nhấn `Ctrl + C` tại cửa sổ ngrok.
- **Dừng dịch vụ:** Dừng Backend và Frontend serve.
- **Phân tích:** Copy file `dev.db` lỗi nếu cần phân tích.
- **Khôi phục:** Chạy `npm run db:restore` từ bản backup tạo ở Bước A.
- **Báo cáo:** Ghi nhận sự cố vào `UAT_PUBLIC_TRIAL_REPORT.md`.
