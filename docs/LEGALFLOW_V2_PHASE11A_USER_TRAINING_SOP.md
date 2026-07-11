# LEGALFLOW V2 - PHASE 11A
# USER TRAINING SOP

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.17-production-adoption-review-continuous-improvement-backlog` -> `Phase 11A Standard`  
**Ngày ban hành SOP:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL USER TRAINING SOP & GUIDELINES`** *(Quy trình chuẩn hóa Đào tạo Người dùng)*

---

## 1. Purpose

Tài liệu này là Quy trình Thao tác chuẩn về Đào tạo Người dùng (`User Training SOP` - Phase 11A) của hệ thống LegalFlow V2. Quy trình được ban hành ngay sau khi đóng Giai đoạn 10 (`Phase 10Q`) nhằm chuẩn hóa phương pháp huấn luyện, hướng dẫn thao tác và kèm cặp thực tế cho toàn bộ cán bộ thụ lý, quản trị viên cùng lực lượng hỗ trợ kỹ thuật trên môi trường vận hành production có kiểm soát. Tài liệu thiết lập khung nguyên tắc bắt buộc (`Training Principles`), xác định rõ ma trận học viên (`Training Audience`), hệ thống hóa 10 mô-đun bài giảng (`Training Modules`), định dạng cấu trúc một ca tập huấn (`Training Flow`), quy định lời nhắc an toàn bắt buộc (`Required Safety Script`) và bảng kiểm hoàn thành (`Training Completion Checklist`) để bảo đảm 100% người dùng làm chủ công cụ mà vẫn giữ vững kỷ luật an toàn thông tin và an toàn pháp lý.

---

## 2. Training Principles

Chương trình đào tạo và kèm cặp cán bộ sử dụng LegalFlow V2 được xây dựng dựa trên 6 nguyên tắc cốt lõi, bất khả xâm phạm (`Mandatory Training Principles`):
1. **AI chỉ là công cụ hỗ trợ rà soát:** Trợ lý AI Khối 3.1 là công cụ công nghệ thông tin giúp tổng hợp thông tin, phân tích sơ bộ và gợi ý các tiêu chí hồ sơ, tuyệt đối không có tư cách thay thế vai trò thẩm định chuyên môn của con người.
2. **AI không thay cán bộ kết luận:** Mọi ý kiến đánh giá "Hợp lệ", "Cần bổ sung" hay "Từ chối" của Trợ lý AI chỉ mang tính chất tham mưu; cán bộ thụ lý và Lãnh đạo Đơn vị là chủ thể duy nhất có thẩm quyền và chịu trách nhiệm pháp lý cao nhất về kết quả xử lý hồ sơ TTHC.
3. **Cán bộ phải kiểm tra căn cứ pháp lý hiện hành:** Khi đọc lời khuyên AI Khối 3.1, cán bộ bắt buộc phải kiểm tra huy hiệu hiệu lực tại Khối 3.2 (`v2.0-2024-LAND-LAW`). Nếu Luật Đất đai 2024 có điều khoản mới được sửa đổi, bổ sung bởi Nghị định/Thông tư hướng dẫn mới, cán bộ phải áp dụng văn bản mới nhất.
4. **Cán bộ phải kiểm tra văn bản địa phương, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ:** Căn cứ trung ương là khung chung, nhưng quyết định hành chính tại địa phương phụ thuộc trực tiếp vào **3 căn cứ đặc thù:** (1) Bộ TTHC và Quy trình nội bộ do UBND tỉnh ban hành; (2) Quy hoạch, Kế hoạch sử dụng đất hàng năm của cấp huyện; (3) Quy hoạch chi tiết xây dựng tỷ lệ 1/500 (nếu có). Cán bộ bắt buộc rà soát thủ công các bản đồ/quyết định này theo lời nhắc `LAW-02`.
5. **File xuất là bản dự thảo / gợi ý (`SMK-06`):** Toàn bộ file Word (`.docx`) và PDF tải về từ Khối 3.3 đều mang tiền tố bắt buộc `DU_THAO_GOI_Y_AI_` cùng hình nền mờ (*Watermark*), khẳng định đây là tài liệu tham khảo nội bộ.
6. **Không dùng bản AI để ký/ban hành nếu chưa kiểm tra/chỉnh sửa theo quy định:** Cán bộ và Lãnh đạo tuyệt đối không được sử dụng nguyên văn bản dự thảo AI chưa qua chỉnh sửa câu chữ, không được gỡ bỏ watermark để in ra trình ký, đóng dấu hay ban hành chính thức.

---

## 3. Training Audience

Bảng rà soát phân lớp học viên và hình thức huấn luyện tương ứng với vai trò phân quyền `RBAC` (`Training Audience Matrix Table`):

| Target User Group | Assigned Role (`RBAC`) | Specific Training Need & Focus Area | Recommended Training Format | Notes & Governance Check |
| :--- | :---: | :--- | :--- | :--- |
| **ADMIN / DEVOPS** <br/> *(Quản trị viên &amp; Hạ tầng)* | `ADMIN` / `Technical Operator` | Quản lý container Docker (`health-check.ps1`), giám sát proxy Caddy, rà soát xung đột cổng (`EXP-ENV-01`), sao lưu `pg_dump` an toàn ngoài Git (`untracked`). | Đào tạo kỹ thuật chuyên sâu &amp; Diễn tập Runbook (`Hands-on Lab`) | Làm chủ 100% quy trình sao lưu và khôi phục DB 15 phút, tuyệt đối không tự reset DB. |
| **MANAGER / LEADERS** <br/> *(Lãnh đạo Phòng &amp; Pháp chế)* | `MANAGER` / `Legal Reviewer` | Rà soát phiếu thẩm định do AI gợi ý Khối 3.1, kiểm tra Legal Snapshot Khối 3.2, giám sát tuân thủ quy trình văn thư Khối 3.3, quản trị tháo gỡ vướng mắc. | Tọa đàm Quản trị AI &amp; Quy trình Phê duyệt (`Executive Briefing`) | Quán triệt ranh giới trách nhiệm pháp lý tối cao thuộc về con người (`Human-in-the-Loop`). |
| **STAFF OFFICERS** <br/> *(Chuyên viên Một cửa &amp; Thụ lý P2)* | `STAFF` | Thao tác Tab 1 Danh sách hồ sơ, sử dụng bộ lọc `CASELIST-02`, điều hướng 7 tab chi tiết (`UX-05`), bấm chạy AI review và tải bản dự thảo Word `.docx`. | Đào tạo Thực hành tại bàn &amp; Kèm cặp 1:1 (`On-the-job Training`) | Nhóm học viên nòng cốt trực tiếp tiếp nhận và rà soát hồ sơ TTHC hàng ngày. |
| **VIEWER / PREP STAFF** <br/> *(Cán bộ Tra cứu &amp; Giám sát)* | `VIEWER` | Học cách tra cứu danh sách hồ sơ Tab 1, sử dụng bộ lọc tìm kiếm và truy cập `Legal Knowledge Base` (`LK-01`), thấu hiểu giới hạn quyền `canAct: false`. | Hướng dẫn qua Video &amp; Sổ tay SOP (`Self-paced SOP`) | Chuẩn bị kiến thức vững chắc trước khi mở rộng quyền truy cập vào các đợt tiếp theo. |

---

## 4. Training Modules

Bảng quy định 10 mô-đun bài giảng chuẩn hóa của chương trình đào tạo Phase 11A (`Standardized Training Modules Table`):

| Module ID | Module Title & Focus Area | Target Audience | Duration | Core Content Covered | Expected Learning Outcome |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **MOD-01** | **Tổng quan LegalFlow V2 &amp; Kiến trúc Thụ lý** | Toàn bộ (`All Roles`) | `15 mins` | • Mục tiêu hệ thống, kiến trúc Docker production.<br/>• Bố cục giao diện tổng quát, thanh định hướng.<br/>• Ý nghĩa của việc tin học hóa rà soát TTHC. | Cán bộ hiểu cấu trúc hệ thống và ý nghĩa của việc sử dụng công cụ trợ lý số. |
| **MOD-02** | **Đăng nhập, Quản lý Token &amp; Phân quyền `RBAC`** | Toàn bộ (`All Roles`) | `15 mins` | • Cú pháp đăng nhập JWT, xử lý hết hạn phiên.<br/>• Ma trận phân quyền `ADMIN / MANAGER / STAFF / VIEWER`.<br/>• Nguyên nhân `VIEWER` bị khóa nút xuất Khối 3.3 (`SMK-08`). | Cán bộ tự tin đăng nhập, bảo vệ tài khoản và tôn trọng giới hạn phân quyền. |
| **MOD-03** | **Danh sách Hồ sơ &amp; Bộ lọc Lĩnh vực (`CASELIST-02`)** | `MANAGER` / `STAFF` / `VIEWER` | `20 mins` | • Thao tác Tab 1 Case List, sắp xếp `receivedAt DESC`.<br/>• Bộ lọc thủ tục Đất đai / Xây dựng, tìm kiếm theo số hồ sơ.<br/>• Xử lý khi gặp thẻ thông báo lỗi (`CASELIST-01`). | Chuyên viên Một cửa và Thụ lý nhanh chóng tìm ra hồ sơ cần thẩm định trong ca làm việc. |
| **MOD-04** | **Chi tiết Hồ sơ &amp; Bố cục 7 Tab Nghiệp vụ (`UX-05`)** | `MANAGER` / `STAFF` / `VIEWER` | `25 mins` | • Di chuyển giữa 7 tab: `Thông tin -> Checklist -> AI -> Tài liệu -> Tài chính -> Ghi chú -> Audit Log`.<br/>• Kiểm tra metadata chủ sử dụng đất, số thửa, tờ bản đồ.<br/>• Ý nghĩa thẻ trống (`DETAIL-02`) khi chưa có tài liệu scan. | Cán bộ nắm vững cấu trúc chi tiết hồ sơ, không bỏ sót tài liệu đính kèm hay ghi chú. |
| **MOD-05** | **AI Review Khối 3.1 &amp; Kỷ luật Quản trị AI (`AI-01/04`)** | `MANAGER` / `STAFF` | `30 mins` | • Bấm nút `🤖 Chạy AI rà soát` trên Tab 3.<br/>• Đọc hiểu lời khuyên tham mưu (Hợp lệ / Cần bổ sung / Từ chối).<br/>• Quán triệt văn phong tham mưu khách quan, không phán quyết. | Cán bộ biết cách tận dụng trí tuệ AI để tiết kiệm 50% thời gian rà soát nghiệp vụ. |
| **MOD-06** | **Legal Snapshot Khối 3.2 &amp; Căn cứ Pháp lý Sử dụng** | `MANAGER` / `STAFF` / `Legal Reviewer` | `20 mins` | • Kiểm tra huy hiệu hiệu lực `v2.0-2024-LAND-LAW`.<br/>• Ý nghĩa ngày trích xuất dữ liệu pháp lý (`LK-01`).<br/>• **Bắt buộc rà soát thủ công 3 căn cứ quy hoạch địa phương (`LAW-02`).** | Cán bộ luôn đối chiếu chính xác luật trung ương và quy hoạch đất cấp huyện khi thụ lý. |
| **MOD-07** | **Dự thảo, In &amp; Xuất Văn bản Khối 3.3 (`SMK-06`)** | `MANAGER` / `STAFF` | `25 mins` | • Ý nghĩa tiền tố bắt buộc `DU_THAO_GOI_Y_AI_`.<br/>• Cách tải file Word `.docx` và PDF kèm watermark.<br/>• Quy trình chỉnh sửa trên MS Word trước khi trình ký E-Office. | Cán bộ tuân thủ nghiêm ngặt quy chế văn thư, ngăn chặn tuyệt đối phát hành bản nháp AI. |
| **MOD-08** | **Cơ sở Tri thức Pháp lý `Legal Knowledge Base`** | Toàn bộ (`All Roles`) | `15 mins` | • Tra cứu điều khoản Luật Đất đai 2024 trong menu `Knowledge`.<br/>• Tìm kiếm nhanh theo từ khóa (chuyển nhượng, tách thửa, cấp GCN).<br/>• Kiểm tra trạng thái hiệu lực pháp lý của từng văn bản. | Cán bộ có ngay thư viện pháp lý số hóa chuẩn xác ngay tại bàn làm việc. |
| **MOD-09** | **Báo lỗi, Góp ý &amp; Quy trình Hỗ trợ 6 bước (`Issue Triage`)** | Toàn bộ (`All Roles`) | `15 mins` | • Kênh liên hệ Trợ lý UAT và giờ tiếp nhận `16:30 PM` hàng ngày.<br/>• Phân biệt rõ giữa lỗi kỹ thuật (`Issue`) và góp ý nâng cấp (`Suggestion`).<br/>• Cách lập phiếu phản hồi chi tiết để đưa vào Backlog Phase 11. | Cán bộ chủ động tham gia cải tiến công cụ, giao tiếp hiệu quả với lực lượng kỹ thuật. |
| **MOD-10** | **Những việc Tuyệt đối Không được làm với AI &amp; Export** | Toàn bộ (`All Roles`) | `20 mins` | • Quán triệt Kịch bản Nhắc nhở An toàn Mục 6.<br/>• Các chốt chặn không tự ký, không tự ban hành, không tự gửi.<br/>• Trách nhiệm giải trình pháp lý cá nhân (`Human-in-the-Loop`). | Đảm bảo 100% kỷ luật vận hành production an toàn, không có ngoại lệ. |

---

## 5. Training Flow

Cấu trúc thời gian chuẩn hóa cho một ca tập huấn trực tiếp (`60 – 90 phút`) tại phòng họp chuyên môn hoặc trực tuyến (`Standardized 90-Minute Training Session Flow`):
1. **`00:00 -> 00:10` (10 phút): Giới thiệu Tổng quan &amp; Mục tiêu Hệ thống (`MOD-01/02`):** Cán bộ phụ trách giới thiệu mục đích tin học hóa, bố cục giao diện và hướng dẫn cách đăng nhập bằng tài khoản phân quyền `RBAC`.
2. **`00:10 -> 00:20` (10 phút): Quán triệt Nguyên tắc An toàn AI &amp; Đọc Kịch bản (`MOD-10`):** Cán bộ đào tạo đứng nghiêm túc đọc toàn văn **Required Safety Script (Mục 6)**, nhấn mạnh AI chỉ là tham mưu và cán bộ chịu trách nhiệm pháp lý cao nhất.
3. **`00:20 -> 00:40` (20 phút): Trình diễn Mẫu nghiệp vụ (`Live Demonstration` - `MOD-03 -> MOD-08`):** Giảng viên thực hiện mẫu luồng xử lý 1 hồ sơ TTHC thực tế: tìm kiếm trên Tab 1 &rarr; mở 7 tab chi tiết &rarr; bấm chạy AI Khối 3.1 &rarr; kiểm tra snapshot Khối 3.2 (`LAW-02`) &rarr; tải file Word dự thảo Khối 3.3 (`SMK-06`).
4. **`00:40 -> 01:00` (20 phút): Cán bộ Thực hành Trực tiếp (`Hands-on Practice`):** Các chuyên viên thụ lý tự thao tác đăng nhập trên máy tính cá nhân, chọn 1 hồ sơ trong danh sách, tự bấm chạy AI review và tải về file Word `.docx` để tự kiểm chứng tiền tố và watermark. Trợ lý UAT đi kèm cặp từng bàn.
5. **`01:00 -> 01:10` (10 phút): Xử lý Lỗi Thường gặp &amp; Kỹ năng Tránh sai sót (`Troubleshooting`):** Hướng dẫn xử lý khi gặp thẻ lỗi (`CASELIST-01`), giải thích lý do tài khoản `VIEWER` không xuất được văn bản và cách chỉnh sửa file Word sau khi tải về.
6. **`01:10 -> 01:20` / `01:30` (10 - 20 phút): Hỏi đáp, Ghi nhận Góp ý &amp; Ký Nghiệm thu (`MOD-09`):** Thảo luận mở giải đáp thắc mắc của lãnh đạo phòng và chuyên viên, ghi nhận các góp ý (`Suggestion`) vào Sổ Backlog Phase 11 và hướng dẫn ký xác nhận vào biểu mẫu Mục 7.

---

## 6. Required Safety Script

Dưới đây là **Đoạn Kịch bản Nhắc nhở An toàn Bắt buộc (`Required Safety Script`)** mà cán bộ phụ trách đào tạo **phải đọc nguyên văn trước toàn thể học viên** tại phần mở đầu (`phút thứ 10`) của mọi buổi học:

> [!CAUTION]
> **LỜI NHẮC QUÁN TRIỆT AN TOÀN VẬN HÀNH BẮT BUỘC (ĐỌC TRƯỚC LỚP HỌC):**
> 
> *"LegalFlow là hệ thống hỗ trợ rà soát và gợi ý xử lý hồ sơ. Kết quả AI không phải kết luận pháp lý cuối cùng. Cán bộ có trách nhiệm kiểm tra hồ sơ, căn cứ pháp luật hiện hành, văn bản địa phương, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ trước khi tham mưu hoặc ban hành văn bản. Văn bản xuất từ hệ thống là bản dự thảo/gợi ý, không tự động ký, không tự động ban hành và không tự động gửi."*

---

## 7. Training Completion Checklist

Bảng kiểm chứng và nghiệm thu kết quả đào tạo đối với từng học viên sau khi kết thúc ca tập huấn (`Individual Training Completion Checklist Table`):

| Checklist Item | Required Verification Competency | Completed? (`Yes/No/NA`) | Evidence & Practical Demonstration | Notes & Governance Evaluation |
| :--- | :--- | :---: | :--- | :--- |
| **1. Đăng nhập &amp; Phân quyền** | Học viên tự đăng nhập đúng tài khoản và giải thích được giới hạn của vai trò mình giữ (`STAFF/MANAGER/VIEWER`) | ✅ **Yes** | Thao tác thành công trên trình duyệt web tại lớp | Không có trường hợp sử dụng chung tài khoản. |
| **2. Hiểu AI Warning Banner** | Học viên ghi nhớ nguyên văn thông điệp viền vàng *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* | ✅ **Yes** | Trả lời chính xác câu hỏi kiểm tra nhanh của giảng viên | Nhận thức rõ trách nhiệm tối cao thuộc về con người. |
| **3. Biết xem Legal Snapshot** | Học viên chỉ ra được huy hiệu `v2.0-2024-LAND-LAW` và ngày trích xuất tại Khối 3.2 | ✅ **Yes** | Thao tác kiểm tra metadata pháp lý trên Tab 3 | Hiểu tầm quan trọng của việc kiểm tra phiên bản luật. |
| **4. Rà soát Quy hoạch Địa phương** | Học viên đọc và nhớ 3 căn cứ địa phương cần rà soát thủ công theo khung vàng `LAW-02` | ✅ **Yes** | Khẳng định luôn kiểm tra quy hoạch đất huyện ngoài E-Office | Bảo đảm không bỏ sót quy định của UBND tỉnh. |
| **5. Biết Export là Dự thảo** | Học viên giải thích được ý nghĩa của tiền tố `DU_THAO_GOI_Y_AI_` và watermark nháp (`SMK-06`) | ✅ **Yes** | Tải thành công file Word `.docx` và mở kiểm tra tiền tố | Cam kết không trình ký trực tiếp bản nháp chưa sửa. |
| **6. Biết Báo lỗi đúng Kênh** | Học viên thao tác được các bước ghi nhận sự cố 6 bước và biết liên hệ Trợ lý UAT lúc `16:30 PM` | ✅ **Yes** | Nêu đúng quy trình phản hồi sự cố kỹ thuật và góp ý | Đồng hành cùng kỹ thuật hoàn thiện Sổ Backlog Phase 11. |
| **7. Hiểu Giới hạn Hệ thống** | Học viên liệt kê được các giới hạn hiện tại (chưa tự ký, chưa ban hành, chưa OCR tự động) | ✅ **Yes** | Xác nhận hiểu rõ ranh giới hỗ trợ của phần mềm | Chủ động phối hợp hài hòa giữa LegalFlow và E-Office. |

---
*Quy trình Thao tác chuẩn về Đào tạo Người dùng (Phase 11A SOP) được lập tự động từ kết quả tổng kết Phase 10Q.*
