# LEGALFLOW V2 - PHASE 10F
# PILOT UAT RESULTS & ISSUE TRIAGE REPORT

**Ngày ban hành:** 11/07/2026  
**Phiên bản nền tảng:** `v2.10.4-pilot-uat-officer-execution-pack` ➔ Phase 10F  
**Chuyên trách tổng hợp & chẩn đoán:** Điều phối viên UAT & Trợ lý kỹ thuật (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Results & Issue Triage Report** là Báo cáo tổng hợp toàn diện kết quả thực thi Pilot UAT thực tế với Cán bộ/Người dùng thử trên hệ thống LegalFlow v2.
Mục đích cốt lõi của giai đoạn Phase 10F là thu nhận (`Intake`), phân loại (`Categorize`), chẩn đoán mức độ nghiêm trọng (`Triage`) đối với toàn bộ 22 ý kiến phản hồi, lỗi hiển thị và đề xuất cải tiến từ người dùng thực tế; từ đó phân nhóm ưu tiên xử lý (`Priority Grouping`) và đưa ra phán quyết điều hướng (`Go/No-Go Recommendation`) cùng phạm vi công việc chính thức cho Phase 10G tiếp theo.
*(**Lưu ý kỹ thuật:** Phase 10F thuần túy thực hiện công tác tổng hợp, phân tích quy trình nghiệp vụ và lập kế hoạch chẩn đoán, hoàn toàn không can thiệp sửa đổi bất kỳ mã nguồn, schema hay cơ sở dữ liệu nào).*

---

## 2. UAT Session Summary

Bảng thông tin tổng quan về mốc đường cơ sở (`Baseline`) và kết quả chung của đợt kiểm thử Pilot UAT thực tế với các Cán bộ Phòng Thẩm định:

| Trường thông tin (`Summary Field`) | Dữ liệu Ghi nhận thực tế đợt Pilot UAT (`UAT Execution Summary`) |
| :--- | :--- |
| **Date** | `11/07/2026` — Tổng kết sau khi hoàn tất chuỗi phiên kiểm thử Pilot UAT thực tiễn với cán bộ thụ lý. |
| **Environment** | `Docker Staging / UAT Sandbox Environment` (`http://kevindoan-legalflow.local:8080` & Port `5173`). |
| **Git Tag** | **`v2.10.4-pilot-uat-officer-execution-pack`** *(Mã nguồn gốc được phong tỏa trước giờ test)*. |
| **Number of Participants** | **08 Đại diện người dùng/Cán bộ** *(Bao gồm các Chuyên viên thụ lý đất đai, Lãnh đạo Phòng Thẩm định, Quản trị viên hệ thống và Cán bộ giám sát)*. |
| **Roles Tested** | **04 / 04 Vai trò (`100% Coverage`)** — Bao phủ đầy đủ `ADMIN`, `MANAGER`, `STAFF`, và `VIEWER`. |
| **Total Issues / Feedback** | **22 Phiếu ý kiến (`CASELIST-01` đến `UX-05`)** — Ghi nhận trung thực từ trải nghiệm thực tế của cán bộ. |
| **Overall Result** | **STABLE CORE – HIGH INTENT FOR UX & SAFETY ENHANCEMENT (`NEEDS ISSUE FIXES BEFORE PROD`)** |
| **Notes / Preliminary Conclusion** | • **Kết luận sơ bộ:** Hệ thống đạt độ ổn định cao về luồng nghiệp vụ cốt lõi, **hoàn toàn không ghi nhận lỗi `Critical` (sập trang, rò rỉ phân quyền RBAC hay vi phạm tiền tố an toàn `DU_THAO_GOI_Y_AI_`)**.<br>• Tuy nhiên, cán bộ đóng góp nhiều ý kiến chất lượng ở mức độ `High/Medium/Suggestion` liên quan đến độ rõ ràng của Empty State, bố cục nhận xét AI, trích dẫn văn bản quy hoạch/kế hoạch sử dụng đất địa phương và trải nghiệm UX.<br>• **Khuyến nghị:** Cần chuyển tiếp sang giai đoạn sửa lỗi và tối ưu hóa (`Issue Fixes & Stabilization` - Phase 10G) trước khi chuẩn bị triển khai vận hành chính thức trên môi trường Production. |

---

## 3. Issues / Feedback Register

Bảng tổng hợp chi tiết toàn bộ **22 phiếu sự cố và góp ý nghiệp vụ (`Intake Register`)** được phân loại theo 07 Khu vực chức năng của hệ thống LegalFlow v2:

| Issue ID | Area (`Khu vực`) | Description (`Mô tả sự cố / Ý kiến góp ý của Cán bộ`) | Severity | Priority | Recommendation (`Khuyến nghị xử lý chuyên sâu`) | Target Phase | Status | Notes |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :--- |
| **CASELIST-01** | Danh sách hồ sơ | Khi lỗi API (hoặc mất mạng tạm thời), cán bộ chưa phân biệt được “không có hồ sơ” (`Empty State`) và “hệ thống lỗi” (`Error State`). | `Medium` | `P1` | Rà soát và làm rõ error state trên UI, tuyệt đối không hiển thị nhầm thành empty state ("Chưa có dữ liệu") khi API đang gặp sự cố kết nối. | `Phase 10G` | `Logged` | Cải thiện độ minh bạch thông báo lỗi. |
| **CASELIST-02** | Danh sách hồ sơ | Cán bộ muốn có khả năng sắp xếp (`Sort`) danh sách theo ngày nộp mới nhất hoặc theo trạng thái hồ sơ. | `Suggestion` | `P2` | Bổ sung cơ chế sort theo ngày mới nhất và trạng thái nếu phù hợp với thiết kế UI hiện tại mà không làm nặng query. | `Phase 10G / Near Backlog` | `Logged` | Tiện ích hỗ trợ tìm kiếm hồ sơ nhanh. |
| **DETAIL-01** | Chi tiết hồ sơ | Cán bộ muốn có khu vực ghi chú nội bộ (`Internal Notes`) hoặc bảng lịch sử xử lý chi tiết hơn ngay trên trang hồ sơ. | `Suggestion` | `P3` | Đưa vào backlog sau pilot vì yêu cầu này có thể cần thiết kế mở rộng schema hoặc module nghiệp vụ lưu vết ghi chú riêng. | `Backlog` | `Deferred` | Tránh can thiệp schema ở giai đoạn UAT. |
| **DETAIL-02** | Chi tiết hồ sơ | Khi hồ sơ TTHC thiếu dữ liệu địa chính (ví dụ: thiếu diện tích, số tờ/thửa), empty state hiển thị chưa đủ rõ ràng. | `Medium` | `P1` | Bổ sung khối hướng dẫn rõ ràng cho cán bộ biết cụ thể trường dữ liệu nào đang thiếu và cán bộ cần làm thao tác gì tiếp theo. | `Phase 10G` | `Logged` | Hỗ trợ cán bộ định hướng xử lý hồ sơ khuyết thiếu. |
| **AI-01** | AI Review | Khối nhận xét kết quả của Trợ lý AI đang hiển thị thành đoạn văn dài liên tục, khiến cán bộ khó đọc nhanh và khó nắm bắt trọng tâm. | `Medium` | `P1` | Tách cấu trúc output AI thành các phần mạch lạc, trực quan: **Tóm tắt nhanh**, **Vấn đề cần kiểm tra**, **Rủi ro**, **Gợi ý hướng xử lý**, **Lưu ý cán bộ**. | `Phase 10G` | `Logged` | Cải tiến Prompt formatting để dễ đọc, dễ rà soát. |
| **AI-02** | AI Review | Trợ lý AI nêu được căn cứ pháp lý chung nhưng cán bộ muốn thấy trích yếu rõ điều/khoản cụ thể hơn khi rà soát. | `Medium` | `P2` | Cải tiến nguồn pháp lý/hiển thị trích yếu điều khoản khi dữ liệu prompt có sẵn; **tuyệt đối không để AI tự suy diễn (`hallucinate`) điều khoản nếu thiếu dữ liệu**. | `Near Backlog / Phase 10G` | `Logged` | Đảm bảo tính chính xác và thận trọng pháp lý. |
| **AI-03** | AI Review | Khi thực hiện AI phân tích lại (`Re-run Analysis`), cán bộ không rõ bản kết quả mới và bản cũ khác nhau ở những điểm nào. | `Medium` | `P2` | Bổ sung hiển thị lịch sử phiên phân tích hoặc nhãn thời điểm/lần phân tích (`Timestamp / Run #`) rõ ràng trên thẻ AI Review. | `Near Backlog` | `Logged` | Giúp cán bộ đối chiếu lịch sử thẩm định. |
| **AI-04** | AI Review | Trợ lý AI đôi khi sử dụng thuật ngữ pháp lý chung chung, chưa sát với văn phong hành chính chuẩn mực trong thẩm định đất đai. | `Medium` | `P1` | Cập nhật chỉ dẫn system prompt/văn phong output theo chuẩn hành chính nhà nước: rõ ràng, thận trọng, khách quan, **không kết luận phán quyết thay thẩm quyền cán bộ**. | `Phase 10G` | `Logged` | Chuẩn hóa văn phong tham mưu hành chính. |
| **LAW-01** | Căn cứ pháp lý / Legal Snapshot | Cán bộ muốn có thể bấm trực tiếp vào từng văn bản căn cứ pháp lý trong danh sách Snapshot để xem toàn văn nội dung chi tiết. | `Suggestion / Medium` | `P2` | Đưa vào backlog gần; nếu trong CSDL/phân hệ Knowledge đã có dữ liệu toàn văn thì có thể mở modal xem chi tiết (`View Legal Text Modal`). | `Near Backlog` | `Logged` | Tăng trải nghiệm tra cứu luật ngay trên trang. |
| **LAW-02** | Căn cứ pháp lý / Legal Snapshot | Hệ thống hiện thiếu các căn cứ pháp lý đặc thù của địa phương, thông tin quy hoạch sử dụng đất và kế hoạch sử dụng đất cấp huyện. | `High / Medium` | `P1` | Ghi rõ đây là giới hạn phạm vi dữ liệu trung ương; **bổ sung banner cảnh báo (`Mandatory Local Law Warning`) yêu cầu cán bộ bắt buộc phải kiểm tra văn bản địa phương, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ tại thời điểm xử lý**. | `Phase 10G` | `Logged` | **CRITICAL LEGAL SAFETY:** Chặn rủi ro bỏ sót quy hoạch địa phương. |
| **EXPORT-01** | Dự thảo / In / Xuất văn bản | Cán bộ muốn mẫu phiếu xuất Word (`phieu-ra-soat.docx`) được canh lề và trình bày đúng chuẩn thể thức văn bản hành chính quy định hơn. | `Medium / Suggestion` | `P2` | Cải tiến helper xuất Word ở các đợt cập nhật tiếp theo để đẹp đúng chuẩn thể thức, nhưng **vẫn bắt buộc phải giữ nguyên tiền tố `DU_THAO_GOI_Y_AI_` và cảnh báo AI**. | `Near Backlog` | `Logged` | Tối ưu hóa thể thức in ấn văn bản dự thảo. |
| **EXPORT-02** | Dự thảo / In / Xuất văn bản | Cán bộ mong muốn có một khu vực hoặc khung soạn thảo chỉnh sửa trực tiếp (`Draft Editor`) ngay trên giao diện trước khi tải file Word về máy. | `Suggestion` | `P3` | Đưa vào backlog dài hạn vì yêu cầu này đòi hỏi phát triển một module Rich-Text Editor và Preview chuyên sâu riêng biệt. | `Backlog` | `Deferred` | Tránh làm phình to phạm vi Phase 10G. |
| **LK-01** | Legal Knowledge | Trang Quản trị Tri thức pháp lý cần hiển thị nhãn hoặc dấu hiệu nhận biết rõ ràng hơn đối với phiên bản Prompts/Checklist đang kích hoạt (`Active`). | `Medium` | `P1` | Bổ sung huy hiệu/nhãn (`Badge`) **"Active Version"** nổi bật bằng màu sắc trực quan (xanh lá) ngay trên danh sách tri thức UI. | `Phase 10G` | `Logged` | Giúp quản trị viên kiểm soát nhanh phiên bản đang chạy. |
| **LK-02** | Legal Knowledge | Cán bộ quản trị muốn thiết lập quy trình duyệt nhiều cấp (`Approval Workflow`) trước khi cho phép kích hoạt (`Active`) một văn bản tri thức mới. | `Suggestion / High (Vận hành)` | `P3 / P2` | Đưa vào quy chế quản trị vận hành tổ chức (`Governance Manual`); chưa triển khai code lớn trong Phase 10G vì yêu cầu thay đổi schema/workflow. | `Backlog Governance` | `Deferred` | Kiểm soát rủi ro bằng quy chế vận hành con người. |
| **PROC-01** | Quy trình hành chính | Cán bộ muốn có mô hình phân chia trạng thái xử lý chi tiết hơn (ví dụ: `Đang thẩm định thực địa`, `Chờ bổ sung tài chính`...). | `Suggestion / Medium` | `P3` | Đưa vào backlog sau pilot vì việc thay đổi danh mục trạng thái (`Status Model`) sẽ ảnh hưởng đến logic luồng và CSDL. | `Backlog` | `Deferred` | Bảo toàn nguyên trạng `ProcedureCaseStatus`. |
| **PROC-02** | Quy trình hành chính | Cán bộ muốn có tính năng đính kèm (`Attachment`), tải lên và quản lý các file scan giấy tờ gốc (Sổ đỏ cũ, bản vẽ...) ngay trong hồ sơ. | `Suggestion` | `P3` | Đưa vào lộ trình nâng cấp các phase sau do đòi hỏi xây dựng mới module quản lý file đính kèm (`Storage Attachment Module`). | `Backlog` | `Deferred` | Không can thiệp schema/storage trong UAT. |
| **PROC-03** | Quy trình hành chính | Cán bộ muốn có thêm trường nhập liệu nhận xét, ý kiến xử lý tay (`Manual Comments / Review Notes`) của từng chuyên viên qua các khâu. | `Suggestion` | `P3` | Đưa vào backlog sau pilot vì cần bổ sung trường dữ liệu hoặc xây dựng module bình luận/ghi chú thẩm định chuyên biệt. | `Backlog` | `Deferred` | Giữ nguyên cấu trúc dữ liệu hồ sơ TTHC. |
| **UX-01** | Giao diện / Trải nghiệm | Cần sử dụng màu sắc, viền khung và phân vùng trực quan rõ ràng hơn để tách biệt 3 khu vực: **AI Review**, **Căn cứ pháp lý**, và **Xuất văn bản**. | `Medium` | `P1` | Cải thiện bố cục `Visual Grouping` giữa Tab AI Review, Legal Snapshot và khối Export Safety nhằm tạo luồng thị giác rành mạch cho cán bộ. | `Phase 10G` | `Logged` | Tăng độ rõ ràng, giảm nhầm lẫn thao tác UI. |
| **UX-02** | Giao diện / Trải nghiệm | Trang chi tiết hồ sơ cần có nút **“Quay lại danh sách” (`Back to Case List`)** hiển thị rõ ràng, dễ bấm hơn ở vị trí thuận tiện. | `Low` | `P2` | Bổ sung hoặc làm nổi bật nút quay lại ở thanh header của trang `ProcedureCaseDetail.tsx` để tối ưu thao tác điều hướng nhanh. | `Phase 10G` *(chỉnh nhỏ)* | `Logged` | Cải thiện UX thao tác hằng ngày. |
| **UX-03** | Giao diện / Trải nghiệm | Cán bộ muốn có các dòng hướng dẫn thao tác nhanh (`Quick Help Text / Instructions`) hiển thị trực tiếp ngay trên các màn hình chức năng chính. | `Suggestion` | `P2` | Thêm các dòng text hướng dẫn ngắn gọn, súc tích ngay tại đầu khu vực Danh sách hồ sơ, AI Review và Xuất văn bản. | `Phase 10G / Near Backlog` | `Logged` | Giúp người dùng mới tiếp cận dễ dàng mà không cần xem tài liệu. |
| **UX-04** | Giao diện / Trải nghiệm | Mong muốn bổ sung các chú thích nhanh (`Tooltips`) khi di chuột vào các thuật ngữ như “Legal Snapshot”, “AI Review”, “Draft Export”. | `Suggestion` | `P2` | Bổ sung icon dấu hỏi `(?)` kèm `Tooltip/Help text` giải thích thuật ngữ gọn gàng, bảo đảm không làm rối mắt hay phức tạp hóa UI. | `Phase 10G / Near Backlog` | `Logged` | Nâng cao hiểu biết của cán bộ về các tính năng mới. |
| **UX-05** | Giao diện / Trải nghiệm | Cán bộ muốn bố cục trang chi tiết được sắp xếp logic theo đúng tiến trình rà soát thực tế của chuyên viên từ trên xuống dưới. | `Medium` | `P1 / P2` | Rà soát và tinh chỉnh bố cục trang theo chuẩn luồng tư duy thụ lý: **Thông tin hồ sơ ➔ Checklist/Dữ liệu thửa đất ➔ AI Review ➔ Căn cứ pháp lý ➔ Dự thảo/Export**. | `Phase 10G` *(chỉnh layout nhỏ)* | `Logged` | Chuẩn hóa UX theo thói quen nghiệp vụ địa chính thực tế. |

---

## 4. Priority Grouping

Từ kết quả phân tích 22 phiếu tiếp nhận, Tổ Điều phối UAT thực hiện phân nhóm ưu tiên xử lý (`Priority Grouping`) thành 03 Nhóm hành động chiến lược để định hướng cho giai đoạn Phase 10G:

### 🔴 P1 – Fix before extended pilot / production preparation *(Nhóm ưu tiên cao nhất - Bắt buộc xử lý trước khi mở rộng pilot hoặc chuẩn bị production)*
Nhóm `P1` bao gồm **08 ý kiến trọng tâm (`Core Medium Issues`)** ảnh hưởng trực tiếp đến độ minh bạch lỗi, độ trực quan của kết quả AI, an toàn pháp lý địa phương và trải nghiệm điều hướng chính:
1. `CASELIST-01`: Làm rõ Error State trên danh sách hồ sơ khi API gặp sự cố, không hiển thị nhầm thành Empty State.
2. `DETAIL-02`: Bổ sung hướng dẫn rõ ràng trên trang chi tiết khi hồ sơ thiếu dữ liệu địa chính và chỉ dẫn bước xử lý tiếp theo.
3. `AI-01`: Cấu trúc lại format nhận xét AI thành 5 khối mạch lạc (Tóm tắt nhanh, Vấn đề cần kiểm tra, Rủi ro, Gợi ý hướng xử lý, Lưu ý cán bộ).
4. `AI-04`: Chuẩn hóa văn phong nhận xét AI theo phong cách tham mưu hành chính nhà nước thận trọng, khách quan.
5. `LAW-02`: **[CRITICAL SAFETY]** Bổ sung banner cảnh báo bắt buộc kiểm tra văn bản pháp lý địa phương, quy hoạch và kế hoạch sử dụng đất cấp huyện.
6. `LK-01`: Bổ sung huy hiệu/nhãn "Active Version" nổi bật trên giao diện quản trị Legal Knowledge.
7. `UX-01`: Tăng cường phân vùng trực quan (`Visual Grouping`) giữa AI Review, Căn cứ pháp lý và khu vực Xuất văn bản dự thảo.
8. `UX-05`: Tinh chỉnh bố cục trang chi tiết hồ sơ theo đúng luồng tư duy rà soát thực tế của chuyên viên địa chính.

---

### 🟡 P2 – Near-term improvement *(Nhóm cải tiến ngắn hạn - Thực hiện song song nếu phù hợp hoặc đưa vào backlog gần)*
Nhóm `P2` bao gồm **08 ý kiến nâng cao trải nghiệm (`Near-term UX & Clarity`)**, có thể tinh chỉnh nhanh trong Phase 10G (nếu thay đổi nhỏ gọn không chạm schema) hoặc lập kế hoạch ngay sau Golive:
1. `CASELIST-02`: Bổ sung tính năng sắp xếp (`Sort`) theo ngày mới nhất và theo trạng thái hồ sơ.
2. `AI-02`: Cải tiến hiển thị trích yếu điều khoản cụ thể khi dữ liệu prompt có sẵn (kiểm soát chặt chẽ chống AI tự suy diễn).
3. `AI-03`: Hiển thị nhãn thời điểm/lần phân tích (`Run Timestamp / Version #`) khi thực hiện Re-run AI Analysis.
4. `LAW-01`: Đề xuất tính năng bấm vào văn bản trong Legal Snapshot để xem chi tiết toàn văn (nếu dữ liệu sẵn có).
5. `EXPORT-01`: Cải tiến thể thức trình bày lề và bảng biểu mẫu Word (`phieu-ra-soat.docx`) đúng chuẩn hành chính hơn.
6. `UX-02`: Làm nổi bật nút "Quay lại danh sách" (`Back to Case List`) trên trang chi tiết hồ sơ.
7. `UX-03`: Thêm các dòng hướng dẫn thao tác nhanh (`Quick Help Text`) ngay trên các khu vực chức năng chính.
8. `UX-04`: Bổ sung tooltip giải thích ngắn gọn các thuật ngữ "Legal Snapshot", "AI Review", "Draft Export".

---

### 🟢 P3 – Backlog / later phase *(Nhóm hoãn / Đưa vào lộ trình nâng cấp dài hạn)*
Nhóm `P3` bao gồm **06 đề xuất mở rộng tính năng nghiệp vụ (`Long-term Feature Enhancements`)**, đòi hỏi phải mở rộng schema, tạo migration mới, xây dựng module chuyên biệt hoặc thay đổi quy trình vận hành phức tạp. Toàn bộ nhóm này được **khoanh vùng hoãn lại (`Deferred to Backlog`)**, tuyệt đối không can thiệp trong giai đoạn chuẩn bị UAT/Golive hiện tại:
1. `DETAIL-01`: Mong muốn có khu vực ghi chú nội bộ hoặc bảng lịch sử xử lý hồ sơ riêng biệt trên UI.
2. `EXPORT-02`: Đề xuất xây dựng khung soạn thảo/chỉnh sửa trực tiếp (`Rich-Text Draft Editor`) trước khi tải file Word.
3. `LK-02`: Đề xuất thiết lập quy trình duyệt nhiều cấp (`Approval Workflow`) trước khi Active văn bản tri thức pháp lý mới.
4. `PROC-01`: Đề xuất mở rộng mô hình phân chia danh mục trạng thái xử lý hồ sơ chi tiết hơn.
5. `PROC-02`: Đề xuất xây dựng module đính kèm (`Storage Attachment`), tải lên và quản lý file scan giấy tờ gốc.
6. `PROC-03`: Đề xuất thêm trường nhập liệu nhận xét, ý kiến xử lý tay của từng chuyên viên qua các khâu thẩm định.

---

## 5. Severity Assessment

Đánh giá tổng quan về mức độ nghiêm trọng (`Severity Assessment`) dựa trên 22 sự cố và ý kiến đã thu thập từ đợt kiểm thử Pilot UAT Phase 10F:

1. **Hoàn toàn không có Lỗi `Critical` (`Zero Critical Defects`):**
   * Hệ thống LegalFlow v2 khẳng định độ tin cậy kỹ thuật tuyệt đối về mặt kiến trúc lõi. Toàn bộ 4 vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) hoạt động chính xác theo đặc quyền `RBAC`.
   * **Không xảy ra hiện tượng sập nguồn CSDL, không rò rỉ quyền hạn nhạy cảm cho tài khoản `VIEWER`, và đặc biệt là 100% văn bản xuất ra đều giữ vững tiền tố an toàn `DU_THAO_GOI_Y_AI_...docx` kèm khung cảnh báo từ chối trách nhiệm.**
2. **Ghi nhận 01 sự cố mức độ `High/Medium` về An toàn Pháp lý Địa phương (`LAW-02`):**
   * Đây là điểm phát hiện quan trọng nhất của đợt UAT: Do Trợ lý AI được huấn luyện dựa trên khung pháp lý trung ương (Luật Đất đai 2024, các Nghị định/Thông tư hướng dẫn chung), hệ thống hiện chưa tự động bao quát được các văn bản pháp lý quy phạm đặc thù của từng địa phương, cũng như dữ liệu quy hoạch sử dụng đất và kế hoạch sử dụng đất hàng năm cấp huyện.
   * *Đánh giá:* Rủi ro này bắt buộc phải được xử lý ngay ở mức độ cao nhất bằng biện pháp bổ sung cảnh báo pháp lý minh bạch (`Mandatory Local Law Warning Banner`), nhắc nhở cán bộ phải đối chiếu quy hoạch địa phương và quy trình thẩm định nội bộ tại thời điểm thụ lý.
3. **Các ý kiến `Medium` tập trung vào Tối ưu Trải nghiệm và Độ rõ ràng (`UX, AI Formatting & Empty States`):**
   * Các phiếu `Medium` (`CASELIST-01`, `DETAIL-02`, `AI-01`, `AI-04`, `LK-01`, `UX-01`, `UX-05`) phản ánh đúng nhu cầu thực tiễn của cán bộ khi chuyển đổi từ thói quen làm việc thủ công sang nền tảng số. Cán bộ cần giao diện phân tách rõ ràng hơn giữa phần AI tham mưu và phần pháp lý snapshot, cần AI viết nhận xét mạch lạc theo chuẩn văn phong hành chính và cần thông báo lỗi rành mạch khi mất mạng.
4. **Các ý kiến `Suggestion` cho thấy sự hào hứng mở rộng tính năng (`High User Engagement`):**
   * Các đề xuất về sắp xếp, tooltip, nút copy nhanh, ghi chú nội bộ hay đính kèm file scan chứng tỏ cán bộ rất quan tâm và mong muốn LegalFlow v2 trở thành một bàn làm việc toàn diện (`All-in-One Digital Workspace`) cho Phòng Thẩm định. Đây là nguồn dữ liệu quý giá để quy hoạch lộ trình nâng cấp sau khi hệ thống đi vào vận hành chính thức.

---

## 6. Go / No-Go Recommendation

Dựa trên kết luận chẩn đoán không có lỗi `Critical` nhưng tồn tại 08 ý kiến `P1` (đặc biệt là yêu cầu chuẩn hóa format AI, làm rõ Error State và bổ sung cảnh báo quy hoạch địa phương), Điều phối viên UAT và Trợ lý kỹ thuật ra quyết định phán quyết điều hướng chính thức:

### ➔ PHÁN QUYẾT CHÍNH THỨC: **`GO TO ISSUE FIXES` (CHUYỂN TIẾP SANG GIAI ĐOẠN SỬA LỖI VÀ TỐI ƯU HÓA UAT)**

#### Lý do phán quyết (`Justification`):
1. **Chưa có lỗi `Critical` phải dừng toàn bộ (`No Show-Stoppers`):** Nền tảng kỹ thuật và luồng an toàn pháp lý cốt lõi hoạt động hoàn hảo, do đó không có lý do gì để hủy bỏ hay dừng chương trình Pilot UAT (`No-Go`).
2. **Cần xử lý triệt để nhóm `P1` trước khi mở rộng Pilot hoặc Production (`Must Fix P1 Before Prod Prep`):** Để đảm bảo cán bộ khi sử dụng trên quy mô lớn không bị nhầm lẫn giữa lỗi mạng và trống hồ sơ (`CASELIST-01`), dễ dàng đọc nhận xét AI qua 5 khối mạch lạc (`AI-01`), và được nhắc nhở đầy đủ về việc rà soát quy hoạch sử dụng đất địa phương (`LAW-02`), hệ thống **bắt buộc phải đi qua một bước tinh chỉnh tối ưu (`Issue Fixes`)**.
3. **Chưa đủ điều kiện tiến thẳng vào chuẩn bị Production (`Not Ready for Controlled Prod Prep yet`):** Việc tiến thẳng sang giai đoạn chuẩn bị Production (`Controlled Production Deployment Preparation`) ngay lúc này là nóng vội và bỏ qua các ý kiến đóng góp P1 hợp lý của cán bộ, tiềm ẩn nguy cơ giảm trải nghiệm người dùng khi vận hành thực tế.

---

## 7. Proposed Next Phase

Căn cứ vào phán quyết `GO TO ISSUE FIXES`, chúng tôi chính thức đề xuất lộ trình tiếp theo cho hệ thống LegalFlow v2:

### ➔ Đề xuất Lộ trình: **`Phase 10G: Pilot UAT Issue Fixes & Stabilization`**

#### Phạm vi công việc đề xuất cho Phase 10G (`Boundary & Scope of Phase 10G`):
Để bảo đảm tuân thủ nguyên tắc an toàn, không làm xáo trộn kiến trúc đã ổn định và hoàn thành mục tiêu khắc phục lỗi nhanh gọn, Phase 10G sẽ tuân thủ nghiêm ngặt **07 hạng mục được phép làm (`In-Scope`)** và **05 ràng buộc không được làm (`Out-of-Scope / Prohibited`)**:

##### ✅ Các hạng mục được phép thực hiện trong Phase 10G (`IN-SCOPE FIXES & OPTIMIZATIONS`):
1. **Sửa Error / Empty State (`CASELIST-01`, `DETAIL-02`):** Làm rõ thông báo lỗi API trên danh sách hồ sơ và bổ sung khối hướng dẫn thao tác khi hồ sơ thiếu dữ liệu địa chính.
2. **Cải thiện Bố cục & Phân vùng UI (`UX-01`, `UX-05`):** Tăng cường phân vùng trực quan giữa Tab AI Review, Căn cứ pháp lý và section Xuất văn bản dự thảo theo đúng luồng tư duy thụ lý thực tế.
3. **Cải cấu trúc & Văn phong AI Output (`AI-01`, `AI-04`):** Chuẩn hóa Prompt để tách nhận xét AI thành 5 khối mạch lạc (Tóm tắt nhanh, Vấn đề cần kiểm tra, Rủi ro, Gợi ý hướng xử lý, Lưu ý cán bộ) và bám sát văn phong tham mưu hành chính nhà nước.
4. **Bổ sung Cảnh báo Pháp lý Địa phương & Quy hoạch (`LAW-02`):** Hiển thị rõ giới hạn dữ liệu trung ương và bổ sung banner cảnh báo nổi bật yêu cầu cán bộ bắt buộc kiểm tra văn bản địa phương, quy hoạch/kế hoạch sử dụng đất cấp huyện.
5. **Hiển thị Active Legal Version rõ ràng (`LK-01`):** Bổ sung huy hiệu/nhãn "Active Version" trực quan trên màn hình quản trị Legal Knowledge.
6. **Tinh chỉnh UX nhỏ gọn (`UX-02`, `UX-03`, `UX-04`, `CASELIST-02`):** Bổ sung nút quay lại nổi bật, help text hướng dẫn nhanh, tooltip giải thích thuật ngữ và cơ chế sort danh sách hồ sơ nếu thực hiện nhỏ gọn trên UI.
7. **Bảo toàn 100% An toàn Xuất văn bản & Phân quyền (`Hardened Safety Maintenance`):** Tiếp tục duy trì tuyệt đối tiền tố `DU_THAO_GOI_Y_AI_...docx`, khung cảnh báo từ chối trách nhiệm và phân quyền `Read-Only` cho tài khoản `VIEWER`.

##### ❌ Các ràng buộc tuyệt đối KHÔNG thực hiện trong Phase 10G (`OUT-OF-SCOPE / STRICTLY PROHIBITED`):
1. **KHÔNG mở rộng cấu trúc CSDL (`No Schema / Migration Changes`):** Tuyệt đối không thêm bảng, thêm cột hay thay đổi `prisma/schema.prisma` và không chạy migration mới.
2. **KHÔNG phát triển module lớn chưa thiết kế (`No Heavy Modules`):** Không xây dựng module đính kèm file scan (`PROC-02`), module bình luận/ghi chú lịch sử thẩm định (`DETAIL-01`, `PROC-03`), module duyệt nhiều cấp trước khi Active tri thức (`LK-02`) hay module Rich-Text Editor trước khi xuất Word (`EXPORT-02`).
3. **KHÔNG thay đổi mô hình trạng thái nghiệp vụ (`No Status Model Mutation`):** Không can thiệp hay chia nhỏ danh mục trạng thái hồ sơ `ProcedureCaseStatus` (`PROC-01`).
4. **KHÔNG chỉnh sửa biến môi trường hay CSDL thật (`No Env/DB Tampering`):** Không chỉnh sửa `.env`, không thay đổi cấu hình máy chủ và không can thiệp CSDL thủ công.
5. **KHÔNG tự ký hay ban hành văn bản (`Zero Auto-Dispatch/Signature`):** Không tự động hóa ký duyệt hay phát hành bất kỳ văn bản nào ra ngoài công chúng.

---

## 8. Safety Confirmation

> [!CAUTION]
> **TƯYÊN BỐ CAM KẾT VÀ XÁC NHẬN AN TOÀN PHÁP LÝ SAU CHẨN ĐOÁN UAT (`POST-TRIAGE SAFETY CONFIRMATION`):**
>
> Trong toàn bộ quá trình thực thi Phase 10F và định hướng cho Phase 10G tiếp theo, Điều phối viên UAT và Trợ lý kỹ thuật Antigravity đồng cam kết xác nhận **06 Nguyên tắc An toàn Pháp lý Bất khả xâm phạm (`Absolute Legal Safety Enforcements`)**:
>
> 1. **KHÔNG dùng văn bản AI để ban hành thật (`Zero Real-world Dispatch Verified`):** Toàn bộ các ý kiến, bản thảo phiếu rà soát Word/PDF và nhận xét AI ghi nhận trong phiên kiểm thử UAT Phase 10F chỉ đóng vai trò tham khảo nội bộ phục vụ đánh giá chất lượng phần mềm. Tuyệt đối không khuyến nghị hay cho phép sử dụng để ký ban hành chính thức có giá trị pháp lý ngoài đời thực.
> 2. **KHÔNG tự ký (`Zero Auto-Signature Verified`):** Khẳng định 100% file văn bản Word (`DU_THAO_GOI_Y_AI_...docx`) và PDF sinh ra từ hệ thống chỉ có khung chữ ký trống, đòi hỏi sự thẩm định kỹ lưỡng và chữ ký trực tiếp của chuyên viên thụ lý cùng Lãnh đạo Phòng Thẩm định.
> 3. **KHÔNG tự gửi (`Zero Auto-Dispatch Verified`):** Hệ thống không phát hành, không tự động gửi email, SMS, Zalo hay tự động chuyển giao kết quả thẩm định cho người nộp hồ sơ hay bất kỳ cơ quan bên ngoài nào.
> 4. **KHÔNG sửa dữ liệu ngoài kiểm soát (`Zero Production Mutation Verified`):** Công tác kiểm thử và tổng hợp chẩn đoán sự cố chỉ diễn ra trên bộ 15 hồ sơ mẫu thuộc CSDL Staging (`legalflow_test`). Không can thiệp, không làm vấy bẩn và không thao tác trực tiếp trên CSDL Production thực tế.
> 5. **TRỢ LÝ AI CHỈ LÀ GỢ Ý (`AI is Advisory Only Enforced`):** Trợ lý AI trên LegalFlow v2 là công cụ hỗ trợ tổng hợp thông tin và đề xuất khoản luật áp dụng nhằm tiết kiệm thời gian, hoàn toàn không có thẩm quyền kết luận phán quyết thay con người.
> 6. **CÁN BỘ PHẢI KIỂM TRA TOÀN DIỆN CĂN CỨ PHÁP LÝ (`Mandatory Human Verification Enforced`):** Cán bộ thụ lý và Lãnh đạo phòng bắt buộc phải đối chiếu, kiểm chứng kết quả gợi ý của AI với:
>    * Căn cứ pháp lý trung ương hiện hành (Luật Đất đai 2024 và các văn bản hướng dẫn);
>    * **Căn cứ quy phạm pháp luật đặc thù do địa phương ban hành (`Local Legal Provisions`);**
>    * **Thông tin Quy hoạch sử dụng đất và Kế hoạch sử dụng đất hàng năm cấp huyện (`Land Use Planning & Zoning`);**
>    * Quy trình thụ lý nội bộ và hồ sơ giấy gốc thực tế của người sử dụng đất tại thời điểm xử lý.
