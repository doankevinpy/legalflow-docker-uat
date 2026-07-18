# Yêu Cầu Khung Quy Chế Phối Hợp Liên Ngành (`Inter-Agency Coordination Requirements`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12R
## Phase 12R: Inter-Agency Coordination Requirements & Framework

> [!CAUTION]
> **TÚYÊN BỐ PHÁP LÝ (`LEGAL DISCLAIMER`):**
> Tài liệu này **CHỈ LÀ DANH MỤC YÊU CẦU/KHUNG CHUẨN BỊ (`FRAMEWORK PREPARATION`)**, đóng vai trò tham chiếu để soạn thảo văn bản phối hợp thực tế. Tài liệu này **KHÔNG PHẢI** là Quy chế đã ban hành. Tuyệt đối không tự tạo số hiệu, ngày ký, hoặc cơ quan ban hành nhằm giả mạo sự phê duyệt pháp lý.

---

## 1. Mục Tiêu & Phạm Vi Phối Hợp (`Objectives & Scope`)
* **Mục tiêu phối hợp:** Thiết lập cơ chế liên thông thông tin điện tử, đảm bảo dữ liệu chiết tính nháp trên hệ thống Một cửa (`LegalFlow v2.12`) được đồng bộ và đối chiếu chính xác với kết quả xử lý nghiệp vụ của Cơ quan Thuế có thẩm quyền, nhằm ngăn chặn thất thu ngân sách và giảm thiểu rủi ro hồ sơ tồn đọng.
* **Phạm vi trao đổi thông tin:**
  - Hồ sơ đề nghị xác định nghĩa vụ tài chính đất đai.
  - Thông báo nộp tiền do cơ quan Thuế phát hành (bản điện tử/scan).
  - Chứng từ nộp tiền vào Ngân sách Nhà nước.

## 2. Trách Nhiệm Của Các Bên (`Roles & Responsibilities`)
* **Đơn vị Vận hành Một cửa (LegalFlow):**
  - Chịu trách nhiệm bảo mật thông tin hồ sơ theo quy định pháp luật.
  - Vận hành hệ thống kỹ thuật ổn định, chặn đứng các thao tác vượt quyền.
  - Bàn giao kết quả chiết tính dự kiến cho người dân với cam kết ghi rõ "Chỉ có tính tham khảo".
* **Cơ quan Thuế:**
  - Chịu trách nhiệm về tính chính xác pháp lý của Thông báo thuế cuối cùng.
  - Tiếp nhận hồ sơ điện tử từ hệ thống Một cửa (hoặc thông qua liên thông Cổng DVC) và phản hồi đúng SLA.

## 3. Cơ Chế Đối Chiếu & Thời Gian Phản Hồi (`Reconciliation & SLA`)
* **Cơ chế đối chiếu thông báo thuế:** Thực hiện đối chiếu thủ công qua luồng luân chuyển hồ sơ điện tử hoặc bán tự động (tùy mức độ tích hợp API sau này). Thông tin trên Thông báo thuế phải khớp với dữ liệu đầu vào.
* **Cơ chế đối chiếu chứng từ:** Cán bộ Một cửa rà soát mã số tham chiếu trên Giấy nộp tiền hoặc biên lai Cổng DVC Quốc gia để xác nhận trạng thái hoàn thành nghĩa vụ.
* **Thời gian phản hồi (SLA):** Tối đa `03 ngày làm việc` kể từ khi nhận đủ hồ sơ hợp lệ.

## 4. Quản Lý Sự Cố & Kỹ Thuật (`Incident Management`)
* **Đầu mối nghiệp vụ:** Đại diện Bộ phận Tiếp nhận Một cửa và Phòng Tuyên truyền Hỗ trợ NNT (hoặc phòng Quản lý Hộ Kinh Doanh, Cá nhân) của cơ quan Thuế.
* **Đầu mối kỹ thuật:** Quản trị viên hệ thống LegalFlow (`SYSADMIN`) và Đội CNTT Cục Thuế/Chi cục Thuế.
* **Xử lý sai lệch:** Nếu phát hiện chênh lệch giữa số tiền nháp và thông báo chính thức vượt ngưỡng cảnh báo, hệ thống sẽ gắn cờ theo dõi và yêu cầu thẩm định lại quy trình lập hồ sơ.

## 5. Bảo Vệ Dữ Liệu & Kiểm Toán (`Data Protection & Audit`)
* **Bảo vệ dữ liệu:** Mọi dữ liệu trao đổi không được phép bộc lộ cho bên thứ ba không có thẩm quyền. 
* **Kiểm toán (Audit):** 100% lịch sử giao dịch và xác nhận chứng từ được ghi log bất biến (`Immutable Audit Trail`) lưu tại cơ sở dữ liệu nội bộ.

## 6. Điều Kiện Đình Chỉ & Phê Duyệt (`Suspension & Approval`)
* **Tạm dừng hoặc chấm dứt phối hợp:** Bất kỳ bên nào phát hiện sự cố rò rỉ dữ liệu hoặc sai phạm nghiêm trọng đều có quyền đơn phương tạm dừng trao đổi thông tin bằng cách thông báo qua văn bản.
* **Yêu cầu phê duyệt:** Khung quy chế này bắt buộc phải được quy chuẩn thành văn bản pháp lý chính thức, có mộc đỏ và chữ ký của Thủ trưởng hai cơ quan trước khi kích hoạt quy trình xử lý dữ liệu hồ sơ công dân thực tế.
