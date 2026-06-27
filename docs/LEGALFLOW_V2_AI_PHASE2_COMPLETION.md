# Báo Cáo Hoàn Thành Triển Khai LegalFlow v2 AI – Phase 2

**Phiên bản / Tag:** `v2.0.0-ai-phase2`  
**Commit:** `7a9a70c Integrate AI assistant into case workflow`  
**Ngày hoàn thành:** 27/06/2026  

---

## 1. Tổng Quan & Nguyên Tắc Cốt Lõi (Human-in-the-Loop)

Phase 2 của dự án **LegalFlow v2 (AI hỗ trợ xử lý đơn thư cấp xã)** đã hoàn tất triển khai và kiểm thử. Mục tiêu của Phase 2 là đưa các khả năng phân tích thông minh của Trợ lý AI trực tiếp vào luồng thao tác của cán bộ thụ lý hồ sơ (Frontend & Backend), đồng thời tuân thủ tuyệt đối các nguyên tắc an toàn pháp lý.

### Nguyên tắc Human-in-the-Loop (Cán bộ là trung tâm ra quyết định)
1. **AI chỉ hỗ trợ, không ra quyết định hành chính:** AI đóng vai trò như một trợ lý ảo phân tích sơ bộ đơn thư, tóm tắt nội dung và gợi ý phân loại. Cán bộ thụ lý chịu trách nhiệm kiểm tra, đối chiếu hồ sơ gốc trước khi áp dụng.
2. **Tuyệt đối không tự động thay đổi trạng thái hồ sơ (`status`):** Khi cán bộ nhấn chấp nhận gợi ý AI (`applyToCase = true`), hệ thống chỉ tự động điền các trường thông tin mô tả (`summary`), loại đơn (`type`) và lĩnh vực (`field`). Trạng thái quy trình của hồ sơ (ví dụ: `NEW` - Mới tiếp nhận) được giữ nguyên 100%.
3. **Audit Log minh bạch:** Mọi tương tác của cán bộ với AI (phân tích, chấp nhận gợi ý, từ chối gợi ý) đều được ghi nhận đầy đủ vào nhật ký kiểm toán (`AiAuditLog`) kèm theo phản hồi thực tế (`userFeedback`).

---

## 2. Các Chức Năng Đã Hoàn Thành

* **Tích hợp API Phân tích & Tóm tắt (`/ai/summarize`, `/ai/classify`):** Cho phép gọi mô hình AI phân tích văn bản đơn thư để trích xuất tóm tắt ngắn gọn, loại đơn đề xuất, lĩnh vực đề xuất, độ tin cậy (%) và căn cứ pháp lý lý giải.
* **Tích hợp API Phản hồi & Áp dụng (`/ai/feedback`):** Cung cấp cơ chế ghi nhận đánh giá của cán bộ (`ACCEPTED` hoặc `REJECTED`). Khi `ACCEPTED` kèm `applyToCase = true`, tự động cập nhật dữ liệu gợi ý vào hồ sơ (`LegalCase`) và đánh dấu `AiCaseSuggestion.isApplied = true`.
* **Giao diện Tạo hồ sơ mới (`NewCase.tsx`):** Bổ sung nút **"✨ AI Phân tích Đơn"** ngay bên dưới ô nhập nội dung vụ việc. Kết quả phân tích hiển thị trực quan trong một Widget Card kèm cảnh báo pháp lý. Khi chấp nhận, dữ liệu tự động điền vào biểu mẫu đang tạo.
* **Giao diện Chi tiết hồ sơ (`CaseDetail.tsx`):** Bổ sung tab chuyên biệt **"✨ Trợ lý AI"** trong danh sách điều hướng bên trái, cho phép cán bộ xem lại lịch sử gợi ý AI hoặc yêu cầu AI phân tích lại hồ sơ bất cứ lúc nào.

---

## 3. Danh Sách File Chính Đã Thay Đổi

### Backend NestJS (`legalflow-backend/`)
* [src/ai/dto/ai-feedback.dto.ts](file:///c:/Users/Admin/legalflow-docker-uat/legalflow-backend/src/ai/dto/ai-feedback.dto.ts): DTO định nghĩa cấu trúc payload phản hồi (`caseId`, `feedback`, `applyToCase`).
* [src/ai/ai.controller.ts](file:///c:/Users/Admin/legalflow-docker-uat/legalflow-backend/src/ai/ai.controller.ts): Thêm endpoint `POST /ai/feedback`.
* [src/ai/ai.service.ts](file:///c:/Users/Admin/legalflow-docker-uat/legalflow-backend/src/ai/ai.service.ts): Cập nhật logic xử lý `submitFeedback`. Đảm bảo ánh xạ đúng trường `summary` của `LegalCase`, cập nhật `AiCaseSuggestion.isApplied` và loại bỏ hoàn toàn việc can thiệp trường `status`.
* [src/cases/cases.service.ts](file:///c:/Users/Admin/legalflow-docker-uat/legalflow-backend/src/cases/cases.service.ts): Thêm `include: { aiSuggestion: true }` trong hàm `findOneInternal`.
* [src/ai/ai.service.spec.ts](file:///c:/Users/Admin/legalflow-docker-uat/legalflow-backend/src/ai/ai.service.spec.ts): Thêm bộ unit test kiểm chứng nghiệp vụ phản hồi AI và đảm bảo `status` không thay đổi.

### Frontend React / Vite (`src/`)
* [src/lib/api-types.ts](file:///c:/Users/Admin/legalflow-docker-uat/src/lib/api-types.ts): Bổ sung các kiểu dữ liệu `ApiAiSuggestion`, `AiSummarizeResponse`, `AiClassifyResponse`.
* [src/lib/casesApi.ts](file:///c:/Users/Admin/legalflow-docker-uat/src/lib/casesApi.ts): Thêm các hàm gọi REST API sang backend cho AI module.
* [src/components/cases/AiAssistantWidget.tsx](file:///c:/Users/Admin/legalflow-docker-uat/src/components/cases/AiAssistantWidget.tsx): Component Card hiển thị kết quả phân tích AI và nút hành động Chấp nhận / Từ chối.
* [src/pages/NewCase.tsx](file:///c:/Users/Admin/legalflow-docker-uat/src/pages/NewCase.tsx): Tích hợp Widget AI vào luồng lập hồ sơ mới.
* [src/pages/CaseDetail.tsx](file:///c:/Users/Admin/legalflow-docker-uat/src/pages/CaseDetail.tsx): Tích hợp tab "✨ Trợ lý AI" vào trang quản lý chi tiết hồ sơ.

---

## 4. Hướng Dẫn Kiểm Thử Thủ Công

### Bước 1: Khởi động hệ thống
```powershell
# Khởi động Backend (Port 3000)
cd c:\Users\Admin\legalflow-docker-uat\legalflow-backend
npm run start:dev

# Khởi động Frontend (Port 5173)
cd c:\Users\Admin\legalflow-docker-uat
npm run dev
```

### Bước 2: Kiểm thử trên Giao diện Tạo hồ sơ mới
1. Truy cập địa chỉ `http://localhost:5173/cases/new`.
2. Nhập nội dung đơn thư vào ô **Tóm tắt nội dung vụ việc** (Ví dụ: *"Tranh chấp ranh giới đất ở giữa gia đình ông A và bà B tại khu phố 3"*).
3. Nhấn nút **"✨ AI Phân tích Đơn"**.
4. Kiểm tra Card kết quả xuất hiện: hiển thị tóm tắt chuẩn hóa, loại đơn gợi ý (*Khiếu nại/Tranh chấp*), lĩnh vực (*Đất đai*), độ tin cậy và cảnh báo màu vàng về trách nhiệm kiểm duyệt của cán bộ.
5. Nhấn **"Chấp nhận đề xuất"**: Các ô dropdown Loại đơn và Lĩnh vực tự động đổi theo gợi ý AI. Nhấn **Lưu hồ sơ**.

### Bước 3: Kiểm thử trên Giao diện Chi tiết hồ sơ
1. Mở một hồ sơ đã lưu (`/cases/:id`).
2. Chuyển sang tab **"✨ Trợ lý AI"** ở menu bên trái.
3. Nhấn nút **"✨ AI Phân tích Lại"** nếu chưa có kết quả.
4. Nhấn nút **"Chấp nhận đề xuất"** (hoặc **"Từ chối đề xuất"**). Hệ thống thông báo áp dụng thành công.
5. Chuyển về tab **"Thông tin chung"**: Kiểm tra thấy Loại đơn, Lĩnh vực và Tóm tắt đã được cập nhật, nhưng **Trạng thái hồ sơ vẫn giữ nguyên là Mới tiếp nhận (`NEW`)**.

---

## 5. Các Lệnh SQL / PowerShell Kiểm Chứng Cấp Đánh Dấu (Audit)

Để kiểm chứng tính xác thực dưới cơ sở dữ liệu sau khi thực hiện thao tác `ACCEPTED` kèm `applyToCase = true` cho một hồ sơ (giả sử ID hồ sơ là `63b770ad-fd91-4902-b2eb-e8a75dbcb9d1`), sử dụng các lệnh sau trong terminal:

### Kiểm tra bằng HTTP Request (PowerShell)
```powershell
$body = @{
    caseId = "63b770ad-fd91-4902-b2eb-e8a75dbcb9d1"
    feedback = "ACCEPTED"
    applyToCase = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/ai/feedback" -Method POST -Body $body -ContentType "application/json"
```
*Kết quả kỳ vọng:* `success=True`, `caseUpdated=True`.

### Kiểm tra bằng SQL (thông qua Docker container PostgreSQL)
```powershell
# 1. Kiểm tra bảng LegalCase (Đảm bảo type/field/summary được cập nhật, status VẪN LÀ 'NEW')
docker exec -it legalflow-postgres psql -U legalflow -d legalflow -c "SELECT id, type, field, summary, status FROM \""LegalCase\"" WHERE id='63b770ad-fd91-4902-b2eb-e8a75dbcb9d1';"

# 2. Kiểm tra bảng AiCaseSuggestion (Đảm bảo isApplied = true)
docker exec -it legalflow-postgres psql -U legalflow -d legalflow -c "SELECT id, \""caseId\"", \""suggestedType\"", \""isApplied\"" FROM \""AiCaseSuggestion\"" WHERE \""caseId\""='63b770ad-fd91-4902-b2eb-e8a75dbcb9d1';"

# 3. Kiểm tra nhật ký kiểm toán AiAuditLog (Đảm bảo userFeedback = 'ACCEPTED' và có appliedAt)
docker exec -it legalflow-postgres psql -U legalflow -d legalflow -c "SELECT id, action, \""modelName\"", \""userFeedback\"", \""appliedAt\"" FROM \""AiAuditLog\"" WHERE \""caseId\""='63b770ad-fd91-4902-b2eb-e8a75dbcb9d1';"
```

---

## 6. Giới Hạn Hiện Tại & Rủi Ro Còn Lại

### Giới hạn hiện tại (Mock Gemini Provider)
* Nếu biến môi trường `GEMINI_API_KEY` trong file `.env` chưa được cấu hình hoặc để trống/key giả (`mock-key`), hệ thống tự động chuyển sang chế độ **Mock Provider** (`gemini-1.5-pro-mock`).
* Ở chế độ Mock, AI sẽ trả về dữ liệu mẫu thông minh dựa trên từ khóa trong đơn thư để đảm bảo luồng trải nghiệm UI/UX và kiểm thử tích hợp không bị gián đoạn.

### Rủi ro còn lại & Hướng giảm thiểu
1. **Độ chính xác pháp lý của mô hình LLM:** Khi kết nối Gemini thật, mô hình có thể đưa ra phân loại chưa hoàn toàn sát với thực tiễn nghiệp vụ địa phương. *Giải pháp:* Cảnh báo Human-in-the-Loop hiển thị bắt buộc trên mọi Widget AI nhắc nhở cán bộ kiểm duyệt kỹ trước khi lưu.
2. **Giới hạn tốc độ gọi API (Rate Limiting):** Nếu triển khai đồng loạt cho nhiều cán bộ thao tác cùng lúc, có thể chạm ngưỡng rate limit của Google Gemini API. *Giải pháp (Dự kiến Phase 3):* Tích hợp cơ chế hàng đợi xử lý bất đồng bộ (BullMQ/Redis) và bồi hoàn thử lại (Exponential Backoff).
