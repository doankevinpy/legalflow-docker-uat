# Báo Cáo Hoàn Thành Phase 5B: Chuẩn Hóa Mẫu Word Hành Chính Cho Các Bản Nháp AI

**Mốc hoàn thành (Git Tag):** `v2.3.2-ai-phase5b-word-templates`  
**Ngày hoàn thành:** 29/06/2026  
**Trạng thái:** Hoàn thành triển khai, kiểm thử và đóng gói.

---

## 1. Mục Tiêu Phase 5B

- **Chuẩn hóa mẫu Word `.docx`** xuất ra từ các bản nháp AI đã được lưu trữ trong `CaseNote` của hồ sơ.
- **Nâng cấp chất lượng bố cục văn bản** tiến sát với thể thức văn bản hành chính nhà nước (Nghị định 30/2020/NĐ-CP).
- **Hỗ trợ cán bộ thụ lý tối đa** trong việc rà soát, chỉnh sửa, hoàn thiện và trình ký lãnh đạo theo quy trình xử lý văn bản ngoài hệ thống.
- **Giữ vững nguyên tắc Human-in-the-Loop**, duy trì nhãn cảnh báo trang trọng **“BẢN NHÁP AI – CHƯA PHÁT HÀNH”** để ngăn ngừa mọi rủi ro pháp lý.

---

## 2. Phạm Vi Đã Triển Khai

1. **Chỉ chuẩn hóa file Word `.docx`**.
2. **Chưa xuất PDF**.
3. **Chưa ký số** (chưa tích hợp chữ ký điện tử / chứng thư số).
4. **Chưa phát hành văn bản** ra công chúng hoặc cơ quan khác.
5. **Chưa gửi email/văn bản** tự động cho công dân.
6. **Chưa lưu file vào MinIO** hay kho lưu trữ đám mây.
7. **Chưa tích hợp** hệ thống quản lý văn bản bên ngoài (e-Office).
8. **Chưa tự đổi `LegalCase.status`**.
9. **Chưa tự đổi `assignedToId`**.

---

## 3. File & Code Chính Đã Sửa Hoặc Thêm

- `legalflow-backend/src/cases/cases.service.ts`: Cập nhật hàm `exportDocx()` để gọi sang helper dựng mẫu Word, ghi log kiểm toán kèm trường `templateGroup`.
- `legalflow-backend/src/cases/docx-templates.helper.ts` *(Tạo mới)*: Helper chứa toàn bộ logic nhận diện tiền tố và lắp ghép bảng biểu Word cho 3 nhóm template hành chính.
- `legalflow-backend/src/cases/docx-templates.helper.spec.ts` *(Tạo mới)*: Bộ kiểm thử tự động kiểm tra bao phủ việc tạo Buffer Word cho đủ 6 loại bản nháp AI.

---

## 4. Cơ Chế Nhận Diện Loại Văn Bản

Hệ thống nhận diện loại văn bản dựa vào Regex an toàn khớp tiền tố `CaseNote.content`:
```regex
^\[AI Dự thảo - (.*?)\]
```
- Ví dụ: `[AI Dự thảo - Phiếu xử lý đơn]`, `[AI Dự thảo - Văn bản chuyển đơn]`.
- Logic phân loại tự động chuyển đổi chuỗi tiêu đề về chữ thường (`toLowerCase()`) để phân vào các nhóm template tương ứng.
- **Cơ chế Fallback an toàn**: Nếu ghi chú không nhận diện được loại cụ thể hoặc tiêu đề lạ, hệ thống tự động sử dụng mẫu `DEFAULT` (vẫn đảm bảo đầy đủ khung Quốc hiệu, Tiêu ngữ, cảnh báo Human-in-the-Loop và chữ ký placeholder chuẩn).

---

## 5. Các Nhóm Template Đã Chuẩn Hóa

Đã chia 6 loại bản nháp thực tế thành **3 nhóm cấu trúc bố cục hành chính**:

| Nhóm Template | Mã Nhóm | Các Bản Nháp AI Thuộc Nhóm |
| :--- | :--- | :--- |
| **Nhóm 1: Phiếu nội bộ** | `INTERNAL_NOTE` | - Phiếu xử lý đơn |
| **Nhóm 2: Văn bản có tên loại gửi ra ngoài** | `NAMED_DOC` | - Giấy mời làm việc/đối thoại<br>- Thông báo thụ lý<br>- Thông báo không thụ lý |
| **Nhóm 3: Công văn gửi ra ngoài** | `OFFICIAL_LETTER` | - Văn bản chuyển đơn<br>- Trả lời công dân dự thảo |

---

## 6. Cấu Trúc Word Sau Chuẩn Hóa

Khung văn bản `.docx` sinh ra được cấu trúc tuần tự, chuyên nghiệp qua 5 phần chính:
1. **Banner Cảnh Báo (Top Table)**: Hộp viền nổi bật màu cam với dòng chữ `⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH` in đậm và thông điệp `Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm trước khi sử dụng.` in nghiêng.
2. **Khung Đầu Trang (Header Table 2 Cột)**:
   - *Cột trái*: Placeholder Tên cơ quan ban hành (`[Cán bộ bổ sung tên cơ quan ban hành]`), Số ký hiệu (`[Cán bộ bổ sung số, ký hiệu văn bản]`). Riêng Công văn (`OFFICIAL_LETTER`) có thêm Trích yếu (`V/v: [Cán bộ bổ sung trích yếu nội dung]`).
   - *Cột phải*: Quốc hiệu (`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM`), Tiêu ngữ (`Độc lập - Tự do - Hạnh phúc`), đường kẻ ngang, và placeholder Địa danh ngày tháng (`[Cán bộ bổ sung địa danh, ngày tháng]`).
3. **Tiêu Đề Văn Bản**: Tên loại văn bản in hoa đậm cỡ chữ lớn ở giữa trang (đối với Phiếu nội bộ và Văn bản có tên loại). Riêng Công văn đi thẳng vào phần nội dung Kính gửi.
4. **Nội Dung Chính**: Lấy trực tiếp từ `CaseNote.content` (đã được tự động lọc bỏ các dòng tiêu đề/cảnh báo trùng lặp để giữ văn bản sạch sẽ).
5. **Khung Kết Thúc & Chữ Ký (Footer Table 2 Cột)**:
   - *Cột trái*: Phần Nơi nhận căn lề trái chuẩn theo Nghị định 30 (`Nơi nhận:`, `- Như trên;`, `- Lưu: VT, Hồ sơ.`).
   - *Cột phải*: Chức danh ký phù hợp theo nhóm (`CÁN BỘ THỤ LÝ` cho phiếu nội bộ; `[Cán bộ bổ sung chức danh Lãnh đạo ký]` cho văn bản gửi ra ngoài), kèm placeholder họ tên người ký.

---

## 7. Cơ Chế Làm Nổi Bật Placeholder

- **Tuyệt đối không hardcode**: Không tự ý ghi tên xã/phường, địa danh hay họ tên lãnh đạo cụ thể nào khi chưa có cấu hình hệ thống.
- **Tự động bóc tách & định dạng**: Thuật toán trong `formatLineToParagraph()` tự động nhận diện mọi chuỗi ký tự nằm trong dấu ngoặc vuông `[...]` (đặc biệt là `[Cán bộ bổ sung...]`).
- **Xử lý kỹ thuật thực tế**: Để bảo đảm độ tương thích và tính ổn định tuyệt đối 100% khi mở trên mọi phiên bản Microsoft Word, WPS Office hay LibreOffice mà không gây lỗi corrupt XML hay lỗi styling, toàn bộ placeholder được định dạng bằng **Chữ cam đậm in nghiêng** (`color: 'D97706', bold: true, italics: true`). Cách làm này giúp cán bộ thụ lý ngay lập tức chú ý đến các điểm cần điền trước khi in ấn trình ký.

---

## 8. Nguyên Tắc An Toàn Đã Bảo Đảm

Đã tuân thủ nghiêm ngặt 10 nguyên tắc bất khả xâm phạm:
1. **Không sửa `schema.prisma`**.
2. **Không tạo migration**.
3. **Không tự phát hành văn bản**.
4. **Không tự gửi văn bản/email cho công dân**.
5. **Không tự ký số**.
6. **Không tự kết luận pháp lý** (Mọi thông tin thẩm quyền/lý do từ chối đều để placeholder).
7. **Không tự đổi `LegalCase.status`**.
8. **Không tự đổi `assignedToId`**.
9. **Không tự sửa nội dung gốc trong `CaseNote`**.
10. **Không lưu file vào MinIO trong Phase 5B**.

---

## 9. Audit Log

Thao tác tải file Word tiếp tục được ghi nhận đầy đủ vào bảng `AiAuditLog` để phục vụ theo dõi và kiểm toán:
- **`actionType`**: `DRAFT`
- **`modelName`**: `System-Docx-Exporter`
- **`status`**: `SUCCESS`
- **`inputPayload` / `outputPayload`**: Thể hiện rõ chi tiết hành động và nhóm template đã sử dụng:
  ```json
  {
    "action": "EXPORT_DOCX",
    "caseId": "<uuid>",
    "noteId": "<uuid>",
    "fileType": "docx",
    "templateGroup": "INTERNAL_NOTE | NAMED_DOC | OFFICIAL_LETTER | DEFAULT"
  }
  ```

---

## 10. Kết Quả Test / Build

1. **Kiểm thử tự động (`npm test` tại backend)**:
   - Passed **8/8 Test Suites**, **37/37 Tests**.
   - Test suite mới `docx-templates.helper.spec.ts` đã chạy giả lập kiểm tra xuất file cho đủ 6 loại bản nháp (`Phiếu xử lý đơn`, `Giấy mời làm việc`, `Thông báo thụ lý`, `Thông báo không thụ lý`, `Văn bản chuyển đơn`, `Trả lời công dân dự thảo`). Tất cả đều sinh ra Buffer Word hợp lệ.
2. **Build Backend (`npm run build` tại backend)**: Thành công, không có lỗi TypeScript.
3. **Build Frontend (`npm run build` tại root workspace)**: Thành công, đóng gói bundle production hoàn chỉnh.
4. **Test thủ công (Manual UAT)**: Đã kiểm chứng việc tải 6 file `.docx` tương ứng với 6 bản nháp AI từ giao diện UAT. Khi mở trên Word, bố cục căn lề, màu cam hiển thị placeholder và khung cảnh báo đều đạt chuẩn.

---

## 11. Lệnh SQL Kiểm Chứng

```sql
-- 1. Kiểm tra log xuất Word mới nhất có chứa thông tin templateGroup
SELECT id, "caseId", "actionType", "modelName", "status", "inputPayload"
FROM "AiAuditLog"
WHERE "modelName" = 'System-Docx-Exporter'
ORDER BY "createdAt" DESC LIMIT 5;

-- 2. Kiểm chứng tính bất biến của hồ sơ (trạng thái và người thụ lý không bị thay đổi)
SELECT id, "caseCode", status, "assignedToId", "updatedAt"
FROM "LegalCase"
WHERE id = '<id_hồ_sơ_vừa_kiểm_thử>';
```

---

## 12. Rủi Ro Còn Lại

- **Bản chất hỗ trợ**: Template Word xuất ra vẫn mang tính chất là bản dự thảo hỗ trợ cán bộ thụ lý.
- **Chưa có thông tin cấu hình cơ quan chính thức**: Do hệ thống chưa có module quản lý cấu hình thông tin đơn vị ban hành (Tên UBND xã/phường, địa danh), nên hiện tại phải dùng placeholder toàn phần.
- **Chưa có thư viện mẫu văn bản pháp lý chính thức**: Các biểu mẫu hiện dựa trên cấu trúc hành chính chung, chưa phải là mẫu riêng biệt được phòng Văn thư/Pháp chế của từng địa phương phê duyệt.
- **Chưa xuất PDF & Chưa lưu phiên bản**: File được tạo dinamic tải trực tiếp về máy cán bộ, hệ thống chưa lưu lại các phiên bản chỉnh sửa `.docx`.
- **Trách nhiệm rà soát cuối cùng**: Cán bộ thụ lý bắt buộc phải rà soát kỹ thể thức, chính tả, căn cứ pháp lý, thẩm quyền ký và điền đầy đủ các placeholder trước khi phát hành chính thức.

---

## 13. Kết Luận

- **Phase 5B đã hoàn thành xuất sắc và đúng hạn**.
- Hệ thống LegalFlow AI đã nâng tầm chất lượng từ việc tạo văn bản thô sang xuất bản nháp `.docx` có bố cục hành chính chuyên nghiệp, gọn gàng, giúp tiết kiệm đáng kể thời gian chỉnh sửa cho cán bộ.
- **Đề xuất bước tiếp theo (Phase 5C hoặc Phase 5D)** *(Chưa triển khai ngay)*:
  - *Phase 5C*: Xây dựng cấu hình thông tin cơ quan ban hành (Tên UBND, địa danh, chức danh lãnh đạo) để tự động điền vào placeholder thay vì để cán bộ điền thủ công.
  - *Phase 5D*: Hỗ trợ xuất trực tiếp ra file PDF hoặc tích hợp lưu trữ phiên bản bản nháp vào kho MinIO.
