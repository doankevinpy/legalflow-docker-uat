# Kế Hoạch Kỹ Thuật Triển Khai LegalFlow v2 AI – Phase 4B (Mở Rộng Soạn Thảo Văn Bản Nháp Nội Bộ)

**Phiên bản:** `v1.0-draft-plan`  
**Ngày lập kế hoạch:** 28/06/2026  
**Trạng thái:** Kế hoạch kỹ thuật (Chưa chỉnh sửa source code)

---

## 1. Mục Tiêu Phase 4B

Tiếp nối thành công của Phase 4A (hỗ trợ Phiếu xử lý đơn và Giấy mời làm việc), Phase 4B tập trung mở rộng năng lực **Trợ lý AI Soạn thảo văn bản nháp nội bộ** phục vụ giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh, thêm **03 loại văn bản nghiệp vụ cốt lõi**:

1. **Thông báo thụ lý / không thụ lý giải quyết đơn thư.**
2. **Văn bản chuyển đơn đến cơ quan/người có thẩm quyền giải quyết.**
3. **Nội dung trả lời công dân ở mức dự thảo nội bộ.**

Mục tiêu là tự động hóa khâu chuẩn bị văn bản dự thảo, giúp giảm 50-70% thời gian soạn thảo hành chính, đồng thời chuẩn hóa văn phong và đảm bảo tính chặt chẽ pháp lý theo quy định của Luật Tiếp công dân, Luật Khiếu nại, Luật Tố cáo và Luật Đất đai 2024.

---

## 2. Yêu Cầu An Toàn Bắt Buộc (Human-in-the-Loop & Safety Guardrails)

Trong suốt quá trình thiết kế và triển khai Phase 4B, hệ thống tuân thủ nghiêm ngặt 12 nguyên tắc an toàn tuyệt đối:

1. **AI chỉ tạo bản nháp nội bộ, không tự ban hành:** AI đóng vai trò thư ký hỗ trợ soạn nháp. Mọi văn bản sinh ra đều ở trạng thái nháp nội bộ chờ kiểm duyệt.
2. **Trách nhiệm cán bộ:** Cán bộ thụ lý bắt buộc phải kiểm tra, rà soát, chỉnh sửa câu từ và chịu trách nhiệm pháp lý hoàn toàn trước khi trình ký hoặc sử dụng.
3. **Nhãn cảnh báo pháp lý bắt buộc:** Mọi bản nháp sinh ra từ AI đều phải ghim nhãn cảnh báo ở vị trí đầu tiên:  
   `“BẢN NHÁP AI – CHƯA PHÁT HÀNH. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG.”`
4. **Tuyệt đối không tự thay đổi `LegalCase.status`:** Quá trình tạo nháp, lưu nháp hay từ chối nháp không được phép làm thay đổi trạng thái của hồ sơ (hồ sơ đang `NEW`, `IN_PROGRESS` phải giữ nguyên 100%).
5. **Tuyệt đối không tự gửi email/văn bản cho công dân:** Hệ thống không kết nối với các cổng gửi tự động tới người nộp đơn.
6. **Không tự tạo file Word/PDF trong Phase 4B:** Văn bản nháp chỉ hiển thị dạng văn bản thuần (plain text/markdown) trên trình duyệt và lưu trữ trong hệ thống quản lý ghi chú nội bộ.
7. **Chống suy diễn thẩm quyền:** Nếu dữ liệu hồ sơ chưa đủ cơ sở để xác định thẩm quyền (ví dụ thiếu địa chỉ thửa đất, chưa rõ cấp quản lý), AI không được tự ý kết luận thuộc hay không thuộc thẩm quyền mà phải đặt dấu hỏi hoặc hướng dẫn cán bộ kiểm tra.
8. **Chống suy diễn căn cứ pháp luật (Hallucination Prevention):** Nếu prompt/context không cung cấp đủ điều khoản cụ thể, AI không tự bịa ra điều/khoản/đểm của luật mà chỉ trích dẫn tên bộ luật gốc có liên quan.
9. **Cơ chế giữ chỗ bổ sung thông tin (`[Cán bộ bổ sung...]`):** Nếu nội dung dự thảo thiếu thông tin (ngày tháng ban hành, số quyết định, cơ quan nhận văn bản...), bản nháp phải ghi rõ placeholder để cán bộ nhận biết và điền vào, ví dụ: `[Cán bộ bổ sung số thông báo, ngày tháng thụ lý]`, `[Cán bộ bổ sung căn cứ pháp lý cụ thể]`.
10. **Lưu trữ qua `CaseNote` (Tái sử dụng kiến trúc):** Khi cán bộ bấm lưu bản nháp, tiếp tục sử dụng bảng `CaseNote` hiện có. **Không sửa đổi schema database (`schema.prisma`)**.
11. **Cam kết không chạm Schema:** Nhu cầu Phase 4B hoàn toàn đáp ứng được trên cấu trúc DB hiện tại. (Nếu có phát sinh bất khả kháng buộc sửa schema, sẽ dừng lại và báo cáo quản lý dự án trước).
12. **Kiểm toán minh bạch (`AiAuditLog`):** Mọi thao tác yêu cầu tạo nháp (`DRAFT`), lưu nháp (`ACCEPTED`) hay từ chối/hủy bản nháp (`REJECTED`) đều được lưu vết chi tiết vào bảng `AiAuditLog`.

---

## 3. Đánh Giá Lại Các File Hiện Có Của Phase 4A

Dưới đây là bảng đánh giá hiện trạng 10 file cốt lõi của Phase 4A và định hướng nâng cấp cho Phase 4B:

| File | Vai trò hiện tại (Phase 4A) | Đánh giá & Khả năng mở rộng cho Phase 4B |
| :--- | :--- | :--- |
| **`suggest-draft.dto.ts`** | Nhận `caseId`, `draftType`, `customInstructions`. | **Đạt chuẩn 100%**. Không cần sửa đổi cấu trúc DTO vì `draftType` là `string`, sẵn sàng truyền các mã loại văn bản mới. |
| **`draft-response.dto.ts`** | DTO truyền xuống tầng service/provider. | **Đạt chuẩn 100%**. Sẵn sàng nhận các mã `draftType` mới. |
| **`ai-feedback.dto.ts`** | Nhận feedback (`ACCEPTED`/`REJECTED`), `draftType`, `draftTitle`, `draftContent`. | **Đạt chuẩn 100%**. Cấu trúc fields hiện tại hoàn toàn tái sử dụng được cho 4 loại văn bản mới. |
| **`ai-provider.interface.ts`** | Định nghĩa method `draftResponse(context, draftType)`. | **Đạt chuẩn 100%**. Signature không thay đổi. |
| **`gemini.provider.ts`** | Xử lý mock và prompt LLM cho `PHIEU_XU_LY`, `GIAY_MOI_LAM_VIEC`. | **Cần mở rộng**: Bổ sung logic xử lý prompt và nhánh tạo Mock data cho 4 mã `draftType` mới (`THONG_BAO_THU_LY`, `THONG_BAO_KHONG_THU_LY`, `VAN_BAN_CHUYEN_DON`, `TRA_LOI_CONG_DAN_DU_THAO`) kèm placeholder `[Cán bộ bổ sung...]`. |
| **`ai.service.ts`** | Gọi provider, lưu `AiAuditLog`, ánh xạ tiền tố `[AI Dự thảo - ...]` vào `CaseNote`. | **Cần mở rộng**: Bổ sung ánh xạ tiền tố tương ứng cho 4 loại văn bản mới trong nhánh xử lý `submitFeedback (feedbackType === 'DRAFT')`. |
| **`ai.controller.ts`** | Routing `POST /ai/draft` và `POST /ai/feedback`. | **Đạt chuẩn 100%**. Giữ nguyên logic routing và RBAC guard. |
| **`casesApi.ts`** | Client API wrapper gọi endpoint backend. | **Đạt chuẩn 100%**. Sẵn sàng gửi tham số mới. |
| **`api-types.ts`** | Frontend interface `AiDraftResponse`. | **Đạt chuẩn 100%**. Tái sử dụng trọn vẹn. |
| **`CaseDetail.tsx`** | Giao diện Tab Trợ lý AI, dropdown chọn loại văn bản nháp, form chỉnh sửa và lưu. | **Cần mở rộng**: Bổ sung 4 thẻ `<option>` mới vào dropdown chọn loại văn bản nháp; tinh chỉnh title mặc định tương ứng khi chọn loại văn bản. |

---

## 4. Đề Xuất Mở Rộng Mã Loại Văn Bản (`draftType`)

Mở rộng danh sách mã loại văn bản nháp (Enum/Type) truyền giữa Frontend và Backend bao gồm 6 mã:

* *Đã có trong Phase 4A:*
  1. `PHIEU_XU_LY`: Phiếu xử lý đơn
  2. `GIAY_MOI_LAM_VIEC`: Giấy mời làm việc / đối thoại
* *Mở rộng trong Phase 4B:*
  3. `THONG_BAO_THU_LY`: Thông báo thụ lý giải quyết đơn thư
  4. `THONG_BAO_KHONG_THU_LY`: Thông báo không thụ lý giải quyết đơn thư
  5. `VAN_BAN_CHUYEN_DON`: Văn bản chuyển đơn đến cơ quan có thẩm quyền
  6. `TRA_LOI_CONG_DAN_DU_THAO`: Nội dung trả lời công dân (dự thảo nội bộ)

---

## 5. Đề Xuất UI/UX Cải Tiến Trong Tab "✨ Trợ lý AI"

Cập nhật khối lượng hiển thị **"📝 Soạn thảo văn bản nháp thông minh"** trong `CaseDetail.tsx`:

1. **Dropdown Loại văn bản nháp (`select`)**: Bổ sung các nhóm lựa chọn rõ ràng:
   - *Nhóm xử lý bước đầu:* Phiếu xử lý đơn | Giấy mời làm việc / đối thoại
   - *Nhóm thông báo thụ lý:* Thông báo thụ lý giải quyết | Thông báo không thụ lý giải quyết
   - *Nhóm chuyển đơn & trả lời:* Văn bản chuyển đơn đến cơ quan thẩm quyền | Dự thảo công văn trả lời công dân
2. **Khung hướng dẫn AI (`input`)**: Giữ nguyên gợi ý Placeholder linh hoạt theo ngữ cảnh, hướng dẫn cán bộ gõ thêm yêu cầu (ví dụ: *"Lý do từ chối: đã hết thời hiệu khiếu nại"*, *"Chuyển cho Thanh tra huyện..."*).
3. **Cảnh báo pháp lý nổi bật**: Hộp cảnh báo màu vàng (`AlertCircle`) duy trì hiển thị liên tục, nhấn mạnh chữ **"CHƯA PHÁT HÀNH - CÁN BỘ PHẢI KIỂM TRA"**.
4. **Trình chỉnh sửa (`textarea`)**: Cho phép cán bộ sửa đổi tự do mọi nội dung, đặc biệt là điền vào các vùng placeholder `[Cán bộ bổ sung...]` do AI gợi ý.
5. **Nút hành động đôi**:
   - `❌ Không sử dụng bản nháp`: Hủy nháp trên UI, ghi audit log `REJECTED`.
   - `💾 Lưu vào ghi chú hồ sơ`: Lưu vào `CaseNote`, ghi audit log `ACCEPTED`, tự động chuyển sang tab Lịch sử hồ sơ.

---

## 6. Đề Xuất Prompt Template & Cấu Trúc Placeholder

Dưới đây là định hướng Prompt Template và các vùng giữ chỗ (`[Cán bộ bổ sung...]`) bắt buộc cho 4 loại văn bản mới:

### 1. Thông báo thụ lý giải quyết (`THONG_BAO_THU_LY`)
* **Mục đích:** Thông báo cho người nộp đơn biết vụ việc đã đủ điều kiện và được chính thức tiếp nhận giải quyết.
* **Cấu trúc nội dung gợi ý:**
  - Tiêu ngữ, Tên cơ quan ban hành, Tiêu đề văn bản: *THÔNG BÁO Về việc thụ lý giải quyết đơn [khiếu nại/tố cáo/kiến nghị]*
  - Kính gửi: `[Tên người nộp đơn từ hồ sơ]`
  - Ngày nhận đơn và nội dung tóm tắt vụ việc.
  - Căn cứ tiếp nhận thụ lý (trích dẫn Luật Khiếu nại 2011 hoặc Luật Tố cáo 2018).
  - Vùng placeholder bắt buộc: `[Cán bộ bổ sung số thông báo]`, `[Cán bộ bổ sung ngày tháng thụ lý chính thức]`, `[Cán bộ bổ sung thời hạn giải quyết dự kiến (ví dụ: 30 ngày)]`, `[Cán bộ bổ sung bộ phận/công chức được giao xác minh]`.

### 2. Thông báo không thụ lý giải quyết (`THONG_BAO_KHONG_THU_LY`)
* **Mục đích:** Trả lời việc từ chối tiếp nhận giải quyết đơn do không đủ điều kiện theo quy định pháp luật.
* **Cấu trúc nội dung gợi ý:**
  - Tiêu ngữ, Tên văn bản: *THÔNG BÁO Về việc không thụ lý giải quyết đơn*
  - Kính gửi người nộp đơn kèm tóm tắt đơn thư.
  - Lý do không thụ lý (dựa trên phân tích nội dung hoặc chỉ dẫn từ cán bộ): ví dụ đã hết thời hiệu khiếu nại, người khiếu nại không có năng lực hành vi dân sự, vụ việc đã có quyết định giải quyết có hiệu lực pháp luật...
  - Vùng placeholder bắt buộc: `[Cán bộ bổ sung số thông báo]`, `[Cán bộ bổ sung điểm, khoản, điều cụ thể của Luật Khiếu nại/Tố cáo làm căn cứ từ chối]`, `[Cán bộ bổ sung hướng dẫn quyền khiếu nại tiếp theo cho công dân nếu có]`.

### 3. Văn bản chuyển đơn (`VAN_BAN_CHUYEN_DON`)
* **Mục đích:** Chuyển đơn thư không thuộc thẩm quyền của UBND xã tới đúng cơ quan/tổ chức có thẩm quyền giải quyết.
* **Cấu trúc nội dung gợi ý:**
  - Tiêu ngữ, Tên văn bản: *CONG VĂN V/v chuyển đơn thư của công dân*
  - Kính gửi: `[Cán bộ bổ sung tên cơ quan có thẩm quyền nhận đơn (ví dụ: UBND huyện, Tòa án nhân dân...)]`
  - Đồng kính gửi người nộp đơn (để biết).
  - Tóm tắt nội dung đơn thư tiếp nhận ngày...
  - Lý do chuyển đơn: Nội dung đơn vượt quá hoặc không thuộc thẩm quyền giải quyết của cấp xã theo quy định.
  - Vùng placeholder bắt buộc: `[Cán bộ bổ sung số công văn]`, `[Cán bộ bổ sung căn cứ pháp lý về thẩm quyền]`, `[Cán bộ bổ sung đề nghị cơ quan nhận đơn thông báo kết quả giải quyết]`.

### 4. Nội dung trả lời công dân dự thảo (`TRA_LOI_CONG_DAN_DU_THAO`)
* **Mục đích:** Trả lời giải thích, hướng dẫn hoặc cung cấp thông tin đối với đơn phản ánh, kiến nghị thông thường.
* **Cấu trúc nội dung gợi ý:**
  - Tiêu ngữ, Tên văn bản: *CONG VĂN V/v trả lời ý kiến, kiến nghị của công dân*
  - Kính gửi công dân nộp đơn.
  - Ghi nhận ý kiến phản ánh của công dân về vấn đề...
  - Nội dung giải trình / hướng dẫn cụ thể của cơ quan nhà nước.
  - Vùng placeholder bắt buộc: `[Cán bộ bổ sung kết quả xác minh thực tế tại địa phương]`, `[Cán bộ bổ sung các chỉ đạo mới nhất của UBND xã liên quan đến vụ việc]`.

---

## 7. Đề Xuất Ánh Xạ Tiền Tố Ghi Chú (`CaseNote Prefix`)

Quy định chuẩn ánh xạ tiền tố khi lưu bản nháp vào `CaseNote` nhằm bảo đảm tính đồng bộ và hỗ trợ tra cứu tự động:

| Mã loại văn bản (`draftType`) | Tiền tố ghi chú bắt buộc (`CaseNote Prefix`) |
| :--- | :--- |
| `PHIEU_XU_LY` *(Phase 4A)* | `[AI Dự thảo - Phiếu xử lý đơn]` |
| `GIAY_MOI_LAM_VIEC` *(Phase 4A)* | `[AI Dự thảo - Giấy mời làm việc]` |
| `THONG_BAO_THU_LY` *(Phase 4B)* | `[AI Dự thảo - Thông báo thụ lý]` |
| `THONG_BAO_KHONG_THU_LY` *(Phase 4B)* | `[AI Dự thảo - Thông báo không thụ lý]` |
| `VAN_BAN_CHUYEN_DON` *(Phase 4B)* | `[AI Dự thảo - Văn bản chuyển đơn]` |
| `TRA_LOI_CONG_DAN_DU_THAO` *(Phase 4B)* | `[AI Dự thảo - Trả lời công dân]` |

---

## 8. Kế Hoạch Kiểm Thử Tự Động (Automated Testing Plan)

Bổ sung các test case vào bộ kiểm thử unit test `ai.service.spec.ts` thuộc backend:

1. **Test `draftResponse` cho 4 loại văn bản mới:** Verified API gọi đúng provider và sinh ra nội dung draft kèm nhãn cảnh báo Human-in-the-Loop và placeholder `[Cán bộ bổ sung...]`. Đồng thời kiểm chứng ghi nhận `AiAuditLog` với `action = 'DRAFT'`, status `SUCCESS`.
2. **Test `submitFeedback` với `ACCEPTED` cho từng loại mới:** Truyền payload `feedbackType: 'DRAFT'`, `draftType: 'THONG_BAO_THU_LY'`... Kiểm chứng hệ thống gọi `prisma.caseNote.create` với đúng tiền tố tương ứng (`[AI Dự thảo - Thông báo thụ lý]\n\n...`).
3. **Test nguyên tắc bất biến trạng thái:** Khẳng định `prisma.legalCase.update` **tuyệt đối không được gọi** trong cả hai trường hợp `ACCEPTED` và `REJECTED`.
4. **Test `submitFeedback` với `REJECTED`:** Khẳng định `prisma.caseNote.create` **không được gọi**, chỉ cập nhật `AiAuditLog.userFeedback = 'REJECTED'`.

---

## 9. Kế Hoạch Kiểm Thử Thủ Công & Lệnh SQL Kiểm Chứng

### Kế hoạch kiểm thử trên UI (`CaseDetail.tsx`)
1. Đăng nhập hệ thống, mở hồ sơ đơn thư bất kỳ ở trạng thái `NEW`. Note lại mã hồ sơ (`id`) và trạng thái.
2. Mở tab **"✨ Trợ lý AI"**, chọn lần lượt 4 loại văn bản mới trong dropdown.
3. Gõ thêm chỉ dẫn vào ô input và nhấn **"✨ Tạo bản nháp AI"**.
4. Kiểm tra văn bản hiển thị trên textarea: xác nhận có dòng nhãn cảnh báo đầu tiên và có các đoạn `[Cán bộ bổ sung...]`.
5. Thử gõ chỉnh sửa nội dung trong textarea (ví dụ thay thế `[Cán bộ bổ sung số thông báo]` thành `123/TB-UBND`).
6. Nhấn **"💾 Lưu vào ghi chú hồ sơ"**, xác nhận hệ thống báo thành công và chuyển sang tab Lịch sử xử lý.
7. Thử nghiệm tạo nháp và bấm **"❌ Không sử dụng bản nháp"**, xác nhận form bị xóa trắng và không tạo ghi chú.

### Lệnh SQL kiểm chứng dữ liệu

#### 1. Kiểm tra bảng `CaseNote` (Xác nhận tạo đúng 4 tiền tố mới)
```sql
SELECT id, "caseId", "userId", content, "createdAt" 
FROM "CaseNote" 
WHERE "caseId" = '<YOUR_CASE_ID>' 
  AND (
    content LIKE '[AI Dự thảo - Thông báo thụ lý]%' OR
    content LIKE '[AI Dự thảo - Thông báo không thụ lý]%' OR
    content LIKE '[AI Dự thảo - Văn bản chuyển đơn]%' OR
    content LIKE '[AI Dự thảo - Trả lời công dân]%'
  )
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Trả về các bản ghi ghi chú chính xác theo các loại văn bản đã bấm lưu, giữ trọn vẹn nội dung cán bộ đã chỉnh sửa trên trình duyệt.

#### 2. Kiểm tra bảng `AiAuditLog` (Xác nhận lưu vết kiểm toán)
```sql
SELECT id, "caseId", "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND "action" = 'DRAFT'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Có các bản ghi nhật ký kiểm toán mới cho mỗi lần gọi AI soạn thảo; `userFeedback` cập nhật đúng `ACCEPTED` hoặc `REJECTED`.

#### 3. Kiểm tra bảng `LegalCase` (Xác nhận tuyệt đối không đổi trạng thái)
```sql
SELECT id, "caseCode", status, "assignedToId", "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```
*Kết quả kỳ vọng:* Giá trị `status` giữ nguyên 100% như ban đầu trước khi kiểm thử.

---

## 10. Lộ Trình Triển Khai Tiếp Theo (Khởi chạy Phase 4B)

Khi kế hoạch kỹ thuật này được phê duyệt, lộ trình thực thi source code bao gồm các bước tuần tự:
1. Cập nhật `gemini.provider.ts` (Thêm mock data & LLM prompt cho 4 loại văn bản mới).
2. Cập nhật ánh xạ tiền tố trong `ai.service.ts`.
3. Bổ sung unit tests trong `ai.service.spec.ts`.
4. Cập nhật dropdown trong `CaseDetail.tsx`.
5. Chạy kiểm tra toàn bộ suite test và build production (`npm test`, `npm run build`).
