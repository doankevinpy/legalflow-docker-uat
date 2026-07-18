# Đánh Giá Lại Rủi Ro Kỹ Thuật Hậu Thí Điểm (`Post-Pilot Risk Reassessment`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12Q
## Phase 12Q: Post-Pilot Risk Reassessment Matrix

> [!CAUTION]
> **TÚYÊN BỐ NGUYÊN TẮC KIỂM TOÁN RỦI RO (`RISK AUDIT DISCLAIMER`):**
> Tài liệu này rà soát ma trận rủi ro của hệ thống dựa trên bằng chứng thu thập từ đợt thí điểm giới hạn trên dữ liệu mô phỏng. Việc đánh giá rủi ro kỹ thuật giảm xuống mức `LOW/ACCEPTABLE` trong điều kiện thử nghiệm nội bộ **chưa phải bằng chứng cho triển khai dữ liệu thật**. Đánh giá này **không thay thế** cho trách nhiệm thẩm định pháp lý và quy trình phê duyệt hành chính của các cơ quan có thẩm quyền.

---

## 1. Ma Trận Đánh Giá Lại Rủi Ro (`Risk Reassessment Matrix`)

| Nhóm Rủi Ro Kỹ Thuật (`Risk Category`) | Rào Chắn Được Kiểm Chứng (`Verified Guardrails in Phase 12P`) | Mức Rủi Ro Còn Lại Đề Xuất (`Assessed Residual Risk`) | Căn Cứ Đánh Giá (Theo Bằng Chứng) (`Evidence Basis`) |
| :--- | :--- | :---: | :--- |
| **1. Vượt quyền pháp lý** (Gán số tiền chính thức hoặc phát hành thông báo thật) | Banner cảnh báo hiển thị trên giao diện (chưa đo lường 100% bằng tự động hóa, nhưng không có lỗi báo cáo). API trả mã HTTP 403 khi gán giá trị `officialAmount` (VERIFIED qua BLOCK-LOG-12P-02). | `LOW / ACCEPTABLE` (trong điều kiện mô phỏng) | Hệ thống từ chối thay đổi dữ liệu pháp lý thông qua mã lỗi 403, được chứng minh tại Mục 3 của `PILOT_OPERATION_LOG.md`. |
| **2. Tác động dữ liệu thật** (Sửa nhầm hồ sơ công dân) | Cấu trúc hệ thống chạy trên máy chủ UAT cục bộ và áp đặt ID giả định (`DEMO-FO-UAT-*`). Bằng chứng cho thấy 03 bản ghi thủ tục thật không thay đổi. | `LOW / ACCEPTABLE` | RPO = 0 được xác nhận bởi SYSADMIN_01, ghi trong `PILOT_OPERATION_LOG.md`. |
| **3. Bỏ qua bước thẩm định** (Hoàn thành khi thiếu chứng từ) | UI khóa và Backend trả HTTP 400 nếu cờ `OFFICER_VERIFIED` bằng false (VERIFIED qua BLOCK-LOG-12P-01). | `LOW / ACCEPTABLE` | Hệ thống trả mã lỗi 400 chặn đứng việc đóng hồ sơ sớm, ghi tại Mục 3 của `PILOT_OPERATION_LOG.md`. |
| **4. Xâm nhập mạng lưới LAN** | Quy định chỉ sử dụng mạng UAT nội bộ, cấm VPN mở. | `LOW / ACCEPTABLE` | Rà soát của Security Lead tại `INTERIM_SAFETY_REVIEW.md`. |

---

## 2. Rủi Ro Tiềm Ẩn Cần Khắc Phục Trong Lộ Trình Tương Lai (`Pending Risks & UX Notes`)

Trong quá trình vận hành mô phỏng, đã phát sinh 02 ghi nhận về mặt trải nghiệm người dùng (UX) thuộc nhóm rủi ro vận hành thấp (`Low Risk`):

| Mã Ghi Nhận (`Feedback ID`) | Mô Tả Vấn Đề (`Issue Description`) | Định Hướng Khắc Phục Khuyến Nghị (`Proposed Mitigation`) |
| :--- | :--- | :--- |
| **`ISSUE-UAT-12K-01`** | Tooltip giải thích lý do khóa nút hoàn thành hiển thị độ trễ. Có thể gây hiểu nhầm cho cán bộ mới. | Tối ưu hóa thời gian trễ CSS (`CSS transition-delay`). Đề xuất tích hợp vào lộ trình tương lai. |
| **`FEEDBACK-12P-01`** | Cán bộ đề xuất chức năng tải xuống hàng loạt chứng từ scan bằng một tệp ZIP duy nhất. Rủi ro quá tải RAM nếu dung lượng nén lớn. | Phát triển luồng nén ZIP streaming với giới hạn kích thước tối đa để bảo vệ bộ nhớ. Đề xuất tích hợp vào lộ trình tương lai. |

> **PROPOSED FUTURE ROADMAP – SUBJECT TO APPROVAL:**
> Hai đề xuất cải tiến trên được khuyến nghị chuyển vào lộ trình nâng cấp hệ thống tiếp theo (đề xuất: `v2.13.0`). Các định hướng này **chỉ được thực thi khi có sự phê duyệt chính thức (Subject to Approval)** của Lãnh đạo cấp cao. Đội ngũ Kỹ thuật không mặc định tính năng v2.13.0 đã được phê duyệt.
