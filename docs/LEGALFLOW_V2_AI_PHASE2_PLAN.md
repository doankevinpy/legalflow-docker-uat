# Kế Hoạch Kỹ Thuật Phase 2: Tích Hợp UI Trợ Lý AI Phân Tích & Phân Loại Đơn Thư

**Tài liệu thiết kế triển khai Phase 2 cho LegalFlow v2 – AI Hỗ trợ xử lý đơn thư cấp xã.**
*Trạng thái: Báo cáo Kế hoạch Kỹ thuật (Chưa chỉnh sửa source code).*

---

## 1. Mục Tiêu Nghiệp Vụ & Nguyên Tắc Bảo Mật

Phase 2 tập trung vào việc mang sức mạnh mô hình ngôn ngữ AI từ Backend (đã xây dựng trong Phase 1) lên giao diện người dùng (Frontend), tạo công cụ trợ lý đắc lực cho cán bộ công chức khi tiếp nhận và thụ lý đơn thư.

### Nguyên Tắc Bắt Buộc (Tuân thủ nghiêm ngặt):
1. **Human-in-the-Loop (HITL)**: AI tuyệt đối **không được tự động chuyển đổi trạng thái hồ sơ** (ví dụ: không tự chuyển từ `NEW` sang `PROCESSING` hay `CLOSED`).
2. **Không Tự Gửi Phản Hồi**: AI tuyệt đối **không tự động soạn thảo hay gửi bất kỳ văn bản/email/thông báo nào cho công dân**. Cán bộ thụ lý là người duy nhất có quyền xác nhận và ban hành văn bản.
3. **Cảnh Báo Pháp Lý Minh Bạch**: Luôn hiển thị thông điệp cảnh báo nổi bật trên giao diện: *"⚠️ AI chỉ hỗ trợ tư vấn và đề xuất. Cán bộ thụ lý chịu trách nhiệm kiểm tra, đối chiếu hồ sơ gốc trước khi áp dụng."*
4. **Kiểm Toán Phản Hồi**: Mọi thao tác chấp nhận (`ACCEPTED`) hay từ chối (`REJECTED`) gợi ý của AI đều phải được ghi nhận vào `AiAuditLog` và cập nhật trạng thái trong `AiCaseSuggestion`.

---

## 2. Phân Tích & Thiết Kế Giao Diện Frontend

### 2.1. Tích hợp trên trang Tạo Hồ Sơ (`src/pages/NewCase.tsx`)
Khi cán bộ tiếp nhận đơn khiếu nại/tố cáo từ công dân, họ thường phải đọc một văn bản dài để xác định đây là đơn gì và thuộc lĩnh vực nào.
- **Vị trí tích hợp**: Thêm nút **"✨ AI Phân tích Đơn"** ngay bên dưới ô nhập *Nội dung đơn thư (Description)*.
- **Hành vi**:
  1. Khi cán bộ nhập nội dung đơn và nhấn nút, giao diện hiển thị trạng thái đang phân tích (`Loader2`).
  2. Frontend gọi song song 2 API: `POST /ai/summarize` và `POST /ai/classify`.
  3. Hiển thị Widget **"Kết quả Đề xuất từ AI"**:
     - **Tóm tắt nội dung**: Đoạn văn bản ngắn gọn 100-150 từ.
     - **Loại đơn đề xuất**: (Ví dụ: Khiếu nại - `KN`).
     - **Lĩnh vực đề xuất**: (Ví dụ: Đất đai - `DAT_DAI`).
     - **Độ tin cậy**: Hiển thị thanh tỷ lệ % (Ví dụ: `92%`).
     - **Lý do đề xuất**: Trích dẫn căn cứ pháp lý do AI gợi ý.
     - **Khung cảnh báo**: Màu vàng/cam nêu rõ nguyên tắc HITL.
  4. Nút hành động:
     - **"Chấp nhận áp dụng"**: Tự động điền phần tóm tắt vào ô Nội dung, đồng thời tự động chọn Dropdown Loại đơn và Lĩnh vực tương ứng trên form tạo hồ sơ.
     - **"Từ chối"**: Ẩn widget gợi ý.

### 2.2. Tích hợp trên trang Chi Tiết Hồ Sơ (`src/pages/CaseDetail.tsx`)
Đối với các hồ sơ đã tạo hoặc được phân công, cán bộ có thể xem lại hoặc yêu cầu AI phân tích lại sâu hơn.
- **Vị trí tích hợp**: Thêm một Thẻ (Tab) mới có tên **"✨ Trợ lý AI"** bên cạnh các tab hiện có (*Thông tin chung, Đất đai, Tài liệu, Checklist, Nhật ký*).
- **Nội dung Tab Trợ lý AI**:
  - Hiển thị thông tin gợi ý AI gần nhất (được nạp từ relation `aiSuggestion` của hồ sơ).
  - Nút **"Phân tích lại hồ sơ"**: Gửi yêu cầu phân tích mới lên server dựa trên toàn bộ thông tin mới nhất (Nội dung đơn + Ghi chú của cán bộ).
  - Khung hiển thị chi tiết 5 thông số: Tóm tắt, Loại đơn, Lĩnh vực, Độ tin cậy, Lý do pháp lý.
  - Cụm nút phản hồi: **"Chấp nhận đề xuất"** và **"Từ chối đề xuất"**.

---

## 3. Phân Tích Danh Sách File Cần Chỉnh Sửa & Bổ Sung

### 3.1. Frontend React / Vite (`src/`)
1. **`src/lib/api-types.ts`**: Bổ sung interface `ApiAiSuggestion` và mở rộng interface `ApiCase` để bao gồm trường `aiSuggestion?: ApiAiSuggestion | null`.
2. **`src/lib/casesApi.ts`**: Bổ sung các client methods:
   - `casesApi.aiSummarize(text: string, caseId?: string)`
   - `casesApi.aiClassify(text: string, caseId?: string)`
   - `casesApi.aiSubmitFeedback(caseId: string, feedback: 'ACCEPTED' | 'REJECTED', applyToCase?: boolean)`
3. **`src/components/cases/AiAssistantWidget.tsx` (File mới)**: Component UI độc lập hiển thị thẻ kết quả AI, các thanh độ tin cậy, hộp cảnh báo HITL và 2 nút Chấp nhận / Từ chối.
4. **`src/pages/NewCase.tsx`**: Nhúng `AiAssistantWidget` vào form tạo đơn.
5. **`src/pages/CaseDetail.tsx`**: Thêm tab `Trợ lý AI` và render `AiAssistantWidget`.

### 3.2. Backend NestJS (`legalflow-backend/`)
1. **`src/cases/cases.service.ts`**: Sửa phương thức `findOneInternal(id: string)` thêm `aiSuggestion: true` vào khối `include` của Prisma để trả về gợi ý AI đã lưu.
2. **`src/ai/dto/ai-feedback.dto.ts` (File mới)**: DTO nhận yêu cầu phản hồi từ cán bộ.
3. **`src/ai/ai.controller.ts`**: Thêm endpoint `POST /ai/feedback` (hoặc `POST /ai/suggestions/feedback`).
4. **`src/ai/ai.service.ts`**: Thêm phương thức `submitFeedback(dto: AiFeedbackDto, userId: string)`:
   - Cập nhật trạng thái `isApplied` trong `AiCaseSuggestion`.
   - Tìm bản ghi `AiAuditLog` gần nhất của caseId và cập nhật `userFeedback` (`ACCEPTED` hoặc `REJECTED`), `appliedAt`.
   - Nếu `applyToCase = true` và `feedback === ACCEPTED`, gọi `PrismaService.legalCase.update(...)` cập nhật `type` và `field` cho hồ sơ (nhưng **giữ nguyên status**).

---

## 4. Đề Xuất DTO & API Bổ Sung (Backend)

### 4.1. DTO Mới: `AiFeedbackDto`
```typescript
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AiFeedbackStatus } from '@prisma/client';

export class AiFeedbackDto {
  @IsString()
  @IsNotEmpty()
  caseId!: string;

  @IsEnum(AiFeedbackStatus) // 'ACCEPTED' | 'REJECTED'
  feedback!: AiFeedbackStatus;

  @IsOptional()
  @IsBoolean()
  applyToCase?: boolean; // Nếu true: Cập nhật type và field vào LegalCase
}
```

### 4.2. API Endpoint Mới
- **URL**: `POST /ai/feedback`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Body**:
  ```json
  {
    "caseId": "uuid-của-hồ-sơ",
    "feedback": "ACCEPTED",
    "applyToCase": true
  }
  ```
- **Phản hồi (200 OK)**:
  ```json
  {
    "success": true,
    "suggestion": { "id": "...", "isApplied": true },
    "caseUpdated": true
  }
  ```

---

## 5. Kế Hoạch Kiểm Thử (Testing Plan)

### 5.1. Kiểm Thử Tự Động (Automated Tests)
- **Backend Unit Tests**: Viết thêm unit test trong `src/ai/ai.service.spec.ts` để kiểm chứng hàm `submitFeedback`:
  - Xác nhận khi `ACCEPTED` + `applyToCase: true` thì gọi `prisma.legalCase.update` đúng tham số, nhưng không sửa trường `status`.
  - Xác nhận trường `userFeedback` trong `AiAuditLog` chuyển từ `PENDING` sang `ACCEPTED` / `REJECTED`.
- **Backend E2E / Controller Tests**: Kiểm thử endpoint `POST /ai/feedback` với RBAC guard đảm bảo chỉ `ADMIN`, `MANAGER`, `STAFF` mới được thao tác.

### 5.2. Kiểm Thử Thủ Công (Manual UAT Checklist)
1. **Test Tạo Hồ Sơ với AI**:
   - Mở trình duyệt vào trang `http://localhost:5173/cases/new`.
   - Nhập nội dung khiếu nại tranh chấp đất đai dài -> Nhấn **"✨ AI Phân tích Đơn"**.
   - Kiểm tra hiển thị đủ 5 thông số và dòng cảnh báo đỏ/vàng.
   - Nhấn **"Chấp nhận áp dụng"** -> Kiểm tra Dropdown Loại đơn tự nhảy về `Khiếu nại`, Lĩnh vực nhảy về `Đất đai`.
2. **Test Xem Chi Tiết & Audit Log**:
   - Lưu hồ sơ -> Vào trang Chi tiết hồ sơ (`CaseDetail`).
   - Mở tab **"✨ Trợ lý AI"** -> Xác nhận dữ liệu AI phân tích vẫn được lưu giữ nguyên vẹn.
   - Nhấn nút **"Từ chối đề xuất"** -> Kiểm tra trong Prisma Studio (`npx prisma studio`) xem bản ghi `AiAuditLog` đã cập nhật `userFeedback = REJECTED` chưa.
3. **Test Kiểm Chứng Độc Lập Trạng Thái**:
   - Xác nhận trạng thái hồ sơ vẫn là `Mới tiếp nhận` (`NEW`), không bị AI tự chuyển thành `Đang xử lý` (`PROCESSING`).
