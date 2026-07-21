# Đánh Giá Rủi Ro Mở Rộng Liên Cơ Quan (`Multi-Unit Expansion Risk Assessment`) - v2.13

## 1. Danh Mục Rủi Ro Lõi (`Core Risk Register`)

| Rủi Ro (`Risk`) | Biện Pháp Kiểm Soát (`Control Measure`) | Trạng Thái (`Status`) |
| :--- | :--- | :---: |
| **AI misinterpretation** (Lỗi tự động phân loại hồ sơ về sai đơn vị đích do AI hiểu nhầm nội dung). | Rà soát phân luồng thủ công (`Human verification required`) trước khi đẩy vào hàng chờ xử lý chính thức. | `Controlled` |
| **Financial estimate error** (Sai lệch định dạng tiền tệ khi luân chuyển dữ liệu liên cơ quan). | Xác nhận tính đồng nhất thông qua các nhãn cảnh báo (Estimate label) và kiểm thử Schema Validation chặt chẽ. | `Controlled` |
| **Unauthorized expansion** (Truy cập chéo trái phép dữ liệu giữa các cơ quan không liên quan). | Phân quyền RBAC đa cấp, hệ thống cổng rào (Go/No-Go governance gate). Áp dụng cô lập dữ liệu in accordance with governance rules. | `Controlled` |

## 2. Đánh Giá Rủi Ro Còn Lại (`Residual Risk Assessment`)
* Residual risks remain possible (Các cuộc tấn công leo thang đặc quyền trong mạng nội bộ vẫn mang rủi ro tiềm ẩn).
* Controls reduce risks to acceptable level within controlled pilot scope (Biện pháp bảo mật hạ tầng và xác thực chéo làm giảm đáng kể khả năng xảy ra sự cố).

## 3. Quyết Định Cuối Cùng (`Final Risk Decision`)
* **Risk Management Status:** `Controlled`
* **Risk Acceptance Scope:** Controlled pilot environment only
* **Expansion:** `Deferred`
* **Next:** `LegalFlow v2.13 Development Stream`
