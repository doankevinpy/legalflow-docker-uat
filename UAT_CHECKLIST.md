# LegalFlow v0.4.0 UAT Checklist (Kịch bản Nghiệm thu Người dùng)

> [!WARNING]
> **Dữ liệu giả:** Chỉ sử dụng các thông tin và dữ liệu giả định (fake data) trong quá trình kiểm thử này. Tuyệt đối không nhập dữ liệu thật, thông tin định danh khách hàng (PII) hoặc tài liệu nội bộ nhạy cảm lên hệ thống ở giai đoạn này.

## Giới thiệu
Tài liệu này dùng để kiểm thử độc lập các tính năng ở góc nhìn của người dùng thực tế. Các Test Case được phân theo 4 vai trò (Role): Admin, Manager, Staff và Viewer. 

**Tài khoản Test mặc định:**
- `admin@legalflow.local` / `Admin@123!`
- `manager@legalflow.local` / `Manager@123!`
- `staff@legalflow.local` / `Staff@123!`
- `viewer@legalflow.local` / `Viewer@123!`

---

## 1. Role: VIEWER (Chỉ xem)

| ID | Test Case | Bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái (Pass/Fail) |
|:---|:---|:---|:---|:---|
| **V-01** | **Đăng nhập & Logout** | 1. Vào `/login`, nhập `viewer@legalflow.local` / `Viewer@123!`.<br>2. Bấm Đăng xuất từ thanh Header. | Đăng nhập vào màn Dashboard. Logout sẽ xoá token và trả về `/login`. | [ ] |
| **V-02** | **Truy cập Dashboard** | 1. Login bằng tài khoản Viewer.<br>2. Xem các thông số thống kê. | Hiển thị đúng số lượng hồ sơ, các biểu đồ (nếu có), số liệu trích xuất từ server. | [ ] |
| **V-03** | **Xem danh sách & Lọc** | 1. Mở "Hồ sơ".<br>2. Thử lọc theo trạng thái, loại đơn. Thử phân trang. | Dữ liệu bảng phản hồi đúng. Không thấy nút "Tạo mới" hoặc cột "Xóa". | [ ] |
| **V-04** | **Xem chi tiết hồ sơ** | 1. Bấm vào một mã hồ sơ bất kỳ.<br>2. Xem các tab: Ghi chú, Checklist, Lịch sử. | Hiện đầy đủ các tab. Checkbox bị disable (mờ). Không thấy nút "Lưu ghi chú". Thẻ dropdown trạng thái cũng bị khóa hoặc không thay đổi được. | [ ] |
| **V-05** | **Xác thực RBAC UI/API** | 1. Nhập trực tiếp URL `/cases/new` trên thanh địa chỉ.<br>2. Nhập URL truy cập settings (Migration). | Bị đẩy (redirect) về danh sách hoặc báo "Không có quyền". Các nút thao tác dữ liệu đều bị ẩn. | [ ] |

---

## 2. Role: STAFF (Nhân sự thụ lý)

| ID | Test Case | Bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái (Pass/Fail) |
|:---|:---|:---|:---|:---|
| **S-01** | **Tạo hồ sơ mới** | 1. Bấm "Tạo mới".<br>2. Nhập Người gửi, Chọn Loại đơn, Khu phố, Tóm tắt.<br>3. Bấm "Lưu". | Case được lưu, tự động sinh mã (VD: `2026-KN-015-KP3`) và nhảy sang màn chi tiết hồ sơ đó. | [ ] |
| **S-02** | **Cập nhật hồ sơ (Của mình)** | 1. Vẫn ở case vừa tạo, mở tab Ghi chú, gõ text và lưu.<br>2. Mở tab Checklist, tick/untick.<br>3. Đổi trạng thái case sang "Đang xử lý". | Thực hiện thành công. Tab "Lịch sử" ghi nhận đủ các thao tác vừa làm của user. | [ ] |
| **S-03** | **Truy cập hồ sơ người khác** | 1. Quay lại danh sách hồ sơ.<br>2. Chọn một hồ sơ do tài khoản khác tạo (và chưa assign cho mình).<br>3. Thử đổi checklist hoặc thêm note. | Giao diện cho xem (Read-only) nhưng API chặn lưu lỗi 403 Forbidden. (Nút có thể hiện nhưng bấm sẽ báo lỗi, hoặc nút bị ẩn tuỳ logic UI). | [ ] |
| **S-04** | **Phân quyền xóa** | 1. Mở danh sách hồ sơ hoặc chi tiết hồ sơ do mình tạo. | Không thấy nút Xóa (Staff không có quyền Delete, dù là bài tự tạo). | [ ] |

---

## 3. Role: MANAGER (Quản lý)

| ID | Test Case | Bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái (Pass/Fail) |
|:---|:---|:---|:---|:---|
| **M-01** | **Can thiệp hồ sơ bất kỳ** | 1. Login bằng Manager.<br>2. Chọn một hồ sơ do Staff tạo.<br>3. Thêm Note và Checkbox. | Cập nhật được hồ sơ của tất cả nhân viên. Lịch sử hiển thị tên Manager đã sửa. | [ ] |
| **M-02** | **Xóa hồ sơ (Soft Delete)** | 1. Ở danh sách hồ sơ, tìm hồ sơ nháp vừa test.<br>2. Bấm nút Trash/Xóa, xác nhận Xóa. | Hệ thống báo thành công. Hồ sơ biến mất khỏi danh sách (API đã ẩn deleted case). | [ ] |
| **M-03** | **Công cụ Drafts** | 1. Vào menu Dự thảo/Drafts.<br>2. Chọn mẫu in Biên nhận. | Giao diện Drafts hiển thị và tạo được docx thành công. (Drafts hiện tại vẫn dùng local). | [ ] |

---

## 4. Role: ADMIN (Quản trị viên)

| ID | Test Case | Bước thực hiện (Steps) | Kết quả mong đợi (Expected) | Trạng thái (Pass/Fail) |
|:---|:---|:---|:---|:---|
| **A-01** | **Toàn quyền thao tác** | 1. Mở danh sách hồ sơ.<br>2. Lọc tất cả, xem và chỉnh sửa tuỳ ý. | Giống hệt tính năng của Manager, toàn quyền trên toàn hệ thống. | [ ] |
| **A-02** | **Sử dụng MigrationPanel** | 1. Chuẩn bị 1 ít dữ liệu giả trong `localStorage`.<br>2. Mở `/settings`, kéo xuống phần Migration.<br>3. Bấm "Detect" → "Export Backup" → "Preview" → "Import". | Bảng report hiển thị danh sách hồ sơ pass. Danh sách hồ sơ thật hiển thị bên trang `/cases`. | [ ] |
| **A-03** | **Tràn token (Edge case)** | 1. Login bằng Admin.<br>2. Mở DevTools (F12) → Application → Session Storage, xoá key `lf_access_token`.<br>3. Chuyển hướng sang 1 tab bất kỳ. | Frontend báo lỗi 401 hoặc tự động log-out và văng ra trang Login. | [ ] |

---
*Mọi kết quả không đúng với Expected Result cần được ghi chú lại vào ô (Fail) kèm theo lý do cụ thể hoặc màn hình lỗi.*
