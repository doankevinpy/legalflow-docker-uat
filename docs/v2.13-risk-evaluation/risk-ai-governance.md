# Đánh Giá Rủi Ro Quản Trị Trí Tuệ Nhân Tạo (`AI Governance Risk Assessment`) - v2.13

## 1. Danh Mục Rủi Ro Lõi (`Core Risk Register`)

| Rủi Ro (`Risk`) | Biện Pháp Kiểm Soát (`Control Measure`) | Trạng Thái (`Status`) |
| :--- | :--- | :---: |
| **AI misinterpretation** (AI diễn dịch sai lệch văn bản, đưa ra kết luận hành chính sai lầm). | Buộc phải qua rà soát của con người (`Human verification required`). Giao diện không cho phép phê duyệt tự động (No auto-approval). | `Controlled` |
| **Financial estimate error** (Thuật toán OCR/AI bóc tách sai số tiền nghĩa vụ tài chính). | Hiển thị cảnh báo trực quan (`Estimate label`). Cán bộ kiểm tra chéo với bản scan gốc (Dual Control). | `Controlled` |
| **Unauthorized expansion** (AI tiếp cận và rò rỉ các dữ liệu ngoài phạm vi phân quyền). | Giới hạn luồng dữ liệu (Data masking) và quản lý quyền truy cập nghiêm ngặt (`Go/No-Go governance gate`). Tuân thủ in accordance with governance rules. | `Controlled` |

## 2. Đánh Giá Rủi Ro Còn Lại (`Residual Risk Assessment`)
* Residual risks remain possible (Rủi ro tiềm ẩn vẫn có khả năng xảy ra do bản chất hộp đen của mô hình).
* Controls reduce risks to acceptable level within controlled pilot scope (Các biện pháp kỹ thuật và con người đã hạ thấp khả năng xảy ra sự cố trong phạm vi thí điểm giới hạn).

## 3. Quyết Định Cuối Cùng (`Final Risk Decision`)
* **Risk Management Status:** `Controlled`
* **Risk Acceptance Scope:** Controlled pilot environment only
* **Expansion:** `Deferred` (Tạm hoãn mở rộng cho đến khi có phê duyệt chính thức).
* **Next:** `LegalFlow v2.13 Development Stream`
