# Ma Trận Phạm Vi Thí Điểm & Phân Quyền Truy Cập (Pilot Scope & Access Matrix) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12M
## Phase 12M: Pilot Scope and Access Matrix

> [!NOTE]
> **TÓM TẮT PHÂN QUYỀN VÀ BẢO MẬT TRUY CẬP (`ACCESS SECURITY SUMMARY`):**
> Tài liệu này quy định rõ phạm vi môi trường thí điểm, ma trận phân quyền theo vai trò (`Role-Based Access Control - RBAC`), danh mục hành vi được phép/bị cấm và quy tắc cấp/thu hồi tài khoản.
> **Lưu ý bảo mật:** Tài liệu hoàn toàn không ghi nhận tên riêng, tài khoản thực tế hay mật khẩu/bí mật hệ thống nhằm tuân thủ tuyệt đối quy tắc an toàn thông tin Phase 12M.

---

## 1. Môi Trường Thí Điểm & Đơn Vị Tham Gia (`Pilot Environment & Participating Unit`)
* **Môi Trường Thí Điểm (`Pilot Environment`):** Môi trường UAT nội bộ có kiểm soát (`Internal UAT Pilot Server`), hoạt động trên kiến trúc Docker khép kín (`legalflow_postgres`, `legalflow_minio`, `legalflow_caddy`). Không kết nối hoặc expose ra mạng Internet công cộng (`No Public Tunnels / No Ngrok`).
* **Đơn Vị Tham Gia (`Participating Unit`):** Bộ phận Tiếp nhận & Trả kết quả thủ tục hành chính (`Bộ phận Một cửa`) và Phòng chuyên môn xử lý hồ sơ đất đai thuộc Cơ quan thí điểm nội bộ.

---

## 2. Nhóm Người Dùng Được Cấp Quyền (`Authorized User Groups`)
Hệ thống phân định 04 nhóm vai trò người dùng nội bộ được phép truy cập và xử lý nghiệp vụ tại phân hệ Nghĩa vụ tài chính:
1. **Cán bộ Tiếp nhận (`RECEIVING_OFFICER`):** Cán bộ trực tại Bộ phận Một cửa, chịu trách nhiệm tiếp nhận hồ sơ, kiểm tra ban đầu và số hóa chứng từ giấy do người dân nộp.
2. **Cán bộ Thẩm định (`REVIEWING_OFFICER`):** Chuyên viên phòng tài nguyên/đất đai, chịu trách nhiệm rà soát chi tiết, đối chiếu chứng từ thanh toán kho bạc với thông báo thuế và xác nhận chữ ký.
3. **Lãnh đạo Phê duyệt (`APPROVAL_MANAGER`):** Lãnh đạo chi cục hoặc người quản lý phòng ban, chịu trách nhiệm kiểm tra và phê duyệt kép (`Dual Control`) đối với hồ sơ rủi ro cao hoặc có chiết tính đặc biệt.
4. **Quản trị Viên Hệ thống (`ADMIN / IT_OPS`):** Nhóm kỹ thuật vận hành, chịu trách nhiệm quản trị tài khoản, bảo trì hạ tầng, sao lưu dữ liệu và kiểm soát rào chắn hệ thống.

---

## 3. Ma Trận Phân Quyền Theo Vai Trò (`Role & Permission Matrix`)

| Chức Nang & Thao Tác Nghiệp Vụ (`Action / Capability`) | Cán bộ Tiếp nhận (`RECEIVING_OFFICER`) | Cán bộ Thẩm định (`REVIEWING_OFFICER`) | Lãnh đạo Phê duyệt (`APPROVAL_MANAGER`) | Quản trị viên (`ADMIN`) |
| :--- | :---: | :---: | :---: | :---: |
| Mở và xem tab "Nghĩa vụ tài chính" trên hồ sơ | **`CHO PHÉP`** | **`CHO PHÉP`** | **`CHO PHÉP`** | **`CHO PHÉP`** |
| Xem bảng chiết tính sơ bộ dự kiến (`Draft Estimate`) | **`CHO PHÉP`** | **`CHO PHÉP`** | **`CHO PHÉP`** | **`CHO PHÉP`** |
| Tải lên bản sao Thông báo thuế (`Upload Tax Notice`) | **`CHO PHÉP`** | **`CHO PHÉP`** | `KHÔNG` | **`CHO PHÉP`** |
| Tải lên Chứng từ nộp tiền (`Upload Payment Evidence`) | **`CHO PHÉP`** | **`CHO PHÉP`** | `KHÔNG` | **`CHO PHÉP`** |
| Đối chiếu & Xác nhận hợp lệ (`Officer Verification`) | `KHÔNG` | **`CHO PHÉP`** | **`CHO PHÉP`** | `KHÔNG` |
| Phê duyệt Lãnh đạo kép (`Manager Review Approval`) | `KHÔNG` | `KHÔNG` | **`CHO PHÉP`** | `KHÔNG` |
| Bấm hoàn thành thủ tục (`Complete Procedure`) | `KHÔNG` | **`CHO PHÉP`** | **`CHO PHÉP`** | `KHÔNG` |
| Xem nhật ký kiểm toán (`View Audit Logs`) | `KHÔNG` | **`CHO PHÉP`** | **`CHO PHÉP`** | **`CHO PHÉP`** |
| Tắt/Bật phân hệ khẩn cấp (`Feature Toggle / Disable`) | `KHÔNG` | `KHÔNG` | `KHÔNG` | **`CHO PHÉP`** |

---

## 4. Hành Vi Được Phép & Bị Nghiêm Cấm (`Allowed vs. Prohibited Actions`)

### A. Danh Mục Hành Vi Được Phép (`Allowed Actions`)
- Rà soát các khoản mục chiết tính sơ bộ (`isEstimate: true`) để hướng dẫn người dân chuẩn bị hồ sơ theo quy trình.
- Tải lên các tệp PDF/Scan rõ nét, hợp lệ của Thông báo nộp tiền sử dụng đất gốc do Chi cục Thuế ban hành.
- Tải lên Giấy nộp tiền vào ngân sách nhà nước mang số hiệu hợp lệ của Kho bạc hoặc Ngân hàng ủy nhiệm thu.
- Thực hiện xác nhận đối chiếu (`OFFICER_VERIFIED`) khi số tiền trên Giấy nộp tiền khớp 100% với Thông báo thuế.
- Nhấp hoàn thành thủ tục đối với các hồ sơ đã đủ điều kiện an toàn (`Sufficient Conditions`).

### B. Danh Mục Hành Vi Bị Nghiêm Cấm (`Prohibited Actions`)
- **Cấm tự ý phát hành thông báo thuế:** Tuyệt đối không tự tạo lập, in ấn hay ký số thông báo thuế chính thức trên LegalFlow.
- **Cấm sử dụng số dự kiến làm số chính thức:** Không được nhập hay sao chép con số AI draft vào các văn bản pháp lý chính thức.
- **Cấm hoàn thành khi chưa nộp tiền:** Không được bấm hoàn thành khi hồ sơ mới chỉ có thông báo thuế mà chưa có chứng từ nộp tiền vào kho bạc.
- **Cấm vượt thẩm quyền rà soát:** Cán bộ Tiếp nhận không được tự ý thực hiện xác nhận thẩm định của Cán bộ Thẩm định (`Separation of Duties`).
- **Cấm tự gửi thông báo ra bên ngoài:** Không được sử dụng bất kỳ công cụ ngoài nào hoặc tự gán script để gửi email, SMS hay Zalo cho công dân.
- **Cấm sử dụng dữ liệu công dân thật trong môi trường kiểm thử:** Trong quá trình pilot test, tuyệt đối không nhập tên, CCCD hay số thửa thật của công dân ngoài đời thực.

---

## 5. Rào Chắn Dữ Liệu Demo & Kiểm Thử (`Test/Demo Data Restrictions`)
* **Quy tắc cô lập dữ liệu (`Data Isolation`):** Mọi kịch bản thử nghiệm tính năng hoặc hướng dẫn sử dụng trong suốt Phase 12M và giai đoạn UAT Pilot bắt buộc phải thao tác trên bộ 08 hồ sơ mô phỏng kiểm soát mang tiền tố định danh **`DEMO-FO-UAT-`** (`case 01..08`).
* **Bảo vệ hồ sơ thật (`Real Cases Integrity`):** Tuyệt đối cấm thao tác thử nghiệm, tải lên chứng từ giả định hoặc tự ý bấm nút hoàn thành (`Complete Procedure`) trên các hồ sơ thủ tục hành chính thật (`TTHC-2026-0001..0003`) đang tồn tại trong cơ sở dữ liệu.

---

## 6. Trách Nhiệm Đối Chiếu Của Cán Bộ & Kiểm Soát Lãnh Đạo (`Officer Responsibility & Manager Review`)
* **Trách Nhiệm Cán Bộ Thẩm Định (`Officer Verification Responsibility`):** Cán bộ là chốt chặn an toàn nghiệp vụ tối cao. Khi nhấp nút "Xác nhận đối chiếu chứng từ hợp lệ", Cán bộ cam kết đã rà soát thủ công bản scan Giấy nộp tiền Kho bạc, đảm bảo khớp đúng số tiền, đúng số thửa đất với Thông báo thuế của Chi cục Thuế.
* **Kiểm Soát Kép Của Lãnh Đạo (`Manager Review Conditions`):** Luồng kiểm soát kép (`Dual Control / Manager Review PENDING -> VERIFIED`) tự động kích hoạt và bắt buộc phải có chữ ký phê duyệt của Lãnh đạo đối với các trường hợp:
  1. Hồ sơ xin ghi nợ tiền sử dụng đất (`DEMO-FO-UAT-07`).
  2. Hồ sơ thuộc diện miễn, giảm tiền sử dụng đất với giá trị lớn theo quy định.
  3. Hồ sơ bị hệ thống gắn cờ cảnh báo rủi ro cao (`HIGH RISK`).

---

## 7. Quy Tắc Cấp Phát & Thu Hồi Tài Khoản (`Account Provisioning & De-provisioning Rules`)
1. **Nguyên tắc quyền hạn tối thiểu (`Least Privilege`):** Mỗi cán bộ chỉ được cấp một tài khoản duy nhất gắn đúng với vai trò nghiệp vụ thực tế (`RECEIVING_OFFICER` hoặc `REVIEWING_OFFICER`). Không cấp tài khoản có quyền `ADMIN` cho cán bộ xử lý hồ sơ.
2. **Quy trình cấp tài khoản (`Provisioning`):** Việc khởi tạo tài khoản mới phải có văn bản đề nghị từ Lãnh đạo đơn vị thí điểm, được Quản trị viên hệ thống thực hiện và phân quyền trong bảng `users` với mã hóa mật khẩu an toàn (`bcrypt/argon2`).
3. **Quy trình thu hồi tài khoản (`De-provisioning`):** Khi cán bộ chuyển công tác, nghỉ phép dài hạn hoặc kết thúc đợt thí điểm, Quản trị viên hệ thống có trách nhiệm vô hiệu hóa tài khoản (`isActive = false`) trong vòng 24 giờ.
4. **Cấm chia sẻ tài khoản (`No Account Sharing`):** Mọi hành vi dùng chung tài khoản hoặc chia sẻ mật khẩu đều bị nghiêm cấm nhằm đảm bảo tính chính xác và minh bạch cho nhật ký kiểm toán (`Audit Logs`).
