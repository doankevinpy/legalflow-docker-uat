# Hướng Dẫn Chuẩn Bị Dữ Liệu Mẫu & Kịch Bản Demo – LegalFlow AI

**Phiên bản hệ thống:** `v2.2.3-ai-uat-demo-ready`  
**Ngày phát hành:** 28/06/2026  
**Mục đích:** Tài liệu hướng dẫn tạo dữ liệu mẫu chuẩn và kịch bản thao tác chi tiết để phục vụ trình diễn (Demo) phân hệ Trợ lý Thông minh LegalFlow AI trước Lãnh đạo và Hội đồng thẩm định.

---

## 1. Mục Tiêu Của Hồ Sơ Mẫu Demo

Hồ sơ mẫu demo được xây dựng khoa học, sát với thực tiễn cơ sở nhằm:
* **Tạo bối cảnh nghiệp vụ chân thực:** Giúp người xem (lãnh đạo, cán bộ tiếp công dân, chuyên viên địa chính) dễ dàng liên hệ với công việc xử lý đơn thư hàng ngày tại UBND cấp xã/phường.
* **Đảm bảo tính ổn định khi trình diễn:** Dữ liệu chuẩn xác giúp các tính năng AI (Phân tích, Gợi ý Checklist, Soạn thảo văn bản) phát huy tối đa độ thông minh, trả về kết quả sắc nét, thuyết phục 100%.
* **Minh chứng rõ ràng các điểm kiểm soát:** Tạo cơ hội để trình diễn rõ nét nguyên tắc **Human-in-the-Loop** (cảnh báo bản nháp, placeholder giữ chỗ, bất biến trạng thái và ghi vết kiểm toán).

---

## 2. Mẫu Nội Dung Đơn Thư Đất Đai Dùng Để Demo

Để chuẩn bị cho buổi demo, cán bộ tạo mới một hồ sơ trên hệ thống với nội dung đơn khiếu nại tranh chấp ranh giới đất đai điển hình sau đây:

> **Tiêu đề đơn:** Đơn kiến nghị giải quyết tranh chấp ranh giới đất ở và hành vi xây dựng lấn chiếm lối đi chung tại Thôn 3, xã Bình Minh.  
> 
> **Kính gửi:** UBND xã Bình Minh, huyện Thanh Oai, thành phố Hà Nội.  
> 
> **Tôi tên là:** Nguyễn Văn An, sinh năm 1975.  
> **CCCD số:** 001075012345, cấp ngày 15/04/2021 tại Cục Cảnh sát QLHC về TTXH.  
> **Địa chỉ thường trú:** Thôn 3, xã Bình Minh, huyện Thanh Oai, TP. Hà Nội.  
> **Số điện thoại liên hệ:** 0987.654.321.  
> 
> **Nội dung sự việc:**  
> Gia đình tôi sử dụng thửa đất số 45, tờ bản đồ số 12 tại Thôn 3, xã Bình Minh đã được cấp Giấy chứng nhận QSDĐ năm 2015, sử dụng ổn định không tranh chấp. Giáp ranh phía Đông nhà tôi là hộ gia đình ông Trần Văn Bình (sử dụng thửa đất số 46).  
> Ngày 20/06/2026, ông Bình tiến hành khởi công xây dựng tường rào kiên cố. Quá trình thi công, ông Bình đã tự ý đào móng lấn sang phần đất của gia đình tôi khoảng 0,5 mét chiều ngang dọc theo chiều dài 15 mét của thửa đất, đồng thời đổ phế liệu xây dựng lấp kín lối đi chung của 4 hộ dân trong ngõ. Gia đình tôi và các hộ xung quanh đã nhiều lần góp ý, yêu cầu dừng thi công để đo đạc lại ranh giới nhưng ông Bình có thái độ bất hợp tác và tiếp tục xây dựng.  
> 
> **Yêu cầu giải quyết:**  
> Kính đề nghị UBND xã Bình Minh và cán bộ Địa chính khẩn trương tiến hành kiểm tra thực địa, lập biên bản yêu cầu hộ ông Trần Văn Bình đình chỉ ngay thi công xây dựng trái phép; đồng thời tổ chức hòa giải tranh chấp ranh giới đất đai và buộc ông Bình khôi phục lại hiện trạng lối đi chung cho các hộ dân theo đúng quy định của pháp luật.

---

## 3. Gợi Ý Thông Tin Cấu Hình Hồ Sơ Mẫu

Khi tạo hồ sơ mẫu trong hệ thống LegalFlow, thiết lập các tham số đầu vào như sau:
* **Lĩnh vực giải quyết (`field`):** Đất đai (`DAT_DAI`)
* **Loại đơn ban đầu (`caseType`):** Kiến nghị / Phản ánh (`PA`) hoặc Khiếu nại (`KN`)
* **Trạng thái ban đầu (`status`):** Mới tiếp nhận (`NEW`)
* **Nội dung yêu cầu của công dân:** Điền toàn bộ đoạn văn bản ở Mục 2.
* **Cán bộ xử lý demo (`assignedToId`):** Tài khoản cán bộ thụ lý đang dùng để thuyết trình (ví dụ: `canbo_diachinh@local.dev` hoặc Nguyễn Văn Thụ Lý).

---

## 4. Kịch Bản Demo Sử Dụng Hồ Sơ Mẫu

Dẫn dắt buổi trình diễn qua 8 thao tác tiêu chuẩn trên hồ sơ mẫu:

### Bước 1: AI Tóm tắt & Phân loại đơn
* Mở hồ sơ mẫu vừa tạo, nhấn sang tab **"✨ Trợ lý AI"**.
* Nhấn nút **"✨ AI Phân tích Đơn"**.
* *Khán giả quan sát:* AI tự động bóc tách tóm tắt ngắn gọn vụ việc tranh chấp móng tường rào, nhận diện chuẩn xác lĩnh vực Đất đai (`DAT_DAI`) và loại đơn.

### Bước 2: Chấp nhận / Từ chối gợi ý
* Thuyết minh về quyền quyết định của con người: thử nhấn **"✔️ Chấp nhận đề xuất"** để điền tóm tắt vào hồ sơ.
* *Khán giả quan sát:* Thông tin chung được cập nhật, hệ thống ghi nhận audit log `ACCEPTED`, trạng thái hồ sơ vẫn là `NEW`.

### Bước 3: Tạo Checklist nghiệp vụ
* Cuộn xuống khối *"📋 Đề xuất Quy trình & Checklist xử lý đơn"*, nhấn **"✨ AI Gợi ý Quy trình Xử lý"**.
* *Khán giả quan sát:* Lưới 6 nhóm nghiệp vụ hiện ra (Việc cần làm, Tài liệu kiểm tra, Bộ phận phối hợp, Thời hạn lưu ý, Rủi ro pháp lý, Đề xuất bước tiếp theo). Toàn bộ được gắn tiền tố chuẩn `[AI - ...]`.

### Bước 4: Áp dụng Checklist vào hồ sơ
* Tick chọn 3 mục quan trọng: *(1) Kiểm tra GCN QSDĐ hai hộ, (2) Phối hợp Trưởng thôn 3 kiểm tra thực địa, (3) Mời hai bên lên hòa giải đất đai*. Nhấn **"✔️ Áp dụng checklist vào hồ sơ"**.
* *Khán giả quan sát:* Hệ thống tự động chuyển sang tab **Checklist** hiển thị danh sách công việc đã chọn để theo dõi tiến độ.

### Bước 5: Tạo bản nháp Phiếu xử lý đơn
* Quay lại tab Trợ lý AI, cuộn xuống khối *"Soạn thảo văn bản nháp thông minh"*.
* Chọn loại văn bản: **Phiếu xử lý đơn (`PHIEU_XU_LY`)**, nhấn **"✨ Tạo bản nháp AI"**.
* *Khán giả quan sát:* Khung trình soạn thảo hiển thị tờ trình đề xuất lãnh đạo thụ lý vụ việc. Cán bộ rà soát và lưu ý nhãn cảnh báo đầu văn bản.

### Bước 6: Tạo bản nháp Thông báo thụ lý (hoặc Văn bản chuyển đơn)
* Chọn tiếp loại văn bản: **Thông báo thụ lý (`THONG_BAO_THU_LY`)**. Gõ thêm chỉ dẫn: *"Thụ lý giải quyết trong thời hạn 30 ngày kể từ ngày ký"*. Nhấn **"✨ Tạo bản nháp AI"**.
* *Khán giả quan sát:* Textarea sinh ra mẫu thông báo thụ lý gửi ông Nguyễn Văn An. Cán bộ thực hiện gõ bổ sung vào vùng giữ chỗ `[Cán bộ bổ sung số thông báo]`.

### Bước 7: Lưu vào Ghi chú hồ sơ (`CaseNote`)
* Nhấn nút **"💾 Lưu vào ghi chú hồ sơ"**.
* *Khán giả quan sát:* Hệ thống chuyển hướng sang tab **Lịch sử xử lý**. Bản thảo vừa soạn xuất hiện an toàn trong danh sách ghi chú với tiền tố `[AI Dự thảo - Thông báo thụ lý]`. Khẳng định văn bản CHƯA PHÁT HÀNH.

### Bước 8: Kiểm tra Nhật ký kiểm toán (`AiAuditLog`)
* Mở màn hình quản trị hoặc trình chiếu bảng truy vấn SQL.
* *Khán giả quan sát:* Toàn bộ chuỗi thao tác từ Bước 1 đến Bước 7 đều được lưu vết thời gian thực với các trạng thái phản hồi `ACCEPTED` hoặc `REJECTED`.

---

## 5. Các Điểm Nóng Cần Nhấn Mạnh & Quan Sát Khi Demo

Trong quá trình thao tác, người thuyết trình cần chủ động chỉ tay hoặc bôi đen trên màn hình để lãnh đạo quan sát thấy **05 minh chứng bảo mật tuyệt đối**:

1. ⚠️ **Nhãn cảnh báo bản nháp luôn hiện diện:** Dòng đầu tiên của ô Textarea luôn ghim dòng chữ cảnh báo nổi bật:  
   `--- BẢN NHÁP AI – CHƯA PHÁT HÀNH. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG. ---`
2. 📝 **Vùng giữ chỗ chống suy diễn (`[Cán bộ bổ sung...]`):** AI không bao giờ tự bịa đặt số công văn hay ngày ban hành, mà luôn tạo ra các đoạn vùng trống rõ ràng yêu cầu con người nhập liệu.
3. 🔒 **Trạng thái hồ sơ (`status`) bất biến:** Từ đầu đến cuối buổi demo, trạng thái hồ sơ không hề bị AI tự ý chuyển từ `NEW` sang `IN_PROGRESS` hay `CLOSED`.
4. 👤 **Phân công cán bộ (`assignedToId`) bất biến:** Hồ sơ vẫn thuộc quyền xử lý của chuyên viên được giao ban đầu, AI không có quyền tự điều chuyển.
5. 📊 **Kiểm toán minh bạch (`AiAuditLog`):** Mọi cú nhấp chuột chấp nhận (`ACCEPTED`) hay hủy bỏ (`REJECTED`) đều để lại dấu vết kiểm toán có thể tra cứu 100%.

---

## 6. Checklist Kiểm Tra Kỹ Thuật Trước Giờ Demo (Pre-flight Checklist)

Trước khi bước vào buổi trình diễn chính thức 15-30 phút, chuyên viên kỹ thuật cần rà soát nhanh bảng kiểm kiểm tra sau:

- [ ] **Hệ thống Docker:** Các container (Database PostgreSQL, Backend NestJS, Frontend Vite) đều đang chạy ổn định (`docker ps`).
- [ ] **Kết nối Dịch vụ:** Backend API trả lời tốt tại port `3000`, Frontend web app truy cập mượt mà tại port `5173`.
- [ ] **Đăng nhập Tài khoản:** Đăng nhập thành công vào giao diện web bằng tài khoản cán bộ thụ lý chuẩn bị demo.
- [ ] **Dữ liệu Mẫu:** Đã tạo sẵn ít nhất 01 hồ sơ khiếu nại đất đai mẫu theo đúng nội dung ở Mục 2, trạng thái `NEW`.
- [ ] **Khả năng hiển thị UI:** Mở hồ sơ mẫu, kiểm tra tab **"✨ Trợ lý AI"** tải lên đầy đủ các khối chức năng.
- [ ] **Kiểm tra Soạn thảo:** Thử bấm nút *"✨ Tạo bản nháp AI"* để xác nhận AI (hoặc Mock Gemini provider) phản hồi cực nhanh dưới 2 giây.
- [ ] **Kết nối Công cụ SQL:** Mở sẵn Prisma Studio (`npx prisma studio`) hoặc DBeaver/pgAdmin kết nối vào DB để sẵn sàng trình diễn kiểm toán log khi Lãnh đạo yêu cầu.
