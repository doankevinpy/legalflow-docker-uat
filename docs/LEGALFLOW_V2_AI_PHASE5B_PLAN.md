# Kế Hoạch Kỹ Thuật Phase 5B: Chuẩn Hóa Mẫu Word Hành Chính Cho Các Bản Nháp AI

**Mốc xuất phát:** `v2.3.1-ai-phase5a-complete`  
**Ngày lập kế hoạch:** 28/06/2026  
**Trạng thái:** Lập kế hoạch (Chưa triển khai code)

---

## 1. Mục Tiêu Phase 5B

Nâng cấp chất lượng các file Word `.docx` được xuất từ ghi chú `CaseNote` của hồ sơ, đưa bố cục văn bản tiến sát với quy chuẩn thể thức văn bản hành chính nhà nước (Nghị định 30/2020/NĐ-CP). Qua đó, cán bộ thụ lý có thể chỉnh sửa, hoàn thiện và trình ký lãnh đạo nhanh chóng hơn, trong khi vẫn tuân thủ tuyệt đối nguyên tắc Human-in-the-Loop và nhãn cảnh báo an toàn **“BẢN NHÁP AI – CHƯA PHÁT HÀNH”**.

---

## 2. Phạm Vi Triển Khai & Yêu Cầu An Toàn Bắt Buộc

### 2.1. Phạm vi thực hiện
1. **Vẫn chỉ xuất file Word `.docx`** (sử dụng thư viện `docx` hiện có).
2. **Chưa xuất PDF**.
3. **Chưa ký số** (chưa tích hợp chứng thư số / chữ ký điện tử).
4. **Chưa phát hành văn bản** ra bên ngoài.
5. **Chưa gửi email/văn bản** tự động cho công dân hay các cơ quan liên quan.
6. **Chưa lưu file vào MinIO** hay kho lưu trữ đám mây.
7. **Chưa tích hợp** hệ thống quản lý văn bản bên ngoài (e-Office).
8. **Chưa tự đổi `LegalCase.status`**.
9. **Chưa tự đổi `assignedToId`**.

### 2.2. 10 Yêu cầu an toàn bắt buộc
1. **Không sửa `schema.prisma`** (Giữ nguyên tuyệt đối lược đồ cơ sở dữ liệu).
2. **Không tạo migration**.
3. **Không tự phát hành văn bản**.
4. **Không tự gửi văn bản/email**.
5. **Không tự ký số**.
6. **Không tự kết luận pháp lý** (Mọi nhận định thẩm quyền/căn cứ pháp lý đều phải có placeholder để cán bộ xác minh).
7. **Không tự đổi `LegalCase.status`**.
8. **Không tự đổi `assignedToId`**.
9. **File Word bắt buộc có nhãn trang trọng**: `⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH`.
10. **Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm** trước khi sử dụng.

---

## 3. Đánh Giá File Word Hiện Tại Của Phase 5A

### 3.1. Ưu điểm
- Đã ngăn chặn triệt để việc hardcode tên cơ quan, sử dụng placeholder `[Cán bộ bổ sung tên cơ quan ban hành]`.
- Đã có khung cảnh báo Human-in-the-Loop nổi bật màu cam ở đầu văn bản.
- Đã bóc tách được các dòng placeholder `[Cán bộ bổ sung...]` để tô màu cam in đậm in nghiêng.
- Đã ghi vết kiểm toán đầy đủ vào `AiAuditLog` mà không ảnh hưởng đến trạng thái hồ sơ.

### 3.2. Hạn chế cần khắc phục trong Phase 5B
1. **Bố cục dùng chung một khung duy nhất**: Cả 6 loại văn bản (từ Phiếu xử lý nội bộ đến Công văn, Giấy mời gửi ra ngoài) đang dùng chung một cấu trúc Footer (`Nơi nhận` bên trái và `CÁN BỘ THỤ LÝ` bên phải), điều này chưa phù hợp với văn bản hành chính gửi công dân/cơ quan khác (cần chữ ký của Lãnh đạo cơ quan ban hành).
2. **Thiếu thành phần Địa danh, ngày tháng**: Theo thể thức chuẩn, dưới Tiêu ngữ (`Độc lập - Tự do - Hạnh phúc`) phải có dòng địa danh và ngày tháng ban hành (Ví dụ: `..., ngày ... tháng ... năm 202...`). Phase 5A hiện đang bị thiếu dòng này.
3. **Căn lề Nơi nhận chưa chuẩn**: Phase 5A đang để `Nơi nhận` căn giữa (`AlignmentType.CENTER`) trong ô bảng, trong khi chuẩn văn bản hành chính là căn lề trái (`AlignmentType.LEFT`), chữ cỡ 12 in nghiêng.
4. **Xử lý đoạn văn bản (Paragraph splitting) còn đơn giản**: Việc tách dòng theo `split('\n')` chưa phân biệt được các khối thành phần như Trích yếu (`V/v...`), Kính gửi, hay các mục danh sách đánh số.

---

## 4. Đề Xuất Phân Nhóm & Mẫu Bố Cục Cho 6 Loại Bản Nháp

Để văn bản xuất ra gần với thể thức hành chính nhất mà không làm phức tạp hóa mã nguồn, đề xuất chia 6 loại văn bản thành **3 nhóm cấu trúc bố cục (Templates)**:

### Nhóm 1: Phiếu Nội Bộ (`PHIEU_XU_LY`)
- **Đặc điểm**: Dùng trong nội bộ cơ quan để báo cáo, đề xuất thụ lý hoặc phân công nhiệm vụ.
- **Bố cục đề xuất**:
  - **Đầu trang**: Tên cơ quan placeholder bên trái; Quốc hiệu Tiêu ngữ bên phải.
  - **Tiêu đề**: `PHIẾU ĐỀ XUẤT XỬ LÝ ĐƠN`.
  - **Nội dung**: Các thông tin tiếp nhận, đề xuất thụ lý, phân công.
  - **Chữ ký (2 cột)**:
    - Cột trái: `Ý KIẾN CỦA LÃNH ĐẠO` (để trống hoặc chấm lửng cho lãnh đạo phê duyệt).
    - Cột phải: `CÁN BỘ THỤ LÝ` (hiển thị tên cán bộ đang thao tác tải file).

### Nhóm 2: Văn Bản Có Tên Loại Gửi Ra Ngoài (`GIAY_MOI_LAM_VIEC`, `THONG_BAO_THU_LY`, `THONG_BAO_KHONG_THU_LY`)
- **Đặc điểm**: Gửi cho công dân hoặc tổ chức liên quan, có Tên loại văn bản rõ ràng.
- **Bố cục đề xuất**:
  - **Đầu trang**: Tên cơ quan & Số ký hiệu bên trái; Quốc hiệu, Tiêu ngữ & Địa danh ngày tháng bên phải.
  - **Tiêu đề & Trích yếu**: Tên loại văn bản (Ví dụ: `GIẤY MỜI`, `THÔNG BÁO`) căn giữa chữ in hoa đậm; ngay bên dưới là Trích yếu ngắn gọn chữ thường in đậm (Ví dụ: `Về việc làm việc giải quyết tranh chấp đất đai`).
  - **Kính gửi**: Tên công dân / cơ quan nhận văn bản.
  - **Nội dung**: Chi tiết thông báo / nội dung làm việc.
  - **Chữ ký (2 cột)**:
    - Cột trái: `Nơi nhận:` (căn trái, in đậm nghiêng), các gạch đầu dòng `- Như trên;`, `- Lưu: VT, Hồ sơ.` (căn trái, in nghiêng).
    - Cột phải: `[Cán bộ bổ sung thẩm quyền ký Lãnh đạo]` (Ví dụ: `TM. ỦY BAN NHÂN DÂN / CHỦ TỊCH`), bên dưới là `[Cán bộ bổ sung họ tên Lãnh đạo ký]`.

### Nhóm 3: Công Văn Gửi Ra Ngoài (`VAN_BAN_CHUYEN_DON`, `TRA_LOI_CONG_DAN_DU_THAO`)
- **Đặc điểm**: Văn bản hành chính không có tên loại (Công văn), Trích yếu đặt ngay bên dưới số ký hiệu ở cột trái.
- **Bố cục đề xuất**:
  - **Đầu trang**: Cột trái gồm Tên cơ quan placeholder, Số ký hiệu placeholder, và Trích yếu (`V/v chuyển đơn thư...`); Cột phải gồm Quốc hiệu, Tiêu ngữ & Địa danh ngày tháng placeholder.
  - **Tiêu đề**: (Công văn không có tiêu đề ở giữa trang, bắt đầu ngay bằng `Kính gửi:`).
  - **Nội dung**: Các đoạn văn bản trả lời hoặc chuyển đơn.
  - **Chữ ký (2 cột)**: Chuẩn như Nhóm 2 (Nơi nhận bên trái, Thẩm quyền & Người ký Lãnh đạo bên phải).

---

## 5. Nhận Diện Loại Văn Bản Từ Tiền Tố `CaseNote.content`

Hệ thống sẽ dùng Regex khớp chính xác tiền tố để phân loại vào đúng nhóm Template:
```typescript
const prefixMatch = noteContent.match(/^\[AI Dự thảo - (.*?)\]\s*(.*)$/s);
const rawTitle = prefixMatch ? prefixMatch[1].trim() : '';

let templateType = 'DEFAULT';
if (rawTitle.includes('Phiếu xử lý')) templateType = 'INTERNAL_NOTE';
else if (rawTitle.includes('Giấy mời') || rawTitle.includes('Thông báo')) templateType = 'NAMED_DOC';
else if (rawTitle.includes('Văn bản chuyển đơn') || rawTitle.includes('Trả lời công dân')) templateType = 'OFFICIAL_LETTER';
```

---

## 6. Làm Nổi Bật Placeholder `[Cán bộ bổ sung...]` & Tránh Hardcode

### 6.1. Quy tắc tránh hardcode tuyệt đối
Mọi thông tin phụ thuộc vào địa phương, cơ quan ban hành, địa danh hay chức danh lãnh đạo đều sử dụng danh sách placeholder chuẩn hóa:
- `[Cán bộ bổ sung tên cơ quan ban hành]`
- `[Cán bộ bổ sung số, ký hiệu văn bản]`
- `[Cán bộ bổ sung địa danh], ngày ... tháng ... năm 202...`
- `[Cán bộ bổ sung chức danh Lãnh đạo ký]`
- `[Cán bộ bổ sung họ tên Lãnh đạo ký]`

### 6.2. Kỹ thuật làm nổi bật trong Word (.docx)
Để đảm bảo cán bộ nhận diện ngay các điểm cần bổ sung trước khi in ấn hay ban hành, các object `TextRun` chứa cú pháp `[Cán bộ bổ sung...]` hoặc `[...]` sẽ được định dạng kép:
- **Font style**: In đậm (`bold: true`), in nghiêng (`italics: true`).
- **Màu chữ**: Màu cam đậm cảnh báo (`color: 'C2410C'`).
- **Màu nền (Highlight Shading)**: Nền vàng nhạt (`shading: { fill: 'FEF3C7', type: ShadingType.CLEAR }`), giúp khối placeholder nổi bật trên trang giấy trắng.

---

## 7. Đánh Giá Kiến Trúc & Cấu Hình Template

### 7.1. Đánh giá Schema
**Xác nhận 100% KHÔNG CẦN SỬA `schema.prisma`.** Toàn bộ thông tin cần thiết đều đã có trong hồ sơ (`LegalCase`), ghi chú (`CaseNote`) và thông tin người dùng đang thao tác (`user`).

### 7.2. Phương án tổ chức mã nguồn (Code Structure)
Thay vì nhồi nhét toàn bộ logic xây dựng bảng biểu Word vào `CasesService` gây phình to code, đề xuất tạo thêm 01 file helper nội bộ trong module `cases`:
- **File mới dự kiến**: `legalflow-backend/src/cases/docx-templates.helper.ts`
- **Nhiệm vụ**: Chứa các hàm module hóa như `createHeaderTable()`, `createWarningBanner()`, `createFooterSignature()`, `parseBodyParagraphs()`. Hàm `exportDocx` trong `CasesService` chỉ việc gọi các helper này theo `templateType`, giúp code sạch sẽ, dễ bảo trì và dễ viết unit test.

---

## 8. Báo Cáo Kế Hoạch Tổng Hợp

### 8.1. File dự kiến sửa / tạo mới
- **Tạo mới**: `legalflow-backend/src/cases/docx-templates.helper.ts` (Chứa logic dựng bảng biểu Word cho 3 nhóm template).
- **Chỉnh sửa**: `legalflow-backend/src/cases/cases.service.ts` (Cập nhật `exportDocx` để gọi helper phân nhóm template).
- **Chỉnh sửa**: `legalflow-backend/src/cases/cases.service.spec.ts` (Bổ sung unit test kiểm tra 6 loại tiền tố văn bản xuất ra đúng cấu trúc).

### 8.2. Luồng xử lý dự kiến
1. Controller nhận request `GET /cases/:id/notes/:noteId/export-docx`.
2. Service kiểm tra quyền truy cập của Staff, xác minh `CaseNote` tồn tại và thuộc đúng `caseId`.
3. Trích xuất tiền tố `[AI Dự thảo - ...]`, phân loại vào `INTERNAL_NOTE`, `NAMED_DOC` hoặc `OFFICIAL_LETTER`.
4. Gọi `docx-templates.helper.ts` để lắp ghép các khối: Header Table $\rightarrow$ Warning Banner $\rightarrow$ Document Title/Subject $\rightarrow$ Formatted Body Paragraphs $\rightarrow$ Footer Signature Table.
5. Tạo Buffer, ghi log vào `AiAuditLog` (actionType: `DRAFT`), trả stream về client.

### 8.3. Cấu trúc template đề xuất
Như đã mô tả chi tiết tại Mục 4, bảo đảm chuẩn hóa Quốc hiệu, Tiêu ngữ, lề trái Nơi nhận, và phân tách rõ ràng giữa văn bản nội bộ (Cán bộ thụ lý ký) với văn bản gửi công dân (Lãnh đạo ký).

### 8.4. Rủi ro pháp lý/nghiệp vụ & Biện pháp giảm thiểu
- **Rủi ro**: Công dân hoặc cơ quan khác nhận được văn bản có lỗi thể thức hoặc chứa chuỗi `[Cán bộ bổ sung...]` do cán bộ thụ lý quên chỉnh sửa.
- **Biện pháp giảm thiểu**: Giữ nguyên khung cảnh báo lớn màu cam ở đầu trang; tô nền vàng nhạt cho tất cả placeholder; thông điệp audit log ghi rõ trách nhiệm rà soát thuộc về cán bộ.

### 8.5. Cách kiểm thử (Testing Strategy)
- **Kiểm thử tự động (Automated Tests)**: Chạy `npm test` trong backend. Viết thêm test case giả lập 6 `CaseNote` với 6 tiền tố khác nhau, gọi `exportDocx()` và xác nhận trả về Buffer hợp lệ, không ném ngoại lệ, đồng thời kiểm tra `AiAuditLog` được tạo ra tương ứng.
- **Kiểm thử thủ công (Manual UAT)**: Trên giao diện web, chọn hồ sơ demo, tạo lần lượt 6 bản nháp AI. Bấm "📄 Tải Word (.docx)" cho từng bản nháp. Mở 6 file tải về trên Microsoft Word để kiểm tra trực quan các tiêu chí: Khung cảnh báo, Căn lề Nơi nhận, Bố cục chữ ký Lãnh đạo, Màu highlight placeholder.

### 8.6. Lệnh SQL kiểm chứng
```sql
-- 1. Kiểm tra log xuất Word mới nhất
SELECT "caseId", "actionType", "modelName", "status", "inputPayload"->>'action' AS action
FROM "AiAuditLog"
WHERE "modelName" = 'System-Docx-Exporter'
ORDER BY "createdAt" DESC LIMIT 5;

-- 2. Kiểm tra xác nhận tính bất biến của hồ sơ sau khi tải Word
SELECT id, "caseCode", status, "assignedToId"
FROM "LegalCase"
WHERE id = '<case_id_tested>';
```

---

## 9. Kết Luận & Khuyến Nghị Triển Khai

**Khuyến nghị: NÊN TRIỂN KHAI PHASE 5B.**  
Kế hoạch kỹ thuật đề xuất hoàn toàn khả thi, đáp ứng trọn vẹn mong muốn chuẩn hóa thể thức hành chính của người dùng mà **không hề làm thay đổi schema database, không chạm đến quy trình phát hành văn bản, và giữ vững 100% các nguyên tắc Human-in-the-Loop**. Việc tách ra file helper riêng cũng giúp kiến trúc code backend trở nên chuyên nghiệp và vững chắc hơn.
