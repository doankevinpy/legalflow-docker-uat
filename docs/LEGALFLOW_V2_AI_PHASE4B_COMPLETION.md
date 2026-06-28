# Báo Cáo Hoàn Thành Triển Khai LegalFlow v2 AI – Phase 4B (Mở Rộng Soạn Thảo Văn Bản Nháp Nội Bộ)

**Phiên bản / Tag:** `v2.3.0-ai-phase4b-drafting-expanded`  
**Ngày hoàn thành:** 28/06/2026  

---

## 1. Mục Tiêu Phase 4B

Tiếp nối sự thành công của Phase 4A, Phase 4B đã mở rộng toàn diện năng lực **Trợ lý AI Soạn thảo văn bản nháp nội bộ** trên hệ thống LegalFlow v2. Mục tiêu của giai đoạn này là cung cấp giải pháp tự động hóa khâu chuẩn bị văn bản dự thảo ban đầu cho cán bộ thụ lý hồ sơ cấp xã/phường đối với **tất cả các loại văn bản nghiệp vụ cốt lõi** phát sinh trong quá trình giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh.

Thay vì cán bộ phải tự tra cứu mẫu đơn hoặc gõ lại thông tin công dân lặp đi lặp lại, Trợ lý AI tổng hợp ngữ cảnh hồ sơ (mã số, người nộp, tóm tắt nội dung, phân loại) kết hợp với hướng dẫn tùy chỉnh từ người dùng để sinh ra văn bản nháp chuẩn xác, văn phong hành chính nhà nước, giúp giảm đáng kể thời gian xử lý thủ tục hành chính.

---

## 2. Danh Sách Các Loại Văn Bản Đã Hỗ Trợ

Hệ thống hiện hỗ trợ trọn vẹn **06 loại văn bản nghiệp vụ quan trọng**, được phân loại rõ ràng trên giao diện:

* **Nhóm xử lý bước đầu (Phase 4A):**
  1. **Phiếu xử lý đơn (`PHIEU_XU_LY`)**: Đề xuất lãnh đạo hướng giải quyết đơn thư tiếp nhận.
  2. **Giấy mời làm việc / đối thoại (`GIAY_MOI_LAM_VIEC`)**: Mời công dân và các bên liên quan đến làm việc, xác minh thực địa.
* **Nhóm thông báo thụ lý (Mở rộng Phase 4B):**
  3. **Thông báo thụ lý (`THONG_BAO_THU_LY`)**: Thông báo chính thức cho công dân vụ việc đã đủ điều kiện thụ lý giải quyết theo luật định.
  4. **Thông báo không thụ lý (`THONG_BAO_KHONG_THU_LY`)**: Nêu rõ lý do từ chối thụ lý giải quyết (hết thời hiệu, không đủ điều kiện...).
* **Nhóm chuyển đơn & trả lời (Mở rộng Phase 4B):**
  5. **Văn bản chuyển đơn (`VAN_BAN_CHUYEN_DON`)**: Chuyển đơn thư không thuộc thẩm quyền đến đúng cơ quan/tổ chức có thẩm quyền giải quyết.
  6. **Trả lời công dân dự thảo (`TRA_LOI_CONG_DAN_DU_THAO`)**: Công văn trả lời, giải thích hướng dẫn công dân đối với các phản ánh, kiến nghị.

---

## 3. Danh Sách Các File Chính Đã Sửa Đổi

* **`src/pages/CaseDetail.tsx`**: Bổ sung 4 thẻ lựa chọn mới vào thẻ `<select>` trong khối UI *"📝 Soạn thảo văn bản nháp thông minh"* thuộc tab *"✨ Trợ lý AI"*; cập nhật hàm ánh xạ tiêu đề văn bản tương ứng.
* **`legalflow-backend/src/ai/providers/gemini.provider.ts`**: Nâng cấp logic xử lý LLM Prompt và hàm sinh dữ liệu giả lập (Mock Response) cho 4 mã loại văn bản mới, tuân thủ yêu cầu đính kèm nhãn cảnh báo và vùng giữ chỗ `[Cán bộ bổ sung...]`.
* **`legalflow-backend/src/ai/ai.service.ts`**: Cập nhật logic xử lý `submitFeedback` cho loại `DRAFT`, định nghĩa chuẩn xác các tiền tố khi lưu ghi chú vào hồ sơ.
* **`legalflow-backend/src/ai/ai.service.spec.ts`**: Bổ sung bộ kiểm thử tự động (Unit Tests) xác minh sinh nháp thành công, lưu ghi chú đúng tiền tố cho Thông báo thụ lý / Chuyển đơn và từ chối nháp không tạo note.

---

## 4. Cách Hoạt Động Của AI Drafting & Vùng Giữ Chỗ Placeholder

1. **Thu thập Ngữ cảnh:** Khi cán bộ chọn loại văn bản và nhấn *"✨ Tạo bản nháp AI"*, frontend gửi yêu cầu chứa ID hồ sơ kèm các hướng dẫn bổ sung (nếu có) xuống backend.
2. **Tổng hợp & Sinh văn bản:** Backend tải thông tin hồ sơ (mã số, người gửi, tóm tắt) và truyền cho AI Provider. AI kết hợp ngữ cảnh vụ việc để sinh ra nội dung dự thảo.
3. **Cơ chế chống suy diễn (Hallucination Prevention):** Đối với các thông tin chi tiết mà AI không thể hoặc không được phép tự ý kết luận (như số hiệu công văn, ngày tháng ban hành chính thức, điều khoản luật chi tiết làm căn cứ từ chối, tên cơ quan nhận đơn chuyển cấp), văn bản tự động tạo các vùng giữ chỗ rõ ràng dưới dạng **`[Cán bộ bổ sung...]`** (ví dụ: `[Cán bộ bổ sung số thông báo, ngày tháng ban hành]`, `[Cán bộ bổ sung căn cứ pháp lý cụ thể]`).
4. **Trình bày & Hiệu chỉnh:** Trợ lý AI trả về nội dung dự thảo hiển thị trên ô Textarea. Cán bộ dễ dàng rà soát và gõ đè để hoàn thiện các vùng giữ chỗ này.

---

## 5. Nguyên Tắc Cốt Lõi (Human-in-the-Loop)

Toàn bộ hệ thống tuân thủ 100% nguyên tắc kiểm soát của con người:

1. **AI chỉ hỗ trợ soạn nháp, không tự ban hành:** Cán bộ thụ lý giữ vai trò thẩm định cuối cùng, chịu trách nhiệm rà soát tính chính xác pháp lý trước khi sử dụng văn bản.
2. **Cảnh báo bắt buộc đầu văn bản:** Mọi bản nháp sinh ra đều bắt buộc ghim dòng cảnh báo nổi bật ngay dòng đầu tiên:  
   `--- BẢN NHÁP AI – CHƯA PHÁT HÀNH. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG. ---`
3. **Tuyệt đối không tự phát hành hay gửi cho công dân:** Bản thảo chỉ hiển thị và lưu trữ nội bộ. Hệ thống không tự động gửi email, SMS hay phát hành văn bản bưu chính cho người khiếu nại.
4. **Không tự tạo file Word/PDF:** Trong Phase 4B, văn bản quản lý dưới dạng văn bản thuần (plain text) trong ghi chú hồ sơ, không tự rớt ra file tài liệu hoàn chỉnh để tránh rò rỉ hoặc ban hành nhầm.
5. **Bất biến trạng thái hồ sơ (`LegalCase.status`):** Quá trình tạo, lưu hay hủy bản nháp tuyệt đối không làm thay đổi trạng thái của vụ việc (hồ sơ `NEW` hay `IN_PROGRESS` giữ nguyên 100%).
6. **Bất biến phân công (`assignedToId`):** Hệ thống không tự động thay đổi cán bộ thụ lý hay người được phân công xử lý hồ sơ.

---

## 6. Cơ Chế Lưu Trữ (`CaseNote`) & Kiểm Toán (`AiAuditLog`)

Hệ thống tận dụng hoàn toàn cấu trúc cơ sở dữ liệu hiện có (**không sửa chữa `schema.prisma`**):

* **Cách lưu vào `CaseNote`:** Khi cán bộ nhấn *"💾 Lưu vào ghi chú hồ sơ"*, hệ thống tạo một bản ghi mới trong bảng `CaseNote`. Nội dung ghi chú tự động gắn tiền tố định danh ở dòng đầu tiên:
  - `[AI Dự thảo - Phiếu xử lý đơn]`
  - `[AI Dự thảo - Giấy mời làm việc]`
  - `[AI Dự thảo - Thông báo thụ lý]`
  - `[AI Dự thảo - Thông báo không thụ lý]`
  - `[AI Dự thảo - Văn bản chuyển đơn]`
  - `[AI Dự thảo - Trả lời công dân]`
* **Cách ghi nhật ký `AiAuditLog`:**
  - Mỗi khi bấm tạo nháp, hệ thống ghi vết nhật ký với `action = 'DRAFT'`, `userFeedback = 'PENDING'`.
  - Khi bấm *"💾 Lưu vào ghi chú hồ sơ"*, cập nhật `userFeedback = 'ACCEPTED'`, `appliedAt = NOW()`.
  - Khi bấm *"❌ Không sử dụng bản nháp"*, cập nhật `userFeedback = 'REJECTED'` (đồng thời xóa trắng form, không tạo `CaseNote`).

---

## 7. Quy Trình Kiểm Thử Thủ Công Trên Giao Diện

1. **Đăng nhập:** Mở trình duyệt truy cập `http://localhost:5173`, đăng nhập với tài khoản cán bộ thụ lý.
2. **Chọn hồ sơ:** Mở chi tiết một hồ sơ đơn thư bất kỳ. Ghi nhận trạng thái hiện tại của hồ sơ (ví dụ: `NEW`).
3. **Mở Trợ lý AI:** Chuyển sang tab **"✨ Trợ lý AI"** ở menu bên trái.
4. **Thử nghiệm chọn loại văn bản:** Cuộn xuống khối *"📝 Soạn thảo văn bản nháp thông minh"*, mở dropdown chọn lần lượt 4 loại văn bản mới (ví dụ: *Thông báo thụ lý*).
5. **Nhập hướng dẫn:** Gõ thêm vào ô input (ví dụ: *"Thụ lý ngày 28/06, thời hạn giải quyết 30 ngày"*).
6. **Tạo bản nháp:** Nhấn nút **"✨ Tạo bản nháp AI"**.
7. **Kiểm tra UI:** Xác nhận textarea hiển thị văn bản nháp với dòng nhãn cảnh báo đầu tiên và các vùng giữ chỗ `[Cán bộ bổ sung...]`. Thử gõ chỉnh sửa thay thế các vùng giữ chỗ này.
8. **Lưu ghi chú:** Nhấn nút **"💾 Lưu vào ghi chú hồ sơ"**. Xác nhận hệ thống báo thành công và chuyển hướng sang tab **"Lịch sử xử lý"**.
9. **Xác minh kết quả:** Tại tab Lịch sử xử lý, thấy bản note mới xuất hiện với tiền tố `[AI Dự thảo - Thông báo thụ lý]`. Quay lại tab Thông tin chung, xác nhận trạng thái hồ sơ `status` không thay đổi.
10. **Thử nghiệm từ chối:** Quay lại tab Trợ lý AI, tạo một bản thảo mới rồi nhấn **"❌ Không sử dụng bản nháp"**. Xác nhận form bị xóa trắng và không có ghi chú nào bị tạo nhầm.

---

## 8. Các Lệnh SQL Kiểm Chứng Dữ Liệu (PostgreSQL / Prisma Studio)

Sử dụng các câu lệnh dưới đây để kiểm tra xác minh thực tế dưới cơ sở dữ liệu (thay `<YOUR_CASE_ID>` bằng ID hồ sơ vừa kiểm thử):

### 1. Kiểm tra bảng `CaseNote` (Xác minh lưu đúng tiền tố chuẩn)
```sql
SELECT id, "caseId", "userId", content, "createdAt" 
FROM "CaseNote" 
WHERE "caseId" = '<YOUR_CASE_ID>' 
  AND content LIKE '[AI Dự thảo - %]'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Trả về chính xác các bản thảo văn bản đã bấm lưu kèm tiền tố chuẩn tương ứng, nội dung lưu trọn vẹn những gì cán bộ đã chỉnh sửa.

### 2. Kiểm tra bảng `AiAuditLog` (Xác minh nhật ký kiểm toán)
```sql
SELECT id, "caseId", "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND "action" = 'DRAFT'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Có các bản ghi nhật ký với `action = 'DRAFT'`; trường `userFeedback` thể hiện đúng `ACCEPTED` (nếu lưu note) hoặc `REJECTED` (nếu hủy bỏ).

### 3. Kiểm tra bảng `LegalCase` (Xác minh tính bất biến trạng thái và phân công)
```sql
SELECT id, "caseCode", status, "assignedToId", "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```
*Kết quả kỳ vọng:* Trường `status` và `assignedToId` giữ nguyên 100% giá trị ban đầu trước khi thực hiện kiểm thử.

---

## 9. Giới Hạn Hiện Tại & Rủi Ro Còn Lại

### Giới hạn hiện tại (Chế độ Mock Gemini)
* Khi môi trường backend chưa cấu hình API Key thật (`GEMINI_API_KEY`), hệ thống tự động hoạt động với **Mock Provider** (`gemini-1.5-pro-mock`).
* Ở chế độ giả lập này, văn bản nháp trả về là các mẫu văn bản hành chính tiêu chuẩn được điền tự động thông tin mã hồ sơ, người nộp và tóm tắt vụ việc. Điều này đảm bảo tính độc lập cao, giúp quá trình kiểm thử tự động (CI/CD) và trải nghiệm giao diện người dùng diễn ra mượt mà không phụ thuộc kết nối bên ngoài.

### Rủi ro còn lại & Hướng quản trị
1. **Khác biệt thể thức văn bản địa phương:** Mặc dù AI soạn thảo tuân theo quy chuẩn chung, từng tỉnh/thành phố hoặc UBND cấp xã có thể có cách trình bày căn cứ pháp lý hoặc biểu mẫu đặc thù.  
   👉 *Quản trị:* Cung cấp trình chỉnh sửa Textarea cho phép cán bộ tự do sửa chữa trước khi lưu, kết hợp với các chỉ dẫn bổ sung gửi cho AI.
2. **Sai sót điều khoản pháp lý khi chạy LLM thật:** Mô hình ngôn ngữ lớn (LLM) có nguy cơ dẫn chiếu sai số điều/khoản luật nếu ngữ cảnh truyền vào chưa đủ chi tiết.  
   👉 *Quản trị:* Prompt quy định bắt buộc AI sử dụng vùng giữ chỗ `[Cán bộ bổ sung căn cứ pháp lý cụ thể]` nếu không chắc chắn 100%; nhãn cảnh báo Human-in-the-Loop nhắc nhở cán bộ kiểm chứng với luật định hiện hành.
