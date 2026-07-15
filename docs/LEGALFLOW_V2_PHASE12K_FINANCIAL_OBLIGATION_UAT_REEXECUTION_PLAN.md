# Kế Hoạch Thực Thi Lại Nghiệm Thu Người Dùng (UAT Re-execution Plan) Phân Hệ Nghĩa Vụ Tài Chính với Dữ Liệu Demo - Giai Đoạn 12K
## Phase 12K: Financial Obligation Pilot UAT Re-execution with Demo Data Plan

> [!WARNING]
> **NHÃN CẢNH BÁO AN TOÀN PHÁP LÝ BẮT BUỘC:**
> **`DEMO ONLY - NOT REAL CITIZEN DATA`** | **`DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT`** | **`DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`** | **`DEMO ESTIMATE - NOT OFFICIAL AMOUNT`**
> Kế hoạch kiểm thử nghiệm thu người dùng (UAT) dưới đây thuộc phạm vi **GIẢ LẬP KIỂM SOÁT 100% (`CONTROLLED DEMO DATA RE-EXECUTION`)** trên môi trường UAT/Local. Tuyệt đối không sử dụng dữ liệu công dân thật, CCCD thật hay số thửa thực tế. Hệ thống không tính số tiền thuế chính thức mang tính pháp lý, không phát hành thông báo thuế và không gửi thông báo ra bên ngoài cho công dân.

---

## 1. Mục Đích & Phạm Vi (`Purpose & Scope`)
Giai đoạn 12K (`Phase 12K`) thi hành việc **chạy lại toàn bộ quy trình kiểm thử nghiệm thu người dùng E2E (`Pilot UAT Re-execution`)** cho phân hệ "Hỗ trợ nghĩa vụ tài chính / tiền sử dụng đất" trên giao diện live của hệ thống LegalFlow.

Thực thi dựa trên chính xác **08 kịch bản hồ sơ kiểm thử mô phỏng tiêu chuẩn (`DEMO-FO-UAT-01..08`)** đã được nạp thành công vào cơ sở dữ liệu UAT tại Phase 12J. Mục tiêu cốt lõi của Phase 12K là:
- Rà soát, xác nhận sự chính xác của 16 điều kiện chốt chặn an toàn (`Safety Checks`).
- Ghi nhận đầy đủ nhật ký thực thi thực tế từng bước (`Steps Executed`) và kết quả đối chiếu (`Actual Result`).
- Phân loại lỗi (`Issue Triage`) nếu phát hiện bất thường, tuyệt đối không can thiệp sửa đổi mã nguồn hay cơ sở dữ liệu trong giai đoạn này.

---

## 2. Đường Cơ Sở & Môi Trường Vận Hành (`Baseline & Runtime Environment`)
* **Thẻ Git Đường cơ sở (`Baseline Git Tag`):** `v2.12.9-controlled-financial-obligation-demo-data-seed` (trên nhánh `main`, working tree clean).
* **Môi Trường Máy Chủ (`Server Environment`):**
  - **Cơ sở dữ liệu:** Docker container `legalflow_postgres` (PostgreSQL 16, CSDL `legalflow_prod`, port 5432).
  - **Kho lưu trữ tệp:** Docker container `legalflow_minio` (MinIO Object Storage, port 9000).
  - **SĐT Cổng Caddy proxy:** Docker container `legalflow_caddy` (port 8080).
* **Máy Chủ Ứng Dụng (`Application Runtime`):**
  - **Backend API Server:** NestJS (Node.js/TypeScript) vận hành tại `http://localhost:3000`.
  - **Frontend Client Server:** Vite/React vận hành tại `http://localhost:5173`.
* **Trạng Thái Kiểm tra Sức Khỏe (`Health Check Status`):** `ALL SYSTEMS HEALTHY & OPERATIONAL`.

---

## 3. Yêu Cầu Dữ Liệu Demo (`Demo Data Requirement`)
Để khởi chạy kiểm thử, hệ thống bắt buộc phải có sẵn 08 bản ghi hồ sơ thẩm định mang tiền tố tuyệt đối `DEMO-FO-UAT-` trong bảng `financial_obligation_assessments` (liên kết với `administrative_procedure_cases` có cùng mã hồ sơ):
- **`DEMO-FO-UAT-01`**: Hồ sơ thiếu thông tin chiết tính.
- **`DEMO-FO-UAT-02`**: Hồ sơ chiết tính dự kiến AI assisted.
- **`DEMO-FO-UAT-03`**: Hồ sơ có thông báo thuế demo nhưng thiếu chứng từ nộp tiền.
- **`DEMO-FO-UAT-04`**: Hồ sơ đủ chứng từ nộp tiền nhưng chưa được cán bộ xác nhận.
- **`DEMO-FO-UAT-05`**: Hồ sơ đầy đủ chứng từ đã được cán bộ thẩm định (`Happy Path`).
- **`DEMO-FO-UAT-06`**: Hồ sơ miễn thuế / không phát sinh nghĩa vụ nộp tiền.
- **`DEMO-FO-UAT-07`**: Hồ sơ ghi nợ tiền sử dụng đất chờ phê duyệt kép (`Dual Control`).
- **`DEMO-FO-UAT-08`**: Hồ sơ chiết tính AI draft số tiền lớn bị khóa hoàn thành.

*(Quy tắc: Nếu thiếu bất kỳ bản ghi nào trong 8 case trên, kịch bản kiểm thử lập tức dừng và ghi báo cáo `UAT RE-EXECUTION BLOCKED - DEMO DATA NOT AVAILABLE`. Tuyệt đối không tự ý chạy script nạp thêm dữ liệu mới trong Phase 12K)*.

---

## 4. Quy Tắc An Toàn Tối Thượng (`Absolute Safety Rules`)
Toàn bộ Kiểm thử viên và Quản trị viên tham gia Phase 12K phải tuân thủ nghiêm ngặt 19 quy tắc bất khả xâm phạm:
1. **Chỉ tạo/cập nhật tài liệu trong thư mục `docs/`.**
2. **Không sửa đổi mã nguồn backend (`legalflow-backend/src/`).**
3. **Không sửa đổi mã nguồn frontend (`src/`).**
4. **Không sửa đổi cấu trúc dữ liệu (`prisma/schema.prisma`).**
5. **Không tạo migration (`prisma/migrations/`).**
6. **Không chỉnh sửa tệp biến môi trường (`.env`).**
7. **Không reset cơ sở dữ liệu (`npx prisma migrate reset`).**
8. **Không restore hoặc nạp chồng cơ sở dữ liệu.**
9. **Không seed thêm dữ liệu mới trong suốt Phase 12K.**
10. **Chỉ thao tác rà soát trên các bản ghi demo mang tiền tố `DEMO-FO-UAT-`.**
11. **Không sử dụng dữ liệu thật của công dân dưới bất kỳ hình thức nào.**
12. **Không tính toán số tiền chính thức mang tính pháp lý.**
13. **Không phát hành thông báo thuế hay ký kết chứng từ chính thức.**
14. **Không thay thế cơ quan thuế (`Chi cục Thuế`).**
15. **Không tự đánh dấu hồ sơ thật đã hoàn thành nghĩa vụ tài chính.**
16. **Không tự gửi email, SMS hay thông báo Zalo cho công dân.**
17. **Không ghi mật khẩu, token hay secret key vào bất kỳ báo cáo nào.**
18. **Không thực hiện commit hay tag thay cho Quản trị viên.**
19. **Không đưa tệp sao lưu (`.sql`) hoặc dữ liệu thật vào kho chứa Git.**

---

## 5. Vai Trò & Phân Quyền Kiểm Thử Viên (`Tester Roles & Permissions`)
Khảo sát UAT được thực hiện dưới góc nhìn của 3 vai trò người dùng chuẩn trên hệ thống:

| Vai Trò Kiểm Thử (`Role`) | Tài Khoản Gán Nhãn | Thẩm Quyền Thao Tác Kiểm Thử (`Permissions`) |
| :--- | :--- | :--- |
| **Cán bộ Tiếp nhận (`RECEIVING_OFFICER`)** | Staff User | Mở tab "Nghĩa vụ tài chính", xem chiết tính dự kiến, tải lên thông báo thuế demo và chứng từ nộp tiền demo. Kiểm chứng nút hoàn thành bị khóa khi chưa đủ điều kiện. |
| **Cán bộ Thẩm định (`REVIEWING_OFFICER`)** | Staff / Specialist | Kiểm tra đối chiếu chứng từ thanh toán với thông báo thuế, xác nhận hợp lệ (`OFFICER_VERIFIED`). Kiểm chứng chốt chặn mở nút hoàn thành cho ca hợp lệ (`DEMO-FO-UAT-05/06`). |
| **Lãnh đạo Phê duyệt (`APPROVAL_MANAGER`)** | Admin / Manager | Thẩm định các ca đặc biệt yêu cầu kiểm soát kép (`Dual Control`) như ghi nợ tiền sử dụng đất (`DEMO-FO-UAT-07`). Phê duyệt hoặc từ chối chuyển tiếp. |

---

## 6. Các Điều Kiện Dừng Khẩn Cấp (`Emergency Stop Conditions`)
Trong quá trình rà soát UAT, nếu phát hiện bất kỳ tình huống nào thuộc **08 Điều Kiện Dừng Khẩn Cấp** dưới đây, Kiểm thử viên phải **LẬP TỨC DỪNG KIỂM THỬ**, không tiếp tục thao tác, chụp ảnh màn hình minh chứng và ghi ngay vào báo cáo chốt chặn:

1. **Không tìm thấy dữ liệu demo:** Bảng danh sách không hiển thị đầy đủ 8 mã `DEMO-FO-UAT-01..08`.
2. **Thiếu Safety Banner:** Giao diện tab Nghĩa vụ tài chính không hiển thị khung cảnh báo an toàn màu vàng/đỏ (`DEMO ONLY - NOT REAL CITIZEN DATA`).
3. **AI / Bản nháp tự động tạo số tiền chính thức (`Official Amount`):** Trường `officialAmount` hoặc `officialTotalAmount` tự động có giá trị số khi mới chỉ có chiết tính AI draft.
4. **Hệ thống tự động phát hành thông báo thuế:** Nút bấm hoặc chức năng tự khởi tạo văn bản thông báo thuế mang tính pháp lý bị lộ ra cho cán bộ bấm.
5. **Hệ thống tự cho phép hoàn thành khi thiếu chứng từ:** Nút hoàn thành thủ tục mở khóa (`Active`) khi hồ sơ chưa có chứng từ nộp tiền hợp lệ hoặc chưa được Cán bộ xác nhận (`UNVERIFIED`).
6. **Hệ thống tự động gửi thông báo cho công dân:** Ghi nhận có yêu cầu mạng (`Network Request`) hoặc cờ tự gửi email/SMS tới người nộp đơn thực tế.
7. **Không có nhật ký kiểm toán (`Audit Log`) cho thao tác quan trọng:** Các hành động tải lên chứng từ, xác nhận thẩm định hay hoàn thành thủ tục không được ghi nhận vết vào `financial_obligation_audit_logs`.
8. **Phát hiện dữ liệu thật bị xâm lấn hoặc sử dụng trong UAT:** Mã hồ sơ thật (`TTHC-2026-0001..0003`) bị thay đổi trạng thái hoặc bị gán nhãn kiểm thử.
