# LEGALFLOW V2 - PHASE 10Q
# USER TRAINING & CHANGE MANAGEMENT PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.17-production-adoption-review-continuous-improvement-backlog`  
**Trạng thái Kế hoạch:** **`OFFICIAL USER TRAINING & CHANGE MANAGEMENT PLAN`** *(Kế hoạch Đào tạo & Quản trị Sự thay đổi)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Đào tạo Người dùng và Quản trị Sự thay đổi (`User Training & Change Management Plan` - Phase 10Q) của hệ thống LegalFlow V2. Tài liệu được thiết lập ngay sau khi hoàn tất mở rộng triển khai có kiểm soát (`Phase 10O/10P`) nhằm chuẩn hóa phương pháp huấn luyện kỹ năng thao tác cho cán bộ, quán triệt sâu sắc các chốt chặn quản trị AI (`AI Governance & Legal Safeguards`), nhận diện và giảm thiểu tối đa các rủi ro thay đổi thói quen làm việc (`Change Management Risks`), đồng thời cung cấp khung theo dõi hồ sơ hoàn thành đào tạo (`Training Completion Record`) làm tiền đề vững chắc cho việc triển khai `Phase 11A`.

---

## 2. Training Objectives

Chương trình đào tạo người dùng được xây dựng hướng đến 6 mục tiêu cốt lõi và bắt buộc (`Mandatory Core Training Objectives`):
1. **Quán triệt triết lý "AI chỉ là gợi ý tham mưu":** Cán bộ thụ lý hiểu sâu sắc Trợ lý AI Khối 3.1 là công cụ hỗ trợ phân tích sơ bộ, tuyệt đối không thay quyền con người đưa ra phán quyết hay kết luận cuối cùng của hồ sơ TTHC.
2. **Thành thạo đối chiếu Legal Snapshot (`v2.0-2024-LAND-LAW`):** Cán bộ nắm vững cách đọc metadata phiên bản luật tại Khối 3.2, hiểu ý nghĩa của ngày trích xuất dữ liệu và cách tra cứu Điều/Khoản trong `Legal Knowledge Base`.
3. **Nghiêm túc rà soát cảnh báo pháp lý địa phương &amp; quy hoạch (`LAW-02`):** Cán bộ nhận thức đúng và tuân thủ rà soát 3 căn cứ đặc thù của địa phương trước khi ra kết luận: (1) Quy trình nội bộ UBND tỉnh; (2) Quy hoạch/kế hoạch sử dụng đất cấp huyện; (3) Quy hoạch chi tiết 1/500 (nếu có).
4. **Nhận diện bản chất Export là tài liệu dự thảo nội bộ:** Cán bộ hiểu rõ toàn bộ file Word (`.docx`) và PDF tải về từ Khối 3.3 mang tiền tố `DU_THAO_GOI_Y_AI_` cùng watermark là bản nháp tham khảo, tuyệt đối không dùng để phát hành ra ngoài nếu chưa qua chỉnh sửa và ký duyệt theo thể thức hành chính.
5. **Nắm vững quy trình phản hồi &amp; báo lỗi đúng kênh:** Cán bộ thành thạo cách ghi nhận và thông báo sự cố/góp ý cho Trợ lý UAT qua Sổ theo dõi hỗ trợ hàng ngày (`Issue Register`), phân biệt rõ giữa lỗi kỹ thuật và góp ý cải tiến.
6. **Thấu hiểu ranh giới &amp; giới hạn hạ tầng hệ thống:** Cán bộ nắm được các giới hạn của hệ thống hiện tại (chưa tự động bóc tách OCR scan, chưa tự động liên thông quy hoạch), từ đó chủ phối hợp nhịp nhàng giữa LegalFlow V2 và phần mềm văn phòng E-Office hiện hữu.

---

## 3. Training Audience

Bảng phân lớp đối tượng học viên và phương pháp đào tạo tương ứng theo đúng vai trò thẩm quyền `RBAC` (`Training Audience Matrix Table`):

| Target User Group | Assigned Role (`RBAC`) | Core Operational Focus & Training Need | Recommended Training Format | Duration & Schedule | Notes & Governance Check |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **SYS-ADMIN / DEVOPS** <br/> *(Kỹ sư Vận hành &amp; Hạ tầng)* | `ADMIN` / `Technical Operator` | Quản trị container Docker, rà soát script `health-check.ps1`, xử lý xung đột cổng (`EXP-ENV-01`), sao lưu DB `pg_dump` an toàn ngoài Git (`untracked`). | Đào tạo kỹ thuật chuyên sâu &amp; Diễn tập Runbook (`Hands-on Lab`) | `90 minutes` *(T+1 Day)* | Làm chủ 100% quy trình sao lưu và khôi phục DB 15 phút. |
| **DEPT LEADERS** <br/> *(Lãnh đạo Phòng &amp; Pháp chế)* | `MANAGER` / `Legal Reviewer` | Rà soát phiếu thẩm định Khối 3.1, kiểm tra Legal Snapshot Khối 3.2, kiểm chứng tuân thủ quy trình văn thư Khối 3.3, phê duyệt tài khoản mới. | Tọa đàm Quản trị AI &amp; Quy trình Phê duyệt (`Executive Briefing`) | `45 minutes` *(T+2 Days)* | Quán triệt ranh giới trách nhiệm pháp lý tối cao thuộc về con người. |
| **CORE OFFICERS** <br/> *(Chuyên viên Thụ lý P2 &amp; Một cửa)* | `STAFF` | Thao tác Tab 1 Danh sách hồ sơ, bộ lọc `CASELIST-02`, điều hướng 7 tab chi tiết (`UX-05`), bấm chạy AI review và tải bản dự thảo Word `.docx`. | Đào tạo Thực hành tại bàn &amp; Kèm cặp 1:1 (`On-the-job Training`) | `60 minutes` *(T+3 -> T+5)* | Nhóm học viên nòng cốt trực tiếp xử lý hồ sơ TTHC hàng ngày. |
| **PREPARATION STAFF** <br/> *(Cán bộ Tra cứu &amp; Giám sát)* | `VIEWER` | Học cách tra cứu danh sách hồ sơ, sử dụng bộ lọc tìm kiếm và truy cập `Legal Knowledge Base` (`LK-01`), hiểu rõ giới hạn quyền `canAct: false`. | Hướng dẫn nhanh qua Video &amp; Sổ tay SOP (`Self-paced SOP`) | `30 minutes` *(T+6 Days)* | Chuẩn bị sẵn sàng cho các đợt mở rộng tiếp theo (`Wave 3`). |

---

## 4. Training Modules

Bảng chi tiết 7 mô-đun huấn luyện chuẩn hóa cho chương trình đào tạo Phase 10Q / Phase 11A (`Standardized Training Modules Table`):

| Module ID | Module Title & Focus Area | Target Audience | Recommended Duration | Key Core Content Covered | Expected Learning Outcome |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **MOD-01** | **Tổng quan Hệ thống LegalFlow V2 &amp; Bố cục UI (`CASELIST-02`, `UX-05`)** | Toàn bộ (`ADMIN / MANAGER / STAFF / VIEWER`) | `20 mins` | • Cách đăng nhập, quản lý JWT token.<br/>• Bộ lọc danh sách hồ sơ TTHC `Đất đai/Xây dựng`.<br/>• Ý nghĩa và cách di chuyển giữa 7 tab chi tiết hồ sơ. | Cán bộ tự tin đăng nhập, tìm kiếm hồ sơ và điều hướng mượt mà giữa các tab. |
| **MOD-02** | **AI Review Khối 3.1 &amp; Giới hạn của Trợ lý AI (`AI-01/04`)** | `MANAGER` / `STAFF` | `25 mins` | • Cách bấm nút `🤖 Chạy AI rà soát` trên Tab 3.<br/>• Đọc hiểu các tiêu chí hợp lệ / cần bổ sung / từ chối.<br/>• Quán triệt văn phong tham mưu không phán quyết. | Cán bộ biết cách tận dụng lời khuyên AI, hiểu rõ AI không thay thế quyền kết luận. |
| **MOD-03** | **Legal Snapshot Khối 3.2 &amp; Kiểm tra Căn cứ Pháp lý (`LK-01`, `LAW-02`)** | `MANAGER` / `STAFF` / `Legal Reviewer` | `20 mins` | • Đọc huy hiệu phiên bản luật `v2.0-2024-LAND-LAW`.<br/>• Kiểm tra ngày trích xuất căn cứ pháp lý.<br/>• **Bắt buộc rà soát 3 căn cứ quy hoạch địa phương (`LAW-02`).** | Cán bộ luôn đối chiếu quy định UBND tỉnh và quy hoạch sử dụng đất cấp huyện khi thụ lý. |
| **MOD-04** | **Dự thảo, In &amp; Xuất Văn bản Khối 3.3 (`SMK-06`)** | `MANAGER` / `STAFF` | `25 mins` | • Ý nghĩa tiền tố an toàn `DU_THAO_GOI_Y_AI_`.<br/>• Cách tải file Word `.docx` và PDF kèm watermark.<br/>• Quy trình chỉnh sửa trên MS Word và trình ký E-Office. | Cán bộ tuân thủ tuyệt đối quy tắc văn thư, không phát hành bản nháp AI chưa qua rà soát. |
| **MOD-05** | **Phân quyền Bảo mật theo Vai trò `RBAC` (`SMK-08`)** | Toàn bộ (`ADMIN / MANAGER / STAFF / VIEWER`) | `15 mins` | • Quyền hạn khác biệt của 4 vai trò.<br/>• Lý do tài khoản `VIEWER` bị khóa Khối 3.3 (`canAct: false`).<br/>• Cách đổi mật khẩu và bảo vệ an ninh tài khoản. | Cán bộ tôn trọng thẩm quyền truy cập, không sử dụng chung hoặc chia sẻ tài khoản. |
| **MOD-06** | **Quy trình Tiếp nhận Hỗ trợ &amp; Báo lỗi đúng Kênh (`Issue Triage`)** | Toàn bộ (`ADMIN / MANAGER / STAFF / VIEWER`) | `15 mins` | • Kênh liên hệ Trợ lý UAT và giờ tiếp nhận `16:30 PM`.<br/>• Phân biệt giữa lỗi kỹ thuật (`Issue`) và góp ý (`Suggestion`).<br/>• Cách xem Sổ theo dõi `EXPANDED_USER_SUPPORT...`. | Cán bộ chủ động gửi phản hồi chất lượng, giúp hệ thống không ngừng hoàn thiện (`BL-010`). |
| **MOD-07** | **Mười Việc Tuyệt đối Không được làm với AI &amp; Export (`Strict Mandates`)** | Toàn bộ (`ADMIN / MANAGER / STAFF / VIEWER`) | `15 mins` | • Quán triệt Kịch bản Nhắc nhở An toàn Mục 5.<br/>• Các hình thức kỷ luật nếu ỷ lại vào AI hoặc lộ bí mật.<br/>• Cam kết `Human-in-the-Loop` của từng chuyên viên. | Đảm bảo 100% kỷ luật an toàn thông tin và an toàn pháp lý trên môi trường production. |

---

## 5. Safety Script for Officers

Dưới đây là **Kịch bản Nhắc nhở An toàn (`Safety Script for Officers`)** được in đậm trong Sổ tay SOP và bắt buộc đọc tại phần mở đầu của mọi buổi đào tạo/tập huấn:

> [!IMPORTANT]
> **THÔNG ĐIỆP QUÁN TRIỆT AN TOÀN PHÁP LÝ & KỸ THUẬT DÀNH CHO CÁN BỘ THỤ LÝ (LEGALFLOW V2):**
> 
> 1. **AI KHÔNG THAY THẾ CÁN BỘ KẾT LUẬN:** Trợ lý AI trên Khối 3.1 chỉ làm nhiệm vụ **tham mưu sơ bộ, gợi ý rà soát**. Mọi ý kiến đánh giá "Hợp lệ", "Cần bổ sung" hay "Từ chối" của AI **đều không có giá trị pháp lý phán quyết**. Chuyên viên thụ lý và Lãnh đạo Phòng là những người duy nhất chịu trách nhiệm pháp lý tối cao đối với kết quả thẩm định hồ sơ.
> 2. **BẮT BUỘC KIỂM TRA VĂN BẢN PHÁP LUẬT HIỆN HÀNH:** Khi đọc kết quả gợi ý AI, chuyên viên phải kiểm tra huy hiệu hiệu lực pháp lý tại Khối 3.2 (`v2.0-2024-LAND-LAW`). Nếu phát hiện điều khoản luật đã được sửa đổi, bổ sung bởi Nghị định mới hơn, chuyên viên phải áp dụng quy định mới nhất và thông báo cho bộ phận Kỹ thuật.
> 3. **BẮT BUỘC ĐỐI CHIẾU CĂN CỨ ĐỊA PHƯƠNG & QUY HOẠCH SỬ DỤNG ĐẤT (`LAW-02`):** Luật Đất đai trung ương là khung chuẩn, nhưng **kết quả thụ lý tại địa phương phụ thuộc quyết định vào 3 căn cứ đặc thù:**  
>    &bull; *Quy trình nội bộ và Bộ thủ tục hành chính do UBND tỉnh ban hành;*  
>    &bull; *Quy hoạch, Kế hoạch sử dụng đất hàng năm của cấp huyện;*  
>    &bull; *Quy hoạch chi tiết xây dựng tỷ lệ 1/500 (nếu có).*  
>    Chuyên viên **bắt buộc rà soát thủ công các bản đồ và quyết định địa phương này** trước khi trình phiếu thẩm định.
> 4. **VĂN BẢN XUẤT RA CHỈ LÀ BẢN DỰ THẢO / GỢI Ý (`SMK-06`):** Toàn bộ file Word (`.docx`) và PDF tải về mang tiền tố `DU_THAO_GOI_Y_AI_` cùng hình nền mờ (*Watermark*) **chỉ là bản nháp nội bộ**. Tuyệt đối không được gỡ bỏ watermark để in ra đóng dấu hay trình ký trực tiếp khi chưa qua bước kiểm tra, rà soát và chỉnh sửa câu chữ cẩn trọng.
> 5. **TUYỆT ĐỐI KHÔNG TỰ ĐỘNG KÝ HAY BAN HÀNH VĂN BẢN:** Hệ thống LegalFlow V2 không tự động cấy chữ ký hay chuyển phát quyết định ra công dân. Mọi thao tác ký duyệt và ban hành chính thức phải được thực hiện trên phần mềm quản lý văn bản (`E-Office`) của cơ quan theo đúng thẩm quyền được phân công.

---

## 6. Change Management Risks

Bảng rà soát, nhận diện và các biện pháp giảm thiểu rủi ro trong quản trị sự thay đổi khi cán bộ chuyển sang sử dụng hệ thống mới (`Change Management Risk & Mitigation Table`):

| Risk ID | Identified Change Management Risk | Potential Operational Impact | Severity | Comprehensive Mitigation Strategy | Assigned Owner | Target Phase | Notes & Check |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| **CMR-01** | **Cán bộ hiểu nhầm AI là kết luận phán quyết cuối cùng:** Chuyên viên ỷ lại, sao chép nguyên văn lời khuyên AI Khối 3.1 vào phiếu rà soát mà không kiểm tra lại căn cứ. | `High` *(Sai lệch pháp lý, vi phạm kỷ luật AI Governance)* | `P1` | • Duy trì cố định cảnh báo viền vàng `LAW-02` và Khối 3.1.<br/>• Quán triệt Kịch bản Nhắc nhở An toàn Mục 5 trước mỗi ca làm việc.<br/>• Lãnh đạo Phòng kiểm tra tra chéo ngẫu nhiên `Audit Log` hàng tuần. | Dept Head / UAT Coordinator | `Phase 10Q / Phase 11A` | Chốt chặn then chốt bảo vệ an toàn pháp lý. |
| **CMR-02** | **Sử dụng nhầm bản Export dự thảo để ban hành:** Cán bộ tải file Word `DU_THAO_GOI_Y_AI_...docx` rồi in ra trình ký ngay mà không chỉnh sửa thể thức văn bản hành chính. | `High` *(Sai quy trình văn thư, ảnh hưởng uy tín cơ quan)* | `P1` | • Giữ vững cơ chế ép tiền tố `DU_THAO_GOI_Y_AI_` và watermark nháp (`SMK-06`).<br/>• Quán triệt tổ văn thư từ chối đóng dấu các văn bản còn mang tiền tố dự thảo.<br/>• Triển khai nâng cấp mẫu biểu Word chuẩn hóa tại `Phase 11C` (`BL-002`). | Dept Head / Document Clerks | `Phase 10Q / Phase 11C` | Bảo vệ tính chuẩn mực của quyết định hành chính. |
| **CMR-03** | **Cán bộ chưa quen giao diện 7 tab chi tiết (`UX-05`):** Chuyên viên lớn tuổi lúng túng khi di chuyển giữa Tab 1 (Thông tin) sang Tab 3 (AI Review) và Tab 6 (Ghi chú). | `Medium` *(Giảm tốc độ thụ lý ban đầu, tâm lý e ngại công cụ mới)* | `P2` | • Ban hành Sổ tay Quy trình Thao tác chuẩn (`SOP`) có hình ảnh minh họa chi tiết.<br/>• Tích hợp tooltip hướng dẫn ngay trên giao diện (`BL-010`).<br/>• Bố trí Trợ lý UAT kèm cặp thực hành 1:1 trong 3 ngày đầu (`MOD-01`). | UAT Coordinator / Support Lead | `Phase 11A` | Tháo gỡ triệt để rào cản thói quen làm việc cũ. |
| **CMR-04** | **Dữ liệu pháp lý địa phương chưa đầy đủ trong DB:** Khối 3.2 hiện chưa có quy định UBND tỉnh và bản đồ quy hoạch đất huyện, khiến chuyên viên phải rà soát song song 2 hệ thống. | `Medium` *(Tăng thao tác tra cứu thủ công ngoài phần mềm)* | `P2` | • Ghi rõ hạn chế này trong Sổ tay SOP để cán bộ nắm trước.<br/>• Ưu tiên số 1 triển khai làm giàu dữ liệu địa phương tại `Phase 11B` (`BL-001`).<br/>• Tích hợp tiện ích tra cứu nhanh `Interactive Law Reader` (`BL-007`). | Project Owner / Legal Reviewer | `Phase 11B` | Đáp ứng trọn vẹn yêu cầu nghiệp vụ chuyên sâu. |
| **CMR-05** | **Cán bộ không báo lỗi đúng kênh hỗ trợ:** Chuyên viên gặp vướng mắc nhưng chỉ trao đổi miệng qua Zalo cá nhân, không ghi nhận vào Sổ theo dõi sự cố chính thức. | `Low` *(Khó tổng hợp thống kê, bỏ sót góp ý nâng cấp của người dùng)* | `P3` | • Chuẩn hóa quy trình hỗ trợ 6 bước, thông báo rõ kênh liên hệ chính thức.<br/>• Trợ lý UAT chủ động hỏi thăm cán bộ lúc `16:30 PM` mỗi chiều để ghi nhận sổ `EXPANDED_USER_SUPPORT...`. | UAT Coordinator | `Continuous` | Duy trì kỷ luật vận hành và lắng nghe người dùng. |

---

## 7. Training Completion Record

Bảng biểu mẫu theo dõi và ghi nhận hoàn thành đào tạo của các nhóm cán bộ thụ lý (để trống thông tin cá nhân thực tế nếu chưa được cung cấp để cơ quan thẩm quyền điền xác nhận khi triển khai Phase 11A):

| Training Session ID | Scheduled Date | Target User Group & Role | Total Participants | Assigned Trainer / Lead | Modules Completed | Completion Status | Official Notes & Sign-off Mandate |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **TRN-W1-CORE** | `[  /  / 2026 ]` | `USR-WAVE1-CORE` *(ADMIN / MANAGER / STAFF)* | `[   ] users` | `[ Tech Lead / UAT Coord ]` | `MOD-01 -> MOD-07` | `[   ] COMPLETED` | Nhóm cán bộ Pilot nòng cốt, đã thành thạo hệ thống từ Phase 10B/10L. Đóng vai trò hướng dẫn đồng nghiệp. |
| **TRN-W2-STAFF** | `[  /  / 2026 ]` | `USR-WAVE2-STAFF` *(Chuyên viên Một cửa &amp; Thụ lý P2)* | `[   ] users` | `[ UAT Coordinator ]` | `MOD-01 -> MOD-07` | `[   ] COMPLETED` | Nhóm cán bộ mở rộng Wave 2, tập trung sâu vào thao tác bộ lọc `CASELIST-02`, Khối 3.1 AI Review và Kịch bản An toàn Mục 5. |
| **TRN-W2-MGR** | `[  /  / 2026 ]` | `USR-WAVE2-MGR` *(Lãnh đạo Phòng P2)* | `[   ] users` | `[ Project Owner / Tech Lead ]` | `MOD-02, MOD-03, MOD-05, MOD-07` | `[   ] COMPLETED` | Lãnh đạo Phòng, tập trung vào rà soát phiếu AI Khối 3.1, kiểm tra đối chiếu quy hoạch địa phương `LAW-02` và quản trị `RBAC`. |
| **TRN-W3-PREP** | `[  /  / 2026 ]` | `USR-WAVE3-PREP` *(Cán bộ Tra cứu &amp; Giám sát)* | `[   ] users` | `[ Support Engineer ]` | `MOD-01, MOD-03, MOD-05, MOD-07` | `[   ] SCHEDULED` | Nhóm chuẩn bị cho đợt mở rộng tiếp theo (`Wave 3`), tập trung vào tra cứu danh sách hồ sơ và `Legal Knowledge Base`. |
| **TRN-OPS-INFRA** | `[  /  / 2026 ]` | `SYS-ADMIN / DEVOPS` *(Kỹ sư Vận hành Hạ tầng)* | `[   ] users` | `[ DevOps Lead ]` | `MOD-05, MOD-06 + Runbook` | `[   ] COMPLETED` | Lực lượng kỹ thuật trực chiến, làm chủ `health-check.ps1`, `docker ps`, xử lý lỗi `EXP-ENV-01` và sao lưu `pg_dump` an toàn ngoài Git. |

---

### Khẳng định An toàn Pháp lý & Kỹ thuật của Lực lượng Lập Kế hoạch Đào tạo:
Tôi xác nhận trong quá trình lập Kế hoạch Đào tạo &amp; Quản trị Sự thay đổi Phase 10Q đã tuân thủ tuyệt đối:
* ✅ **Không sửa đổi mã nguồn Backend / Frontend, không chỉnh sửa `schema.prisma`, migrations hay `.env`.**
* ✅ **Không can thiệp, xóa hay reset/restore cơ sở dữ liệu production `legalflow_prod`.**
* ✅ **Không mở rộng thêm người dùng thật trên DB trong phase này, không ghi lại mật khẩu hay bí mật nhạy cảm vào tài liệu.**
* ✅ **Quán triệt 100% Kịch bản Nhắc nhở An toàn Mục 5 và các chốt chặn `Change Management Risks` Mục 6 vào giáo trình huấn luyện.**
* ✅ **Khẳng định nguyên tắc AI chỉ là gợi ý, văn bản export là dự thảo `DU_THAO_GOI_Y_AI_`, cán bộ chịu trách nhiệm pháp lý cao nhất.**

---
*Kế hoạch Đào tạo & Quản trị Sự thay đổi được lập tự động chuẩn hóa từ hồ sơ giám sát thực tiễn Phase 10P và Sổ Backlog Phase 10Q.*
