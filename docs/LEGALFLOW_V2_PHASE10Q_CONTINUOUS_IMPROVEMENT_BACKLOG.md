# LEGALFLOW V2 - PHASE 10Q
# CONTINUOUS IMPROVEMENT BACKLOG

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.17-production-adoption-review-continuous-improvement-backlog`  
**Trạng thái Sổ Backlog:** **`OFFICIAL CONTINUOUS IMPROVEMENT BACKLOG REGISTER`** *(Sổ Tổng hợp Danh mục Cải tiến Liên tục)*

---

## 1. Purpose

Tài liệu này là Sổ Tổng hợp Danh mục Cải tiến Liên tục (`Continuous Improvement Backlog Register` - Phase 10Q) của hệ thống LegalFlow V2. Tài liệu tập hợp và chuẩn hóa toàn bộ các vướng mắc, góp ý, nguyện vọng nâng cấp kỹ thuật thu thập được xuyên suốt chu kỳ 16 mốc của Phase 10 (từ Pilot UAT, UAT Issue Fixes, Deployment Dry Run, Hypercare cho đến Controlled Expansion &amp; Adoption Review). Sổ tiến hành phân loại rành mạch theo độ ưu tiên (`Backlog Classification`), cấu trúc hóa 10 hạng mục then chốt (`BL-001 -> BL-010`), chỉ rõ các việc tuyệt đối không nên thực hiện ngay (`Items Not Recommended for Immediate Implementation`), và phác thảo lộ trình triển khai chi tiết cho Phase 11 (`Suggested Phase 11 Roadmap`).

---

## 2. Backlog Classification

Danh mục cải tiến liên tục được phân loại theo 5 nhóm ưu tiên và tính chất quản trị rõ ràng nhằm tối ưu hóa việc phân bổ nguồn lực kỹ thuật:
* **`P1 (Priority 1 - Critical Operational Enhancement):`** Cần ưu tiên thực hiện ngay trong giai đoạn tiếp theo (`Phase 11A/11B`) để hoàn thiện tri thức pháp lý địa phương và chuẩn hóa kỹ năng thao tác.
* **`P2 (Priority 2 - Near-term Major Improvement):`** Cải tiến gần cần đưa vào lộ trình Major Release tiếp theo (`Phase 11C/11D/11E`) nhằm nâng cấp sâu trải nghiệm thẩm định và thể thức văn bản.
* **`P3 (Priority 3 - Long-term Backlog Extension):`** Cải tiến dài hạn, phụ thuộc vào việc mở rộng phức tạp cơ sở dữ liệu hoặc tích hợp hệ thống chữ ký số của bên thứ ba (`Phase 12`).
* **`Governance (Legal & Operational Governance):`** Nhóm nhiệm vụ đặc thù về kiểm duyệt dữ liệu căn cứ pháp lý, quy hoạch sử dụng đất và quản trị an toàn thao tác của con người.
* **`Training (User Guidance & SOP):`** Nhóm nhiệm vụ chuyên biệt về đào tạo, xây dựng Sổ tay Quy trình Thao tác chuẩn (`SOP`), tooltip và hướng dẫn nhanh tại bàn làm việc.

---

## 3. Backlog Register

Bảng tổng hợp chi tiết và chuẩn hóa 10 hạng mục cải tiến liên tục thu thập sau giai đoạn Pilot UAT và Mở rộng Production (`Comprehensive Improvement Backlog Register Table`):

| Backlog ID | Source Phase & Origin | Functional Area | Detailed Description of Backlog Item | Priority Classification | Effort Estimate | Requires Schema / Migration? | Suggested Future Phase | Notes & Technical Governance Assessment |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **BL-001** | `Phase 10P` / `Adoption Review` | `Legal Knowledge Base` | Bổ sung dữ liệu pháp lý địa phương, quy định nội bộ UBND tỉnh, quy hoạch/kế hoạch sử dụng đất cấp huyện và quy hoạch chi tiết 1/500 vào cơ sở tri thức để AI Khối 3.1 có thể đối chiếu tự động. | `P1 / Governance` | `High` *(3 weeks)* | `No` *(Data Seed)* | `Phase 11B` | Nhu cầu cấp thiết hàng đầu (`LK-Req-01`). Hiện tại đang dùng khung `LAW-02` để nhắc chuyên viên rà soát thủ công. |
| **BL-002** | `Phase 10O/10P` / `FDB-EXP-03` | `Khối 3.3 Export Draft` | Cải tiến mẫu biểu Word (`.docx`) theo chuẩn thể thức văn bản hành chính nhà nước (Nghị định 30/2020/NĐ-CP), bổ sung mẫu Tờ trình thẩm định và Quyết định phê duyệt đa dạng hơn. | `P2` | `Medium` *(2 weeks)* | `No` *(Template)* | `Phase 11C` | Chuẩn hóa tối đa thể thức văn thư, giảm 40% thời gian chỉnh sửa thủ công của cán bộ sau khi xuất file. |
| **BL-003** | `Phase 10O/10P` / `UX-Req-03` | `Khối 3.3 Export Draft` | Tích hợp Trình soạn thảo trực tiếp (`Inline Rich Text Editor`) trên giao diện Web, cho phép sửa câu chữ, căn lề và ghi chú ý kiến ngay trước khi bấm nút tải file Word `.docx` về máy. | `P2 / P3` | `High` *(3 weeks)* | `Unknown` *(Maybe No)* | `Phase 11D` | Nâng cao trải nghiệm UX, cán bộ không cần mở MS Word bên ngoài để chỉnh sửa sơ bộ. |
| **BL-004** | `Phase 10G/10H` / `AI-Req-02` | `Tab 4 Tài liệu Hồ sơ` | Upload và bóc tách tự động OCR hồ sơ scan (`.pdf / .jpg`), nhận diện chữ in để tự động điền các thông tin chủ sử dụng, số tờ, số thửa, diện tích vào các trường dữ liệu hồ sơ. | `P2 / P3` | `High` *(4 weeks)* | `Likely Yes` *(DB fields)* | `Phase 11D` | Cần tích hợp engine OCR chuyên dụng và mở rộng schema lưu vết metadata tài liệu scan. |
| **BL-005** | `Phase 10P` / `FDB-EXP-01` | `Tab 6 Ghi chú Hồ sơ` | Ghi chú nội bộ, chuỗi thảo luận ý kiến (`Internal Comment Threads`) và lưu vết lịch sử xử lý trao đổi giữa Chuyên viên thụ lý, Phó Phòng và Lãnh đạo Đơn vị ngay trong từng hồ sơ. | `P2 / P3` | `Medium` *(2 weeks)* | `Likely Yes` *(Comment table)* | `Phase 11D` | Giúp tăng cường tính phối hợp nhóm, minh bạch ý kiến chỉ đạo nội bộ trước khi ra quyết định. |
| **BL-006** | `Phase 10H/10L` / `AI-Req-03` | `Khối 3.1 AI Review` | Lịch sử nhiều phiên AI Analysis và cho phép so sánh (`diff`) giữa kết quả thẩm định AI bản cũ với bản mới khi chuyên viên cập nhật bổ sung thêm tài liệu vào hồ sơ. | `P2` | `Medium` *(2 weeks)* | `Likely Yes` *(AI History table)* | `Phase 11D` | Hỗ trợ truy vết sự tiến hóa của lời khuyên tham mưu AI qua từng vòng bổ sung hồ sơ TTHC. |
| **BL-007** | `Phase 10P` / `FDB-EXP-04` | `Khối 3.2 Legal Snapshot` | Cho phép bấm click trực tiếp vào tên từng Điều/Khoản luật ở Khối 3.2 để mở popup xem toàn văn chi tiết nội dung căn cứ đó từ `Legal Knowledge Base` mà không cần chuyển sang tab khác. | `P2` | `Small` *(1 week)* | `No` *(UI modal)* | `Phase 11B` | Tiện ích tra cứu nhanh (`Interactive Law Reader`), giúp cán bộ kiểm tra căn cứ pháp lý tức thì. |
| **BL-008** | `Phase 10L/10M` / `LK Governance` | `Legal Knowledge Governance` | Thiết lập quy trình kiểm duyệt nhiều bước (Soạn thảo &rarr; Kiểm tra pháp chế &rarr; Phê duyệt Lãnh đạo) trước khi active (`Active Legal Version`) một văn bản pháp luật mới trên toàn hệ thống. | `Governance / P2` | `High` *(3 weeks)* | `Likely Yes` *(Approval table)* | `Phase 11E` | Bảo đảm độ tin cậy tuyệt đối của nguồn dữ liệu căn cứ pháp lý trung ương và địa phương. |
| **BL-009** | `Phase 10F` / `Workflow-Req` | `Quản lý Luồng Workflow` | Bổ sung các trạng thái xử lý chi tiết hơn cho hồ sơ (ví dụ: `WAITING_FOR_TAX_FEE`, `SUPPLEMENT_REQUESTED_TWICE`, `LAND_INSPECTION_PENDING`) tích hợp chữ ký số CA của cơ quan. | `P3` | `High` *(4 weeks)* | `Likely Yes` *(Case status enum)* | `Phase 12 (Later)` | Nâng cấp luồng nghiệp vụ sâu, đòi hỏi rà soát mở rộng DB và phối hợp hệ thống E-Office hiện hữu. |
| **BL-010** | `Phase 10P` / `Adoption Review` | `User Training & SOP` | Xây dựng Sổ tay Quy trình Thao tác chuẩn (`SOP`), tooltip hướng dẫn nhanh trên giao diện (`Help Tooltips`) và tổ chức các buổi đào tạo kèm cặp thao tác ngắn cho chuyên viên mới. | `P1 / Training` | `Small` *(1 week)* | `No` *(Doc & UI hints)* | `Phase 11A` | Tháo gỡ triệt để rào cản thói quen làm việc cũ, tăng tốc độ thẩm định và độ tự tin cho cán bộ. |

---

## 4. Items Not Recommended for Immediate Implementation

Hội đồng Thẩm định Dự án và Ban Quản lý Kỹ thuật chính thức quán triệt nguyên tắc **Tuyệt đối Không khuyến nghị thực hiện ngay (`Strictly Not Recommended for Immediate Implementation`)** đối với 5 nhóm nhiệm vụ dưới đây trong các đợt cập nhật ngắn hạn trước khi có thiết kế kiến trúc toàn diện và được phê duyệt chính thức:
1. 🛑 **Thay đổi Schema hoặc Migration lớn một cách tự phát:** Tuyệt đối không can thiệp, thêm bảng hay sửa đổi kiểu dữ liệu trong `schema.prisma` (`BL-004`, `BL-005`, `BL-006`, `BL-008`, `BL-009`) trên môi trường production khi chưa qua quy trình kiểm thử UAT và sao lưu offline an toàn.
2. 🛑 **Luồng Phê duyệt phức tạp (`Complex Approval Workflow`) tích hợp chữ ký số khi chưa có quy chế phối hợp:** Không tự ý cấy luồng duyệt nhiều cấp nếu chưa làm việc chính thức với đơn vị cung cấp chứng thư số PKI và tổ văn thư cơ quan.
3. 🛑 **Tự động ký / Tự động ban hành / Tự động gửi văn bản ra ngoài:** Khẳng định tuyệt đối **dừng mọi ý tưởng** tự động hóa việc cấy chữ ký, chuyển trạng thái ban hành hay gửi email/SMS/Zalo công dân mà không có sự kiểm duyệt và bấm nút xác nhận cuối cùng của con người (`Human-in-the-Loop`).
4. 🛑 **Tự động kết luận phán quyết hồ sơ hợp lệ / khước từ:** Trợ lý AI Khối 3.1 luôn giữ nguyên vai trò **tham mưu, gợi ý sơ bộ**; tuyệt đối không được điều chỉnh prompt hoặc logic để AI đưa ra kết luận phán quyết thay quyền của chuyên viên và Lãnh đạo Đơn vị.
5. 🛑 **Tự động cập nhật văn bản pháp luật không qua kiểm duyệt:** Không sử dụng các trình thu thập tự động (`Auto-crawlers`) để tự ý cập nhật hoặc thay đổi `Active Legal Version` trong cơ sở tri thức pháp lý khi chưa có sự rà soát và xác nhận hợp lệ của bộ phận Pháp chế / Lãnh đạo Phòng.

---

## 5. Suggested Phase 11 Roadmap

Bảng đề xuất lộ trình triển khai các giai đoạn tiếp theo cho Phase 11, đảm bảo sự phát triển hài hòa giữa Đào tạo con người, Làm giàu dữ liệu pháp lý và Nâng cấp tính năng kỹ thuật (`Proposed Phase 11 Strategic Roadmap Table`):

| Phase Designation | Core Strategic Focus | Key Technical & Operational Deliverables | Estimated Risk Level | Notes & Implementation Mandate |
| :--- | :--- | :--- | :---: | :--- |
| **Phase 11A: User Training, SOP &amp; Quick Help** | Đào tạo, Sổ tay SOP &amp; Hướng dẫn thao tác nhanh | Ban hành Sổ tay SOP, tích hợp tooltip hướng dẫn trên UI (`BL-010`) và tổ chức tập huấn kèm cặp 1:1 cho cán bộ thụ lý P2 &amp; Một cửa. | **`LOW`** *(No code/DB risk)* | Ưu tiên số 1 ngay sau khi đóng Phase 10 để bảo đảm mức độ tiếp nhận bền vững. |
| **Phase 11B: Legal Knowledge Data Enrichment** | Làm giàu Dữ liệu Pháp lý &amp; Quy hoạch Địa phương | Tích hợp dữ liệu Quyết định/Quy trình nội bộ UBND tỉnh, quy hoạch đất cấp huyện (`BL-001`) và tính năng xem nhanh toàn văn điều khoản (`BL-007`). | **`LOW - MEDIUM`** *(Data Seed risk)* | Giải quyết rào cản đối chiếu quy định địa phương `LAW-02/LK-01`. |
| **Phase 11C: Export Template Improvement** | Nâng cấp Mẫu biểu Word chuẩn Thể thức Hành chính | Chuẩn hóa bộ mẫu biểu Tờ trình, Quyết định theo đúng Nghị định 30/2020/NĐ-CP (`BL-002`) với tiền tố an toàn `DU_THAO_GOI_Y_AI_`. | **`LOW`** *(Template update)* | Tối ưu hóa công tác văn thư, giảm 40% công sức chỉnh sửa sau khi xuất file. |
| **Phase 11D: Workflow Extensions Assessment** | Đánh giá &amp; Nâng cấp Luồng Nghiệp vụ / OCR Scan | Khởi động rà soát kiến trúc mở rộng schema cho tính năng OCR bóc tách tài liệu (`BL-004`), ghi chú Tab 6 (`BL-005`) và diff AI history (`BL-006`). | **`HIGH`** *(Requires DB migration)* | Tuân thủ tuyệt đối quy trình kiểm thử UAT và sao lưu pre-migration trước khi triển khai. |
| **Phase 11E: Governance Automation Planning** | Quy trình Quy chế Kiểm duyệt Tri thức Pháp lý | Thiết lập luồng kiểm duyệt 2-3 bước trước khi active phiên bản luật mới (`BL-008`), đảm bảo an toàn tuyệt đối cho `Legal Knowledge Base`. | **`MEDIUM`** *(Workflow & Auth)* | Chuẩn bị hạ tầng quản trị pháp lý trung ương và địa phương vững chắc cho giai đoạn mở rộng đại trà (`General Availability`). |

---

### Khẳng định An toàn Pháp lý & Kỹ thuật của Ban Lập Sổ Backlog:
Tôi xác nhận trong quá trình lập Sổ Tổng hợp Danh mục Cải tiến Liên tục Phase 10Q đã tuân thủ tuyệt đối:
* ✅ **Không sửa đổi mã nguồn Backend / Frontend, không chỉnh sửa `schema.prisma`, migrations hay `.env`.**
* ✅ **Không can thiệp, xóa hay reset/restore cơ sở dữ liệu production `legalflow_prod`.**
* ✅ **Không mở rộng thêm người dùng thật trên DB trong phase này, không ghi lại mật khẩu hay bí mật nhạy cảm vào tài liệu.**
* ✅ **Khẳng định rõ các tính năng `Likely Yes` về migration (`BL-004 -> BL-006`, `BL-008/009`) phải được đưa vào lộ trình kiểm soát kỹ thuật nghiêm ngặt tại Phase 11D/11E.**
* ✅ **Duy trì nguyên tắc tối thượng: AI chỉ là tham mưu, không tự ký, không tự ban hành, con người chịu trách nhiệm pháp lý cao nhất.**

---
*Sổ Tổng hợp Danh mục Cải tiến Liên tục được lập tự động từ kết quả rà soát thực tiễn và rà soát kỹ thuật toàn bộ Phase 10.*
