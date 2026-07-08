# LEGALFLOW V2 - PHASE 10B
# PILOT UAT TEST SCRIPTS

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.0-production-readiness-deployment-runbook` ➔ Phase 10B  
**Chuyên trách xây dựng:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Test Scripts** là bộ kịch bản kiểm thử thực hành chi tiết, được chuẩn hóa theo từng vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`), đi kèm các tình huống kiểm thử ngoại lệ (`Negative Test Cases`), kiểm thử an toàn xuất văn bản (`Export Safety`) và kiểm chứng quản trị AI (`AI Governance`).
Bộ kịch bản là công cụ làm việc trực tiếp của cán bộ thẩm định trong đợt Pilot UAT, giúp xác minh tính chính xác, tính ổn định và sự tuân thủ pháp luật của hệ thống LegalFlow v2 trên từng bước thao tác cụ thể.

---

## 2. Test Script Format
Mỗi kịch bản kiểm thử (`Test Case`) trong tài liệu này được cấu trúc theo 9 trường thông tin chuẩn của ngành kiểm thử phần mềm chất lượng cao:
* **Test ID:** Mã định danh duy nhất của kịch bản (Ví dụ: `ADM-01`, `MGR-02`, `NEG-03`...).
* **Role:** Vai trò được yêu cầu để thực hiện kịch bản (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`).
* **Scenario:** Tên tình huống kiểm thử cụ thể.
* **Preconditions:** Các điều kiện tiên quyết bắt buộc trước khi bắt đầu thực hiện bước test.
* **Steps:** Các bước thao tác tuần tự trên giao diện người dùng (UI).
* **Expected Result:** Kết quả phản hồi mong đợi từ hệ thống (trên UI, API, và file tải về).
* **Actual Result:** Kết quả thực tế ghi nhận khi chạy thử (Do cán bộ điền: `Khớp mong đợi` hoặc mô tả lỗi).
* **Status:** Trạng thái đánh giá (`[PASS]` / `[FAIL]` / `[BLOCKED]`).
* **Notes:** Ghi chú bổ sung, ảnh chụp màn hình chứng cứ hoặc giải thích nghiệp vụ.

---

## 3. ADMIN Test Cases

Bộ 9 kịch bản kiểm thử dành cho Quản trị viên hệ thống (`ADMIN`), bao phủ toàn bộ quyền hạn quản trị nghiệp vụ và tri thức pháp lý cao nhất:

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **ADM-01** | `ADMIN` | Đăng nhập hệ thống (`Login`) | Tài khoản `ADMIN` hợp lệ đang active. | 1. Mở trình duyệt vào URL `http://localhost:5173`.<br>2. Nhập `username` và `password` của ADMIN.<br>3. Nhấn **Đăng nhập**. | Đăng nhập thành công. Chuyển hướng vào trang chủ. Thẻ role hiển thị rõ chữ `ADMIN` màu đỏ/nổi bật ở header. | *[Cán bộ điền]* | `[ ]` | Kiểm tra token JWT hợp lệ. |
| **ADM-02** | `ADMIN` | Xem danh sách hồ sơ (`ProcedureCaseList`) | Đã đăng nhập `ADMIN`. Có sẵn tối thiểu 5 hồ sơ TTHC trên DB. | 1. Nhấn menu **Hồ sơ TTHC**.<br>2. Lọc Lĩnh vực `Đất đai`.<br>3. Lọc Trạng thái `PROCESSING`.<br>4. Nhập từ khóa tìm kiếm vào ô Search. | Danh sách tải nhanh. Hiển thị đúng các hồ sơ đang xử lý thuộc lĩnh vực Đất đai. Ô tìm kiếm phản hồi đúng kết quả khớp từ khóa. | *[Cán bộ điền]* | `[ ]` | Kiểm tra độ phản hồi trang danh sách. |
| **ADM-03** | `ADMIN` | Mở chi tiết hồ sơ (`ProcedureCaseDetail`) | Đang ở trang danh sách hồ sơ TTHC. | 1. Nhấp vào dòng hồ sơ Cấp GCN lần đầu mã số `HS-2026-001`.<br>2. Kiểm tra thông tin các Tab hiển thị. | Trang chi tiết tải đầy đủ thông tin: Mã hồ sơ, Người nộp, Địa chỉ thửa đất, Diện tích và Trạng thái thụ lý. | *[Cán bộ điền]* | `[ ]` | Kiểm tra hiển thị thông tin thửa đất. |
| **ADM-04** | `ADMIN` | Chạy AI review (`Run AI Analysis`) | Hồ sơ `HS-2026-001` đang ở trạng thái `RECEIVED` hoặc `PROCESSING`. | 1. Chuyển sang Tab **AI Review**.<br>2. Nhấn nút **Chạy AI Rà soát (`Chạy AI Rà soát`)**.<br>3. Chờ hệ thống gọi rà soát LLM. | Hiển thị trạng thái đang rà soát. Sau < 10 giây, kết quả thẩm định xuất hiện với phân tích rõ ràng từng điều kiện pháp lý. | *[Cán bộ điền]* | `[ ]` | Kiểm tra tốc độ và độ chính xác AI. |
| **ADM-05** | `ADMIN` | Xem legal snapshot (`Check Legal Snapshot`) | Hồ sơ `HS-2026-001` vừa hoàn tất chạy AI Review thành công. | 1. Chuyển sang Tab **Legal Snapshot** (hoặc mục Căn cứ pháp lý).<br>2. Rà soát danh sách luật và điều khoản được liệt kê. | Hiển thị chi tiết văn bản luật (Luật Đất đai 2024...), điều khoản chi tiết và mã `Prompt Version` được AI sử dụng tại thời điểm rà soát. | *[Cán bộ điền]* | `[ ]` | Bảo đảm tính bất biến của snapshot. |
| **ADM-06** | `ADMIN` | Xuất Word draft (`Export Word Docx`) | Đang ở trang chi tiết hồ sơ có kết quả AI Review. | 1. Cuộn xuống section **Dự thảo / In / Xuất văn bản**.<br>2. Nhấn nút **Xuất file Word (.docx)**.<br>3. Mở file Word vừa tải xuống. | File tải về có tên bắt đầu bằng `DU_THAO_GOI_Y_AI_...`. Bên trong tài liệu có khối cảnh báo màu vàng từ chối trách nhiệm pháp lý. | *[Cán bộ điền]* | `[ ]` | Kiểm chứng quy tắc Export Safety. |
| **ADM-07** | `ADMIN` | Xem Legal Knowledge (`Browse Legal Knowledge`) | Đã đăng nhập `ADMIN`. | 1. Nhấn menu **Legal Knowledge**.<br>2. Kiểm tra danh sách Văn bản pháp luật, Quy trình, AI Prompts và Checklist. | Hiển thị đầy đủ danh sách tri thức pháp lý kèm trạng thái phiên bản (`Active` / `Pending` / `Deprecated`). | *[Cán bộ điền]* | `[ ]` | Trang quản trị tri thức hiển thị chuẩn. |
| **ADM-08** | `ADMIN` | Kiểm tra activation verification (`Knowledge Simulation`) | Có ít nhất 1 quy trình hoặc Prompt đang ở trạng thái `Pending`. | 1. Nhấn nút **Simulation / Impact Analysis** trên một prompt `Pending`.<br>2. Chọn dữ liệu mẫu để chạy thử rà soát. | Hệ thống chạy thử rà soát trên dữ liệu mẫu và trả về báo cáo đánh giá tác động mà **không làm thay đổi bất kỳ CSDL hồ sơ thật nào**. | *[Cán bộ điền]* | `[ ]` | Xác minh tính read-only của Simulation. |
| **ADM-09** | `ADMIN` | Kiểm tra rollback verification (`Rollback Version`) | Có ít nhất 1 phiên bản quy trình/prompt cũ đang ở trạng thái `Deprecated`. | 1. Nhấn nút **Rollback Version** trên phiên bản cũ.<br>2. Xác nhận trong hộp thoại modal.<br>3. Kiểm tra lại trạng thái. | Phiên bản cũ chuyển sang `Active`, phiên bản hiện tại chuyển sang `Deprecated`. Hệ thống ghi nhận lịch sử vào `rollbackHistory`. | *[Cán bộ điền]* | `[ ]` | Kiểm chứng Audit Trail khi Rollback. |

---

## 4. MANAGER Test Cases

Bộ 6 kịch bản kiểm thử dành cho Lãnh đạo phòng / Trưởng bộ phận (`MANAGER`), tập trung vào luồng thẩm định, kiểm duyệt và quản trị chuyên môn:

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **MGR-01** | `MANAGER` | Review hồ sơ TTHC (`Case Review`) | Đã đăng nhập `MANAGER`. Có hồ sơ do chuyên viên trình duyệt ở trạng thái `PROCESSING`. | 1. Mở danh sách hồ sơ TTHC, lọc các hồ sơ `PROCESSING`.<br>2. Chọn một hồ sơ để vào xem chi tiết.<br>3. Kiểm tra thông tin người nộp và thửa đất. | Hiển thị đầy đủ chi tiết hồ sơ, sơ đồ thửa đất và lịch sử xử lý của chuyên viên thụ lý trước đó. | *[Cán bộ điền]* | `[ ]` | Đóng vai trò kiểm duyệt của Lãnh đạo. |
| **MGR-02** | `MANAGER` | Chạy AI rà soát bổ sung (`Run AI Analysis`) | Đang ở trang chi tiết hồ sơ cần kiểm tra lại căn cứ thẩm định. | 1. Chuyển sang Tab **AI Review**.<br>2. Nhấn nút **Chạy AI Rà soát** để AI kiểm tra độc lập kết quả thẩm định. | AI trả về phân tích rà soát chuyên sâu, đối chiếu điều kiện Cấp GCN/Chuyển mục đích đầy đủ theo luật mới. | *[Cán bộ điền]* | `[ ]` | Lãnh đạo kiểm chứng chất lượng AI. |
| **MGR-03** | `MANAGER` | Kiểm tra cảnh báo AI (`Verify AI Warning`) | Trang Tab AI Review đang hiển thị kết quả phân tích. | 1. Rà soát khối cảnh báo phía trên cùng.<br>2. Kiểm tra dòng chữ nhắc nhở trách nhiệm cán bộ. | Khối cảnh báo màu vàng hiển thị rõ: **`BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`**. | *[Cán bộ điền]* | `[ ]` | Tuân thủ triết lý Human-in-the-Loop. |
| **MGR-04** | `MANAGER` | Export draft (`Export Word/PDF Draft`) | Hồ sơ đã có kết quả AI Review. | 1. Tại section hành động, nhấn **Xem trước PDF** và **Xuất file Word (.docx)**.<br>2. Kiểm tra tên file tải về. | Tên file tải về mang tiền tố `DU_THAO_GOI_Y_AI_...`. Phiếu rà soát rõ ràng là bản tham khảo nội bộ. | *[Cán bộ điền]* | `[ ]` | Kiểm chứng độ an toàn phiếu rà soát. |
| **MGR-05** | `MANAGER` | Workflow legal update (`Legal Knowledge Update`) | Có quy định pháp luật mới về đất đai được cập nhật vào `Pending`. | 1. Mở menu **Legal Knowledge** ➔ Tab **Văn bản pháp luật**.<br>2. Xem nội dung văn bản mới ở trạng thái `Pending`.<br>3. Nhấn **Activate Version**. | Phiên bản mới chuyển sang trạng thái `Active`, áp dụng cho các lần chạy AI review tiếp theo. Lịch sử được ghi vào `activationHistory`. | *[Cán bộ điền]* | `[ ]` | Quản lý cập nhật tri thức pháp lý. |
| **MGR-06** | `MANAGER` | Kiểm tra quyền Activation / Rollback (`Check RBAC`) | Đang ở trang Legal Knowledge. | 1. Thử thực hiện thao tác `Activate` trên một checklist mới và `Rollback` trên một checklist cũ. | Cả hai thao tác đều thực hiện thành công do `MANAGER` có quyền quản trị chuyên môn (`RBAC Allow`). | *[Cán bộ điền]* | `[ ]` | Xác minh quyền quản trị chuyên môn. |

---

## 5. STAFF Test Cases

Bộ 6 kịch bản kiểm thử dành cho Chuyên viên thụ lý hồ sơ (`STAFF`) — lực lượng tác nghiệp chủ lực trên hệ thống:

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **STF-01** | `STAFF` | Xem danh sách hồ sơ được phân công (`My Assigned Cases`) | Đã đăng nhập tài khoản `STAFF`. | 1. Mở menu **Hồ sơ TTHC**.<br>2. Lọc các hồ sơ ở trạng thái `RECEIVED` hoặc `PROCESSING`.<br>3. Nhấp chọn hồ sơ cần thụ lý. | Danh sách hiển thị đúng các hồ sơ thuộc thẩm quyền xử lý. Mở chi tiết hồ sơ nhanh chóng, mượt mà. | *[Cán bộ điền]* | `[ ]` | Kiểm chứng thao tác thụ lý hằng ngày. |
| **STF-02** | `STAFF` | Chạy AI review trên hồ sơ thụ lý (`Run AI Review`) | Hồ sơ Cấp GCN lần đầu / Chuyển mục đích đang ở trạng thái `RECEIVED`. | 1. Vào Tab **AI Review**.<br>2. Nhấn nút **Chạy AI Rà soát**.<br>3. Đọc kỹ các nhận xét và đối chiếu pháp lý do Trợ lý AI trả về. | AI rà soát chính xác các điều kiện (Quy hoạch, tranh chấp, nghĩa vụ tài chính...). Trả về gợi ý rõ ràng để chuyên viên tham khảo. | *[Cán bộ điền]* | `[ ]` | AI hỗ trợ giảm tải thời gian thẩm định. |
| **STF-03** | `STAFF` | Xem cảnh báo AI (`Check AI Warning`) | Kết quả AI Review vừa hiển thị trên màn hình. | 1. Rà soát khối cảnh báo viền vàng phía trên cùng.<br>2. Ghi nhận thông điệp hỗ trợ. | Hiển thị nổi bật thông điệp: **`BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`**, nhắc nhở chuyên viên phải đối chiếu thực tế. | *[Cán bộ điền]* | `[ ]` | Chuyên viên nắm rõ trách nhiệm cuối cùng. |
| **STF-04** | `STAFF` | Xem căn cứ pháp lý (`Browse Legal Snapshot`) | Hồ sơ đã chạy AI Review thành công. | 1. Chuyển sang Tab **Legal Snapshot**.<br>2. Rà soát danh sách các Điều, Khoản của Luật Đất đai 2024 được trích dẫn. | Hiển thị minh bạch văn bản luật và phiên bản prompt đã dùng, giúp chuyên viên có đủ căn cứ soạn thảo phiếu trình. | *[Cán bộ điền]* | `[ ]` | Bảo đảm tính giải trình nghiệp vụ. |
| **STF-05** | `STAFF` | Export draft (`Export Word Docx`) | Đang thụ lý hồ sơ có kết quả AI Review hợp lệ. | 1. Nhấn nút **Xuất file Word (.docx)** tại section hành động.<br>2. Mở file Word tải xuống để rà soát trước khi trình Lãnh đạo. | File Word tải xuống mang đúng tiền tố `DU_THAO_GOI_Y_AI_...`. Có khối cảnh báo từ chối trách nhiệm ở đầu văn bản. | *[Cán bộ điền]* | `[ ]` | Phiếu rà soát hỗ trợ soạn thảo nội bộ. |
| **STF-06** | `STAFF` | Kiểm tra lỗi khi thao tác vượt quyền (`Check Unauthorized Action`) | Đã đăng nhập `STAFF`. | 1. Nhấn menu **Legal Knowledge**.<br>2. Mở Tab **Văn bản pháp luật** hoặc **AI Prompts**.<br>3. Quan sát các nút thao tác `Activate Version` và `Rollback Version`. | ❌ **UI bị ẩn hoàn toàn** các nút thao tác nhạy cảm (`Activate`/`Rollback`). Nếu dùng Postman/Curl gọi API trực tiếp, Backend trả về `403 Forbidden`. | *[Cán bộ điền]* | `[ ]` | Chuyên viên không được sửa quy trình luật. |

---

## 6. VIEWER Test Cases

Bộ 7 kịch bản kiểm thử dành cho Cán bộ quan sát / Thanh tra (`VIEWER`) — xác minh độ kín khít bảo mật chỉ đọc (`Read-Only`):

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **VWR-01** | `VIEWER` | Xem danh sách hồ sơ (`Read-Only Case List`) | Đã đăng nhập tài khoản `VIEWER`. | 1. Mở menu **Hồ sơ TTHC**.<br>2. Tìm kiếm và lọc hồ sơ TTHC đất đai. | Cán bộ `VIEWER` xem được toàn bộ danh sách hồ sơ ở chế độ chỉ đọc, lọc và tìm kiếm bình thường. | *[Cán bộ điền]* | `[ ]` | Phục vụ công tác thanh tra, thống kê. |
| **VWR-02** | `VIEWER` | Xem chi tiết hồ sơ (`Read-Only Case Detail`) | Đang ở trang danh sách hồ sơ. | 1. Nhấp chọn một hồ sơ Cấp GCN hoặc Chuyển mục đích bất kỳ.<br>2. Xem thông tin thửa đất và lịch sử xử lý. | Hiển thị đầy đủ thông tin chi tiết hồ sơ nhưng **không có nút "Chỉnh sửa" hay nút cập nhật trạng thái**. | *[Cán bộ điền]* | `[ ]` | Giao diện bảo vệ tính read-only. |
| **VWR-03** | `VIEWER` | Xem legal snapshot read-only (`View Snapshot`) | Mở hồ sơ đã có kết quả AI Review cũ từ trước. | 1. Chuyển sang Tab **Legal Snapshot**.<br>2. Rà soát thông tin văn bản luật đã chụp nhanh. | `VIEWER` xem được đầy đủ căn cứ pháp lý lịch sử đã lưu trên CSDL để phục vụ kiểm tra, giám sát. | *[Cán bộ điền]* | `[ ]` | Bảo đảm tính minh bạch khi thanh tra. |
| **VWR-04** | `VIEWER` | Kiểm tra chặn chạy AI review (`Verify AI Run Restriction`) | Đang ở trang chi tiết hồ sơ TTHC ở trạng thái `PROCESSING`. | 1. Chuyển sang Tab **AI Review**.<br>2. Quan sát khu vực nút kích hoạt rà soát AI. | ❌ **Nút "Chạy AI Rà soát" bị ẩn hoàn toàn hoặc vô hiệu hóa (`Disabled/Hidden`)**. Cán bộ `VIEWER` không thể gọi chạy LLM. | *[Cán bộ điền]* | `[ ]` | Ngăn chặn lãng phí tài nguyên LLM API. |
| **VWR-05** | `VIEWER` | Kiểm tra chặn xuất văn bản (`Verify Export Restriction`) | Đang xem kết quả AI Review của một hồ sơ TTHC. | 1. Cuộn xuống khu vực section **Dự thảo / In / Xuất văn bản**.<br>2. Thử tìm các nút Xuất Word/PDF/In. | ❌ **Toàn bộ section hoặc các nút "Xuất file Word", "In", "Xem trước PDF" bị ẩn hoặc vô hiệu hóa hoàn toàn**. | *[Cán bộ điền]* | `[ ]` | `VIEWER` không được xuất văn bản dự thảo. |
| **VWR-06** | `VIEWER` | Kiểm tra chặn Activation/Rollback (`Verify Knowledge RBAC`) | Mở menu **Legal Knowledge**. | 1. Xem danh sách các phiên bản quy định.<br>2. Thử tìm nút `Activate` hoặc `Rollback`. | ❌ **Không hiển thị bất kỳ nút thao tác quản trị nào**. Chỉ hiển thị nội dung văn bản ở chế độ Read-Only. | *[Cán bộ điền]* | `[ ]` | `VIEWER` không có quyền chỉnh sửa tri thức. |
| **VWR-07** | `VIEWER` | Kiểm tra API 403 Forbidden (`Verify API Security`) | Dùng công cụ kiểm thử (hoặc console browser) gửi request POST đến `/api/procedure-cases/:id/ai-review` với token JWT của `VIEWER`. | 1. Gửi HTTP POST request với Bearer Token của VIEWER.<br>2. Kiểm tra HTTP status code trả về từ Backend. | Backend `RolesGuard` chặn lập tức và trả về **HTTP 403 Forbidden** kèm thông báo lỗi không đủ thẩm quyền. | *[Cán bộ điền]* | `[ ]` | Bảo mật nhiều lớp (Backend Guard). |

---

## 7. Negative Test Cases

Bộ 7 kịch bản kiểm thử ngoại lệ (`Negative Test Cases`), rà soát khả năng xử lý lỗi và độ dẻo dai của hệ thống khi gặp sự cố kỹ thuật hoặc dữ liệu bất thường:

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **NEG-01** | `ADMIN` | API lỗi khi tải chi tiết hồ sơ (`API 500 / Network Error`) | Tạm thời ngắt kết nối Backend hoặc giả lập lỗi 500 khi gọi API `getCase(id)`. | 1. Mở chi tiết một hồ sơ trên trình duyệt.<br>2. Quan sát phản hồi trên UI khi API thất bại. | Trang **không bị trắng nhầm thành 404/Empty State**. Hiển thị banner cảnh báo đỏ với thông điệp lỗi rõ ràng kèm nút **Thử lại (`Thử lại`)**. | *[Cán bộ điền]* | `[ ]` | Gia cố Error State trang chi tiết. |
| **NEG-02** | `STAFF` | API lỗi khi tải danh sách hồ sơ (`List API Failure`) | Giả lập mất kết nối mạng khi đang ở trang danh sách hồ sơ TTHC. | 1. Nhấn nút làm mới danh sách hoặc chuyển bộ lọc.<br>2. Quan sát khung danh sách hồ sơ. | Trang hiển thị banner lỗi đỏ kèm nút **Thử lại (`Thử lại`)**. ❌ **Tuyệt đối không hiển thị nhầm thành Empty State** ("Chưa có hồ sơ thủ tục hành chính nào phù hợp"). | *[Cán bộ điền]* | `[ ]` | Gia cố Error State trang danh sách. |
| **NEG-03** | `STAFF` | Mở hồ sơ không tồn tại (`Case Not Found 404`) | Nhập trực tiếp trên thanh địa chỉ URL: `http://localhost:5173/procedure-cases/invalid-id-9999`. | 1. Truy cập URL với ID hồ sơ không tồn tại.<br>2. Quan sát thông báo trả về. | Hệ thống bắt lỗi 404 từ API và hiển thị thông báo rõ ràng: "Không tìm thấy thông tin hồ sơ thủ tục hành chính" kèm nút quay lại danh sách. | *[Cán bộ điền]* | `[ ]` | Xử lý lỗi 404 trực quan. |
| **NEG-04** | `STAFF` | Hồ sơ chưa có AI analysis (`No AI Analysis State`) | Mở một hồ sơ TTHC vừa tiếp nhận, chưa từng chạy rà soát AI lần nào. | 1. Chuyển sang Tab **AI Review**.<br>2. Cuộn xuống section **Dự thảo / In / Xuất văn bản**. | Section vẫn hiển thị nhưng thông báo rõ: **"Chưa có kết quả AI để tạo bản dự thảo/in/xuất"**. Các nút Xuất Word/In bị vô hiệu hóa. | *[Cán bộ điền]* | `[ ]` | Section xuất văn bản không biến mất im lặng. |
| **NEG-05** | `ADMIN` | Hồ sơ cũ thiếu Legal Snapshot (`Missing Snapshot Warning`) | Mở một hồ sơ TTHC cũ (tạo trước khi có tính năng legal snapshot), đã có kết quả AI Review cũ. | 1. Chuyển sang Tab **AI Review** hoặc **Legal Snapshot**.<br>2. Kiểm tra phần hiển thị Căn cứ pháp lý. | Hệ thống hiển thị khối cảnh báo thông báo rõ: Hồ sơ chưa có bản chụp nhanh căn cứ pháp lý (`Legal Snapshot`). Yêu cầu cán bộ đối chiếu thủ công hoặc chạy lại AI Review. | *[Cán bộ điền]* | `[ ]` | Xử lý an toàn cho dữ liệu lịch sử. |
| **NEG-06** | `STAFF` | Thao tác vượt quyền (`Unauthorized Action 403`) | Tài khoản `STAFF` cố tình truy cập thẳng vào URL trang quản trị nhạy cảm (hoặc gọi API rollback). | 1. Truy cập hoặc gửi request trái quyền.<br>2. Kiểm tra phản hồi của hệ thống. | Hệ thống từ chối truy cập, trả về cảnh báo HTTP 403 Forbidden hoặc chuyển hướng về trang chủ kèm thông báo không đủ thẩm quyền. | *[Cán bộ điền]* | `[ ]` | Bảo mật phân quyền nghiêm ngặt. |
| **NEG-07** | `ADMIN` | Xuất Word gặp lỗi phía server (`Export API Failure`) | Giả lập lỗi server khi đang tạo file Word (ví dụ: lỗi bộ nhớ hoặc lỗi thư viện `docx`). | 1. Nhấn nút **Xuất file Word (.docx)**.<br>2. Quan sát phản hồi khi API export trả lỗi 500. | Hệ thống hiển thị hộp thoại `alert(getApiErrorMessage(err) || 'Không thể xuất file Word phiếu rà soát')`. Không để treo loading vĩnh viễn. | *[Cán bộ điền]* | `[ ]` | Xử lý ngoại lệ khi xuất văn bản. |

---

## 8. Export Safety Test Cases

Bộ 5 kịch bản kiểm thử an toàn xuất văn bản (`Export Safety Test Cases`), bảo đảm 100% tài liệu rời khỏi hệ thống đều an toàn pháp lý:

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **EXP-01** | `ADMIN`<br>`STAFF` | Kiểm tra tên file tải về (`Filename Prefix Enforcement`) | Hồ sơ Cấp GCN lần đầu / Chuyển mục đích đã có AI Review hợp lệ. | 1. Nhấn nút **Xuất file Word (.docx)**.<br>2. Kiểm tra tên file lưu trong thư mục máy tính. | Tên file **BẮT BUỘC** bắt đầu bằng tiền tố: `DU_THAO_GOI_Y_AI_phieu-ra-soat-...docx`. | *[Cán bộ điền]* | `[ ]` | Kiểm chứng cả từ Backend lẫn Frontend. |
| **EXP-02** | `ADMIN`<br>`STAFF` | Kiểm tra nội dung văn bản Word (`Word Document Safety Banner`) | Đã mở file Word (`.docx`) vừa tải xuống bằng Microsoft Word. | 1. Rà soát trang đầu tiên của file Word.<br>2. Kiểm tra phần tiêu đề và khối thông báo. | Ngay đầu tài liệu có khối cảnh báo viền vàng ghi rõ: **`BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`** kèm tuyên bố từ chối trách nhiệm pháp lý. | *[Cán bộ điền]* | `[ ]` | Văn bản không gây hiểu nhầm là quyết định cuối. |
| **EXP-03** | `ADMIN`<br>`STAFF` | Kiểm tra không tự động ký số (`Zero Auto-Signature Verification`) | Kiểm tra toàn bộ nội dung file Word và bản Xem trước PDF. | 1. Cuộn đến cuối tài liệu xuất ra.<br>2. Rà soát phần chữ ký, con dấu. | Phần cuối văn bản chỉ có khung chữ ký trống để cán bộ thẩm định ký duyệt sau khi đối chiếu. ❌ **Hoàn toàn không có chữ ký số tự động hay con dấu đỏ giả lập**. | *[Cán bộ điền]* | `[ ]` | Tuân thủ nguyên tắc không tự ký. |
| **EXP-04** | `STAFF` | Kiểm tra không tự động gửi văn bản (`No Auto-Dispatch Audit`) | Vừa hoàn tất chạy AI Review và tải phiếu rà soát Word cho hồ sơ TTHC. | 1. Kiểm tra nhật ký hệ thống và hòm thư công dân.<br>2. Xác minh trạng thái hồ sơ trên hệ thống. | Hệ thống **không tự động gửi email, SMS hay thông báo Zalo** cho người sử dụng đất. Hồ sơ vẫn nằm yên tại chỗ để cán bộ thẩm định tiếp. | *[Cán bộ điền]* | `[ ]` | Tuân thủ nguyên tắc không tự gửi. |
| **EXP-05** | `STAFF` | Kiểm tra không tự đổi trạng thái hồ sơ (`Zero Status Mutability`) | Hồ sơ trước khi chạy AI Review đang ở trạng thái `RECEIVED`. | 1. Chạy rà soát AI (kể cả khi AI đánh giá hồ sơ đủ điều kiện 100%).<br>2. Quay lại trang chi tiết kiểm tra lại Trạng thái hồ sơ. | Trạng thái hồ sơ **VẪN LÀ `RECEIVED`**. Trợ lý AI không bao giờ tự động chuyển trạng thái sang `COMPLETED` hay `APPROVED`. | *[Cán bộ điền]* | `[ ]` | Chỉ có thao tác nghiệp vụ mới đổi được trạng thái. |

---

## 9. AI Governance Test Cases

Bộ 5 kịch bản kiểm chứng triết lý quản trị AI (`AI Governance Test Cases`), khẳng định sự tuân thủ tuyệt đối quy định quản lý TTHC đất đai:

| Test ID | Role | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **GOV-01** | `ADMIN`<br>`MANAGER` | AI không kết luận thay cán bộ (`No AI Auto-Conclusion`) | Chạy AI Review trên một hồ sơ đất đai có tình trạng tranh chấp phức tạp. | 1. Đọc toàn bộ văn bản phản hồi của Trợ lý AI.<br>2. Rà soát câu chữ trong phần Khuyến nghị xử lý. | AI sử dụng các ngôn ngữ khuyến nghị, gợi ý, đối chiếu ("Đề nghị chuyên viên đối chiếu khoản X..."). ❌ **Tuyệt đối không dùng các từ ngữ phán quyết thay Lãnh đạo** ("Quyết định cấp sổ ngay"). | *[Cán bộ điền]* | `[ ]` | AI là trợ lý tham mưu nội bộ. |
| **GOV-02** | `STAFF` | AI chỉ mang tính chất gợi ý (`AI as Advisory Tool Only`) | Mở phiếu rà soát chuyên môn Word và màn hình UI Tab AI Review. | 1. Đối chiếu kết quả gợi ý của AI với hồ sơ gốc của công dân.<br>2. Thử nghiệm việc cán bộ đưa ra ý kiến thẩm định khác với AI. | Hệ thống cho phép cán bộ ghi chú, điều chỉnh và ra kết luận thẩm định cuối cùng khác với gợi ý của Trợ lý AI. | *[Cán bộ điền]* | `[ ]` | Cán bộ giữ quyền quyết định tối thượng. |
| **GOV-03** | `STAFF` | Cán bộ bắt buộc phải rà soát (`Human-in-the-Loop Enforcement`) | Mở quy trình thẩm định trên hệ thống LegalFlow v2. | 1. Kiểm tra luồng chuyển tiếp trạng thái hồ sơ.<br>2. Xác minh bước phê duyệt cuối cùng. | Mọi phiếu trình duyệt trước khi Lãnh đạo (`MANAGER`) ký ban hành đều phải qua tay chuyên viên (`STAFF`) kiểm tra thực tế và ký xác nhận thủ công. | *[Cán bộ điền]* | `[ ]` | Human-in-the-Loop là bắt buộc. |
| **GOV-04** | `ALL` | Minh bạch Legal Snapshot & Warning (`Auditability & Transparency`) | Mở bất kỳ hồ sơ nào đã chạy AI Review thành công. | 1. Kiểm tra Tab **AI Review** và Tab **Legal Snapshot**.<br>2. Rà soát thông tin phiên bản prompt và luật. | Hiển thị minh bạch, đầy đủ Cảnh báo AI (`AI Warning`) và Bản chụp nhanh căn cứ pháp lý (`Legal Snapshot`), bảo đảm khả năng truy vết và giải trình. | *[Cán bộ điền]* | `[ ]` | Bảo đảm tính minh bạch trong hành chính công. |
| **GOV-05** | `ALL` | Output không gây hiểu nhầm là quyết định cuối (`Zero Misleading Output`) | Rà soát toàn bộ giao diện UI, file Word (`.docx`) và file PDF xem trước của phiếu rà soát. | 1. Rà soát tiêu đề, chân trang, hình mờ (`Watermark`).<br>2. Kiểm tra xem có dấu hiệu giả lập quyết định hành chính không. | Toàn bộ tài liệu đều ghi rõ "Phiếu rà soát chuyên môn - Bản gợi ý hỗ trợ nội bộ". Không có bất kỳ hình thức hay câu chữ nào gây hiểu nhầm là Quyết định hành chính cuối cùng. | *[Cán bộ điền]* | `[ ]` | Bảo vệ uy tín của cơ quan quản lý nhà nước. |
