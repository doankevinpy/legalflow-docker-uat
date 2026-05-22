# Kịch bản Nghiệm thu Người dùng LegalFlow v0.4.2 (UAT Checklist)

> [!WARNING]
> **QUY TẮC AN TOÀN DỮ LIỆU**:
> Chỉ sử dụng dữ liệu và thông tin giả lập (mock data) trong toàn bộ quá trình kiểm thử này. Tuyệt đối không nhập thông tin thật hoặc upload tài liệu nhạy cảm lên hệ thống.

Tài liệu này đóng vai trò là kịch bản nghiệm thu thực tế, giúp kiểm tra tính đúng đắn của toàn bộ luồng nghiệp vụ, phân quyền vai trò (RBAC), quy trình dọn dẹp dữ liệu cũ (Migration Panel), và động cơ sao lưu/khôi phục cơ sở dữ liệu SQLite trong Phase 4.

---

## Tài khoản Kiểm thử Mặc định
- **Admin**: `admin@legalflow.local` / `Admin@123!`
- **Manager**: `manager@legalflow.local` / `Manager@123!`
- **Staff**: `staff@legalflow.local` / `Staff@123!`
- **Viewer**: `viewer@legalflow.local` / `Viewer@123!`

---

## 1. Nghiệm thu phân quyền theo Vai trò (RBAC Scenarios)

### Kịch bản 1: Vai trò VIEWER (Chỉ xem)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **V-01** | **Truy cập Dashboard** | 1. Đăng nhập bằng tài khoản Viewer.<br>2. Xem thống kê trên Dashboard. | Truy cập thành công. Biểu đồ và thông số thống kê tải đầy đủ dữ liệu từ Backend. | [ ] |
| **V-02** | **Xem danh sách & chi tiết** | 1. Vào Tab "Hồ sơ".<br>2. Thử lọc theo trạng thái.<br>3. Bấm xem chi tiết 1 hồ sơ. | Xem được danh sách và chi tiết. **Không có nút "Tạo mới" hoặc cột "Xóa"**. Không có quyền cập nhật trạng thái, lưu ghi chú hay checkbox checklist (tất cả bị khóa/read-only). | [ ] |
| **V-03** | **Bảo mật URL (RBAC)** | 1. Nhập trực tiếp URL tạo mới `/cases/new` trên thanh địa chỉ. | Giao diện tự động chặn và đẩy về trang danh sách hoặc thông báo không có quyền truy cập. | [ ] |

---

### Kịch bản 2: Vai trò STAFF (Nhân sự thụ lý)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **S-01** | **Tạo hồ sơ mới** | 1. Đăng nhập bằng Staff.<br>2. Bấm "Tạo mới" -> Nhập thông tin giả -> Lưu. | Tạo thành công. Mã hồ sơ tự động sinh dạng tiếng Việt (Ví dụ: `2026-KN-001-KP3`) và tự động chuyển vào trang chi tiết hồ sơ. | [ ] |
| **S-02** | **Cập nhật hồ sơ (Của mình)** | 1. Tại hồ sơ vừa tạo, mở tab Ghi chú -> gửi ghi chú.<br>2. Mở Checklist -> tick chọn.<br>3. Thay đổi trạng thái sang "Đang xử lý". | Lưu thành công. Tab "Lịch sử" ghi nhận đầy đủ lịch sử thay đổi của Staff vừa thực hiện. | [ ] |
| **S-03** | **Quyền hạn trên hồ sơ người khác** | 1. Xem chi tiết hồ sơ do tài khoản khác tạo (chưa gán cho mình).<br>2. Thử lưu ghi chú hoặc đổi trạng thái. | Giao diện chặn không cho thao tác ghi, hoặc nút bấm bị ẩn (nếu bấm gửi API sẽ báo lỗi 403 Forbidden). | [ ] |
| **S-04** | **Quyền xóa hồ sơ** | 1. Kiểm tra danh sách hồ sơ hoặc chi tiết hồ sơ do mình tạo. | **Không hiển thị nút Xóa** (Staff tuyệt đối không có quyền Delete). | [ ] |

---

### Kịch bản 3: Vai trò MANAGER (Quản lý)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **M-01** | **Cập nhật hồ sơ bất kỳ** | 1. Đăng nhập bằng Manager.<br>2. Chọn một hồ sơ do Staff khác tạo.<br>3. Thêm ghi chú mới và đổi trạng thái hồ sơ. | Lưu thành công. Cập nhật được dữ liệu của toàn bộ nhân viên. Tab Lịch sử ghi nhận đúng tên Manager. | [ ] |
| **M-02** | **Xóa mềm hồ sơ (Soft Delete)** | 1. Chọn một hồ sơ trong danh sách.<br>2. Bấm biểu tượng Thùng rác -> Xác nhận xóa. | Xóa thành công. Hồ sơ biến mất khỏi danh sách nghiệp vụ thông thường (đã được ẩn an toàn dưới DB bằng soft-delete). | [ ] |

---

### Kịch bản 4: Vai trò ADMIN (Quản trị viên)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **A-01** | **Toàn quyền hệ thống** | 1. Kiểm tra Dashboard, Cases CRUD, ghi chú, lịch sử. | Toàn quyền thao tác trên toàn bộ hệ thống giống Manager. | [ ] |
| **A-02** | **Quyền quản trị nâng cao** | 1. Kiểm tra quyền vào phần cấu hình `/settings` và Migration. | Truy cập thành công. Đây là vai trò duy nhất hiển thị bảng điều khiển di trú MigrationPanel. | [ ] |

---

## 2. Nghiệm thu Tính năng Nghiệp vụ nâng cao

### Kịch bản 5: Biên soạn dự thảo (Drafts - Backend Integrated)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **D-01** | **Liên kết hồ sơ Backend** | 1. Vào Tab "Biên soạn dự thảo" (`/drafts`).<br>2. Mở danh sách chọn hồ sơ liên kết. | Danh sách tải đầy đủ và chính xác các mã hồ sơ thật trực tiếp từ Database Backend. | [ ] |
| **D-02** | **Tự động điền dữ liệu mẫu** | 1. Chọn 1 hồ sơ từ dropdown.<br>2. Chọn mẫu "Biên nhận hồ sơ". | Các trường thông tin (Người nộp, Địa chỉ, Nội dung...) tự động điền chính xác thông tin từ hồ sơ backend được chọn. | [ ] |
| **D-03** | **Sao chép và Xuất Word** | 1. Bấm nút "Sao chép" văn bản.<br>2. Bấm nút "Tải file Word" (.docx). | Sao chép thành công vào Clipboard. File `.docx` được tải về máy hoàn chỉnh cấu trúc và định dạng biểu mẫu hành chính. | [ ] |

---

### Kịch bản 6: MigrationPanel (Di trú và Dọn dẹp Local Dữ liệu cũ)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **MP-01** | **Nhận dạng dữ liệu cũ** | 1. Chuẩn bị 5 hồ sơ giả trong `localStorage['legalflow_cases']`.<br>2. Đăng nhập Admin -> `/settings`. | Panel nhận diện đúng số lượng hồ sơ cũ trong local, hiện thông báo "Chưa sao lưu" và "Chưa di trú". Nút "Xóa dữ liệu cũ" bị ẩn hoàn toàn. | [ ] |
| **MP-02** | **Sao lưu dữ liệu JSON** | 1. Bấm nút "Xuất file Backup (.json)". | Tải về file backup JSON chứa toàn bộ dữ liệu localStorage. Trạng thái sao lưu đổi thành "Đã sao lưu" (màu xanh lá). | [ ] |
| **MP-03** | **Preview & Import toàn bộ** | 1. Bấm "Xem trước và di trú".<br>2. Chọn tất cả hồ sơ.<br>3. Bấm "Tiến hành di trú lên Backend". | Hiển thị bảng Migration Report. Hệ thống import và báo cáo trạng thái từng hồ sơ (imported/already_migrated/failed). | [ ] |
| **MP-04** | **Phát hiện trùng lặp (Duplicate)** | 1. Import lại hồ sơ đã được di chuyển trước đó. | Trạng thái báo `possible_duplicate` hoặc `already_migrated`, ngăn chặn việc import trùng lặp tạo rác dữ liệu trên backend. | [ ] |
| **MP-05** | **Xóa sạch dữ liệu cũ an toàn** | 1. Đảm bảo toàn bộ hồ sơ đã xử lý xong (pending = 0, failed = 0) và đã backup.<br>2. Bấm nút "Xóa dữ liệu localStorage cũ" vừa xuất hiện.<br>3. Nhấp HỦY ở xác nhận Lớp 1 -> dữ liệu giữ nguyên.<br>4. Nhấp HỦY ở xác nhận Lớp 2 -> dữ liệu giữ nguyên.<br>5. Xác nhận đầy đủ -> localStorage cũ được làm sạch. Xuất hiện marker `legalflow_local_cleanup_completed` trong local storage. | Xóa thành công. Local storage được giải phóng, dữ liệu trên backend vẫn an toàn 100%. | [ ] |

---

## 3. Nghiệm thu Động cơ Sao lưu & Phục hồi (SQLite Engine)

### Kịch bản 7: Quy trình Backup và Restore

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái |
|:---|:---|:---|:---|:---|
| **BR-01** | **Sao lưu dữ liệu SQLite** | 1. Mở terminal tại `legalflow-backend/`.<br>2. Chạy lệnh: `npm run db:backup`. | Thực thi thành công. File sao lưu có tên chứa timestamp chính xác được lưu vào thư mục `backups/`, kích thước file > 0 KB. | [ ] |
| **BR-02** | **Hủy phục hồi - Lớp 1** | 1. Chạy lệnh: `npm run db:restore`.<br>2. Chọn bản sao lưu muốn restore.<br>3. Tại câu hỏi Xác nhận lớp 1: Gõ `n` (hoặc phím bất kỳ khác y). | Tiến trình dừng ngay lập tức. Dữ liệu DB hiện tại hoàn toàn giữ nguyên, không thay đổi. | [ ] |
| **BR-03** | **Hủy phục hồi - Lớp 2** | 1. Chạy lệnh: `npm run db:restore`.<br>2. Chọn bản sao lưu, gõ `y` ở lớp 1.<br>3. Tại câu hỏi Xác nhận lớp 2: Gõ sai từ khóa `RESTORE-CONFIRM` (Ví dụ: `123` hoặc `CONFIRM`). | Xác thực thất bại, tiến trình dừng ngay lập tức. Dữ liệu DB hiện tại giữ nguyên. | [ ] |
| **BR-04** | **Phục hồi thành công** | 1. Chỉnh sửa hoặc xóa bớt 1 hồ sơ trên giao diện để tạo sai lệch dữ liệu.<br>2. Chạy lệnh `npm run db:restore`.<br>3. Chọn bản backup cũ, gõ `y` và gõ đúng `RESTORE-CONFIRM`. | **Khôi phục thành công**: <br>1. Hệ thống tự động tạo một tệp lưu dự phòng trước phục hồi dạng `pre_restore_YYYYMMDD_HHMMSS.db`. <br>2. Ghi đè thành công tệp chính. <br>3. Restart lại backend -> F5 trình duyệt -> dữ liệu cũ khôi phục hoàn chỉnh 100%. | [ ] |
| **BR-05** | **Khóa tiến trình (Lock Check)** | 1. Bật server backend (`npm run start:dev`).<br>2. Mở một terminal khác, chạy lệnh: `npm run db:restore`.<br>3. Thực hiện đầy đủ 2 lớp xác nhận. | Do server đang chạy và giữ khóa file SQLite trên Windows, script sẽ phát hiện lỗi hệ thống (`EBUSY` hoặc `EPERM`), dừng lại an toàn, in thông báo màu đỏ yêu cầu người dùng tắt backend server và thử lại. | [ ] |
| **BR-06** | **Rollback khẩn cấp** | 1. Sau khi restore thành công ở `BR-04`, thực hiện rollback về trạng thái ngay trước thời điểm restore bằng cách chạy: `npm run db:restore pre_restore_YYYYMMDD_HHMMSS.db`. | Cơ sở dữ liệu quay về chính xác trạng thái chứa các chỉnh sửa sai lệch trước khi thực hiện kịch bản `BR-04`. | [ ] |

---

## 4. Nghiệm thu Quản lý Người dùng (Phase 4.1)

### Kịch bản 8: Quản trị Tài khoản & Phân quyền Nâng cao (ADMIN Only)

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected Result) | Trạng thái |
|:---|:---|:---|:---|:---|
| **UM-01** | **Bảo mật URL và Sidebar** | 1. Đăng nhập bằng tài khoản `manager` / `staff` / `viewer`.<br>2. Kiểm tra xem Sidebar có hiển thị mục "Quản lý tài khoản" không.<br>3. Thử nhập thủ công địa chỉ `/users` trên thanh địa chỉ. | 1. Sidebar **hoàn toàn không hiển thị** "Quản lý tài khoản" đối với non-ADMIN.<br>2. Nhập URL thủ công sẽ lập tức bị chặn và redirect về `/dashboard`. | [ ] |
| **UM-02** | **Thêm người dùng mới** | 1. Đăng nhập bằng `admin`.<br>2. Truy cập `/users` -> Chọn "Tạo tài khoản mới".<br>3. Điền Họ tên, Email, Vai trò (STAFF).<br>4. Nhập mật khẩu tạm thời vi phạm độ phức tạp (ví dụ `12345`).<br>5. Nhập mật khẩu tạm thời hợp lệ (ví dụ `Staff@123!`). | 1. Khi nhập mật khẩu vi phạm, bảng kiểm tra độ phức tạp hiển thị dấu X đỏ và nút "Lưu tài khoản" bị vô hiệu hóa.<br>2. Nhập mật khẩu hợp lệ sẽ kích hoạt nút Lưu.<br>3. Lưu thành công, người dùng mới hiển thị ở đầu danh sách. | [ ] |
| **UM-03** | **Kiểm tra Normalization & Trùng email** | 1. Tiếp tục bấm tạo tài khoản mới.<br>2. Nhập email đã tồn tại ở trên nhưng có viết hoa hoặc chứa khoảng trắng ở hai đầu (Ví dụ: ` STAFF@legalflow.local `).<br>3. Bấm Lưu. | 1. Hệ thống tự động trim khoảng trắng và chuyển chữ thường.<br>2. Backend chặn trùng lặp, trả về mã lỗi `409 Conflict`. Trình duyệt hiển thị thông báo lỗi "Email này đã được sử dụng". | [ ] |
| **UM-04** | **Đăng nhập & Reset mật khẩu tạm** | 1. Đăng xuất Admin.<br>2. Đăng nhập bằng tài khoản Staff mới tạo bằng mật khẩu tạm `Staff@123!` -> Đăng nhập thành công.<br>3. Đăng nhập lại bằng Admin -> vào `/users` -> Bấm nút Chìa khóa để Reset mật khẩu của Staff này thành `NewStaff@123!`. | 1. Staff mới đăng nhập thành công vào trang dành riêng cho Staff.<br>2. Admin đặt lại mật khẩu thành công. Giao diện ẩn mật khẩu sau khi lưu.<br>3. Staff đăng nhập bằng mật khẩu cũ báo lỗi, đăng nhập bằng mật khẩu mới thành công. | [ ] |
| **UM-05** | **Khóa/Mở khóa người dùng** | 1. Admin vào `/users` -> Bấm biểu tượng Khóa đối với Staff mới tạo -> Xác nhận ở popup.<br>2. Đăng xuất Admin.<br>3. Thử đăng nhập bằng tài khoản Staff vừa bị khóa. | 1. Tài khoản Staff chuyển sang trạng thái "Đã bị khóa" (Badge màu đỏ).<br>2. Đăng nhập bằng tài khoản này bị từ chối lập tức với mã lỗi `401 Unauthorized` và thông báo tài khoản bị khóa. | [ ] |
| **UM-06** | **Bảo vệ ADMIN cuối cùng và chính mình** | 1. Admin kiểm tra dòng tài khoản của chính mình trong danh sách.<br>2. Admin thử thay đổi vai trò của tài khoản Admin duy nhất khác (hoặc chính mình nếu chỉ có 1 Admin) sang role khác. | 1. Nút Khóa (`Lock`) và Xóa (`Delete`) trên dòng của chính Admin đang đăng nhập **bị disabled hoàn toàn** (ngăn chặn tự khóa/tự xóa).<br>2. Thay đổi vai trò hoặc khóa Admin cuối cùng bị Backend chặn lập tức và báo lỗi 400 BadRequest. | [ ] |
| **UM-07** | **Xóa tài khoản vĩnh viễn (Hard Delete)** | 1. Admin chọn tài khoản Staff mới tạo chưa có hồ sơ nghiệp vụ liên quan -> Bấm Xóa -> Xác nhận.<br>2. Admin chọn một tài khoản Staff cũ đã thực hiện tạo hồ sơ hoặc ghi chú trước đó -> Bấm Xóa -> Xác nhận. | 1. Tài khoản chưa có liên kết bị **xóa cứng vĩnh viễn** khỏi danh sách thành công.<br>2. Tài khoản đã có liên kết bị chặn xóa, Backend trả về 409 Conflict. Trình duyệt hiển thị thông báo: *"Không thể xóa tài khoản này vì đã có dữ liệu nghiệp vụ liên kết. Hãy khóa tài khoản thay thế."* | [ ] |
| **UM-08** | **JWT Hardening & Real-time Lockout** | 1. Mở 2 trình duyệt song song. Trình duyệt A đăng nhập bằng tài khoản Staff. Trình duyệt B đăng nhập bằng Admin.<br>2. Tại trình duyệt B, Admin thực hiện Khóa hoặc đổi role của Staff từ STAFF thành VIEWER.<br>3. Tại trình duyệt A, Staff thực hiện 1 thao tác ghi (Ví dụ: gửi ghi chú trên hồ sơ). | 1. Ngay khi Admin khóa/đổi vai trò ở trình duyệt B, yêu cầu gửi ghi chú của Staff ở trình duyệt A lập tức bị Backend chặn đứng (401 do bị khóa hoặc 403 do đổi role).<br>2. Token cũ bị từ chối ngay lập tức do hệ thống kiểm tra real-time database trên mỗi request. | [ ] |
| **UM-09** | **Bảo mật Log và Response** | 1. Admin mở console log của Backend hoặc xem database SQLite.<br>2. Kiểm tra log của các thao tác `CREATE_USER`, `UPDATE_USER`, `RESET_PASSWORD` vừa qua.<br>3. Kiểm tra payload response từ mạng (F12 Network). | 1. Các hành động được ghi nhận đầy đủ với prefix chuẩn.<br>2. **Tuyệt đối không chứa mật khẩu tạm hoặc passwordHash** trong console logs.<br>3. Response payload chỉ chứa các trường thông tin cơ bản an toàn, **không bao giờ trả về passwordHash, JWT_SECRET hay DATABASE_URL**. | [ ] |

---

## 5. Nghiệm thu Hồ sơ cá nhân & Tự đổi mật khẩu (Phase 4.2)

### Kịch bản 9: Hồ sơ người dùng & Tự đổi mật khẩu

| ID | Test Case | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected Result) | Trạng thái |
|:---|:---|:---|:---|:---|
| **UP-01** | **Xem hồ sơ cá nhân** | 1. Đăng nhập bằng tài khoản bất kỳ (Ví dụ: `staff@legalflow.local`).<br>2. Truy cập `/settings`. <br>3. Chọn tab **Tài khoản của tôi**. | Hiển thị đúng Họ tên, Email, Vai trò (STAFF) và Trạng thái hoạt động, khớp hoàn toàn với tài khoản đang đăng nhập. | [ ] |
| **UP-02** | **Đổi mật khẩu - Sai mật khẩu hiện tại** | 1. Tại tab Tài khoản của tôi, nhập Mật khẩu hiện tại sai.<br>2. Nhập Mật khẩu mới đạt chuẩn và xác nhận khớp.<br>3. Bấm **Cập nhật mật khẩu mới**. | Hệ thống chặn thao tác, hiển thị Banner lỗi rõ ràng: *"Mật khẩu hiện tại không chính xác"*. Người dùng vẫn duy trì đăng nhập, mật khẩu cũ không bị đổi. | [ ] |
| **UP-03** | **Đổi mật khẩu - Mật khẩu mới yếu** | 1. Nhập Mật khẩu hiện tại đúng.<br>2. Nhập Mật khẩu mới vi phạm tiêu chuẩn (ví dụ chỉ có 6 ký tự hoặc không có ký tự đặc biệt). | 1. Real-time Checklist hiển thị các tiêu chí chưa đạt bằng màu đỏ hoặc xám kèm dấu X.<br>2. Nút "Cập nhật mật khẩu mới" bị disabled hoàn toàn, không thể nhấn submit. | [ ] |
| **UP-04** | **Đổi mật khẩu - Xác nhận không khớp** | 1. Nhập Mật khẩu hiện tại đúng.<br>2. Nhập Mật khẩu mới đạt chuẩn.<br>3. Nhập Mật khẩu xác nhận khác mật khẩu mới. | 1. Hiển thị cảnh báo màu đỏ: *"Mật khẩu xác nhận chưa trùng khớp"*.<br>2. Nút Cập nhật bị disabled, không cho submit. | [ ] |
| **UP-05** | **Đổi mật khẩu - Trùng mật khẩu cũ** | 1. Nhập Mật khẩu hiện tại đúng.<br>2. Nhập Mật khẩu mới trùng khớp 100% mật khẩu hiện tại.<br>3. Nhập xác nhận khớp -> Bấm cập nhật. | Hệ thống chặn thao tác và hiển thị Banner lỗi rõ ràng: *"Mật khẩu mới không được trùng với mật khẩu hiện tại"*. | [ ] |
| **UP-06** | **Đổi mật khẩu thành công & Đăng xuất** | 1. Nhập Mật khẩu hiện tại đúng (`Staff@123!`).<br>2. Nhập Mật khẩu mới đạt chuẩn (`NewStaff@123!`) và xác nhận khớp.<br>3. Bấm **Cập nhật mật khẩu mới**. | 1. Form chuyển sang trạng thái Loading (hiển thị Spinner trên nút).<br>2. Đổi mật khẩu thành công, hiển thị Banner thành công màu xanh lá.<br>3. **Đúng 1.5 giây sau**, hệ thống tự động đăng xuất, xóa sạch token khỏi `sessionStorage` và điều hướng về trang `/login`. | [ ] |
| **UP-07** | **Xác minh hiệu lực mật khẩu mới** | 1. Tại màn hình `/login`, thử đăng nhập lại tài khoản đó bằng mật khẩu cũ (`Staff@123!`).<br>2. Thử đăng nhập lại bằng mật khẩu mới (`NewStaff@123!`). | 1. Đăng nhập bằng mật khẩu cũ bị từ chối truy cập.<br>2. Đăng nhập bằng mật khẩu mới thành công, đưa người dùng vào Dashboard hoạt động bình thường. | [ ] |
| **UP-08** | **Chống giả mạo userId** | 1. Đăng nhập bằng tài khoản Staff.<br>2. Dùng công cụ cURL/Postman giả lập gửi request đổi mật khẩu `POST /auth/change-password` nhưng chèn thêm trường ID của Admin trong body hoặc query string.<br>3. Xác nhận kết quả. | Hệ thống chỉ đổi mật khẩu của CHÍNH tài khoản Staff đang gửi request (lấy từ `req.user.id` của token giải mã), hoàn toàn không làm ảnh hưởng đến mật khẩu của Admin. | [ ] |
| **UP-09** | **Bảo mật logs & response** | 1. Kiểm tra Network response của API đổi mật khẩu thành công.<br>2. Kiểm tra console log phía Backend Server. | 1. Response không chứa bất kỳ trường nào liên quan đến `passwordHash` hay mật khẩu thô.<br>2. Backend log chỉ in dòng: `[CHANGE_PASSWORD] User (email) changed password successfully`, tuyệt đối không rò rỉ mật khẩu thô. | [ ] |
| **UP-10** | **Bảo toàn chức năng cũ (Settings)** | 1. Truy cập tab **Cài đặt hệ thống & Dữ liệu**.<br>2. Kiểm tra các chức năng: sao lưu JSON, khôi phục JSON, MigrationPanel và dọn dẹp localStorage. | Tất cả chức năng cũ đều hiển thị đầy đủ, giữ nguyên các biến trạng thái, hoạt động ổn định và chính xác 100% không bị ảnh hưởng. | [ ] |

---
*Mọi kết quả kiểm thử không khớp với Kết quả mong đợi (Expected Result) đều được coi là Fail và cần được chụp màn hình, ghi nhận log lỗi gửi cho nhóm phát triển.*


