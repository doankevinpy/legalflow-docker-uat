# Kế Hoạch Kỹ Thuật Phase 3: AI Checklist & Gợi Ý Quy Trình Xử Lý Đơn Thư

**Tài liệu thiết kế triển khai Phase 3 cho LegalFlow v2 – AI Hỗ trợ xử lý đơn thư cấp xã.**  
*Trạng thái: Kế hoạch Kỹ thuật Chi tiết (Chưa chỉnh sửa source code).*  
*Ngày lập:* 27/06/2026  

---

## 1. Mục Tiêu Nghiệp Vụ & Nguyên Tắc Bảo Mật (Human-in-the-Loop)

Sau khi Phase 2 hỗ trợ phân loại và tóm tắt đơn thư thành công, Phase 3 hướng đến việc hỗ trợ cán bộ địa chính - tư pháp cấp xã **xây dựng lộ trình xử lý từng hồ sơ cụ thể**. Dựa vào đặc thù riêng của từng loại khiếu nại/tranh chấp, Trợ lý AI sẽ phân tích và đưa ra bộ Checklist xử lý chuẩn hóa theo quy định pháp luật hiện hành.

### Nguyên tắc bảo mát & Human-in-the-Loop (HITL) bắt buộc:
1. **AI không tự phân công/giao việc:** AI chỉ gợi ý tên bộ phận hoặc vai trò phối hợp (ví dụ: *Tổ hòa giải thôn, Cán bộ địa chính*). Việc phân công cụ thể cho ai trên hệ thống phải do Lãnh đạo hoặc Cán bộ thụ lý tự thao tác.
2. **AI không tự đổi trạng thái hồ sơ:** Việc áp dụng checklist chỉ bổ sung các đầu việc vào danh sách theo dõi của hồ sơ (`CaseChecklistItem`), trạng thái hồ sơ (`status`) giữ nguyên.
3. **AI không tự gửi văn bản/thông báo:** Các đề xuất bước tiếp theo hay thông báo cho công dân chỉ nằm ở mức khuyến nghị nội bộ.
4. **Kiểm toán toàn diện:** Mọi hành động nhấn **"Áp dụng checklist"** hay **"Không áp dụng"** đều phải lưu lại nhật ký trong `AiAuditLog` với trường `userFeedback` (`ACCEPTED` hoặc `REJECTED`).

---

## 2. Phân Tích Cấu Trúc Dữ Liệu Gợi Ý Checklist (6 Khía Cạnh)

Để đảm bảo tính thực tiễn trong nghiệp vụ giải quyết đơn thư cấp xã, bộ gợi ý quy trình từ AI sẽ bao gồm 6 nhóm thông tin rõ ràng:
1. **Việc cần làm (Tasks):** Các bước xác minh, thẩm tra thực tế tại thực địa hoặc tổ chức cuộc họp.
2. **Tài liệu cần kiểm tra (Documents):** Hồ sơ địa chính gốc, Giấy chứng nhận QSDĐ cũ, sổ mục kê, bản đồ địa chính các thời kỳ.
3. **Bộ phận/cán bộ cần phối hợp (Coordination):** Ban địa chính xã, Trưởng thôn/khu phố, Mặt trận Tổ quốc, Tổ hòa giải cơ sở.
4. **Thời hạn cần lưu ý (Deadlines):** Mốc thời gian luật định (ví dụ: *Hòa giải tranh chấp đất đai tại UBND cấp xã không quá 45 ngày kể từ ngày nhận đơn*).
5. **Rủi ro nghiệp vụ/pháp lý (Risks):** Nhận diện nguy cơ khiếu nại vượt cấp, hết thời hiệu khiếu nại, hoặc vi phạm trình tự thủ tục hành chính.
6. **Đề xuất bước tiếp theo (Next Steps):** Hành động ưu tiên cao nhất cần thực hiện ngay trong 24-48 giờ tới.

---

## 3. Thiết Kế Không Thay Đổi Schema Database (Zero Schema Modification)

Để đảm bảo hệ thống ổn định và giảm thiểu rủi ro migration, Phase 3 được thiết kế để **hoàn toàn tận dụng các model hiện có trong `schema.prisma`**:

### 3.1. Lưu trữ kết quả phân tích của AI
* Khi gọi API gợi ý checklist, toàn bộ dữ liệu cấu trúc JSON (gồm 6 khía cạnh trên) sẽ được lưu tự động vào cột `outputPayload` (kiểu `Json`) của bảng `AiAuditLog` với `actionType = CHECKLIST`.

### 3.2. Khi cán bộ chọn "Áp dụng checklist"
* Backend sẽ trích xuất các danh mục từ gợi ý AI và chuyển đổi thành các bản ghi trong bảng `CaseChecklistItem` hiện có gắn với `caseId`.
* Để giữ sự rõ ràng nghiệp vụ, tiêu đề (`title`) của mỗi item sẽ được tiền tố hóa (prefix) theo nhóm:
  * `"[Việc cần làm] Thẩm tra hiện trạng ranh giới đất tranh chấp"`
  * `"[Tài liệu] Kiểm tra trích lục bản đồ địa chính năm 1993 và 2004"`
  * `"[Phối hợp] Mời Trưởng thôn và đại diện Hội Nông dân tham gia xác minh"`
  * `"[Thời hạn] Tổ chức hòa giải cơ sở trước ngày X"`
  * `"[Lưu ý rủi ro] Nguy cơ các bên tự ý xây dựng công trình trái phép trên đất tranh chấp"`
  * `"[Bước tiếp theo] Phát hành giấy mời các bên liên quan lên làm việc"`
* Bảng `AiAuditLog` tương ứng được cập nhật `userFeedback = ACCEPTED` và `appliedAt = now()`.

---

## 4. Đề Xuất Bổ Sung Backend DTO & API

### 4.1. Cập nhật DTO (`src/ai/dto/suggest-checklist.dto.ts`)
Mở rộng DTO để nhận đầy đủ ngữ cảnh hồ sơ, giúp AI đưa ra gợi ý chính xác nhất:
```typescript
export class SuggestChecklistDto {
  @IsString() @IsNotEmpty()
  caseId!: string;

  @IsString() @IsOptional()
  type?: string;     // Loại đơn (KN, TC, PA...)

  @IsString() @IsOptional()
  field?: string;    // Lĩnh vực (DAT_DAI, MOI_TRUONG...)

  @IsString() @IsOptional()
  summary?: string;  // Tóm tắt nội dung vụ việc

  @IsString() @IsOptional()
  request?: string;  // Yêu cầu cụ thể của công dân
}
```

### 4.2. Chuẩn hóa Interface phản hồi AI (`src/ai/interfaces/ai-provider.interface.ts`)
```typescript
export interface AiChecklistStructuredItem {
  tasks: string[];
  documents: string[];
  coordination: string[];
  deadlines: string[];
  risks: string[];
  nextSteps: string[];
}

export interface AiChecklistResponse extends AiCompletionResponse {
  structuredChecklist: AiChecklistStructuredItem;
}
```

### 4.3. Thêm Endpoint áp dụng feedback Checklist (`src/ai/ai.controller.ts`)
* API mới hoặc mở rộng `POST /ai/feedback`: Nhận `caseId`, `feedback: ACCEPTED | REJECTED`, `feedbackType: 'CHECKLIST'`, và mảng các item được chọn để thêm vào hồ sơ.

---

## 5. Đề Xuất Giao Diện UI/UX (`CaseDetail.tsx` - Tab Trợ Lý AI)

### 5.1. Bố cục Widget "Gợi Ý Quy Trình & Checklist"
* Đặt ngay bên dưới phần phân tích loại đơn trong Tab **"✨ Trợ lý AI"**.
* **Nút kích hoạt:** **"✨ AI Gợi ý Quy trình Xử lý"** (Hiển thị hiệu ứng loading shimmer khi đang gọi API).
* **Card Hiển thị Kết quả:** Được chia làm 6 khối / Accordion với màu sắc nhận diện riêng:
  * 📋 **Việc cần làm** (Badge xanh dương)
  * 📁 **Tài liệu cần kiểm tra** (Badge tím)
  * 🤝 **Phối hợp thực hiện** (Badge xanh lá)
  * ⏰ **Thời hạn luật định** (Badge cam cảnh báo)
  * ⚠️ **Rủi ro nghiệp vụ** (Badge đỏ nổi bật)
  * 🚀 **Đề xuất bước tiếp theo** (Card highlight viền sáng)
* **Khung cảnh báo HITL:** Nằm phía trên cùng của kết quả:  
  *"⚠️ AI chỉ đề xuất quy trình tham khảo theo luật định. Cán bộ thụ lý chịu trách nhiệm rà soát và quyết định áp dụng vào checklist theo dõi của hồ sơ."*

### 5.2. Cụm nút thao tác
* **"✔️ Áp dụng checklist vào hồ sơ"**: Tự động tạo các checklist item trong bảng theo dõi của hồ sơ, hiển thị Toast thông báo thành công và có thể chuyển nhanh sang Tab "Checklist" để xem.
* **"❌ Không áp dụng"**: Ghi log từ chối, thu gọn khung gợi ý.

---

## 6. Kế Hoạch Kiểm Thử (Testing Strategy)

### 6.1. Kiểm thử tự động (Automated Tests - `ai.service.spec.ts`)
1. **Test Tạo Gợi ý Checklist:** Gọi hàm `suggestChecklist` với ngữ cảnh hồ sơ đất đai, xác nhận trả về đúng cấu trúc 6 mảng thông tin và gọi `aiAuditLog.create` với type `CHECKLIST`.
2. **Test Áp dụng Checklist (`ACCEPTED`):** Gọi API feedback checklist áp dụng, xác nhận:
   * Các bản ghi `CaseChecklistItem` mới được tạo trong database với đúng prefix.
   * `AiAuditLog` được cập nhật `userFeedback = ACCEPTED`.
   * `LegalCase.status` **hoàn toàn không thay đổi**.
3. **Test Từ chối Checklist (`REJECTED`):** Xác nhận không tạo bản ghi `CaseChecklistItem` nào, ghi log `REJECTED`.

### 6.2. Kiểm thử thủ công (Manual E2E Verification)
1. Mở trang chi tiết hồ sơ khiếu nại đất đai (`/cases/:id`).
2. Chuyển sang Tab **"✨ Trợ lý AI"**, nhấn nút **"✨ AI Gợi ý Quy trình Xử lý"**.
3. Kiểm tra tính hợp lý của 6 nhóm nội dung hiển thị trên giao diện.
4. Nhấn **"✔️ Áp dụng checklist vào hồ sơ"**.
5. Chuyển sang Tab **"Checklist"** của hồ sơ: Kiểm tra thấy các công việc mới đã xuất hiện với tiền tố rõ ràng (ví dụ: `[Việc cần làm]...`).
6. Kiểm tra database bằng lệnh SQL để xác nhận status hồ sơ vẫn giữ nguyên `NEW` hoặc trạng thái hiện tại.
