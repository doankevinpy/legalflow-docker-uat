# Phiếu Ghi Nhận Kết Quả Kiểm Thử UAT LegalFlow AI

> [!IMPORTANT]
> **LƯU Ý CỐT LÕI VỀ NGUYÊN TẮC HUMAN-IN-THE-LOOP:**  
> 1. **LegalFlow AI chỉ hỗ trợ cán bộ thụ lý**, đóng vai trò công cụ trợ lý hành chính giúp làm nhanh các khâu đọc hiểu, tổng hợp và soạn thảo ban đầu.  
> 2. **Hệ thống tuyệt đối không thay thế quyết định chuyên môn** của con người. Trạng thái hồ sơ (`status`), phân công cán bộ (`assignedToId`) và hướng giải quyết pháp lý luôn do con người kiểm soát.  
> 3. **Bản nháp do AI tạo ra chưa phải là văn bản phát hành chính thức**, không có giá trị pháp lý ra bên ngoài.  
> 4. **Cán bộ thụ lý bắt buộc phải rà soát, kiểm tra, chỉnh sửa bổ sung** các thông tin chi tiết (căn cứ luật, số công văn...) và hoàn toàn chịu trách nhiệm trước pháp luật trước khi ký ban hành hoặc sử dụng.

---

## I. Thông Tin Buổi Kiểm Thử

* **Ngày kiểm thử:** ...../...../2026  
* **Họ và tên người kiểm thử:** ............................................................................................  
* **Vai trò / Chức vụ:** [ ] Lãnh đạo UBND   [ ] Cán bộ Tiếp công dân   [ ] Chuyên viên Địa chính - Tư pháp   [ ] Chuyên viên IT/Kiểm thử  
* **Hồ sơ mẫu sử dụng:** Hồ sơ tranh chấp đất đai mẫu (Theo hướng dẫn tại `docs/LEGALFLOW_DEMO_SAMPLE_CASE_GUIDE.md`)  
* **Phiên bản hệ thống:** `v2.2.4-ai-demo-package`  

---

## II. Bảng Đánh Giá Chức Năng

*(Đánh dấu **[x]** vào ô Đạt/Chưa đạt và ghi thang điểm hài lòng từ **1 - 5**, trong đó 5 là Rất hài lòng)*

| STT | Nhóm chức năng | Thao tác kiểm thử | Kết quả mong muốn | Đạt / Chưa đạt | Mức độ hài lòng (1-5) | Góp ý / Đề xuất cải tiến |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | Đăng nhập hệ thống | Truy cập cổng web, nhập tài khoản và mật khẩu | Đăng nhập thành công vào giao diện quản trị LegalFlow. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **2** | Mở hồ sơ đơn thư | Chọn hồ sơ khiếu nại đất đai ở trạng thái `NEW` | Mở được trang chi tiết hồ sơ, hiển thị đầy đủ thông tin chung. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **3** | AI tóm tắt nội dung đơn | Chuyển tab Trợ lý AI $\rightarrow$ Nhấn *"✨ AI Phân tích Đơn"* | Hiển thị đoạn tóm tắt xúc tích, chính xác nội dung đơn thư. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **4** | AI phân loại đơn | Quan sát kết quả phân tích loại đơn và lĩnh vực | Nhận diện đúng lĩnh vực Đất đai (`DAT_DAI`) và loại đơn (`KN`/`PA`). | [ ] Đạt<br>[ ] Chưa | ..... | |
| **5** | Chấp nhận/từ chối gợi ý AI | Thử nhấn *"✔️ Chấp nhận"* và *"❌ Từ chối"* | Chấp nhận điền thông tin vào hồ sơ; Từ chối không ghi đè form. Log ghi `ACCEPTED`/`REJECTED`. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **6** | AI gợi ý checklist xử lý | Cuộn xuống khối Checklist $\rightarrow$ Nhấn *"✨ AI Gợi ý Quy trình"* | Trả về lưới 6 nhóm nghiệp vụ với tiền tố `[AI - ...]`. Có hộp kiểm tick chọn. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **7** | Áp dụng checklist | Tick chọn 2-3 đầu việc $\rightarrow$ Nhấn *"✔️ Áp dụng checklist"* | Chuyển sang tab Checklist hiển thị đúng các mục đã chọn. Log ghi `ACCEPTED`. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **8** | AI tạo Phiếu xử lý đơn | Chọn loại *Phiếu xử lý đơn* $\rightarrow$ Nhấn *"✨ Tạo bản nháp AI"* | Textarea hiển thị tờ trình xử lý kèm nhãn cảnh báo vàng và placeholder giữ chỗ. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **9** | AI tạo Giấy mời làm việc | Chọn *Giấy mời làm việc / đối thoại* $\rightarrow$ Nhấn tạo nháp | Sinh mẫu giấy mời các bên làm việc thực địa chuẩn văn phong hành chính. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **10** | AI tạo Thông báo thụ lý | Chọn *Thông báo thụ lý* $\rightarrow$ Nhập chỉ dẫn thời hạn $\rightarrow$ Tạo nháp | Sinh mẫu thông báo thụ lý đơn gửi công dân kèm placeholder thông tin bổ sung. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **11** | AI tạo TB không thụ lý | Chọn *Thông báo không thụ lý* $\rightarrow$ Tạo nháp | Sinh mẫu văn bản nêu rõ lý do từ chối thụ lý giải quyết theo quy định. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **12** | AI tạo Văn bản chuyển đơn | Chọn *Văn bản chuyển đơn* $\rightarrow$ Tạo nháp | Sinh mẫu công văn chuyển đơn không thuộc thẩm quyền đến cơ quan giải quyết. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **13** | AI tạo Trả lời công dân | Chọn *Trả lời công dân (dự thảo)* $\rightarrow$ Tạo nháp | Sinh mẫu công văn hướng dẫn, giải đáp kiến nghị của công dân. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **14** | Lưu bản nháp vào CaseNote | Chỉnh sửa nội dung Textarea $\rightarrow$ Nhấn *"💾 Lưu vào ghi chú"* | Lưu thành công vào bảng Ghi chú hồ sơ với đúng tiền tố chuẩn (`[AI Dự thảo - ...]`). | [ ] Đạt<br>[ ] Chưa | ..... | |
| **15** | Kiểm tra AiAuditLog | Tra cứu bảng nhật ký kiểm toán hệ thống | Tất cả các bước phân tích, checklist, tạo nháp đều được lưu vết thời gian và trạng thái. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **16** | Bất biến LegalCase.status | Kiểm tra trường trạng thái hồ sơ sau khi thực hiện test | Trạng thái hồ sơ giữ nguyên 100% (ví dụ `NEW`), AI không tự động chuyển trạng thái. | [ ] Đạt<br>[ ] Chưa | ..... | |
| **17** | Bất biến assignedToId | Kiểm tra cán bộ thụ lý được giao trên hồ sơ | Hồ sơ vẫn thuộc phân công của cán bộ ban đầu, AI không tự điều chuyển nhiệm vụ. | [ ] Đạt<br>[ ] Chưa | ..... | |

---

## III. Bảng Ghi Nhận Lỗi / Phát Sinh (Bug Log)

*(Dành cho kiểm thử viên ghi lại các bất thường hoặc lỗi kỹ thuật phát sinh trong quá trình thử nghiệm)*

| STT | Màn hình / Chức năng | Mô tả lỗi phát sinh | Mức độ nghiêm trọng<br>*(Thấp/Trung bình/Cao/Nghiêm trọng)* | Ảnh hưởng nghiệp vụ | Đề xuất xử lý | Trạng thái xử lý |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| 1 | | | | | | [ ] Mới<br>[ ] Đang sửa<br>[ ] Đã xong |
| 2 | | | | | | [ ] Mới<br>[ ] Đang sửa<br>[ ] Đã xong |
| 3 | | | | | | [ ] Mới<br>[ ] Đang sửa<br>[ ] Đã xong |

---

## IV. Đánh Giá Chung

*(Vui lòng khoanh tròn hoặc đánh dấu **[x]** vào mức độ đồng ý của Ông/Bà đối với các nhận định dưới đây)*

1. **Giao diện tab Trợ lý AI có trực quan, rõ ràng và dễ thao tác sử dụng không?**  
   [ ] Rất đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Bình thường &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không đồng ý

2. **Khả năng tóm tắt nội dung đơn thư của AI có xúc tích, dễ hiểu và nắm bắt đúng bản chất vụ việc không?**  
   [ ] Rất đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Bình thường &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không đồng ý

3. **Kết quả gợi ý phân loại đơn và lĩnh vực giải quyết của AI có chính xác và phù hợp thực tế không?**  
   [ ] Rất đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Bình thường &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không đồng ý

4. **Đề xuất quy trình và checklist nghiệp vụ 6 nhóm có sát với quy định pháp luật và thực tiễn xử lý địa phương không?**  
   [ ] Rất đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Bình thường &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không đồng ý

5. **6 biểu mẫu văn bản nháp do AI tạo ra có đủ chất lượng để sử dụng làm khung dự thảo ban đầu giúp tiết kiệm thời gian không?**  
   [ ] Rất đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Bình thường &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không đồng ý

6. **Các nhãn cảnh báo "BẢN NHÁP AI" và vùng giữ chỗ placeholder (`[Cán bộ bổ sung...]`) hiển thị có nổi bật, dễ nhận biết không?**  
   [ ] Rất đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Đồng ý &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Bình thường &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Không đồng ý

7. **Ông/Bà có tin tưởng vào cơ chế kiểm soát an toàn (Human-in-the-Loop, Audit Log, không đổi status) của hệ thống không?**  
   [ ] Rất tin tưởng &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Tin tưởng &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Có chút phân vân &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ ] Chưa tin tưởng

---

## V. Kết Luận UAT

Dựa trên kết quả rà soát và đánh giá thực tế trên hệ thống, Hội đồng/Chuyên viên kiểm thử đi đến kết luận đối với phân hệ **LegalFlow AI (`v2.2.4-ai-demo-package`)**:

* **[ ] ĐỦ ĐIỀU KIỆN DEMO NỘI BỘ VÀ SỬ DỤNG THỬ NGHIỆM:** Hệ thống hoạt động ổn định, thông minh, đáp ứng trọn vẹn các nguyên tắc an toàn nghiệp vụ và bảo mật thông tin.
* **[ ] CẦN CHỈNH SỬA NHỎ:** Đủ điều kiện trình diễn, nhưng cần hoàn thiện thêm một số chi tiết về câu từ hoặc biểu mẫu UI ghi trong Bảng III trước khi áp dụng thử nghiệm.
* **[ ] CẦN CHỈNH SỬA LỚN:** Phát hiện lỗi ảnh hưởng đến luồng nghiệp vụ hoặc quy tắc an toàn, cần khắc phục triệt đề và tổ chức kiểm thử lại.
* **[ ] CHƯA ĐỦ ĐIỀU KIỆN SỬ DỤNG THỬ:** Hệ thống chưa đáp ứng được yêu cầu nghiệp vụ đề ra.

**Ý kiến kết luận bổ sung của Hội đồng kiểm thử:**  
................................................................................................................................................................................................................................................  
................................................................................................................................................................................................................................................  

<br>

<div style="display: flex; justify-content: space-between; margin-top: 40px;">
  <div style="text-align: center;">
    <b>NGƯỜI KIỂM THỬ</b><br>
    <i>(Ký và ghi rõ họ tên)</i><br><br><br><br>
  </div>
  <div style="text-align: center;">
    <b>LÃNH ĐẠO ĐƠN VỊ THẨM ĐỊNH</b><br>
    <i>(Ký, đóng dấu và ghi rõ họ tên)</i><br><br><br><br>
  </div>
</div>
