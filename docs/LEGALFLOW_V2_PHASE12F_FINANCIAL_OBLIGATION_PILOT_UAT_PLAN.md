# Kế hoạch Kiểm thử UAT Pilot - Giai đoạn 12F
## Phase 12F: Financial Obligation Pilot UAT with Sample Cases

> [!WARNING]
> **TÀI LIỆU DÙNG CHO KIỂM THỬ UAT HOÀN TOÀN TRÊN DỮ LIỆU GIẢ LẬP / MẪU (SAMPLE CASES).**
> Tuyệt đối không sử dụng thông tin cá nhân thật, không nhập dữ liệu thật của cơ quan thuế hoặc người dân vào môi trường kiểm thử. Không đưa bất kỳ dữ liệu thật nào vào Git.

---

## 1. Purpose (Mục đích)
Tài liệu này xác định kế hoạch chi tiết cho việc chạy thử nghiệm thực tế (Pilot UAT) phân hệ **Hỗ trợ Nghĩa vụ Tài chính** thuộc hệ thống LegalFlow v2. Giai đoạn này tập trung vào:
- Chuẩn bị đầy đủ các kịch bản kiểm thử giả lập, danh mục hồ sơ mẫu (Sample Case Catalog), biểu mẫu phản hồi và tiêu chuẩn nghiệm thu.
- Hướng dẫn các Cán bộ thụ lý (`OFFICER`) và Lãnh đạo chi cục/quận (`MANAGER`) thực hiện chạy thử nghiệm độc lập trên môi trường UAT.
- Xác thực toàn bộ các chốt chặn an toàn nghiệp vụ (Safety Guards) bảo vệ hệ thống khỏi việc tự ý tính toán sai lệch nghĩa vụ tài chính hoặc tự động phê duyệt hồ sơ khi thiếu thủ tục pháp lý gốc.

## 2. Baseline (Thông tin cơ sở)
- **Tag cơ sở:** `v2.12.4-financial-obligation-integration-safety-hardening`
- **Mã nguồn:** Đã tích hợp và hoàn thành kiểm thử tích hợp (Phase 12E), toàn bộ unit test đạt 100% PASS, build production frontend/backend thành công.
- **Trạng thái môi trường:** Đầy đủ hạ tầng dịch vụ Docker (PostgreSQL, MinIO, Caddy) và dev servers backend/frontend hoạt động bình thường.

## 3. UAT Objective (Mục tiêu UAT)
- **Mục tiêu 1:** Đảm bảo 100% Cán bộ thụ lý và Lãnh đạo tham gia UAT nhận thức rõ vai trò của hệ thống chỉ là **hỗ trợ gợi ý, rà soát, cảnh báo thông tin**, không có chức năng và không được phép thay thế Cơ quan Thuế Nhà nước.
- **Mục tiêu 2:** Xác nhận giao diện hiển thị đúng, trực quan:
  - Bắt buộc phải có **Safety Banner** cảnh báo tính chất DỰ KIẾN hiển thị nổi bật.
  - Các ô số tiền dự toán của AI phải có nhãn "DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC" rõ ràng.
- **Mục tiêu 3:** Đảm bảo tính toàn vẹn của logic chốt chặn an toàn:
  - Nút **Đánh dấu hoàn thành nghĩa vụ tài chính** bị disable (khóa) hoàn toàn khi chưa đáp ứng đủ các điều kiện tiên quyết (thiếu Thông báo thuế chính thức, thiếu Chứng từ nộp tiền/biên lai của công dân, hoặc chưa được Officer xác nhận).
  - Không tồn tại chức năng tự động lấy số tiền dự toán điền vào ô số tiền chính thức hoặc tự động hoàn thành hồ sơ khi thiếu chứng từ pháp lý gốc.
- **Mục tiêu 4:** Kiểm tra cơ chế ghi nhật ký kiểm toán (Audit Trail) cho mọi hành động thay đổi trạng thái của hồ sơ nghĩa vụ tài chính.

## 4. UAT Scope (Phạm vi kiểm thử)
Kiểm thử toàn bộ luồng xử lý của Phân hệ Hỗ trợ Nghĩa vụ Tài chính tương ứng với 8 hồ sơ mẫu trong **Sample Case Catalog** thuộc 4 nhóm thủ tục hành chính trọng tâm:
1. Đăng ký cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất lần đầu.
2. Chuyển mục đích sử dụng đất.
3. Đăng ký biến động quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất có phát sinh nghĩa vụ tài chính.
4. Các trường hợp được miễn, giảm hoặc ghi nợ nghĩa vụ tài chính cần kiểm tra kiểm soát.
5. Hồ sơ không thuộc diện phát sinh nghĩa vụ tài chính để kiểm tra độ tin cậy của phân loại hệ thống.

## 5. UAT Environment (Môi trường kiểm thử)
Môi trường giả lập UAT cục bộ (Local Sandbox):
- **Cơ sở dữ liệu:** PostgreSQL chạy trong Docker container (`legalflow_postgres`), độc lập hoàn toàn với dữ liệu thực tế.
- **Lưu trữ tài liệu:** MinIO chạy trong Docker container (`legalflow_minio`), dùng để giả lập lưu trữ các file thông báo thuế và chứng từ nộp tiền.
- **Cổng kết nối:** Backend API chạy tại cổng `3000`, Frontend Client chạy tại cổng `5173`.
- **Dữ liệu mẫu:** Sử dụng danh mục hồ sơ mẫu do cán bộ tự nhập tay qua giao diện hoặc dữ liệu seed giả lập cho UAT (không có bất kỳ thông tin thực tế nào được đưa lên repository).

## 6. Roles tham gia UAT (Các vai trò)
- **Cán bộ thụ lý (Officer):**
  - Thực hiện khởi tạo nghĩa vụ tài chính, yêu cầu AI đề xuất bản dự thảo chiết tính.
  - Rà soát các thông tin thửa đất, người nộp thuế, diện tích.
  - Tải lên thông báo thuế chính thức từ Cơ quan Thuế (nhập thủ công số tiền chính thức bằng tay từ văn bản giấy).
  - Tải lên chứng từ nộp tiền/biên lai của người dân (xác minh số tiền khớp với thông báo thuế).
  - Thực hiện xác nhận đối chiếu hồ sơ gốc (`officerVerify`).
- **Lãnh đạo phụ trách (Manager):**
  - Xem xét và phê duyệt đề xuất miễn, giảm hoặc ghi nợ nếu có.
  - Rà soát mức độ rủi ro hồ sơ dựa trên bảng cảnh báo an toàn.
  - Xác nhận phê duyệt cuối cùng (`managerVerify`) trước khi cho phép hoàn thành.

## 7. Test Assumptions (Các giả định kiểm thử)
- Người dùng thực hiện UAT đã được tập huấn về nghiệp vụ nghĩa vụ tài chính đất đai.
- Môi trường Docker hoạt động ổn định và các API kết nối bình thường.
- Cán bộ UAT chỉ sử dụng các tệp tin PDF/hình ảnh giả lập để tải lên làm Thông báo thuế hoặc Chứng từ nộp tiền (không tải lên các tệp tin chứa thông tin thật của cơ quan ban hành hoặc công dân thật).

## 8. Stop Conditions (Điều kiện dừng kiểm thử bắt buộc)
Quá trình kiểm thử UAT phải dừng lại ngay lập tức và chuyển sang trạng thái **FAILED** nếu phát hiện bất kỳ dấu hiệu nào sau đây:
1. **Thiếu Safety Banner:** Safety Banner cảnh báo an toàn bắt buộc không hiển thị trên giao diện hoặc hiển thị sai nội dung quy định.
2. **AI/Draft tạo Official Amount:** Số tiền chính thức (Official Amount) tự động được hệ thống điền trước (pre-fill) từ số tiền dự toán do AI tính toán mà không bắt buộc cán bộ nhập thủ công bằng tay.
3. **Hệ thống tự phát hành thông báo thuế:** Phát hiện bất kỳ nút bấm hoặc chức năng nào cho phép hệ thống tự động phát hành thông báo nộp tiền thay thế cho Cơ quan Thuế Nhà nước.
4. **Tự động completed khi thiếu chứng từ:** Hệ thống tự động cho phép chuyển trạng thái nghĩa vụ tài chính sang `COMPLETED` mà không có đủ tệp tin thông báo thuế, tệp tin biên lai nộp tiền hoặc khi nút "Đánh dấu hoàn thành" bị click vượt rào thành công mặc dù đang ở trạng thái disable.
5. **Tự động gửi thông báo cho công dân:** Phát hiện hệ thống tự động gửi email, tin nhắn SMS hoặc thông báo Zalo cho công dân về số tiền nghĩa vụ tài chính hoặc tình trạng hồ sơ.
6. **Lỗi hệ thống nghiêm trọng:** Lỗi sập backend (HTTP 500 liên tiếp) hoặc frontend treo trắng trang mà không thể tự phục hồi qua nút "Thử lại".
7. **Dữ liệu thật bị đưa vào Git:** Có bất kỳ file thông tin thật, thông tin cá nhân thực tế hoặc mật khẩu/secret key nào bị ghi nhận trong mã nguồn hoặc các file markdown trong thư mục `docs/`.
