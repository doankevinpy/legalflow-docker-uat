# Kịch bản Demo/UAT LegalFlow AI

**Phiên bản hệ thống:** `v2.2.2-ai-phase4b-complete`  
**Ngày phát hành:** 28/06/2026  
**Mục đích:** Tài liệu kịch bản trình diễn (Demo) và bảng kiểm thử chấp nhận người dùng (UAT) cho phân hệ Trợ lý Thông minh LegalFlow AI.

---

## 1. Mục Tiêu Demo

Buổi trình diễn và kiểm thử UAT LegalFlow AI nhằm chứng minh với Hội đồng thẩm định và Lãnh đạo cơ quan các mục tiêu then chốt sau:
* **Chứng minh AI hỗ trợ cán bộ xử lý đơn thư:** Giảm tải gánh nặng hành chính bằng cách tự động đọc hiểu, tóm tắt, phân loại đơn, gợi ý quy trình thụ lý và soạn thảo thảo văn bản nháp.
* **Chứng minh nguyên tắc Human-in-the-Loop:** Cán bộ luôn là người kiểm duyệt, chỉnh sửa và quyết định cuối cùng; AI không thay thế con người.
* **Chứng minh lưu vết kiểm toán (Audit Log):** Mọi hành động tiếp nhận hay từ chối gợi ý của AI đều được ghi vết chi tiết, đảm bảo tính minh bạch và trách nhiệm giải trình.
* **Chứng minh AI không tự ra quyết định, không tự phát hành văn bản:** Hệ thống tuyệt đối không tự động thay đổi trạng thái hồ sơ, không tự phân công nhiệm vụ và không gửi văn bản hay email ra bên ngoài cho công dân.

---

## 2. Tóm Tắt Các Phase Đã Hoàn Thành

Hệ thống LegalFlow AI đã hoàn tất triển khai và nghiệm thu qua 5 giai đoạn chặt chẽ:
* **Phase 1:** Xây dựng nền tảng đa phương thức AI (AI Backend Provider), dịch vụ Prompt Builder và hệ thống lưu vết nhật ký kiểm toán `AiAuditLog`.
* **Phase 2:** AI Tóm tắt và Phân loại đơn thư (tự động nhận diện ý chính, loại đơn khiếu nại/tố cáo/kiến nghị và lĩnh vực giải quyết); ghi nhận feedback người dùng.
* **Phase 3:** AI Checklist & Gợi ý quy trình xử lý theo 6 nhóm nghiệp vụ chuẩn (Việc cần làm, Tài liệu, Phối hợp, Thời hạn, Rủi ro, Bước tiếp theo); cho phép tick chọn từng mục áp dụng vào hồ sơ kèm tiền tố `[AI - ...]`.
* **Phase 4A:** AI Soạn thảo văn bản nháp nội bộ bước đầu cho 2 biểu mẫu phổ biến: **Phiếu xử lý đơn** và **Giấy mời làm việc/đối thoại**; lưu trữ an toàn vào bảng `CaseNote`.
* **Phase 4B:** Mở rộng AI Soạn thảo thêm 4 loại văn bản phức tạp: **Thông báo thụ lý**, **Thông báo không thụ lý**, **Văn bản chuyển đơn** và **Trả lời công dân dự thảo** kèm các vùng giữ chỗ `[Cán bộ bổ sung...]` chống suy diễn.

---

## 3. Thông Điệp Trình Bày Với Lãnh Đạo

> 🎯 **"LegalFlow AI không thay thế cán bộ xử lý đơn. Hệ thống hỗ trợ đọc nhanh, tóm tắt, phân loại, gợi ý checklist và tạo bản nháp văn bản. Cán bộ vẫn kiểm tra, chỉnh sửa, quyết định và chịu trách nhiệm. Mọi thao tác chấp nhận/từ chối đều được ghi nhận bằng audit log."**

Khi trình bày với Lãnh đạo UBND và các phòng ban nghiệp vụ, cần nhấn mạnh 6 cam kết an toàn:
1. **AI chỉ hỗ trợ:** Làm công cụ trợ lý hành chính giúp đọc nhanh và soạn thảo sơ bộ.
2. **Cán bộ quyết định:** Người thụ lý là chuyên gia pháp lý thẩm định lần cuối trước khi trình ký.
3. **Không tự gửi văn bản:** Không có bất kỳ email, SMS hay văn bản nào tự động gửi cho công dân.
4. **Không tự phát hành:** Bản thảo tạo ra là ghi chú nội bộ, chưa phải văn bản chính thức có dấu.
5. **Không tự đổi trạng thái:** Trạng thái hồ sơ (`LegalCase.status`) giữ nguyên 100% qua các bước dùng AI.
6. **Có kiểm toán đầy đủ:** Hệ thống lưu nhật ký từng thao tác tiếp nhận/từ chối để phục vụ thanh tra, rà soát.

---

## 4. Kịch Bản Demo Một Hồ Sơ Đất Đai Từ Đầu Đến Cuối

Kịch bản thực hiện liền mạch trên một hồ sơ khiếu nại tranh chấp ranh giới đất đai đang ở trạng thái *Mới tiếp nhận (`NEW`)*:

1. **Mở hồ sơ:** Đăng nhập hệ thống (`http://localhost:5173`), mở chi tiết hồ sơ đơn thư đất đai. Chỉ cho người xem thấy trạng thái hồ sơ đang là `NEW` và cán bộ thụ lý được giao.
2. **AI tóm tắt/phân loại:** Chuyển sang tab **"✨ Trợ lý AI"**, nhấn nút **"✨ AI Phân tích Đơn"**. Hệ thống hiển thị tóm tắt ngắn gọn, phân loại loại đơn (`KN`), lĩnh vực (`DAT_DAI`) và độ tin cậy.
3. **Cán bộ chấp nhận/từ chối:** Cán bộ kiểm tra lại đơn gốc, nhấn **"✔️ Chấp nhận đề xuất"**. Dữ liệu được điền tự động vào form thông tin chung mà không làm đổi trạng thái hồ sơ. (Thuyết minh thêm: nếu bấm từ chối thì hệ thống hủy gợi ý và ghi log `REJECTED`).
4. **AI gợi ý checklist:** Cuộn xuống khối Đề xuất quy trình, nhấn **"✨ AI Gợi ý Quy trình Xử lý"**. Lưới 6 nhóm nghiệp vụ hiện ra với các đầu việc gắn tiền tố `[AI - Việc cần làm]`, `[AI - Tài liệu]`...
5. **Cán bộ áp dụng checklist:** Tick chọn 3 đầu việc cần thực hiện thực tế tại xã, bỏ qua các mục không liên quan, nhấn **"✔️ Áp dụng checklist vào hồ sơ"**. Trình duyệt tự động chuyển sang tab **"Checklist"** để cho thấy các đầu việc đã nằm trong danh sách theo dõi.
6. **AI tạo bản nháp văn bản:** Quay lại tab Trợ lý AI, chọn loại văn bản **Giấy mời làm việc / đối thoại**, gõ chỉ dẫn: *"Mời làm việc 8h30 sáng thứ Sáu, mang theo sổ đỏ gốc"*, nhấn **"✨ Tạo bản nháp AI"**.
7. **Cán bộ chỉnh sửa và lưu vào ghi chú:** Khung trình soạn thảo hiện ra với dòng cảnh báo bắt buộc *"BẢN NHÁP AI – CHƯA PHÁT HÀNH"*. Cán bộ gõ sửa trực tiếp thông tin vào vùng giữ chỗ `[Cán bộ bổ sung số công văn]`. Nhấn **"💾 Lưu vào ghi chú hồ sơ"**. Hệ thống chuyển sang tab **"Lịch sử xử lý"** thấy bản note mới xuất hiện với tiền tố `[AI Dự thảo - Giấy mời làm việc]`.
8. **Kiểm tra audit log:** Mở giao diện quản trị hoặc truy vấn cơ sở dữ liệu để chiếu cho lãnh đạo xem toàn bộ nhật ký `AiAuditLog` vừa ghi nhận chính xác thời gian và hành động `ACCEPTED` của người dùng.

---

## 5. Bảng Checklist UAT

| STT | Chức năng cần test | Thao tác test | Kết quả mong muốn | Đạt/Chưa đạt | Ghi chú |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | Phân tích đơn AI | Vào tab Trợ lý AI $\rightarrow$ Nhấn *"✨ AI Phân tích Đơn"* | Hiển thị tóm tắt, loại đơn, lĩnh vực kèm nhãn cảnh báo Human-in-the-Loop. | [ ] | |
| **2** | Chấp nhận tóm tắt | Nhấn *"✔️ Chấp nhận đề xuất"* | Cập nhật tóm tắt, loại đơn vào hồ sơ. Ghi log `ACCEPTED`. Trạng thái giữ nguyên. | [ ] | |
| **3** | Từ chối tóm tắt | Nhấn *"❌ Từ chối đề xuất"* | Hủy gợi ý trên UI, form giữ nguyên. Ghi log `REJECTED`. | [ ] | |
| **4** | Gợi ý checklist AI | Nhấn *"✨ AI Gợi ý Quy trình Xử lý"* | Hiển thị 6 nhóm nghiệp vụ với tiền tố `[AI - ...]`. Có hộp kiểm tick chọn từng mục. | [ ] | |
| **5** | Áp dụng checklist | Tick chọn 2-3 mục $\rightarrow$ Nhấn *"✔️ Áp dụng checklist vào hồ sơ"* | Các mục đã chọn xuất hiện bên tab Checklist. Ghi log `ACCEPTED`. Không tạo mục trùng lặp. | [ ] | |
| **6** | Danh sách Draft Type | Mở dropdown trong khối *"Soạn thảo văn bản nháp thông minh"* | Hiển thị đầy đủ 6 loại: Phiếu xử lý, Giấy mời, TB Thụ lý, TB Không thụ lý, VB Chuyển đơn, Trả lời CD. | [ ] | |
| **7** | Tạo bản nháp AI | Chọn 1 loại văn bản $\rightarrow$ Nhập hướng dẫn $\rightarrow$ Nhấn *"✨ Tạo bản nháp AI"* | Textarea hiển thị nội dung nháp có dòng cảnh báo đầu tiên và các vùng `[Cán bộ bổ sung...]`. | [ ] | |
| **8** | Chỉnh sửa & Lưu nháp | Gõ sửa Textarea $\rightarrow$ Nhấn *"💾 Lưu vào ghi chú hồ sơ"* | Tạo bản ghi trong `CaseNote` đúng tiền tố (`[AI Dự thảo - ...]`). Chuyển sang tab Lịch sử. Ghi log `ACCEPTED`. | [ ] | |
| **9** | Từ chối bản nháp | Tạo nháp mới $\rightarrow$ Nhấn *"❌ Không sử dụng bản nháp"* | Textarea bị xóa trắng. Ghi log `REJECTED`. Không tạo `CaseNote`. | [ ] | |
| **10** | Bất biến trạng thái & quyền | Kiểm tra thông tin hồ sơ sau các bước trên | `LegalCase.status` và `assignedToId` giữ nguyên 100% như trước khi test. Không tự phát hành văn bản. | [ ] | |

---

## 6. Các Lệnh SQL Kiểm Chứng Nhanh

Sử dụng các câu lệnh sau dưới PostgreSQL / Prisma Studio để nghiệm thu tầng dữ liệu (thay `<YOUR_CASE_ID>` bằng ID hồ sơ test):

### 1. Kiểm tra Nhật ký kiểm toán AI (`AiAuditLog`)
```sql
SELECT id, "caseId", "action", "modelName", "userFeedback", "appliedAt", "createdAt" 
FROM "AiAuditLog" 
WHERE "caseId" = '<YOUR_CASE_ID>'
ORDER BY "createdAt" DESC;
```

### 2. Kiểm tra Checklist nghiệp vụ (`CaseChecklistItem`)
```sql
SELECT id, "caseId", title, "isCompleted", "createdAt" 
FROM "CaseChecklistItem" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND title LIKE '[AI - %]'
ORDER BY "createdAt" DESC;
```

### 3. Kiểm tra Ghi chú bản nháp (`CaseNote`)
```sql
SELECT id, "caseId", "userId", content, "createdAt" 
FROM "CaseNote" 
WHERE "caseId" = '<YOUR_CASE_ID>' AND content LIKE '[AI Dự thảo - %]'
ORDER BY "createdAt" DESC;
```

### 4. Kiểm tra Trạng thái hồ sơ (`LegalCase.status`)
```sql
SELECT id, "caseCode", status, "updatedAt" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```

### 5. Kiểm tra Phân công thụ lý (`assignedToId`)
```sql
SELECT id, "caseCode", "assignedToId" 
FROM "LegalCase" 
WHERE id = '<YOUR_CASE_ID>';
```

---

## 7. Rủi Ro Còn Lại & Khuyến Nghị Triển Khai

* **Chế độ Giả lập (Mock Gemini):** Hiện tại hệ thống đang tự động hoạt động ở chế độ giả lập (`gemini-1.5-pro-mock`) nếu chưa cấu hình biến môi trường `GEMINI_API_KEY` trong `.env`. Chế độ này sinh dữ liệu mẫu chuẩn hóa để phục vụ test/demo mượt mà không phụ thuộc mạng ngoại bộ. Khi dùng thật cần bổ sung API key hợp lệ.
* **Bản chất văn bản AI:** Văn bản do AI sinh ra chỉ mang tính chất là **bản nháp hỗ trợ nội bộ**.
* **Kiểm tra thể thức & căn cứ pháp lý:** Cán bộ thụ lý bắt buộc phải kiểm tra kỹ thể thức hành chính, số hiệu văn bản và thẩm định độ chính xác của các điều khoản luật được viện dẫn trước khi ký ban hành.
* **Phân quyền chặt chẽ:** Khi triển khai thực tế trên môi trường Production, cần cấu hình phân quyền RBAC chặt chẽ, chỉ cho phép chuyên viên thụ lý được phân công hoặc lãnh đạo trực tiếp mới có quyền áp dụng gợi ý và lưu bản nháp vào hồ sơ.
