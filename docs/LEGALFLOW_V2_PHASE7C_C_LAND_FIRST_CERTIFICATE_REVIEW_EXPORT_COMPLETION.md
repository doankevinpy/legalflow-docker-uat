# Phase 7C-C Completion – Xuất phiếu rà soát cấp GCN lần đầu Word/PDF

**Mốc phát hành:** `v2.5.6-land-first-certificate-review-export`  
**Ngày hoàn thành:** 04/07/2026  
**Trạng thái:** Đã triển khai, kiểm thử thành công và nghiệm thu kỹ thuật.

---

## 1. Mục tiêu Phase 7C-C

Phase 7C-C tập trung triển khai chức năng xuất **“Phiếu rà soát nội bộ hồ sơ cấp Giấy chứng nhận quyền sử dụng đất lần đầu”** từ kết quả AI rà soát chuyên sâu đã được lưu trong hệ thống, nhằm hỗ trợ tối đa cho cán bộ địa chính và cán bộ thẩm tra hồ sơ thủ tục hành chính (TTHC).

Các mục tiêu cốt lõi bao gồm:
- **Triển khai chức năng xuất Phiếu rà soát nội bộ:** Cho phép kết xuất toàn bộ kết quả phân tích AI thành văn bản hành chính chuẩn chỉnh để cán bộ lưu hồ sơ thụ lý, phục vụ rà soát thực địa hoặc trình lãnh đạo bộ phận kiểm tra.
- **Sử dụng kết quả AI rà soát đã lưu:** Tái sử dụng trọn vẹn dữ liệu từ bảng `ProcedureAiAnalysis` (phân loại `LAND_FIRST_CERTIFICATE_REVIEW`) và snapshot hồ sơ, không gọi lại AI hay làm biến đổi cấu trúc phân tích cũ.
- **Hỗ trợ đa định dạng tiện lợi:**
  - **Tải Word `.docx`:** Tạo file Word với bố cục bảng biểu hành chính A4 để cán bộ dễ dàng chỉnh sửa, bổ sung ý kiến cá nhân trước khi in hoặc lưu trữ.
  - **Xem trước & In PDF bằng Browser Print Preview:** Trình bày mô phỏng trang giấy A4 trực quan ngay trên trình duyệt web và hỗ trợ in/lưu PDF nhanh chóng thông qua lệnh `window.print()`.
- **Định vị tính chất văn bản rõ ràng:** Phiếu xuất ra **chỉ phục vụ rà soát nội bộ, lưu hồ sơ TTHC, trình kiểm tra nghiệp vụ**, khẳng định tuyệt đối **không phải là văn bản kết luận pháp lý chính thức** và **không phải văn bản phát hành cho công dân**.

---

## 2. Phạm vi đã triển khai

Hệ thống đã hoàn thiện chu trình kết xuất văn bản rà soát từ tầng backend đến frontend, tuân thủ nguyên tắc không xâm lấn kiến trúc hiện có:
- **Tạo Helper xuất Word chuyên biệt (`procedure-docx.helper.ts`):** Xây dựng bộ quy tắc bố cục, bảng biểu và định dạng font chữ theo chuẩn thể thức văn bản hành chính A4 (Nghị định 30/2020/NĐ-CP) dành riêng cho nghiệp vụ rà soát cấp GCN lần đầu.
- **Tạo Endpoints tải Word & Lấy dữ liệu Preview:** Bổ sung API stream file `.docx` trực tiếp qua HTTP response và API cung cấp payload JSON định dạng chuẩn cho giao diện preview A4.
- **Tạo Modal/Preview A4 trên Frontend (`ProcedureReviewPrintModal.tsx`):** Xây dựng component giao diện mô phỏng tờ trình giấy A4 (font serif `Times New Roman`, cỡ chữ 14pt, lề chuẩn hành chính), tích hợp CSS `@media print` chuyên nghiệp.
- **Bổ sung công cụ tương tác trên Tab "AI rà soát":** Tại mỗi thẻ kết quả AI trong trang chi tiết hồ sơ TTHC (`ProcedureCaseDetail.tsx`), hiển thị thêm 2 nút thao tác rõ ràng:
  - **“📥 Tải phiếu rà soát Word”**
  - **“🖨️ Xem/In phiếu rà soát PDF”**
- **Kiểm toán nhật ký hệ thống chặt chẽ:** Tự động ghi nhận nhật ký vào bảng `ProcedureAuditLog` với hành động `EXPORT_REVIEW_DOCX` (khi tải Word) và `PREVIEW_REVIEW_PDF` (khi mở preview PDF), gắn chính xác với người dùng đang đăng nhập từ JWT.
- **Tái sử dụng tối đa dữ liệu liên kết trong hệ thống:**
  - `AdministrativeProcedureCase`: Thông tin chung hồ sơ (mã hồ sơ, người nộp, địa chỉ, ngày tiếp nhận, hạn giải quyết, cán bộ thụ lý).
  - `ProcedureType`: Tên và mã loại thủ tục hành chính.
  - `ProcedureAiAnalysis.outputPayload`: 7 nhóm nội dung phân tích chuyên sâu của Trợ lý AI.
  - `ProcedureDocument`: Danh sách tài liệu đã đính kèm trong hồ sơ.
  - `ProcedureChecklistItem`: Danh sách các mục kiểm tra/checklist thực tế.
  - `ProcedureNote`: Các ghi chú thẩm tra của cán bộ thụ lý (nếu có).

---

## 3. Backend đã triển khai

Phần backend nghiệp vụ được mở rộng trong module `AdministrativeProceduresModule` với tính an toàn và bảo mật cao nhất:
- **Helper chuyên sâu (`procedure-docx.helper.ts`):** Sử dụng thư viện `docx` để kiến tạo tài liệu Word cấu trúc phức hợp (Bảng biểu Quốc hiệu/Tiêu ngữ, Banner cảnh báo viền kép, 11 mục nội dung phân tích, Bảng checklist kiểm tra thực tế có ô tích `[ ] Đạt  [ ] Bổ sung`, và khối chữ ký nháy nội bộ).
- **Service Methods (`ProcedureAiService`):**
  - `exportReviewDocx(caseId, analysisId, userId)`: Tạo buffer `.docx`, kiểm tra tính hợp lệ của dữ liệu và ghi nhận audit log.
  - `getReviewPreviewData(caseId, analysisId, userId)`: Lấy toàn bộ cấu trúc hồ sơ, phân tích AI và cấu hình cơ quan (`agencyConfig`), đóng gói thành JSON preview và ghi nhận audit log.
- **RESTful Endpoints (`ProcedureCasesController`):**
  - `GET /api/procedure-cases/:id/ai-analyses/:analysisId/export-review-docx`: Stream file `.docx` với header `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document` và `Content-Disposition: attachment; filename="..."`.
  - `GET /api/procedure-cases/:id/ai-analyses/:analysisId/review-preview-data`: Trả về dữ liệu JSON preview phục vụ modal trang in.
- **Kiểm tra ràng buộc pháp lý & Bảo mật (Validation & Security):**
  - **Kiểm tra liên kết:** Xác thực `analysisId` phải thuộc đúng `procedureCaseId` được yêu cầu, ngăn chặn truy cập chéo dữ liệu trái phép.
  - **Kiểm tra loại phân tích:** Xác thực `analysis.analysisType` bắt buộc phải là `LAND_FIRST_CERTIFICATE_REVIEW`.
  - **Kiểm tra loại thủ tục:** Xác thực hồ sơ phải thuộc mã thủ tục `LAND_FIRST_CERTIFICATE` hoặc thuộc nhóm `CAP_GCN_LAN_DAU`.
- **Cơ chế Stream không lưu file tạm:** File `.docx` được sinh trực tiếp trong bộ nhớ RAM (Buffer) và stream trả về cho client, **không lưu file vào MinIO hay database**, giữ cho hệ thống lưu trữ sạch sẽ và tránh dư thừa dữ liệu rác.
- **Ghi nhật ký kiểm toán TTHC:** Tự động tạo bản ghi `ProcedureAuditLog` lưu rõ thời gian, `userId` thật từ token, `actionType` (`EXPORT_REVIEW_DOCX` / `PREVIEW_REVIEW_PDF`) và `entityId` là ID của bản phân tích AI.

---

## 4. Frontend đã triển khai

Giao diện người dùng được nâng cấp mang lại trải nghiệm thao tác hành chính mượt mà, chuyên nghiệp:
- **Cập nhật API Wrapper (`procedureCasesApi.ts`):** Thêm phương thức `exportReviewDocx` (sử dụng `apiClient.downloadBlob` để xử lý tải file nhị phân) và `getReviewPreviewData` (lấy JSON preview).
- **Cập nhật Trang chi tiết hồ sơ (`ProcedureCaseDetail.tsx`):**
  - Quản lý trạng thái modal preview A4 và trạng thái loading riêng biệt cho từng nút tải (`exportingAnalysisId`, `previewingAnalysisId`).
  - Tại Tab **“3. AI rà soát”**, tích hợp cụm nút tải Word và xem trước PDF vào phần chân (footer) của mỗi thẻ kết quả AI. Cụm nút này hiển thị cho **tất cả** các bản phân tích (cả trạng thái đang chờ duyệt `PENDING`, đã duyệt `ACCEPTED` hoặc đã từ chối `REJECTED`), giúp cán bộ linh hoạt đối chiếu lịch sử.
- **Component Preview A4 (`ProcedureReviewPrintModal.tsx`):**
  - Thiết kế khung trang giấy A4 tỷ lệ chuẩn (`210mm x 297mm`), nền giấy trắng, bóng đổ shadow chuyên nghiệp trên nền modal tối màu.
  - Sử dụng hệ thống typography chuẩn hành chính: Font chữ `Times New Roman`, cỡ chữ bản văn `14pt`, tiêu đề chính `18pt` in đậm, giãn dòng `leading-relaxed`.
  - Hỗ trợ in trực tiếp và lưu PDF qua trình duyệt nhờ khối style định dạng riêng cho in ấn (`@media print` ẩn toàn bộ các phần tử UI ngoài trang A4, bỏ bóng đổ, bỏ viền, đặt lề trang `20mm 15mm 20mm 20mm`).

---

## 5. Nội dung phiếu rà soát

Phiếu rà soát xuất ra (cả trên file Word và trên trang Preview A4) được tổ chức khoa học theo 11 mục chi tiết:
1. **Quốc hiệu & Tiêu ngữ:** Bố cục song song phía trên cùng văn bản (CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập - Tự do - Hạnh phúc).
2. **Tên cơ quan ban hành:** Tự động hiển thị từ cấu hình `agencyConfig.parentName` và `agencyConfig.name` (hoặc hiển thị placeholder màu hổ phách nếu chưa cấu hình). Kèm số ký hiệu văn bản nội bộ: `Số: ...../PRS-TTHC`.
3. **Tiêu đề chính:** `PHIẾU RÀ SOÁT NỘI BỘ HỒ SƠ CẤP GIẤY CHỨNG NHẬN QUYỀN SỬ DỤNG ĐẤT LẦN ĐẦU` (In đậm, canh giữa).
4. **Nhãn cảnh báo trách nhiệm (Banner):** Hộp viền kép màu hổ phách nổi bật ngay dưới tiêu đề:
   > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA**  
   > *Phiếu này là tài liệu hỗ trợ rà soát nội bộ, không phải văn bản kết luận, không thay thế ý kiến thẩm tra của cán bộ chuyên môn và không phải văn bản phát hành cho công dân.*
5. **I. THÔNG TIN CHUNG HỒ SƠ:** Trình bày dạng lưới 2 cột ghi rõ Mã hồ sơ, Loại thủ tục, Lĩnh vực (Đất đai), Người nộp đơn, Địa chỉ liên hệ, Số điện thoại, Ngày tiếp nhận, Hạn giải quyết, và Cán bộ thụ lý.
6. **II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI:** Tóm tắt ngắn gọn bối cảnh hồ sơ, ghi rõ loại phân tích, độ tin cậy AI (HIGH / MEDIUM / LOW) và thời điểm rà soát.
7. **III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT:** Ghi nhận chủ thể, tình trạng nhân thân, địa chỉ và **danh sách các nội dung cán bộ cần kiểm tra/xác minh thực tế đối với CCCD/nhân thân**.
8. **IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT:** Ghi nhận Số thửa, Tờ bản đồ, Vị trí, Diện tích, Loại đất, Tình trạng ranh giới và **danh sách các điểm cần đối chiếu thực địa & hồ sơ kỹ thuật thửa đất**.
9. **V. NGUỒN GỐC & THỜI ĐIỂM SỬ DỤNG ĐẤT:** Phân tích nguồn gốc khai báo, mốc thời gian bắt đầu sử dụng, liệt kê các giấy tờ chứng minh liên quan, **cảnh báo các rủi ro lịch sử sử dụng cần lưu ý**, và nội dung cần thẩm tra bổ sung căn cứ.
10. **VI. KIỂM TRA THÀNH PHẦN HỒ SƠ:** Chia rõ 3 tiểu mục:
    - *1. Tài liệu đã nhận diện trong hồ sơ*
    - *2. Tài liệu còn thiếu / Cần đối chiếu bản gốc*
    - *3. Đề xuất yêu cầu công dân bổ sung*
11. **VII. QUY HOẠCH, TRANH CHẤP & HIỆN TRẠNG SỬ DỤNG:** Ghi nhận chi tiết kết quả kiểm tra về quy hoạch/kế hoạch sử dụng đất, khiếu nại tranh chấp tại địa phương, hiện trạng sử dụng & ranh giới thực tế, tài sản gắn liền với đất (nhà ở, công trình), và ghi chú về nghĩa vụ tài chính.
12. **VIII. RỦI RO & KHUYẾN NGHỊ CHUYÊN MÔN:** Tổng hợp các rủi ro pháp lý lớn, đưa ra khuyến nghị hướng giải quyết cho cán bộ, liệt kê **căn cứ pháp lý áp dụng rà soát** (Luật Đất đai 2024, Nghị định 101/2024/NĐ-CP...), và chỉ rõ các cơ quan/bộ phận cần phối hợp (UBND cấp xã, VPĐKĐĐ, Phòng TN&MT).
13. **IX. CÂU HỎI GỢI Ý YÊU CẦU NGƯỜI DÂN BỔ SUNG / GIẢI TRÌNH:** Danh sách câu hỏi nghiệp vụ chuẩn xác để cán bộ dùng khi làm việc hoặc ra thông báo yêu cầu công dân giải trình.
14. **X. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ:** Bảng kiểm tra thực tế dành cho cán bộ thẩm định, gồm 4 cột: `TT | Nội dung rà soát / Kiểm tra | Kết quả rà soát ([ ] Đạt  [ ] Bổ sung) | Ghi chú`.
15. **XI. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ:** Khối kết luận khẳng định trách nhiệm của cán bộ chuyên môn và bảng ký nháy nội bộ:
    - *Bên trái:* Nơi nhận (Lưu: VT, HS TTHC; Cán bộ thụ lý; Lãnh đạo bộ phận để báo cáo).
    - *Bên phải:* Khối chữ ký **"CÁN BỘ THẨM TRA / RÀ SOÁT"** (Ký, ghi rõ họ tên - Không có đóng dấu tròn cơ quan ban hành).
16. **Cơ chế Placeholder thông minh:** Đối với bất kỳ trường thông tin nào còn thiếu hoặc chưa có dữ liệu trong hệ thống, tự động điền các placeholder rõ ràng để nhắc nhở cán bộ: `[Cán bộ bổ sung/kiểm tra]`, `[Cán bộ kiểm tra thực địa]`, hoặc `[Cán bộ rà soát ký nháy]`.

---

## 6. Nguyên tắc an toàn đã bảo đảm

Trong suốt quá trình thiết kế và triển khai Phase 7C-C, các kỷ luật an toàn nghiệp vụ và quy tắc **Human-in-the-Loop** được thực thi tuyệt đối:
- **Tài liệu rà soát nội bộ thuần túy:** Khẳng định văn bản xuất ra là phiếu làm việc nội bộ của cán bộ thụ lý, phục vụ lưu hồ sơ và rà soát chuyên môn.
- **Không phải văn bản phát hành cho công dân:** Tuyệt đối không sử dụng mẫu phiếu này để gửi cho người nộp đơn hay công dân dưới bất kỳ hình thức nào.
- **Không kết luận thay cán bộ:** AI và phiếu xuất ra không đưa ra kết luận pháp lý rằng hồ sơ "Đủ điều kiện" hay "Không đủ điều kiện", không chấp thuận cấp GCN và cũng không từ chối cấp GCN.
- **Không tính tiền sử dụng đất:** Phase này chưa thực hiện lập bảng tính, chưa tính toán số tiền sử dụng đất thực tế và không tạo thông báo nộp tiền nghĩa vụ tài chính.
- **Không tự động hóa trạng thái pháp lý:** Lệnh xuất Word hay xem trước PDF **không bao giờ tự động thay đổi trạng thái hồ sơ** (`AdministrativeProcedureCase.status` giữ nguyên) và **không tự đổi người thụ lý** (`assignedToId` giữ nguyên).
- **Không phát hành hay gửi tự động:** Giao diện và API không có chức năng ký số (Digital Signature), không đóng dấu đỏ, không tự động gửi email hay gửi văn bản điện tử đi bất cứ đâu.
- **Tối ưu tài nguyên lưu trữ:** File Word và PDF không lưu vào MinIO hay bảng dữ liệu trong phase này, chỉ sinh ra tức thời theo yêu cầu tải của cán bộ thụ lý.
- **Đóng dấu nhãn cảnh báo bắt buộc:** Mọi tài liệu Word tải về và mọi trang preview in ra đều buộc phải có nhãn cảnh báo trách nhiệm ở vị trí trang trọng nhất: **“BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA”**.

---

## 7. Kết quả test/build

Toàn bộ hệ thống đã được kiểm chứng tự động và kiểm thử thủ công kỹ lưỡng:
- **Backend Unit Tests:** Chạy lệnh `npm test` tại `legalflow-backend` -> **PASS 100%** (8/8 test suites passed, 39/39 tests passed trong 3.29s).
- **Backend Production Build:** Chạy lệnh `npm run build` tại `legalflow-backend` -> **PASS** (Hoàn thành dịch TypeScript và đóng gói NestJS thành công, 0 lỗi).
- **Frontend Production Build:** Chạy lệnh `npm run build` tại gốc dự án -> **PASS** (Dịch và đóng gói Vite thành công 3,174 modules, tạo bundle production ổn định).
- **Kiểm thử thủ công (Manual UI Verification):**
  - Đã truy cập giao diện qua địa chỉ friendly local: `http://kevindoan-legalflow.local:8080` (hoặc `http://localhost:5173`).
  - Mở hồ sơ TTHC thuộc loại **“Cấp Giấy chứng nhận quyền sử dụng đất lần đầu”** đã có sẵn kết quả AI rà soát trong Tab “3. AI rà soát”.
  - Bấm nút **“📥 Tải phiếu rà soát Word”**: Trình duyệt lập tức tải về file `.docx` với tên định dạng chuẩn `phieu-ra-soat-cap-gcn-lan-dau-<caseCode>.docx`. Mở file trên Microsoft Word kiểm tra thấy bố cục bảng biểu, quốc hiệu, tiêu ngữ, banner cảnh báo và 11 mục nội dung hiển thị chuẩn xác, đẹp mắt.
  - Bấm nút **“🖨️ Xem/In phiếu rà soát PDF”**: Modal A4 mở ra mượt mà, hiển thị tờ trình trang giấy A4 serif font cực kỳ chuyên nghiệp.
  - Thực hiện thao tác in/lưu PDF bằng trình duyệt (`window.print()` / Ctrl+P): Trang in được định dạng chuẩn A4 portrait, tự động ẩn thanh công cụ modal và nền tối, chỉ in ra đúng nội dung phiếu rà soát với lề chuẩn.
  - **Kiểm chứng giới hạn an toàn UI:** Xác nhận không có bất kỳ nút bấm nào liên quan đến "Phát hành văn bản", "Ký số", "Gửi công dân" hay "Kết luận hồ sơ".
  - **Kiểm chứng Audit Log:** Kiểm tra trong Tab “7. Audit log” và database thấy ghi nhận chính xác các bản ghi nhật ký với hành động `EXPORT_REVIEW_DOCX` và `PREVIEW_REVIEW_PDF` gắn đúng thời gian và cán bộ thực hiện.
  - **Kiểm chứng tính ổn định:** Xác nhận trạng thái hồ sơ TTHC (`status`) không bị tự động thay đổi sau các thao tác tải/in, đồng thời module xử lý đơn thư `LegalCase` cũ vẫn hoạt động độc lập, không bị ảnh hưởng.

---

## 8. Lệnh SQL kiểm chứng

Cán bộ quản trị hoặc lập trình viên có thể sử dụng các lệnh SQL dưới đây trong PostgreSQL / DBeaver để kiểm chứng tính toàn vẹn dữ liệu sau khi thực hiện test Phase 7C-C:

```sql
-- 1. Kiểm tra nhật ký kiểm toán (Audit Log) ghi nhận thao tác xuất Word và xem trước PDF
SELECT id, "caseId", "userId", "actionType", "entityType", "entityId", "createdAt"
FROM "ProcedureAuditLog"
WHERE "actionType" IN ('EXPORT_REVIEW_DOCX', 'PREVIEW_REVIEW_PDF')
ORDER BY "createdAt" DESC
LIMIT 10;

-- 2. Kiểm tra trạng thái hồ sơ TTHC bảo đảm tuyệt đối không bị tự động thay đổi
SELECT id, "caseCode", "applicantName", status, "assignedToId", "updatedAt"
FROM "AdministrativeProcedureCase"
WHERE id = '<nhập_id_hồ_sơ_đã_test>';

-- 3. Kiểm tra kết quả AI rà soát (ProcedureAiAnalysis) bảo đảm dữ liệu gốc được giữ nguyên vẹn
SELECT id, "procedureCaseId", "analysisType", status, "confidenceLevel", "createdAt"
FROM "ProcedureAiAnalysis"
WHERE "procedureCaseId" = '<nhập_id_hồ_sơ_đã_test>'
ORDER BY "createdAt" DESC;

-- 4. Kiểm tra tổng quát bảng trong database (Xác nhận không phát sinh bảng hay cột trái phép)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%Procedure%'
ORDER BY table_name;
```

---

## 9. Backup & Rollback

Để bảo đảm an toàn tuyệt đối cho môi trường triển khai thực tế và UAT, quy trình sao lưu và phục hồi (Backup/Rollback) được xác định như sau:
- **Đóng gói mã nguồn (Source Code Backup):**
  - Bản đóng gói mã nguồn hoàn chỉnh của mốc này được lưu tại:  
    `legalflow-v2.5.6-land-first-certificate-review-export.zip`
- **Sao lưu cơ sở dữ liệu (Database Backup):**
  - Trước khi triển khai lên môi trường UAT/Production, thực hiện sao lưu toàn bộ cơ sở dữ liệu ra file dump:  
    `legalflow-db-backup-v2.5.6-land-first-certificate-review-export.sql`
  - Lệnh thực hiện backup qua Docker:
    ```bash
    docker exec -t legalflow-postgres pg_dump -U postgres legalflow_db > legalflow-db-backup-v2.5.6-land-first-certificate-review-export.sql
    ```
- **Kế hoạch phục hồi / Rollback (When needed):**
  - **Về mã nguồn:** Nếu cần quay lui về mốc hoàn thành Phase 7C-B trước đó, sử dụng lệnh git tag:
    ```bash
    git checkout v2.5.5-land-first-certificate-ai-review-complete
    ```
  - **Về cơ sở dữ liệu:** Do Phase 7C-C **hoàn toàn không tạo migration mới** và **không sửa đổi cấu trúc schema**, việc rollback database là không bắt buộc trong các tình huống thông thường. Trong trường hợp muốn dọn dẹp các bản ghi nhật ký kiểm toán (`ProcedureAuditLog`) hoặc dữ liệu test phát sinh trong quá trình thử nghiệm Phase 7C-C, chỉ cần restore từ file dump backup bằng lệnh:
    ```bash
    cat legalflow-db-backup-v2.5.6-land-first-certificate-review-export.sql | docker exec -i legalflow-postgres psql -U postgres -d legalflow_db
    ```

---

## 10. Rủi ro còn lại

Mặc dù Phase 7C-C đã hoàn thiện vững chắc về mặt kỹ thuật và giao diện, hệ thống vẫn còn một số điểm phụ thuộc và rủi ro nghiệp vụ cần được nhận diện để quản lý trong các giai đoạn tới:
- **Phụ thuộc chất lượng đầu vào AI:** Nội dung phiếu rà soát phụ thuộc trực tiếp vào chất lượng và độ chi tiết của kết quả phân tích LLM lưu trong `ProcedureAiAnalysis`. Nếu hồ sơ đầu vào sơ sài hoặc AI phân tích thiếu sót, phiếu rà soát cần được cán bộ thẩm tra bổ sung thủ công nhiều hơn.
- **Chưa có OCR tài liệu thực tế:** Hiện tại AI rà soát dựa trên metadata và nội dung text đính kèm, chưa tích hợp tự động đọc hiểu sâu hình ảnh giấy tờ nhà đất (GCN cũ, bản đồ kỹ thuật, CCCD chụp) qua trích xuất OCR chuyên sâu.
- **Chưa kết nối kho tri thức pháp lý (RAG):** Căn cứ pháp lý gợi ý trong phiếu hiện dựa trên suy luận chuẩn của mô hình LLM theo luật đất đai mới, chưa tra cứu động từ một kho RAG (Retrieval-Augmented Generation) chứa bộ luật và văn bản dưới luật địa phương chính thức.
- **Chưa liên thông dữ liệu quy hoạch tự động:** Các mục kiểm tra về Quy hoạch/Kế hoạch sử dụng đất và tình trạng tranh chấp đang ở mức khuyến nghị nghiệp vụ để cán bộ rà soát, chưa tự động kết nối đối chiếu với hệ thống GIS hay cơ sở dữ liệu đất đai quốc gia (VBDLIS/VNPT-iLIS).
- **Chưa hỗ trợ Chữ ký số nội bộ:** Phiếu rà soát hiện tại áp dụng ký nháy/ký tay truyền thống sau khi in ra giấy hoặc lưu PDF, chưa tích hợp ký số nội bộ (PKI/VGCA) trực tiếp trên trình duyệt.
- **Yêu cầu UAT Thực tế:** Trước khi đưa vào áp dụng chính thức tại bộ phận Một cửa hay Văn phòng Đăng ký đất đai, mẫu phiếu và câu từ khuyến nghị cần trải qua quá trình UAT (User Acceptance Testing) chuyên sâu với chính các cán bộ địa chính thực thụ để tinh chỉnh câu chữ cho sát nhất với thói quen nghiệp vụ địa phương.

---

## 11. Kết luận

Mốc **Phase 7C-C đã hoàn thành xuất sắc toàn bộ mục tiêu đề ra**. Sự kiện này đánh dấu một bước tiến quan trọng của LegalFlow: **Hệ thống đã sở hữu một luồng xử lý nghiệp vụ hoàn chỉnh đầu tiên cho thủ tục "Cấp Giấy chứng nhận quyền sử dụng đất lần đầu"**:
1. **Tiếp nhận & Tạo hồ sơ TTHC** (Khung nền tảng Phase 7C-A).
2. **AI hỗ trợ rà soát chuyên sâu 7 nhóm nội dung** (Trợ lý AI Phase 7C-B).
3. **Cán bộ thẩm định, Chấp nhận/Từ chối kết quả AI** (Human-in-the-Loop).
4. **Tự động hóa chuyển hóa thành Ghi chú & Checklist nghiệp vụ** (Lưu vết hồ sơ).
5. **Kết xuất Phiếu rà soát nội bộ chuẩn hành chính A4 Word/PDF** (Phục vụ làm việc, trình ký nội bộ Phase 7C-C).

Kiến trúc hệ thống chứng minh được tính ổn định, mở rộng tốt, không gây side-effect tới các module hiện hữu và hoàn toàn sẵn sàng để bước tiếp sang các quy trình nghiệp vụ phức tạp hơn của ngành đất đai và xây dựng.

---

## 12. Đề xuất phase tiếp theo

Dựa trên lộ trình tổng thể và đà phát triển của module Trợ lý thẩm tra hồ sơ TTHC, xin đề xuất 2 phương án cho phase tiếp theo để chủ dự án xem xét quyết định:

### Phương án 1: Phase 7D-A – AI rà soát hồ sơ Chuyển mục đích sử dụng đất
- **Mục tiêu:** Mở rộng sức mạnh của Trợ lý AI sang thủ tục có tần suất giao dịch cực kỳ cao trong quản lý đất đai là **"Chuyển mục đích sử dụng đất"** (ví dụ: chuyển từ đất nông nghiệp/đất trồng lúa sang đất ở).
- **Nội dung trọng tâm:** Xây dựng Prompt Builder chuyên biệt, kiểm tra sự phù hợp với quy hoạch sử dụng đất cấp huyện, hạn mức chuyển mục đích, điều kiện giao đất/cho thuê đất theo Luật Đất đai 2024, và cảnh báo rủi ro pháp lý chuyển mục đích trái phép.

### Phương án 2: Phase 7E-A – Thiết kế bảng tính dự kiến nghĩa vụ tài chính / Tiền sử dụng đất
- **Mục tiêu:** Giải quyết khâu khó nhất và tốn nhiều thời gian tính toán nhất của cán bộ địa chính/thuế khi làm thủ tục cấp GCN lần đầu hoặc chuyển mục đích sử dụng đất: **Dự tính nghĩa vụ tài chính**.
- **Nội dung trọng tâm:** Thiết kế schema và giao diện công cụ hỗ trợ cán bộ nhập liệu thông số (diện tích trong/ngoài hạn mức, vị trí đường, giá đất theo Bảng giá đất của UBND tỉnh/thành phố, thời điểm bắt đầu sử dụng đất để xác định tỷ lệ % thu tiền sử dụng đất, các khoản khấu trừ/miễn giảm), từ đó lập Bảng tính dự kiến nghĩa vụ tài chính nội bộ.

*(Khuyến nghị: Nên ưu tiên triển khai **Phương án 1 (Phase 7D-A)** trước để hoàn thiện trọn vẹn bộ đôi thủ tục đất đai phổ biến nhất, sau đó dùng **Phase 7E-A** làm công cụ tài chính dùng chung cho cả 2 thủ tục này).*
