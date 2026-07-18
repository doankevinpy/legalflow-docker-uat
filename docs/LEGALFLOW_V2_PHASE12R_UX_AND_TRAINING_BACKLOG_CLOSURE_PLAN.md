# Kế Hoạch Đóng Lỗ Hổng UX & Đào Tạo (`UX & Training Backlog Closure Plan`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12R
## Phase 12R: UX & Training Backlog Closure Plan

> [!CAUTION]
> **TÚYÊN BỐ KHÔNG CAN THIỆP MÃ NGUỒN (`NON-MODIFICATION MANDATE`):**
> Tài liệu này lên kế hoạch xử lý các khoản nợ kỹ thuật (Technical/UX Debt) được ghi nhận tại Phase 12P và 12Q. Các công việc này mang tính chất lập kế hoạch (Plan), **KHÔNG** sửa bất kỳ dòng code nào (`backend, frontend, css`) trong Giai đoạn 12R.

---

## 1. Danh Sách Các Hạng Mục Cải Tiến Trải Nghiệm Cán Bộ (`UX Feedback Backlog`)

| Mã Ghi Nhận (`UX ID`) | Mô Tả Hiện Tượng / Yêu Cầu Cải Tiến (`Issue Description`) | Căn Cứ (`Basis`) | Chủ Sở Hữu Kỹ Thuật (`Owner`) | Mức Độ Ưu Tiên (`Priority`) | Định Hướng Giải Pháp Kỹ Thuật (`Solution Plan`) | Giai Đoạn Đề Xuất Xử Lý (`Target Phase`) | Ảnh Hưởng Đến Mở Rộng? (`Blocks Expansion?`) |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| **`ISSUE-UAT-12K-01`** | Nhu cầu tooltip hiển thị tức thời hoặc thông báo lý do nút "Hoàn thành thủ tục" bị khóa (hiện tại hiển thị chậm ~1.5s). | Đã ghi nhận trong Phase 12Q (Mục 2). | Cán bộ Frontend (`FE_DEV`) | `MEDIUM` | Điều chỉnh thuộc tính CSS `transition-delay` hoặc sử dụng Tooltip component của hệ thống với thời gian `0.1s`. | Phát hành tiếp theo (`v2.13.0`) | **`YES`** *(Yêu cầu làm rõ trước khi mở rộng)* |
| **`FEEDBACK-12P-01`** | Nhu cầu tải xuống toàn bộ chứng từ nén dạng ZIP để rà soát offline thay vì xem từng tệp PDF. | Phản hồi tại Phase 12P (Sổ Issue Register). | Kỹ sư Hệ thống (`BACKEND_DEV`) | `LOW` | Viết API nén ZIP streaming trực tiếp từ MinIO, giới hạn file size `< 50MB`. | Các bản cập nhật sau (`v2.14.0+`) | `NO` |

---

## 2. Tiêu Chí Nghiệm Thu Các Khắc Phục UX (`UX Acceptance Criteria`)
Khi tiến hành triển khai sửa đổi (ở các Phase sau này, không phải Phase 12R), các hạng mục trên phải được kiểm nghiệm qua các tiêu chí sau:
* Tooltip phải xuất hiện dưới `0.2s` kể từ thời điểm `onHover`, đồng thời hiển thị nội dung thông báo chuẩn xác: *"Vui lòng xác nhận chứng từ nộp tiền trước khi hoàn thành"*.
* Hệ thống tải ZIP (nếu có) không được gây quá tải RAM hoặc treo luồng Node.js khi thực thi tải đồng thời nhiều hồ sơ.

---

## 3. Cập Nhật Tài Liệu Đào Tạo Cán Bộ (`Operator Training Material Updates`)
Trong thời gian chờ khắc phục triệt để `ISSUE-UAT-12K-01` bằng code, đội ngũ nghiệp vụ sẽ bổ sung nội dung đào tạo (Workaround):
* **Bổ sung Sổ tay Hướng dẫn:** Cán bộ thẩm định cần được ghi nhớ việc đánh dấu tích (Checkmark) trên chứng từ nộp tiền là bắt buộc. Nút hoàn thành chỉ mở khi tất cả checkmark được chọn.
* **Cảnh báo về Số tiền Dự kiến:** Tài liệu đào tạo phải dán nhãn nhấn mạnh nội dung hiển thị ở giao diện Một cửa **CHỈ LÀ CHIẾT TÍNH NHÁP**. Cán bộ không được phép lấy số tiền này ghi vào các văn bản hành chính khi chưa có thông báo từ CQT.
