# Cẩm nang Vận hành và Bảo mật LegalFlow v0.6.0 (RUNBOOK)

Tài liệu này cung cấp hướng dẫn từng bước và toàn diện cho các quản trị viên để cài đặt, cấu hình, vận hành và khôi phục hệ thống **LegalFlow MVP** một cách an toàn nhất trên môi trường Windows.

---

> [!CAUTION]
> **QUY TẮC AN TOÀN DỮ LIỆU THỬ NGHIỆM (CỰC KỲ QUAN TRỌNG)**:
> 1. **Trạng thái sẵn sàng**: Hệ thống đã đủ điều kiện chạy thử nội bộ cục bộ bằng dữ liệu giả.
> 2. **Chưa dùng dữ liệu pháp lý thật**: Tuyệt đối nghiêm cấm nhập thông tin cá nhân khách hàng (PII) hoặc hồ sơ vụ việc thực tế trong giai đoạn dùng thử nội bộ này.
> 3. **Chưa deploy public internet**: Hệ thống chỉ chạy cục bộ (Offline/Intranet) thông qua cổng localhost. Tuyệt đối không triển khai ra môi trường mạng công cộng.
> 4. **Chưa có upload file thật**: Các tệp đính kèm trong hồ sơ vẫn ở dạng thông tin metadata JSON giả lập, chưa tải file vật lý thật lên máy chủ.
> 5. **SQLite chỉ dùng cho MVP/local trial**: SQLite là hệ quản trị cơ sở dữ liệu dạng tệp tin cục bộ, chỉ phục vụ cho giai đoạn thử nghiệm MVP hiện hành.

---

## 1. Yêu cầu Hệ thống
Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Node.js**: Phiên bản khuyến nghị v24+ (được kiểm thử trên v24.15.0)
- **npm**: Đi kèm sẵn với Node.js
- **Git**: Dùng để quản lý mã nguồn
- **Windows Shell**: PowerShell (Khuyên dùng) hoặc Command Prompt (CMD)

---

## 2. Thiết lập Biến môi trường (.env)

Trước khi khởi chạy hệ thống, bạn cần khởi tạo các file môi trường.

### 2.1. Cấu hình Frontend
1. Tại thư mục gốc `LegalFlow/`, sao chép file cấu hình mẫu:
   ```powershell
   # PowerShell
   Copy-Item .env.local.example .env.local
   
   # CMD
   copy .env.local.example .env.local
   ```
2. Mở file `.env.local` vừa tạo và cấu hình địa chỉ của API Backend:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

### 2.2. Cấu hình Backend
1. Di chuyển vào thư mục backend `legalflow-backend/` và sao chép file cấu hình mẫu:
   ```powershell
   # PowerShell
   cd legalflow-backend
   Copy-Item .env.example .env
   
   # CMD
   cd legalflow-backend
   copy .env.example .env
   ```
2. Mở file `.env` vừa tạo và cấu hình các thông số bảo mật bắt buộc:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3000
   FRONTEND_ORIGIN="http://localhost:5173"
   
   # Thay đổi JWT_SECRET mặc định thành mã hash ngẫu nhiên dài ít nhất 32 ký tự
   JWT_SECRET="change-me-to-a-very-strong-secret-key-32-chars"
   JWT_EXPIRES_IN="28800"

   # Mật khẩu Seed tùy chỉnh cho các tài khoản dùng thử
   SEED_ADMIN_PASSWORD="Admin@123!"
   SEED_MANAGER_PASSWORD="Manager@123!"
   SEED_STAFF_PASSWORD="Staff@123!"
   SEED_VIEWER_PASSWORD="Viewer@123!"
   ```

---

## 3. Cài đặt và Khởi chạy ứng dụng

### 3.1. Chạy Frontend
1. Mở PowerShell tại thư mục gốc `LegalFlow/` và cài đặt thư viện:
   ```powershell
   npm install
   ```
2. Khởi chạy server phát triển Frontend:
   ```powershell
   npm run dev
   ```
   Frontend mặc định chạy tại địa chỉ `http://localhost:5173/`.

### 3.2. Chạy Backend
1. Mở cửa sổ PowerShell mới, di chuyển vào `legalflow-backend/` và cài đặt thư viện:
   ```powershell
   cd legalflow-backend
   npm install
   ```
2. Thực thi các lệnh khởi tạo Cơ sở dữ liệu SQLite và Seed tài khoản mẫu:
   ```powershell
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```
3. Khởi chạy server phát triển Backend:
   ```powershell
   npm run start:dev
   ```
   Backend mặc định chạy tại địa chỉ `http://localhost:3000/`.

---

## 4. Cơ chế Thay đổi Mật khẩu Seed và Cấu hình Security Hardening

### 4.1. Thay đổi Mật khẩu Seed Tài khoản Mẫu
Thay vì cấu hình cứng, mật khẩu của 4 tài khoản seed mẫu được quản lý động qua biến môi trường của backend:
1. Mở file `legalflow-backend/.env`.
2. Thay đổi các giá trị `SEED_ADMIN_PASSWORD`, `SEED_MANAGER_PASSWORD`, `SEED_STAFF_PASSWORD`, `SEED_VIEWER_PASSWORD` sang mật khẩu mạnh mới của bạn.
3. Chạy lệnh seed để cập nhật trực tiếp vào cơ sở dữ liệu hiện hành mà không làm mất các hồ sơ khác:
   ```powershell
   npx prisma db seed
   ```
   *Lưu ý: Script seed được giới hạn nghiêm ngặt chỉ cập nhật thông tin và mật khẩu cho đúng 4 tài khoản seed mặc định này, bảo vệ các tài khoản khác.*

### 4.2. Đổi JWT Secret
1. Tạo một chuỗi ký tự ngẫu nhiên, ví dụ bằng lệnh Node.js sau:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Thay thế giá trị của `JWT_SECRET` trong `legalflow-backend/.env` bằng chuỗi vừa sinh.
3. Restart lại backend để cấu hình mới có hiệu lực.

### 4.3. CORS Security Safeguard
Backend được lập trình để phát hiện nếu quản trị viên cấu hình `FRONTEND_ORIGIN="*"` (CORS wildcard).
- Nếu phát hiện CORS wildcard, backend sẽ in thông báo cảnh báo màu vàng nổi bật tại màn hình console khởi chạy.
- Khuyến nghị: Luôn để `FRONTEND_ORIGIN="http://localhost:5173"` trong đợt chạy thử nội bộ này.

---

## 5. Hướng dẫn Sao lưu dữ liệu an toàn (Backup SQLite)

Hệ thống cung cấp công cụ sao lưu dữ liệu tự động, đọc trực tiếp đường dẫn DB từ cấu hình `DATABASE_URL` trong file `.env`.

### Cách thực hiện
1. Di chuyển vào thư mục `legalflow-backend/`.
2. Thực thi lệnh sao lưu:
   ```powershell
   npm run db:backup
   ```
3. Kết quả:
   - File sao lưu được đóng gói tại thư mục: `legalflow-backend/backups/`.
   - File có định dạng tên kèm timestamp chi tiết: `backup_YYYYMMDD_HHMMSS.db` (Ví dụ: `backup_20260521_172000.db`).
   - Lệnh in thông báo xác nhận kích thước tệp (KB) lớn hơn 0 và đường dẫn lưu trữ tuyệt đối.

---

## 6. Hướng dẫn Phục hồi dữ liệu an toàn (Restore SQLite)

Cơ chế khôi phục dữ liệu tích hợp quy trình kiểm soát lỗi khóa tệp và xác nhận 2 lớp để bảo đảm an toàn dữ liệu.

### Cách thực hiện
1. Di chuyển vào thư mục `legalflow-backend/`.
2. Thực thi lệnh khôi phục:
   ```powershell
   npm run db:restore
   ```
3. **Các bước tương tác trên màn hình**:
   - Hệ thống quét thư mục `backups/` và hiển thị danh sách 10 bản sao lưu gần nhất.
   - Nhập số thứ tự (Ví dụ: `1` để chọn bản mới nhất) hoặc nhập trực tiếp tên tệp sao lưu muốn phục hồi (Ví dụ: `backup_20260521_172000.db`).
   - **Xác nhận Lớp 1**: Hệ thống yêu cầu xác nhận ghi đè dữ liệu. Gõ `y` hoặc `yes` để tiếp tục.
   - **Xác nhận Lớp 2 (Double Confirmation)**: Hệ thống yêu cầu nhập từ khóa bảo mật. Bạn phải gõ chính xác:
     ```text
     RESTORE-CONFIRM
     ```
   - **Tạo mốc Khôi phục An toàn (`pre_restore_*`)**: Trước khi ghi đè, script khôi phục tự động sao lưu dữ liệu hiện tại thành `pre_restore_YYYYMMDD_HHMMSS.db` trong thư mục `backups/`.
   - **Ghi đè DB**: Hệ thống thực hiện khôi phục dữ liệu đè lên tệp database chính.
   - **Khởi động lại**: Vui lòng tắt server backend hiện tại và bật lại để hệ thống tải lại toàn bộ trạng thái dữ liệu mới.

---

## 7. Phục hồi khẩn cấp (Rollback từ pre-restore)

Nếu quá trình khôi phục bị gián đoạn hoặc bạn nhận ra bản khôi phục chọn nhầm dữ liệu, bạn có thể lập tức quay lại trạng thái ngay trước thời điểm restore:
1. Vào thư mục `legalflow-backend/backups/` tìm file backup dự phòng khẩn cấp được sinh ra tự động trước lúc restore. Tên file có dạng: `pre_restore_YYYYMMDD_HHMMSS.db`.
2. Thực hiện lệnh khôi phục truyền trực tiếp tên file này:
   ```powershell
   npm run db:restore pre_restore_YYYYMMDD_HHMMSS.db
   ```
3. Làm theo quy trình xác nhận 2 lớp tương tự để khôi phục lại trạng thái cũ.

---

## 8. Xử lý sự cố thường gặp (Troubleshooting)

### 8.1. Lỗi cổng 3000 / 5173 bị chiếm dụng trên Windows
Nếu server không khởi động được do cổng bị chiếm dụng, hãy xử lý theo các bước:

**Cách 1: Sử dụng PowerShell (Khuyên dùng)**
1. Tìm ID tiến trình (PID) đang chạy trên cổng bị chiếm:
   ```powershell
   Get-NetTCPConnection -LocalPort 3000
   ```
2. Giải phóng cổng bằng cách đóng tiến trình cưỡng bức:
   ```powershell
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
   ```
   *(Thay 3000 bằng 5173 đối với cổng của frontend)*

**Cách 2: Sử dụng Command Prompt (CMD) truyền thống**
1. Tìm ID tiến trình (PID) chiếm cổng:
   ```cmd
   netstat -ano | findstr :3000
   ```
   *Cột cuối cùng hiển thị số PID (Ví dụ: `12456`)*
2. Giải phóng cổng bằng lệnh taskkill:
   ```cmd
   taskkill /PID 12456 /F
   ```

### 8.2. Lỗi khóa tệp tin DB khi Restore (EBUSY hoặc EPERM)
- **Nguyên nhân**: Bạn cố gắng chạy lệnh khôi phục (`db:restore`) trong khi server Backend (`npm run start:dev`) vẫn đang hoạt động. Hệ điều hành Windows khóa tệp cơ sở dữ liệu SQLite nhằm bảo vệ dữ liệu, ngăn chặn việc ghi đè trực tiếp.
- **Cách khắc phục**: Nhấn `Ctrl + C` tại terminal đang chạy backend hoặc kill port 3000 theo hướng dẫn bên trên, sau đó thực hiện lại lệnh restore. Sau khi restore thành công, bật lại server backend.

---

## 9. Hướng dẫn Vận hành Quản lý Người dùng (Phase 4.1)

Tính năng **Quản lý người dùng** được giới hạn nghiêm ngặt và chỉ hiển thị/cho phép truy cập đối với tài khoản có vai trò `ADMIN`.

### 9.1. Phân quyền và Bảo mật Trang Quản trị
- **Sidebar**: Mục menu "Quản lý tài khoản" chỉ hiển thị với vai trò `ADMIN`.
- **Bảo vệ Route**: Nếu bất kỳ tài khoản nào có vai trò `MANAGER`, `STAFF`, hoặc `VIEWER` cố tình truy cập vào `/users` bằng cách nhập trực tiếp URL, hệ thống sẽ tự động chặn và redirect về `/dashboard` lập tức nhờ `ProtectedRoute` kết hợp danh sách `allowedRoles: ['ADMIN']`.
- **JWT Hardening**: Cơ chế JWT Strategy trên Backend thực hiện truy vấn trực tiếp Database trên mỗi request để xác thực trạng thái `isActive` và vai trò `role` hiện tại. Nếu tài khoản bị khóa (`isActive: false`) hoặc vai trò bị thay đổi, hành động tiếp theo của tài khoản đó sẽ lập tức áp dụng quyền mới mà không cần đợi Token JWT cũ hết hạn.

### 9.2. Quy trình Thêm người dùng mới
1. Admin đăng nhập và truy cập trang **Quản lý tài khoản** (`/users`).
2. Bấm nút **Tạo tài khoản mới** để mở modal form.
3. Nhập đầy đủ thông tin: Email, Họ và tên, Vai trò và **Mật khẩu tạm thời**.
   - *Lưu ý*: Mật khẩu tạm thời do Admin tự nhập thủ công (tối thiểu 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt). Hệ thống cung cấp panel kiểm tra độ phức tạp của mật khẩu thời gian thực (live validation).
   - Hệ thống normalizes email thành chữ thường và trim khoảng trắng (`trim().toLowerCase()`) để đảm bảo không trùng lặp.
4. Bấm **Lưu tài khoản**. Hệ thống sẽ mã hóa mật khẩu bằng `bcrypt` trước khi lưu và ghi nhận hành động vào console log của Backend (`[CREATE_USER]`). Mật khẩu tạm thời sẽ được ẩn đi ngay sau khi lưu để bảo mật thông tin.
5. Admin tự gửi mật khẩu tạm này cho người dùng qua các kênh trao đổi an toàn riêng biệt.

### 9.3. Đặt lại Mật khẩu tạm thời (Reset Password)
1. Trong danh sách người dùng, bấm nút biểu tượng **Chìa khóa** (`KeyRound`) tại hàng của người dùng cần đặt lại mật khẩu.
2. Nhập mật khẩu tạm thời mới thỏa mãn đầy đủ các tiêu chuẩn bảo mật tối thiểu 8 ký tự.
3. Xác nhận cập nhật. Backend sẽ băm (hash) mật khẩu mới và ghi nhận log `[RESET_PASSWORD]`.
4. Người dùng sử dụng mật khẩu mới để đăng nhập.

### 9.4. Tạm khóa/Mở khóa người dùng
1. Bấm nút biểu tượng **Khóa/Mở khóa** (`Lock`/`Unlock`) tại hàng của người dùng.
2. Xác nhận tại pop-up cảnh báo.
3. **Cơ chế Bảo vệ đặc biệt**:
   - Quản trị viên **không thể tự khóa tài khoản của chính mình**. Nút khóa trên dòng của bản thân sẽ bị vô hiệu hóa (disabled).
   - **Tài khoản ADMIN duy nhất còn hoạt động** trên hệ thống sẽ bị chặn không cho khóa hoặc chuyển vai trò sang vai trò thấp hơn nhằm tránh tình trạng hệ thống mất đi quyền Admin điều hành tối cao.

### 9.5. Xóa tài khoản vĩnh viễn (Hard Delete)
- **Ràng buộc an toàn dữ liệu**: Hệ thống chỉ cho phép xóa cứng các tài khoản chưa thực hiện bất kỳ hoạt động nghiệp vụ nào có liên kết dữ liệu trong 4 bảng: `LegalCase`, `CaseNote`, `CaseHistory`, `CaseChecklistItem`.
- Nếu tài khoản đã có dữ liệu liên kết, API sẽ lập tức trả về mã lỗi `409 Conflict`. Trình duyệt sẽ hiển thị cảnh báo dễ hiểu: *"Không thể xóa tài khoản này vì đã có dữ liệu nghiệp vụ liên kết. Hãy khóa tài khoản thay thế."*
- Admin được khuyên dùng tính năng **Khóa tài khoản** để chặn truy cập nhưng vẫn bảo toàn tính toàn vẹn của lịch sử nghiệp vụ.
- Admin không thể tự xóa tài khoản của chính mình hoặc xóa tài khoản ADMIN duy nhất còn lại trên hệ thống.

---

## 10. Hướng dẫn Tự Đổi Mật Khẩu và Quản Lý Hồ Sơ (Phase 4.2)

Hệ thống cho phép tất cả người dùng đang hoạt động (không phân biệt vai trò) tự xem thông tin cá nhân và thay đổi mật khẩu của chính mình để bảo mật tài khoản.

### 10.1. Xem thông tin Hồ sơ cá nhân (My Profile)
- Người dùng truy cập menu **Cài đặt** trên thanh điều hướng (hoặc truy cập đường dẫn `/settings`).
- Chọn tab **Tài khoản của tôi** để xem các thông tin chi tiết:
  - **Họ và tên**: Tên hiển thị đầy đủ trên hệ thống.
  - **Địa chỉ Email**: Email tài khoản dùng để đăng nhập.
  - **Vai trò**: Quyền hạn hiện hành (`ADMIN`/`MANAGER`/`STAFF`/`VIEWER`).
  - **Trạng thái**: Tình trạng hoạt động thời gian thực.
- Toàn bộ thông tin này được lấy trực tiếp từ JWT Token đã được xác thực an toàn thông qua API `/auth/profile` hoặc `/auth/me`.

### 10.2. Quy trình Tự Đổi Mật Khẩu
1. Tại tab **Tài khoản của tôi**, di chuyển đến khu vực **Đổi mật khẩu tài khoản**.
2. Nhập các trường thông tin:
   - **Mật khẩu hiện tại**: Phải khớp chính xác với mật khẩu hiện tại (xác thực bằng `bcrypt.compare` phía máy chủ).
   - **Mật khẩu mới**: Phải đạt các tiêu chuẩn an toàn bắt buộc:
     - Độ dài tối thiểu **8 ký tự**.
     - Có ít nhất 1 chữ viết hoa (`A-Z`).
     - Có ít nhất 1 chữ viết thường (`a-z`).
     - Có ít nhất 1 chữ số (`0-9`).
     - Có ít nhất 1 ký tự đặc biệt (`@$!%*?&#`).
     - *Lưu ý*: Mật khẩu mới không được trùng khớp hoàn toàn với mật khẩu hiện tại.
   - **Xác nhận mật khẩu mới**: Phải trùng khớp 100% với mật khẩu mới đã nhập.
3. **Tiện ích Hỗ trợ**:
   - Sử dụng biểu tượng **Mắt ẩn/hiện** ở góc phải mỗi trường để kiểm tra ký tự đã nhập.
   - Theo dõi **Bảng tiêu chuẩn mật khẩu bảo mật (Real-time Checklist)**: Các tiêu chí sẽ tự động chuyển màu xanh lá cây kèm dấu check (`✓`) khi mật khẩu nhập vào đạt yêu cầu, giúp người dùng dễ dàng kiểm soát độ phức tạp.
4. Bấm nút **Cập nhật mật khẩu mới**.
5. **Cơ chế Hủy phiên và Đăng xuất tự động**:
   - Sau khi Backend xử lý đổi mật khẩu thành công và trả về mã `200 OK`, Frontend sẽ hiển thị thông điệp thành công.
   - Hệ thống trì hoãn **đúng 1.5 giây** để người dùng đọc thông tin, sau đó gọi phương thức `logout()` của `AuthContext`.
   - Token truy cập (`lf_access_token`) sẽ bị xóa sạch khỏi `sessionStorage`, phiên làm việc cũ kết thúc ngay lập tức.
   - Người dùng được chuyển hướng về màn hình `/login` để thực hiện đăng nhập lại bằng mật khẩu mới.
   - Ghi nhận Audit Log phía Backend: `[CHANGE_PASSWORD] User (email) changed password successfully` (Tuyệt đối không log thông tin clear-text của mật khẩu cũ/mới).


ECHO is on.
  
### X? ly L?i Rate Limiting (HTTP 429)  
- Khi ngu?i d�ng b�o l?i 'B?n da thao t�c qu� nhi?u l?n. Vui l�ng th? l?i sau �t ph�t.', nghia l� h? da g?i qu� 5 request login/d?i m?t kh?u trong 1 ph�t.  
- **Kh?c ph?c**: Ngu?i d�ng ch? c?n ch? 60 gi�y v� th? l?i. Backend kh�ng kh�a vinh vi?n t�i kho?n trong CSDL.  
- **Log**: L?i 429 du?c ghi ? Server Console (RATE_LIMIT_HIT), kh�ng luu v�o b?ng AdminAuditLog. 
