# Hướng Dẫn Thiết Lập Public Trial bằng ngrok (Zero Trust)

Tài liệu này cung cấp hướng dẫn cách thiết lập 2 đường hầm (tunnels) thông qua `ngrok` nhằm phục vụ đợt Public Trial cho hệ thống LegalFlow v1.0.0. 

> [!IMPORTANT]
> Tuyệt đối **không** lưu ngrok authtoken, file `ngrok.yml`, hoặc bất kỳ cấu hình `.env` thật nào vào Git project. Bạn sẽ phải tự nhập lệnh bằng tay để đảm bảo bảo mật.

## 1. Cài Đặt và Cấu Hình Cơ Bản
### 1.1. Cài đặt ngrok
- **Windows (Khuyên dùng qua Scoop hoặc Choco):**
  ```powershell
  choco install ngrok
  ```
  Hoặc tải tệp `.zip` trực tiếp từ [trang chủ ngrok](https://ngrok.com/download), giải nén và đưa vào biến môi trường `PATH`.

### 1.2. Xác thực ngrok (Tự làm thủ công)
- Lấy mã **Authtoken** từ bảng điều khiển ngrok của bạn.
- Mở terminal, chạy lệnh sau để thêm token (lệnh này sẽ tự động lưu cấu hình vào thư mục mặc định của máy, không nằm trong source code dự án):
  ```powershell
  ngrok config add-authtoken <MÃ_TOKEN_CỦA_BẠN>
  ```

### 1.3. Cấu hình file `ngrok.yml` song song
Thay vì gõ lệnh ngrok trực tiếp, bạn sẽ cấu hình file `ngrok.yml` (Nằm bên ngoài dự án, thường ở `C:\Users\<Tên_User>\AppData\Local\ngrok\ngrok.yml` đối với hệ điều hành Windows).
Thêm cấu trúc 2 tunnels:
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

## 2. Checklist Bắt Buộc Trước Khi Chạy Trial Thực Tế
**BẠN CHƯA ĐƯỢC CHẠY TUNNEL NẾU CHƯA HOÀN TẤT CHECKLIST NÀY:**
- [ ] Đã chạy lệnh `npm run db:backup` tại thư mục backend.
- [ ] Đã đổi `JWT_SECRET` sang chuỗi ngẫu nhiên.
- [ ] Đã đổi mật khẩu Admin seed mặc định.
- [ ] Đã tạo user test riêng biệt cho từng người dùng thử.
- [ ] Xác nhận DB hoàn toàn không có dữ liệu pháp lý thật (PII).
- [ ] Xác nhận không upload tài liệu thật.
- [ ] Xác nhận `.env` và `.env.local` đang bị Git bỏ qua (Untracked) an toàn.
- [ ] Xác nhận biến `FRONTEND_ORIGIN` và `VITE_API_BASE_URL` trỏ đúng vào HTTPS URL của ngrok (Xem thiết lập ở Bước 3).
- [ ] Xác nhận backend đang bind ở `127.0.0.1` thay vì `0.0.0.0`.
- [ ] Xác nhận tuyệt đối không mở port forwarding trên router.

## 3. Khởi Động Tunnels và Build Hệ Thống
### 3.1. Chạy ngrok
Mở Terminal, gõ lệnh kích hoạt ngrok:
```powershell
ngrok start --all
```
Trên màn hình console của ngrok sẽ cấp phát 2 đường dẫn HTTPS ngẫu nhiên. Hãy đọc kỹ màn hình:
- Dòng trỏ về `127.0.0.1:3000` -> Đây là `<BACKEND_NGROK_HTTPS_URL>`
- Dòng trỏ về `127.0.0.1:5173` -> Đây là `<FRONTEND_NGROK_HTTPS_URL>`

### 3.2. Cập nhật Biến Môi Trường (Bắt buộc)
Mỗi lần khởi động ngrok free, URL sẽ bị đổi, do đó bạn phải copy URL trên và cập nhật ngay vào các file biến môi trường cục bộ:
- **`legalflow-backend/.env`**:
  ```env
  FRONTEND_ORIGIN="<FRONTEND_NGROK_HTTPS_URL>"
  ```
- **`.env.local` (hoặc `.env.production`)** tại gốc dự án:
  ```env
  VITE_API_BASE_URL="<BACKEND_NGROK_HTTPS_URL>"
  ```

### 3.3. Build và Start Production
> [!WARNING]
> **LƯU Ý CỰC KỲ QUAN TRỌNG VỀ BUILD FRONTEND:**
> Frontend build **phải được chạy SAU KHI** cập nhật biến `VITE_API_BASE_URL`. Việc build bằng Vite sẽ nhúng tĩnh (hard-code) URL này vào thư mục `dist/`. Nếu URL ngrok đổi, bạn buộc phải thay file `.env` và chạy lại `npm run build` cho frontend.
> Tuyệt đối không dùng `npm run dev` để chạy public trial. Chỉ dùng cơ chế serve tĩnh đối với file build.

1. **Khởi động Backend:**
   ```powershell
   cd legalflow-backend
   npm run start:prod
   ```
2. **Build & Khởi động Frontend:**
   ```powershell
   npm run build
   npx serve -s dist -p 5173
   ```

## 4. Kịch Bản Kiểm Thử (Bắt Buộc Sau Khi Chạy Tunnel)
Sau khi tunnel và ứng dụng đã up, chỉ gửi `<FRONTEND_NGROK_HTTPS_URL>` cho người dùng và tiến hành kiểm tra đồng bộ:
- [ ] **Load UI:** Public Frontend URL truy cập tải giao diện thành công.
- [ ] **Auth Flow:** Đăng nhập / đăng xuất thành công bằng User test.
- [ ] **Tương tác:** Dashboard load số liệu. Tạo thử 1 hồ sơ giả thành công.
- [ ] **Audit Log:** Admin vào `/admin-audit-logs` kiểm chứng hành động đăng nhập, tạo hồ sơ đều được ghi lại rành mạch.
- [ ] **Rate Limiting:** Nhập sai mật khẩu liên tục, xác nhận hệ thống trả về HTTP 429.
- [ ] **Kiểm thử chặn CORS bằng Origin lạ:**
  ```bash
  curl -i -H "Origin: https://evil.example.com" <BACKEND_NGROK_HTTPS_URL>/health
  ```
  *Kỳ vọng: Lệnh cURL bị từ chối, không trả về Header `Access-Control-Allow-Origin` cho domain lạ.*
- [ ] **Bảo mật Token:** Token không tồn tại trong Response body, không lưu tại `localStorage`, không xuất hiện trên URL query string, không lọt vào backend logs.
- [ ] **Chống Leak Secret:** `passwordHash`, `JWT_SECRET`, và `DATABASE_URL` không bao giờ bị lộ ra ngoài qua Response HTTP hay Backend logs.

## 5. Kế Hoạch Ứng Phó Sự Cố Khẩn Cấp (Rollback Plan)
Nếu có bất kỳ sự cố bất thường xảy ra trong quá trình Public Trial:
- **Tắt Tunnel lập tức:** Nhấn `Ctrl + C` tại cửa sổ ngrok để đóng cửa, cắt luồng public ra khỏi hệ thống nội bộ ngay tức thì.
- **Dừng Dịch Vụ:** Tắt các tiến trình Backend (node) và Frontend (serve).
- **Lưu Vết Sự Cố:** Copy file `dev.db` hiện tại lưu thành `dev_error.db` riêng lẻ nếu cần truy vết/báo cáo phân tích sau này.
- **Restore Khẩn Cấp:** Nếu dữ liệu bị nhiễu do trial, khôi phục (`npm run db:restore`) từ bản Pre-Trial backup đã sinh ra ở Mục 2.
- **Báo Cáo Sự Cố:** Trình bày rõ nguyên nhân gây ra lỗi, kịch bản lọt lỗi vào tệp `UAT_PUBLIC_TRIAL_REPORT.md`.
