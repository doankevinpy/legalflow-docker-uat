# Báo Cáo Hoàn Thành Phase 5D-A: Xuất PDF Từ Bản Nháp AI (Frontend Print Preview & Browser PDF)

**Mốc hoàn thành (Git Tag):** `v2.3.6-ai-phase5d-browser-pdf-preview`  
**Ngày hoàn thành:** 03/07/2026  
**Trạng thái:** Hoàn thành triển khai, kiểm thử và đóng gói.

---

## 1. Mục Tiêu Phase 5D-A

- **Bổ sung chức năng xem trước bản nháp AI theo định dạng trang giấy A4**, tái hiện chuẩn mực thể thức văn bản hành chính theo Nghị định 30/2020/NĐ-CP ngay trên trình duyệt web.
- **Hỗ trợ cán bộ thụ lý in ấn trực tiếp hoặc lưu thành tệp PDF** thông qua công cụ in của trình duyệt (`window.print()`), phục vụ xem nhanh, chia sẻ nội bộ hoặc trình ký nháp.
- **Duy trì tuyệt đối nguyên tắc cốt lõi Human-in-the-Loop**, bảo đảm văn bản xem trước và in ra luôn hiển thị rõ ràng nhãn cảnh báo trang trọng **“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH”** để nhắc nhở trách nhiệm kiểm tra, thẩm định của cán bộ thụ lý.

---

## 2. Phạm Vi Đã Triển Khai

1. **Chỉ triển khai Frontend Print Preview & Browser PDF (Phương án D)**.
2. **Không dùng LibreOffice** (chống phình to dung lượng Docker container).
3. **Không dùng Puppeteer** hay trình duyệt không đầu (headless browser).
4. **Không dùng `pdfkit`** hay thư viện tạo PDF nặng ở phía máy chủ.
5. **Không thêm package nặng** vào `package.json`.
6. **Không sửa đổi `Dockerfile`**.
7. **Không sửa đổi `schema.prisma`**.
8. **Không tạo migration mới**.
9. **Không lưu file PDF vào MinIO** hay kho lưu trữ đám mây.
10. **Không ký số** (chưa tích hợp chữ ký điện tử / chứng thư số).
11. **Không phát hành văn bản** ra bên ngoài.
12. **Không gửi email/văn bản** tự động cho công dân.
13. **Không tự động đổi `LegalCase.status`**.
14. **Không tự động đổi `assignedToId`**.

---

## 3. File & Code Chính Đã Sửa Hoặc Thêm

- `src/components/AiDraftPrintModal.tsx` *(Tạo mới)*: Component Modal hiển thị bản nháp AI mô phỏng tờ giấy A4 (tỷ lệ 210x297mm), tích hợp CSS in ấn chuyên biệt (`@media print`) và xử lý lệnh `window.print()`.
- `src/pages/CaseDetail.tsx`: Bổ sung nút **“🖨️ Xem & In PDF”** song hành cùng nút Tải Word cho các ghi chú nội bộ có tiền tố `[AI Dự thảo - ...]`, quản lý trạng thái modal preview.
- `src/lib/casesApi.ts`: Bổ sung phương thức gọi API `getDraftPreviewData()`.
- `legalflow-backend/src/cases/cases.controller.ts`: Thêm API endpoint `GET /cases/:id/notes/:noteId/preview-data`.
- `legalflow-backend/src/cases/cases.service.ts`: Xây dựng hàm `getDraftPreviewData()`, đọc nội dung ghi chú, tích hợp cấu hình cơ quan và ghi nhận log kiểm toán `AiAuditLog`.
- `legalflow-backend/src/cases/docx-templates.helper.ts`: Tách hàm tiện ích `cleanDraftBodyLines()` để sử dụng chung cho cả luồng xuất file Word `.docx` và luồng xem trước PDF, bảo đảm sự đồng nhất 100% về cấu trúc văn bản giữa hai định dạng.

---

## 4. API Đã Thêm

- **Endpoint**: `GET /cases/:caseId/notes/:noteId/preview-data`
- **Quyền truy cập**: `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` (được kiểm tra quyền truy cập hồ sơ của cán bộ thụ lý theo cấu trúc hiện hành).
- **Mục đích**: Trả về cấu trúc JSON đã được chuẩn hóa từ trường `content` của `CaseNote`, kết hợp cùng cấu hình cơ quan (`AgencyConfig`) và phân loại nhóm mẫu hành chính (`templateGroup`).
- **Đặc tính an toàn**: Chỉ phục vụ đọc dữ liệu xem trước và in PDF nháp nội bộ, hoàn toàn không thực hiện bất kỳ thay đổi nào lên trạng thái hay dữ liệu hồ sơ.

```json
{
  "caseCode": "LF-2026-001",
  "templateGroup": "NAMED_DOC",
  "draftTitle": "GIẤY MỜI LÀM VIỆC",
  "cleanedLines": ["Kính gửi: Ông Nguyễn Văn A...", "Nội dung mời làm việc..."],
  "agencyConfig": {
    "parentName": "UBND HUYỆN BÌNH CHÁNH",
    "name": "UBND XÃ BÌNH MINH",
    "location": "Bình Minh",
    "signerTitle": "TM. ỦY BAN NHÂN DÂN\nCHỦ TỊCH",
    "signerName": "Nguyễn Văn A",
    "defaultRecipients": ["- Như trên;", "- Lưu: VT, Hồ sơ."],
    "isConfigured": true
  },
  "warningBanner": "⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH",
  "warningDisclaimer": "Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng."
}
```

---

## 5. Cơ Chế Hoạt Động

1. Tại danh sách ghi chú của trang chi tiết hồ sơ, đối với mỗi ghi chú nháp AI, cán bộ thụ lý bấm nút **“🖨️ Xem & In PDF”**.
2. Frontend gọi API `GET /cases/:id/notes/:noteId/preview-data` để lấy dữ liệu văn bản đã được bóc tách cùng cấu hình cơ quan.
3. Modal `AiDraftPrintModal` mở ra, hiển thị bản nháp AI trên phông nền mô phỏng tờ giấy A4 trắng trang nhã, với Header cơ quan, Quốc hiệu Tiêu ngữ, số ký hiệu và chữ ký chuẩn chỉnh. Phía trên trang giấy hiển thị nổi bật banner màu cam **“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH”**.
4. Cán bộ bấm nút **“🖨️ In / Lưu PDF”** trên thanh công cụ của modal.
5. Trình duyệt tự động thực thi lệnh `window.print()`, mở ra hộp thoại in tiêu chuẩn của hệ điều hành / trình duyệt (Chrome, Edge, Firefox, Safari).
6. Người dùng chọn đích đến là **"Save as PDF" (Lưu thành PDF)** hoặc gửi trực tiếp tới máy in văn phòng.

---

## 6. Cơ Chế In Ấn Chuyên Biệt (`@media print`)

Để bảo đảm trang in ra đạt độ hoàn thiện cao nhất, Modal tích hợp khối CSS in ấn cô lập:
- **`visibility: hidden !important;` trên `body *`**: Tự động che giấu toàn bộ giao diện nền của phần mềm (thanh điều hướng bên trái, header bên trên, các nút bấm thao tác, khung nền tối màu của modal).
- **`visibility: visible !important;` trên `#ai-draft-print-area`**: Phục hồi hiển thị duy nhất cho khu vực tờ giấy A4 mô phỏng.
- **Định vị tuyệt đối (`top: 0; left: 0; width: 100%`)**: Đưa vùng văn bản A4 đặt căn khít chính xác vào góc trên bên trái của trang in thực tế, triệt tiêu mọi khoảng trắng thừa hay đổ bóng giao diện web.
- **Khối `.no-print`**: Ẩn thanh công cụ modal (chứa nút đóng, nút tải Word, nút bấm in) khỏi bản in.
- **Khả năng hiển thị font tiếng Việt hoàn hảo**: Tận dụng trực tiếp phông chữ serif (`Times New Roman`) của hệ thống trình duyệt, không gặp bất kỳ hiện tượng vỡ chữ hay lỗi bảng mã tiếng Việt nào.

---

## 7. Nguyên Tắc An Toàn Đã Bảo Đảm

Đã tuân thủ trọn vẹn 9 nguyên tắc an toàn bất khả xâm phạm:
1. **PDF sinh ra vẫn chỉ là bản nháp nội bộ**.
2. **Luôn có nhãn cảnh báo cán bộ phải rà soát, kiểm tra, chỉnh sửa và chịu trách nhiệm pháp lý**.
3. **Không tự động ký số**.
4. **Không tự động phát hành văn bản**.
5. **Không tự động gửi văn bản/email cho công dân**.
6. **Không tự động kết luận pháp lý thay cán bộ**.
7. **Tuyệt đối không đổi `LegalCase.status`**.
8. **Tuyệt đối không đổi `assignedToId`**.
9. **Không sửa đổi bất kỳ nội dung gốc nào trong bảng `CaseNote`**.

---

## 8. Audit Log

Thao tác xem trước và in bản nháp PDF được hệ thống ghi nhận đầy đủ vào bảng kiểm toán `AiAuditLog` bảo đảm tính minh bạch:
- **`actionType`**: `DRAFT`
- **`modelName`**: `System-Pdf-Preview-Exporter`
- **Payload (`inputPayload`/`outputPayload`)**:
  ```json
  {
    "action": "EXPORT_PDF_PREVIEW",
    "caseId": "<uuid>",
    "noteId": "<uuid>",
    "fileType": "pdf_preview",
    "templateGroup": "NAMED_DOC",
    "agencyConfigApplied": true,
    "missingConfigs": []
  }
  ```

---

## 9. Kết Quả Test / Build

1. **Kiểm thử tự động (`npm test` tại backend)**:
   - Passed **8/8 Test Suites**, **39/39 Tests**. Việc tách hàm tiện ích làm sạch văn bản hoàn toàn tương thích ngược và không gây ảnh hưởng đến luồng sinh Word hiện có.
2. **Build Backend (`npm run build`)**: Thành công (`nest build` hoàn tất không lỗi TypeScript).
3. **Build Frontend (`npm run build`)**: Thành công (`vite build` đóng gói bundle production thuận lợi).
4. **Kiểm tra thủ công toàn diện 6 loại bản nháp AI**:
   - Đã kiểm chứng hiển thị modal A4 và hộp thoại in trình duyệt thành công cho đủ **6 nhóm bản nháp AI** trong hệ thống:
     1. *Phiếu xử lý đơn* (`INTERNAL_NOTE`)
     2. *Giấy mời làm việc* (`NAMED_DOC`)
     3. *Thông báo thụ lý* (`NAMED_DOC`)
     4. *Thông báo không thụ lý* (`NAMED_DOC`)
     5. *Văn bản chuyển đơn* (`OFFICIAL_LETTER`)
     6. *Trả lời công dân dự thảo* (`OFFICIAL_LETTER`)
   - Tất cả đều hiển thị đúng cấu trúc Header/Footer, nhãn cảnh báo màu cam nổi bật và hoạt động hoàn hảo khi chuyển sang PDF.

---

## 10. Lệnh SQL Kiểm Chứng

```sql
-- 1. Kiểm tra log kiểm toán xem / in PDF nháp AI
SELECT id, "caseId", "actionType", "modelName", "status", "inputPayload"
FROM "AiAuditLog"
WHERE "modelName" = 'System-Pdf-Preview-Exporter'
ORDER BY "createdAt" DESC LIMIT 5;

-- 2. Kiểm chứng tính bất biến tuyệt đối của hồ sơ (không bị tự động chuyển trạng thái hay phân công lại)
SELECT id, "caseCode", status, "assignedToId", "updatedAt"
FROM "LegalCase"
WHERE id = '<id_hồ_sơ_vừa_test>';
```

---

## 11. Rủi Ro Còn Lại

- **Phụ thuộc vào trình duyệt web**: Chất lượng bản in PDF cuối cùng phụ thuộc một phần vào thiết lập lề (Margins), khổ giấy (Paper size: A4) và tùy chọn "Background graphics" trên trình duyệt của máy cán bộ.
- **Thao tác thủ công bước cuối**: Cán bộ cần chủ động chọn "Save as PDF" trong hộp thoại in của trình duyệt thay vì hệ thống tải ngay tệp `.pdf` tự động.
- **Giới hạn lưu trữ**: Bản PDF được tạo ra tại client-side, hệ thống chưa tự động lưu trữ hoặc đánh dấu phiên bản tệp PDF này vào kho tài liệu (`Document`) của hồ sơ hay MinIO.
- **Chưa hỗ trợ xuất hàng loạt (Batch Export)**: Hệ thống chưa có cơ chế tiến trình ngầm (backend background job) để tự động kết xuất đồng loạt hàng trăm file PDF không cần tương tác màn hình.

---

## 12. Kết Luận

- **Phase 5D-A đã hoàn thành xuất sắc, an toàn tuyệt đối và đạt hiệu quả trải nghiệm cao**.
- Khép kín trọn vẹn chu trình xử lý bản nháp thông minh của LegalFlow AI: **AI tạo bản nháp $\rightarrow$ Lưu vào `CaseNote` $\rightarrow$ Tải file Word `.docx` $\rightarrow$ Xem trước trang A4 chuẩn hành chính & In/Lưu PDF trực tiếp**.
- **Đề xuất bước tiếp theo**: Tiến hành tổng kết mốc **LegalFlow AI v2.3** hoặc chuẩn bị bước vào giai đoạn **UAT lần 2** tổng thể, cho phép cán bộ nghiệp vụ trải nghiệm trọn bộ năng lực soạn thảo, cấu hình cơ quan và xuất tài liệu song hành Word/PDF.
