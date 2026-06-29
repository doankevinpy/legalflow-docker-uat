# Kế Hoạch Kỹ Thuật Phase 5C: Cấu Hình Thông Tin Cơ Quan & Mẫu Văn Bản Hành Chính Cho File Word Nháp AI

**Mốc xuất phát:** `v2.3.3-ai-phase5b-complete`  
**Ngày lập kế hoạch:** 29/06/2026  
**Trạng thái:** Lập kế hoạch (Chưa triển khai source code)

---

## 1. Mục Tiêu Phase 5C

- **Giảm thiểu thao tác điền placeholder thủ công** của cán bộ thụ lý trong các file Word `.docx` được xuất từ bản nháp AI (như tên cơ quan ban hành, địa danh, chức danh lãnh đạo ký).
- **Thiết lập cơ chế cấu hình thông tin cơ quan chuẩn mực**, giúp file Word xuất ra có độ hoàn thiện cao hơn, mang tính chuyên nghiệp và sẵn sàng cho việc chỉnh sửa tinh chỉnh nội dung.
- **Tuân thủ tuyệt đối nguyên tắc Human-in-the-Loop**, tiếp tục duy trì nhãn cảnh báo an toàn **“BẢN NHÁP AI – CHƯA PHÁT HÀNH”** và cơ chế fallback an toàn (dùng placeholder nếu thiếu cấu hình).

---

## 2. Phạm Vi Triển Khai & Yêu Cầu An Toàn Bắt Buộc

### 2.1. Phạm vi thực hiện
1. **Vẫn chỉ xuất file Word `.docx`**.
2. **Chưa xuất PDF**.
3. **Chưa ký số** (chưa tích hợp chữ ký điện tử / chứng thư số).
4. **Chưa phát hành văn bản** ra bên ngoài.
5. **Chưa gửi email/văn bản** tự động cho công dân.
6. **Chưa lưu file vào MinIO** hay kho lưu trữ đám mây.
7. **Chưa tích hợp** hệ thống quản lý văn bản bên ngoài (e-Office).
8. **Chưa tự đổi `LegalCase.status`**.
9. **Chưa tự đổi `assignedToId`**.

### 2.2. 9 Yêu cầu an toàn bắt buộc
1. **Không tự phát hành văn bản**.
2. **Không tự gửi văn bản/email**.
3. **Không tự ký số**.
4. **Không tự kết luận pháp lý**.
5. **Không tự đổi `LegalCase.status`**.
6. **Không tự đổi `assignedToId`**.
7. **File Word vẫn phải có nhãn trang trọng**: `⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH`.
8. **Cán bộ vẫn phải kiểm tra, chỉnh sửa và chịu trách nhiệm** trước khi sử dụng.
9. **Nếu cấu hình thiếu hoặc rỗng, hệ thống buộc phải dùng placeholder** `[Cán bộ bổ sung...]` nổi bật màu cam, tuyệt đối không tự suy đoán.

---

## 3. Phân Tích & Đánh Giá Phương Án Lưu Trữ Cấu Hình Cơ Quan

Để lưu trữ các thông tin như Tên UBND, Địa danh, Chức danh ký, có 3 phương án kỹ thuật khả thi:

### Phương án A: Sử dụng Biến môi trường (`.env`) kết hợp Config file trong Code
- **Mô tả**: Khai báo các biến môi trường như `AGENCY_NAME`, `AGENCY_LOCATION`, `AGENCY_SIGNER_TITLE` trong file `.env` của container Docker backend. Tạo file `src/config/agency.config.ts` để đọc và chuẩn hóa cấu hình này thông qua `ConfigService` của NestJS.
- **Ưu điểm**:
  - **Hoàn toàn KHÔNG CẦN SỬA `schema.prisma` và KHÔNG CẦN TẠO MIGRATION.**
  - **Độ an toàn tuyệt đối**: Ít rủi ro, không đụng đến cơ sở dữ liệu đang vận hành production.
  - **Rollback tức thì**: Chỉ cần sửa `.env` và restart container là xong.
  - Phù hợp tối đa với kiến trúc Docker microservices hiện tại của LegalFlow.
- **Nhược điểm**: Muốn thay đổi thông tin cơ quan (ví dụ đổi tên Chủ tịch mới) thì quản trị viên hệ thống cần cập nhật file `.env` hoặc cấu hình biến môi trường trên server.

### Phương án B: Tạo Bảng cấu hình mới trong Database (`SystemConfig` / `AgencyProfile`)
- **Mô tả**: Thêm model `SystemConfig` vào `schema.prisma`, chạy migration, xây dựng API CRUD và giao diện Admin UI để chỉnh sửa cấu hình trực tiếp trên trình duyệt.
- **Ưu điểm**: Quản trị viên (ADMIN) có thể tự cập nhật cấu hình trực tiếp trên web UI mà không cần can thiệp vào server/Docker.
- **Nhược điểm**: **Bắt buộc phải sửa `schema.prisma` và chạy migration**, phát sinh rủi ro rò rỉ hoặc lỗi schema trên môi trường UAT/Production. Cần thêm khối lượng công việc làm API và UI lớn hơn nhiều.

### Phương án C: Cấu hình tạm thời trong Code (Hardcode mặc định trong Helper)
- **Mô tả**: Ghi mặc định các chuỗi cấu hình vào một hằng số trong file `docx-templates.helper.ts`.
- **Nhược điểm**: Vi phạm nguyên tắc chống hardcode, thiếu tính linh hoạt khi triển khai cho các đơn vị hành chính khác nhau.

👉 **ĐÁNH GIÁ & KHUYẾN NGHỊ**:  
Tuân thủ tiêu chí *"Ưu tiên phương án an toàn, ít rủi ro, dễ rollback"* và *"Nếu cần sửa schema/migration phải dừng lại duyệt"*, **Khuyến nghị lựa chọn PHƯƠNG ÁN A (Biến môi trường `.env` + Config Code)** cho Phase 5C. Phương án này đạt 100% mục tiêu nghiệp vụ mà không đem lại bất kỳ rủi ro database nào.

---

## 4. Đề Xuất Các Trường Cấu Hình Tối Thiểu & Cơ Chế Fallback

Hệ thống đề xuất tập hợp 7 trường cấu hình tiêu chuẩn ban hành văn bản hành chính theo Nghị định 30/2020/NĐ-CP:

| Tên Biến Môi Trường (`.env`) | Ý Nghĩa Nghiệp Vụ | Ví Dụ Cấu Hình Chuẩn | Giá Trị Fallback Khi Thiếu Cấu Hình |
| :--- | :--- | :--- | :--- |
| `AGENCY_GOVERNING_BODY` | Tên cơ quan chủ quản cấp trên | `UBND HUYỆN BÌNH CHÁNH` | *(Không hiển thị dòng này)* |
| `AGENCY_NAME` | Tên cơ quan ban hành văn bản | `UBND XÃ BÌNH MINH` | `[Cán bộ bổ sung tên cơ quan ban hành]` |
| `AGENCY_LOCATION` | Địa danh ban hành văn bản | `Bình Minh` | `[Cán bộ bổ sung địa danh]` |
| `AGENCY_DOC_SYMBOL` | Ký hiệu văn bản mặc định | `/UBND` | `...../........` |
| `AGENCY_SIGNER_TITLE` | Chức danh thẩm quyền ký | `TM. ỦY BAN NHÂN DÂN\nCHỦ TỊCH` | `[Cán bộ bổ sung chức danh Lãnh đạo ký]` |
| `AGENCY_SIGNER_NAME` | Họ tên Lãnh đạo ký văn bản | `Nguyễn Văn A` | `[Cán bộ bổ sung họ tên người ký]` |
| `AGENCY_DEFAULT_RECIPIENTS`| Nơi nhận mặc định | `- Như trên;\n- Lưu: VT, Hồ sơ.` | `- Như trên;\n- Lưu: VT, Hồ sơ.` |

### Cơ chế Fallback an toàn (Fallback Mode)
Khi hàm `buildDocxDocument()` tạo bảng biểu Word, nó sẽ kiểm tra từng trường cấu hình. Nếu biến môi trường là `undefined`, `null` hoặc chuỗi rỗng `""`, hệ thống tự động sinh ra đối tượng `TextRun` với giá trị Fallback tương ứng được tô **màu cam đậm in nghiêng** (`color: 'D97706', bold: true, italics: true`) giống hệt cơ chế Phase 5B. Đảm bảo hệ thống **không bao giờ tự suy đoán sai lệch**.

---

## 5. Áp Dụng Cấu Hình Vào 6 Template Word Hiện Có

### 5.1. Nhóm 1: Phiếu nội bộ (`INTERNAL_NOTE` - Phiếu xử lý đơn)
- **Header Trái**: Hiển thị `AGENCY_NAME` (hoặc fallback).
- **Chữ Ký Phải**: Chức danh giữ cố định là `CÁN BỘ THỤ LÝ`. Họ tên hiển thị `user.fullName` (hoặc fallback).

### 5.2. Nhóm 2: Văn bản có tên loại (`NAMED_DOC` - Giấy mời, Thông báo thụ lý/không thụ lý)
- **Header Trái**: Dòng 1 hiển thị `AGENCY_GOVERNING_BODY` (chữ thường in hoa nhỏ hoặc in thường). Dòng 2 hiển thị `AGENCY_NAME` (in đậm). Dòng 3 hiển thị Số ký hiệu (`Số: .....${AGENCY_DOC_SYMBOL}`).
- **Header Phải**: Tiêu ngữ & Dòng địa danh ngày tháng (`${AGENCY_LOCATION}, ngày ... tháng ... năm 202...`).
- **Chữ Ký Phải**: Dòng 1 hiển thị `AGENCY_SIGNER_TITLE` (in đậm). Dòng 2 `(Ký, ghi rõ họ tên, đóng dấu)`. Dòng dưới cùng hiển thị `AGENCY_SIGNER_NAME` (in đậm).

### 5.3. Nhóm 3: Công văn gửi ra ngoài (`OFFICIAL_LETTER` - Chuyển đơn, Trả lời công dân)
- **Áp dụng tương tự Nhóm 2** cho Header và Footer. Bổ sung thêm dòng Trích yếu (`V/v: ...`) ngay dưới Số ký hiệu ở cột trái Header.

---

## 6. Đề Xuất UI Quản Trị Cấu Hình (Nếu Nâng Cấp Phương Án Database Sau Này)

Nếu trong tương lai (Phase 6 hoặc mở rộng) người dùng quyết định nâng cấp lên Phương án B (Lưu cấu hình trong Database), hệ thống áp dụng các quy tắc quản trị sau:
1. **Phân quyền**: Chỉ tài khoản có Role `ADMIN` mới có quyền xem và cập nhật cấu hình cơ quan. Role `MANAGER` và `STAFF` chỉ được quyền sử dụng (quét cấu hình để xuất Word).
2. **Audit Log**: Mọi thao tác thay đổi cấu hình cơ quan đều bắt buộc ghi vết vào bảng `AdminAuditLog` với `action: UPDATE_AGENCY_CONFIG`, ghi rõ giá trị cũ (`oldValue`) và giá trị mới (`newValue`).

---

## 7. Đề Xuất Kế Hoạch Kiểm Thử (Testing Strategy)

### 7.1. Kiểm thử tự động (`npm test`)
Bổ sung unit test trong `docx-templates.helper.spec.ts` kiểm thử 2 kịch bản chính:
- **Kịch bản có cấu hình đầy đủ**: Truyền mock config hợp lệ (`AGENCY_NAME: 'UBND XÃ TEST'`). Xác minh Buffer sinh ra và trong tree tài liệu không chứa chuỗi placeholder `[Cán bộ bổ sung tên cơ quan ban hành]`.
- **Kịch bản rỗng cấu hình (Fallback test)**: Truyền mock config rỗng `{}`. Xác minh tài liệu tự động bật chế độ fallback, chứa đầy đủ các chuỗi cảnh báo màu cam `[Cán bộ bổ sung...]`.

### 7.2. Kiểm thử thủ công (Manual UAT)
1. Cấu hình thử nghiệm các biến trong `.env` (ví dụ `AGENCY_NAME="UBND XÃ UAT DEMO"`).
2. Restart backend (`npm run start:dev`).
3. Truy cập UAT tải file Word `.docx` của 6 bản nháp AI. Mở trên Microsoft Word rà soát: Tên cơ quan, địa danh, chức danh đã được tự động điền đẹp mắt chuẩn màu đen chữ hành chính, trong khi banner cảnh báo **“BẢN NHÁP AI – CHƯA PHÁT HÀNH”** màu cam vẫn nằm trang trọng ở đầu trang.

---

## 8. Lệnh SQL Kiểm Chứng

```sql
-- 1. Kiểm tra log kiểm toán xuất Word sau khi tích hợp config
SELECT id, "caseId", "actionType", "modelName", "status", "inputPayload"
FROM "AiAuditLog"
WHERE "modelName" = 'System-Docx-Exporter'
ORDER BY "createdAt" DESC LIMIT 5;

-- 2. Kiểm chứng tính bất biến của hồ sơ (đảm bảo xuất Word config không làm đổi status/assignee)
SELECT id, "caseCode", status, "assignedToId"
FROM "LegalCase"
WHERE id = '<id_hồ_sơ_vừa_test>';
```

---

## 9. Đánh Giá Rủi Ro Nghiệp Vụ & Pháp Lý

- **Rủi ro chủ quan**: Cán bộ thụ lý thấy file Word xuất ra đã có sẵn tên cơ quan, tên Chủ tịch nên phát sinh tâm lý chủ quan, không kiểm tra kỹ nội dung bản nháp hoặc quên thay đổi người ký khi lãnh đạo đi vắng/ủy quyền.
- **Biện pháp giảm thiểu**:
  - Giữ nguyên khung viền cảnh báo màu cam kích thước lớn ở trang đầu tiên.
  - Ghi dòng nhắc nhở trong chữ ký nháy: *“Cán bộ thụ lý phải soát xét kỹ trước khi trình ký”*.
  - Audit log ghi nhận danh tính cán bộ thực hiện tải file xuất Word để quy trách nhiệm rà soát.

---

## 10. Báo Cáo Kế Hoạch Tổng Hợp

| Câu Hỏi Yêu Cầu Của Báo Cáo | Trả Lời Chi Tiết Cho Phase 5C |
| :--- | :--- |
| **1. File dự kiến sửa / tạo mới** | - Tạo mới: `legalflow-backend/src/config/agency.config.ts`<br>- Chỉnh sửa: `legalflow-backend/src/cases/docx-templates.helper.ts` (nhận tham số config)<br>- Chỉnh sửa: `legalflow-backend/src/cases/cases.service.ts` (inject ConfigService)<br>- Chỉnh sửa: `legalflow-backend/src/cases/docx-templates.helper.spec.ts` (thêm test case config) |
| **2. Có cần sửa schema hay không?** | **KHÔNG** (Khuyến nghị chọn Phương án A - Biến môi trường `.env`). |
| **3. Có cần migration hay không?** | **KHÔNG**. |
| **4. Luồng xử lý dự kiến** | Controller nhận request $\rightarrow$ Service lấy config từ `ConfigService` $\rightarrow$ Truyền config cùng nội dung nháp vào `buildDocxDocument()` $\rightarrow$ Helper ghép dữ liệu config vào Header/Footer (thay cho placeholder) $\rightarrow$ Sinh Buffer Word $\rightarrow$ Ghi Audit Log $\rightarrow$ Trả file. |
| **5. Cách cấu hình đưa vào Word** | Thay thế động các chuỗi `[Cán bộ bổ sung...]` tại góc trái Header, góc phải Header và góc phải Footer bằng giá trị thực tế từ cấu hình, với định dạng chuẩn chữ đen trang trọng. |
| **6. Rủi ro chính** | Cán bộ chủ quan không rà soát lại thông tin mặc định khi có biến động nhân sự lãnh đạo. |
| **7. Cách test** | Chạy `npm test` backend xác minh 100% test case pass; tải file `.docx` thực tế trên UAT để rà soát trực quan trên Microsoft Word. |
| **8. Kết luận hướng triển khai** | **NÊN TRIỂN KHAI PHASE 5C THEO PHƯƠNG ÁN A (Biến môi trường `.env` + Code Config).** Đây là giải pháp an toàn tuyệt đối, không thay đổi database, đáp ứng hoàn hảo nhu cầu chuẩn hóa hành chính của người dùng. |
