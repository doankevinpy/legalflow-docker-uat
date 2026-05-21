# Hướng dẫn chạy LegalFlow v0.4.0 (RUNBOOK)

Tài liệu này cung cấp hướng dẫn từng bước để thiết lập và chạy hệ thống quản lý hồ sơ pháp lý **LegalFlow v0.4.0** từ đầu trên môi trường Windows.

## 1. Yêu cầu môi trường
Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Node.js**: Phiên bản khuyên dùng v24+ (hiện tại v24.15.0)
- **npm**: Đi kèm với Node.js
- **Git**: Dùng để quản lý mã nguồn
- **PowerShell**: Khuyên dùng chạy các lệnh CLI (hoặc Git Bash/Command Prompt)

## 2. Cài đặt Frontend
Mở PowerShell tại thư mục gốc của dự án (`LegalFlow`) và thực hiện:

1. **Cài đặt thư viện:**
   ```powershell
   npm install
   ```
2. **Cấu hình biến môi trường:**
   Copy file mẫu để tạo file `.env.local`
   ```powershell
   Copy-Item .env.local.example .env.local
   ```
   Đảm bảo nội dung trong `.env.local` có thiết lập API trỏ tới backend:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
3. **Chạy server Frontend:**
   ```powershell
   npm run dev
   ```
   Frontend sẽ khởi chạy, thường tại địa chỉ `http://localhost:5173/`.

## 3. Cài đặt Backend
Mở một cửa sổ PowerShell mới, di chuyển vào thư mục backend và thiết lập:

1. **Vào thư mục backend và cài đặt thư viện:**
   ```powershell
   cd legalflow-backend
   npm install
   ```
2. **Cấu hình biến môi trường:**
   Copy file mẫu để tạo file `.env`
   ```powershell
   Copy-Item .env.example .env
   ```
3. **Thiết lập và khởi tạo Database (SQLite):**
   Chạy tuần tự các lệnh Prisma để tạo database, sinh client và đẩy dữ liệu mẫu:
   ```powershell
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```
4. **Chạy server Backend:**
   ```powershell
   npm run start:dev
   ```
   Backend sẽ khởi chạy tại `http://localhost:3000/`.

## 4. Tài khoản đăng nhập dev (Seed Accounts)
Hệ thống đi kèm dữ liệu mẫu (được tạo ở bước `db seed`) với 4 tài khoản phân quyền khác nhau. 

**Mật khẩu chung:** `Role@123!` (Ví dụ: `Admin@123!`, `Staff@123!`)

| Vai trò | Email đăng nhập | Quyền hạn |
|---|---|---|
| **Admin** | `admin@legalflow.local` | Toàn quyền (Tạo, Sửa, Xóa mềm, Dashboard) |
| **Manager** | `manager@legalflow.local` | Quản lý (Tạo, Sửa, Phân công, Xóa mềm) |
| **Staff** | `staff@legalflow.local` | Xử lý (Tạo hồ sơ, Sửa hồ sơ được giao) |
| **Viewer** | `viewer@legalflow.local` | Chỉ xem (Read-only) |

> [!WARNING]
> Mật khẩu seed và các tài khoản này **chỉ được dùng cho mục đích Development/Testing**. Tuyệt đối không dùng cho Production.

## 5. Kiểm tra nhanh (Smoke Test)
Sau khi bật cả 2 server, bạn có thể thực hiện kiểm thử nhanh theo luồng sau để xác nhận hệ thống chạy ổn định:
1. Mở trình duyệt, truy cập `http://localhost:3000/health` (Hoặc endpoint backend) để đảm bảo API đã chạy.
2. Truy cập `http://localhost:5173/` → Bị chặn và yêu cầu đăng nhập.
3. Login bằng `admin@legalflow.local` / `Admin@123!`.
4. Xem **Dashboard** → Xác nhận biểu đồ/thống kê tải dữ liệu thành công.
5. Chuyển sang Tab "Hồ sơ", bấm **Tạo mới** → Điền form và tạo hồ sơ.
6. Hệ thống chuyển hướng vào **Chi tiết hồ sơ**, xác nhận mã hồ sơ được sinh tự động.
7. Chuyển sang Tab **Ghi chú** → Gõ "Test note" và gửi → Note hiển thị.
8. Chuyển sang Tab **Checklist** → Tick vào một mục → Ngày hoàn thành hiện ra.
9. Đổi **Trạng thái** (Status) sang `IN_PROGRESS` → Kiểm tra phần Lịch sử (History) ghi nhận đầy đủ các thao tác trên.

## 6. Lỗi thường gặp (Troubleshooting)

| Vấn đề | Nguyên nhân & Cách xử lý |
|---|---|
| **Port 3000 đang bị chiếm** | Có service khác đang chạy cổng 3000. Dùng lệnh `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force` để tắt tiến trình đó. |
| **Port 5173 đang bị chiếm** | Có phiên bản Vite khác đang chạy. Tắt tiến trình hoặc cấu hình cổng khác cho frontend. |
| **Không thấy dữ liệu Dashboard / CaseList** | Kiểm tra xem Backend có đang chạy hay chưa (terminal báo lỗi đỏ không). Kiểm tra lại file `dev.db` đã được seed chưa. |
| **Lỗi Prisma migrate** | Nếu DB cũ bị lỗi, hãy thử xóa file `prisma/dev.db` và `prisma/migrations`, rồi chạy lại `migrate dev --name init`. |
| **Lỗi VITE_API_BASE_URL** | Frontend không gọi được API. Đảm bảo file `.env.local` của frontend đã có biến này và giá trị chính xác là `http://localhost:3000`. Cần Restart frontend nếu vừa tạo `.env.local`. |
| **Bị văng ra trang Login / 401 Unauthorized** | Token hết hạn, API trả về 401 hoặc backend restart khiến session mất hiệu lực/không sync. Hãy đăng nhập lại. |

## 7. Cảnh báo an toàn & Best Practices

> [!CAUTION]
> 1. **Dữ liệu thật:** Tuyệt đối **không nhập dữ liệu pháp lý thật, thông tin cá nhân khách hàng (PII)** vào hệ thống Development.
> 2. **Git Commit:** **Không commit** các file `.env`, `.env.local`, và đặc biệt là file dữ liệu `dev.db` lên source control (chúng đã được đặt trong `.gitignore`).
> 3. **Production:** Không dùng tài khoản Seed cho môi trường Production thực tế. Không sử dụng HTTP trần cho API trên mạng công cộng.
