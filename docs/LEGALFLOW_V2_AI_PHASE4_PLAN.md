# Kế Hoạch Kỹ Thuật Phase 4: AI Drafting Văn Bản Nháp Nội Bộ Phục Vụ Xử Lý Đơn Thư

**Tài liệu thiết kế kiến trúc và triển khai Phase 4 cho LegalFlow v2 – AI Hỗ trợ xử lý đơn thư cấp xã.**  
*Trạng thái: Kế hoạch Kỹ thuật Chi tiết (Chưa chỉnh sửa source code).*  
*Ngày lập:* 27/06/2026  

---

## 1. Mục Tiêu & Phạm Vi Nghiệp Vụ

Sau khi hoàn thành Phase 2 (Tóm tắt & Phân loại) và Phase 3 (Gợi ý quy trình & Checklist), Phase 4 tiến lên bước hỗ trợ tự động hóa khâu tốn nhiều thời gian nhất của cán bộ thụ lý: **Soạn thảo văn bản hành chính (AI Drafting)**. 

Dựa trên ngữ cảnh toàn diện của hồ sơ (nội dung đơn, phân loại, các yêu cầu của công dân và các mốc pháp lý), Trợ lý AI sẽ sinh ra các dự thảo văn bản nội bộ tuân thủ thể thức hành chính, giúp cán bộ giảm 70-80% thời gian đánh máy và rà soát căn cứ pháp lý.

### Phạm vi 5 loại văn bản nháp được đề xuất:
1. 📄 **Phiếu xử lý đơn:** Đề xuất hướng xử lý nội bộ trình Lãnh đạo UBND xã phê duyệt (thụ lý giải quyết, chuyển đơn hay trả lại đơn).
2. 📢 **Thông báo thụ lý hoặc không thụ lý giải quyết:** Văn bản dự thảo thông báo chính thức cho người khiếu nại/tố cáo về việc chấp nhận hoặc từ chối thụ lý đơn theo quy định.
3. ✉️ **Giấy mời làm việc / đối thoại:** Giấy mời người khiếu nại, người bị khiếu nại và các bên liên quan (Hội Nông dân, Địa chính, Trưởng thôn) đến làm việc xác minh thực địa hoặc hòa giải.
4. 🔄 **Văn bản chuyển đơn:** Dự thảo công văn chuyển đơn đến cơ quan có thẩm quyền nếu vụ việc vượt thẩm quyền giải quyết của UBND cấp xã (ví dụ: chuyển lên UBND cấp Huyện hoặc Tòa án).
5. 💬 **Gợi ý nội dung trả lời công dân:** Bản nháp tóm tắt nội dung trả lời giải thích pháp luật, hướng dẫn thủ tục cho công dân ở mức độ tham khảo nội bộ.

---

## 2. Nguyên Tắc An Toàn Nghiệp Vụ & Bảo Mật (Human-in-the-Loop)

Phase 4 áp dụng các tiêu chuẩn an toàn pháp lý **Human-in-the-Loop (HITL)** ở mức độ nghiêm ngặt cao nhất:

1. **AI chỉ tạo bản nháp nội bộ, không tự ban hành:** Mọi kết quả do AI sinh ra đều gắn nhãn là *"Dự thảo nội bộ (Draft)"*. AI không có quyền đóng dấu, ký số hay phát hành văn bản hành chính.
2. **Cán bộ bắt buộc kiểm tra, chỉnh sửa và duyệt:** Giao diện bắt buộc cung cấp trình chỉnh sửa văn bản (Text Editor). Cán bộ thụ lý phải rà soát, chỉnh sửa câu chữ, căn cứ pháp lý và chịu trách nhiệm hoàn toàn về tính chính xác trước khi lưu vào hệ thống hoặc trình Lãnh đạo.
3. **Tuyệt đối không tự động thay đổi trạng thái hồ sơ:** Việc tạo hay lưu bản nháp văn bản không làm chuyển dịch trạng thái quy trình của hồ sơ (`LegalCase.status` giữ nguyên tuyệt đối).
4. **Tuyệt đối không tự động gửi văn bản cho công dân:** Hệ thống không tự động gửi email, SMS hay bưu điện các bản nháp này cho công dân. Việc gửi văn bản thực tế phải được thực hiện qua kênh hành chính chính thức sau khi ban hành.
5. **Kiểm toán minh bạch 100%:** Mọi hành động yêu cầu AI soạn thảo (`DRAFT_GENERATE`), chấp nhận lưu dự thảo (`ACCEPTED`) hay hủy bỏ (`REJECTED`) đều phải được ghi vết chi tiết vào nhật ký kiểm toán `AiAuditLog`.
6. **Cảnh báo pháp lý rõ ràng:** Hiển thị banner cảnh báo cố định trên vùng soạn thảo AI nhắc nhở trách nhiệm kiểm duyệt của cán bộ.

---

## 3. Chiến Lược Lưu Trữ Bản Nháp (Zero Schema Modification vs Schema Proposed)

Tuân thủ yêu cầu *“đề xuất dùng bảng hiện có nếu phù hợp; nếu phải sửa schema thì báo trước, chưa tự sửa”*, tôi đề xuất 2 phương án kiến trúc dữ liệu:

### Phương án A: Tận dụng bảng `CaseNote` hiện có (Khuyên dùng triển khai ngay ở Phase 4)
* **Cơ chế:** Khi cán bộ chỉnh sửa xong và nhấn **"💾 Lưu bản nháp vào hồ sơ"**, nội dung văn bản sẽ được lưu vào bảng `CaseNote` (Ghi chú hồ sơ) gắn liền với `caseId` và `userId` của cán bộ.
* **Quy ước tiền tố nhận diện:** Cột `content` trong `CaseNote` sẽ được mở đầu bằng một thẻ tiêu đề chuẩn hóa:  
  `"[AI Dự thảo - Phiếu xử lý đơn]\n\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM..."` hoặc `"[AI Dự thảo - Giấy mời làm việc]..."`.
* **Ưu điểm:** Không cần chạy database migration, không thay đổi schema, tích hợp sẵn vào luồng xem lịch sử ghi chú hồ sơ hiện tại.

### Phương án B: Đề xuất Model `AiDocumentDraft` chuyên biệt (Dành cho mở rộng trong tương lai)
Nếu sau Phase 4 dự án có nhu cầu quản lý quy trình trình ký văn bản điện tử phức tạp (Lãnh đạo vào duyệt nháp, xuất file Word/PDF tự động), chúng ta sẽ bổ sung model sau vào `schema.prisma` ở đợt migration tiếp theo:
```prisma
model AiDocumentDraft {
  id             String    @id @default(uuid())
  caseId         String
  case           LegalCase @relation(fields: [caseId], references: [id], onDelete: Cascade)
  userId         String
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  draftType      String    // PHIEU_XU_LY, THONG_BAO_THU_LY, GIAY_MOI, CHUYEN_DON, TRA_LOI
  title          String
  content        String    // Nội dung văn bản nháp (Markdown hoặc Plaintext)
  status         String    @default("DRAFT") // DRAFT, APPROVED, REJECTED
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([caseId, draftType])
}
```
👉 **Quyết định cho Phase 4:** Trước mắt triển khai theo **Phương án A (Dùng bảng `CaseNote`)** để đảm bảo an toàn tuyệt đối cho hệ thống đang chạy.

---

## 4. Đề Xuất Backend DTO, Interface & Endpoint

### 4.1. Enum Loại Văn bản Nháp (`src/ai/interfaces/ai-provider.interface.ts`)
```typescript
export enum AiDraftType {
  PHIEU_XU_LY = 'PHIEU_XU_LY',
  THONG_BAO_THU_LY = 'THONG_BAO_THU_LY',
  GIAY_MOI_LAM_VIEC = 'GIAY_MOI_LAM_VIEC',
  VAN_BAN_CHUYEN_DON = 'VAN_BAN_CHUYEN_DON',
  TRA_LOI_CONG_DAN = 'TRA_LOI_CONG_DAN',
}

export interface AiDraftStructuredResult {
  title: string;              // Tiêu đề văn bản (Ví dụ: PHIẾU ĐỀ XUẤT XỬ LÝ ĐƠN KHIẾU NẠI)
  legalBases: string[];       // Căn cứ pháp lý áp dụng (Luật Đất đai 2024, Luật Khiếu nại 2011...)
  recipient: string;          // Kính gửi (Lãnh đạo UBND xã, hoặc Công dân X)
  draftContent: string;       // Nội dung chi tiết bài văn bản hành chính
}

export interface AiDraftResponse extends AiCompletionResponse {
  structuredDraft: AiDraftStructuredResult;
}
```

### 4.2. DTO Yêu cầu Soạn thảo (`src/ai/dto/suggest-draft.dto.ts`)
```typescript
export class SuggestDraftDto {
  @IsString() @IsNotEmpty()
  caseId!: string;

  @IsEnum(AiDraftType) @IsNotEmpty()
  draftType!: AiDraftType;

  @IsString() @IsOptional()
  customInstructions?: string; // Ghi chú thêm từ cán bộ (Ví dụ: "Mời làm việc vào lúc 8h sáng thứ 5 tuần này")
}
```

### 4.3. API Endpoint Đề xuất (`src/ai/ai.controller.ts`)
1. `POST /ai/draft`: Nhận `SuggestDraftDto`, gọi `AiService.generateDraft()`, ghi `AiAuditLog` với `action = 'DRAFT_GENERATE'`, trả về cấu trúc `AiDraftResponse`.
2. Mở rộng `POST /ai/feedback`: Khi cán bộ duyệt nháp, gửi payload kèm `feedbackType: 'DRAFT'`, `draftTitle` và `finalContent` (nội dung đã qua cán bộ chỉnh sửa). Backend tự động tạo một bản ghi `CaseNote` lưu vào hồ sơ và cập nhật `AiAuditLog` thành `ACCEPTED`.

---

## 5. Đề Xuất Giao Diện UI/UX (`CaseDetail.tsx` - Tab Trợ Lý AI)

### 5.1. Bố cục Khối "📝 Soạn Thảo Văn Bản Nháp Thông Minh (AI Drafting)"
Tích hợp ngay bên dưới khối Checklist trong Tab **"✨ Trợ lý AI"** của trang `CaseDetail.tsx`:

* **Thanh công cụ lựa chọn:**
  * Dropdown chọn loại văn bản cần soạn: *(1. Phiếu xử lý đơn | 2. Thông báo thụ lý | 3. Giấy mời làm việc | 4. Văn bản chuyển đơn | 5. Trả lời công dân)*.
  * Ô nhập liệu tùy chọn: *Ghi chú yêu cầu thêm cho AI (Ví dụ: Bổ sung yêu cầu công dân mang theo sổ đỏ gốc)*.
  * Nút bấm hành động: **"✨ AI Soạn Thảo Dự Thảo"**.
* **Cảnh báo pháp lý Human-in-the-Loop:**  
  *"⚠️ CẢNH BÁO: AI chỉ hỗ trợ tạo bản nháp nội bộ tham khảo. Cán bộ thụ lý bắt buộc phải rà soát thể thức, đối chiếu căn cứ pháp lý và chỉnh sửa nội dung phù hợp trước khi trình ký hoặc ban hành."*
* **Trình soạn thảo văn bản (Draft Editor):**
  * Khi AI trả về kết quả, hiển thị trong một khung Textarea lớn (hoặc Rich Text box) cho phép cán bộ gõ, xóa, sửa từng từ ngữ trực tiếp.
  * Hiển thị riêng danh sách các Căn cứ pháp lý AI đã tham chiếu dạng thẻ badge ở phía trên.

### 5.2. Cụm nút Phê duyệt Bản nháp
* **"💾 Lưu bản nháp vào Ghi chú hồ sơ (Đã duyệt)"**: Nhấn vào sẽ lưu nội dung văn bản hiện tại (đã qua chỉnh sửa) vào bảng Ghi chú (`CaseNote`), đồng thời thông báo Toast thành công.
* **"❌ Hủy bản nháp"**: Xóa trắng vùng soạn thảo, ghi nhận phản hồi từ chối vào hệ thống.

---

## 6. Kế Hoạch Kiểm Thử (Testing Strategy)

### 6.1. Kiểm thử tự động (Backend Unit Tests)
Trong file `ai.service.spec.ts` bổ sung các test cases:
1. `should successfully generate a document draft based on case context`: Xác nhận hàm gọi AI provider sinh đúng cấu trúc tiêu đề, nội dung và ghi log `DRAFT_GENERATE`.
2. `should save edited draft to CaseNote when feedback is ACCEPTED`: Xác nhận khi gửi feedback `DRAFT` chấp nhận, hệ thống gọi `prisma.caseNote.create()` đúng nội dung cán bộ đã sửa kèm tiền tố `[AI Dự thảo - ...]`, đồng thời `LegalCase.status` giữ nguyên không đổi.
3. `should log REJECTED audit when draft is declined`: Xác nhận không tạo `CaseNote` nếu từ chối.

### 6.2. Kiểm thử thủ công E2E E-to-E trên Trình duyệt
1. Mở trang chi tiết hồ sơ (`/cases/:id`), chuyển sang tab **"✨ Trợ lý AI"**.
2. Chọn loại văn bản **"Giấy mời làm việc / đối thoại"**, nhập ghi chú *"Mời lúc 14h chiều thứ Sáu tại Phòng Tiếp công dân"* và nhấn **"✨ AI Soạn Thảo Dự Thảo"**.
3. Kiểm tra bản nháp xuất hiện trong khung chỉnh sửa với đúng thời gian và địa điểm theo ghi chú.
4. Thử sửa một vài câu từ trong bản nháp trên màn hình.
5. Nhấn **"💾 Lưu bản nháp vào Ghi chú hồ sơ"**.
6. Chuyển sang tab **"Ghi chú & Lịch sử"** của hồ sơ, xác nhận thấy bài ghi chú mới mang tên `[AI Dự thảo - Giấy mời làm việc / đối thoại]` với nội dung chính xác.
7. Kiểm tra trạng thái hồ sơ vẫn giữ nguyên giá trị cũ.

---

## 7. Các Lệnh SQL Kiểm Chứng (PostgreSQL / Prisma Studio)

Sau khi kiểm thử thao tác tạo và lưu bản nháp, sử dụng các truy vấn SQL sau để kiểm chứng tầng dữ liệu:

```sql
-- 1. Kiểm tra văn bản nháp đã được lưu vào bảng Ghi chú hồ sơ (CaseNote)
SELECT id, "caseId", "userId", content, "createdAt" 
FROM "CaseNote" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND content LIKE '[AI Dự thảo - %]'
ORDER BY "createdAt" DESC;

-- 2. Kiểm tra nhật ký kiểm toán AI cho các thao tác Drafting
SELECT id, "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND "action" IN ('DRAFT_GENERATE', 'DRAFT')
ORDER BY "createdAt" DESC;

-- 3. Xác nhận tuyệt đối không bị thay đổi trạng thái hồ sơ ngầm
SELECT id, "caseCode", status, "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```

---

## 8. Tóm Tắt Lộ Trình Triển Khai Tiếp Theo (Nếu được Phê duyệt)
1. **Bước 1:** Bổ sung DTO `SuggestDraftDto` và mở rộng interface trong `ai-provider.interface.ts`.
2. **Bước 2:** Cập nhật `GeminiProvider` với prompt chuyên sâu cho 5 loại văn bản hành chính xã.
3. **Bước 3:** Cập nhật `AiService.submitFeedback` để hỗ trợ lưu vào `CaseNote`.
4. **Bước 4:** Viết unit test đảm bảo passing 100%.
5. **Bước 5:** Xây dựng khối UI drafting trong `CaseDetail.tsx`.
