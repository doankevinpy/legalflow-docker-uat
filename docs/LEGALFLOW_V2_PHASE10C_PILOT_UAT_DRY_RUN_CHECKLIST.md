# LEGALFLOW V2 - PHASE 10C
# PILOT UAT DRY RUN CHECKLIST

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.1-pilot-uat-real-officers-execution-pack` ➔ Phase 10C  
**Chuyên trách thực hiện:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Dry Run Checklist** là Bảng rà soát và Diễn tập chạy thử toàn diện nội bộ (Dry Run) dành cho Tổ Điều phối UAT và Kỹ sư hệ thống trước khi chính thức mời cán bộ, chuyên viên nghiệp vụ và Lãnh đạo phòng thẩm định thực tế vào tham gia đợt Pilot UAT.
Quy trình Dry Run bảo đảm loại bỏ triệt để các rủi ro kỹ thuật ngớ ngẩn (lỗi kết nối, sai cấu hình tài khoản, thiếu dữ liệu mẫu hoặc lỗi phân quyền cơ bản), giúp buổi kiểm thử thực tiễn với cán bộ diễn ra mượt mà, chuyên nghiệp và an toàn pháp lý tối đa.

---

## 2. Dry Run Objectives
Đợt chạy thử Dry Run nội bộ đặt ra 9 mục tiêu rà soát then chốt:
1. **Kiểm tra hệ thống trước buổi UAT (`Pre-flight Check`):** Xác nhận tính ổn định của hạ tầng máy chủ, Docker container và kết nối mạng nội bộ trước giờ G.
2. **Kiểm tra tài khoản test (`Account Verification`):** Kiểm chứng 4 vai trò tiêu chuẩn (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) đã được tạo sẵn trong CSDL test với đúng đặc quyền `role`.
3. **Kiểm tra backup (`Backup Integrity`):** Xác minh quy trình sao lưu CSDL (`pg_dump`) hoạt động chính xác và file dump trước Dry Run (`pre_dryrun_dump.sql`) hợp lệ `> 0 KB`.
4. **Kiểm tra health-check (`Service Diagnostics`):** Kiểm chứng kịch bản `.\scripts\health-check.ps1` trả về toàn bộ `[PASS]` cho các cổng 3000 (Backend), 5173 (Frontend), 5432 (PostgreSQL).
5. **Kiểm tra các luồng AI review (`LLM Engine Verification`):** Kiểm thử luồng chạy AI Rà soát và AI phân tích lại trên hồ sơ Cấp GCN lần đầu / Chuyển mục đích sử dụng đất.
6. **Kiểm tra export draft (`Export Safety Enforcement`):** Kiểm chứng tính năng Xem trước PDF, In trực tiếp và tải xuống file Word (`.docx`). Bảo đảm 100% file tải xuống có tiền tố `DU_THAO_GOI_Y_AI_...` và có tuyên bố từ chối trách nhiệm pháp lý.
7. **Kiểm tra legal snapshot (`Snapshot Immutability`):** Kiểm chứng tính năng chụp nhanh Căn cứ pháp lý (`ProcedureAiAnalysisLegalSnapshot`) lưu đúng văn bản luật và điều khoản hợp lệ.
8. **Kiểm tra phân quyền (`RBAC Zero-Leakage`):** Kiểm chứng UI và API không cho phép `VIEWER` hoặc `STAFF` gọi trái phép vào các endpoint rà soát AI, xuất văn bản hoặc quản trị tri thức.
9. **Kiểm tra form ghi nhận lỗi (`Feedback Tool Readiness`):** Xác định biểu mẫu Sổ nhật ký UAT (`Feedback Register`) và Sổ theo dõi buổi test (`Session Log`) đã sẵn sàng để ghi nhận tức thì.

---

## 3. Pre-Dry-Run Checklist

Trước khi bước vào các kịch bản diễn tập nghiệp vụ, Tổ kỹ thuật và Điều phối viên thực hiện kiểm tra nhanh 10 hạng mục tiền đề dưới đây:

| Item | Owner | Evidence / Command | Expected Result | Status | Notes |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **1. Git đúng tag** | Technical Support | `git describe --tags`<br>➔ `v2.10.1-pilot-uat-real-officers-execution-pack` | Trả về đúng tên Git Tag của gói tài liệu Phase 10B đã nghiệm thu trước đó. | `[PASS]` | Không chạy Dry Run trên nhánh dev chưa được gắn nhãn kiểm soát. |
| **2. Working tree clean** | Technical Support | `git status -s` | Trả về danh sách trống hoặc chỉ gồm các file tài liệu markdown mới tạo trong `docs/`. | `[PASS]` | Bảo đảm mã nguồn không bị chỉnh sửa tạm thời hay bẩn (`dirty`). |
| **3. Docker running** | Technical Support | `docker ps --format "{{.Names}}: {{.Status}}"` | Các container `legalflow_postgres`, `legalflow_backend` (nếu chạy Docker) đều ở trạng thái `Up (healthy)`. | `[PASS]` | Hạ tầng container sẵn sàng phục vụ kiểm thử. |
| **4. Database backup đã tạo** | Technical Support | `docker exec legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod > .\backups\pre_dryrun_dump.sql` | File `pre_dryrun_dump.sql` được tạo thành công trong `backups/`, dung lượng `> 0 KB`. | `[PASS]` | Không hardcode mật khẩu thực tế trong tài liệu hoặc lệnh script. |
| **5. Backend health-check pass** | Technical Support | `Test-NetConnection -ComputerName localhost -Port 3000` | `TcpTestSucceeded : True`. Endpoint API `/api/health` trả về `200 OK`. | `[PASS]` | NestJS Backend hoạt động ổn định không lỗi kết nối CSDL. |
| **6. Frontend mở được** | UAT Coordinator | Mở trình duyệt vào `http://localhost:5173` | Giao diện trang Đăng nhập tải nhanh trong dưới 2 giây, không có lỗi console màu đỏ. | `[PASS]` | Vite/React Frontend phản hồi mượt mà. |
| **7. Tài khoản Test sẵn sàng** | Technical Support | Kiểm tra trong DB các tài khoản: `admin_uat`, `manager_uat`, `staff_uat_01`, `viewer_uat` | Đủ 4 tài khoản với đúng `role` tương ứng (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`). | `[PASS]` | Mật khẩu test chuẩn hóa cho nội bộ, không dùng secret production. |
| **8. Dữ liệu Test sẵn sàng** | UAT Coordinator | Kiểm tra danh sách hồ sơ trên UI hoặc query `SELECT count(*) FROM "ProcedureCase"` | Có sẵn tối thiểu 10 bộ hồ sơ mẫu thuộc lĩnh vực Đất đai (Cấp GCN & Chuyển mục đích). | `[PASS]` | Hồ sơ có đầy đủ thông tin người nộp, thửa đất và sơ đồ ranh giới. |
| **9. Biểu mẫu Feedback sẵn sàng** | UAT Coordinator | Mở file `docs/LEGALFLOW_V2_PHASE10B_PILOT_UAT_FEEDBACK_REGISTER.md` | Biểu mẫu Sổ nhật ký và Bảng theo dõi lỗi đã có sẵn định dạng chuẩn. | `[PASS]` | Sẵn sàng ghi nhận bất kỳ sự cố nào phát sinh trong Dry Run. |
| **10. Phân công người ghi lỗi** | UAT Coordinator | Phân công Kỹ sư hỗ trợ trực tiếp ghi nhật ký (`Facilitator & Note-taker`) | Đã có nhân sự chịu trách nhiệm điền thông tin vào `Session Log` trong suốt buổi diễn tập. | `[PASS]` | Bảo đảm không có phản hồi nào bị thất lạc. |

---

## 4. Dry Run Scenarios

Tổ diễn tập chạy thử lần lượt 12 kịch bản trọng yếu dưới đây, mô phỏng chính xác các thao tác mà cán bộ thực tế sẽ thực hiện trong buổi UAT chính thức:

| Scenario ID | Role | Function | Steps (Bước thao tác diễn tập) | Expected Result | Actual Result | Status | Notes |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **DRY-01** | `ALL` | Đăng nhập hệ thống (`Login`) | 1. Mở trình duyệt ẩn danh.<br>2. Lần lượt đăng nhập bằng `admin_uat`, `manager_uat`, `staff_uat_01`, `viewer_uat`. | Đăng nhập thành công, hệ thống điều hướng vào trang chủ đúng theo thẩm quyền từng role. Thẻ Role góc trên header hiển thị chính xác. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm tra tính ổn định của cơ chế xác thực JWT. |
| **DRY-02** | `STAFF`<br>`ADMIN` | Danh sách hồ sơ (`ProcedureCaseList`) | 1. Chọn menu **Hồ sơ TTHC**.<br>2. Lọc Lĩnh vực `Đất đai`.<br>3. Lọc Trạng thái `PROCESSING`.<br>4. Nhập mã `HS-2026-001` vào ô tìm kiếm. | Danh sách phản hồi tức thì dưới 1 giây. Bộ lọc hiển thị đúng hồ sơ đang thụ lý, ô tìm kiếm tìm ra chính xác hồ sơ theo mã số. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm chứng UX/UI trang danh sách. |
| **DRY-03** | `STAFF`<br>`MANAGER` | Chi tiết hồ sơ (`ProcedureCaseDetail`) | 1. Nhấp vào dòng hồ sơ `HS-2026-001`.<br>2. Kiểm tra thông tin người nộp, địa chỉ thửa đất, diện tích và lịch sử thụ lý. | Trang chi tiết hiển thị đầy đủ thông tin, sơ đồ thửa đất rõ ràng, các Tab (`Hồ sơ`, `AI Review`, `Legal Snapshot`) điều hướng mượt mà. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm tra khả năng tải dữ liệu chi tiết. |
| **DRY-04** | `STAFF`<br>`ADMIN` | AI review (`Run AI Analysis`) | 1. Tại trang chi tiết hồ sơ mới (`RECEIVED`), vào Tab **AI Review**.<br>2. Nhấn nút **Chạy AI Rà soát**.<br>3. Chờ LLM phân tích. | Hệ thống hiển thị trạng thái đang xử lý. Sau < 10 giây, kết quả rà soát xuất hiện với đầy đủ nhận xét điều kiện pháp lý và khuyến nghị. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm tra độ phản hồi và kết nối AI Engine. |
| **DRY-05** | `MANAGER`<br>`ADMIN` | AI phân tích lại (`Re-run AI Analysis`) | 1. Trên hồ sơ đã có kết quả AI cũ, bổ sung hoặc cập nhật thông tin thửa đất.<br>2. Nhấn lại nút **Chạy lại AI Rà soát**. | Hệ thống chạy lại rà soát, cập nhật nhận xét mới nhất theo thông tin vừa sửa, đồng thời ghi nhận phiên bản rà soát vào lịch sử. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm chứng tính năng tính toán lại (`Re-run`). |
| **DRY-06** | `ALL` | Căn cứ pháp lý đã sử dụng (`Legal Snapshot Tab`) | 1. Chuyển sang Tab **Legal Snapshot** ngay sau khi AI Review hoàn thành.<br>2. Rà soát danh sách văn bản luật và phiên bản Prompt. | Hiển thị minh bạch văn bản quy phạm pháp luật (Luật Đất đai 2024...), điều khoản áp dụng và phiên bản Prompt AI đã sử dụng (`Prompt Version`). | *[Ghi nhận thực tế]* | `[ ]` | Đảm bảo tính bất biến phục vụ thanh tra. |
| **DRY-07** | `STAFF`<br>`MANAGER` | Dự thảo / In / Xuất văn bản (`Export Action Section`) | 1. Cuộn xuống section **Dự thảo / In / Xuất văn bản**.<br>2. Nhấn nút **Xuất file Word (.docx)**.<br>3. Mở file tải về kiểm tra tiền tố và banner. | Tên file **BẮT BUỘC** mang tiền tố `DU_THAO_GOI_Y_AI_...docx`. Bên trong văn bản có banner viền vàng cảnh báo rà soát nội bộ và không có chữ ký số tự động. | *[Ghi nhận thực tế]* | `[ ]` | **CRITICAL SAFETY CHECK:** Tuân thủ Export Safety. |
| **DRY-08** | `VIEWER` | Quyền VIEWER (`Read-Only RBAC Audit`) | 1. Đăng nhập bằng tài khoản `viewer_uat`.<br>2. Mở chi tiết một hồ sơ TTHC.<br>3. Kiểm tra Tab AI Review và section Xuất văn bản. | ❌ **Nút "Chạy AI Rà soát" và toàn bộ section "Dự thảo / In / Xuất văn bản" bị ẩn hoặc vô hiệu hóa hoàn toàn**. Gọi API trực tiếp qua console trả về HTTP 403 Forbidden. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm chứng độ kín khít bảo mật RBAC. |
| **DRY-09** | `ADMIN`<br>`MANAGER` | Legal Knowledge (`Knowledge Module Audit`) | 1. Mở menu **Legal Knowledge**.<br>2. Tra cứu danh sách Văn bản pháp luật, Quy trình, AI Prompts và Checklist hiện có. | Danh sách hiển thị rõ ràng phiên bản (`Version`), Trạng thái (`Active` / `Pending` / `Deprecated`) và Ngày ban hành. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm tra khả năng hiển thị tri thức pháp lý. |
| **DRY-10** | `ADMIN`<br>`MANAGER` | Activation verification (`Simulation / Verification`) | 1. Chọn một prompt đang ở trạng thái `Pending`.<br>2. Nhấn nút **Simulation / Impact Analysis**.<br>3. Chọn bộ dữ liệu mẫu để chạy thử. | Hệ thống thực hiện rà soát thử nghiệm trên dữ liệu mẫu, hiển thị báo cáo đánh giá tác động mà **không làm thay đổi bất kỳ CSDL hay hồ sơ thật nào**. | *[Ghi nhận thực tế]* | `[ ]` | Đảm bảo tính Read-Only của Simulation. |
| **DRY-11** | `ADMIN`<br>`MANAGER` | Rollback verification (`Rollback Version`) | 1. Chọn một quy trình/prompt cũ ở trạng thái `Deprecated`.<br>2. Nhấn nút **Rollback Version**.<br>3. Xác nhận trên hộp thoại modal. | Phiên bản cũ được khôi phục sang trạng thái `Active`, phiên bản hiện tại chuyển sang `Deprecated`. Nhật ký kiểm toán `ProcedureAuditLog` ghi nhận sự kiện. | *[Ghi nhận thực tế]* | `[ ]` | Kiểm chứng khả năng khôi phục tri thức nhanh. |
| **DRY-12** | `ALL` | Lỗi API / empty state (`Negative Error Handling`) | 1. Giả lập lỗi mất mạng hoặc mở URL với ID hồ sơ không tồn tại (`/procedure-cases/invalid-id-9999`).<br>2. Quan sát thông báo trả về. | Trang **không bị trắng nhầm thành Empty State**. Hiển thị banner cảnh báo màu đỏ với thông điệp lỗi kỹ thuật rõ ràng kèm nút **Thử lại (`Thử lại`)** hoặc quay lại danh sách. | *[Ghi nhận thực tế]* | `[ ]` | Gia cố Error Handling chuyên nghiệp. |

---

## 5. Dry Run Exit Criteria

Buổi chạy thử Dry Run nội bộ được tuyên bố kết thúc thành công và đủ điều kiện phê duyệt chuyển sang mời cán bộ nghiệp vụ thực tế tham gia (`Phase 10D`) khi thỏa mãn đồng thời 6 tiêu chí hoàn thành (`Dry Run Exit Criteria`):

1. **Không có lỗi Critical (`Zero Critical Defects`):** 100% không phát sinh bất kỳ lỗi `Critical` nào liên quan đến sập hệ thống (`500 Server Error`), hỏng CSDL, rò rỉ phân quyền (`STAFF`/`VIEWER` vượt quyền) hay vi phạm an toàn xuất văn bản (`DU_THAO_GOI_Y_AI_` bị mất).
2. **Lỗi High đã ghi nhận & có hướng xử lý (`High Defects Mitigated`):** Nếu phát hiện bất kỳ lỗi `High` nào (tải trang chậm, sai ký tự trên phiếu PDF), lỗi đó phải được lập chỉ mục đầy đủ vào `Issue Triage Board` và có giải pháp thao tác thay thế (`Workaround`) hoặc kế hoạch vá khẩn cấp trước giờ G.
3. **Tài khoản test hoạt động ổn định (`Accounts 100% Verified`):** Toàn bộ 4 tài khoản test (`admin_uat`, `manager_uat`, `staff_uat_01`, `viewer_uat`) đăng nhập trơn tru, token JWT gia hạn đúng quy chuẩn và không bị xung đột phiên làm việc.
4. **Cán bộ điều phối hiểu rõ quy trình (`Facilitator Readiness`):** Người điều phối (`Facilitator`) và Kỹ sư trực ca nắm vững từng kịch bản, sẵn sàng hướng dẫn và giải đáp mọi câu hỏi nghiệp vụ/pháp lý cho cán bộ theo triết lý Human-in-the-Loop.
5. **Biểu mẫu ghi nhận lỗi dùng được (`Feedback Tools Validated`):** Các biểu mẫu `UAT Session Log` và `Feedback Register` đã được kiểm chứng nhập liệu thử nghiệm thành công, đảm bảo khả năng tổng hợp số liệu tự động hoặc rõ ràng cho ca trực.
6. **Có biên bản/quyết định sẵn sàng (`Readiness Decision Confirmed`):** Tổ Điều phối UAT ký xác nhận vào Báo cáo hoàn thành Dry Run (`LEGALFLOW_V2_PHASE10C_PILOT_UAT_DRY_RUN_COMPLETION_REPORT.md`), khẳng định hệ thống đạt độ sẵn sàng tối đa để chính thức đón cán bộ vào kiểm thử thực tế.
