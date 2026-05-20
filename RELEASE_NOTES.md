# Release Notes

## v0.2.0-case-id-format (20/05/2026)

### Features
- **Format Mã Hồ Sơ Mới**: Chuyển đổi format từ `HS-YYMM-XXXX` sang `[YYYY]-[Mã loại đơn]-[Số thứ tự]-[Khu phố]` (VD: `2026-KN-015-KP3`).
- **Trường "Khu phố"**: Thêm lựa chọn khu phố bắt buộc vào luồng tạo mới hồ sơ. Hỗ trợ hiển thị và lọc theo khu phố tại danh sách. Tự động chuyển tên `Khác` thành `KHAC` trong mã hồ sơ.

### Improvements
- Cơ chế sinh mã hồ sơ hoàn toàn khép kín, tránh lặp lại bằng thuật toán tự động tìm mốc và lặp.
- Migration Data Script được tích hợp: Tự động phát hiện format cũ và tạo mã mới tương ứng với hệ thống khu phố, đồng thời backup json an toàn sang biến cục bộ.

### Bug Fixes
- Khắc phục lỗ hổng trùng lặp mã ở các phiên bản trước do hàm random.
- Khắc phục sự cố build TypeScript liên quan tới biến không sử dụng và Component không hợp lệ.
