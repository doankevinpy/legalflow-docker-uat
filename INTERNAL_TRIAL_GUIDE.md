# Hướng dẫn Dùng thử Nội bộ LegalFlow MVP (v0.5.0)

Chào mừng bạn đến với chương trình dùng thử nội bộ của **LegalFlow MVP**! Hướng dẫn này giúp bạn dễ dàng tiếp cận, cài đặt, chạy thử nghiệm hệ thống và thực hiện các kịch bản đánh giá tính năng một cách an toàn và hiệu quả nhất.

---

## 1. LegalFlow là gì?
**LegalFlow** là hệ thống hỗ trợ quản lý hồ sơ nghiệp vụ và hỗ trợ biên soạn dự thảo văn bản hành chính dành cho các phòng ban pháp lý. Phiên bản MVP (Minimum Viable Product) tập trung vào việc số hóa quy trình tiếp nhận hồ sơ, theo dõi tiến độ thụ lý (Checklist/Notes/History), phân quyền vai trò người dùng (RBAC), và tự động điền dữ liệu hồ sơ vào các văn bản dự thảo hành chính mẫu.

---

## 2. ⚠️ CẢNH BÁO AN TOÀN DỮ LIỆU (Bắt buộc)

Hệ thống hiện tại đang trong giai đoạn chạy thử nghiệm nội bộ cục bộ (Offline/Intranet). Để đảm bảo an toàn thông tin tối đa, bạn **bắt buộc phải tuân thủ** các nguyên tắc bảo mật sau:

> [!CAUTION]
> 1. **KHÔNG NHẬP DỮ LIỆU PHÁP LÝ THẬT**: Chỉ sử dụng thông tin giả lập (mock data) hoặc các hồ sơ đã được ẩn danh hóa hoàn toàn. Tuyệt đối không nhập thông tin thật của khách hàng, đối tác hoặc vụ việc thực tế.
> 2. **KHÔNG UPLOAD TÀI LIỆU THẬT**: Không tải lên các văn bản, hợp đồng, quyết định hoặc tài liệu nghiệp vụ thực tế có tính chất bảo mật. Trường tài liệu trong MVP chỉ lưu thông tin tên tệp tin giả lập để mô phỏng tính năng.
> 3. **HỆ THỐNG CHỈ CHẠY CỤC BỘ**: Tuyệt đối không tự ý cấu hình để triển khai hệ thống ra mạng Internet công cộng trong giai đoạn dùng thử nội bộ này.

---

## 3. Cách chạy hệ thống

Hệ thống LegalFlow MVP gồm hai phần chính: **Backend** (NestJS API) và **Frontend** (Vite + React UI). Đảm bảo máy tính của bạn đã cài đặt Node.js v24+.

### Bước 1: Khởi chạy Backend (NestJS Server)
1. Mở terminal mới, di chuyển vào thư mục backend:
   ```cmd
   cd legalflow-backend
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```cmd
   npm install
   ```
3. Tạo file cấu hình `.env` từ file mẫu:
   ```cmd
   copy .env.example .env
   ```
4. Khởi tạo cơ sở dữ liệu SQLite cục bộ và nạp dữ liệu mẫu:
   ```cmd
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Khởi chạy Backend Server:
   ```cmd
   npm run start:dev
   ```
   *Backend mặc định chạy tại địa chỉ: `http://localhost:3000`*

### Bước 2: Khởi chạy Frontend (React Web App)
1. Mở một terminal mới song song, di chuyển vào thư mục gốc `LegalFlow/`:
   ```cmd
   cd ..
   ```
2. Cài đặt các thư viện Frontend:
   ```cmd
   npm install
   ```
3. Tạo file cấu hình `.env.local` từ file mẫu:
   ```cmd
   copy .env.local.example .env.local
   ```
4. Khởi chạy Frontend Dev Server:
   ```cmd
   npm run dev
   ```
   *Frontend mặc định chạy tại địa chỉ: `http://localhost:5173`*
5. Mở trình duyệt Web của bạn và truy cập: [http://localhost:5173](http://localhost:5173)

---

## 4. Danh sách tài khoản thử nghiệm mặc định

Hệ thống đã tích hợp sẵn cơ chế phân quyền kiểm soát truy cập (RBAC) nghiêm ngặt với 4 tài khoản seed mẫu. Dưới đây là thông tin đăng nhập tương ứng:

| Vai trò | Email đăng nhập | Mật khẩu mặc định | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Admin** (Quản trị viên) | `admin@legalflow.local` | `Admin@123!` | Toàn quyền hệ thống, hiển thị bảng di trú dữ liệu cũ Settings/Migration. |
| **Manager** (Quản lý phòng) | `manager@legalflow.local` | `Manager@123!` | CRUD hồ sơ bất kỳ, soft-delete hồ sơ, theo dõi biểu đồ thống kê. |
| **Staff** (Nhân viên thụ lý) | `staff@legalflow.local` | `Staff@123!` | Chỉ tạo mới và chỉnh sửa hồ sơ được phân công thụ lý. Không có quyền xóa. |
| **Viewer** (Người xem tin) | `viewer@legalflow.local` | `Viewer@123!` | Chỉ xem danh sách/chi tiết hồ sơ (Read-only). Không có nút thêm, sửa, xóa. |

---

## 5. Các kịch bản dùng thử khuyên dùng (Test Scenarios)

Hãy thử đóng vai các nhân vật với vai trò khác nhau để trải nghiệm luồng làm việc thực tế:

### Kịch bản 1: Phân quyền vai trò (RBAC) & Tương tác Hồ sơ
1. **Đăng nhập bằng Staff** (`staff@legalflow.local` / `Staff@123!`):
   * Vào mục **Hồ sơ** -> chọn **Tạo mới**. Nhập các thông tin giả lập (Ví dụ: Người nộp: *Nguyễn Văn A*, Lĩnh vực: *Khiếu nại*, Khu phố: *Khu phố 3*) -> **Lưu**.
   * Mã hồ sơ được sinh tự động theo chuẩn tiếng Việt: `2026-KN-001-KP3`.
   * Thử tick chọn checklist công việc, chuyển trạng thái sang **Đang xử lý**, và viết một ghi chú trao đổi nghiệp vụ tại tab **Ghi chú**.
2. **Đăng nhập bằng Viewer** (`viewer@legalflow.local` / `Viewer@123!`):
   * Truy cập chi tiết hồ sơ vừa tạo.
   * *Kết quả*: Xem được toàn bộ tiến độ, ghi chú, lịch sử. Tuy nhiên, các nút lưu ghi chú, đổi trạng thái, tick checklist đều bị khóa (Read-only).
3. **Đăng nhập bằng Manager** (`manager@legalflow.local` / `Manager@123!`):
   * Vào danh sách hồ sơ, bạn sẽ thấy biểu tượng **Thùng rác** bên cạnh hồ sơ.
   * Thử bấm xóa hồ sơ -> Xác nhận. Hồ sơ sẽ được ẩn an toàn (Soft delete).

### Kịch bản 2: Biên soạn dự thảo thông minh (Drafts)
1. Truy cập tab **Biên soạn dự thảo** (`/drafts`).
2. Tại danh sách lựa chọn hồ sơ liên kết, hệ thống sẽ tự động nạp danh sách mã hồ sơ thời gian thực trực tiếp từ Database Backend.
3. Chọn một hồ sơ bất kỳ (Ví dụ: `2026-KN-001-KP3`).
4. Chọn loại biểu mẫu dự thảo mong muốn (Ví dụ: *Biên nhận hồ sơ*).
5. *Kết quả*: Toàn bộ thông tin từ hồ sơ backend được trích xuất và điền chính xác vào nội dung biểu mẫu thời gian thực.
6. Bạn có thể bấm **Sao chép văn bản** hoặc bấm **Tải file Word (.docx)** để kiểm tra định dạng văn bản hành chính xuất ra.

### Kịch bản 3: Di trú dữ liệu localStorage cũ (Migration)
1. Đăng nhập tài khoản **Admin** -> Vào mục **Cấu hình** -> Kéo xuống phần **Di trú dữ liệu cũ**.
2. Hệ thống phát hiện bạn có hồ sơ cũ được lưu trên trình duyệt cục bộ.
3. Nhấp **Xuất file Backup (.json)** để tải bản dự phòng dữ liệu local.
4. Bấm **Xem trước và di trú** -> Chọn các hồ sơ local và thực hiện di chuyển lên Database Backend.
5. Kiểm tra cơ chế chống trùng lặp: Nếu cố tình import hồ sơ có thông tin trùng khớp hoàn toàn trên backend, hệ thống sẽ đánh nhãn màu cam cảnh báo `"possible_duplicate"` và dừng tự động import để tránh rác cơ sở dữ liệu.
6. Sau khi xử lý 100% hồ sơ local cũ, nút **Xóa dữ liệu localStorage cũ** sẽ xuất hiện an toàn. Thử nghiệm double-confirm để xóa sạch bộ nhớ local mà không làm ảnh hưởng tới backend.

### Kịch bản 4: Động cơ Sao lưu & Khôi phục dữ liệu (SQLite Engine)
1. **Sao lưu**: Tại thư mục backend `legalflow-backend/`, mở terminal chạy lệnh:
   ```cmd
   npm run db:backup
   ```
   *Hệ thống tự động đóng gói tệp database cục bộ ra tệp sao lưu kèm timestamp dạng `backup_YYYYMMDD_HHMMSS.db` trong thư mục `backups/`.*
2. **Khôi phục**: Đảm bảo bạn đã tắt Server Backend đang chạy (`Ctrl + C` để tắt server watch). Thực thi lệnh khôi phục:
   ```cmd
   npm run db:restore
   ```
   * Nhập số thứ tự bản sao lưu muốn khôi phục.
   * **Xác nhận 1**: Nhập `y` để xác nhận.
   * **Xác nhận 2**: Nhập từ khóa bắt buộc `RESTORE-CONFIRM`.
   * *Kết quả*: Hệ thống tự động tạo tệp rollback dự phòng khẩn cấp trước khi khôi phục `pre_restore_*` và khôi phục thành công. Khởi chạy lại backend server để cập nhật dữ liệu mới.

---

## 6. Hướng dẫn ghi nhận lỗi (Bug Report)

Nếu gặp sự cố, lỗi hiển thị hoặc lỗi bảo mật trong lúc trải nghiệm dùng thử, rất mong bạn chụp ảnh màn hình và gửi báo cáo về cho nhóm kỹ thuật theo định dạng mẫu sau:

*   **Tên lỗi**: (Ví dụ: *Không hiện biểu đồ tròn thống kê*)
*   **Mô tả chi tiết**: (Ví dụ: *Khi vào Dashboard bằng tài khoản Manager, biểu đồ thống kê theo khu phố chỉ hiển thị vòng tròn trống, không có lát cắt phân chia*)
*   **Các bước tái hiện (Steps to Reproduce)**:
    1. Đăng nhập bằng tài khoản Manager.
    2. Click vào Tab Dashboard.
    3. Quan sát mục "Thống kê theo Khu phố".
*   **Vai trò đang dùng (Role)**: (Ví dụ: *Manager*)
*   **Đường dẫn URL khi gặp lỗi**: `http://localhost:5173/`
*   **Ảnh chụp màn hình hoặc File Log đính kèm**: (Nếu có)

---

## 7. Các giới hạn hiện tại của MVP

Để giúp bạn quản lý kỳ vọng khi dùng thử, dưới đây là các giới hạn của phiên bản MVP hiện tại:
*   **Chưa có upload file vật lý**: Hệ thống chỉ lưu trữ tên file đính kèm dưới dạng text JSON giả lập. Việc lưu trữ binary/S3 thực tế sẽ được phát triển ở phiên bản tiếp theo.
*   **SQLite cục bộ**: Cơ sở dữ liệu SQLite dạng tệp cục bộ phục vụ tối ưu cho việc dùng thử cục bộ nhanh chóng, không yêu cầu thiết lập máy chủ database phức tạp. Bản thương mại sẽ chuyển sang Postgres/MySQL.
*   **Audit logs giản lược**: Lịch sử thao tác hồ sơ được ghi nhận dưới dạng JSON thô tại tab Lịch sử và chưa có bảng giao diện quản trị audit log chuyên sâu cho quản trị viên.

*Chúc bạn có những trải nghiệm tuyệt vời cùng LegalFlow MVP v0.5.0! Sự đóng góp ý kiến của bạn là chìa khóa để hoàn thiện sản phẩm.*
