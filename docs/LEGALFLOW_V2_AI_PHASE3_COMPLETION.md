# Báo Cáo Hoàn Thành Triển Khai LegalFlow v2 AI – Phase 3 (AI Checklist & Gợi Ý Quy Trình Xử Lý Đơn)

**Phiên bản / Tag:** `v2.1.0-ai-phase3-checklist`  
**Ngày hoàn thành:** 27/06/2026  

---

## 1. Mục Tiêu Phase 3

Mục tiêu chính của Phase 3 là trang bị cho cán bộ thụ lý hồ sơ cấp xã một công cụ trợ lý thông minh có khả năng phân tích vụ việc cụ thể (loại đơn, lĩnh vực, tóm tắt nội dung và yêu cầu của công dân) để tự động đề xuất **Quy trình giải quyết & Checklist nghiệp vụ thụ lý chuẩn xác**. 

Thay vì cán bộ phải tự tra cứu các bước xác minh phức tạp hoặc dễ bỏ sót thủ tục pháp lý, Trợ lý AI sẽ tổng hợp và trình bày lộ trình thụ lý theo 6 nhóm nghiệp vụ rõ ràng, hỗ trợ tối đa cho công tác giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh.

---

## 2. Nguyên Tắc Cốt Lõi (Human-in-the-Loop)

Toàn bộ thiết kế và kiến trúc của Phase 3 tuân thủ tuyệt đối nguyên tắc **Human-in-the-Loop** (Con người giữ vai trò kiểm soát và ra quyết định cuối cùng):

1. **AI chỉ hỗ trợ gợi ý, không tự động ra quyết định:** Cán bộ thụ lý luôn phải xem xét, đối chiếu quy định pháp luật hiện hành trước khi áp dụng bất kỳ bước checklist nào do AI đề xuất. Cảnh báo pháp lý nhắc nhở trách nhiệm cán bộ được hiển thị nổi bật trên giao diện.
2. **Quyền lựa chọn chi tiết (Granular Control):** Giao diện bắt buộc cho phép cán bộ tick chọn từng mục muốn áp dụng vào hồ sơ thực tế. Hệ thống tuyệt đối không tự động áp dụng toàn bộ danh sách đề xuất.
3. **Tuyệt đối không thay đổi trạng thái hồ sơ (`LegalCase.status`):** Thao tác áp dụng checklist chỉ thêm các đầu việc cần làm vào hồ sơ, không can thiệp hay làm thay đổi trạng thái quy trình của hồ sơ (ví dụ: hồ sơ đang ở trạng thái `NEW` sẽ giữ nguyên 100% `NEW`).
4. **Tuyệt đối không tự động giao việc (`assignedToId`):** AI không có quyền tự phân công nhiệm vụ cho cán bộ hay nhân sự thuộc bộ phận phối hợp. Việc phân công hoàn toàn do người có thẩm quyền thực hiện thủ công.
5. **Tuyệt đối không tự động gửi văn bản:** AI gợi ý danh mục tài liệu và các văn bản cần chuẩn bị/phối hợp, nhưng hệ thống không tự động gửi email, SMS hay văn bản phản hồi cho công dân.
6. **Kiểm toán minh bạch (Audit Logging):** Mọi hành động tiếp nhận (`ACCEPTED`) hay từ chối (`REJECTED`) đề xuất quy trình AI đều được lưu vết đầy đủ vào bảng `AiAuditLog`.

---

## 3. Các Chức Năng Đã Hoàn Thành

* **Gợi ý quy trình theo 6 nhóm chuẩn nghiệp vụ:** API AI tự động phân loại các bước cần làm thành 6 nhóm mạch lạc:
  1. 📋 *Việc cần làm (Tasks)*: Các bước thụ lý, xác minh thực địa, tổ chức đối thoại...
  2. 📁 *Tài liệu cần kiểm tra (Documents)*: Giấy chứng nhận quyền sử dụng đất, biên bản hòa giải, trích lục bản đồ...
  3. 🤝 *Bộ phận/cán bộ phối hợp (Coordination)*: Cán bộ địa chính xã, tư pháp - hộ tịch, trưởng thôn/khu phố...
  4. ⏰ *Thời hạn lưu ý (Deadlines)*: Mốc thời gian thụ lý, giải quyết theo Luật Khiếu nại, Luật Đất đai...
  5. ⚠️ *Rủi ro nghiệp vụ/pháp lý (Risks)*: Nguy cơ khiếu kiện vượt cấp, tranh chấp kéo dài, hết thời hiệu...
  6. 🚀 *Đề xuất bước tiếp theo (Next Steps)*: Soạn thảo thông báo thụ lý, mời công dân làm việc...
* **Tiền tố định danh AI (`[AI - ...]`)**: Các mục checklist được AI tạo ra khi áp dụng vào hồ sơ đều được gắn tiền tố rõ ràng (`[AI - Việc cần làm]`, `[AI - Tài liệu]`, `[AI - Thời hạn]`...) giúp cán bộ dễ dàng phân biệt với các mục do người dùng tự tạo thủ công.
* **Cơ chế chống trùng lặp (De-duplication):** Khi cán bộ nhấn áp dụng nhiều lần hoặc chọn lại các đầu việc đã có, hệ thống tự động kiểm tra tiêu đề (`title`) trong bảng `CaseChecklistItem` để lọc bỏ các mục trùng lặp, giữ cho danh sách công việc gọn gàng.
* **Tích hợp liền mạch trên Giao diện (`CaseDetail.tsx`):** Bổ sung khối **"📋 Đề xuất Quy trình & Checklist xử lý đơn"** bên trong tab **"✨ Trợ lý AI"** của trang quản lý chi tiết hồ sơ. Chuyển hướng thông minh sang tab Checklist sau khi áp dụng thành công.

---

## 4. Danh Sách File Chính Đã Thay Đổi

### Backend NestJS (`legalflow-backend/`)
* `src/ai/interfaces/ai-provider.interface.ts`: Bổ sung interface `AiChecklistGroups` cấu trúc 6 mảng nghiệp vụ và cập nhật `AiChecklistResponse`.
* `src/ai/providers/gemini.provider.ts`: Nâng cấp prompt LLM và logic mock provider để tạo dữ liệu chuẩn 6 nhóm kèm tiền tố `[AI - ...]`.
* `src/ai/dto/suggest-checklist.dto.ts`: Mở rộng DTO hỗ trợ nhận ngữ cảnh hồ sơ (`type`, `field`, `summary`, `request`).
* `src/ai/dto/ai-feedback.dto.ts`: Bổ sung trường `feedbackType` (nhận giá trị `'CHECKLIST'`) và mảng `checklistItems`.
* `src/ai/ai.service.ts`: Xử lý luồng nghiệp vụ `submitFeedback` cho checklist: bulk create vào `CaseChecklistItem`, kiểm tra trùng lặp và ghi nhận vào `AiAuditLog`.
* `src/ai/ai.service.spec.ts`: Bổ sung bộ unit test tự động xác minh tính năng gợi ý và ghi nhận checklist.

### Frontend React / Vite (`src/`)
* `src/lib/api-types.ts`: Thêm interface `AiChecklistGroups` và `AiChecklistResponse`.
* `src/lib/casesApi.ts`: Thêm hàm gọi API `aiSuggestChecklist` và mở rộng tham số cho `aiSubmitFeedback`.
* `src/pages/CaseDetail.tsx`: Cập nhật giao diện tab "✨ Trợ lý AI", hiển thị lưới 6 nhóm checklist, hộp thoại tick-box chọn từng mục và các nút hành động tuân thủ Human-in-the-Loop.

---

## 5. Hướng Dẫn Kiểm Thử Thủ Công Trên Giao Diện

1. **Đăng nhập hệ thống:** Mở trình duyệt truy cập `http://localhost:5173` và đăng nhập với tài khoản cán bộ thụ lý.
2. **Truy cập chi tiết hồ sơ:** Chọn một hồ sơ bất kỳ từ danh sách (ví dụ hồ sơ tranh chấp đất đai đang ở trạng thái Mới tiếp nhận - `NEW`). Note lại trạng thái hiện tại của hồ sơ.
3. **Mở Trợ lý AI:** Nhấn vào tab **"✨ Trợ lý AI"** ở cột menu điều hướng bên trái.
4. **Yêu cầu gợi ý quy trình:** Cuộn xuống khối **"📋 Đề xuất Quy trình & Checklist xử lý đơn"**, nhấn nút **"✨ AI Gợi ý Quy trình Xử lý"**.
5. **Kiểm tra giao diện:** Quan sát cảnh báo pháp lý nền vàng xuất hiện, bên dưới là 6 khung phân loại hiển thị các đầu việc gợi ý đã gắn sẵn tiền tố như `[AI - Việc cần làm] Kiểm tra hồ sơ địa chính...`.
6. **Thao tác chọn lọc:** Tick chọn thử 2 - 3 mục trong nhóm Việc cần làm và Tài liệu cần kiểm tra. Bỏ tích các mục không cần thiết.
7. **Áp dụng vào hồ sơ:** Nhấn nút **"✔️ Áp dụng checklist vào hồ sơ"**. Hệ thống hiển thị thông báo thành công và tự động chuyển giao diện sang tab **"Checklist"**.
8. **Xác minh kết quả UI:** Tại tab Checklist, nhìn thấy các dòng công việc vừa chọn xuất hiện ở trạng thái chưa hoàn thành (`isCompleted = false`).
9. **Xác minh tính nguyên vẹn trạng thái:** Chuyển về tab **"Thông tin chung"**, xác nhận trạng thái hồ sơ vẫn giữ nguyên là `NEW` (Mới tiếp nhận), không bị tự động đổi.
10. **Kiểm thử từ chối:** Quay lại tab Trợ lý AI, nhấn **"❌ Không áp dụng"**, thông báo từ chối thành công hiện ra và không có checklist nào bị tạo nhầm.

---

## 6. Lệnh SQL Kiểm Chứng Dữ Liệu (PostgreSQL / Prisma Studio)

Sau khi kiểm thử thủ công, sử dụng các lệnh SQL sau (chạy trong Prisma Studio hoặc qua `psql` Docker) để xác minh tính chính xác dưới tầng cơ sở dữ liệu (thay `<YOUR_CASE_ID>` bằng ID hồ sơ thực tế):

### 1. Kiểm tra bảng `CaseChecklistItem` (Đảm bảo tạo đúng mục đã chọn kèm tiền tố)
```sql
SELECT id, "caseId", title, "isCompleted", "createdAt" 
FROM "CaseChecklistItem" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND title LIKE '[AI - %]'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Trả về chính xác các dòng tiêu đề cán bộ đã tick chọn, `isCompleted` bằng `false`.

### 2. Kiểm tra bảng `AiAuditLog` (Đảm bảo lưu vết kiểm toán đầy đủ)
```sql
SELECT id, "caseId", "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND "action" = 'CHECKLIST'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Có bản ghi mới với `action = 'CHECKLIST'`, `userFeedback = 'ACCEPTED'` (nếu bấm áp dụng) hoặc `'REJECTED'` (nếu bấm không áp dụng).

### 3. Kiểm tra bảng `LegalCase` (Đảm bảo trạng thái hồ sơ bất biến)
```sql
SELECT id, "caseCode", status, "assignedToId", "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```
*Kết quả kỳ vọng:* Trường `status` giữ nguyên giá trị ban đầu trước khi gọi AI (ví dụ `NEW`), trường `assignedToId` không bị tự động thay đổi.

---

## 7. Giới Hạn Hiện Tại & Rủi Ro Còn Lại

### Giới hạn hiện tại (Chế độ Mock Gemini)
* Khi chưa cấu hình API Key thật (`GEMINI_API_KEY`) trong file `.env` của backend, hệ thống tự động hoạt động với **Mock Provider** (`gemini-1.5-pro-mock`).
* Ở chế độ Mock, AI sinh ra bộ checklist tiêu chuẩn 6 nhóm dựa trên nhận diện từ khóa (đất đai, tranh chấp, khiếu nại...) để đảm bảo toàn bộ luồng trải nghiệm UI/UX và kiểm thử End-to-End diễn ra mượt mà mà không phụ thuộc kết nối mạng bên ngoài.

### Rủi ro còn lại & Hướng quản trị
1. **Độ đặc thù của pháp lý địa phương:** Khi sử dụng mô hình LLM thực tế, quy trình gợi ý có thể mang tính chất chung chung theo luật quốc gia, chưa sát với các quy chế hoặc văn bản hướng dẫn riêng của từng tỉnh/thành phố.  
   👉 *Quản trị:* Thiết kế tick-box chọn từng mục giúp cán bộ dễ dàng gạt bỏ các gợi ý không phù hợp với thực tiễn địa phương.
2. **Nguy cơ ỷ lại vào AI:** Cán bộ có thể có xu hướng tích chọn toàn bộ checklist mà không rà soát kỹ.  
   👉 *Quản trị:* Cảnh báo màu vàng **Human-in-the-Loop** hiển thị mặc định và bắt buộc trên giao diện, nhắc nhở trách nhiệm pháp lý cá nhân của người thụ lý.
3. **Hiệu năng khi gọi LLM đồng thời:** Quá trình sinh 6 nhóm checklist chi tiết tốn nhiều token và thời gian xử lý hơn so với tóm tắt đơn thuần, có thể gây độ trễ nhẹ (2-4 giây) khi gọi API thật.  
   👉 *Quản trị:* Nút bấm trên UI đã được trang bị trạng thái loading (`Đang tạo quy trình...`) và khóa vô hiệu hóa tạm thời (`disabled`) để ngăn người dùng bấm liên tục gây nghẽn hệ thống.
