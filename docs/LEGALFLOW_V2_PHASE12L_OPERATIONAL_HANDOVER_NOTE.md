# Tài Liệu Bàn Giao Vận Hành & Hướng Dẫn Nghiệp Vụ Cán Bộ (Operational Handover Note) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12L
## Phase 12L: Operational Handover Note & Staff Training Guide

> [!WARNING]
> **TÚYÊN BỐ PHÁP LÝ TỐI THƯỢNG BẮT BUỘC GHI NHỚ (`ABSOLUTE LEGAL DISCLAIMER`):**
> **`HỆ THỐNG CHỈ HỖ TRỢ RÀ SOÁT, KHÔNG THAY THẾ CƠ QUAN THUẾ HOẶC NGƯỜI CÓ THẨM QUYỀN.`**
> Tài liệu này được ban hành nhằm bàn giao quy trình vận hành thực tế cho Cán bộ Tiếp nhận, Cán bộ Thẩm định và Lãnh đạo Chi cục khi sử dụng phân hệ "Hỗ trợ nghĩa vụ tài chính / tiền sử dụng đất" trên hệ thống LegalFlow. Mọi cán bộ vận hành có trách nhiệm đọc kỹ, hiểu rõ và tuân thủ tuyệt đối các chỉ dẫn kỹ thuật và ranh giới pháp lý dưới đây.

---

## 1. Mục Đích Phân Hệ (`Module Purpose`)
Phân hệ "Hỗ trợ nghĩa vụ tài chính / tiền sử dụng đất" được tích hợp vào hệ thống LegalFlow với mục đích thiết lập một nền tảng quản lý tập trung giúp Cán bộ Tiếp nhận và Cán bộ Thẩm định:
- Theo dõi tiến độ thực hiện nghĩa vụ tài chính liên quan đến các thủ tục đất đai (`Cấp GCN lần đầu`, `Chuyển mục đích sử dụng đất`, `Chuyển nhượng`).
- Lưu trữ số hóa hồ sơ chứng từ thanh toán (Thông báo thuế, Giấy nộp tiền vào ngân sách nhà nước).
- Thiết lập cơ chế kiểm soát chốt chặn an toàn (`Safety Guardrails`), ngăn chặn sai sót hoàn thành thủ tục hành chính khi người dân chưa hoàn tất nghĩa vụ nộp tiền với Nhà nước.

---

## 2. Nhóm Người Dùng & Phân Quyền (`User Groups & Permissions`)
* **Cán bộ Tiếp nhận (`RECEIVING_OFFICER - Staff`):** Tiếp nhận hồ sơ, xem bảng chiết tính sơ bộ, tải lên bản sao số hóa Thông báo thuế và Chứng từ nộp tiền do người dân cung cấp.
* **Cán bộ Thẩm định (`REVIEWING_OFFICER - Staff / Specialist`):** Thực hiện đối chiếu chi tiết thông số giữa chứng từ nộp tiền với thông báo thuế, xác nhận tính hợp lệ của biên lai (`OFFICER_VERIFIED`).
* **Lãnh đạo Phê duyệt (`APPROVAL_MANAGER - Manager / Admin`):** Kiểm tra và phê duyệt kép (`Dual Control`) đối với các trường hợp đặc thù như: ghi nợ tiền sử dụng đất, miễn giảm thuế, hoặc hồ sơ rủi ro cao.

---

## 3. Các Thao Tác Nghiệp Vụ Chính (`Key Operational Workflows`)
1. **Truy cập phân hệ:** Mở trang danh sách Thủ tục hành chính -> Nhấp chọn một hồ sơ cụ thể -> Chọn tab **"Nghĩa vụ tài chính"**.
2. **Xem chiết tính sơ bộ (`Draft Estimates`):** Nếu hệ thống có gợi ý chiết tính bằng AI, xem bảng chi tiết khoản mục (Tiền sử dụng đất, Lệ phí trước bạ). *Lưu ý: Đây chỉ là con số tham khảo.*
3. **Ghi nhận Thông báo thuế (`Record Tax Notice`):** Nhấp nút "Thêm thông báo thuế" -> Tải lên tệp PDF bản gốc của Chi cục Thuế -> Nhập đúng số thông báo, cơ quan ban hành và số tiền phải nộp.
4. **Ghi nhận Chứng từ nộp tiền (`Upload Payment Evidence`):** Nhấp nút "Thêm chứng từ nộp tiền" -> Tải lên bản quét Giấy nộp tiền Kho bạc/Ngân hàng -> Nhập đúng số chứng từ và số tiền đã thanh toán.
5. **Thẩm định và xác nhận (`Officer Verification`):** Cán bộ thẩm định kiểm tra chéo 2 loại chứng từ -> Nhấp nút **"Xác nhận đối chiếu chứng từ hợp lệ"**. Hệ thống chuyển trạng thái sang `OFFICER_VERIFIED`.
6. **Hoàn thành thủ tục (`Complete Procedure`):** Khi nút hoàn thành chuyển sang màu xanh (`Active`), Cán bộ nhấp nút **"Hoàn thành thủ tục / Đã nộp đủ tiền"** để chính thức khép kín quy trình kiểm soát nghĩa vụ tài chính cho hồ sơ đất đai.

---

## 4. Cảnh Báo An Toàn Bắt Buộc (`Mandatory Safety Warnings`)
* **Nhãn cảnh báo toàn cục (`Global Warning Banner`):** Luôn kiểm tra sự xuất hiện của khung cảnh báo an toàn màu vàng/đỏ ở đầu trang. Nếu không thấy banner này, lập tức dừng thao tác và báo cáo kỹ thuật.
* **Nhãn chiết tính dự kiến (`Estimate Labels`):** Mọi con số sinh ra tự động từ AI hoặc bản nháp mang nhãn `DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC` tuyệt đối không được sử dụng để thông báo cho người dân đi nộp tiền.

---

## 5. Danh Mục Việc Cán Bộ Phải Kiểm Tra (`Checklist of Mandatory Officer Verifications`)
Trước khi nhấp nút xác nhận hoặc hoàn thành, Cán bộ bắt buộc phải rà soát thủ công 5 yếu tố sau:
- [x] **1. Kiểm tra bản gốc Thông báo thuế:** Xác nhận tệp đính kèm là bản scan chính thức có chữ ký/con dấu của Chi cục Thuế hợp lệ.
- [x] **2. Kiểm tra bản gốc Giấy nộp tiền:** Xác nhận tệp chứng từ nộp tiền mang số hiệu hợp lệ của Kho bạc Nhà nước hoặc ngân hàng thương mại được ủy nhiệm thu.
- [x] **3. Đối chiếu khớp đúng số tiền (`Exact Amount Match`):** Kiểm tra số tiền ghi trên Giấy nộp tiền phải khớp đúng 100% với số tiền ghi trên Thông báo thuế (hoặc khớp với số tiền phải nộp sau khi trừ phần miễn giảm/ghi nợ hợp lệ).
- [x] **4. Đối chiếu thông tin thửa đất:** Xác nhận chứng từ thanh toán ghi đúng số thửa, tờ bản đồ và địa chỉ của khu đất đang giải quyết TTHC.
- [x] **5. Kiểm tra chữ ký phê duyệt Lãnh đạo (`Dual Control Check`):** Nếu hồ sơ thuộc diện ghi nợ (`DEMO-FO-UAT-07`) hoặc rủi ro cao, phải đảm bảo Lãnh đạo đã duyệt (`managerReviewStatus = VERIFIED`).

---

## 6. Danh Mục Việc Hệ Thống Không Được Làm (`What the System Must Never Do`)
Để bảo vệ ranh giới pháp lý, cán bộ cần hiểu rõ hệ thống LegalFlow được lập trình **NGĂN CHẶN TUYỆT ĐỐI** các hành vi sau:
* **Không bao giờ tự động ban hành hay in ấn Thông báo thuế chính thức.**
* **Không bao giờ tự động chuyển số tiền dự kiến AI draft thành số tiền pháp lý chính thức.**
* **Không bao giờ cho phép bấm nút "Hoàn thành thủ tục" khi chưa có đủ Thông báo thuế và Chứng từ nộp tiền hợp lệ.**
* **Không bao giờ cho phép bấm hoàn thành khi Cán bộ chưa đối chiếu xác nhận (`officerReviewStatus = UNVERIFIED`).**
* **Không bao giờ tự ý gửi email, tin nhắn SMS hay thông báo Zalo đòi tiền công dân.**

---

## 7. Các Tình Huống Phải Dừng Sử Dụng Ngay (`Emergency Stop Criteria`)
Cán bộ vận hành phải **LẬP TỨC DỪNG SỬ DỤNG PHÂN HỆ** và báo cáo ngay cho Lãnh đạo Chi cục cùng Quản trị viên hệ thống nếu gặp một trong 04 tình huống khẩn cấp:
1. **Sự cố nút hoàn thành mở sai điều kiện:** Nút "Hoàn thành thủ tục" hiển thị màu xanh (`Active`) cho phép bấm dù hồ sơ chưa tải lên chứng từ nộp tiền hoặc chưa được Cán bộ xác nhận.
2. **Sự cố tự động tính tiền chính thức:** Phát hiện hệ thống tự gán giá trị số vào trường số tiền chính thức (`officialTotalAmount`) từ bản nháp AI mà không thông qua chứng từ thật.
3. **Mất khung cảnh báo an toàn (`Missing Banner`):** Giao diện mất hoàn toàn các dòng thông điệp cảnh báo `DEMO ONLY` hoặc `DỰ KIẾN`.
4. **Sự cố mất dấu vết nhật ký (`Audit Log Failure`):** Tab "Lịch sử kiểm toán" không ghi nhận lại các thao tác tải lên chứng từ hay xác nhận của Cán bộ.

---

## 8. Cách Thức Ghi Nhận & Báo Cáo Sự Cố (`Issue Reporting Procedure`)
Khi phát hiện lỗi kỹ thuật hoặc sự cố rủi ro, Cán bộ thực hiện theo 3 bước sau:
1. **Chụp ảnh màn hình (`Capture Screenshot`):** Chụp lại toàn bộ màn hình lỗi, hiển thị rõ mã hồ sơ (`caseCode`), thông báo lỗi và thời gian phát sinh.
2. **Ghi chép vào Sổ theo dõi lỗi (`Issue Register`):** Ghi rõ mã lỗi theo mẫu `ISSUE-OPS-YYYY-NN`, mô tả chi tiết thao tác vừa thực hiện và hành vi bất thường của hệ thống.
3. **Gửi báo cáo Quản trị viên (`Notify Admin/IT`):** Chuyển tiếp ảnh màn hình và thông tin lỗi tới nhóm Quản trị viên hệ thống để tiến hành phân loại (`Triage`) và xử lý theo quy trình ứng phó rủi ro.

---

## 9. Hướng Dẫn Đào Tạo Ngắn Cho Cán Bộ (`Staff Quick Training Summary`)
> **4 NGUYÊN TẮC VÀNG TRONG 30 GIẤY ĐÀO TẠO CÁN BỘ:**
> 1. **AI CHỈ ĐỂ THAM KHẢO (`AI IS FOR REFERENCE ONLY`):** Đừng bao giờ tin số tiền do AI dự kiến. Hãy luôn nhìn vào tờ Thông báo thuế thật của Chi cục Thuế!
> 2. **CHỨNG TỪ LÀ CHÂN LÝ (`EVIDENCE IS KING`):** Không có Giấy nộp tiền Kho bạc hợp lệ -> Không đối chiếu -> Không duyệt hoàn thành!
> 3. **KIỂM TRA CHÉO TRƯỚC KHI DUYỆT (`CROSS-CHECK BEFORE VERIFYING`):** Hãy chắc chắn rằng số tiền trên biên lai nộp tiền khớp 100% với số tiền trên thông báo thuế.
> 4. **NHỚ CÂU THẦN CHÚ PHÁP LÝ:** *`HỆ THỐNG CHỈ HỖ TRỢ RÀ SOÁT, KHÔNG THAY THẾ CƠ QUAN THUẾ HOẶC NGƯỜI CÓ THẨM QUYỀN.`*
