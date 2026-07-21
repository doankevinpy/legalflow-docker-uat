# Đặc Tả Phân Hệ Cải Tiến Trải Nghiệm & Đào Tạo (`UX Backlog & Training Feature Specification`) - v2.13

## 1. Mục Đích (`Purpose`)
Tập trung giải quyết các khoản nợ kỹ thuật về giao diện (UI/UX) và bổ sung hướng dẫn thao tác (Training materials) nhằm giảm thiểu lỗi vận hành từ người dùng cuối.

## 2. Phạm Vi (`Scope`)
Toàn bộ các thành phần tương tác của hệ thống, bao gồm cảnh báo thị giác, tốc độ phản hồi (Tooltip), và điều hướng luồng phê duyệt.

## 3. Đường Cơ Sở (`Baseline`)
* **Thẻ tham chiếu:** `v2.13-development`
* Kế thừa báo cáo nợ kỹ thuật (UX Backlog) từ Phase 12R-ALT.

## 4. Trạng Thái Hiện Tại, Hạn Chế & Hành Động Tương Lai (`Current Status, Limitations, Future Actions`)
* **Trạng thái:** Đang trong chu kỳ phát triển (`Development Phase`).
* **Hạn chế:** Các nâng cấp giao diện không được phép làm thay đổi Workflow cốt lõi hay vượt quyền truy cập, in accordance with governance rules.
* **Hành động tương lai:** Áp dụng thiết kế mới (Redesign) lên môi trường mô phỏng.

## 5. Quy Trình Chi Tiết (`Detailed Workflow`)
1. **Data Input:** Người dùng nhập liệu trên giao diện mới. Phản hồi thị giác (Ví dụ: Thanh tải tệp Batch ZIP) được cải thiện.
2. **Validation:** Giao diện tự động báo lỗi ngay tại trường nhập liệu (Client-side validation) song song với Backend validation, reduces the likelihood người dùng gửi sai thông tin.
3. **Human Verification:** Hệ thống cung cấp nhãn dán "Dự Kiến" nổi bật, cảnh báo người dùng phải nhìn nhận số liệu một cách thận trọng (Estimate Labeling).
4. **Completion:** Giao diện xác nhận thành công hiển thị rõ ràng mã hồ sơ và chỉ dẫn bước tiếp theo.

## 6. Tham Chiếu Bằng Chứng (`Evidence Reference`)
* **Dữ liệu giả lập:** `[PLACEHOLDER - LINK TO UI/UX USABILITY TEST REPORTS]`
* **Trạng thái kiểm thử:** PASS / VERIFIED within controlled pilot scope.

## 7. Cột Mốc Phát Triển (`Milestones`)
* **Short-term:** Xử lý triệt để lỗi trễ Tooltip (Issue `ISSUE-UAT-12K-01`).
* **Long-term:** Chuẩn hóa toàn bộ bộ ngôn ngữ giao diện (Design System) theo chuẩn hành chính.
