# Kế Hoạch Kỹ Thuật Phase 5D: Xuất PDF Từ Bản Nháp AI / File Word Nháp AI

**Mốc xuất phát:** `v2.3.5-ai-phase5c-complete`  
**Ngày lập kế hoạch:** 29/06/2026  
**Trạng thái:** Lập kế hoạch (Chưa triển khai source code)

---

## 1. Mục Tiêu Phase 5D

- **Mở rộng năng lực kết xuất văn bản**: Cho phép cán bộ thụ lý xuất bản nháp AI ra định dạng PDF để tiện lợi xem trước (preview), in ấn hoặc chia sẻ nội bộ trên các thiết bị di động/trình duyệt không cài đặt Microsoft Word.
- **Bảo đảm chuẩn mực thể thức hành chính**: Tái hiện chính xác bố cục Quốc hiệu, Tiêu ngữ, số ký hiệu, thông tin cơ quan (đã tích hợp từ Phase 5C) trên định dạng tài liệu cố định PDF.
- **Giữ vững nguyên tắc cốt lõi Human-in-the-Loop**: Tất cả bản xuất PDF bắt buộc duy trì nhãn cảnh báo trang trọng **“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH”** và không thay thế vai trò rà soát của cán bộ.

---

## 2. Phạm Vi Triển Khai & Yêu Cầu An Toàn Bắt Buộc

### 2.1. Phạm vi thực hiện
1. **Chỉ xuất PDF bản nháp**.
2. **Không ký số** (không tích hợp chữ ký điện tử / chứng thư số).
3. **Không phát hành văn bản** ra bên ngoài hay gửi liên thông e-Office.
4. **Không gửi email/văn bản** tự động cho công dân.
5. **Không tích hợp** hệ thống quản lý văn bản bên ngoài.
6. **Không tự đổi `LegalCase.status`**.
7. **Không tự đổi `assignedToId`**.
8. **Không tự sửa nội dung `CaseNote`**.
9. **Không thay thế bản Word `.docx` hiện có** (Song hành hai lựa chọn Tải Word và Xem/Tải PDF).

### 2.2. 10 Yêu cầu an toàn bắt buộc
1. PDF phải có nhãn: `⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH`.
2. PDF phải có cảnh báo: `Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng.`
3. **Không tự ký số**.
4. **Không tự phát hành**.
5. **Không tự gửi văn bản/email**.
6. **Không tự kết luận pháp lý**.
7. **Không tự đổi `LegalCase.status`**.
8. **Không tự đổi `assignedToId`**.
9. **Nếu cấu hình cơ quan thiếu, vẫn phải dùng placeholder** `[Cán bộ bổ sung...]` nổi bật màu cam.
10. **Nếu cần sửa schema hoặc tạo migration, phải dừng lại và báo cáo xin duyệt trước.**

---

## 3. Phân Tích & Đánh Giá 4 Phương Án Kỹ Thuật

Dưới đây là bảng phân tích toàn diện 4 phương án xuất PDF theo 11 tiêu chí đánh giá kỹ thuật:

| Tiêu Chí Đánh Giá | Phương Án A<br>*(Tải Word & Tự Save as PDF)* | Phương Án B<br>*(Backend sinh PDF bằng Node.js Library - pdfkit/jspdf/puppeteer)* | Phương Án C<br>*(Backend chuyển DOCX sang PDF bằng LibreOffice headless)* | Phương Án D<br>*(Frontend Print Preview & In PDF qua Trình duyệt - window.print)* |
| :--- | :--- | :--- | :--- | :--- |
| **Mô tả kỹ thuật** | Cán bộ tải file `.docx` từ hệ thống, mở bằng MS Word trên máy cá nhân và chọn bấm Save As -> PDF. | Backend dùng thư viện lập trình (như `pdfkit` hoặc `puppeteer`) tự vẽ bảng biểu hoặc render HTML sang buffer PDF. | Backend tạo file `.docx`, sau đó gọi tiến trình shell `libreoffice --headless --convert-to pdf` để chuyển đổi sang PDF. | Frontend tạo modal/trang xem trước (Preview) được định dạng CSS chuẩn hành chính (`@media print`), người dùng bấm "In / Tải PDF" qua trình duyệt. |
| **Ưu điểm lớn nhất** | **0 dòng code mới.** Bố cục 100% chuẩn Microsoft Word. | Tự động hóa hoàn toàn ở server, tải trực tiếp file `.pdf` về máy. | Tận dụng 100% logic template Word từ helper `docx-templates.helper.ts`. | **Không nặng server, không lỗi font, không sửa Dockerfile, không thêm package.** Trải nghiệm trực quan tuyệt vời. |
| **Nhược điểm** | Thêm thao tác thủ công cho cán bộ. Phụ thuộc vào việc máy cán bộ có cài sẵn MS Word. | Phải viết lại và bảo trì song song 2 bộ logic giao diện (Word Helper và PDF Generator). | Làm phình to dung lượng Docker image lên thêm **300MB - 500MB**. Chậm (mất 1-2 giây/file). Dễ lỗi trên Windows local nếu chưa cài LibreOffice. | Phụ thuộc vào công cụ Print của trình duyệt (Chrome/Edge/Firefox) để lưu thành PDF. |
| **Rủi ro font tiếng Việt** | **Không rủi ro** (MS Word tự xử lý font hệ thống). | **Rủi ro cao** (Phải tải và nhúng file font TTF Times New Roman vào bundle server nếu dùng `pdfkit`). | **Rủi ro trung bình** (Bắt buộc phải cài gói font tiếng Việt vào container Linux Docker). | **Không rủi ro** (Trình duyệt tự sử dụng font Times New Roman / Arial có sẵn trên máy cán bộ). |
| **Rủi ro bố cục hành chính** | **Không rủi ro**. | **Rủi ro cao** (Khó căn chỉnh bảng biểu 2 cột Header/Footer chuẩn Nghị định 30 bằng code vẽ PDF). | **Rủi ro thấp** (Có thể bị xô lệch nhẹ lề hoặc dòng khi LibreOffice parse bảng biểu Word). | **Rủi ro rất thấp** (Dễ dàng kiểm soát từng milimet bằng CSS flexbox/grid và `@page { margin: 2cm }`). |
| **Ảnh hưởng Docker / OS** | Không ảnh hưởng. | Nặng nề nếu dùng Puppeteer (cần tải Chromium ~150MB). Nhẹ nếu dùng `pdfkit`. | Rất nặng nề (phải cài đặt bộ Office suite trên container Linux). | **Hoàn toàn không ảnh hưởng đến Backend hay Docker.** |
| **Cần thêm package?** | **Không**. | **Có** (`pdfkit`, `puppeteer`...). | **Không** (nhưng cần cài OS package libreoffice). | **Không**. |
| **Cần sửa Dockerfile?** | **Không**. | **Có thể** (nếu dùng Puppeteer cần cài libx11, nss...). | **Bắt buộc có** (`apt-get install libreoffice`). | **Không**. |
| **Cần sửa Schema / DB?** | **Không**. | **Không**. | **Không**. | **Không**. |
| **Cần lưu file MinIO?** | **Không**. | **Không** (stream trực tiếp). | **Không** (stream trực tiếp). | **Không** (render tại trình duyệt). |
| **Khả năng Rollback** | Tức thì. | Trung bình. | Khó khăn (liên quan đến build lại Docker image). | **Tức thì 100%**. |
| **Độ phù hợp UAT/Demo** | Thấp (thiếu tính năng tự động). | Trung bình (mất thời gian phát triển lâu). | Thấp (rủi ro phình Docker image). | **RẤT CAO (Xuất sắc nhất cho UAT & Demo hiện tại)**. |

---

## 4. Đề Xuất & Khuyến Nghị Triển Khai

### 4.1. Có nên làm Phase 5D ngay không?
👉 **NÊN LÀM.** Việc bổ sung khả năng xem trước và tải PDF giúp trải nghiệm hệ thống LegalFlow AI trở nên hoàn thiện, hiện đại, hỗ trợ cán bộ rà soát văn bản nhanh chóng ngay trên màn hình máy tính bảng hoặc trình duyệt mà không cần tải file Word về máy mở lên.

### 4.2. Chọn phương án nào an toàn nhất?
👉 **KHUYẾN NGHỊ CHỌN PHƯƠNG ÁN D (Frontend Print Preview & In PDF qua Trình duyệt).**
Đây là giải pháp *"vàng"* đáp ứng trọn vẹn tiêu chí an toàn, không rủi ro, không làm phình Docker container, không lo lỗi font tiếng Việt và hoàn toàn không chạm đến cơ sở dữ liệu hay cấu hình hạ tầng máy chủ.

### 4.3. Lộ trình chia nhỏ Phase 5D
Để quản lý rủi ro tốt nhất, đề xuất chia lộ trình Phase 5D thành 3 mốc:
- **Phase 5D-Plan (Mốc hiện tại)**: Nghiên cứu, đánh giá các phương án kỹ thuật và chốt hướng đi.
- **Phase 5D-A (Ưu tiên triển khai ngay cho UAT)**: Xây dựng tính năng **Print Preview / Browser PDF** trên Frontend (Phương án D) kết hợp API trả dữ liệu chuẩn hóa từ Backend.
- **Phase 5D-B (Tùy chọn mở rộng trong tương lai)**: Nghiên cứu xuất Server-side PDF (Phương án B hoặc C) chỉ khi có yêu cầu phát hành văn bản hàng loạt chạy ngầm không cần tương tác màn hình.

---

## 5. Chi Tiết Kế Hoạch Triển Khai Phase 5D-A (Phương Án D)

### 5.1. File dự kiến sửa / tạo mới
- **Backend**:
  - `legalflow-backend/src/cases/cases.controller.ts`: Thêm API endpoint `GET /cases/:id/notes/:noteId/preview-data` (trả về JSON cấu trúc văn bản đã chuẩn hóa cùng cấu hình cơ quan để frontend render, đồng thời ghi log kiểm toán).
  - `legalflow-backend/src/cases/cases.service.ts`: Thêm hàm `getDraftPreviewData()` tái sử dụng `identifyTemplateGroup()` và `getAgencyConfig()`.
- **Frontend**:
  - `src/components/case/AiDraftPrintModal.tsx` *(Tạo mới)*: Component Modal hiển thị bản nháp chuẩn thể thức hành chính trên nền giấy trắng A4, có nút **"🖨️ In / Tải PDF"**.
  - `src/pages/CaseDetail.tsx`: Thêm nút **"📄 Xem & In PDF"** bên cạnh nút tải Word tại danh sách bản nháp AI.

### 5.2. API & UI dự kiến thêm
- **API Endpoint mới**: `GET /api/cases/:id/notes/:noteId/preview-data`
  ```json
  {
    "success": true,
    "data": {
      "caseCode": "LF-2026-001",
      "templateGroup": "NAMED_DOC",
      "draftTitle": "GIẤY MỜI LÀM VIỆC",
      "draftBody": "Nội dung văn bản...",
      "agencyConfig": {
        "parentName": "UBND HUYỆN BÌNH CHÁNH",
        "name": "UBND XÃ BÌNH MINH",
        "location": "Bình Minh",
        "signerTitle": "TM. ỦY BAN NHÂN DÂN\nCHỦ TỊCH",
        "signerName": "Nguyễn Văn A",
        "defaultRecipients": ["- Như trên;", "- Lưu: VT, Hồ sơ."]
      },
      "warningBanner": "⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH"
    }
  }
  ```
- **Giao diện UI (Print Preview Modal)**:
  - Khung xem trước mô phỏng tờ giấy A4 (tỷ lệ 210x297mm), viền bóng mờ trang nhã.
  - Phía trên có thanh công cụ với nút **"🖨️ In / Tải PDF"** và nút **"📄 Tải Word (.docx)"**.
  - Khi bấm nút In, trình duyệt tự động mở hộp thoại Print (nhờ lệnh `window.print()`), với CSS `@media print` tự động ẩn thanh công cụ, chỉ in phần nội dung tờ giấy A4 ra file PDF sắc nét.

---

## 6. Kế Hoạch Kiểm Thử (Testing Strategy)

### 6.1. Kiểm thử tự động (`npm test`)
- Viết unit test cho hàm `getDraftPreviewData()` trong `cases.service.spec.ts` đảm bảo trả về đúng cấu trúc JSON, đúng phân loại nhóm template và tích hợp đầy đủ `AgencyConfig`.
- Kiểm thử tích hợp xác minh API endpoint ghi nhận thành công log kiểm toán `AiAuditLog` với `action: EXPORT_PDF_PREVIEW`.

### 6.2. Kiểm thử thủ công (Manual UAT)
1. Truy cập trang chi tiết hồ sơ UAT, mở danh sách bản nháp AI.
2. Bấm nút **"📄 Xem & In PDF"**. Xác minh Modal hiển thị lên trang giấy A4 với bố cục Quốc hiệu Tiêu ngữ chuẩn mực, có banner cảnh báo màu cam ở đầu trang.
3. Bấm nút **"🖨️ In / Tải PDF"**. Trên hộp thoại in của trình duyệt (Chrome/Edge), chọn đích đến là **"Save as PDF" (Lưu thành PDF)**.
4. Mở file PDF vừa lưu lên kiểm tra: Không bị xô lệch dòng, font chữ Times New Roman/Arial tiếng Việt hiển thị hoàn hảo, không bị dính các nút bấm UI vào trang in.

---

## 7. Lệnh SQL Kiểm Chứng Audit & Trạng Thái

```sql
-- 1. Kiểm tra log kiểm toán xem / tải PDF bản nháp
SELECT id, "caseId", "actionType", "modelName", "status", "inputPayload"
FROM "AiAuditLog"
WHERE "modelName" = 'System-Pdf-Preview-Exporter'
ORDER BY "createdAt" DESC LIMIT 5;

-- 2. Kiểm chứng tính bất biến tuyệt đối của hồ sơ (không thay đổi trạng thái, người thụ lý)
SELECT id, "caseCode", status, "assignedToId", "updatedAt"
FROM "LegalCase"
WHERE id = '<id_hồ_sơ_vừa_test>';
```

---

## 8. Đánh Giá Rủi Ro Nghiệp Vụ & Pháp Lý

- **Rủi ro nhầm lẫn file PDF bản nháp với văn bản chính thức**: Do PDF là định dạng khó chỉnh sửa, nếu in ra tờ giấy trắng có thể khiến người đọc hiểu lầm đây là quyết định cuối cùng của cơ quan.
- **Biện pháp giảm thiểu triệt để**:
  - CSS in ấn (`@media print`) bắt buộc hiển thị viền kép màu cam và nhãn cảnh báo **“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH”** ở ngay đầu mỗi trang in.
  - Dòng nhắc nhở bên cạnh chữ ký: *“Bản thảo nội bộ - Cán bộ chịu trách nhiệm rà soát trước khi trình ký chính thức”*.

---

## 9. Kết Luận Khuyến Nghị

- **Phê duyệt Kế hoạch Phase 5D**: Thống nhất triển khai theo **Phương án D (Frontend Print Preview & Browser PDF - Mốc Phase 5D-A)**.
- Đây là bước đi thông minh nhất về mặt kỹ thuật: vừa mang lại trải nghiệm chuyên nghiệp vượt trội cho cán bộ UAT, vừa bảo đảm **100% an toàn cho hạ tầng Docker và cơ sở dữ liệu** theo đúng nguyên tắc mà bạn đã quán triệt.
