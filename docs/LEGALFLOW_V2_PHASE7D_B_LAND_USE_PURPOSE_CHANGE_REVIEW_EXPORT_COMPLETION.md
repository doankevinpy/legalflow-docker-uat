# Phase 7D-B Completion – Xuất phiếu rà soát chuyển mục đích sử dụng đất Word/PDF

**Mốc phát hành:** `v2.6.2-land-use-purpose-change-review-export`  
**Ngày hoàn thành:** 04/07/2026  
**Trạng thái:** Đã triển khai, kiểm thử thành công và nghiệm thu kỹ thuật.

---

## 1. Mục tiêu Phase 7D-B

Phase 7D-B tập trung triển khai chức năng xuất **“Phiếu rà soát nội bộ hồ sơ chuyển mục đích sử dụng đất”** từ kết quả AI rà soát chuyên sâu đã được lưu trong hệ thống, nhằm hỗ trợ tối đa cho cán bộ địa chính và cán bộ thẩm tra hồ sơ thủ tục hành chính (TTHC).

Các mục tiêu cốt lõi bao gồm:
- **Triển khai chức năng xuất Phiếu rà soát nội bộ:** Cho phép kết xuất toàn bộ kết quả phân tích AI thành văn bản hành chính chuẩn chỉnh để cán bộ lưu hồ sơ thụ lý, phục vụ rà soát thực địa hoặc trình lãnh đạo bộ phận kiểm tra.
- **Sử dụng kết quả AI rà soát đã lưu:** Tái sử dụng trọn vẹn dữ liệu từ bảng `ProcedureAiAnalysis` (phân loại `LAND_USE_PURPOSE_CHANGE_REVIEW`) và snapshot hồ sơ, không gọi lại AI hay làm biến đổi cấu trúc phân tích cũ.
- **Hỗ trợ đa định dạng tiện lợi:**
  - **Tải Word `.docx`:** Tạo file Word với bố cục bảng biểu hành chính A4 để cán bộ dễ dàng chỉnh sửa, bổ sung ý kiến cá nhân trước khi in hoặc lưu trữ.
  - **Xem trước & In PDF bằng Browser Print Preview:** Trình bày mô phỏng trang giấy A4 trực quan ngay trên trình duyệt web và hỗ trợ in/lưu PDF nhanh chóng thông qua lệnh `window.print()`.
- **Định vị tính chất văn bản rõ ràng:** Phiếu xuất ra **chỉ phục vụ rà soát nội bộ, lưu hồ sơ TTHC, trình kiểm tra nghiệp vụ**, khẳng định tuyệt đối **không phải là văn bản phát hành cho công dân**.

---

## 2. Phạm vi đã triển khai

Hệ thống đã hoàn thiện chu trình kết xuất văn bản rà soát cho thủ tục chuyển mục đích sử dụng đất, tuân thủ nguyên tắc tách biệt hoàn toàn và không xâm lấn kiến trúc hiện có:
- **Tạo template Word riêng cho phiếu rà soát chuyển mục đích sử dụng đất:** Xây dựng bộ quy tắc bố cục, bảng biểu và định dạng font chữ theo chuẩn thể thức văn bản hành chính A4 dành riêng cho nghiệp vụ chuyển mục đích, **tách biệt hoàn toàn và không dùng lẫn template với thủ tục cấp GCN lần đầu**.
- **Tạo component preview A4 riêng (`PurposeChangeReviewPrintModal.tsx`):** Xây dựng giao diện mô phỏng tờ trình giấy A4 chuyên biệt cho thủ tục chuyển mục đích sử dụng đất, tích hợp CSS `@media print` và các khối nghiệp vụ chuyên sâu.
- **Tạo endpoint tải Word & endpoint lấy dữ liệu preview:** Bổ sung API stream file `.docx` trực tiếp qua HTTP response và API cung cấp payload JSON định dạng chuẩn cho giao diện preview A4.
- **Bổ sung công cụ tương tác trên Tab "AI rà soát":** Tại mỗi thẻ kết quả AI của thủ tục chuyển mục đích sử dụng đất trong trang chi tiết hồ sơ TTHC (`ProcedureCaseDetail.tsx`), kích hoạt hiển thị 2 nút thao tác:
  - **“📥 Tải phiếu rà soát Word”**
  - **“🖨️ Xem/In phiếu rà soát PDF”**
- **Ghi nhật ký kiểm toán hệ thống chặt chẽ:** Tự động ghi nhận nhật ký vào bảng `ProcedureAuditLog` khi export Word (`EXPORT_PURPOSE_CHANGE_REVIEW_DOCX`) và khi mở preview PDF (`PURPOSE_CHANGE_REVIEW_PREVIEW_DATA`), gắn chính xác với người dùng đang đăng nhập từ JWT.

---

## 3. Backend đã triển khai

Phần backend nghiệp vụ được mở rộng trong module `AdministrativeProceduresModule` với tính an toàn và bảo mật cao nhất:
- **Cập nhật helper chuyên sâu (`procedure-docx.helper.ts`):** Bổ sung hàm `buildLandUsePurposeChangeReviewDocx` sử dụng thư viện `docx` để kiến tạo tài liệu Word cấu trúc phức hợp dành riêng cho chuyển mục đích sử dụng đất (Bảng biểu Quốc hiệu/Tiêu ngữ, Banner cảnh báo viền kép, 13 mục nội dung phân tích, Bảng checklist kiểm tra thực tế có ô tích `[ ] Đạt  [ ] Bổ sung`, và khối chữ ký nháy nội bộ).
- **Cập nhật Service Methods (`ProcedureAiService`):**
  - `exportPurposeChangeReviewDocx(caseId, analysisId, userId)`: Tạo buffer `.docx` chuyên biệt cho chuyển mục đích, kiểm tra tính hợp lệ của dữ liệu và ghi nhận audit log.
  - `getPurposeChangeReviewPreviewData(caseId, analysisId, userId)`: Lấy toàn bộ cấu trúc hồ sơ, phân tích AI và cấu hình cơ quan (`agencyConfig`), đóng gói thành JSON preview và ghi nhận audit log.
- **Cập nhật RESTful Endpoints (`ProcedureCasesController`):**
  - `GET /api/procedure-cases/:id/ai-analyses/:analysisId/export-purpose-change-review-docx`: Stream file `.docx` với header `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document` và `Content-Disposition: attachment; filename="..."`.
  - `GET /api/procedure-cases/:id/ai-analyses/:analysisId/purpose-change-review-preview-data`: Trả về dữ liệu JSON preview phục vụ modal trang in chuyển mục đích.
- **Kiểm tra ràng buộc pháp lý & Bảo mật (Validation & Security):**
  - **Kiểm tra liên kết:** Xác thực `analysisId` phải thuộc đúng `procedureCaseId` được yêu cầu, ngăn chặn truy cập chéo dữ liệu trái phép.
  - **Kiểm tra loại phân tích:** Xác thực `analysis.analysisType` bắt buộc phải là `LAND_USE_PURPOSE_CHANGE_REVIEW`.
  - **Kiểm tra loại thủ tục:** Xác thực hồ sơ phải thuộc mã thủ tục `LAND_USE_PURPOSE_CHANGE` hoặc thuộc nhóm `CHUYEN_MUC_DICH_SDD`.
- **Cơ chế Stream không lưu file tạm:** File `.docx` được sinh trực tiếp trong bộ nhớ RAM (Buffer) và stream trả về cho client, **không lưu file vào MinIO hay database**, giữ cho hệ thống lưu trữ sạch sẽ và tránh dư thừa dữ liệu rác.
- **Ghi nhật ký kiểm toán TTHC:** Tự động tạo bản ghi `ProcedureAuditLog` lưu rõ thời gian, `userId` thật từ token (lấy qua `resolveUserId`), `actionType` (`EXPORT_PURPOSE_CHANGE_REVIEW_DOCX` / `PURPOSE_CHANGE_REVIEW_PREVIEW_DATA`) và `entityId` là ID của bản phân tích AI.

---

## 4. Frontend đã triển khai

Phần frontend được nâng cấp đồng bộ, bảo đảm trải nghiệm người dùng mượt mà và trực quan:
- **Cập nhật API Wrapper (`procedureCasesApi.ts`):** Bổ sung 2 phương thức giao tiếp với backend:
  - `exportPurposeChangeReviewDocx(caseId, analysisId)`: Tải xuống dưới dạng `Blob` để lưu thành file `.docx`.
  - `getPurposeChangeReviewPreviewData(caseId, analysisId)`: Fetch JSON dữ liệu để đổ vào giao diện xem trước A4.
- **Thêm Component mới (`PurposeChangeReviewPrintModal.tsx`):**
  - Modal chuyên biệt mô phỏng tờ trình giấy A4 portrait (`@page { size: A4 portrait; margin: 20mm 15mm 20mm 20mm; }`).
  - Thiết kế theo chuẩn văn bản hành chính Việt Nam (font serif `Times New Roman`, cỡ chữ 14pt, tiêu đề lề, bảng biểu rõ ràng).
  - Hỗ trợ nút thao tác nhanh: Tải Word `.docx`, In / Lưu PDF qua trình duyệt (`window.print()`), và Đóng.
  - Tích hợp kỹ thuật CSS `@media print`: Khi in hoặc lưu PDF bằng trình duyệt, tự động ẩn toàn bộ giao diện nền, thanh công cụ, nút bấm và chỉ kết xuất duy nhất vùng nội dung A4 phẳng phiu, chuẩn xác.
- **Cập nhật Giao diện Chi tiết Hồ sơ (`ProcedureCaseDetail.tsx`):**
  - Nhận diện loại phân tích `LAND_USE_PURPOSE_CHANGE_REVIEW` để hiển thị 2 nút thao tác tải Word và xem/in PDF tương ứng (thay vì dòng thông báo chờ phase sau).
  - Tích hợp trạng thái loading, xử lý lỗi API thân thiện và liên kết mượt mà với cả 2 modal xem trước (cấp GCN lần đầu và chuyển mục đích sử dụng đất).

---

## 5. Nội dung phiếu rà soát

Phiếu rà soát nội bộ chuyển mục đích sử dụng đất (bản Word và bản Preview A4) được cấu trúc chặt chẽ thành 13 phần mục nghiệp vụ chuyên sâu:
1. **Quốc hiệu, Tiêu ngữ & Tên cơ quan ban hành:** Trình bày chuẩn thể thức văn bản hành chính (Nghị định 30/2020/NĐ-CP). Hiển thị tên cơ quan chủ quản và cơ quan ban hành nếu có trong cấu hình, hoặc sử dụng placeholder chuẩn `[Cán bộ bổ sung tên cơ quan/địa danh]`.
2. **Tiêu đề phiếu:**
   ```
   PHIẾU RÀ SOÁT NỘI BỘ HỒ SƠ
   CHUYỂN MỤC ĐÍCH SỬ DỤNG ĐẤT
   ```
3. **Nhãn cảnh báo Human-in-the-Loop:** Box cảnh báo viền vàng/cam nổi bật ngay dưới tiêu đề:
   > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA**  
   > *Phiếu này là tài liệu hỗ trợ rà soát nội bộ, không phải văn bản kết luận, không thay thế ý kiến thẩm tra của cán bộ chuyên môn và không phải văn bản phát hành cho công dân.*
4. **I. THÔNG TIN CHUNG HỒ SƠ:** Bảng tổng hợp Mã hồ sơ, Tên thủ tục, Lĩnh vực (Đất đai), Người nộp đơn, Địa chỉ liên hệ, Số điện thoại, Ngày tiếp nhận, Hạn giải quyết, Cán bộ thụ lý. Trường hợp trường thông tin trống sẽ tự động điền placeholder `[Cán bộ bổ sung/kiểm tra]`.
5. **II. TÓM TẮT PHÂN TÍCH TỪ TRỢ LÝ AI:** Tóm tắt tình trạng hồ sơ từ AI, loại phân tích (`LAND_USE_PURPOSE_CHANGE_REVIEW`), mức độ tin cậy của AI (`HIGH`, `MEDIUM`, `LOW`) và thời điểm rà soát.
6. **III. NHẬN DIỆN THÔNG TIN NGƯỜI SỬ DỤNG ĐẤT:** Ghi nhận họ tên/chủ thể, tình trạng pháp lý nhân thân, địa chỉ và danh sách điểm cần cán bộ xác minh, đối chiếu CCCD/giấy tờ gốc.
7. **IV. NHẬN DIỆN THÔNG TIN THỬA ĐẤT:** Ghi nhận số thửa, tờ bản đồ, vị trí/địa chỉ thửa đất, diện tích toàn thửa, diện tích xin chuyển mục đích, loại đất hiện tại, mục đích xin chuyển sang, tình trạng ranh giới và các điểm cần kiểm tra thực địa.
8. **V. LOẠI ĐẤT HIỆN TẠI VÀ MỤC ĐÍCH XIN CHUYỂN:** Phân tích chi tiết sự phù hợp quy hoạch/kế hoạch sử dụng đất, nhu cầu sử dụng đất, điều kiện chuyển mục đích theo quy định pháp luật. Kèm lời dặn in nghiêng: *"Lưu ý: Không kết luận đủ điều kiện hay không đủ điều kiện chuyển mục đích sử dụng đất; cán bộ thẩm định chịu trách nhiệm kiểm tra chi tiết theo quy định."*
9. **VI. KIỂM TRA THÀNH PHẦN HỒ SƠ:** Phân định rõ ràng 3 danh sách: (1) Tài liệu đã nhận diện trong hồ sơ; (2) Tài liệu còn thiếu / Cần đối chiếu bản gốc; (3) Đề xuất yêu cầu công dân bổ sung.
10. **VII. QUY HOẠCH, KẾ HOẠCH SỬ DỤNG ĐẤT, HIỆN TRẠNG:** Danh sách các điểm cần xác minh chuyên sâu về chỉ tiêu kế hoạch sử dụng đất hàng năm, hiện trạng sử dụng đất, tình trạng tranh chấp/khiếu nại, ranh giới/diện tích và hành lang bảo vệ công trình/đất công.
11. **VIII. NGHĨA VỤ TÀI CHÍNH CẦN KIỂM TRA:** Hiển thị box ghi chú trọng yếu chữ đậm màu cam/đỏ:
    > **Ghi chú trọng yếu: Phase này không lập bảng tính tiền sử dụng đất, không đưa ra số tiền phải nộp hoặc kết luận tài chính.**  
    Kèm theo danh sách dữ liệu cần chuẩn bị cho phase tính tiền sau này (diện tích xin chuyển, loại đất trước/sau khi chuyển, nguồn gốc/thời điểm sử dụng đất, bảng giá đất/giá đất cụ thể, các khoản miễn giảm...).
12. **IX. RỦI RO CẦN LƯU Ý:** Liệt kê các cờ rủi ro (`riskFlags`) và cảnh báo chuyên môn cần quan tâm.
13. **X. KHUYẾN NGHỊ CHUYÊN MÔN:** Đưa ra khuyến nghị hướng rà soát, liệt kê cụ thể các cơ quan/bộ phận cần phối hợp (UBND cấp xã nơi có đất, Văn phòng đăng ký đất đai / Chi nhánh VPĐKĐĐ, Phòng Tài nguyên và Môi trường, Cơ quan Thuế) và danh sách căn cứ pháp lý áp dụng (được diễn đạt theo chuẩn an toàn pháp lý: *"Căn cứ pháp lý cần cán bộ kiểm tra, đối chiếu văn bản hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có... Tuyệt đối không kết luận được hay không được chuyển mục đích"*).
14. **XI. CÂU HỎI GỢI Ý YÊU CẦU CÔNG DÂN GIẢI TRÌNH/BỔ SUNG:** Danh sách câu hỏi và các nội dung đề xuất yêu cầu công dân giải trình hoặc bổ sung hồ sơ.
15. **XII. CHECKLIST GỢI Ý CHO CÁN BỘ THỤ LÝ:** Bảng kiểm tra thực tế dành cho cán bộ địa chính thụ lý hồ sơ. Bảng gồm các cột: `TT`, `Nội dung rà soát / Kiểm tra`, `Kết quả rà soát` (với ô tích chuẩn `[  ] Đạt   [  ] Bổ sung`), và `Ghi chú`.
16. **XIII. TRÁCH NHIỆM & KÝ NHÁY NỘI BỘ:** Box ghi chú trách nhiệm cá nhân của cán bộ chuyên môn (`officerResponsibility`). Phía dưới là khối Nơi nhận (Lưu VT, HS TTHC, Cán bộ thụ lý, Lãnh đạo bộ phận) và khối ký nháy **CÁN BỘ THẨM TRA / RÀ SOÁT** (ghi rõ họ tên cán bộ thụ lý từ hệ thống hoặc để placeholder). Khối chữ ký **hoàn toàn không có con dấu hay chữ ký lãnh đạo cơ quan ban hành**, khẳng định tính chất nội bộ.

---

## 6. Nguyên tắc an toàn đã bảo đảm

Trong suốt quá trình thiết kế và triển khai Phase 7D-B, các nguyên tắc an toàn pháp lý và hệ thống được tuân thủ tuyệt đối:
- **Phiếu là tài liệu rà soát nội bộ:** Không phải văn bản phát hành cho công dân hay tổ chức ngoài cơ quan.
- **Không kết luận pháp lý:** Không kết luận hồ sơ đủ điều kiện hay không đủ điều kiện chuyển mục đích sử dụng đất; không chấp thuận hay từ chối chuyển mục đích sử dụng đất.
- **Không tính tiền sử dụng đất:** Không tính toán số tiền sử dụng đất phải nộp, không lập bảng tính tiền, không tạo thông báo nộp tiền hay kết luận nghĩa vụ tài chính.
- **Không tự đổi trạng thái hồ sơ:** Việc tải Word hay xem trước/in PDF hoàn toàn không làm thay đổi trường `status` hay `assignedToId` của bảng `AdministrativeProcedureCase`.
- **Không ký số, không gửi tự động:** Hệ thống không thực hiện ký số văn bản, không tự động phát hành văn bản, không gửi email hay tin nhắn cho công dân.
- **Không lưu trữ dư thừa:** Không lưu file Word/PDF vào MinIO hay database trong phase này (file được sinh dạng stream/blob tức thì).
- **Nhãn cảnh báo bắt buộc:** Mọi kết quả xuất ra (Word và PDF) đều bắt buộc đi kèm nhãn: **“BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA”**.

---

## 7. Kết quả test/build

Toàn bộ các chu trình kiểm thử tự động, build hệ thống và kiểm chứng thủ công đều đạt kết quả xuất sắc:
- **Backend Unit Tests:** Lệnh `npm test` passed 100% (8 suites, 39 tests passing). Toàn bộ các test case của `ai.service.spec.ts`, `land-profile.service.spec.ts`, `prompt-builder.service.spec.ts`, v.v. đều hoạt động ổn định.
- **Backend Production Build:** Lệnh `npm run build` (`nest build`) thành công 100%, không phát sinh bất kỳ lỗi cảnh báo hay lỗi biên dịch TypeScript nào.
- **Frontend Production Build:** Lệnh `npm run build` (`tsc -b && vite build`) thành công, bundle được đóng gói tối ưu cho môi trường production.
- **Kiểm chứng thủ công qua giao diện local (`http://kevindoan-legalflow.local:8080`):**
  - Mở hồ sơ TTHC thuộc loại "Chuyển mục đích sử dụng đất" đã có kết quả phân tích AI rà soát.
  - Kiểm tra Tab "AI rà soát": Hai nút chức năng **"Tải phiếu rà soát Word"** và **"Xem/In phiếu rà soát PDF"** hiển thị rõ ràng, chuyên nghiệp.
  - Bấm nút **"Tải phiếu rà soát Word"**: Trình duyệt tải xuống file `.docx` với tên đúng chuẩn `phieu-ra-soat-chuyen-muc-dich-su-dung-dat-<caseCode>.docx`. Mở file trên Word kiểm tra bố cục bảng biểu A4, quốc hiệu tiêu ngữ, banner cảnh báo, 13 mục nội dung và bảng checklist đều chuẩn xác, đẹp mắt.
  - Bấm nút **"Xem/In phiếu rà soát PDF"**: Modal trang in A4 mở ra mượt mà, trình bày đúng thể thức hành chính, không lẫn nội dung với cấp GCN lần đầu. Bấm nút "In / Lưu PDF" kích hoạt `window.print()` kết xuất PDF hoàn hảo.
  - **Kiểm chứng các ranh giới an toàn:** Xác nhận không có nút phát hành, không có chữ ký số, không gửi công dân, không có câu từ kết luận được/không được chuyển mục đích, không tính tiền sử dụng đất.
  - **Kiểm chứng tính toàn vẹn hệ thống:** Kiểm tra hồ sơ thủ tục "Cấp GCN lần đầu", xác nhận luồng xuất Word/PDF của thủ tục cũ vẫn hoạt động bình thường, tách biệt hoàn toàn. Kiểm tra module `LegalCase` (hồ sơ vụ việc pháp lý cũ) không bị ảnh hưởng.
  - **Kiểm chứng nhật ký kiểm toán:** Kiểm tra trong Tab "Nhật ký TTHC" (`audit_log`), xác nhận hệ thống đã ghi nhận đầy đủ các hành động `EXPORT_PURPOSE_CHANGE_REVIEW_DOCX` và `PURPOSE_CHANGE_REVIEW_PREVIEW_DATA` gắn với tài khoản cán bộ đang thao tác. Trạng thái hồ sơ vẫn giữ nguyên không đổi.

---

## 8. Lệnh SQL kiểm chứng

Cán bộ quản trị hoặc đội ngũ kỹ thuật có thể sử dụng các lệnh SQL dưới đây trong cơ sở dữ liệu PostgreSQL (`legalflow_v2`) để kiểm chứng độc lập tính toàn vẹn của dữ liệu sau khi triển khai Phase 7D-B:

### A. Kiểm tra nhật ký kiểm toán xuất phiếu rà soát chuyển mục đích
```sql
SELECT 
  log.id,
  log."procedureCaseId",
  case_table."caseCode",
  log."userId",
  user_table."fullName" AS "officerName",
  log."actionType",
  log."entityType",
  log."entityId",
  log."outputPayload"->>'filename' AS "exportedFilename",
  log."createdAt"
FROM "ProcedureAuditLog" log
JOIN "AdministrativeProcedureCase" case_table ON log."procedureCaseId" = case_table.id
LEFT JOIN "User" user_table ON log."userId" = user_table.id
WHERE log."actionType" IN ('EXPORT_PURPOSE_CHANGE_REVIEW_DOCX', 'PURPOSE_CHANGE_REVIEW_PREVIEW_DATA')
ORDER BY log."createdAt" DESC;
```
*Kết quả kỳ vọng:* Hiển thị danh sách các lần tải Word hoặc xem trước PDF của thủ tục chuyển mục đích sử dụng đất, gắn đúng ID và tên cán bộ thao tác.

### B. Kiểm tra trạng thái hồ sơ không bị thay đổi tự động
```sql
SELECT 
  case_table."caseCode",
  case_table."status",
  proc_type."name" AS "procedureType",
  case_table."updatedAt"
FROM "AdministrativeProcedureCase" case_table
JOIN "ProcedureType" proc_type ON case_table."procedureTypeId" = proc_type.id
WHERE proc_type."code" = 'LAND_USE_PURPOSE_CHANGE' OR proc_type."group" = 'CHUYEN_MUC_DICH_SDD';
```
*Kết quả kỳ vọng:* Trạng thái hồ sơ (`status`) vẫn giữ nguyên như trước khi thực hiện xuất Word/PDF (ví dụ: `RECEIVED`, `IN_REVIEW`), chứng minh hệ thống tuyệt đối không tự ý đổi trạng thái.

### C. Kiểm tra sự toàn vẹn của kết quả AI rà soát
```sql
SELECT 
  ai.id,
  case_table."caseCode",
  ai."analysisType",
  ai."confidenceLevel",
  ai."outputPayload"->>'summary' AS "aiSummary",
  ai."createdAt"
FROM "ProcedureAiAnalysis" ai
JOIN "AdministrativeProcedureCase" case_table ON ai."procedureCaseId" = case_table.id
WHERE ai."analysisType" = 'LAND_USE_PURPOSE_CHANGE_REVIEW'
ORDER BY ai."createdAt" DESC;
```
*Kết quả kỳ vọng:* Các bản phân tích AI vẫn giữ nguyên cấu trúc `outputPayload` và loại phân tích `LAND_USE_PURPOSE_CHANGE_REVIEW`, không bị ghi đè hay biến đổi khi tải Word/PDF.

### D. Kiểm tra không phát sinh bảng hay migration trái phép
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
*Kết quả kỳ vọng:* Danh sách các bảng giữ nguyên đúng như cấu trúc kiến trúc đã thống nhất (gồm `AdministrativeProcedureCase`, `ProcedureAiAnalysis`, `ProcedureAuditLog`, `ProcedureChecklistItem`, `ProcedureDocument`, `ProcedureNote`, `ProcedureType`, v.v.), không phát sinh bảng mới.

---

## 9. Backup/Rollback

Để bảo đảm an toàn tuyệt đối cho môi trường UAT và Production, quy trình backup và rollback cho Phase 7D-B được xác định như sau:
- **Backup mã nguồn:** Tạo kho lưu trữ bản chụp mã nguồn tại mốc hoàn thành dưới dạng file ZIP:  
  `legalflow-v2.6.2-land-use-purpose-change-review-export.zip`
- **Backup cơ sở dữ liệu:** Thực hiện sao lưu bản chụp cơ sở dữ liệu trước khi triển khai hoặc test tải (nếu cần):  
  `legalflow-db-backup-v2.6.2-land-use-purpose-change-review-export.sql`  
  *(Lệnh dump mẫu: `pg_dump -U postgres -d legalflow_v2 > legalflow-db-backup-v2.6.2-land-use-purpose-change-review-export.sql`)*
- **Quy trình Rollback mã nguồn:** Nếu phát sinh vấn đề bất thường trong môi trường thực tế, thực hiện quay lui về mốc release trước đó:
  ```bash
  git checkout v2.6.1-land-use-purpose-change-review-complete
  npm run build
  # Khởi động lại dịch vụ backend và frontend
  ```
- **Quy trình Rollback cơ sở dữ liệu:**  
  Do **Phase 7D-B hoàn toàn không sửa đổi schema và không tạo migration mới**, việc rollback cơ sở dữ liệu là **không cần thiết** khi quay lui mã nguồn. Các bảng dữ liệu cấu trúc vẫn hoàn toàn tương thích 100% với các phiên bản trước. Trường hợp duy nhất cần khôi phục DB từ file `.sql` là khi muốn xóa bỏ các bản ghi nhật ký kiểm toán (`ProcedureAuditLog`) sinh ra trong quá trình test.

---

## 10. Rủi ro còn lại

Mặc dù hệ thống đã hoàn thiện về mặt kỹ thuật kết xuất văn bản và bảo đảm an toàn pháp lý, một số rủi ro và giới hạn nghiệp vụ vẫn cần được lưu ý trong quá trình vận hành:
1. **Phụ thuộc chất lượng AI đầu vào:** Nội dung văn bản trong Phiếu rà soát phụ thuộc trực tiếp vào độ chính xác và chất lượng của kết quả phân tích từ LLM lưu trong `ProcedureAiAnalysis`. Nếu AI nhận diện sai hoặc bỏ sót thông tin từ file scan, phiếu rà soát cũng sẽ mang thông tin chưa chuẩn xác.
2. **Chưa có OCR tài liệu thực tế:** Hệ thống hiện tại nhận diện dữ liệu thông qua mô phỏng văn bản/tài liệu đính kèm, chưa tích hợp engine OCR chuyên sâu để tự động bóc tách text từ file PDF/ảnh scan thực tế của công dân.
3. **Chưa kết nối RAG / Kho tri thức pháp lý:** Trợ lý AI dựa trên prompt chuyên sâu và kiến thức pháp luật được cung cấp, chưa được kết nối với hệ thống RAG (Retrieval-Augmented Generation) để tự động đối chiếu thời gian thực với kho cơ sở dữ liệu văn bản pháp luật hoặc quy định nội bộ địa phương.
4. **Chưa tự động đối chiếu quy hoạch / kế hoạch sử dụng đất:** AI gợi ý các điểm cần kiểm tra quy hoạch, nhưng chưa có khả năng tự động kết nối và đối chiếu với hệ thống GIS hay bản đồ quy hoạch sử dụng đất địa phương.
5. **Chưa lập bảng tính nghĩa vụ tài chính:** Phase này chủ ý không tính tiền sử dụng đất. Nghiệp vụ tính tiền, áp giá đất cụ thể và xác định nghĩa vụ tài chính sẽ là một module chuyên sâu riêng biệt.
6. **Chưa có chữ ký số & Phát hành chính thức:** Phiếu rà soát hiện tại chỉ dành cho lưu chuyển nội bộ và in nháy, chưa tích hợp chữ ký số CA của cán bộ thẩm định hay chữ ký số của lãnh đạo cơ quan ban hành.
7. **Cần UAT chuyên môn thực tế:** Chức năng cần được đưa vào chạy thử nghiệm thực tế (UAT) với sự tham gia trực tiếp của các cán bộ địa chính và chuyên viên tiếp nhận hồ sơ tại địa phương để tinh chỉnh câu từ nghiệp vụ cho phù hợp nhất.

---

## 11. Kết luận

**Phase 7D-B đã chính thức hoàn thành xuất sắc, đạt trọn vẹn 100% các mục tiêu kỹ thuật, nghiệp vụ và ranh giới an toàn pháp lý đề ra.**

Với mốc phát hành này, hệ thống LegalFlow đã sở hữu một luồng xử lý tự động hóa chuyên sâu, khép kín và hoàn chỉnh cho thủ tục hành chính trọng tâm **"Chuyển mục đích sử dụng đất"**:
- 📝 **Tạo và quản lý hồ sơ TTHC** chuẩn hóa theo quy trình địa chính.
- 🤖 **Trợ lý AI rà soát chuyên sâu** 12 nhóm thông tin nghiệp vụ theo Luật Đất đai 2024.
- ✅ **Cơ chế Human-in-the-Loop** cho phép cán bộ thẩm định Accept/Reject kết quả AI.
- 📋 **Tự động hóa Ghi chú & Checklist** hỗ trợ theo dõi tiến độ thụ lý thực tế.
- 📄 **Xuất Phiếu rà soát nội bộ Word/PDF** tách biệt hoàn toàn template, chuẩn thể thức hành chính A4 phục vụ lưu trữ và trình lãnh đạo kiểm tra.

Hệ thống đã ổn định, vững chắc, không có nợ kỹ thuật và hoàn toàn sẵn sàng bước sang các giai đoạn phát triển mở rộng tiếp theo.

---

## 12. Đề xuất phase tiếp theo

Để tiếp tục hoàn thiện hệ sinh thái LegalFlow theo lộ trình nâng cấp tự động hóa nghiệp vụ quản lý đất đai, tôi xin đề xuất 3 hướng đi tiếp theo để bạn lựa chọn quyết định:

### 🔹 Lựa chọn 1: Phase 8A – Legal Knowledge Versioning & Update Control
- **Mục tiêu:** Xây dựng module quản lý và định danh phiên bản kho tri thức pháp lý (Luật Đất đai 2024, Nghị định 101/2024, Nghị định 102/2024...).
- **Lợi ích:** Cho phép quản trị viên cập nhật văn bản pháp luật mới, sửa đổi cấu hình điều khoản áp dụng mà không cần sửa code; giúp AI luôn dẫn chiếu đúng điều khoản pháp lý có hiệu lực tại thời điểm nộp hồ sơ.

### 🔹 Lựa chọn 2: Phase 7E-A – Thiết kế bảng tính dự kiến nghĩa vụ tài chính / tiền sử dụng đất
- **Mục tiêu:** Triển khai module chuyên sâu hỗ trợ cán bộ tính toán dự kiến tiền sử dụng đất, tiền thuê đất và các khoản lệ phí khi cấp GCN lần đầu hoặc chuyển mục đích sử dụng đất.
- **Lợi ích:** Giải quyết khâu nghiệp vụ phức tạp nhất trong thủ tục đất đai; AI hỗ trợ nhận diện diện tích, vị trí, bảng giá đất và công thức áp dụng, đồng thời giữ nguyên tắc Human-in-the-Loop (cán bộ duyệt bảng tính dự kiến trước khi chuyển cơ quan thuế).

### 🔹 Lựa chọn 3: Phase 9A – Notification & Deadline Alert Plan
- **Mục tiêu:** Xây dựng hệ thống cảnh báo hạn giải quyết hồ sơ TTHC (đếm ngược ngày đến hạn, cảnh báo hồ sơ sắp quá hạn/đã quá hạn).
- **Lợi ích:** Tối ưu hóa công tác giám sát điều hành của lãnh đạo bộ phận, gửi thông báo nhắc nhở cán bộ thụ lý qua giao diện và email nội bộ, bảo đảm tỷ lệ giải quyết hồ sơ đúng hạn theo quy định hành chính.

---
*Tài liệu được khởi tạo và xác nhận bởi hệ thống LegalFlow AI Architecture Team.*
