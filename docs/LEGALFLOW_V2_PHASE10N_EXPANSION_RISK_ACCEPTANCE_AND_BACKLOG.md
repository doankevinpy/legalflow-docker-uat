# LEGALFLOW V2 - PHASE 10N
# EXPANSION RISK ACCEPTANCE & BACKLOG

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.14-controlled-production-expansion-decision`  
**Trạng thái Tài liệu:** **`APPROVED RISK ACCEPTANCE & BACKLOG REGISTER`**

---

## 1. Purpose

Tài liệu này là Sổ Ghi nhận Chấp nhận Rủi ro & Danh mục Backlog Mở rộng (`Expansion Risk Acceptance & Backlog` - Phase 10N) của hệ thống LegalFlow V2. Tài liệu minh định rõ các rủi ro kỹ thuật, pháp lý còn tồn tại trên môi trường thực tế, thiết lập các giới hạn được chấp nhận (`Accepted Limitations`), tổng hợp toàn bộ 8 nhóm tính năng hoãn lại vào Danh mục Backlog chuẩn hóa (`Backlog Register`) và cung cấp biểu mẫu xác nhận chấp nhận rủi ro (`Sign-off`) trước khi tiến hành thực thi mở rộng tại Phase 10O.

---

## 2. Remaining Risks

Bảng rà soát, đánh giá mức độ và phương án giảm thiểu cho 8 rủi ro còn lại trong giai đoạn mở rộng người dùng:

| Risk ID | Risk Area | Description of Risk | Severity | Mitigation Strategy & Safeguards | Accepted? (`Yes/No/Conditional`) | Notes & Governance Check |
| :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| **RSK-01** | **Phụ thuộc Dữ liệu Pháp lý Cập nhật** | Cơ sở tri thức trung ương (`Legal Knowledge Base`) hiện neo tại Luật Đất đai 2024 (`v2.0-2024-LAND-LAW`). Nếu có Nghị định mới ban hành mà chưa cập nhật vào DB, AI có thể gợi ý theo quy định liền trước. | `Medium` | Cán bộ thuộc danh sách mở rộng được quán triệt phải kiểm tra văn bản pháp lý hiện hành tại thời điểm thụ lý. Bổ sung định kỳ tri thức mới bởi Lực lượng Kỹ thuật. | ✅ **Yes (Conditional)** | Chấp nhận với điều kiện cán bộ duy trì rà soát con người. |
| **RSK-02** | **Căn cứ Đặc thù Địa phương / Quy hoạch** | Hệ thống cốt lõi không lưu trữ trực tiếp bản đồ quy hoạch chi tiết 1/500 hay bản đồ kế hoạch sử dụng đất hàng năm của từng huyện/thị xã. | `High` | Khung cảnh báo vàng `LAW-02` cố định tại Khối 3.2 nhắc nhở chuyên viên **bắt buộc rà soát 3 căn cứ địa phương:** quy trình UBND tỉnh, quy hoạch sử dụng đất huyện và quy hoạch 1/500. | ✅ **Yes (Conditional)** | Chức năng đối chiếu quy hoạch là trách nhiệm của cán bộ thụ lý. |
| **RSK-03** | **Hiểu nhầm AI là Kết luận Chính thức** | Người dùng mở rộng mới (`Wave 2/Wave 3`) có thể bị tâm lý ỷ lại, coi kết quả Khối 3.1 AI Review là phán quyết cuối cùng để duyệt hồ sơ mà không đọc lại. | `High` | Hiển thị cố định nhãn *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA & CHỊU TRÁCH NHIỆM"*. Yêu cầu cán bộ ký cam kết tuân thủ `AI Governance` trước khi gán quyền (`CND-05`). | ✅ **Yes (Conditional)** | Quán triệt nguyên tắc `Human-in-the-Loop`. |
| **RSK-04** | **Sử dụng Nhầm Bản dự thảo Export** | Cán bộ in hoặc tải file `.docx / .pdf` từ Khối 3.3 trình trực tiếp cho Lãnh đạo ký ban hành mà không chỉnh sửa, đóng dấu theo quy trình. | `High` | Bắt buộc gán tiền tố `DU_THAO_GOI_Y_AI_` vào tên mọi file tải về (`SMK-06`), kèm watermark "Dự thảo tham khảo nội bộ" chìm trên trang văn bản. | ✅ **Yes (Conditional)** | Ranh giới an toàn ngăn chặn phát hành nhầm. |
| **RSK-05** | **Chưa có Upload OCR Hồ sơ Scan** | Chuyên viên phải kiểm tra thủ công các file tài liệu scan gốc đính kèm trên Tab 4 do hệ thống chưa có tự động bóc tách chữ in. | `Medium` | Giữ nguyên quy trình kiểm tra tài liệu đính kèm truyền thống của chuyên viên. Đưa tính năng OCR vào `Backlog Register` (`BCK-02`). | ✅ **Yes** | Không ảnh hưởng đến độ chuẩn xác của quy trình thụ lý hiện tại. |
| **RSK-06** | **Chưa có Rich Text Editor Khối 3.3** | Chuyên viên không thể sửa chữ, căn lề trực tiếp trên giao diện trình duyệt Khối 3.3 trước khi bấm nút xuất file Word. | `Low` | Cán bộ tải file Word (`.docx`) về máy tính và chỉnh sửa bằng Microsoft Word theo thói quen văn phòng quen thuộc (`BCK-03`). | ✅ **Yes** | Phương án thay thế (`workaround`) hoàn toàn thuận tiện. |
| **RSK-07** | **Chưa có Approval Workflow Mới** | Hệ thống chưa có luồng ký duyệt điện tử nhiều cấp ngay bên trong ứng dụng. | `Medium` | Cán bộ in bản dự thảo Khối 3.3, hoàn thiện hồ sơ và trình Lãnh đạo ký duyệt qua hệ thống Quản lý Văn bản &amp; Điều hành (`E-Office`) thực tế (`BCK-04`). | ✅ **Yes** | Phù hợp với quy trình hành chính hiện hành của cơ quan. |
| **RSK-08** | **Chưa có Lịch sử Nhiều Phiên AI** | Khối 3.1 chỉ hiển thị kết quả của lượt phân tích AI mới nhất, chưa cho phép so sánh (`diff`) giữa các lần chạy cũ. | `Low` | Cán bộ có thể rà soát các mốc thay đổi thông tin hồ sơ và nhật ký thao tác tại Tab 7 (`Audit Log`) (`BCK-05`). | ✅ **Yes** | Đủ minh chứng truy vết theo tiêu chuẩn hiện tại. |

---

## 3. Accepted Limitations

Toàn thể Hội đồng Thẩm định, Lãnh đạo Đơn vị và cán bộ Pilot đồng thuận ghi nhận 5 giới hạn kỹ thuật được chấp nhận (`Accepted Limitations`) trong giai đoạn Phase 10N / 10O:
1. **AI là công cụ hỗ trợ, không phải cơ quan ra quyết định:** Trợ lý AI Khối 3.1 là hệ thống hỗ trợ tham mưu tự động hóa, không có tư cách pháp nhân và không phải là chủ thể ra quyết định hành chính thay thế cán bộ thụ lý hay lãnh đạo phòng.
2. **Hệ thống không tự khẳng định đầy đủ căn cứ pháp lý:** AI và Khối 3.2 trích xuất metadata từ Luật Đất đai 2024 nhưng không thể tự động khẳng định hồ sơ đã đáp ứng 100% tất cả các văn bản dưới luật, thông tư hay quyết định cá biệt của tỉnh.
3. **Cán bộ phải kiểm tra quy định hiện hành:** Cán bộ thụ lý giữ thẩm quyền tối cao và trách nhiệm kiểm tra đối chiếu trực tiếp với các quy định pháp luật có hiệu lực tại thời điểm giải quyết hồ sơ.
4. **Văn bản xuất ra là bản dự thảo / gợi ý:** Mọi phiếu rà soát, phiếu thẩm định tải về từ Khối 3.3 là tài liệu nháp nội bộ mang tiền tố `DU_THAO_GOI_Y_AI_`, cán bộ phải chịu trách nhiệm hoàn thiện thể thức trước khi ban hành chính thức.
5. **Các module lớn chưa triển khai được hoãn vào Backlog:** Khẳng định không coi việc thiếu vắng các module OCR, Editor hay Multi-step Approval là lỗi khiếm khuyết (`defect`), mà được chấp nhận là các tính năng mở rộng thuộc lộ trình phát triển tương lai (`Backlog Register`).

---

## 4. Backlog Register

Bảng quản lý Danh mục Tính năng Tạm hoãn (`Backlog Register`) cho các phiên bản nâng cấp Lớn tiếp theo:

| Backlog ID | Source Issue / Request | Description of Feature / Enhancement | Priority | Suggested Future Phase | Notes & Implementation Roadmap |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **BCK-01** | `UX-Request-01` | **Ghi chú Nội bộ &amp; Lịch sử Thảo luận (`Internal Comment Threads`):** Cho phép chuyên viên và lãnh đạo thêm comment trao đổi ý kiến nghiệp vụ trực tiếp trên Tab 6 của từng hồ sơ. | `P2` | `Phase 11 (Next Major Release)` | Giúp tăng tính phối hợp nhóm bên trong giao diện hồ sơ. |
| **BCK-02** | `AI-Request-02` | **Upload &amp; Bóc tách OCR Hồ sơ Scan (`Document OCR Extraction`):** Tự động bóc tách thông tin chủ sử dụng, số tờ, số thửa từ các file scan `.pdf / .jpg` đính kèm tại Tab 4. | `P2` | `Phase 11 (Next Major Release)` | Cần tích hợp engine OCR chuyên dụng và kiểm thử tải lớn. |
| **BCK-03** | `UX-Request-03` | **Trình Soạn thảo Trực tiếp Khối 3.3 (`Inline Rich Text Editor`):** Cho phép chuyên viên sửa chữ, căn lề, thêm ý kiến ngay trên khung xem trước Khối 3.3 trước khi xuất file `.docx`. | `P3` | `Phase 11 (Next Major Release)` | Tối ưu trải nghiệm chỉnh sửa văn bản mà không cần mở Word. |
| **BCK-04** | `Workflow-Req-01` | **Luồng Phê duyệt Nhiều cấp (`Multi-step Approval Workflow`):** Thiết lập quy trình trình duyệt 3 cấp (Chuyên viên &rarr; Phó Phòng &rarr; Lãnh đạo) ngay trên hệ thống. | `P2` | `Phase 12 (Enterprise Workflow)` | Phối hợp tích hợp chữ ký số cơ quan (`CA PKI`). |
| **BCK-05** | `AI-Request-03` | **Lịch sử Nhiều Phiên AI Analysis (`AI Analysis Session History`):** Lưu trữ và cho phép xem lại, so sánh (`diff`) giữa các lần chạy AI Khối 3.1 khác nhau trên cùng 1 hồ sơ. | `P3` | `Phase 11 (Next Major Release)` | Hỗ trợ truy vết sự thay đổi của kết quả gợi ý AI qua thời gian. |
| **BCK-06** | `Workflow-Req-02` | **Trạng thái Xử lý Chi tiết Mới (`Fine-grained Sub-states`):** Bổ sung các trạng thái con như `WAITING_FOR_TAX_FEE`, `SUPPLEMENT_REQUESTED_TWICE`, `LAND_INSPECTION_PENDING`. | `P3` | `Phase 11 (Next Major Release)` | Cần mở rộng bảng trạng thái và điều chỉnh logic filter. |
| **BCK-07** | `LK-Request-02` | **Xem Chi tiết Nội dung Căn cứ Pháp lý (`Interactive Law Reader`):** Cho phép bấm vào tên điều khoản ở Khối 3.2 để mở popup đọc toàn văn điều luật đó từ `Legal Knowledge Base`. | `P3` | `Phase 11 (Next Major Release)` | Nâng cao tính tiện ích tra cứu pháp lý tức thì. |
| **BCK-08** | `Export-Req-02` | **Mẫu Word Thể thức Hành chính Nâng cao (`Advanced Docx Templates`):** Bổ sung đa dạng các mẫu biểu tờ trình, quyết định theo đúng Nghị định 30/2020/NĐ-CP về công tác văn thư. | `P3` | `Phase 11 (Next Major Release)` | Chuẩn hóa tối đa thể thức văn bản hành chính nhà nước. |

---

## 5. Risk Acceptance Sign-off

Bảng ký xác nhận chấp nhận rủi ro và phê duyệt Danh mục Backlog của Hội đồng Thẩm định (không điền tên thật nếu chưa được cung cấp):

| Role / Authority | Representative Name | Accepted Risks & Limitations | Applied Conditions | Date of Sign-off | Notes & Signature |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Project Owner / Sponsor** | `[                              ]` | Chấp nhận toàn bộ 8 rủi ro (`RSK-01 -> RSK-08`) và 5 giới hạn kỹ thuật. | Duy trì 100% nguyên tắc `Human-in-the-Loop`, không mở đại trà ngoài danh sách duyệt. | `[    /    / 2026 ]` | *(Chữ ký Lãnh đạo Cơ quan / Chủ đầu tư)* |
| **Technical Lead** | `[                              ]` | Xác nhận mã nguồn và cơ sở dữ liệu `legalflow_prod` ổn định, các module backlog thuộc Phase sau. | Thực thi đầy đủ sao lưu pre-expansion và giám sát hệ thống hàng ngày. | `[    /    / 2026 ]` | *(Chữ ký Kỹ sư Trưởng / Quản lý Kỹ thuật)* |
| **Dept Head / Manager Rep** | `[                              ]` | Xác nhận Khối 3.1, Khối 3.2, Khối 3.3 đáp ứng yêu cầu thẩm định tham mưu của Phòng. | Quán triệt 100% chuyên viên kiểm tra căn cứ pháp lý &amp; quy hoạch sử dụng đất cấp huyện. | `[    /    / 2026 ]` | *(Chữ ký Lãnh đạo Phòng Chuyên môn)* |
| **Core Officer / Staff Rep** | `[                              ]` | Xác nhận đã hiểu rõ AI chỉ là gợi ý và văn bản export là dự thảo `DU_THAO_GOI_Y_AI_`. | Tuân thủ quy trình rà soát con người trên từng hồ sơ thụ lý thực tế. | `[    /    / 2026 ]` | *(Chữ ký Đại diện Chuyên viên Thụ lý)* |

---

## 6. Next Recommended Phase

Dựa trên sự đồng thuận ký duyệt chấp nhận rủi ro và xác lập Danh mục Backlog tại Phase 10N, đề xuất bước tiếp theo cho lộ trình dự án là:
&rarr; **`Phase 10O: Controlled Production Expansion Execution`**  
*(Thực thi mở rộng triển khai production có kiểm soát theo lộ trình cuốn chiếu Wave 1/Wave 2 đã được phê duyệt, đảm bảo an toàn dữ liệu và tuân thủ tuyệt đối ranh giới AI Governance).*
