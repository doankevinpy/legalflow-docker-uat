# Báo Cáo Hoàn Thành Phase 5C: Cấu Hình Thông Tin Cơ Quan Cho File Word Nháp AI

**Mốc hoàn thành (Git Tag):** `v2.3.4-ai-phase5c-agency-config`  
**Ngày hoàn thành:** 29/06/2026  
**Trạng thái:** Hoàn thành triển khai, kiểm thử và đóng gói.

---

## 1. Mục Tiêu Phase 5C

- **Bổ sung cơ chế cấu hình thông tin cơ quan ban hành** cho file Word `.docx` xuất từ bản nháp AI.
- **Giảm thiểu tối đa lượng placeholder điền thủ công** trong tệp Word xuất ra, giúp văn bản hành chính đạt độ hoàn thiện cao, chỉn chu và chuyên nghiệp hơn.
- **Giữ vững nguyên tắc cốt lõi Human-in-the-Loop**, duy trì trang trọng nhãn cảnh báo **“BẢN NHÁP AI – CHƯA PHÁT HÀNH”** để nhắc nhở trách nhiệm kiểm tra, thẩm định của cán bộ thụ lý trước khi trình ký.

---

## 2. Phạm Vi Đã Triển Khai

1. **Vẫn chỉ xuất file Word `.docx`**.
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

- `legalflow-backend/src/config/agency.config.ts` *(Tạo mới)*: Module đọc, phân tích và chuẩn hóa cấu hình thông tin cơ quan từ biến môi trường (`process.env`), đồng thời tính toán danh sách các trường cấu hình bị thiếu (`missingFields`).
- `legalflow-backend/src/cases/docx-templates.helper.ts`: Nâng cấp hàm `buildDocxDocument()` để nhận thông tin cấu hình cơ quan và tự động điền vào Header/Footer thay cho placeholder.
- `legalflow-backend/src/cases/cases.service.ts`: Gọi `getAgencyConfig()`, truyền vào helper sinh Word và ghi log kiểm toán chi tiết vào `AiAuditLog`.
- `legalflow-backend/src/cases/docx-templates.helper.spec.ts`: Bổ sung các kiểm thử tự động (Unit Tests) cho cả kịch bản cấu hình đầy đủ và kịch bản rỗng cấu hình (fallback placeholder).
- `legalflow-backend/.env.example`: Cập nhật bổ sung 7 biến môi trường mẫu cấu hình cơ quan ban hành. *(Tuyệt đối không commit file `.env` thật)*.

---

## 4. Các Biến Môi Trường Đã Hỗ Trợ

Hệ thống cung cấp 7 biến môi trường cấu hình chuẩn hóa theo Nghị định 30/2020/NĐ-CP:

| Biến Môi Trường | Ý Nghĩa Nghiệp Vụ | Ví Dụ Giá Trị Mẫu |
| :--- | :--- | :--- |
| `AGENCY_PARENT_NAME` | Tên cơ quan chủ quản cấp trên | `UBND HUYỆN BÌNH CHÁNH` |
| `AGENCY_NAME` | Tên cơ quan ban hành văn bản | `UBND XÃ BÌNH MINH` |
| `AGENCY_LOCATION` | Địa danh ban hành văn bản | `Bình Minh` |
| `AGENCY_SIGNER_TITLE` | Chức danh thẩm quyền ký (Hỗ trợ `\n`) | `TM. ỦY BAN NHÂN DÂN\nCHỦ TỊCH` |
| `AGENCY_SIGNER_NAME` | Họ tên Lãnh đạo ký văn bản | `Nguyễn Văn A` |
| `AGENCY_DEFAULT_RECIPIENTS`| Nơi nhận mặc định (Hỗ trợ `\n`) | `- Như trên;\n- Lưu: VT, Hồ sơ.` |
| `AGENCY_DOCUMENT_SYMBOL_PREFIX`| Tiền tố/Hậu tố ký hiệu văn bản | `/UBND` |

---

## 5. Cơ Chế Hoạt Động

- Khi cán bộ thụ lý gửi yêu cầu tải file `.docx` của một bản nháp AI, backend tự động đọc cấu hình cơ quan hiện tại từ biến môi trường thông qua `getAgencyConfig()`.
- Đối tượng cấu hình này được truyền trực tiếp vào hàm lắp ghép bảng biểu Word (`buildDocxDocument()`).
- Bảng Header góc trái ưu tiên hiển thị `AGENCY_PARENT_NAME`, `AGENCY_NAME` và `AGENCY_DOCUMENT_SYMBOL_PREFIX` chuẩn màu đen trang trọng.
- Bảng Header góc phải ưu tiên hiển thị ngày tháng kèm `AGENCY_LOCATION`.
- Bảng Footer góc phải ưu tiên hiển thị `AGENCY_SIGNER_TITLE` và `AGENCY_SIGNER_NAME`.
- **Tuyệt đối chống hardcode**: Toàn bộ hệ thống không chứa bất kỳ chuỗi văn bản ghi chết nào về tên xã/phường cụ thể hay danh tính cá nhân lãnh đạo.

---

## 6. Cơ Chế Fallback An Toàn

Để bảo đảm an toàn tuyệt đối khi thông tin cấu hình trên máy chủ chưa được cập nhật đầy đủ, hệ thống tuân thủ nguyên tắc fallback sau:
- Nếu bất kỳ biến môi trường nào bị thiếu (`undefined`) hoặc là chuỗi rỗng (`""`), hệ thống **tuyệt đối không tự suy đoán**.
- Thay vào đó, trường thông tin bị thiếu lập tức khôi phục về giá trị placeholder tương ứng với định dạng nổi bật **Chữ cam đậm in nghiêng** (`color: 'D97706', bold: true, italics: true`):
  * `[Cán bộ bổ sung tên cơ quan chủ quản]`
  * `[Cán bộ bổ sung tên cơ quan ban hành]`
  * `[Cán bộ bổ sung số, ký hiệu văn bản]`
  * `[Cán bộ bổ sung địa danh, ngày tháng]`
  * `[Cán bộ bổ sung nơi nhận]`
  * `[Cán bộ bổ sung chức danh người ký]`
  * `[Cán bộ bổ sung họ tên người ký]`

---

## 7. Nguyên Tắc An Toàn Đã Bảo Đảm

Đã tuân thủ nghiêm ngặt 11 nguyên tắc an toàn bất khả xâm phạm:
1. **Không sửa `schema.prisma`**.
2. **Không tạo migration**.
3. **Không commit file `.env` thật** lên kho lưu trữ Git.
4. **Không tự phát hành văn bản**.
5. **Không tự gửi văn bản/email cho công dân**.
6. **Không tự ký số**.
7. **Không tự kết luận pháp lý**.
8. **Không tự đổi `LegalCase.status`**.
9. **Không tự đổi `assignedToId`**.
10. **Không tự sửa nội dung gốc trong `CaseNote`**.
11. **Không lưu file vào MinIO trong Phase 5C**.

---

## 8. Audit Log

Thao tác tải file Word tiếp tục được ghi vết chính xác vào bảng `AiAuditLog`. Đặc biệt, payload kiểm toán được bổ sung thêm 2 thông tin minh bạch hóa trạng thái cấu hình:
- **`agencyConfigApplied`** (`boolean`): Cờ xác nhận hệ thống có áp dụng cấu hình cơ quan hay đang chạy full fallback.
- **`missingConfigs`** (`string[]`): Danh sách chi tiết các biến môi trường cấu hình cơ quan còn thiếu trên server tại thời điểm xuất Word.

```json
{
  "action": "EXPORT_DOCX",
  "caseId": "<uuid>",
  "noteId": "<uuid>",
  "fileType": "docx",
  "templateGroup": "NAMED_DOC",
  "agencyConfigApplied": true,
  "missingConfigs": ["AGENCY_PARENT_NAME"]
}
```

---

## 9. Kết Quả Test / Build

1. **Kiểm thử tự động (`npm test` tại backend)**:
   - Passed **8/8 Test Suites**, **39/39 Tests**.
   - Bộ kiểm thử đã rà soát cả 2 kịch bản mock (đủ cấu hình và rỗng cấu hình fallback). Cả 2 kịch bản đều sinh ra Buffer Word hợp lệ và định dạng cây văn bản đúng kỳ vọng.
2. **Build Backend (`npm run build` tại backend)**: Thành công, không có lỗi TypeScript.
3. **Build Frontend (`npm run build` tại root workspace)**: Thành công, đóng gói bundle production hoàn chỉnh.
4. **Test thủ công (Manual UAT)**:
   - *Kịch bản có cấu hình*: Đã kiểm chứng file Word sinh ra hiển thị đầy đủ tên cơ quan và người ký, bố cục chuẩn chỉnh gọn gàng.
   - *Kịch bản rỗng cấu hình*: Đã kiểm chứng file Word lập tức chuyển toàn bộ Header/Footer sang placeholder màu cam nổi bật.

---

## 10. Hướng Dẫn Cấu Hình Local

1. Khi triển khai hoặc phát triển trên máy local, quản trị viên **chỉ chỉnh sửa file `.env` local** nằm tại `legalflow-backend/.env`.
2. Thêm các biến `AGENCY_*` theo mẫu đã hướng dẫn.
3. **Tuyệt đối không commit file `.env` thật** lên hệ thống quản lý phiên bản Git để tránh lộ lọt cấu hình máy chủ.
4. Khi cần chia sẻ mẫu biến môi trường cho các lập trình viên hay đối tác triển khai khác, hãy luôn bổ sung vào file mẫu `.env.example`.

---

## 11. Lệnh Kiểm Chứng

```sql
-- 1. Kiểm tra log kiểm toán xuất Word mới nhất (đã có trường agencyConfigApplied và missingConfigs)
SELECT id, "caseId", "actionType", "modelName", "status", "inputPayload"
FROM "AiAuditLog"
WHERE "modelName" = 'System-Docx-Exporter'
ORDER BY "createdAt" DESC LIMIT 5;

-- 2. Kiểm chứng tính bất biến của hồ sơ (không đổi trạng thái, không đổi người xử lý)
SELECT id, "caseCode", status, "assignedToId", "updatedAt"
FROM "LegalCase"
WHERE id = '<id_hồ_sơ_vừa_kiểm_thử>';
```

```bash
-- 3. Kiểm tra Git đảm bảo không theo dõi file .env bảo mật
git status -s | grep .env
# Kỳ vọng chỉ hiển thị: M legalflow-backend/.env.example (hoặc không có dòng nào về .env)
```

---

## 12. Rủi Ro Còn Lại

- **Quản trị biến môi trường**: Do lưu trữ trong `.env`, hệ thống hiện chưa có giao diện web (Admin UI) để quản trị viên sửa nhanh thông tin cơ quan.
- **Phụ thuộc vào quản trị hệ thống**: Khi địa phương có biến động về nhân sự (thay đổi Chủ tịch, Phó Chủ tịch ký văn bản), kỹ thuật viên phải truy cập vào server cập nhật biến môi trường và khởi động lại dịch vụ backend.
- **Bản chất hỗ trợ**: Tệp Word xuất ra vẫn là bản nháp hỗ trợ. Cán bộ thụ lý bắt buộc phải kiểm tra, rà soát lại toàn bộ thể thức, chính tả, thẩm quyền ký và căn cứ pháp lý trước khi trình ký chính thức.
- **Giới hạn phạm vi**: Chưa hỗ trợ xuất file trực tiếp ra định dạng PDF, chưa tích hợp ký số điện tử và chưa tự động lưu trữ phiên bản tệp tin.

---

## 13. Kết Luận

- **Phase 5C đã hoàn thành xuất sắc, đúng phạm vi và tuyệt đối an toàn**.
- Khả năng xuất bản nháp Word của LegalFlow AI giờ đây đã trở nên linh hoạt, chuyên nghiệp, tự động thích ứng với cấu hình của từng đơn vị hành chính mà không cần can thiệp source code.
- **Đề xuất bước tiếp theo** *(Chưa triển khai ngay)*:
  - **Phase 5D**: Lập kế hoạch xuất file PDF trực tiếp từ bản nháp Word để phục vụ trình ký nhanh trên thiết bị di động.
  - **Phase 5E**: Xây dựng giao diện quản trị cấu hình cơ quan (Admin UI + Database Storage) để giúp quản trị viên chủ động thay đổi thông tin người ký ngay trên trình duyệt mà không cần can thiệp vào file `.env` của server.
