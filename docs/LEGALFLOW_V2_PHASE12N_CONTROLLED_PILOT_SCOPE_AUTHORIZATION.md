# Văn Bản Ủy Quyền & Xác Định Phạm Vi Thí Điểm Có Kiểm Soát (Controlled Pilot Scope Authorization) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12N
## Phase 12N: Controlled Pilot Scope Authorization

> [!WARNING]
> **TÚYÊN BỐ ỦY QUYỀN VÀ BẢO MẬT THÔNG TIN (`AUTHORIZATION DISCLAIMER`):**
> Tài liệu này là văn bản ủy quyền và xác lập phạm vi vận hành thí điểm có kiểm soát (`Controlled Pilot Scope Authorization`) dành cho đơn vị được chỉ định. Tuân thủ tuyệt đối quy định bảo mật của Giai đoạn 12N, tài liệu **KHÔNG GHI NHẬN THÔNG TIN CÁ NHÂN THẬT, TÊN THẬT HAY TÀI KHOẢN NGƯỜI DÙNG THẬT** nếu chưa được cấp thẩm quyền phê duyệt chính thức bằng văn bản riêng. Mọi hành vi mở rộng phạm vi trái phép ngoài nội dung ủy quyền này đều bị nghiêm cấm.

---

## 1. Mục Đích Thí Điểm (`Pilot Purpose`)
* Kiểm chứng tính ổn định, độ liên thông và hiệu quả hỗ trợ nghiệp vụ thực tế của phân hệ **"Hỗ trợ nghiệp vụ Nghĩa vụ tài chính"** (`Financial Obligations Module`) trên giao diện LegalFlow v2.12.
* Đánh giá khả năng tối ưu hóa thời gian số hóa chứng từ nộp tiền vào Kho bạc Nhà nước và giảm thiểu sai sót trong quy trình đối chiếu hồ sơ thủ tục hành chính đất đai tại Bộ phận Một cửa và Phòng chuyên môn.
* Thử nghiệm mô hình vận hành song song (`Parallel Run`): sử dụng hệ thống LegalFlow để theo dõi tiến độ chiết tính và kiểm soát chốt chặn, đồng thời duy trì đối chiếu chứng từ giấy hợp pháp theo quy trình hành chính hiện hành.

---

## 2. Đơn Vị Tổ Chức Tham Gia Thí Điểm (`Participating Organizational Unit`)
* **Đơn vị chủ trì thí điểm (`Lead Participating Unit`):** Cơ quan quản lý hành chính đất đai / Đơn vị thí điểm UAT nội bộ được Lãnh đạo chỉ định (`Internal Pilot Unit`).
* **Phòng ban chuyên môn thụ lý (`Operating Departments`):**
  1. **Bộ phận Tiếp nhận và Trả kết quả thủ tục hành chính (`Bộ phận Một cửa - One-Stop Shop`).**
  2. **Phòng Tài nguyên & Môi trường / Chi nhánh Văn phòng Đăng ký đất đai (`Land Registration Department`).**

---

## 3. Các Vai Trò Nghiệp Vụ Được Phép (`Permitted Roles - RBAC Matrix`)
Hệ thống cấp quyền truy cập và phân định trách nhiệm cho đúng 04 nhóm vai trò chức năng:
1. **`RECEIVING_OFFICER` (Cán bộ Tiếp nhận Một cửa):** Chịu trách nhiệm tiếp nhận, rà soát ban đầu và tải lên bản scan chứng từ giấy do công dân nộp.
2. **`REVIEWING_OFFICER` (Cán bộ Thẩm định Chuyên môn):** Chịu trách nhiệm kiểm tra đối chiếu chi tiết Giấy nộp tiền Kho bạc khớp với Thông báo thuế, thực hiện xác nhận đối chiếu (`OFFICER_VERIFIED`) và hoàn thành thủ tục.
3. **`APPROVAL_MANAGER` (Lãnh đạo Phê duyệt Kép):** Chịu trách nhiệm kiểm tra nhật ký kiểm toán (`Audit Logs`) và phê duyệt kép (`Dual Control Signoff`) cho các hồ sơ xin nợ thuế hoặc rủi ro cao.
4. **`ADMIN / IT_OPS` (Quản trị viên Hệ thống):** Chịu trách nhiệm duy trì hạ tầng Docker, cấp/thu hồi tài khoản theo quyền tối thiểu (`Least Privilege`) và ngắt cờ tính năng khẩn cấp (`Feature Toggle`).

---

## 4. Danh Mục Chức Năng Được Phép (`Permitted Functions`)
* Truy cập tab **"Nghĩa vụ tài chính"** (`/financial-obligations`) trên các hồ sơ thủ tục hành chính thuộc phạm vi thí điểm.
* Xem bảng trích xuất chiết tính dự kiến sơ bộ (`Draft Preliminary Estimate`) kèm khung cảnh báo màu vàng (`Safety Banner`).
* Tải lên (`Upload`), xem và tải xuống các tệp scan đính kèm dạng PDF/Hình ảnh của **Thông báo thuế** (`Tax Notice`) và **Giấy nộp tiền Kho bạc** (`Payment Evidence`).
* Thực hiện thao tác nhấp xác nhận đối chiếu hợp lệ (`OFFICER_VERIFIED = true`) bởi `REVIEWING_OFFICER`.
* Thực hiện phê duyệt kiểm soát kép (`Manager Review PENDING -> VERIFIED`) bởi `APPROVAL_MANAGER`.
* Nhấp nút **"Hoàn thành thủ tục"** (`Complete Procedure`) khi tất cả các điều kiện rào chắn đã đạt đủ.
* Tra cứu nhật ký kiểm toán truy vết lịch sử thao tác (`Audit Logs Table`).

---

## 5. Danh Mục Chức Năng Bị Nghiêm Cấm (`Prohibited Functions`)
* **`CẤM` tự ý ban hành thông báo thuế:** Tuyệt đối không tự ý lập, in ấn hay ký số thông báo nộp tiền sử dụng đất chính thức trên giao diện LegalFlow để thay thế Chi cục Thuế.
* **`CẤM` sử dụng số dự kiến làm số pháp lý:** Không được phép trích xuất hay ghi nhận con số chiết tính AI (`officialAmount = null`) vào các văn bản quyết định hành chính chính thức.
* **`CẤM` vượt quyền hạn thẩm định (`No Separation of Duties Violation`):** Cán bộ Tiếp nhận không được tự ý thao tác hoặc dùng tài khoản thẩm định để xác nhận chứng từ.
* **`CẤM` bấm hoàn thành khi hồ sơ thiếu chứng từ nộp tiền:** Không được thao tác hoàn thành thủ tục nếu công dân chưa nộp tiền vào Kho bạc hoặc chưa có bản scan Giấy nộp tiền hợp lệ.
* **`CẤM` tự động hóa gửi tin nhắn cho công dân:** Cấm tích hợp hoặc chạy các công cụ ngoại vi (`zalo-bot, sms-gateway, mailer script`) để gửi thông báo tự động ra bên ngoài cho người sử dụng đất.
* **`CẤM` can thiệp cấu trúc và mã nguồn:** Quản trị viên và kỹ thuật viên cấm chạy lệnh migration mới, cấm seed thêm dữ liệu, cấm sửa đổi code backend/frontend trong suốt thời gian pilot.

---

## 6. Danh Mục Dữ Liệu Được Phép (`Permitted Data`)
* **Dữ liệu mô phỏng chuẩn hóa (`Standardized Mock Data`):** Chỉ được phép thao tác, thử nghiệm chức năng và luồng rà soát trên bộ **08 hồ sơ mô phỏng kiểm soát** mang tiền tố bắt buộc **`DEMO-FO-UAT-01` đến `DEMO-FO-UAT-08`**.
* **Tệp scan chứng từ mẫu (`Pilot Sample Scans`):** Các tệp scan mẫu Thông báo thuế và Giấy nộp tiền không chứa thông tin định danh cá nhân thật, phục vụ việc kiểm chứng quy trình upload và rà soát thủ công của chuyên viên.

---

## 7. Danh Mục Dữ Liệu Bị Cấm (`Prohibited Data`)
* **`CẤM` sử dụng dữ liệu công dân thật:** Tuyệt đối không nhập họ tên thật, số Căn cước công dân (`CCCD`) thật, mã số thuế cá nhân thật, địa chỉ thật hay số hiệu thửa đất thực tế ngoài đời vào môi trường kiểm thử pilot.
* **`CẤM` nhập số hiệu thông báo thuế chính thức thật:** Không sử dụng các quyết định hoặc thông báo thuế pháp lý thực tế đang có hiệu lực của cơ quan thuế để test.
* **`CẤM` thao tác trên hồ sơ thực tế trong DB (`TTHC-2026-*`):** Các hồ sơ thủ tục hành chính thật đang lưu trong cơ sở dữ liệu (`TTHC-2026-0001..0003`) được bảo vệ nghiêm ngặt, cấm can thiệp hoặc bấm thử nghiệm nghiệp vụ nghĩa vụ tài chính.

---

## 8. Thời Gian & Điều Kiện Thí Điểm (`Pilot Duration, Start & End Conditions`)
* **Thời Gian Thí Điểm (`Pilot Duration`):** Dự kiến kéo dài **30 ngày làm việc** kể từ ngày được cấp thẩm quyền ký văn bản Quyết định Go-Live (dự kiến tại Phase 12O).
* **Điều Kiện Khởi Động (`Start Conditions - Go-Live Prerequisites`):**
  1. Lệnh kiểm tra sức khỏe hạ tầng (`health-check.ps1`) đạt `4/4 PASS` trên máy chủ UAT chuyên dụng sạch cổng 9000.
  2. Mã băm SHA-256 (`Checksum / Manifest`) của bản sao lưu cơ sở dữ liệu ngay trước thời điểm kích hoạt pilot được rà soát và xác nhận.
  3. Văn bản Quyết định Go/No-Go (`Phase 12N Decision Report`) có đủ 03 chữ ký của Lãnh đạo Đơn vị Thí điểm, Quản trị viên Bảo mật và Tech Lead.
* **Điều Kiện Kết Thúc / Dừng Thí Điểm (`End Conditions / Exit Criteria`):**
  - Hoàn tất thời hạn 30 ngày và lập báo cáo tổng kết nghiệm thu đợt thí điểm (`Pilot Evaluation Report`).
  - Hoặc kích hoạt lệnh dừng khẩn cấp (`Emergency Stop Trigger`) khi xảy ra bất kỳ sự cố vi phạm nghiêm trọng nào quy định tại `MONITORING_STOP_AND_ESCALATION_CRITERIA.md`.

---

## 9. Khung Trách Nhiệm Nhân Sự Vận Hành (`Responsible Officers Framework`)

*(Ghi chú tuân thủ Phase 12N: Bảng dưới đây xác định chức danh và phạm vi trách nhiệm quản trị, chưa ghi nhận tên cá nhân thực tế hoặc tài khoản hệ thống cho đến khi được cung cấp và phê duyệt chính thức).*

| Chức Danh Quản Trị (`Governance Title`) | Vai Trò & Thẩm Quyền (`Role & Authority`) | Nhiệm Vụ Cam Kết (`Key Responsibilities`) |
| :--- | :--- | :--- |
| **Chủ Sở Hữu Thí Điểm (`Pilot Owner / Business Owner`)** | Lãnh đạo Cơ quan / Đơn vị Thí điểm UAT | Chịu trách nhiệm phê duyệt cao nhất về phạm vi triển khai, chỉ đạo điều hành quy trình đối chiếu song song và ra quyết định dừng/tiếp tục đợt thí điểm. |
| **Chủ Sở Hữu Kỹ Thuật (`Technical Owner / Tech Lead`)** | Trưởng Đội ngũ Kỹ thuật LegalFlow | Chịu trách nhiệm bảo đảm tính toàn vẹn của mã nguồn (`Git clean tree`), cấu trúc cơ sở dữ liệu và hỗ trợ xử lý kỹ thuật khi có lỗi phát sinh. |
| **Quản Trị Viên Bảo Mật (`Security & Privacy Reviewer`)** | Chuyên trách Bảo mật / IT Security Lead | Chịu trách nhiệm rà soát an toàn hệ thống, kiểm soát việc cô lập mạng (`No Public Tunnel`), giám sát nhật ký truy cập và đảm bảo không lộ lọt thông tin. |
| **Quản Trị Viên Hạ Tầng (`System Admin / IT_OPS`)** | Kỹ thuật viên Vận hành Máy chủ UAT | Chịu trách nhiệm duy trì stack Docker (`postgres, minio, caddy`), thực hiện sao lưu định kỳ, quản lý phân quyền tối thiểu và ngắt module khẩn cấp khi có yêu cầu. |

---

## 10. Khối Phê Duyệt Văn Bản Ủy Quyền (`Authorization Signoff Fields`)

> **Lời chứng ủy quyền:** *"Chúng tôi, những người có thẩm quyền dưới đây, chính thức phê chuẩn phạm vi thí điểm nội bộ có kiểm soát cho phân hệ Nghĩa vụ tài chính trên hệ thống LegalFlow v2.12 theo đúng các giới hạn và điều kiện ghi trong văn bản này."*

| Thẩm Quyền Phê Duyệt (`Authority Role`) | Chức Vụ (`Title / Department`) | Quyết Định (`Status`) | Ngày Ký (`Date`) | Chữ Ký Xác Nhận (`Signature`) |
| :--- | :--- | :---: | :---: | :---: |
| **PILOT_UNIT_HEAD** | Lãnh đạo Đơn vị Thí điểm UAT | `PENDING SIGNOFF` | [____/____/2026] | ____________________ |
| **IT_SECURITY_LEAD** | Chuyên trách An toàn Bảo mật | `PENDING SIGNOFF` | [____/____/2026] | ____________________ |
| **LEGALFLOW_TECH_LEAD** | Trưởng Đội ngũ Phát triển | `PENDING SIGNOFF` | [____/____/2026] | ____________________ |
