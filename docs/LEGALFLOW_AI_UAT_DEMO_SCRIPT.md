# Kịch Bản Demo & Tài Liệu Kiểm Thử Chấp Nhận Người Dùng (UAT) – LegalFlow AI

**Phiên bản hệ thống:** `v2.2.2-ai-phase4b-complete`  
**Đối tượng sử dụng:** Hội đồng thẩm định, Lãnh đạo UBND, Cán bộ Tiếp công dân & Địa chính - Tư pháp, Chuyên viên kiểm thử UAT  
**Ngày phát hành:** 28/06/2026  

---

## 1. Mục Tiêu Demo LegalFlow AI

Tài liệu này cung cấp kịch bản trình diễn (Demo) toàn diện và bảng kiểm thử chấp nhận người dùng (UAT) cho phân hệ **Trợ lý Thông minh LegalFlow AI**. Mục tiêu của buổi demo là minh chứng khả năng ứng dụng trí tuệ nhân tạo vào quy trình giải quyết đơn thư khiếu nại, tố cáo, kiến nghị, phản ánh tại cấp xã/phường, giúp:
* **Tự động hóa các khâu xử lý ban đầu:** Giảm 50-70% thời gian đọc hiểu, tóm tắt, phân loại đơn thư và soạn thảo văn bản hành chính.
* **Chuẩn hóa quy trình thụ lý:** Đưa ra lộ trình xử lý và checklist nghiệp vụ 6 nhóm theo đúng quy định pháp luật.
* **Minh chứng tính an toàn & tuân thủ pháp lý:** Khẳng định nguyên tắc **Human-in-the-Loop** (Con người giữ vai trò kiểm soát và quyết định cuối cùng), đảm bảo hệ thống không vượt quyền hay tự ý ra quyết định thay cho cơ quan nhà nước.

---

## 2. Kịch Bản Demo Chuẩn: Xử Lý Hồ Sơ Đơn Thư Đất Đai Từ Đầu Đến Cuối

Kịch bản dẫn dắt người xem qua toàn bộ vòng đời xử lý một hồ sơ khiếu nại tranh chấp ranh giới đất đai điển hình tại UBND cấp xã:

### Bước 1: Tiếp nhận & Mở hồ sơ trên hệ thống
* **Thao tác:** Cán bộ đăng nhập vào cổng LegalFlow (`http://localhost:5173`), vào danh sách hồ sơ và mở chi tiết một hồ sơ đơn thư về đất đai đang ở trạng thái *Mới tiếp nhận (`NEW`)*.
* **Điểm nhấn thuyết minh:** Thể hiện giao diện quản lý hồ sơ trực quan, lưu ý trạng thái hiện tại là `NEW` và cán bộ đang được phân công xử lý.

### Bước 2: AI Phân tích, Tóm tắt & Phân loại đơn (Phase 2)
* **Thao tác:** Nhấn chuyển sang tab **"✨ Trợ lý AI"** ở cột menu bên trái. Tại khối phân tích, nhấn nút **"✨ AI Phân tích Đơn"**.
* **Hiển thị:** Sau 1 giây, AI hiển thị bản tóm tắt ngắn gọn nội dung vụ việc, phân loại loại đơn (*Khiếu nại - `KN`* hoặc *Kiến nghị phản ánh - `PA`*), lĩnh vực (*Đất đai - `DAT_DAI`*) kèm chỉ số độ tin cậy và lý do đề xuất.
* **Thao tác kiểm duyệt:** Cán bộ kiểm tra, đối chiếu nội dung đơn gốc rồi nhấn **"✔️ Chấp nhận đề xuất"**. Hệ thống tự động điền thông tin tóm tắt và phân loại vào hồ sơ.
* **Điểm nhấn thuyết minh:** Nhấn mạnh trạng thái hồ sơ vẫn giữ nguyên là `NEW`, AI chỉ giúp điền trường dữ liệu chứ không tự ý chuyển bước quy trình.

### Bước 3: AI Gợi ý Quy trình & Checklist nghiệp vụ (Phase 3)
* **Thao tác:** Cuộn xuống khối **"📋 Đề xuất Quy trình & Checklist xử lý đơn"**, nhấn nút **"✨ AI Gợi ý Quy trình Xử lý"**.
* **Hiển thị:** AI phân tích và trả về lưới 6 nhóm nghiệp vụ chuẩn xác: *Việc cần làm*, *Tài liệu cần kiểm tra*, *Bộ phận phối hợp*, *Thời hạn lưu ý*, *Rủi ro pháp lý*, *Đề xuất bước tiếp theo*. Các mục được gắn sẵn tiền tố `[AI - ...]`.
* **Thao tác kiểm duyệt:** Cán bộ tick chọn 3-4 đầu việc phù hợp với tình hình thực tế địa phương, bỏ tích các mục không cần thiết, rồi nhấn **"✔️ Áp dụng checklist vào hồ sơ"**. Hệ thống tự động chuyển sang tab **"Checklist"**.
* **Điểm nhấn thuyết minh:** Thể hiện sự kiểm soát chi tiết (granular control), cán bộ chọn gì hệ thống lưu nấy, không ép buộc áp dụng toàn bộ.

### Bước 4: AI Soạn thảo văn bản nháp nội bộ (Phase 4A & 4B)
* **Thao tác:** Quay lại tab **"✨ Trợ lý AI"**, cuộn xuống khối **"📝 Soạn thảo văn bản nháp thông minh"**.
* **Thử nghiệm soạn thảo:**
  1. Chọn loại văn bản: **Giấy mời làm việc / đối thoại (`GIAY_MOI_LAM_VIEC`)**. Nhập hướng dẫn bổ sung: *"Mời làm việc lúc 8h30 sáng thứ Sáu, mang theo sổ đỏ gốc"*. Nhấn **"✨ Tạo bản nháp AI"**.
  2. Quan sát khung trình soạn thảo xuất hiện dòng nhãn cảnh báo vàng và các vùng giữ chỗ placeholder `[Cán bộ bổ sung...]`. Cán bộ thực hiện gõ sửa trực tiếp trên ô Textarea để điền số công văn, ngày tháng.
  3. Nhấn **"💾 Lưu vào ghi chú hồ sơ"**. Hệ thống báo thành công và chuyển sang tab **"Lịch sử xử lý / Ghi chú"**.
* **Điểm nhấn thuyết minh:** Chỉ rõ bản thảo đã được lưu dưới dạng ghi chú nội bộ kèm tiền tố `[AI Dự thảo - Giấy mời làm việc]`. Khẳng định văn bản CHƯA ĐƯỢC PHÁT HÀNH và chưa gửi đi đâu.

### Bước 5: Kiểm tra Lịch sử Kiểm toán (`AiAuditLog`)
* **Thao tác:** Mở công cụ quản trị hoặc truy vấn cơ sở dữ liệu để trình chiếu bảng nhật ký hệ thống.
* **Điểm nhấn thuyết minh:** Chỉ ra từng cú click chuột của cán bộ (từ việc chấp nhận tóm tắt, áp dụng checklist đến lưu bản nháp) đều được lưu vết đầy đủ trong `AiAuditLog` với các trạng thái `ACCEPTED` / `REJECTED`, đảm bảo tính minh bạch và trách nhiệm giải trình tuyệt đối.

---

## 3. Danh Sách Chức Năng AI Đã Hoàn Thành (Phase 1 – Phase 4B)

| Giai đoạn | Tên chức năng | Mô tả chi tiết năng lực | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Phase 1** | Cấu trúc hạ tầng AI & Prompt Engine | Xây dựng kiến trúc Provider đa hình (Hỗ trợ Gemini/OpenAI), dịch vụ Prompt Builder và hệ thống lưu vết kiểm toán `AiAuditLog`. | ✅ Đã hoàn thành |
| **Phase 2** | AI Phân tích, Tóm tắt & Phân loại đơn | Tự động đọc nội dung đơn thư, tóm tắt ý chính, nhận diện loại đơn (`KN`, `TC`, `PA`) và lĩnh vực giải quyết (`DAT_DAI`, `XAY_DUNG`...); ghi feedback vào DB. | ✅ Đã hoàn thành |
| **Phase 3** | AI Checklist & Gợi ý quy trình xử lý | Phân tích vụ việc để đưa ra checklist nghiệp vụ theo 6 nhóm chuẩn hóa; hỗ trợ tick chọn từng mục và gắn tiền tố `[AI - ...]`. | ✅ Đã hoàn thành |
| **Phase 4A** | AI Soạn thảo văn bản nháp (Bước đầu) | Tự động sinh bản thảo nội bộ cho **Phiếu xử lý đơn** và **Giấy mời làm việc**; cho phép hiệu chỉnh và lưu vào `CaseNote`. | ✅ Đã hoàn thành |
| **Phase 4B** | AI Soạn thảo văn bản nháp (Mở rộng) | Mở rộng soạn thảo thêm 4 loại: **Thông báo thụ lý**, **Thông báo không thụ lý**, **Văn bản chuyển đơn**, **Trả lời công dân dự thảo** kèm placeholder `[Cán bộ bổ sung...]`. | ✅ Đã hoàn thành |

---

## 4. Các Thông Điệp Cốt Lõi Cần Nhấn Mạnh Khi Demo

Trong suốt buổi trình diễn, người thuyết trình cần liên tục nhắc lại **05 nguyên tắc an toàn vàng (Human-in-the-Loop)** của LegalFlow AI:

> [!IMPORTANT]
> **1. AI chỉ hỗ trợ, không thay thế con người:** Trợ lý AI đóng vai trò như một thư ký hành chính mẫn cán, giúp chuẩn bị hồ sơ và đề xuất ý tưởng.  
> **2. Cán bộ quyết định cuối cùng:** Cán bộ thụ lý là người duy nhất có thẩm quyền thẩm định, chỉnh sửa và chịu trách nhiệm pháp lý trước khi áp dụng bất kỳ gợi ý nào.  
> **3. Tuyệt đối không tự ban hành hay gửi văn bản:** Hệ thống không kết nối với cổng gửi email/SMS hay tự động tạo file văn bản pháp lý chính thức gửi cho công dân. Mọi bản thảo chỉ nằm ở vùng lưu trữ nội bộ (`CaseNote`).  
> **4. Tuyệt đối không tự đổi trạng thái hồ sơ:** Việc sử dụng AI không làm thay đổi trạng thái vụ việc (`LegalCase.status` giữ nguyên `NEW`, `IN_PROGRESS`...) hay cán bộ được phân công.  
> **5. Kiểm toán toàn diện 100%:** Mọi tương tác chấp nhận hay từ chối AI đều được ghi lại dấu vết thời gian và người thao tác trong `AiAuditLog`.

---

## 5. Checklist UAT Dành Cho Người Dùng Thử nghiệm

Dưới đây là bảng kiểm thử dành cho các chuyên viên đánh giá độc lập hoặc cán bộ nghiệp vụ khi test hệ thống:

| STT | Chức năng kiểm thử | Kết quả mong muốn | Đạt / Chưa đạt | Ghi chú / Lỗi phát sinh |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Nút *"✨ AI Phân tích Đơn"* | Hiển thị đúng tóm tắt, loại đơn, lĩnh vực và chỉ số độ tin cậy. Cảnh báo Human-in-the-Loop xuất hiện rõ ràng. | [ ] | |
| **2** | Nút *"✔️ Chấp nhận đề xuất"* (Phân loại) | Cập nhật tóm tắt và phân loại vào form hồ sơ. Trạng thái hồ sơ (`status`) giữ nguyên không đổi. | [ ] | |
| **3** | Nút *"❌ Từ chối đề xuất"* (Phân loại) | Form hồ sơ không bị ghi đè. Ghi nhận `userFeedback = REJECTED` vào log. | [ ] | |
| **4** | Nút *"✨ AI Gợi ý Quy trình Xử lý"* | Hiển thị đầy đủ 6 khung nhóm checklist nghiệp vụ. Các đầu việc đều có tiền tố `[AI - ...]`. | [ ] | |
| **5** | Tick chọn & *"✔️ Áp dụng checklist"* | Các mục đã chọn được thêm vào tab Checklist của hồ sơ. Cục bộ không tạo trùng lặp nếu bấm nhiều lần. | [ ] | |
| **6** | Dropdown *Loại văn bản nháp* | Hiển thị đầy đủ 6 loại văn bản nghiệp vụ (Phiếu xử lý, Giấy mời, TB Thụ lý, TB Không thụ lý, VB Chuyển đơn, Trả lời CD). | [ ] | |
| **7** | Nút *"✨ Tạo bản nháp AI"* | Textarea hiển thị bản nháp chuẩn văn phong hành chính kèm nhãn cảnh báo đầu tiên và các placeholder `[Cán bộ bổ sung...]`. | [ ] | |
| **8** | Chỉnh sửa Textarea & *"💾 Lưu ghi chú"* | Nội dung đã chỉnh sửa được lưu trọn vẹn vào `CaseNote` với đúng tiền tố chuẩn (`[AI Dự thảo - ...]`). Chuyển hướng sang tab Lịch sử. | [ ] | |
| **9** | Nút *"❌ Không sử dụng bản nháp"* | Form soạn thảo bị xóa trắng, không tạo bất kỳ ghi chú rác nào vào hồ sơ. | [ ] | |
| **10** | Bất biến dữ liệu cốt lõi | Sau toàn bộ các bước trên, kiểm tra `LegalCase.status` và `assignedToId` vẫn giữ nguyên giá trị ban đầu. | [ ] | |

---

## 6. Các Lệnh SQL Kiểm Chứng Nhanh Dưới Cơ Sở Dữ Liệu

Trong quá trình UAT, kỹ thuật viên có thể sử dụng các lệnh SQL sau (chạy qua Prisma Studio hoặc PostgreSQL CLI) để đối chứng dữ liệu thực tế (thay `<YOUR_CASE_ID>` bằng mã ID hồ sơ kiểm thử):

### 1. Kiểm tra Ghi chú bản nháp AI (`CaseNote`)
```sql
SELECT id, "caseId", "userId", content, "createdAt" 
FROM "CaseNote" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND content LIKE '[AI Dự thảo - %]'
ORDER BY "createdAt" DESC;
```
*Xác nhận:* Có bản ghi chứa đúng tiền tố của loại văn bản đã lưu kèm nội dung đã được cán bộ chỉnh sửa.

### 2. Kiểm tra Danh mục công việc AI (`CaseChecklistItem`)
```sql
SELECT id, "caseId", title, "isCompleted", "createdAt" 
FROM "CaseChecklistItem" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND title LIKE '[AI - %]'
ORDER BY "createdAt" DESC;
```
*Xác nhận:* Trả về chính xác các đầu việc mà cán bộ đã tick chọn trên UI.

### 3. Kiểm tra Nhật ký kiểm toán AI (`AiAuditLog`)
```sql
SELECT id, "caseId", "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>'
ORDER BY "createdAt" DESC;
```
*Xác nhận:* Các hành động `SUMMARIZE`, `CLASSIFY`, `CHECKLIST`, `DRAFT` đều được ghi lại với `userFeedback` tương ứng (`ACCEPTED` hoặc `REJECTED`).

### 4. Kiểm tra Tính bất biến của Hồ sơ (`LegalCase.status`)
```sql
SELECT id, "caseCode", status, "assignedToId", "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```
*Xác nhận:* Trường `status` và `assignedToId` tuyệt đối không bị thay đổi bởi AI.

---

## 7. Giới Hạn Hiện Tại & Khuyến Nghị Trước Khi Vận Hành Thực Tế

### Ghi chú về chế độ Giả lập (Mock Gemini)
> [!NOTE]
> Hiện tại, nếu hệ thống chưa được cấu hình biến môi trường `GEMINI_API_KEY` (API Key thật của Google Gemini) trong file `.env` của backend, LegalFlow AI sẽ tự động kích hoạt **Chế độ Giả lập (`gemini-1.5-pro-mock`)**.  
> Ở chế độ này, các phản hồi phân tích, checklist và bản nháp là các dữ liệu mẫu thông minh được lập trình sẵn theo từ khóa hồ sơ. Điều này đảm bảo buổi Demo và quá trình UAT diễn ra nhanh chóng, ổn định 100%, không bị phụ thuộc vào tốc độ mạng hay chi phí token API bên ngoài.

### Rủi ro còn lại & Khuyến nghị khi triển khai Production
1. **Rủi ro sai lệch biểu mẫu địa phương:** Khi sử dụng LLM thực tế, văn bản nháp có thể không khớp 100% với thể thức riêng của từng địa phương.  
   👉 *Khuyến nghị:* Quán triệt cán bộ thụ lý luôn phải rà soát và chỉnh sửa trên Textarea trước khi lưu/trình ký. Tận dụng tối đa ô hướng dẫn bổ sung để điều hướng văn phong cho AI.
2. **Rủi ro suy diễn điều khoản pháp lý (Hallucination):** LLM có thể viện dẫn các nghị định, thông tư đã hết hiệu lực.  
   👉 *Khuyến nghị:* Duy trì các quy tắc prompt hiện tại (yêu cầu AI để trống `[Cán bộ bổ sung căn cứ pháp lý]` nếu không chắc chắn).
3. **Bảo mật dữ liệu cá nhân (PII):** Khi gửi nội dung đơn thư lên cloud AI (Google Gemini public cloud), thông tin nhạy cảm của công dân có thể bị xử lý trên máy chủ bên ngoài.  
   👉 *Khuyến nghị:* Khi triển khai chính thức cho các cơ quan khối nhà nước, khuyến nghị tích hợp hệ thống với các mô hình LLM chuyên biệt triển khai nội bộ (On-premise Private LLM) thông qua kiến trúc `IAiProvider` đã được chuẩn hóa sẵn của LegalFlow.
