# Cẩm Nang Đào Tạo Nghiệp Vụ & Bảng Xác Nhận Bàn Giao (Operator Training & Signoff Checklist) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12M
## Phase 12M: Operator Training and Signoff Checklist

> [!WARNING]
> **TÚYÊN BỐ CAM KẾT TRÁCH NHIỆM (`STATEMENT OF UNDERSTANDING & RESPONSIBILITY`):**
> Khi ký xác nhận vào biểu mẫu này, Cán bộ vận hành cam kết đã được đào tạo đầy đủ, đọc hiểu rõ toàn bộ quy định rào chắn bảo mật và hiểu sâu sắc nguyên tắc: **`HỆ THỐNG CHỈ HỖ TRỢ RÀ SOÁT CHỨNG TỪ, KHÔNG THAY THẾ CƠ QUAN THUẾ HOẶC NGƯỜI CÓ THẨM QUYỀN.`** Mọi hành vi bỏ qua bước đối chiếu thực tế Giấy nộp tiền Kho bạc hoặc tự ý hoàn thành thủ tục sai quy định đều phải chịu trách nhiệm đầy đủ trước pháp luật và quy chế của Cơ quan.

---

## 1. Đối Tượng Đào Tạo (`Target Audience`)
* **Cán Bộ Tiếp Nhận (`RECEIVING_OFFICER`):** Chuyên viên làm việc trực tiếp tại Bộ phận Tiếp nhận và Trả kết quả (`Một cửa`).
* **Cán Bộ Thẩm Định (`REVIEWING_OFFICER`):** Chuyên viên thụ lý nghiệp vụ tại Phòng Tài nguyên & Môi trường / Đăng ký đất đai.
* **Lãnh Đạo Phê Duyệt (`APPROVAL_MANAGER`):** Lãnh đạo Phòng/Chi cục có thẩm quyền phê duyệt kép đối với hồ sơ TTHC rủi ro cao.
* **Quản Trị Viên Hệ Thống (`ADMIN / IT_OPS`):** Kỹ thuật viên phụ trách vận hành hạ tầng, quản trị tài khoản và sao lưu an toàn.

---

## 2. Tóm Tắt Chức Năng Phân Hệ (`Module Summary`)
Phân hệ **"Hỗ trợ nghiệp vụ Nghĩa vụ tài chính"** thuộc LegalFlow v2.12 được thiết kế như một công cụ số hóa và trợ lý rà soát nội bộ, giúp các cơ quan hành chính đất đai theo dõi tiến độ hoàn thành nghĩa vụ tài chính của người sử dụng đất một cách minh bạch, liên thông và chuẩn xác:
* **Tự động trích xuất bảng tính dự kiến (`AI Preliminary Estimate`):** Hỗ trợ tính toán tham khảo giá trị thuế/lệ phí trước bạ dựa trên quy định hiện hành để hướng dẫn người dân chuẩn bị tài chính.
* **Quản lý chứng từ đối chiếu (`Evidence Management`):** Cho phép tải lên và lưu trữ an toàn bản sao Thông báo thuế của Chi cục Thuế và Giấy nộp tiền từ Kho bạc Nhà nước.
* **Chốt chặn an toàn hoàn thành (`Completion Safety Guard`):** Vô hiệu hóa việc hoàn thành thủ tục nếu hồ sơ chưa được Cán bộ thẩm định đối chiếu hợp lệ (`OFFICER_VERIFIED`).
* **Luồng kiểm soát kép (`Dual Control`):** Bắt buộc có chữ ký phê duyệt của Lãnh đạo đối với các ca xin ghi nợ tiền sử dụng đất hoặc chiết tính đặc biệt rủi ro cao.

---

## 3. Danh Mục Kiểm Tra Đào Tạo Nghiệp Vụ Từng Bước (`Step-by-Step Training Checklist`)

### A. Dành Cho Cán Bộ Tiếp Nhận (`RECEIVING_OFFICER`)
- [ ] **Khái niệm cơ bản:** Hiểu rõ phân hệ này chỉ hỗ trợ rà soát nội bộ, không tự phát hành thông báo thuế chính thức thay cơ quan thuế.
- [ ] **Nhận diện cảnh báo (`Safety Banner`):** Nhận biết rõ khung cảnh báo màu vàng hiển thị trên tab Nghĩa vụ tài chính và ý nghĩa của nhãn `DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC`.
- [ ] **Thao tác số hóa hồ sơ:** Thành thạo thao tác tải lên (`Upload PDF/Scan`) bản sao Thông báo thuế và Giấy nộp tiền của Kho bạc trên giao diện.
- [ ] **Giới hạn quyền hạn:** Hiểu rõ Cán bộ Tiếp nhận không có quyền bấm nút "Xác nhận đối chiếu hợp lệ" hay "Hoàn thành thủ tục".

### B. Dành Cho Cán Bộ Thẩm Định (`REVIEWING_OFFICER`)
- [ ] **Quy trình đối chiếu thủ công (`Manual Verification`):** Nắm vững 03 nguyên tắc đối chiếu: (1) Khớp mã hồ sơ/thửa đất; (2) Khớp đúng số tiền ghi trên Giấy nộp tiền Kho bạc với Thông báo thuế; (3) Khớp chữ ký/con dấu hợp lệ.
- [ ] **Quyền trách nhiệm xác nhận (`Verification Signoff`):** Hiểu rõ ý nghĩa pháp lý khi bấm nút "Xác nhận đối chiếu chứng từ hợp lệ" (`OFFICER_VERIFIED = true`).
- [ ] **Xử lý hồ sơ rủi ro cao (`High-Risk Handling`):** Nắm vững quy trình luân chuyển hồ sơ có chiết tính xin nợ thuế lên Lãnh đạo để phê duyệt kép (`Manager Review`).
- [ ] **Chốt chặn hoàn thành TTHC:** Hiểu rõ nút "Hoàn thành thủ tục" (`Complete Procedure`) chỉ mở khi toàn bộ điều kiện an toàn và đối chiếu đã thỏa mãn 100%.

### C. Dành Cho Lãnh Đạo Phê Duyệt (`APPROVAL_MANAGER`)
- [ ] **Kiểm tra nhật ký kiểm toán (`Audit Logs Review`):** Thành thạo việc tra cứu lịch sử thao tác của chuyên viên trong bảng `financial_obligation_audit_logs`.
- [ ] **Phê duyệt kép (`Dual Control Signoff`):** Thực hiện rà soát và phê duyệt đối với các ca thuộc diện miễn giảm lớn, ghi nợ thuế hoặc bị hệ thống gắn cờ `HIGH RISK`.

### D. Dành Cho Quản Trị Viên (`ADMIN / IT_OPS`)
- [ ] **Vô hiệu hóa khẩn cấp (`Emergency Disable`):** Nắm vững thao tác ngắt module bằng biến môi trường `FEATURE_FLAG_FINANCIAL_OBLIGATIONS_ENABLED="false"` theo `ROLLBACK_DISABLE_AND_INCIDENT_RESPONSE_PLAN.md`.
- [ ] **Tuân thủ không can thiệp code:** Cam kết không tự ý chỉnh sửa mã nguồn, không chạy `seed` hay `migrate` trong thời gian vận hành thí điểm.

---

## 4. Nhấn Mạnh Rào Chắn An Toàn Bắt Buộc (`Safety Restrictions Emphasis`)
* **`KHÔNG SỬ DỤNG DỮ LIỆU CÔNG DÂN THẬT TRONG MÔI TRƯỜNG UAT PILOT:`** Toàn bộ thực hành trong khóa đào tạo bắt buộc thực hiện trên 08 hồ sơ mô phỏng mang tiền tố **`DEMO-FO-UAT-*`**.
* **`KHÔNG GỬI THÔNG BÁO TỰ ĐỘNG:`** Cán bộ tuyệt đối không sử dụng công cụ bên ngoài để nhắn tin Zalo/SMS tự động hối thúc người dân nộp thuế trên cơ sở số liệu dự kiến của AI.
* **`KHÔNG HOÀN THÀNH KHI CHƯA NỘP ĐỦ TIỀN:`** Nghiêm cấm mọi hành vi xác nhận khống hoặc bấm hoàn thành thủ tục hành chính khi chưa có chứng từ nộp tiền hợp lệ vào ngân sách nhà nước.

---

## 5. Khối Ký Nhận Xác Nhận Bàn Giao (`Signoff Blocks`)

*(Ghi chú tuân thủ Phase 12M: Bảng xác nhận dưới đây là biểu mẫu chuẩn mực dành cho lưu trữ hồ sơ hành chính khi bàn giao thực tế. Không điền tên thật hoặc thông tin cá nhân thực tế vào tài liệu này).*

### Khối 1: Xác Nhận Cán Bộ Vận Hành (`Operator Signoff Block`)
> **Lời chứng xác nhận:** *"Tôi đã tham gia khóa đào tạo đầy đủ, nắm vững toàn bộ danh mục kiểm tra nghiệp vụ và cam kết tuân thủ nghiêm ngặt các rào chắn bảo mật của phân hệ Hỗ trợ Nghĩa vụ tài chính."*

| Vai Trò Nghiệp Vụ (`Role`) | Mã Định Danh Cán Bộ (`Officer ID / Title`) | Đơn Vị Công Tác (`Department`) | Ngày Hoàn Thành (`Date`) | Chữ Ký Xác Nhận (`Signature`) |
| :--- | :--- | :--- | :---: | :---: |
| **RECEIVING_OFFICER** | Chuyên viên Một cửa số 01 | Bộ phận Một cửa TTHC | [____/____/2026] | ____________________ |
| **RECEIVING_OFFICER** | Chuyên viên Một cửa số 02 | Bộ phận Một cửa TTHC | [____/____/2026] | ____________________ |
| **REVIEWING_OFFICER** | Chuyên viên Thẩm định số 01 | Phòng Tài nguyên & Môi trường | [____/____/2026] | ____________________ |
| **REVIEWING_OFFICER** | Chuyên viên Thẩm định số 02 | Phòng Tài nguyên & Môi trường | [____/____/2026] | ____________________ |

---

### Khối 2: Xác Nhận Lãnh Đạo Phê Duyệt (`Manager Signoff Block`)
> **Lời chứng xác nhận:** *"Tôi đã rà soát quy trình kiểm soát kép (`Dual Control`), hiểu rõ thẩm quyền phê duyệt đối với các ca hồ sơ rủi ro cao và đồng ý thông qua danh sách cán bộ vận hành đủ điều kiện tham gia đợt thí điểm."*

| Chức Vụ / Thẩm Quyền (`Role / Title`) | Mã Định Danh Lãnh Đạo (`Manager ID / Title`) | Đơn Vị (`Department`) | Ngày Phê Duyệt (`Date`) | Chữ Ký Lãnh Đạo (`Signature`) |
| :--- | :--- | :--- | :---: | :---: |
| **APPROVAL_MANAGER** | Lãnh đạo Phòng Chuyên môn | Phòng Tài nguyên & Môi trường | [____/____/2026] | ____________________ |
| **APPROVAL_MANAGER** | Lãnh đạo Phụ trách Một cửa | Văn phòng UBND / Đơn vị Pilot | [____/____/2026] | ____________________ |

---

### Khối 3: Xác Nhận Quản Trị Viên Hệ Thống (`Admin Signoff Block`)
> **Lời chứng xác nhận:** *"Tôi xác nhận đã thiết lập đúng quyền truy cập tối thiểu (`Least Privilege`) theo ma trận phân quyền, đã hướng dẫn quy trình vô hiệu hóa khẩn cấp (`Emergency Disable`) và sẵn sàng phương án ứng phó sự cố cho môi trường thí điểm."*

| Quyền Quản Trị (`Admin Role`) | Mã Định Danh Kỹ Thuật (`Admin ID / Title`) | Đơn Vị (`IT Department`) | Ngày Ký (`Date`) | Chữ Ký Quản Trị Viên (`Signature`) |
| :--- | :--- | :--- | :---: | :---: |
| **SYSTEM_ADMIN** | Quản trị viên Hạ tầng Docker | Đội ngũ Kỹ thuật LegalFlow | [____/____/2026] | ____________________ |
| **IT_SECURITY_LEAD** | Chuyên trách Bảo mật An toàn TT | Phòng Kỹ thuật & Công nghệ | [____/____/2026] | ____________________ |
