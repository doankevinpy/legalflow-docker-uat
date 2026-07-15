# UAT CHECKLIST: LEGALFLOW V2 PHASE 12E - FINANCIAL OBLIGATION UAT CHECKLIST

Tài liệu hướng dẫn cán bộ nghiệp vụ và kiểm thử viên UAT thực hiện kiểm tra tính đúng đắn và an toàn của Mô-đun Nghĩa vụ tài chính trên thực tế.

---

### Kịch bản 1: Hồ sơ cấp GCN lần đầu có thể phát sinh nghĩa vụ tài chính
- **Các bước thực hiện:**
  1. Đăng nhập với quyền Cán bộ thụ lý (`STAFF`).
  2. Tìm kiếm và mở chi tiết một hồ sơ cấp GCN lần đầu.
  3. Chọn tab **Nghĩa vụ tài chính**.
  4. Xác nhận giao diện hiển thị Empty State kèm nút "Khởi tạo Nghĩa vụ tài chính".
  5. Bấm nút **Khởi tạo Nghĩa vụ tài chính**.
- **Kết quả kỳ vọng:**
  - Assessment được tạo với trạng thái `READY_FOR_REVIEW`.
  - Safety Banner cảnh báo hiển thị rõ ràng trên cùng.
- **Ghi chú của cán bộ:** Kiểm tra xem có đúng là trạng thái "DỰ THẢO DỰ KIẾN" không.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 2: Hồ sơ chuyển mục đích sử dụng đất
- **Các bước thực hiện:**
  1. Mở chi tiết hồ sơ chuyển mục đích sử dụng đất đã khởi tạo Nghĩa vụ tài chính.
  2. Bấm nút **Tạo dự thảo gợi ý AI**.
- **Kết quả kỳ vọng:**
  - Bảng tính ước lượng các khoản thuế chuyển mục đích sử dụng đất hiện ra.
  - Trường `isEstimate` trong dữ liệu trả về là `true`.
  - Nhãn hiển thị bên cạnh số tiền ước tính luôn có chữ `(Dự thảo gợi ý của AI)`.
- **Ghi chú của cán bộ:** AI ước tính phải hiển thị chi tiết các căn cứ tính thuế đất.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 3: Hồ sơ không phát sinh nghĩa vụ tài chính
- **Các bước thực hiện:**
  1. Mở một hồ sơ thuộc diện miễn nộp toàn bộ thuế/lệ phí theo luật.
  2. Khởi tạo Nghĩa vụ tài chính và chạy dự thảo gợi ý AI.
  3. Trong panel ước tính, cập nhật giá trị các khoản phí dự kiến về `0`.
- **Kết quả kỳ vọng:**
  - Hệ thống cho phép cập nhật các khoản dự kiến về `0`.
  - Tổng số tiền dự kiến hiển thị là `0 VND`.
- **Ghi chú của cán bộ:** Kiểm tra xem có ghi chú rõ lý do miễn/giảm trong phần mô tả của item không.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 4: Hồ sơ thiếu thông báo thuế
- **Các bước thực hiện:**
  1. Khởi tạo nghĩa vụ tài chính cho hồ sơ.
  2. Để trống phần thông tin thông báo thuế.
  3. Điền chứng từ nộp tiền và thực hiện Officer Verify.
- **Kết quả kỳ vọng:**
  - Nút **Đánh dấu hoàn thành** phải bị vô hiệu hóa (disabled) trên giao diện.
  - Hiển thị danh sách check-list thiếu thông tin: `Thiếu Thông báo thuế chính thức`.
- **Ghi chú của cán bộ:** Nút Đánh dấu hoàn thành không được phép bấm được.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 5: Hồ sơ thiếu chứng từ nộp tiền
- **Các bước thực hiện:**
  1. Khởi tạo nghĩa vụ tài chính cho hồ sơ.
  2. Nhập thông tin Thông báo thuế chính thức.
  3. Để trống phần Chứng từ nộp tiền.
  4. Thực hiện Officer Verify.
- **Kết quả kỳ vọng:**
  - Nút **Đánh dấu hoàn thành** bị vô hiệu hóa.
  - Hiển thị danh sách check-list thiếu thông tin: `Thiếu Chứng từ nộp tiền hợp lệ`.
- **Ghi chú của cán bộ:** Nút Đánh dấu hoàn thành không được phép bấm được.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 6: Hồ sơ có miễn/giảm/ghi nợ cần cán bộ kiểm tra
- **Các bước thực hiện:**
  1. Nhập thông tin Thông báo thuế chính thức.
  2. Tích chọn hoặc ghi chú có diện miễn/giảm/ghi nợ trong phần lưu ý.
  3. Bấm cán bộ thụ lý xác nhận đã kiểm tra.
- **Kết quả kỳ vọng:**
  - Hệ thống yêu cầu phải có chữ ký/phê duyệt của Lãnh đạo (`MANAGER`) do thuộc diện miễn giảm/rủi ro cao.
  - Nút **Đánh dấu hoàn thành** bị vô hiệu hóa cho đến khi Lãnh đạo xác thực.
- **Ghi chú của cán bộ:** Trực quan hóa danh sách check-list thiếu: `Chờ Lãnh đạo phê duyệt`.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 7: Hồ sơ chỉ có AI draft, chưa đủ điều kiện completed
- **Các bước thực hiện:**
  1. Chỉ chạy **Tạo dự thảo gợi ý AI**.
  2. Không nhập thông báo thuế, không nhập chứng từ.
  3. Cố gắng tìm cách bấm Đánh dấu hoàn thành hoặc gửi API hoàn thành trực tiếp.
- **Kết quả kỳ vọng:**
  - Trạng thái vẫn là dự thảo.
  - Nút bấm bị vô hiệu hóa hoàn toàn trên UI.
  - Nếu gửi request hoàn thành trực tiếp bằng API, backend phản hồi lỗi `400 Bad Request` và ghi log blocked.
- **Ghi chú của cán bộ:** Ngăn chặn tuyệt đối việc hoàn thành hồ sơ bằng số liệu ảo của AI.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL

---

### Kịch bản 8: Hồ sơ có đầy đủ thông báo thuế + chứng từ + officer verification
- **Các bước thực hiện:**
  1. Nhập đầy đủ thông tin Thông báo thuế chính thức (Số thông báo, số tiền chính thức, đính kèm).
  2. Nhập đầy đủ Chứng từ nộp tiền (Mã chứng từ, số tiền đã nộp khớp với số thuế, đính kèm).
  3. Cán bộ thụ lý bấm **Xác nhận đã kiểm tra** (Xác nhận hộp thoại nhắc nhở an toàn).
  4. Lãnh đạo phê duyệt (nếu cần thiết do rủi ro hoặc miễn giảm).
  5. Bấm nút **Đánh dấu hoàn thành**.
- **Kết quả kỳ vọng:**
  - Nút **Đánh dấu hoàn thành** sáng lên và bấm được.
  - Bấm nút thành công, trạng thái Assessment chuyển sang `COMPLETED`.
  - Audit log ghi nhận hành động hoàn thành đầy đủ.
- **Ghi chú của cán bộ:** Xác thực xem hồ sơ đã chuyển trạng thái hoàn thành nghĩa vụ tài chính chưa.
- **Kết quả kiểm thử:** [ ] PASS  [ ] FAIL
