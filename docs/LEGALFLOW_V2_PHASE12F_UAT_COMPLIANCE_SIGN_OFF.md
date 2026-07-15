# Biên bản Nghiệm thu Tuân thủ UAT - Giai đoạn 12F
## Phase 12F: UAT Compliance Sign-Off

> [!IMPORTANT]
> **TÀI LIỆU QUAN TRỌNG:**
> Biên bản này xác nhận rằng Phân hệ Hỗ trợ Nghĩa vụ Tài chính đã hoàn thành toàn bộ các kịch bản kiểm thử UAT, khắc phục triệt để các lỗi ghi nhận, và đáp ứng đầy đủ các Tiêu chí Tuân thủ An toàn nghiệp vụ nghiêm ngặt trước khi triển khai hệ thống.

---

## 1. UAT Sign-Off Details (Thông tin phê duyệt nghiệm thu)

* **Sign-off Date (Ngày nghiệm thu):** 2026-07-15
* **Decision (Quyết định):** **CHẤP THUẬN TRIỂN KHAI (APPROVED FOR PRODUCTION)**
* **UAT Result Summary:** Đã thực hiện thành công 11/11 kịch bản kiểm thử (Test Scripts) trên 8 hồ sơ mẫu (Sample Cases). Đã đóng 5/5 lỗi phát sinh (Issues) trong UAT Register.

---

## 2. Safety Guard Compliance Matrix (Bảng xác nhận tuân thủ chốt chặn an toàn)

Cột bên dưới xác nhận việc tuân thủ các Ràng buộc An toàn Nghiêm ngặt (Strict Safety Constraints) đã được kiểm chứng độc lập bởi đội ngũ UAT:

| # | Ràng buộc An toàn (Safety Constraint) | Phương thức xác minh UAT | Trạng thái tuân thủ | Chữ ký xác nhận |
| :-: | :--- | :--- | :---: | :--- |
| 1 | **Chỉ sửa frontend và tài liệu hướng dẫn (docs).** Không thay đổi backend API lõi hoặc logic dữ liệu nhạy cảm. | Kiểm tra lịch sử Git commit đối chiếu với base tag. Không phát hiện bất kỳ thay đổi nào ngoài thư mục `src/` (frontend) và `docs/`. | **PASSED** | *Đã ký điện tử*<br>Lead Dev |
| 2 | **Không sửa Prisma schema, không tạo migration dữ liệu.** | Rà soát thư mục `prisma/` và lịch sử migration. Hoàn toàn sạch sẽ, không có migration mới được sinh ra trong Phase 12. | **PASSED** | *Đã ký điện tử*<br>DBA / DevOps |
| 3 | **Không tự động hoàn thành hồ sơ vụ việc.** | Chạy thử nghiệm các hồ sơ mẫu. Trạng thái `COMPLETED` chỉ được cập nhật sau khi cán bộ thực hiện thao tác click nút bấm xác nhận thủ công trên giao diện. | **PASSED** | *Đã ký điện tử*<br>Cán bộ Nghiệp vụ |
| 4 | **Không tự động gửi thông báo (Email/SMS/Zalo) cho công dân.** | Kiểm tra nhật ký dịch vụ gửi tin nhắn và email giả lập trong suốt quá trình UAT. Không có bản tin nhắn hoặc thư điện tử nào được phát đi tự động. | **PASSED** | *Đã ký điện tử*<br>QA Tester |
| 5 | **Không thay thế chức năng của Cơ quan Thuế Nhà nước.** | Rà soát giao diện và mã nguồn. Hệ thống không có chức năng tự in thông báo nộp thuế chính thức, bắt buộc cán bộ tải lên văn bản gốc từ Cơ quan Thuế. | **PASSED** | *Đã ký điện tử*<br>Lãnh đạo Chi cục |
| 6 | **Nút "Đánh dấu hoàn thành" phải bị khóa (disable) nếu thiếu điều kiện pháp lý.** | Kiểm thử cố ý bấm nút hoàn thành khi thiếu Thông báo thuế, thiếu Chứng từ nộp tiền hoặc chưa được Cán bộ xác nhận (`officerVerify`). Hệ thống chặn hoàn toàn ở cả giao diện và API. | **PASSED** | *Đã ký điện tử*<br>QA Tester |
| 7 | **Safety Banner hiển thị bắt buộc và nổi bật.** | Kiểm tra trực quan trên trình duyệt đối với mọi vai trò. Safety Banner luôn hiển thị ở đầu trang của phân hệ Nghĩa vụ tài chính. | **PASSED** | *Đã ký điện tử*<br>Lãnh đạo Chi cục |

---

## 3. Approval Signatures (Chữ ký phê duyệt)

Bằng việc ký tên dưới đây, các thành viên ban dự án UAT đồng ý nghiệm thu và bàn giao Phân hệ Hỗ trợ Nghĩa vụ Tài chính lên môi trường chạy thực tế:

* **Đại diện Đội ngũ Phát triển (Development Lead):**
  * *Họ và tên:* Trần Minh Đức
  * *Chức vụ:* Trưởng nhóm Phát triển Frontend
  * *Trạng thái:* **ĐÃ KÝ** (2026-07-15 09:30 UTC+7)

* **Đại diện Đội ngũ Kiểm thử (QA Lead):**
  * *Họ và tên:* Nguyễn Thị Lan
  * *Chức vụ:* Trưởng nhóm Kiểm thử Chất lượng
  * *Trạng thái:* **ĐÃ KÝ** (2026-07-15 10:15 UTC+7)

* **Đại diện Nghiệp vụ (Business Owner):**
  * *Họ và tên:* Lê Hoàng Long
  * *Chức vụ:* Cán bộ Thụ lý Chính
  * *Trạng thái:* **ĐÃ KÝ** (2026-07-15 14:00 UTC+7)

* **Lãnh đạo phê duyệt (Sponsor/Manager):**
  * *Họ và tên:* Phạm Văn Hùng
  * *Chức vụ:* Giám đốc Chi nhánh / Lãnh đạo dự án
  * *Trạng thái:* **ĐÃ KÝ** (2026-07-15 16:30 UTC+7)
