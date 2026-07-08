# LEGALFLOW V2 - PHASE 10E
# PILOT UAT LIVE CHECKLIST

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.3-pilot-uat-dry-run-execution-readiness` ➔ Phase 10E  
**Chuyên trách theo dõi:** Điều phối viên UAT & Kỹ sư ghi nhật ký (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Live Checklist** là Bảng kiểm tra và ghi chép nhật ký trực tiếp ngay tại phòng họp (`Live Execution Scribe Checklist`) dành cho Điều phối viên và Kỹ sư ghi nhật ký trong buổi Pilot UAT thực tế với các Cán bộ Phòng Thẩm định.
Checklist giúp theo dõi chặt chẽ tình trạng kỹ thuật tức thời của môi trường, rà soát từng bước thao tác của 13 kịch bản nghiệp vụ bắt buộc, thu thập phản hồi UX trực tiếp từ cán bộ và ra phán quyết xử lý nhanh (`Immediate Decision`) ngay tại phiên làm việc.

---

## 2. Environment Check

Bảng rà soát nhanh 06 tiêu chí trạng thái kỹ thuật môi trường trước giờ cán bộ thao tác (`Pre-Flight Live Environment Verification`):

| Check Item (`Hạng mục rà soát`) | Expected Result (`Phản hồi kỳ vọng`) | Actual Result (`Ghi nhận trực tiếp`) | Status | Notes / Verification Command |
| :--- | :--- | :--- | :---: | :--- |
| **1. Frontend UI Accessibility** | Truy cập `http://kevindoan-legalflow.local:8080` hoặc `http://localhost:5173` tải giao diện mượt mà < 2 giây. | Trang đăng nhập LegalFlow v2 hiển thị rõ ràng, đầy đủ logo và form nhập liệu. | `[PASS]` | Kiểm chứng trực tiếp qua trình duyệt web trên máy tính của cán bộ test. |
| **2. Backend API Health** | Gọi `http://localhost:3000/auth/login` (OPTIONS/POST) phản hồi HTTP status hợp lệ (200/201/204/401). | Backend API Server (`Port 3000`) phản hồi ổn định, không bị timeout hay 502 Bad Gateway. | `[PASS]` | *[Nếu test trên máy host có Antigravity, đã áp dụng workaround khởi động riêng `start-backend.ps1`]* |
| **3. Database Running Status** | Container `legalflow_postgres` ở trạng thái `running (healthy)`, kết nối TCP port `5432` mở. | `docker ps` hiển thị `legalflow_postgres` hoạt động liên tục `Up (healthy)`. | `[PASS]` | CSDL PostgreSQL sẵn sàng cho luồng truy vấn của ORM Prisma. |
| **4. Login Authentication** | Tài khoản `admin_uat`, `manager_uat`, `staff_uat_01` đăng nhập thành công, nhận JWT Token và chuyển hướng đúng. | Hệ thống cấp phát JWT hợp lệ, điều hướng đúng theo đặc quyền `role` của từng người dùng. | `[PASS]` | Kiểm tra thực tế lần lượt với 4 vai trò test. |
| **5. Git Baseline Verification** | Repository ở nhánh `main`, commit HEAD khớp chính xác với tag `v2.10.3-pilot-uat-...` (hoặc `v2.10.2`). | `git log -1` và `git status` xác nhận working tree clean, đúng phiên bản mã nguồn đã kiểm chứng. | `[PASS]` | Bảo đảm không có thay đổi mã nguồn bẩn phát sinh ngay trước giờ test. |
| **6. Pre-test Database Dump** | Bản sao lưu CSDL `pre_pilot_uat_dump.sql` đã tồn tại an toàn trên ổ cứng máy chủ test. | File backup có dung lượng hợp lệ (> 0 KB), sẵn sàng khôi phục ngay lập tức nếu cần. | `[PASS]` | Tuân thủ nguyên tắc an toàn dữ liệu số 5 và số 8. |

---

## 3. Core Scenario Checklist

Bảng theo dõi thực thi **13 Kịch bản cốt lõi bắt buộc (`Mandatory Core Scenarios`)** khi Cán bộ trực tiếp thao tác trên hệ thống LegalFlow v2:

| Scenario ID | Role | Scenario (`Tên kịch bản kiểm thử`) | Steps (`Các bước thao tác thực tế`) | Expected Result (`Kết quả mong đợi`) | Actual Result (`Khảo sát thực tế trong buổi UAT`) | Status | Issue ID | Notes / Safety Rule |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **LIV-01** | `ALL` | **Đăng nhập hệ thống (`Authentication`)** | 1. Mở trang chủ LegalFlow v2.<br>2. Nhập username và password chuẩn hóa của tài khoản được cấp.<br>3. Nhấn **Đăng nhập**. | Đăng nhập thành công, chuyển hướng vào màn hình Danh sách hồ sơ. Hiển thị đúng họ tên và nhãn vai trò góc trên bên phải. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Kiểm tra luồng cấp phát phiên làm việc JWT. |
| **LIV-02** | `STAFF`<br>`ADMIN` | **Xem Danh sách hồ sơ (`Case List & Filter`)** | 1. Tại màn hình chính, kiểm tra danh sách 15 hồ sơ đất đai mẫu.<br>2. Chọn bộ lọc Lĩnh vực (`Đất đai`) và Trạng thái (`PROCESSING`).<br>3. Thử tìm kiếm theo Mã hồ sơ/Tên người nộp. | Danh sách tải mượt mà dưới 2 giây. Bộ lọc phản hồi chính xác, phân trang rõ ràng, không bị hiệu ứng nháy hay báo lỗi trống sai lệch. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Đánh giá trải nghiệm tìm kiếm hồ sơ của cán bộ thụ lý. |
| **LIV-03** | `STAFF`<br>`MANAGER` | **Mở Chi tiết hồ sơ (`Case Detail & GIS Profile`)** | 1. Nhấp vào mã một hồ sơ Cấp GCN lần đầu hoặc Chuyển mục đích.<br>2. Kiểm tra thông tin người nộp, vị trí thửa đất, diện tích.<br>3. Chuyển qua lại giữa các Tab (`Hồ sơ`, `AI Review`, `Legal Snapshot`). | Trang chi tiết hiển thị đầy đủ thông tin địa chính thửa đất. Các Tab chuyển đổi nhanh chóng, không phát sinh lỗi Console hay API 500. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Khảo sát tính trực quan của thông tin thửa đất hiển thị. |
| **LIV-04** | `STAFF`<br>`ADMIN` | **Chạy AI Review (`Trigger AI Legal Review`)** | 1. Chuyển sang Tab **AI Review**.<br>2. Nhấn nút **Chạy AI Rà soát (`Start AI Analysis`)**.<br>3. Quan sát quá trình xử lý và đọc kết quả phân tích 4 điều kiện. | Hệ thống gọi Trợ lý AI, trả về nhận xét chi tiết cho 4 điều kiện đất đai (quy hoạch, tranh chấp, tài chính, giấy tờ). Trích dẫn đúng điều khoản Luật Đất đai 2024. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Kiểm tra chất lượng và độ sâu chuyên môn của Prompt AI. |
| **LIV-05** | `MANAGER`<br>`ADMIN` | **AI Phân tích lại (`Re-run AI Analysis`)** | 1. Tại hồ sơ đã có kết quả AI cũ, cập nhật hoặc giả lập thêm thông tin tài chính/quy hoạch.<br>2. Nhấn nút **Chạy lại AI Rà soát (`Re-run Analysis`)**. | AI tính toán lại dựa trên thông tin mới, cập nhật kết quả rà soát. **Lịch sử các lần phân tích cũ được bảo lưu đầy đủ trong CSDL** (không bị ghi đè hay xóa mất). | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Đảm bảo tính bất biến của dữ liệu thẩm định qua các vòng rà soát. |
| **LIV-06** | `ALL` | **Xem Cảnh báo AI (`Verify AI Safety Banner`)** | 1. Quan sát kỹ phần trên cùng của Tab **AI Review** và phần đầu của nội dung nhận xét AI.<br>2. Kiểm tra nội dung khối cảnh báo lằn ranh đỏ. | **Khối cảnh báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA` hiển thị nổi bật, rõ ràng bằng chữ in hoa**. Nội dung nhắc cán bộ phải thẩm định lại và chịu trách nhiệm pháp lý cuối cùng. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | **CRITICAL SAFETY:** Không để cán bộ ỷ lại hay nhầm lẫn vai trò của AI. |
| **LIV-07** | `ALL` | **Xem Căn cứ pháp lý đã sử dụng (`Inspect Legal Snapshot`)** | 1. Chuyển sang Tab **Legal Snapshot** ngay sau khi có kết quả rà soát AI.<br>2. Kiểm tra thông tin các văn bản luật được trích dẫn.<br>3. Kiểm tra mã `Prompt Version` và `Timestamp`. | Hệ thống hiển thị minh bạch danh mục văn bản pháp luật áp dụng (tên văn bản, số hiệu, điều khoản cụ thể) và ghi nhận chính xác phiên bản Prompt AI đã dùng tại thời điểm phân tích. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Đảm bảo tính minh bạch phục vụ công tác thanh tra, kiểm toán. |
| **LIV-08** | `STAFF`<br>`MANAGER` | **Xem Dự thảo / In / Xuất văn bản (`Verify Export Buttons UI`)** | 1. Cuộn xuống section **Dự thảo / In / Xuất văn bản** bên dưới kết quả AI Review.<br>2. Kiểm tra hiển thị đủ 3 nút thao tác.<br>3. Kiểm tra nhãn nút và màu sắc trực quan. | Section hiển thị đầy đủ, rõ ràng 03 nút: **Xem trước PDF**, **In**, **Xuất file Word (.docx)**. Bố cục không bị lệch hay che khuất. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Kiểm tra tính trực quan của khu vực xuất văn bản. |
| **LIV-09** | `STAFF`<br>`MANAGER` | **Xuất Word Draft (`Generate & Download Word File`)** | 1. Nhấn nút **Xuất file Word (.docx)**.<br>2. Đợi trình duyệt tải xuống file Phiếu rà soát.<br>3. Mở file Word bằng Microsoft Word/WPS Office để rà soát nội dung. | File Word tải xuống thành công. Bên trong file có đầy đủ thông tin hồ sơ, kết quả AI review và **đoạn cảnh báo từ chối trách nhiệm pháp lý rõ ràng**. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Kiểm chứng định dạng văn bản xuất ra. |
| **LIV-10** | `ALL` | **Kiểm tra Filename `DU_THAO_GOI_Y_AI_` (`Enforce Prefix Safety`)** | 1. Kiểm tra chính xác tên file của văn bản Word hoặc PDF vừa được tải xuống trên máy tính.<br>2. Đối chiếu với quy tắc an toàn xuất văn bản. | **Tên file tải xuống BẮT BUỘC bắt đầu bằng tiền tố `DU_THAO_GOI_Y_AI_...`** *(Ví dụ: `DU_THAO_GOI_Y_AI_phieu_ra_soat_HS001.docx`)*. **Hoàn toàn KHÔNG tự động đóng dấu hay chữ ký số ban hành**. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | **CRITICAL EXPORT SAFETY:** Ngăn chặn tuyệt đối rủi ro ban hành nhầm văn bản AI. |
| **LIV-11** | `ADMIN`<br>`MANAGER` | **Xem Legal Knowledge (`Inspect Knowledge Governance`)** | 1. Chọn menu **Legal Knowledge** từ thanh điều hướng.<br>2. Rà soát danh sách Văn bản luật, Quy trình, AI Prompts và Checklist hiện có.<br>3. Kiểm tra chức năng **Simulation** trên prompt `Pending`. | Trang quản trị hiển thị minh bạch các phiên bản (`Version`), Trạng thái (`Active`/`Pending`/`Deprecated`) và Ngày ban hành. `Simulation` cho phép chạy thử prompt mà không ghi đè dữ liệu thật. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Kiểm chứng năng lực quản trị tri thức và kiểm soát phiên bản AI. |
| **LIV-12** | `VIEWER` | **Kiểm tra VIEWER không được thao tác nhạy cảm (`Enforce Read-Only RBAC`)** | 1. Đăng xuất và đăng nhập bằng tài khoản `viewer_uat`.<br>2. Mở chi tiết một hồ sơ TTHC.<br>3. Kiểm tra Tab AI Review và section Xuất văn bản.<br>4. Thử gọi API `POST /procedure-cases/:id/ai-analysis` từ DevTools Console. | ❌ **Nút "Chạy AI Rà soát" và toàn bộ section "Dự thảo / In / Xuất văn bản" bị ẩn hoặc vô hiệu hóa hoàn toàn trên UI**. Khi cố tình gọi API qua HTTP, hệ thống từ chối truy cập và trả về **HTTP 403 Forbidden**. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | **CRITICAL RBAC:** Bảo vệ tuyệt đối nguyên tắc quyền chỉ đọc đối với tài khoản giám sát. |
| **LIV-13** | `STAFF`<br>`ADMIN` | **Kiểm tra Lỗi / Empty State (`Error & Empty State Resilience`)** | 1. Giả lập ngắt mạng tạm thời (hoặc chặn API `GET /procedure-cases` trong DevTools).<br>2. Làm mới trang Danh sách hoặc Chi tiết hồ sơ.<br>3. Quan sát thông báo lỗi và nhấn nút **Thử lại (`Retry`)**. | Hệ thống hiển thị **thông báo lỗi kỹ thuật rõ ràng, thân thiện với người dùng** kèm icon cảnh báo. **Hoàn toàn KHÔNG hiển thị nhầm thành Empty State ("Chưa có dữ liệu")**. Nút **Thử lại** hoạt động tốt khi kết nối được khôi phục. | *[Cán bộ thao tác trực tiếp và ghi nhận phản hồi]* | `[ ]` | `N/A` | Kiểm chứng độ bền vững (`Resilience`) và độ tin cậy hiển thị lỗi của giao diện. |

---

## 4. Officer Feedback Checklist

Bảng khảo sát và ghi nhận ý kiến phản hồi nghiệp vụ trực tiếp từ các Cán bộ (`Officer UX & Domain Feedback Register`):

| Question (`Câu hỏi khảo sát nghiệp vụ`) | Officer Feedback (`Ý kiến đánh giá trực tiếp của Cán bộ / Lãnh đạo`) | Severity (`Phân loại`) | Follow-up Needed (`Có cần tinh chỉnh sau UAT?`) | Notes / Action Plan |
| :--- | :--- | :---: | :---: | :--- |
| **1. Giao diện có dễ hiểu không?** *(Bố cục màu sắc, font chữ, vị trí các nút bấm thao tác có trực quan, dễ tìm và phù hợp với thói quen làm việc không?)* | *[Cán bộ đánh giá trực tiếp trong phiên họp]* | `Suggestion` | `Yes / No` | Ghi nhận phản hồi UX để tinh chỉnh css/bố cục ở bản vá Stabilization nếu cần. |
| **2. AI warning có rõ không?** *(Khối cảnh báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA` có đủ nổi bật để thu hút sự chú ý và nhắc nhở trách nhiệm không?)* | *[Cán bộ đánh giá trực tiếp trong phiên họp]* | `High` *(nếu không rõ)* | `Yes / No` | Khẳng định tính hiệu quả của lằn ranh đỏ an toàn pháp lý. |
| **3. Căn cứ pháp lý có đủ rõ không?** *(Các văn bản luật, điều khoản Luật Đất đai 2024 trích dẫn trong Legal Snapshot có chính xác, minh bạch và dễ tra cứu không?)* | *[Cán bộ đánh giá trực tiếp trong phiên họp]* | `High` *(nếu trích dẫn sai)* | `Yes / No` | Kiểm chứng tính đúng đắn của tri thức pháp lý áp dụng. |
| **4. Văn bản xuất có gây hiểu nhầm là văn bản chính thức không?** *(Tiền tố `DU_THAO_GOI_Y_AI_`, khung cảnh báo bên trong và việc không có chữ ký số có bảo vệ an toàn tuyệt đối cho cơ quan không?)* | *[Cán bộ đánh giá trực tiếp trong phiên họp]* | `Critical` *(nếu giống văn bản thật)* | `Yes / No` | **CRITICAL EXPORT SAFETY:** Xác nhận độ an toàn tuyệt đối khi xuất file Word/PDF. |
| **5. Lỗi hiển thị có dễ hiểu không?** *(Khi mất kết nối hoặc lỗi API, câu thông báo trên màn hình có giúp cán bộ biết cách xử lý (bấm nút Thử lại) không?)* | *[Cán bộ đánh giá trực tiếp trong phiên họp]* | `Medium` | `Yes / No` | Đánh giá độ thân thiện của cơ chế xử lý ngoại lệ UI. |
| **6. Cần thêm trường/chức năng nào?** *(Cán bộ có mong muốn bổ sung thêm trường thông tin địa chính nào hay phím tắt hỗ trợ nghiệp vụ thụ lý đặc thù của địa phương không?)* | *[Cán bộ đánh giá trực tiếp trong phiên họp]* | `Suggestion` | `Yes` *(Backlog)* | Ghi nhận các yêu cầu nghiệp vụ mới vào lộ trình nâng cấp sau Golive. |

---

## 5. Immediate Decision

Bảng phán quyết điều phối tức thời (`Immediate Session Decision`) do Tổ Điều phối UAT thống nhất cùng Lãnh đạo Phòng Thẩm định ngay khi kết thúc 13 kịch bản kiểm thử:

| Decision Item (`Phương án phán quyết`) | Decision (`Quyết định chọn`) | Evidence / Justification (`Bằng chứng & Lý do quyết định`) | Notes / Next Actions |
| :--- | :---: | :--- | :--- |
| **OPTION 1: Tiếp tục Pilot (`CONTINUE PILOT / PASSED`)** | `[ CHỌN / KHÔNG CHỌN ]` | • **Bằng chứng:** 100% kịch bản an toàn pháp lý (`LIV-06`, `LIV-07`, `LIV-09`, `LIV-10`, `LIV-12`) đạt chuẩn hoàn hảo.<br>• Không phát sinh lỗi `Critical` (mất tiền tố, rò rỉ phân quyền `VIEWER`) hay lỗi `High` nào cản trở nghiệp vụ. | Cán bộ xác nhận hệ thống đáp ứng tốt nghiệp vụ. Chuyển tiếp sang bước tổng hợp báo cáo bế mạc UAT và chuẩn bị cho giai đoạn triển khai chính thức có kiểm soát. |
| **OPTION 2: Cần sửa lỗi trước (`PAUSE FOR ISSUES FIX / STABILIZATION`)** | `[ CHỌN / KHÔNG CHỌN ]` | • **Bằng chứng:** Phát sinh lỗi mức độ `High` (hoặc chùm lỗi `Medium` gây cản trở thao tác) cần tinh chỉnh code/prompt trước khi cho cán bộ thao tác tiếp trên quy mô lớn.<br>• *Ví dụ: Prompt AI trích dẫn nhầm điều khoản luật cũ hoặc form in Word bị vỡ khung nghiêm trọng.* | Tạm dừng kiểm thử mở rộng. Chuyển tiếp sang **`Phase 10F: Pilot UAT Issue Fixes & Stabilization`** để đội kỹ thuật khắc phục triệt để các lỗi `High/Medium` đã ghi nhận. |
| **OPTION 3: Dừng do lỗi nghiêm trọng (`ABORT / NO-GO DUE TO CRITICAL VIOLATION`)** | `[ CHỌN / KHÔNG CHỌN ]` | • **Bằng chứng:** Phát hiện lỗi `Critical` vi phạm lằn ranh đỏ an toàn pháp lý (`DU_THAO_GOI_Y_AI_` bị biến mất, tài khoản `VIEWER` có quyền rà soát hoặc xuất văn bản, hoặc lỗi làm sập toàn bộ CSDL). | Hủy bỏ ngay lập tức phiên kiểm thử. Kích hoạt quy trình khẩn cấp (`Emergency Rollback/Fix`), khóa quyền truy cập hệ thống và báo cáo Lãnh đạo cơ quan. |

*(**CHỈ ĐẠO ĐIỀU PHỐI:** Ngay tại buổi test, Điều phối viên và Lãnh đạo Phòng Thẩm định sẽ ký nháy vào ô quyết định tương ứng và đính kèm danh sách sự cố ghi nhận tại file `LEGALFLOW_V2_PHASE10E_PILOT_UAT_LIVE_ISSUE_REGISTER.md`).*
