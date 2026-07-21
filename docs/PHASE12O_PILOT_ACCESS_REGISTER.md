# Sổ Đăng Ký Tài Khoản & Ma Trận Truy Cập Thí Điểm (`Pilot Access Register`) - Giai Đoạn 12O

## 1. Mục Đích (Purpose)
Định nghĩa ma trận phân quyền RBAC và danh sách các tài khoản kiểm thử tiêu chuẩn phục vụ cho giai đoạn thí điểm (Pilot) phân hệ Nghĩa vụ tài chính. Mọi rào chắn in accordance with governance rules.

## 2. Ma Trận Phân Quyền (RBAC Matrix)
Phân hệ áp dụng nguyên tắc phân quyền đặc quyền tối thiểu cho 04 vai trò chính:
* **`RECEIVING_OFFICER`**: Tải lên bản scan chứng từ nộp tiền.
* **`REVIEWING_OFFICER`**: Kiểm tra, xác nhận (verify) tính hợp lệ của chứng từ.
* **`APPROVAL_MANAGER`**: Rà soát đối chiếu kép (Dual control) cho các hồ sơ có rủi ro.
* **`ADMIN`**: Quản lý cấu hình, bật/tắt cờ tính năng (Feature Flag), theo dõi audit logs.

Cơ chế phân quyền này reduces the likelihood việc vượt quyền truy cập trái phép. Trạng thái phân quyền: PASS / VERIFIED within controlled pilot scope.

## 3. Danh Sách Tài Khoản Thí Điểm (Pilot Account Roster)
* Tất cả tài khoản sử dụng trong giai đoạn thí điểm đều là tài khoản giả lập, không đại diện cho nhân sự thật nếu không có sự ủy quyền.
* Phạm vi hoạt động giới hạn cho 08 hồ sơ mô phỏng (`DEMO-FO-UAT-01` đến `DEMO-FO-UAT-08`).
* Không sử dụng thông tin công dân hay dữ liệu CCCD thực tế, tuân thủ in accordance with governance rules.

## 4. Kiểm Soát Truy Cập (Access Controls)
Việc sử dụng luồng truy cập nội bộ (LAN / VPN) đã được kiểm chứng. Tình trạng cách ly mạng: PASS / VERIFIED within controlled pilot scope.
