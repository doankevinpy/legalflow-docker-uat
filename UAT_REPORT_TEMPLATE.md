# Báo cáo Nghiệm thu Người dùng (UAT Report) - LegalFlow v0.5.0

Tài liệu này dùng để ghi nhận kết quả kiểm thử chấp nhận người dùng (User Acceptance Testing) đối với hệ thống **LegalFlow v0.5.0**. Người kiểm thử sẽ dựa vào danh sách kịch bản dưới đây, thực hiện trên môi trường chạy thử và ghi nhận kết quả thực tế.

---

## 1. Thông tin chung
*   **Môi trường thử nghiệm**: Local Trial / Intranet
*   **Phiên bản hệ thống**: `v0.5.0-safe-ops-backup-restore`
*   **Ngày bắt đầu UAT**: [Điền ngày]
*   **Ngày hoàn thành UAT**: [Điền ngày]
*   **Trưởng nhóm kiểm thử (UAT Lead)**: [Điền tên]

---

## 2. Bảng kết quả kiểm thử chi tiết (Test Case Registry)

| ID | Nhóm Tính Năng | Kịch Bản Kiểm Thử | Vai Trò | Kết Quả (Pass/Fail) | Lỗi Phát Hiện (Nếu Có) | Mức Độ (Critical/High/Medium/Low) | Người Test | Ngày Test |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **UAT-001** | Xác thực & RBAC | Đăng nhập thành công với 4 tài khoản mặc định (Admin, Manager, Staff, Viewer). | Tất cả | | | | | |
| **UAT-002** | Xác thực & RBAC | Tài khoản `Viewer` chỉ được xem danh sách và chi tiết hồ sơ; các nút Thêm/Sửa/Xóa bị ẩn/khóa. | Viewer | | | | | |
| **UAT-003** | Xác thực & RBAC | Tài khoản `Staff` chỉ được tạo và chỉnh sửa hồ sơ do mình phụ trách; không có nút Xóa. | Staff | | | | | |
| **UAT-004** | Xác thực & RBAC | Tài khoản `Manager` có toàn quyền CRUD hồ sơ và có nút Xóa hồ sơ (Soft-delete). | Manager | | | | | |
| **UAT-005** | Quản lý Hồ sơ | Tạo mới hồ sơ, kiểm tra mã hồ sơ (`caseCode`) sinh tự động đúng chuẩn tiếng Việt (Ví dụ: `2026-KN-001-KP3`). | Staff/Mgr | | | | | |
| **UAT-006** | Quản lý Hồ sơ | Cập nhật tiến độ: Tick chọn checklist, chuyển trạng thái hồ sơ (Chờ thụ lý -> Đang xử lý -> Hoàn thành). | Staff/Mgr | | | | | |
| **UAT-007** | Quản lý Hồ sơ | Ghi chú nghiệp vụ: Thêm ghi chú tại tab Ghi chú và lưu trữ lịch sử thay đổi của hồ sơ thời gian thực. | Staff/Mgr | | | | | |
| **UAT-008** | Biên soạn Dự thảo | Chọn hồ sơ từ danh sách Backend, tự động điền thông tin vào biểu mẫu Biên nhận/Dự thảo mẫu. | Staff/Mgr | | | | | |
| **UAT-009** | Biên soạn Dự thảo | Tải xuống file dự thảo Word (.docx) và kiểm tra định dạng hiển thị thông tin trích xuất từ database. | Staff/Mgr | | | | | |
| **UAT-010** | Di trú dữ liệu | Xuất dự phòng dữ liệu localStorage cũ ra file `.json` thành công. | Admin | | | | | |
| **UAT-011** | Di trú dữ liệu | Thực hiện import hồ sơ local lên Database Backend, kiểm tra cảnh báo trùng lặp màu cam (`possible_duplicate`). | Admin | | | | | |
| **UAT-012** | Di trú dữ liệu | Nút "Xóa localStorage cũ" xuất hiện đúng lúc (khi đã backup + completed + không pending/failed). | Admin | | | | | |
| **UAT-013** | Di trú dữ liệu | Double confirm 2 lớp để xóa dữ liệu local mà không ảnh hưởng tới dữ liệu backend. | Admin | | | | | |
| **UAT-014** | Động cơ Backup | Chạy lệnh `npm run db:backup` tạo file sao lưu dạng `backup_YYYYMMDD_HHMMSS.db` trong thư mục `backups/`. | Admin | | | | | |
| **UAT-015** | Động cơ Restore | Chạy lệnh `npm run db:restore` yêu cầu xác nhận 2 lớp (nhập `y` và `RESTORE-CONFIRM`). | Admin | | | | | |
| **UAT-016** | Động cơ Restore | Tự động tạo tệp rollback dự phòng `pre_restore_*.db` trước khi ghi đè khôi phục database. | Admin | | | | | |
| **UAT-017** | Bảo mật An toàn | Đổi mật khẩu seed thông qua biến môi trường `.env` (`SEED_*_PASSWORD`) và seed lại database. | Admin | | | | | |

---

## 3. Khu vực tổng kết nghiệm thu (Summary & Sign-off)

### 📊 Thống kê số lượng kịch bản
*   **Tổng số kịch bản kiểm thử (Total Test Cases)**: 17
*   **Số lượng đạt (Passed)**: `___ / 17`
*   **Số lượng lỗi (Failed)**: `___ / 17`
*   **Tỷ lệ đạt (Pass Rate)**: `___ %`

### ❌ Danh sách lỗi phát hiện cần sửa trước khi dùng thử rộng hơn
*(Danh sách các lỗi phát hiện có mức độ nghiêm trọng **Critical** và **High** bắt buộc phải được đội kỹ thuật khắc phục trước khi triển khai thử nghiệm rộng rãi)*

| Mã Lỗi | Kịch Bản Gặp Lỗi | Mô Tả Chi Tiết Lỗi Phát Hiện | Mức Độ Nghiêm Trọng | Trạng Thái Sửa Lỗi (Chưa sửa / Đang sửa / Đã sửa) |
| :--- | :--- | :--- | :---: | :---: |
| | | | | |
| | | | | |
| | | | | |

> [!IMPORTANT]
> **Định nghĩa mức độ nghiêm trọng của lỗi:**
> *   **Critical**: Lỗi gây sập hệ thống, mất dữ liệu cơ sở dữ liệu, lỗi bảo mật nghiêm trọng (rò rỉ phân quyền), hoặc không thể tiếp tục luồng công việc chính.
> *   **High**: Tính năng chính hoạt động sai thiết kế hoặc gây gián đoạn lớn, không có giải pháp thay thế tạm thời.
> *   **Medium**: Lỗi giao diện nghiêm trọng, hoạt động sai lệch ở tính năng phụ, hoặc có giải pháp thay thế tạm thời (workaround).
> *   **Low**: Lỗi chính tả, căn lề giao diện lệch nhẹ, hoặc các góp ý nâng cao trải nghiệm người dùng (UX).

### 💡 Khuyến nghị cho Phase tiếp theo
*(Đưa ra các đề xuất cải tiến sản phẩm và quy trình nghiệp vụ cho giai đoạn phát triển tiếp theo dựa trên kết quả nghiệm thu người dùng thực tế)*

1.  **Chuyển đổi Cơ sở dữ liệu**: Đề xuất nâng cấp cơ sở dữ liệu từ SQLite cục bộ lên hệ quản trị cơ sở dữ liệu tập trung (ví dụ: PostgreSQL hoặc MySQL) để hỗ trợ lưu trữ đa người dùng thời gian thực ổn định hơn.
2.  **Lưu trữ tài liệu vật lý**: Phát triển giải pháp lưu trữ tệp đính kèm vật lý (tải tệp tin Word, PDF thật lên máy chủ hoặc S3/MinIO) thay vì chỉ lưu tên tệp giả lập như hiện tại.
3.  **Tích hợp Chữ ký số & Phê duyệt**: Bổ sung luồng duyệt dự thảo trực tuyến giữa Staff và Manager trước khi cho phép tải xuống bản chính thức.
4.  **Audit Logs chi tiết**: Xây dựng màn hình quản trị lịch sử thao tác hệ thống (Audit Trail) để Admin dễ dàng giám sát các hành động nhạy cảm như xóa hồ sơ, backup/restore dữ liệu.

---

### ✍️ Chữ ký Nghiệm thu (Sign-off)
*(Khi tỷ lệ đạt UAT đủ điều kiện và các lỗi Critical/High được khắc phục xong, đại diện các bên sẽ ký xác nhận hoàn thành)*

| Đại Diện Người Dùng (UAT Lead) | Đại Diện Nhóm Kỹ Thuật (Tech Lead) |
| :---: | :---: |
| <br><br>*(Ký và ghi rõ họ tên)*<br>Ngày: ____/____/2026 | <br><br>*(Ký và ghi rõ họ tên)*<br>Ngày: ____/____/2026 |
