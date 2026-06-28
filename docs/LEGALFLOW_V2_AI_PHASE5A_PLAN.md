# Kế Hoạch Kỹ Thuật LegalFlow v2 AI – Phase 5A: Xuất Bản Nháp AI Ra File Word `.docx`

**Phiên bản mục tiêu:** `v2.4.0-ai-phase5a-export-docx`  
**Trạng thái:** Kế hoạch kỹ thuật (Chưa sửa code, chưa tạo migration)  
**Ngày lập kế hoạch:** 28/06/2026  

---

## 1. Mục Tiêu & Phạm Vi Phase 5A

### 1.1. Mục tiêu
Cho phép cán bộ thụ lý lựa chọn các bản thảo văn bản nháp AI đã rà soát và lưu trong ghi chú hồ sơ (`CaseNote`) để xuất thành file văn bản Word (`.docx`) tải về máy cá nhân. Cán bộ có thể tiếp tục chỉnh sửa, định dạng hoàn thiện theo thể thức văn bản hành chính của cơ quan trước khi trình ký ban hành theo quy trình thực tế ngoài hệ thống.

### 1.2. Giới hạn phạm vi (In/Out of Scope)
* ✅ **Trong phạm vi Phase 5A:** Chỉ xuất format Word `.docx`; stream file trực tiếp tải về; ghi nhật ký kiểm toán.
* ❌ **Ngoài phạm vi:** Chưa xuất PDF; chưa ký số điện tử; chưa phát hành văn bản chính thức; chưa gửi email/văn bản cho công dân; chưa tích hợp phần mềm quản lý văn bản bên ngoài; không đổi trạng thái hồ sơ; không tự kết luận pháp lý.

---

## 2. Phân Tích & Giải Quyết Các Yêu Cầu Kỹ Thuật

### 2.1. Nguồn xuất Word: Từ `CaseNote.content` hay từ UI Draft?
* **Phân tích:** Xuất từ **`CaseNote.content`** là phương án chuẩn xác nhất vì:
  1. Đảm bảo tính nhất quán nghiệp vụ: Chỉ những bản nháp đã được cán bộ kiểm tra, bấm lưu (*"Lưu vào ghi chú"*) và có dấu vết kiểm toán (`ACCEPTED`) mới được phép tải ra ngoài.
  2. Tính kế thừa và tái sử dụng: Cán bộ hoặc Lãnh đạo có thể vào tab Lịch sử xử lý xem lại bất kỳ bản note dự thảo nào trong quá khứ và tải về file `.docx` tương ứng mà không cần phải chạy lại AI soạn thảo.
* **Kết luận:** Xuất dữ liệu từ bản ghi `CaseNote` trong cơ sở dữ liệu.

### 2.2. Thiết kế Endpoint Backend API
* **Endpoint đề xuất:**  
  `GET /api/cases/:caseId/notes/:noteId/export-docx`  
  *(Hoặc trong NestJS controller thuộc `CasesController`: `GET /cases/:id/notes/:noteId/export-docx`)*
* **Cơ chế hoạt động:** Request sử dụng phương thức `GET` giúp trình duyệt tải file stream về mượt mà. Backend xác thực token JWT, kiểm tra quyền truy cập hồ sơ, đọc `CaseNote`, dùng thư viện tạo buffer `.docx` và trả về với HTTP Header:  
  `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`  
  `Content-Disposition: attachment; filename="Ban_Nhap_AI_<CaseCode>.docx"`

### 2.3. Lưu trữ MinIO hay Stream trực tiếp?
* **Kết luận:** **Chỉ stream file tải về trực tiếp (On-the-fly streaming)** trong bộ nhớ RAM, tuyệt đối không lưu file `.docx` vào MinIO.
* **Lý do:** Bản nháp là tài liệu động đang trong quá trình chỉnh sửa. Việc lưu thêm file `.docx` vào MinIO sẽ gây dư thừa bộ nhớ, khó quản lý phiên bản và rò rỉ rác dữ liệu. Nội dung gốc đã nằm an toàn trong `CaseNote.content`.

### 2.4. Lựa chọn Thư viện Node.js tạo `.docx`
* **Thư viện đề xuất:** **`docx`** (npm package `docx`).
* **Lý do:** Đây là thư viện TypeScript/Node.js số 1 hiện nay để sinh file Word chuẩn `ECMA-376`. Thư viện hỗ trợ định dạng bảng biểu, font chữ hành chính (Times New Roman), căn lề, viền đỏ cảnh báo header/footer cực kỳ chuyên nghiệp và an toàn.

### 2.5. Cấu trúc chuẩn của File Word `.docx` xuất ra
Tài liệu được sinh ra phải đảm bảo bố cục hành chính kèm các rào chắn bảo mật Human-in-the-Loop:
1. **Quốc hiệu & Tiêu ngữ:**  
   CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM  
   Độc lập - Tự do - Hạnh phúc  
2. **Khung Banner Cảnh Báo Đầu Trang:** Một bảng 1 ô viền đỏ nhạt, chữ đậm màu đỏ ghim ngay dưới tiêu ngữ:  
   ⚠️ **BẢN NHÁP AI – CHƯA PHÁT HÀNH**  
   *Cán bộ thụ lý phải kiểm tra, đối chiếu căn cứ pháp lý, chỉnh sửa số liệu và hoàn toàn chịu trách nhiệm trước khi trình ký ban hành.*
3. **Tên cơ quan & Tiêu đề văn bản:** Lấy theo ngữ cảnh hồ sơ (UBND Xã Bình Minh...) và tiền tố loại dự thảo (PHIẾU XỬ LÝ ĐƠN / THÔNG BÁO THỤ LÝ...).
4. **Nội dung bản nháp:** Lấy từ đoạn text trong `CaseNote.content` (loại bỏ thẻ tiền tố `[AI Dự thảo - ...]`). Các đoạn giữ chỗ `[Cán bộ bổ sung...]` được in nghiêng đậm để cán bộ dễ nhận biết khi sửa trên Word.
5. **Khung chữ ký / Nơi nhận:** Để trống phần Người lập biểu / Lãnh đạo trình ký theo thể thức tiêu chuẩn.

### 2.6. Vị trí đặt Nút UI "Xuất Word bản nháp"
* **Vị trí tối ưu:** Đặt tại **Tab Lịch sử xử lý / Ghi chú (`CaseNote`)**.
* Bên cạnh mỗi bản ghi chú có chứa tiền tố `[AI Dự thảo - ...]`, bổ sung nút nút nhỏ gọn: **"📄 Tải Word (.docx)"** (`variant="outline" size="sm"`). Nhấp vào nút sẽ tự động kích hoạt trình duyệt tải file `.docx` về máy.

### 2.7. Kiểm soát quyền người dùng (RBAC)
* Tất cả người dùng đã đăng nhập và được cấp quyền xem hồ sơ (chức danh `STAFF` - chuyên viên thụ lý, `MANAGER` - lãnh đạo phòng/UBND, `ADMIN`) đều có quyền gọi API tải bản nháp `.docx` của hồ sơ đó.
* Những tài khoản không có quyền xem hồ sơ sẽ bị từ chối truy cập `403 Forbidden`.

### 2.8. Yêu cầu về Schema & Ghi vết Kiểm toán (Audit Logging)
> [!IMPORTANT]
> **KHẲNG ĐỊNH KHÔNG SỬA SCHEMA DATABASE:**  
> Hệ thống hiện tại có sẵn bảng `AiAuditLog` với trường `actionType` là Enum (`SUMMARIZE`, `CLASSIFY`, `CHECKLIST`, `DRAFT`) và trường `inputPayload` kiểu `Json`.  
> Khi người dùng tải file Word, hệ thống sẽ ghi nhận 1 bản ghi mới vào `AiAuditLog` với `actionType: 'DRAFT'` và gán `inputPayload: { action: 'EXPORT_DOCX', caseNoteId: '...', caseCode: '...' }`, `userFeedback: 'ACCEPTED'`.  
> Do đó, **100% KHÔNG CẦN SỬA `schema.prisma` VÀ KHÔNG TẠO MIGRATION MỚI!**

---

## 3. Kế Hoạch Báo Cáo Triển Khai

### 3.1. Danh sách các file dự kiến sửa đổi/bổ sung
1. `legalflow-backend/package.json`: Cài đặt thêm package `docx`.
2. `legalflow-backend/src/cases/cases.controller.ts`: Thêm endpoint `GET /:id/notes/:noteId/export-docx`.
3. `legalflow-backend/src/cases/cases.service.ts`: Viết logic tải `CaseNote`, sinh buffer `.docx` bằng `docx` và ghi `AiAuditLog`.
4. `src/services/api.ts` & `src/pages/CaseDetail.tsx`: Thêm nút *"📄 Tải Word (.docx)"* trên UI phần hiển thị `CaseNote`.

### 3.2. Luồng người dùng thao tác (User Flow)
1. Cán bộ vào hồ sơ $\rightarrow$ Tab Trợ lý AI $\rightarrow$ Soạn thảo nháp $\rightarrow$ Bấm *"💾 Lưu vào ghi chú hồ sơ"*.
2. Chuyển sang Tab *"Lịch sử xử lý"*, thấy bản nháp vừa lưu có thêm nút **"📄 Tải Word (.docx)"**.
3. Cán bộ bấm tải về $\rightarrow$ Trình duyệt nhận stream file `.docx`.
4. Mở file Word trên máy tính thấy đầy đủ thể thức, nhãn cảnh báo đỏ và nội dung nháp để chỉnh sửa tiếp.

### 3.3. Đánh giá rủi ro pháp lý & nghiệp vụ
* **Rủi ro:** Cán bộ quên xóa nhãn cảnh báo đỏ *"BẢN NHÁP AI"* và in trực tiếp ra gửi công dân.
* **Quản trị rủi ro:** Nhãn cảnh báo được đặt trong khung viền đỏ nổi bật ngay đầu trang. Phần nội dung ghi rõ trách nhiệm rà soát của cán bộ. Mọi thao tác tải file đều được lưu log kiểm toán có tên tài khoản và thời gian cụ thể.

---

## 4. Kế Hoạch Kiểm Thử (Testing Plan)

### 4.1. Kiểm thử tự động (Backend Unit Tests)
Viết test case trong `cases.service.spec.ts`:
* Xác minh gọi hàm export trả về stream/buffer thành công.
* Xác minh nội dung buffer sinh ra là định dạng zip/docx hợp lệ.
* Xác minh hàm tạo log `AiAuditLog` được gọi với đúng payload `EXPORT_DOCX`.
* Xác minh `LegalCase.status` và `assignedToId` không bị thay đổi.

### 4.2. Kiểm thử thủ công trên trình duyệt
* Nhấp nút *"📄 Tải Word (.docx)"* trên tab Lịch sử xử lý.
* Kiểm tra file tải về mở được bằng Microsoft Word / LibreOffice.
* Kiểm tra đầy đủ Quốc hiệu, Tiêu ngữ, Khung cảnh báo đỏ và đoạn placeholder in nghiêng.

### 4.3. Các câu lệnh SQL kiểm chứng
```sql
-- 1. Kiểm tra log kiểm toán xuất file Word
SELECT id, "caseId", "userId", "actionType", "inputPayload", "createdAt" 
FROM "AiAuditLog" 
WHERE "inputPayload"->>'action' = 'EXPORT_DOCX'
ORDER BY "createdAt" DESC;

-- 2. Kiểm tra trạng thái hồ sơ bất biến
SELECT id, "caseCode", status, "assignedToId" FROM "LegalCase" WHERE id = '<YOUR_CASE_ID>';
```

---

## 5. Kết Luận & Khuyến Nghị Triển Khai

* **Kết luận:** Kế hoạch Phase 5A hoàn toàn khả thi, đáp ứng 100% các yêu cầu nghiệp vụ và nguyên tắc an toàn bảo mật. Đặc biệt, việc tận dụng trường `Json` trong `AiAuditLog` giúp hệ thống không phải chạm vào cấu trúc database, loại bỏ hoàn toàn rủi ro migration.
* **Khuyến nghị hướng triển khai:** Đồng ý triển khai Phase 5A theo hướng **xuất Word từ `CaseNote` + stream file trực tiếp bằng thư viện `docx` + ghi log vào `AiAuditLog` hiện có**.
