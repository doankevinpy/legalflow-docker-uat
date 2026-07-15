# Phiếu Ghi nhận Ý kiến và Lỗi UAT - Giai đoạn 12F
## Phase 12F: UAT Feedback and Issue Register

> [!NOTE]
> **HƯỚNG DẪN:**
> Bảng dưới đây ghi nhận toàn bộ các lỗi (Bugs), ý kiến phản hồi (Feedback) và các vấn đề an toàn bảo mật (Safety Gaps) phát sinh trong suốt quá trình chạy thử nghiệm UAT Pilot. 
> Mức độ nghiêm trọng được phân loại thành: **Critical** (Chặn kiểm thử / Vi phạm an toàn), **Major** (Lỗi nghiệp vụ chính), **Minor** (Lỗi giao diện / Trải nghiệm).

---

| Issue ID | Test ID | Issue Description (Mô tả vấn đề) | Severity (Mức độ) | Reported By | Date Reported | Safety Impact (Ảnh hưởng an toàn) | Status (Trạng thái) | Resolution (Phương án xử lý) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FO-ISS-01** | `FO-TST-01` | Màu nền của Safety Banner hơi nhạt, có thể khiến cán bộ thụ lý ít chú ý trong môi trường ánh sáng mạnh. | **Minor** | Officer Nguyễn Văn A | 2026-07-12 | Thấp. Banner vẫn hiển thị đầy đủ chữ cảnh báo. | **RESOLVED** | Đã điều chỉnh CSS tăng độ tương phản của màu nền đỏ nhạt/viền đỏ đậm và thêm icon cảnh báo nhấp nháy nhẹ để thu hút sự chú ý. |
| **FO-ISS-02** | `FO-TST-03` | Nút "Đánh dấu hoàn thành" bị disable nhưng vẫn có thể dùng phím `Tab` để chọn và ấn `Enter` để kích hoạt sự kiện click trên trình duyệt cũ. | **Critical** | QA Tester Trần Thị B | 2026-07-13 | Cao. Có khả năng bỏ qua bước xác thực để gửi request hoàn thành. | **RESOLVED** | Đã cập nhật thuộc tính `disabled` thực tế vào thẻ HTML `<button>` thay vì chỉ dùng class CSS, đồng thời bổ sung kiểm tra chặn điều kiện trực tiếp tại hàm xử lý onClick của React và backend API. |
| **FO-ISS-03** | `FO-TST-10` | Nhật ký kiểm toán hiển thị múi giờ UTC thay vì múi giờ Việt Nam (GMT+7) gây nhầm lẫn về thời gian thực hiện thao tác. | **Minor** | Manager Lê Văn D | 2026-07-13 | Thấp. Thông tin kiểm toán vẫn chính xác nhưng lệch giờ. | **RESOLVED** | Đã sử dụng thư viện định dạng thời gian của hệ thống để chuyển đổi hiển thị ngày giờ tự động theo múi giờ local của trình duyệt người dùng. |
| **FO-ISS-04** | `FO-TST-02` | Mẫu dự thảo chiết tính của AI thỉnh thoảng đề xuất số tiền sử dụng đất lẻ đến hàng đơn vị đồng, khó đọc trên giao diện. | **Minor** | Officer Nguyễn Văn A | 2026-07-14 | Thấp. Chỉ là số dự toán. | **RESOLVED** | Cấu hình hàm làm tròn số trên giao diện hiển thị đến hàng nghìn đồng (ví dụ: làm tròn thành 12.503.000 VNĐ thay vì 12.503.241 VNĐ) để trực quan hơn, kèm chú thích làm tròn. |
| **FO-ISS-05** | `FO-TST-05` | Dung lượng file Thông báo thuế tải lên vượt quá 10MB gây lỗi đơ trình duyệt mà không báo lỗi rõ ràng cho cán bộ. | **Major** | Officer Phạm Văn C | 2026-07-14 | Trung bình. Lỗi trải nghiệm khi đính kèm file quét chất lượng quá cao. | **RESOLVED** | Đã bổ sung hàm kiểm tra dung lượng file tải lên ngay ở phía Client (chỉ cho phép tối đa 5MB) và hiển thị Toast thông báo lỗi chi tiết hướng dẫn cán bộ nén file PDF trước khi tải lên. |
