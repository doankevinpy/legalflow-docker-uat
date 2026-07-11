# LEGALFLOW V2 - PHASE 11A
# ROLE-BASED USER GUIDE

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11A Standard`  
**Ngày ban hành Hướng dẫn:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL ROLE-BASED USER GUIDE`** *(Sổ tay Hướng dẫn Thao tác theo Vai trò Phân quyền)*

---

## 1. Purpose

Tài liệu này là Sổ tay Hướng dẫn Sử dụng theo từng Vai trò Phân quyền (`Role-Based User Guide` - Phase 11A) của hệ thống LegalFlow V2. Sổ tay cung cấp chỉ dẫn thao tác nghiệp vụ chi tiết, chuẩn xác và riêng biệt cho 5 vai trò người dùng cốt lõi: Quản trị viên (`ADMIN`), Lãnh đạo Phòng (`MANAGER`), Chuyên viên Thụ lý (`STAFF`), Cán bộ Tra cứu (`VIEWER`) và Kỹ sư Vận hành (`Technical Operator`). Tài liệu hệ thống hóa các thao tác hàng ngày (`Common User Tasks`), thiết lập bảng ranh giới quyền hạn, đồng thời cảnh báo các lỗi thói quen thường gặp (`Common Mistakes to Avoid`) nhằm bảo đảm người dùng khai thác tối đa hiệu quả công cụ mà không vi phạm kỷ luật AI Governance hay an toàn bảo mật hạ tầng.

---

## 2. ADMIN Guide

Hướng dẫn thao tác và quy chế quản trị tối cao dành cho vai trò **Quản trị viên Hệ thống (`ADMIN`)**:
1. **Quản trị &amp; Giám sát Toàn diện (`System Administration`):** Chịu trách nhiệm quản lý danh sách tài khoản người dùng, giám sát các kết nối API, phân bổ quyền hạn `RBAC` và theo dõi nhật ký hệ thống `Audit Log`.
2. **Kiểm tra Cơ sở Tri thức `Legal Knowledge Base` (`LK-01`):** Định kỳ kiểm tra danh mục văn bản pháp luật lưu trữ trong cơ sở tri thức, bảo đảm tính toàn vẹn và không bị sai lệch cấu trúc dữ liệu.
3. **Theo dõi Phiên bản Luật Hiệu lực (`Active Version Monitoring`):** Giám sát huy hiệu hiệu lực pháp lý (`v2.0-2024-LAND-LAW`). Khi có thay đổi luật mới, ADMIN phải tuân thủ quy trình kiểm duyệt nhiều bước (`BL-008`), tuyệt đối **không tự ý active hay rollback** phiên bản luật nếu chưa có sự đồng ý của Hội đồng Thẩm định Pháp chế.
4. **Rà soát Phân quyền `RBAC` (`Permission Auditing`):** Hàng tuần kiểm tra danh sách người dùng thuộc các nhóm Wave 1/Wave 2, bảo đảm các tài khoản `STAFF` và `VIEWER` không bị gắn nhầm quyền `ADMIN` hoặc `MANAGER`.
5. **KỶ LUẬT HẠ TẦNG BẮT BUỘC (`Strict DBA Safeguards`):**
   * 🛑 **Không tự ý restore hoặc reset database (`migrate reset` / `pg_restore`):** Mọi thao tác can thiệp cơ sở dữ liệu `legalflow_prod` đều phải được Lãnh đạo Đơn vị phê duyệt bằng văn bản và có sự chứng kiến của Quản trị viên Dự án.
   * 🛑 **Không can thiệp bảng dữ liệu trực tiếp:** Tuyệt đối không dùng công cụ quản trị DB để sửa xóa tài khoản hay thay đổi trạng thái hồ sơ thụ lý của công dân.

---

## 3. MANAGER Guide

Hướng dẫn thao tác và quy tắc thẩm định chuyên môn dành cho vai trò **Lãnh đạo Phòng Chuyên môn &amp; Pháp chế (`MANAGER`)**:
1. **Xem &amp; Phân loại Hồ sơ Thụ lý (`Case Supervision`):** Truy cập Tab 1 Danh sách hồ sơ (`CASELIST-02`), sử dụng bộ lọc tìm kiếm nhanh theo chuyên viên thụ lý hoặc lĩnh vực TTHC để rà soát tiến độ xử lý của toàn phòng.
2. **Rà soát Kết quả AI Thẩm định (`AI Review Audit` - Khối 3.1):** Khi xem Tab 3 chi tiết hồ sơ, Lãnh đạo phòng rà soát kỹ lời khuyên tham mưu của AI. Nếu AI gợi ý "Cần bổ sung" hay "Từ chối", Lãnh đạo cần đối chiếu lý do cụ thể với tài liệu đính kèm tại Tab 4.
3. **Kiểm tra Legal Snapshot (`LK-01`, `LAW-02` - Khối 3.2):** Kiểm tra huy hiệu phiên bản luật `v2.0-2024-LAND-LAW` gắn trên hồ sơ. **Đặc biệt chú ý rà soát khung viền vàng `LAW-02`**, yêu cầu chuyên viên báo cáo rõ kết quả đối chiếu quy hoạch đất cấp huyện và quy trình nội bộ tỉnh trước khi ký duyệt.
4. **Giám sát Bản dự thảo Xuất văn bản (`Export Draft Supervision` - Khối 3.3):** Kiểm tra các file Word (`.docx`) do chuyên viên trình lên. Khẳng định văn bản phải mang tiền tố `DU_THAO_GOI_Y_AI_` lúc xuất ra, sau đó chuyên viên phải chỉnh sửa thể thức chuẩn hành chính và xóa watermark trước khi trình Lãnh đạo ký nháy.
5. **Quán triệt Kỷ luật AI Governance (`Governance Enforcement`):** Thường xuyên nhắc nhở chuyên viên trong phòng **trợ lý AI không phải là kết luận cuối cùng**. Cán bộ nào sao chép nguyên văn lời khuyên AI mà không rà soát lại căn cứ sẽ chịu trách nhiệm kỷ luật chuyên môn.
6. **Theo dõi Sự cố &amp; Góp ý (`Issue & Feedback Tracking`):** Phối hợp với Trợ lý UAT rà soát Sổ hỗ trợ vào `16:30 PM` hàng ngày, tổng hợp các nguyện vọng cải tiến UX của anh em chuyên viên để gửi lên Ban Quản lý Dự án (`Phase 11 Backlog`).

---

## 4. STAFF Guide

Hướng dẫn thao tác nghiệp vụ hàng ngày dành cho vai trò **Chuyên viên Một cửa &amp; Thụ lý Phòng Chuyên môn 2 (`STAFF`)**:
1. **Mở Danh sách &amp; Sử dụng Bộ lọc (`CASELIST-02`):** Đăng nhập vào hệ thống, tại màn hình đầu tiên sử dụng bộ lọc Lĩnh vực (`Đất đai / Xây dựng`) và Sắp xếp (`receivedAt DESC`) để chọn hồ sơ mới được phân công thụ lý.
2. **Xem Chi tiết &amp; Điều hướng 7 Tab (`UX-05`):** Nhấp vào mã hồ sơ để mở giao diện chi tiết. Di chuyển tuần tự qua 7 tab: xem thông tin chung (Tab 1) &rarr; kiểm tra checklist thủ tục (Tab 2) &rarr; kiểm tra tài liệu scan đính kèm (Tab 4) &rarr; xem tình trạng nộp thuế phí (Tab 5).
3. **Chạy &amp; Xem AI Review (`AI-01/04` - Khối 3.1):** Chuyển sang Tab 3, bấm nút `🤖 Chạy AI rà soát` (hoặc xem kết quả nếu hệ thống đã chạy trước). Đọc cẩn thận lời khuyên tham mưu của AI đối với từng tiêu chí thành phần.
4. **Tuân thủ Cảnh báo AI &amp; Legal Snapshot (`LAW-02`):** Luôn đọc kỹ khung viền vàng *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"*. Khẳng định hiệu lực huy hiệu Khối 3.2, và **tự tay tra cứu đối chiếu bản đồ quy hoạch sử dụng đất cấp huyện, quy trình nội bộ UBND tỉnh** ngoài E-Office.
5. **Xuất Bản Dự thảo &amp; Chỉnh sửa (`SMK-06` - Khối 3.3):** Khi đủ căn cứ, bấm nút xuất file Word `.docx` hoặc PDF từ Khối 3.3. File tải về sẽ mang tên `DU_THAO_GOI_Y_AI_...docx`. Chuyên viên mở file trên MS Word, chỉnh sửa câu chữ, chuẩn hóa căn lề, xóa hình nền mờ nháp và hoàn thiện văn bản trước khi trình Lãnh đạo.
6. **Báo lỗi khi Output chưa rõ (`Active Troubleshooting`):** Nếu AI Khối 3.1 phân tích sai tài liệu hoặc trả lời chung chung, chuyên viên không tự ý đoán mà phải chụp ảnh màn hình, ghi lại mã hồ sơ và thông báo cho Trợ lý UAT theo quy trình hỗ trợ 6 bước (`MOD-09`).

---

## 5. VIEWER Guide

Hướng dẫn thao tác và giới hạn thẩm quyền dành cho vai trò **Cán bộ Tra cứu &amp; Giám sát viên (`VIEWER`)**:
1. **Xem Thông tin được phép (`Read-only Access`):** Tài khoản `VIEWER` được quyền tra cứu danh sách hồ sơ trên Tab 1 (`CASELIST-02`), xem thông tin chi tiết các tab và tra cứu toàn văn điều luật trong `Legal Knowledge Base` (`LK-01`).
2. **Tuân thủ Giới hạn Thao tác Nhạy cảm (`Restricted Actions`):** `VIEWER` bị khóa hoàn toàn quyền thao tác cập nhật, thêm mới hay thay đổi trạng thái hồ sơ; không được phân quyền chỉnh sửa checklist thẩm định hay ghi chú nội bộ.
3. **Khóa chức năng Chạy AI &amp; Xuất Văn bản (`canAct: false` - `SMK-08`):** Tại Tab 3, nút chạy AI Khối 3.1 và nút xuất file Word/PDF Khối 3.3 được hệ thống tự động khóa vô hiệu hóa (*Disabled*) kèm thẻ thông báo đỏ nhắc nhở giới hạn thẩm quyền `VIEWER`.
4. **Báo lại khi thấy Nút Vượt quyền (`Privilege Escalation Alert`):** Nếu trong quá trình sử dụng phát hiện lỗi UI cho phép tài khoản `VIEWER` bấm được vào các nút xuất văn bản hay chạy AI review, cán bộ phải chụp màn hình và báo cáo khẩn cấp cho Kỹ sư Vận hành để kiểm tra lỗ hổng bảo mật `RBAC`.

---

## 6. Technical Operator Guide

Hướng dẫn thao tác kỹ thuật trực chiến và bảo trì hệ thống dành cho vai trò **Kỹ sư Vận hành &amp; DevOps (`Technical Operator`)**:
1. **Chạy Kiểm tra Sức khỏe Định kỳ (`Daily Health-check Audit`):** Vào lúc `08:00 AM` và `16:30 PM` hàng ngày, mở PowerShell tại thư mục gốc và chạy script `.\scripts\health-check.ps1` để rà soát toàn diện 4 dịch vụ (`Postgres, MinIO, API, Frontend`).
2. **Giám sát Docker Container (`Container Supervision`):** Chạy lệnh `docker ps` để rà soát trạng thái (`STATUS`). Khẳng định container `legalflow_postgres` luôn duy trì `Up healthy` và `legalflow_caddy` định tuyến mượt mà. Phối hợp SysAdmin xử lý lỗi xung đột cổng 9000 MinIO (`EXP-ENV-01`).
3. **Kiểm tra &amp; Bảo quản Backup (`pg_dump Maintenance`):** Giám sát lịch sao lưu cơ sở dữ liệu `pg_dump` định kỳ lưu tại thư mục `backups/`. Khẳng định toàn bộ file `.sql` dump (`~951 KB`) luôn ở trạng thái `untracked / ignored`, **tuyệt đối không commit file backup vào Git**.
4. **Ghi nhận &amp; Phân loại Sự cố (`Issue Register Maintenance`):** Tiếp nhận báo cáo vướng mắc từ Trợ lý UAT, phân loại theo 5 mức độ (`P0 -> Suggestion`), cập nhật vào Sổ theo dõi sự cố mở rộng (`EXPANDED_USER_SUPPORT...`).
5. **KỶ LUẬT VẬN HÀNH PRODUCTION BẮT BUỘC (`Zero Auto-Execution`):**
   * 🛑 **Không sửa code/schema trên Production (`No Live Editing`):** Tuyệt đối không chỉnh sửa trực tiếp mã nguồn, `.env` hay chạy lệnh migration trên máy chủ thật khi chưa qua quy trình phát triển và phê duyệt Phase 11.
   * 🛑 **Không can thiệp, restore hay xóa dữ liệu DB:** Khẳng định quyền tối thượng của dữ liệu thật, tuân thủ nguyên tắc `read-only monitoring` trong ca trực.

---

## 7. Common User Tasks

Bảng quy trình chuẩn hóa các thao tác nghiệp vụ cốt lõi hàng ngày được gán cho từng vai trò người dùng (`Common User Tasks Workflow Table`):

| Task ID | Common Operational Task | Assigned Roles | Standardized Execution Steps (`SOP Workflow`) | Expected System Result | Notes & Governance Check |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **TSK-01** | **Đăng nhập Hệ thống &amp; Quản lý Phiên (`Auth`)** | `All Roles` (`ADMIN -> VIEWER`) | 1. Mở trình duyệt vào `http://kevindoan-legalflow.local:8080`.<br/>2. Nhập username và password hợp lệ.<br/>3. Bấm nút Đăng nhập. | Trả về token hợp lệ, tự động điều hướng vào màn hình Danh sách hồ sơ theo đúng quyền `RBAC`. | Không chia sẻ mật khẩu hay duy trì tự động đăng nhập trên máy công cộng. |
| **TSK-02** | **Tra cứu Danh sách &amp; Lọc Hồ sơ TTHC (`CASELIST-02`)** | `STAFF` / `MANAGER` / `VIEWER` | 1. Tại Tab 1, chọn Lĩnh vực (`Đất đai / Xây dựng`).<br/>2. Chọn Sắp xếp `receivedAt DESC`.<br/>3. Nhập số hồ sơ vào ô tìm kiếm nếu cần. | Danh sách làm mới tức thì, hiển thị đúng các hồ sơ mới tiếp nhận, không treo tải trang. | Giúp cán bộ thụ lý phân loại công việc đầu giờ mỗi ca làm việc. |
| **TSK-03** | **Mở Chi tiết &amp; Rà soát 7 Tab (`UX-05`)** | `STAFF` / `MANAGER` / `VIEWER` | 1. Nhấp chuột vào mã hồ sơ trên danh sách.<br/>2. Lần lượt nhấp qua 7 tab: Tab 1 &rarr; Tab 2 &rarr; Tab 4 &rarr; Tab 5. | Thông tin chuyển tab mượt mà dưới `1s`, giữ trọn vẹn dữ liệu chủ sử dụng và tài liệu đính kèm. | Đảm bảo không bỏ sót thông tin hồ sơ trước khi thẩm định. |
| **TSK-04** | **Chạy AI Review &amp; Đọc Tham mưu Khối 3.1 (`AI-01`)** | `STAFF` / `MANAGER` | 1. Chuyển sang Tab 3 (AI Review &amp; Export Draft).<br/>2. Bấm nút `🤖 Chạy AI rà soát` (nếu chưa chạy).<br/>3. Đọc kỹ lời khuyên và viền vàng AI warning. | Khối 3.1 trả về gợi ý chi tiết cho từng tiêu chí, văn phong tham mưu khách quan, không kết luận thay. | Cán bộ bắt buộc tự rà soát và chịu trách nhiệm pháp lý cao nhất. |
| **TSK-05** | **Kiểm tra Legal Snapshot Khối 3.2 (`LAW-02`)** | `STAFF` / `MANAGER` / `Legal Reviewer` | 1. Quan sát Khối 3.2 bên dưới phiếu AI.<br/>2. Kiểm tra huy hiệu `v2.0-2024-LAND-LAW` và ngày trích xuất.<br/>3. **Rà soát thủ công 3 căn cứ quy hoạch địa phương (`LAW-02`).** | Khẳng định phiên bản luật đang áp dụng. Khung vàng nhắc nhở đối chiếu bản đồ đất huyện ngoài E-Office. | Chốt chặn then chốt bảo vệ an toàn pháp lý địa phương. |
| **TSK-06** | **Xuất Bản Dự thảo Word `.docx` (`SMK-06`)** | `STAFF` / `MANAGER` | 1. Di chuyển xuống Khối 3.3.<br/>2. Bấm nút `📄 Tải bản dự thảo Word (.docx)`.<br/>3. Lưu file về máy tính làm việc. | File tải về mang tiền tố `DU_THAO_GOI_Y_AI_...docx`, bên trong có watermark nháp tham khảo nội bộ. | Không phát hành trực tiếp bản nháp AI chưa qua chỉnh sửa. |
| **TSK-07** | **Tra cứu Tri thức Pháp lý `Knowledge Base` (`LK-01`)** | `All Roles` (`ADMIN -> VIEWER`) | 1. Bấm vào menu `Legal Knowledge Base` trên thanh điều hướng.<br/>2. Nhập từ khóa (tách thửa, chuyển nhượng) vào ô tìm kiếm.<br/>3. Nhấp xem nội dung điều luật từ Luật Đất đai 2024. | Trả về danh sách điều/khoản chính xác dưới `50ms`, hiển thị rõ tình trạng hiệu lực văn bản. | Thư viện pháp lý chuẩn xác cho toàn cơ quan tra cứu. |
| **TSK-08** | **Báo cáo Lỗi &amp; Góp ý (`Issue Intake`)** | `All Roles` (`ADMIN -> VIEWER`) | 1. Chụp ảnh màn hình lỗi (có thời gian và URL).<br/>2. Ghi rõ mã hồ sơ, thao tác vừa làm và kết quả kỳ vọng.<br/>3. Gửi cho Trợ lý UAT trước `16:30 PM` hàng ngày. | Sự cố được tiếp nhận, phân loại Triage vào Sổ theo dõi (`EXPANDED_USER_SUPPORT...`). | Giúp lực lượng kỹ thuật kịp thời khắc phục và cập nhật Sổ Backlog Phase 11. |

---

## 8. Common Mistakes to Avoid

Bảng rà soát 6 sai lầm thói quen thường gặp cần tuyệt đối tránh (`6 Critical Operational Mistakes to Avoid`):
1. 🛑 **Hiểu nhầm AI Khối 3.1 là kết luận pháp lý cuối cùng:** Cán bộ lười đối chiếu, sao chép nguyên văn lời khuyên "Hợp lệ" của AI vào phiếu trình lãnh đạo mà không rà soát lại tài liệu scan Tab 4. *(Hậu quả: Sai lệch pháp lý, cán bộ chịu trách nhiệm hoàn toàn trước pháp luật)*.
2. 🛑 **Sử dụng file Export Khối 3.3 như văn bản đã ban hành (`SMK-06`):** Cán bộ tải file Word `DU_THAO_GOI_Y_AI_...docx` rồi in ra ngay trình ký Lãnh đạo hoặc gửi công dân mà không chỉnh sửa câu chữ, không chuẩn hóa thể thức hành chính và không xóa watermark nháp. *(Hậu quả: Vi phạm nghiêm trọng quy chế văn thư và Nghị định 30)*.
3. 🛑 **Bỏ qua lời nhắc Legal Snapshot Warning (`v2.0-2024-LAND-LAW`):** Cán bộ không để ý ngày trích xuất dữ liệu Khối 3.2, áp dụng nhầm các điều khoản từ các Luật Đất đai cũ đã hết hiệu lực pháp lý (như Luật Đất đai 2013). *(Hậu quả: Tham mưu sai căn cứ luật hiện hành)*.
4. 🛑 **Bỏ qua kiểm tra Quy định Địa phương &amp; Quy hoạch Đất huyện (`LAW-02`):** Cán bộ chỉ nhìn vào căn cứ Luật Đất đai trung ương do Khối 3.2 cung cấp mà không tự kiểm tra bản đồ quy hoạch sử dụng đất huyện và quy trình nội bộ UBND tỉnh. *(Hậu quả: Cấp phép/thẩm định trái với quy hoạch và kế hoạch sử dụng đất của địa phương)*.
5. 🛑 **Chia sẻ File Backup `pg_dump` hoặc Bí mật Nhạy cảm (`DBA Security`):** Kỹ sư hoặc Quản trị viên vô ý sao chép file `.sql` trong `backups/` ra máy cá nhân, gửi qua Zalo/Email hoặc commit file backup có chứa thông tin công dân vào kho chứa Git (`untracked violation`). *(Hậu quả: Lộ lọt dữ liệu cá nhân nhạy cảm, vi phạm an ninh mạng)*.
6. 🛑 **Sử dụng sai Tài khoản hoặc Vượt quyền (`RBAC Abuse`):** Cán bộ chia sẻ mật khẩu tài khoản `MANAGER` cho chuyên viên sử dụng, hoặc tài khoản `VIEWER` cố tình dùng công cụ phái sinh để can thiệp vào các API khóa Khối 3.3. *(Hậu quả: Mất dấu vết kiểm toán `Audit Log`, vi phạm phân quyền hệ thống)*.

---
*Sổ tay Hướng dẫn Thao tác theo Vai trò Phân quyền (Role-Based Guide) được lập tự động từ kết quả chuẩn hóa Phase 10Q.*
