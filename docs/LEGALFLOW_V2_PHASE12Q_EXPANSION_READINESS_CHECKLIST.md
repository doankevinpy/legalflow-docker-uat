# Danh Mục Kiểm Tra Cổng Sẵn Sàng Mở Rộng (`Expansion Readiness Checklist`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12Q
## Phase 12Q: Pilot Expansion Readiness Checklist & Audit Gates

> [!CAUTION]
> **TÚYÊN BỐ CỔNG KIỂM SOÁT MỞ RỘNG (`EXPANSION GOVERNANCE MANDATE`):**
> Tài liệu này thiết lập danh mục kiểm tra 05 Cổng điều kiện để chuẩn bị cho việc đề xuất mở rộng ứng dụng. Việc đạt một số tiêu chí về mặt kỹ thuật trong giới hạn dữ liệu mô phỏng **KHÔNG ĐỒNG NGHĨA VỚI VIỆC TỰ ĐỘNG MỞ RỘNG (`No Automatic Expansion Go-Live`)**. Việc sử dụng dữ liệu thực tế và triển khai sang các đơn vị hành chính mới vẫn bị chặn đứng (`BLOCKED`) cho đến khi hoàn tất đủ các thủ tục hành chính, pháp lý và sự đồng thuận liên ngành.

---

## Bảng Rà Soát 05 Cổng Sẵn Sàng Mở Rộng (`5-Expansion Readiness Gates Table`)

| Mã Cổng (`Gate ID`) | Tiêu Chí Kiểm Tra (`Readiness Criteria`) | Trạng Thái Hiện Tại (Theo Bằng Chứng) (`Audit Status`) | Hành Động Bắt Buộc Trước Mở Rộng (`Required Action`) | Có Chặn Mở Rộng? (`Blocks Expansion?`) |
| :---: | :--- | :--- | :--- | :---: |
| **`EX-GATE-01`** | **Mã nguồn không phát sinh lỗi chặn.** Hệ thống không ghi nhận lỗi Critical/High/Blocking trong thời gian thử nghiệm. | **`READY (trong phạm vi Demo)`**<br>Bằng chứng: Sổ đăng ký sự cố `ISSUE_INCIDENT_REGISTER.md` ghi nhận 0 lỗi chặn. | Duy trì bảo mật mã nguồn trong các lần cập nhật hệ thống. | `NO` |
| **`EX-GATE-02`** | **Cơ sở dữ liệu an toàn & phương án Rollback.** Khả năng phục hồi hệ thống nguyên trạng, bảo vệ bản ghi thực tế. | **`READY (trong phạm vi Demo)`**<br>Bằng chứng: RPO = 0 được xác nhận trên 03 hồ sơ TTHC thật. | Tuân thủ lịch sao lưu hệ thống định kỳ. | `NO` |
| **`EX-GATE-03`** | **Phân quyền người dùng & giới hạn mạng UAT.** Truy cập chỉ được phép từ môi trường an toàn nội bộ. | **`READY (trong phạm vi Demo)`**<br>Bằng chứng: Security Lead đánh giá LOW rủi ro tại `INTERIM_SAFETY_REVIEW.md`. | Thiết lập cấu trúc người dùng chuẩn mực khi mở rộng địa bàn triển khai. | `NO` |
| **`EX-GATE-04`** | **Thỏa thuận hành chính & phối hợp liên thông Thuế.** Phải có biên bản phối hợp chính thức giữa Đơn vị Một cửa và Cơ quan Thuế. | **`PENDING EVIDENCE`**<br>Hiện tại chưa có bằng chứng xác nhận Thỏa thuận liên ngành. Thử nghiệm hiện tại chỉ giới hạn trong môi trường UAT mô phỏng. | Yêu cầu Lãnh đạo các Đơn vị liên quan ký Biên bản Quy chế phối hợp thụ lý hồ sơ thuế. | **`YES (BLOCKS)`** |
| **`EX-GATE-05`** | **Hoàn thiện các vấn đề UX chưa giải quyết.** Khắc phục tooltip lỗi hiển thị và đề xuất tải ZIP hàng loạt. | **`PENDING CLEARANCE`**<br>Hai điểm yếu UX vẫn đang được lưu trữ trong Backlog chờ xử lý. | Giải quyết các điểm tồn đọng trong lộ trình kỹ thuật tương lai (đề xuất phát hành `v2.13.0`). | **`YES (BLOCKS)`** |

> **PROPOSED FUTURE ROADMAP – SUBJECT TO APPROVAL:**
> Các yêu cầu chưa đạt (Pending) tại Cổng 4 và 5 được kiến nghị đưa vào lộ trình phát triển và hoàn thiện tiếp theo. Khái niệm cập nhật `v2.13.0` chỉ là tên gọi dự thảo, hoàn toàn phụ thuộc vào kế hoạch triển khai của Ban Quản lý Dự án và thẩm quyền phê duyệt chính thức. Đội ngũ Kỹ thuật không mặc định quá trình mở rộng đã được đồng thuận.
