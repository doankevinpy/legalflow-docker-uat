# Đánh Giá Rủi Ro Chuyên Sâu (`Risk Register & Control Assessment`) - Phiên bản v2.13

## 1. Mục Đích (`Purpose`)
Tài liệu này xác định các rủi ro vận hành trong phân hệ Nghĩa vụ tài chính ở giai đoạn v2.13, tuân thủ các nguyên tắc kiểm soát rủi ro theo chuẩn Enterprise Governance Audit. Không có bất kỳ tuyên bố nào về việc hệ thống an toàn tuyệt đối; mọi biện pháp giảm thiểu được công nhận `within controlled pilot scope`.

## 2. Danh Mục Rủi Ro & Đánh Giá Kiểm Soát (`Risk Register and Control Assessment`)

Dưới đây là 3 rủi ro chính và các chốt chặn kiểm soát tương ứng (Mitigation controls):

| Mã Rủi Ro (`Risk ID`) | Mô Tả Rủi Ro (`Risk Description`) | Biện Pháp Kiểm Soát (`Mitigation Control`) | Trạng Thái (`Status`) |
| :---: | :--- | :--- | :---: |
| **`RSK-2.13-01`** | **AI misinterpretation:** Đầu ra của AI có thể bị hiểu nhầm là quyết định hành chính chính thức của cơ quan có thẩm quyền. | Buộc phải qua rà soát của con người (`Human verification required`) thông qua cơ chế Dual Control. Việc này reduces the likelihood của sự cố diễn dịch sai. | **`Controlled`** |
| **`RSK-2.13-02`** | **Wrong estimates:** Các thông báo chiết tính tài chính đưa ra số liệu dự kiến sai lệch gây phản ứng tiêu cực. | Dán nhãn cảnh báo rõ ràng trên giao diện (Estimate label) kết hợp với xác nhận thủ công (Manual review) từ cán bộ chuyên trách. | **`Controlled`** |
| **`RSK-2.13-03`** | **Unauthorized expansion:** Rủi ro mở rộng quyền hạn truy cập hoặc phạm vi sử dụng hệ thống khi chưa được ủy quyền hợp pháp. | Rào chắn quản trị khép kín (Go/No-Go governance gate) và các cấu hình in accordance with governance rules. | **`Controlled`** |

## 3. Tham Chiếu Bằng Chứng (`Evidence Reference`)
* **Hồ sơ Rủi ro mô phỏng:** `[PLACEHOLDER - LINK TO DEMO INCIDENT RESPONSE UAT-01..08]` (Bằng chứng sẽ được cập nhật khi diễn tập sự cố UAT v2.13).
* Cơ chế khôi phục dữ liệu phòng khi xảy ra sự cố phần mềm: Recovery capability verified within tested backup scenario.
