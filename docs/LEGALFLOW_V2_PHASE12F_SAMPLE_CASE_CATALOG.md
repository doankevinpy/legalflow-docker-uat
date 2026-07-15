# Danh mục Hồ sơ Kiểm thử Mẫu - Giai đoạn 12F
## Phase 12F: Sample Case Catalog

> [!IMPORTANT]
> **XÁC NHẬN PHÁP LÝ:**
> Đây là Danh mục hồ sơ kiểm thử mẫu phục vụ riêng cho hoạt động UAT. Toàn bộ các thông tin bên dưới (Mã hồ sơ, Tên công dân, Số lô thửa, Số tiền...) đều là dữ liệu giả lập 100%, không chứa bất kỳ dữ liệu nghiệp vụ thật nào và không được đưa vào cơ sở dữ liệu chính thức.

---

## 1. FO-UAT-01: Cấp GCN lần đầu, thiếu thông tin nghĩa vụ tài chính
* **Case ID:** `FO-UAT-01`
* **Case Name:** Hồ sơ Nguyễn Văn A - Đề nghị cấp GCN lần đầu thửa 102 tờ bản đồ số 5
* **Procedure Type:** Đăng ký cấp Giấy chứng nhận quyền sử dụng đất lần đầu
* **Input Condition:** 
  - Hồ sơ thiếu diện tích đất tính thuế hoặc thiếu thông tin thửa đất trên tờ khai.
  - Chưa được khởi tạo bản dự thảo nghĩa vụ tài chính.
* **Expected Financial Obligation Behavior:** 
  - Hệ thống hiển thị Checklist thông báo: "Thiếu thông tin thửa đất" hoặc "Thiếu thông tin nghĩa vụ tài chính".
  - Trạng thái nghĩa vụ tài chính: `PENDING`.
* **Required Officer Check:** Cán bộ thụ lý phải kiểm tra hồ sơ gốc xem diện tích đất có phù hợp không, tiến hành điền bổ sung thông tin thửa đất trước khi có thể yêu cầu AI tính toán.
* **Tax Notice Status:** `MISSING` (Chưa tải lên).
* **Payment Evidence Status:** `MISSING` (Chưa tải lên).
* **Expected System Status:** Nút "Đánh dấu hoàn thành" bị disable hoàn toàn. Hiển thị thông tin cảnh báo thiếu điều kiện trong phần `MissingInfoChecklist`.
* **Expected Warning:** "Cảnh báo: Hồ sơ thiếu thông tin thửa đất hoặc diện tích tính thuế."
* **Notes:** Case này dùng để test chốt chặn đầu vào của dữ liệu thửa đất.

---

## 2. FO-UAT-02: Chuyển mục đích sử dụng đất, có bản dự kiến
* **Case ID:** `FO-UAT-02`
* **Case Name:** Hồ sơ Trần Thị B - Chuyển mục đích sử dụng đất trồng lúa sang đất ở thửa 50
* **Procedure Type:** Chuyển mục đích sử dụng đất
* **Input Condition:**
  - Thông tin thửa đất đầy đủ.
  - Đã được khởi tạo và AI đã chạy dự thảo chiết tính nghĩa vụ tài chính (tiền sử dụng đất, lệ phí trước bạ).
* **Expected Financial Obligation Behavior:**
  - Hiển thị bảng chiết tính dự kiến (`FinancialObligationEstimatePanel`) với 2 khoản mục: Tiền sử dụng đất dự kiến và Lệ phí trước bạ dự kiến.
  - Các số tiền này đều hiển thị nhãn "DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC" màu vàng/cam.
* **Required Officer Check:** Cán bộ rà soát các khoản mục chiết tính của AI xem có đúng với bảng giá đất của tỉnh/thành phố không.
* **Tax Notice Status:** `MISSING` (Chưa tải lên).
* **Payment Evidence Status:** `MISSING` (Chưa tải lên).
* **Expected System Status:** Nút "Đánh dấu hoàn thành" bị disable. Checklist hiển thị thiếu thông báo thuế chính thức và chứng từ nộp tiền.
* **Expected Warning:** "DỰ KIẾN: Số tiền tính toán bên dưới chỉ là dự kiến do AI đề xuất. Không thay thế cho thông báo thuế chính thức của cơ quan có thẩm quyền."
* **Notes:** Dùng để test giao diện hiển thị số tiền dự kiến của AI và nhãn cảnh báo.

---

## 3. FO-UAT-03: Có thông báo thuế nhưng chưa có chứng từ nộp tiền
* **Case ID:** `FO-UAT-03`
* **Case Name:** Hồ sơ Phạm Văn C - Chuyển mục đích sử dụng đất vườn sang đất ở thửa 12
* **Procedure Type:** Chuyển mục đích sử dụng đất
* **Input Condition:**
  - Đã có bản dự kiến AI.
  - Cán bộ thụ lý đã tải lên file PDF Thông báo thuế chính thức từ Chi cục Thuế và nhập thủ công số tiền chính thức bằng tay (ví dụ: 150.000.000 VNĐ).
* **Expected Financial Obligation Behavior:**
  - Hệ thống ghi nhận trạng thái thông báo thuế: `UPLOADED` (Đã tải lên).
  - Trạng thái nghĩa vụ tài chính chuyển sang: `TAX_NOTICE_UPLOADED`.
* **Required Officer Check:** Cán bộ kiểm tra tệp PDF thông báo thuế tải lên có rõ nét không, số tiền nhập vào hệ thống có khớp 100% với số tiền trên bản giấy của Chi cục Thuế hay không.
* **Tax Notice Status:** `UPLOADED` (Đã nhập tay số tiền: 150.000.000 VNĐ, file đính kèm: `thong_bao_thue_mau.pdf`).
* **Payment Evidence Status:** `MISSING` (Chưa tải lên).
* **Expected System Status:** Nút "Đánh dấu hoàn thành" vẫn bị disable do thiếu chứng từ nộp tiền của công dân.
* **Expected Warning:** "Yêu cầu: Công dân cần nộp tiền vào Kho bạc Nhà nước và cung cấp chứng từ nộp tiền hợp lệ trước khi hoàn thành thủ tục."
* **Notes:** Test chốt chặn "chỉ có thông báo thuế nhưng chưa nộp tiền".

---

## 4. FO-UAT-04: Có chứng từ nhưng chưa officer verified
* **Case ID:** `FO-UAT-04`
* **Case Name:** Hồ sơ Lê Văn D - Cấp GCN lần đầu thửa 88 tờ bản đồ số 3
* **Procedure Type:** Đăng ký cấp Giấy chứng nhận quyền sử dụng đất lần đầu
* **Input Condition:**
  - Đã tải lên Thông báo thuế chính thức và nhập số tiền chính thức (ví dụ: 25.000.000 VNĐ).
  - Đã tải lên Chứng từ nộp tiền/Biên lai của công dân (nhập số tiền đã nộp: 25.000.000 VNĐ, file đính kèm: `bien_lai_nop_tien.pdf`).
  - Chưa được Cán bộ thụ lý bấm xác nhận đối chiếu hồ sơ gốc (`officerVerify`).
* **Expected Financial Obligation Behavior:**
  - Trạng thái thông báo thuế: `UPLOADED`.
  - Trạng thái chứng từ nộp tiền: `UPLOADED`.
  - Trạng thái nghĩa vụ tài chính: `WAITING_VERIFICATION` (Chờ thẩm định).
* **Required Officer Check:** Cán bộ thụ lý phải kiểm tra kỹ chứng từ xem có dấu đỏ của ngân hàng hoặc kho bạc không, mã giao dịch có hợp lệ không, số tiền đã nộp có khớp hoàn toàn với số tiền trên thông báo thuế hay không.
* **Tax Notice Status:** `UPLOADED` (25.000.000 VNĐ).
* **Payment Evidence Status:** `UPLOADED` (25.000.000 VNĐ).
* **Expected System Status:** Nút "Đánh dấu hoàn thành" bị disable do chưa có xác nhận thẩm định của Cán bộ thụ lý.
* **Expected Warning:** "Yêu cầu: Cán bộ thụ lý cần xác nhận đã đối chiếu chứng từ gốc trước khi tiếp tục."
* **Notes:** Test chốt chặn thẩm định nghiệp vụ (Human-in-the-loop).

---

## 5. FO-UAT-05: Đủ thông báo thuế, chứng từ, officer verified
* **Case ID:** `FO-UAT-05`
* **Case Name:** Hồ sơ Hoàng Văn E - Đăng ký biến động chuyển nhượng quyền sử dụng đất thửa 15
* **Procedure Type:** Đăng ký biến động đất đai
* **Input Condition:**
  - Thông báo thuế chính thức đã tải lên và nhập tay số tiền chính thức (ví dụ: 12.500.000 VNĐ).
  - Chứng từ nộp tiền đã tải lên và nhập số tiền nộp (ví dụ: 12.500.000 VNĐ).
  - Cán bộ thụ lý đã kiểm tra, bấm nút "Xác nhận đối chiếu chứng từ gốc thành công" (`officerVerify`).
  - Trạng thái phê duyệt của cán bộ: `OFFICER_VERIFIED`.
* **Expected Financial Obligation Behavior:**
  - Checklist hoàn thành nghĩa vụ tài chính ghi nhận 100% điều kiện đạt yêu cầu (xanh).
  - Trạng thái nghĩa vụ tài chính chuyển sang: `OFFICER_VERIFIED` (Đã đối chiếu).
* **Required Officer Check:** Cán bộ rà soát lại nhật ký hệ thống trước khi bấm nút hoàn thành.
* **Tax Notice Status:** `UPLOADED` (12.500.000 VNĐ).
* **Payment Evidence Status:** `UPLOADED` (12.500.000 VNĐ).
* **Expected System Status:** Nút "Đánh dấu hoàn thành nghĩa vụ tài chính" được **UNLOCKED** (kích hoạt). Khi click vào, hệ thống yêu cầu xác nhận một lần nữa trước khi chuyển trạng thái của phân hệ sang `COMPLETED`.
* **Expected Warning:** "Xác nhận: Hồ sơ đã đủ điều kiện pháp lý để hoàn thành nghĩa vụ tài chính."
* **Notes:** Test luồng thành công lý tưởng (Happy Path).

---

## 6. FO-UAT-06: Không phát sinh nghĩa vụ tài chính
* **Case ID:** `FO-UAT-06`
* **Case Name:** Hồ sơ Vũ Thị F - Đăng ký biến động tặng cho quyền sử dụng đất giữa cha mẹ và con ruột thửa 44
* **Procedure Type:** Đăng ký biến động đất đai (Miễn thuế)
* **Input Condition:**
  - Đối tượng tặng cho thuộc diện miễn thuế thu nhập cá nhân và lệ phí trước bạ theo Luật Đất đai.
  - Hồ sơ pháp lý chứng minh mối quan hệ nhân thân (khai sinh) đầy đủ.
* **Expected Financial Obligation Behavior:**
  - AI khởi tạo bản dự thảo nghĩa vụ tài chính xác định số tiền dự kiến bằng `0` VNĐ kèm lý do: "Tặng cho giữa cha mẹ và con ruột".
  - Bản ghi thông báo thuế và chứng từ nộp tiền tự động ghi nhận miễn nộp tiền.
* **Required Officer Check:** Cán bộ thụ lý kiểm tra tính xác thực của Giấy khai sinh đính kèm trong hồ sơ gốc trước khi xác nhận miễn thuế.
* **Tax Notice Status:** `EXEMPTED` (Miễn nộp - Đính kèm quyết định miễn thuế của Chi cục Thuế).
* **Payment Evidence Status:** `NOT_REQUIRED` (Không yêu cầu).
* **Expected System Status:** Hệ thống cho phép bấm "Đánh dấu hoàn thành" sau khi Officer đã xác nhận trạng thái miễn thuế hợp lệ.
* **Expected Warning:** "Thông báo: Hồ sơ thuộc diện không phát sinh nghĩa vụ tài chính hoặc được miễn thuế."
* **Notes:** Kiểm chứng việc xử lý các trường hợp không phát sinh nghĩa vụ tài chính.

---

## 7. FO-UAT-07: Có miễn/giảm/ghi nợ cần cán bộ kiểm tra
* **Case ID:** `FO-UAT-07`
* **Case Name:** Hồ sơ Đỗ Văn G - Cấp GCN lần đầu cho hộ gia đình chính sách thửa 5
* **Procedure Type:** Đăng ký cấp Giấy chứng nhận quyền sử dụng đất lần đầu
* **Input Condition:**
  - Người dân nộp đơn xin miễn giảm tiền sử dụng đất hoặc xin ghi nợ tiền sử dụng đất do hoàn cảnh khó khăn.
* **Expected Financial Obligation Behavior:**
  - Hệ thống cho phép Cán bộ thụ lý thiết lập cờ `isExempt` hoặc `isDebt` trong bảng chiết tính dự kiến.
  - Cần có trình phê duyệt lên Lãnh đạo (`Manager`) để duyệt quyết định miễn giảm hoặc ghi nợ này.
* **Required Officer Check:** Cán bộ kiểm tra kỹ các giấy tờ chứng minh hộ nghèo, gia đình chính sách. Lãnh đạo phải vào rà soát và bấm "Duyệt ghi nợ/miễn giảm" trước khi hồ sơ chuyển tiếp.
* **Tax Notice Status:** `DEFERRED` / `EXEMPTED` (Được ghi nợ hoặc miễn giảm một phần).
* **Payment Evidence Status:** `PARTIAL_OR_EXEMPT` (Đã nộp phần còn lại hoặc không yêu cầu nếu được miễn 100%).
* **Expected System Status:** Nút "Đánh dấu hoàn thành" bị khóa cho đến khi Manager bấm xác nhận phê duyệt miễn giảm/ghi nợ thành công (`managerVerify`).
* **Expected Warning:** "Chú ý: Hồ sơ yêu cầu Miễn giảm/Ghi nợ nghĩa vụ tài chính. Cần có sự phê duyệt của Lãnh đạo chi cục."
* **Notes:** Test cơ chế phối hợp duyệt miễn giảm giữa Officer và Manager.

---

## 8. FO-UAT-08: Chỉ có AI draft, không được completed
* **Case ID:** `FO-UAT-08`
* **Case Name:** Hồ sơ Ngô Văn H - Chuyển mục đích sử dụng đất trồng cây lâu năm sang đất ở thửa 9
* **Procedure Type:** Chuyển mục đích sử dụng đất
* **Input Condition:**
  - AI đã tạo bản dự kiến chiết tính trị giá 300.000.000 VNĐ.
  - Cán bộ thụ lý lạm dụng chức năng hoặc cố ý bấm hoàn thành hồ sơ khi chưa có Thông báo thuế và biên lai nộp tiền thật từ cơ quan thuế.
* **Expected Financial Obligation Behavior:**
  - Hệ thống chặn hành động bấm nút hoàn thành.
  - Bảng kiểm tra điều kiện thiếu (`MissingInfoChecklist`) hiển thị 2 dòng đỏ cảnh báo thiếu tệp tin và thông tin kiểm đối chiếu.
* **Required Officer Check:** Cán bộ không thể bỏ qua bước kiểm tra thủ tục giấy tờ pháp lý.
* **Tax Notice Status:** `MISSING` (Chưa tải lên).
* **Payment Evidence Status:** `MISSING` (Chưa tải lên).
* **Expected System Status:** Nút "Đánh dấu hoàn thành" bị disable vĩnh viễn cho đến khi có Thông báo thuế và Chứng từ thanh toán hợp lệ được tải lên và xác minh.
* **Expected Warning:** "Hành động bị chặn: Không thể hoàn thành nghĩa vụ tài chính khi chỉ có bản đề xuất dự kiến của AI."
* **Notes:** Kiểm chứng chốt chặn an toàn cốt lõi nhất của module.
