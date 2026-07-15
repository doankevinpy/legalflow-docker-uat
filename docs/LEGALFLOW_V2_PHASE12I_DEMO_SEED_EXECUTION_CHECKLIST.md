# Danh Mục Kiểm Tra An Toàn Trước Khi Thực Thi Nạp Dữ Liệu Demo (Demo Seed Execution Checklist) - Giai Đoạn 12I
## Phase 12I: Demo Seed Execution Checklist

> [!CAUTION]
> **QUYẾT ĐỊNH NGHIỆM THU AN TOÀN TRƯỚC NẠP (PRE-SEED SAFETY DECISION):**
> **`READY FOR CONTROLLED DEMO SEED PLAN ONLY`**
> *(Lý do: Phase 12I là giai đoạn tài liệu hóa Kế hoạch Dry-run, chưa thực thi seed thật trong DB. Toàn bộ quy trình và checklist an toàn dưới đây được thiết lập hoàn chỉnh để chuẩn bị cho quyết định `READY FOR CONTROLLED DEMO SEED` chính thức tại Phase 12J sau khi được Lãnh đạo phê duyệt)*.

---

## Danh Mục Rà Soát Trước Khi Thực Thi Nạp Dữ Liệu (Pre-Seed Execution Checklist)
Trước khi Quản trị viên (Admin/DevOps) thực hiện chạy lệnh seed dữ liệu mô phỏng (`seed-uat-fo-cases.ts`) tại Phase 12J, toàn bộ 12 hạng mục dưới đây phải đạt trạng thái **`PASS (ĐẠT)`**:

| STT | Hạng Mục Kiểm Tra (Audit Item) | Tiêu Chuẩn Kỹ Thuật & An Toàn (Safety Standard) | Trạng Thái Kiểm Chứng (Audit Status) | Ghi Chú / Xác Nhận (Verification Note) |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Trạng thái Git (Git Working Tree Clean)** | Working directory sạch, không có tệp code đang chỉnh sửa dở dang (`uncommitted modifications`) có thể gây xung đột với logic seed. | `READY` | Kiểm tra bằng lệnh `git status`. |
| **2** | **Đúng Đường Cơ Sở (Correct Baseline Tag)** | HEAD của Git repository đang đứng chính xác tại tag baseline gần nhất đã được kiểm chứng kiến trúc. | `READY` | Đảm bảo hệ thống ở đúng tag chuyển tiếp (`v2.12.8-financial-obligation-demo-data-seed-dry-run-plan`). |
| **3** | **Sao lưu Database trước Seed (Pre-seed Backup)** | Đã thực hiện sao lưu toàn bộ cơ sở dữ liệu `legalflow_prod` thành tệp `pre_fo_seed_execution_phase12j.sql` và đã kiểm chứng kích thước tệp > 0KB. | `REQUIRED AT PHASE 12J` | Bắt buộc chạy `pg_dump` trước khi execute seed script. |
| **4** | **Xác nhận Môi trường Phân lập (Environment Verification)** | Đã kiểm tra chuỗi kết nối DB và xác nhận môi trường thực thi là UAT/Dev Container (`legalflow_postgres`), tuyệt đối không phải cơ sở dữ liệu production thực tế của Chi cục. | `READY` | Kiểm tra port `5432` trên Docker local, xác nhận không trỏ ra IP máy chủ sản xuất ngoại vi. |
| **5** | **Không chứa Dữ liệu Công dân Thật (No Real Citizen Data)** | Rà soát payload của 8 kịch bản `DEMO-FO-UAT-01..08` xác nhận 100% tên công dân là `Người dân Demo 01..08`, CCCD là dãy số giả định (`000000000101..`), số thửa giả định. | `READY` | Đối chiếu 100% với Bảng đặc tả Phase 12H. |
| **6** | **Gắn nhãn `DEMO ONLY` đầy đủ (Safety Labeling Included)** | Toàn bộ các bản ghi và trường ghi chú đều tích hợp chuỗi nhận diện: `DEMO ONLY - NOT REAL CITIZEN DATA`. | `READY` | Đảm bảo minh bạch trong Audit Log. |
| **7** | **Không có Số tiền Chính thức Thật (No Official Tax Amount)** | Các hồ sơ chưa có giấy nộp tiền hợp lệ (`DEMO-FO-UAT-01, 02, 08`) có trường `officialAmount = null`. Số liệu chiết tính AI chỉ lưu trong `estimatedAmount` kèm nhãn `DEMO ESTIMATE`. | `READY` | Ngăn ngừa lỗi nhầm lẫn số liệu dự kiến thành số tiền thuế nộp Kho bạc. |
| **8** | **Không có Thông báo Thuế Chính thức (No Official Tax Notice)** | Tệp PDF mô phỏng thông báo thuế đính kèm mang nhãn nước (watermark) rõ ràng `DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT`. | `READY` | Tuân thủ đặc tả chứng từ Phase 12H. |
| **9** | **Không có Biên lai Nộp tiền Thật (No Real Payment Receipt)** | Tệp PDF mô phỏng chứng từ thanh toán đính kèm mang nhãn nước rõ ràng `DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`. | `READY` | Không có giá trị chứng minh tài chính thực tế. |
| **10** | **Sẵn sàng Lệnh Khôi phục (Rollback Commands Available)** | Đã chuẩn bị sẵn và kiểm tra cú pháp cho cả 2 phương án khôi phục: `Targeted Cleanup SQL` (xóa riêng `DEMO-FO-%`) và `Full Database Restore` từ tệp `.sql`. | `READY` | Sẵn sàng ứng phó trong vòng 30 giây nếu seed lỗi. |
| **11** | **Quy trình Kiểm chứng Sau nạp (Post-seed Verification Plan)** | Có sẵn tập lệnh SQL hoặc kịch bản kiểm tra tự động (`Post-seed Audit`) để xác minh đúng số lượng 8 bản ghi và các cờ trạng thái chốt chặn sau khi seed. | `READY` | Xem chi tiết tại Kế hoạch Rollback & Verification Phase 12I. |
| **12** | **Phê duyệt Vận hành (Operator Approval)** | Có sự đồng ý và phê duyệt Go-Ahead của Quản trị viên hệ thống / Trưởng nhóm kiểm thử UAT trước khi nhấn lệnh khởi chạy seed. | `REQUIRED AT PHASE 12J` | Chốt chặn quản trị con người cuối cùng. |

---

## Tổng Kết Đánh Giá Quyết Định (Conclusion)
Tại thời điểm hoàn thành Phase 12I, dựa trên việc toàn bộ 12 tiêu chí đã được chuẩn bị, kiểm chứng tài liệu hóa và đặt chế độ sẵn sàng cho đợt thi hành tiếp theo, kết luận nghiệm thu được xác nhận:

**`READY FOR CONTROLLED DEMO SEED PLAN ONLY`**

*(Ghi chú: Khi bước sang Phase 12J, ngay sau khi Quản trị viên hoàn tất mục STT 3 (Backup DB) và STT 12 (Operator Approval), trạng thái sẽ tự động nâng cấp thành **`READY FOR CONTROLLED DEMO SEED`** để tiến hành chèn dữ liệu)*.
