# Các Điều Kiện Triển Khai Phát Hành Có Kiểm Soát (Controlled Release Conditions) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12L
## Phase 12L: Controlled Release Conditions

> [!CAUTION]
> **RÀO CHẮN AN TOÀN TRIỂN KHAI BẮT BUỘC (`MANDATORY DEPLOYMENT GUARDRAILS`):**
> Quyết định nghiệm thu `ACCEPTED FOR CONTROLLED RELEASE WITH CONDITIONS` và trạng thái `RC READY WITH CONDITIONS` chỉ có hiệu lực pháp lý khi và chỉ khi hệ thống và đội ngũ vận hành tuân thủ nghiêm ngặt **11 Điều Kiện Triển Khai Có Kiểm Soát** dưới đây. Bất kỳ sự vi phạm nào đối với các điều kiện này đều có thể dẫn đến việc tự động vô hiệu hóa tính năng của phân hệ ngay lập tức.

---

## 1. Chi Tiết 11 Điều Kiện Phát Hành Có Kiểm Soát (`11 Controlled Release Conditions`)

### 1. Chỉ cán bộ được phân quyền sử dụng (`Authorized Staff Access Only`)
* **Quy tắc:** Phân hệ Nghĩa vụ tài chính chỉ mở truy cập cho người dùng nội bộ được phân quyền hợp lệ theo vai trò (`Role: RECEIVING_OFFICER, REVIEWING_OFFICER, APPROVAL_MANAGER, ADMIN`).
* **Yêu cầu:** Tuyệt đối không mở các API endpoints hoặc giao diện chiết tính/thẩm định ra mạng công cộng (`Public Internet`) hoặc Cổng Dịch vụ công cho công dân tự thao tác.

### 2. Chỉ dùng để hỗ trợ rà soát, không thay thế cơ quan thuế (`Review Assistance Only - No Tax Authority Replacement`)
* **Quy tắc:** Hệ thống LegalFlow chỉ đóng vai trò là công cụ hỗ trợ Cán bộ Tiếp nhận và Cán bộ Thẩm định rà soát, ghi nhận và quản lý tiến độ thực hiện nghĩa vụ tài chính liên quan đến thủ tục đất đai.
* **Yêu cầu:** Phân hệ **hoàn toàn không thay thế chức năng, nhiệm vụ và thẩm quyền ban hành thông báo thuế** của cơ quan có thẩm quyền (`Chi cục Thuế / Cục Thuế`). Mọi quyết định hành chính phải căn cứ vào chứng từ gốc của cơ quan thuế.

### 3. Không dùng số dự kiến làm số tiền chính thức (`Never Use Estimates as Official Amounts`)
* **Quy tắc:** Toàn bộ kết quả chiết tính sơ bộ do AI hỗ trợ (`AI_ASSISTED draft estimates`) chỉ mang tính chất tham khảo ban đầu (`DEMO ESTIMATE / DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC`).
* **Yêu cầu:** Hệ thống và Cán bộ tuyệt đối không được sao chép hoặc tự gán các con số dự kiến này vào các trường số tiền hợp lệ pháp lý (`officialAmount` / `officialTotalAmount`) trên cơ sở dữ liệu.

### 4. Phải đối chiếu thông báo thuế thật (`Mandatory Real Tax Notice Reconciliation`)
* **Quy tắc:** Trước khi ghi nhận trạng thái nhận thông báo thuế (`TAX_NOTICE_RECEIVED`), Cán bộ Tiếp nhận có trách nhiệm đối chiếu trực tiếp bản gốc Thông báo nộp tiền sử dụng đất / lệ phí trước bạ bằng giấy do Chi cục Thuế ban hành.
* **Yêu cầu:** Bắt buộc tải lên bản sao số hóa (`PDF/Scan`) rõ ràng của thông báo thuế thật và nhập chính xác số thông báo (`noticeNumber`), cơ quan ban hành (`issuingAuthority`) cùng số tiền thuế phải nộp.

### 5. Phải đối chiếu chứng từ nộp tiền thật (`Mandatory Real Payment Evidence Verification`)
* **Quy tắc:** Việc ghi nhận hoàn thành nghĩa vụ tài chính phải dựa trên chứng từ nộp tiền hợp lệ vào Kho bạc Nhà nước hoặc ngân hàng thương mại được ủy nhiệm thu (`BNT / Giấy nộp tiền vào ngân sách nhà nước`).
* **Yêu cầu:** Cán bộ phải tải lên bản quét chứng từ nộp tiền thật (`receiptNumber`, `treasuryOrBank`), đối chiếu số tiền đã nộp khớp đúng 100% với thông báo thuế trước khi chuyển bước.

### 6. Phải có xác nhận của cán bộ trước khi hoàn thành (`Mandatory Officer Verification Before Completion`)
* **Quy tắc:** Nút "Hoàn thành thủ tục / Đã nộp đủ tiền" (`Complete Procedure`) trên hệ thống chỉ được mở khóa (`Active`) khi hồ sơ đã trải qua bước thẩm định và xác nhận chữ ký đối chiếu của Cán bộ chuyên trách (`officerReviewStatus = OFFICER_VERIFIED`).
* **Yêu cầu:** Hệ thống khóa chặn backend (`HTTP 400 Bad Request`) đối với mọi yêu cầu hoàn thành thủ tục nếu trạng thái thẩm định cán bộ vẫn là `UNVERIFIED`.

### 7. Phê duyệt quản lý đối với hồ sơ rủi ro cao (`Manager Approval Required for High-Risk Cases`)
* **Quy tắc:** Đối với các trường hợp đặc biệt như: được miễn giảm tiền sử dụng đất, ghi nợ tiền sử dụng đất theo quy định pháp luật (`DEMO-FO-UAT-07`), hoặc hồ sơ được phân loại rủi ro cao (`HIGH RISK`), quy trình bắt buộc kích hoạt cơ chế kiểm soát kép (`Dual Control`).
* **Yêu cầu:** Hồ sơ phải có chữ ký phê duyệt hợp lệ của Lãnh đạo Chi cục / Người quản lý (`managerReviewStatus = VERIFIED`) mới đủ điều kiện đóng thủ tục.

### 8. Không gửi thông báo tự động cho công dân (`No Automated External Citizen Notifications`)
* **Quy tắc:** Trong giai đoạn triển khai có kiểm soát, hệ thống không được tự động phát đi bất kỳ thông báo điện tử nào tới người dân.
* **Yêu cầu:** Khóa hoàn toàn các luồng gửi email, tin nhắn SMS hoặc thông báo qua Zalo/Cổng DVC Quốc gia liên quan đến số tiền thuế dự kiến hoặc thông báo nộp tiền từ phân hệ này.

### 9. Duy trì liên tục nhật ký kiểm toán (`Continuous Audit Log Persistence`)
* **Quy tắc:** Bảng nhật ký kiểm toán (`financial_obligation_audit_logs`) là hàng rào bảo vệ pháp lý tối hậu, ghi vết không thể tẩy xóa đối với mọi thao tác nghiệp vụ.
* **Yêu cầu:** Mọi hành động khởi tạo chiết tính, tải chứng từ, thẩm định xác nhận (`VERIFIED`), hoặc hoàn thành thủ tục đều phải ghi nhận trọn vẹn ID Cán bộ thực hiện (`Actor`), tên hành động (`Action`) và lý do (`Reason`). Tuyệt đối không xóa hay tắt `Audit Log`.

### 10. Sẵn sàng phương án khôi phục/vô hiệu hóa khẩn cấp (`Emergency Rollback & Feature Toggle Readiness`)
* **Quy tắc:** Quản trị viên hệ thống phải luôn chuẩn bị sẵn sàng phương án ứng phó khẩn cấp trong trường hợp phát hiện bất thường phát sinh trên môi trường triển khai thực tế.
* **Yêu cầu:** Duy trì cơ chế sao lưu định kỳ trước mỗi thay đổi lớn, đồng thời đảm bảo cờ vô hiệu hóa tính năng (`Feature Toggle / Module Disable Script`) có thể lập tức tắt tab Nghĩa vụ tài chính trên frontend và khóa API backend trong vòng 5 giây mà không làm gián đoạn các thủ tục đất đai chung.

### 11. Quản lý UX Note `ISSUE-UAT-12K-01` trong backlog (`UX Note Backlog Management`)
* **Quy tắc:** Ghi nhận và quản lý minh bạch góp ý cải tiến giao diện được phát hiện trong đợt rà soát Phase 12K: `ISSUE-UAT-12K-01 - Tooltip cho nút hoàn thành bị khóa`.
* **Yêu cầu:** Cải tiến này được chính thức đưa vào danh sách chờ (`Backlog`) để đội ngũ Frontend tối ưu hóa trong các bản cập nhật sau Release Candidate. Cam kết tuyệt đối không can thiệp sửa đổi mã nguồn (`no code changes`) trong suốt Phase 12L nhằm duy trì độ ổn định tuyệt đối cho ứng viên phát hành.
