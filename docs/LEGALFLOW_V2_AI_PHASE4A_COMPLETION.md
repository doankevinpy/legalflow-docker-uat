# Báo Cáo Hoàn Thành Triển Khai LegalFlow v2 AI – Phase 4A (Soạn Thảo Văn Bản Nháp Thông Minh)

**Phiên bản / Tag:** `v2.2.0-ai-phase4a-drafting`  
**Ngày hoàn thành:** 28/06/2026  

---

## 1. Mục Tiêu Phase 4A

Mục tiêu chính của Phase 4A là trang bị cho cán bộ thụ lý hồ sơ một trợ lý thông minh có khả năng **Tạo bản thảo văn bản nháp nội bộ** phục vụ quá trình giải quyết khiếu nại, tố cáo, kiến nghị, phản ánh. 

Thay vì cán bộ phải tự soạn thảo từ đầu hoặc tra cứu mẫu văn bản và tự điền thông tin hồ sơ thủ công, Trợ lý AI sẽ tự động đọc ngữ cảnh vụ việc (mã hồ sơ, người gửi, tóm tắt nội dung, phân loại) kết hợp với các hướng dẫn tùy chỉnh của cán bộ để sinh ra bản dự thảo chuẩn xác, văn phong hành chính nhà nước.

Việc triển khai phạm vi hẹp Phase 4A giúp tập trung hoàn thiện trải nghiệm kiểm duyệt và chỉnh sửa bản nháp trước khi mở rộng cho các loại văn bản phức tạp hơn trong các giai đoạn tiếp theo.

---

## 2. Các Loại Văn Bản Nháp Đã Hỗ Trợ

Trong phạm vi Phase 4A, hệ thống hỗ trợ 2 loại văn bản nghiệp vụ quan trọng và phổ biến nhất ở cấp xã/phường:

1. **Phiếu xử lý đơn (`PHIEU_XU_LY`)**:
   - Gợi ý mẫu dự thảo phiếu đề xuất xử lý đơn, nêu rõ nguồn gốc đơn, nội dung trình bày tóm tắt và đề xuất hướng xử lý cho lãnh đạo phê duyệt (thụ lý giải quyết hay chuyển cơ quan có thẩm quyền).
2. **Giấy mời làm việc / đối thoại (`GIAY_MOI_LAM_VIEC`)**:
   - Gợi ý mẫu giấy mời công dân hoặc các bên liên quan đến làm việc, ghi rõ thời gian, địa điểm, nội dung làm việc và danh mục tài liệu/giấy tờ mang theo phục vụ xác minh.

---

## 3. Cách Lưu Vào Ghi Chú Hồ Sơ (`CaseNote`)

Để đảm bảo tính lưu vết và khả năng phối hợp giữa các cán bộ xử lý, bản nháp sau khi được duyệt sẽ được lưu trữ trực tiếp vào bảng `CaseNote` của hồ sơ với các quy chuẩn sau:

* **Tiền tố định danh AI**: Nội dung văn bản nháp luôn được tự động gắn tiền tố chuẩn ở dòng đầu tiên:
  - `[AI Dự thảo - Phiếu xử lý đơn]` đối với mẫu Phiếu xử lý đơn.
  - `[AI Dự thảo - Giấy mời làm việc]` đối với mẫu Giấy mời làm việc/đối thoại.
* **Chỉnh sửa toàn diện trước khi lưu**: Cán bộ có thể chỉnh sửa bất kỳ câu từ, căn cứ pháp lý hoặc thông tin nào trong ô trình soạn thảo (textarea) trước khi nhấn nút "💾 Lưu vào ghi chú hồ sơ". Hệ thống sẽ lưu toàn bộ nội dung đã chỉnh sửa vào `CaseNote`.
* **Trợ lý và Lịch sử:** Ngay sau khi lưu thành công, hệ thống chuyển hướng sang tab "Lịch sử xử lý" để cán bộ nhìn thấy bản nháp đã nằm an toàn trong danh sách ghi chú hồ sơ.

---

## 4. Nguyên Tắc Cốt Lõi (Human-in-the-Loop)

Toàn bộ kiến trúc và luồng xử lý của Phase 4A tuân thủ nghiêm ngặt nguyên tắc **Human-in-the-Loop** (Con người kiểm soát và quyết định cuối cùng):

1. **AI chỉ soạn nháp, không ra quyết định:** AI đóng vai trò như một thư ký hỗ trợ chuẩn bị văn bản. Cán bộ thụ lý là người đọc lại, chịu trách nhiệm pháp lý và thẩm định nội dung trước khi sử dụng.
2. **Tuyệt đối không tự phát hành hay gửi văn bản:** Bản nháp AI sinh ra chỉ lưu dưới dạng **Ghi chú nội bộ (`CaseNote`)**. Hệ thống không kết nối với bất kỳ cổng gửi email, SMS hay hệ thống phát hành bưu chính nào để tự động gửi cho công dân.
3. **Tuyệt đối không tự động chuyển trạng thái hồ sơ (`LegalCase.status`):** Thao tác tạo hay chấp nhận bản nháp chỉ thêm thông tin vào ghi chú hồ sơ, giữ nguyên 100% trạng thái hiện tại của vụ việc (ví dụ: hồ sơ đang ở trạng thái `NEW` hoặc `IN_PROGRESS` sẽ giữ nguyên trạng thái đó).
4. **Cảnh báo minh bạch trên UI:** Giao diện luôn hiển thị cảnh báo nổi bật với khung nền vàng: *"⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG"*.
5. **Kiểm toán minh bạch (Audit Logging):** Mọi yêu cầu tạo bản nháp (`DRAFT`) cùng phản hồi của người dùng khi lưu (`ACCEPTED`) hoặc không sử dụng (`REJECTED`) đều được lưu vết chi tiết trong bảng `AiAuditLog`.

---

## 5. Hướng Dẫn Kiểm Thử Thủ Công Trên Giao Diện

1. **Đăng nhập hệ thống:** Truy cập `http://localhost:5173` và đăng nhập với tài khoản cán bộ có thẩm quyền (`STAFF`, `MANAGER`, hoặc `ADMIN`).
2. **Mở chi tiết hồ sơ:** Chọn một hồ sơ đơn thư bất kỳ (chú ý ghi nhớ trạng thái hiện tại của hồ sơ, ví dụ `NEW`).
3. **Chuyển sang tab AI:** Nhấn chọn tab **"✨ Trợ lý AI"** ở cột menu bên trái.
4. **Tìm khối soạn thảo:** Cuộn xuống dưới khối gợi ý checklist sẽ thấy khối **"📝 Soạn thảo văn bản nháp thông minh"**.
5. **Chọn loại văn bản & Nhập chỉ dẫn:**
   - Chọn loại văn bản: *Phiếu xử lý đơn* hoặc *Giấy mời làm việc / đối thoại*.
   - Nhập hướng dẫn bổ sung cho AI (ví dụ: *"Mời làm việc lúc 8h00 sáng thứ Sáu tuần này, yêu cầu mang theo bản gốc GCNQSDĐ"*).
6. **Tạo bản nháp:** Nhấn nút **"✨ Tạo bản nháp AI"**. Chờ 1-2 giây để hệ thống sinh văn bản.
7. **Kiểm tra và Chỉnh sửa:** Quan sát khung soạn thảo xuất hiện với nhãn *"Chưa phát hành"*. Thử gõ bổ sung hoặc chỉnh sửa một vài từ trong vùng textarea.
8. **Lưu bản nháp:** Nhấn nút **"💾 Lưu vào ghi chú hồ sơ"**. Hệ thống hiển thị thông báo thành công và tự động chuyển sang tab **"Lịch sử xử lý"**.
9. **Xác minh kết quả:**
   - Tại tab Lịch sử xử lý / Ghi chú, nhìn thấy bản note mới xuất hiện với tiền tố `[AI Dự thảo - Phiếu xử lý đơn]` hoặc `[AI Dự thảo - Giấy mời làm việc]`.
   - Kiểm tra thông tin chung của hồ sơ, xác định trạng thái hồ sơ (`status`) không bị thay đổi.
10. **Kiểm thử từ chối:** Quay lại tab Trợ lý AI, tạo một bản nháp mới rồi nhấn nút **"❌ Không sử dụng bản nháp"**. Xác nhận bản nháp bị hủy bỏ và không tạo thêm ghi chú nào.

---

## 6. Lệnh SQL Kiểm Chứng Dữ Liệu (PostgreSQL / Prisma Studio)

Sử dụng các lệnh SQL dưới đây để kiểm tra xác minh thực tế dưới tầng cơ sở dữ liệu (thay `<YOUR_CASE_ID>` bằng ID hồ sơ bạn vừa test):

### 1. Kiểm tra bảng `CaseNote` (Đảm bảo bản nháp được lưu kèm tiền tố chuẩn)
```sql
SELECT id, "caseId", "userId", content, "createdAt" 
FROM "CaseNote" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND content LIKE '[AI Dự thảo - %]'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Trả về bản ghi ghi chú chứa chính xác nội dung văn bản cán bộ đã lưu kèm tiền tố định danh.

### 2. Kiểm tra bảng `AiAuditLog` (Đảm bảo ghi vết kiểm toán DRAFT đầy đủ)
```sql
SELECT id, "caseId", "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND "action" = 'DRAFT'
ORDER BY "createdAt" DESC;
```
*Kết quả kỳ vọng:* Có bản ghi với `action = 'DRAFT'`, `userFeedback = 'ACCEPTED'` (nếu đã lưu vào ghi chú) hoặc `'REJECTED'` (nếu nhấn không sử dụng).

### 3. Kiểm tra bảng `LegalCase` (Đảm bảo trạng thái hồ sơ bất biến)
```sql
SELECT id, "caseCode", status, "assignedToId", "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```
*Kết quả kỳ vọng:* Trường `status` không thay đổi so với trước khi sử dụng trợ lý AI soạn thảo.

---

## 7. Giới Hạn Hiện Tại & Rủi Ro Còn Lại

### Giới hạn hiện tại (Chế độ Mock Gemini)
* Khi chưa cấu hình API Key thật (`GEMINI_API_KEY`) trong `.env` backend, hệ thống sử dụng **Mock Provider** (`gemini-1.5-pro-mock`).
* Ở chế độ Mock, văn bản nháp trả về là mẫu văn bản hành chính chuẩn được điền tự động thông tin mã hồ sơ, người gửi và nội dung tóm tắt. Điều này giúp đảm bảo toàn bộ luồng UI/UX và kiểm thử tích hợp hoạt động độc lập không phụ thuộc bên thứ ba.

### Rủi ro còn lại & Hướng quản trị
1. **Sai lệch thể thức hoặc số/ký hiệu văn bản:** LLM có thể tự bịa ra số hiệu văn bản hoặc các căn cứ pháp lý đã hết hiệu lực.  
   👉 *Quản trị:* Thiết kế cung cấp trình chỉnh sửa textarea đầy đủ, kết hợp nhãn cảnh báo bắt buộc cán bộ kiểm tra kỹ trước khi ký/trình duyệt.
2. **Nguy cơ rò rỉ thông tin cá nhân (PII):** Khi gửi nội dung đơn thư cho LLM xử lý, thông tin nhạy cảm của công dân có thể bị truyền tải ra ngoài (nếu dùng cloud API public).  
   👉 *Quản trị:* Hệ thống thiết kế theo cơ chế mô-đun (`IAiProvider`), sẵn sàng tích hợp với các mô hình LLM nội bộ (On-premise / Private Cloud) khi triển khai thực tế cho cơ quan nhà nước.
3. **Phạm vi hỗ trợ:** Hiện tại Phase 4A mới hỗ trợ 2 mẫu văn bản cơ bản.  
   👉 *Quản trị:* Sẽ tiếp tục mở rộng cho Thông báo thụ lý, Văn bản chuyển đơn và Nội dung trả lời công dân trong Phase 4B theo đúng kế hoạch.
