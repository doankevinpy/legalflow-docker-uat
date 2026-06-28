# Báo cáo Hoàn thành Triển khai Phase 5A: Xuất bản nháp AI từ CaseNote ra file Word (.docx)

**Phiên bản hệ thống:** `v2.3.0-ai-phase5a-docx-export`  
**Ngày hoàn thành:** 28/06/2026  

---

## 1. Mục tiêu Phase 5A

- Cho phép xuất các bản nháp văn bản do AI sinh ra (đã được lưu trong lịch sử xử lý/ghi chú `CaseNote`) ra định dạng tài liệu Word chuẩn `.docx`.
- Phục vụ cán bộ thụ lý dễ dàng tải file về máy tính cá nhân để kiểm tra, chỉnh sửa, hoàn thiện căn cứ pháp lý và trình ký lãnh đạo theo quy trình xử lý văn bản thực tế ngoài hệ thống.
- Giữ vững nguyên tắc cốt lõi: Đây chỉ là bản nháp nội bộ hỗ trợ cán bộ, tuyệt đối chưa phát hành chính thức ra bên ngoài.

---

## 2. Phạm vi đã triển khai

Phạm vi Phase 5A được tuân thủ nghiêm ngặt theo đúng kế hoạch kỹ thuật đã phê duyệt:
- **Chỉ xuất file Word `.docx`** (sử dụng thư viện `docx`).
- **Chưa xuất định dạng PDF**.
- **Chưa ký số** (chưa tích hợp chứng thư số hay chữ ký điện tử).
- **Chưa gửi văn bản/email** tự động tới công dân hoặc các cơ quan liên quan.
- **Chưa phát hành văn bản** (văn bản đóng vai trò là dự thảo nội bộ chờ thẩm định).
- **Chưa lưu file vào MinIO** hay hệ thống lưu trữ tệp tin đám mây.
- **Chưa tích hợp** với các hệ thống quản lý văn bản và điều hành (e-Office / Quản lý văn bản) bên ngoài.

---

## 3. File/code chính đã sửa

Các thay đổi mã nguồn trong Phase 5A tập trung và gọn gàng trong các tệp tin sau:
- **Backend Packages**: Bổ sung thư viện tạo tài liệu trong `legalflow-backend/package.json` và `legalflow-backend/package-lock.json` (`docx@^9.5.0`).
- **Backend Controller**: `legalflow-backend/src/cases/cases.controller.ts` (Thêm API endpoint xử lý xuất tệp tin).
- **Backend Service**: `legalflow-backend/src/cases/cases.service.ts` (Triển khai logic cấu trúc tệp tin Word `.docx` và ghi vết `AiAuditLog`).
- **Frontend API Client**: `src/lib/apiClient.ts` (Bổ sung helper `downloadBlob` hỗ trợ tải stream dữ liệu nhị phân xác thực bằng Bearer Token).
- **Frontend API Wrapper**: `src/lib/casesApi.ts` (Bổ sung phương thức `casesApi.exportDocx`).
- **Frontend UI Component**: `src/pages/CaseDetail.tsx` (Tự động nhận dạng ghi chú bản nháp AI và bổ sung nút thao tác "📄 Tải Word (.docx)").

---

## 4. Endpoint đã thêm

- **REST API Endpoint**: `GET /cases/:caseId/notes/:noteId/export-docx`
- **Quyền truy cập**: Các vai trò `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` (được kiểm tra thêm quyền sở hữu/phân công đối với `STAFF`).
- **Lưu ý định tuyến (Routing)**: Frontend gọi tới backend thông qua cấu hình `VITE_API_BASE_URL`. Nếu hệ thống backend cấu hình tiền tố toàn cục `/api` (ví dụ trên môi trường Docker/UAT), URL yêu cầu thực tế từ trình duyệt sẽ là `GET /api/cases/:caseId/notes/:noteId/export-docx`.

---

## 5. Cơ chế hoạt động

1. **Nguồn dữ liệu duy nhất**: Hệ thống chỉ trích xuất dữ liệu từ trường nội dung `CaseNote.content` đã được cán bộ chủ động lưu vào lịch sử vụ việc trước đó. Không xuất từ các bản thảo tạm thời chưa lưu.
2. **Kiểm tra hợp lệ chặt chẽ**: Chỉ cho phép tải xuống đối với các bản ghi chú có tiền tố bắt đầu bằng `[AI Dự thảo - ...]`. Nếu ghi chú thông thường không có tiền tố này, hệ thống sẽ từ chối với lỗi `400 Bad Request`.
3. **Đảm bảo tính toàn vẹn**: Kiểm tra xác thực ID bài ghi chú (`noteId`) phải thuộc đúng ID của hồ sơ vụ việc (`caseId`).
4. **Luồng dữ liệu nhị phân (Streaming)**: File Word được tạo động ngay trong bộ nhớ (Buffer) và stream trả thẳng về trình duyệt dưới dạng `StreamableFile` kèm header `Content-Disposition: attachment; filename="Ban_Nhap_AI_...docx"`.
5. **Không lưu trữ thừa**: Tệp tin `.docx` sinh ra được tải thẳng về máy cán bộ, không tạo ra bản sao dư thừa trong cơ sở dữ liệu hay bộ nhớ MinIO.

---

## 6. Cấu trúc file Word xuất ra

Tài liệu Word xuất ra được định dạng chuẩn mực theo thể thức văn bản hành chính với các thành phần:
- **Quốc hiệu, Tiêu ngữ**: Căn giữa trang trọng phía trên bên phải (`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM / Độc lập - Tự do - Hạnh phúc`).
- **Dòng cơ quan ban hành**: Phía trên bên trái để dạng placeholder nổi bật **`[Cán bộ bổ sung tên cơ quan ban hành]`** (in đậm, in nghiêng màu cam) do hệ thống chưa có cấu hình danh mục cơ quan ban hành chính thức, tuyệt đối không tự ý hardcode tên địa phương cụ thể (như `UBND XÃ BÌNH MINH`).
- **Hộp cảnh báo Human-in-the-Loop**: Viền khung đơn màu cam trang trọng bao quanh lời nhắc:  
  `⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH`  
  `Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng.`
- **Tiêu đề văn bản**: Tự động trích xuất từ tiền tố của ghi chú (Ví dụ: `[AI Dự thảo - Thông báo thụ lý]` $\rightarrow$ `THÔNG BÁO THỤ LÝ`).
- **Nội dung bản thảo**: Trình bày rõ ràng từng đoạn văn. Toàn bộ các vùng giữ chỗ nhắc nhở như `[Cán bộ bổ sung số công văn...]`, `[Cán bộ bổ sung căn cứ điều khoản...]` được giữ nguyên và format chữ in nghiêng đậm màu cam để cán bộ rà soát.
- **Khung chữ ký & Nơi nhận**: Bên trái là phần `Nơi nhận: - Như trên; - Lưu: VT, Hồ sơ.`; bên phải là ô chữ ký nháy `CÁN BỘ THỤ LÝ` kèm họ tên của chính cán bộ đang thao tác tải file.

---

## 7. Nguyên tắc an toàn đã bảo đảm

Trong suốt quá trình thực hiện Phase 5A, hệ thống tuân thủ tuyệt đối 8 ràng buộc an toàn:
1. **Không sửa `schema.prisma`**: Giữ nguyên cấu trúc các bảng hiện có.
2. **Không tạo migration**: Không làm biến đổi lược đồ cơ sở dữ liệu UAT/Production.
3. **Không tự đổi `LegalCase.status`**: Trạng thái hồ sơ vẫn giữ nguyên trước và sau khi tải Word.
4. **Không tự đổi `assignedToId`**: Cán bộ được phân công xử lý hồ sơ không bị thay đổi.
5. **Không tự phát hành**: File tải về mang tính chất dự thảo nội bộ.
6. **Không tự gửi văn bản/email**: Không có bất kỳ giao tiếp ngoại tuyến nào được kích hoạt.
7. **Không tự ký số**: File mang định dạng văn bản thuần chỉnh sửa được.
8. **Không tự kết luận pháp lý**: Mọi nhận định mang tính gợi ý đều có placeholder để cán bộ kiểm chứng.

---

## 8. Audit log

Mỗi lần cán bộ click tải file Word thành công, hệ thống tự động ghi nhận một bản ghi vào bảng `AiAuditLog` với các tham số:
- **`actionType`**: `DRAFT` (sử dụng enum sẵn có trong schema).
- **`modelName`**: `'System-Docx-Exporter'`.
- **`status`**: `SUCCESS`.
- **`inputPayload` & `outputPayload`**: Chứa chuỗi JSON cấu trúc:  
  ```json
  {
    "action": "EXPORT_DOCX",
    "caseId": "<ID hồ sơ>",
    "noteId": "<ID ghi chú>",
    "fileType": "docx"
  }
  ```

---

## 9. Kết quả test / build

- **Backend Unit & Integration Tests (`npm test`)**: `33 passed, 33 total` (Vượt qua 100% các bài kiểm thử tự động của hệ thống).
- **Backend Production Build (`npm run build`)**: NestJS biên dịch thành công không có lỗi hay cảnh báo cấu trúc.
- **Frontend Production Build (`npm run build`)**: Vite & TypeScript đóng gói thành công production bundle.
- **Kiểm thử thủ công (Manual UAT Verification)**:
  - Tải file Word `.docx` thành công từ nút thao tác trên giao diện.
  - Mở file trên Microsoft Word thể hiện đúng bố cục, khung viền cảnh báo nổi bật.
  - Đã rà soát kỹ lưỡng toàn bộ mã nguồn và tệp xuất ra: **Hoàn toàn không còn hardcode tên cơ quan cụ thể** như `UBND XÃ BÌNH MINH`.

---

## 10. Lệnh SQL kiểm chứng

Cán bộ kiểm thử UAT hoặc quản trị viên có thể chạy các câu lệnh SQL truy vấn sau trực tiếp trên cơ sở dữ liệu PostgreSQL để kiểm chứng an toàn dữ liệu:

### 10.1. Kiểm tra nhật ký kiểm toán xuất Word trong `AiAuditLog`
```sql
SELECT id, "userId", "caseId", "actionType", "modelName", "status", "inputPayload", "createdAt"
FROM "AiAuditLog"
WHERE "modelName" = 'System-Docx-Exporter'
ORDER BY "createdAt" DESC
LIMIT 10;
```

### 10.2. Kiểm tra tính bất biến của trạng thái hồ sơ (`LegalCase.status`)
```sql
SELECT id, "caseCode", status, "assignedToId", "updatedAt"
FROM "LegalCase"
WHERE id = '<nhập_id_hồ_sơ_vừa_test>';
```
*(Xác nhận giá trị `status` không bị biến đổi sang trạng thái khác sau khi tải văn bản).*

### 10.3. Kiểm tra tính bất biến của cán bộ thụ lý (`assignedToId`)
```sql
SELECT c.id, c."caseCode", u."fullName" AS "assignedStaff", c."assignedToId"
FROM "LegalCase" c
LEFT JOIN "User" u ON c."assignedToId" = u.id
WHERE c.id = '<nhập_id_hồ_sơ_vừa_test>';
```
*(Xác nhận cán bộ được phân công giữ nguyên hoàn toàn).*

---

## 11. Rủi ro còn lại

Mặc dù tính năng hoạt động mượt mà và an toàn, hệ thống vẫn ghi nhận một số rủi ro nghiệp vụ và hạn chế kỹ thuật cần lưu ý ở giai đoạn hiện tại:
1. **Thể thức văn bản ở mức bản nháp**: Cấu trúc bảng biểu trong file Word đáp ứng tiêu chuẩn trực quan tốt cho bản nháp, nhưng khi ban hành chính thức cán bộ căn chỉnh lại lề, font chữ theo đúng Nghị định 30/2020/NĐ-CP về công tác văn thư.
2. **Chưa quản lý template văn bản chính thức**: Các biểu mẫu văn bản hiện đang được cấu trúc động bằng code, chưa có bộ công cụ cho phép Quản trị viên tự chỉnh sửa template (Mẫu số 01, 02...).
3. **Chưa xuất PDF**: Chỉ mới hỗ trợ tệp chỉnh sửa `.docx`, chưa hỗ trợ xuất bản PDF chống chỉnh sửa.
4. **Chưa quản lý phiên bản file tải về**: Hệ thống không lưu lại các lần tải về như là một version tài liệu đính kèm vào hồ sơ.
5. **Chưa ký số**: Văn bản chưa có giá trị pháp lý phát hành điện tử cho tới khi được in ra ký tươi đóng dấu hoặc qua phần mềm ký số chuyên dụng.
6. **Yêu cầu kiểm tra rà soát**: Cán bộ thụ lý luôn phải chịu trách nhiệm đọc kỹ và xác minh tính chính xác của các điều khoản luật được AI gợi ý trước khi sử dụng.

---

## 12. Kết luận và Đề xuất

- **Kết luận**: **Phase 5A đã hoàn thành xuất sắc và đạt 100% tiêu chí kỹ thuật nghiệp vụ đề ra**. Hệ thống LegalFlow v2 nay đã cung cấp trọn vẹn luồng trải nghiệm "Human-in-the-Loop": từ khâu AI đọc hiểu, tóm tắt, gợi ý quy trình, lập dự thảo nội bộ cho đến việc cán bộ dễ dàng xuất file Word ra ngoài để chỉnh sửa và trình ký.
- **Đề xuất bước tiếp theo**: Sau khi mốc `v2.3.0-ai-phase5a-docx-export` được nghiệm thu UAT, nhóm phát triển có thể xem xét lập kế hoạch cho các mốc tiếp theo (không triển khai ngay):
  - **Phase 5B**: Xuất bản PDF kèm hình mờ (Watermark) "DỰ THẢO NỘI BỘ".
  - **Phase 5C**: Xây dựng mô-đun Quản lý biểu mẫu động (Dynamic Template Management) cho phép tùy biến thể thức văn bản hành chính theo từng địa phương.
