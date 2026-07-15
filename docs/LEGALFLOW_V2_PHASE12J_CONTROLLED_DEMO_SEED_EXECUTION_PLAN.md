# Kế Hoạch Thực Thi Nạp Dữ Liệu Demo Kiểm Soát Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12J
## Phase 12J: Controlled Financial Obligation Demo Data Seed Execution Plan (`DEMO ONLY`)

> [!WARNING]
> **NHÃN CẢNH BÁO AN TOÀN PHÁP LÝ BẮT BUỘC:**
> **`DEMO ONLY - NOT REAL CITIZEN DATA`** | **`DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT`** | **`DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`** | **`DEMO ESTIMATE - NOT OFFICIAL AMOUNT`**
> Kế hoạch và kịch bản thực thi seed dữ liệu dưới đây thuộc phạm vi **GIẢ LẬP KIỂM SOÁT 100% (`CONTROLLED DEMO DATA SEEDING`)** dành riêng cho môi trường UAT/Local. Tuyệt đối không sử dụng dữ liệu công dân thật, CCCD thật hay số thửa thực tế. Hệ thống không tính số tiền thuế chính thức mang tính pháp lý và không thay thế hay phát hành thông báo thuế của Chi cục Thuế.

---

## 1. Mục Tiêu & Kịch Bản Thực Thi (`Objectives & Scope`)
Phase 12J thi hành việc chuyển dịch Kế hoạch Nạp Thử nghiệm Dry-run (Phase 12I) thành **thực thi nạp dữ liệu kiểm soát trong cơ sở dữ liệu (`Controlled DB Seeding`)**. Mục tiêu tối thượng là tháo gỡ điểm nghẽn (`BLOCKED`) của bộ kiểm thử UAT cho module "Hỗ trợ nghĩa vụ tài chính / tiền sử dụng đất", cung cấp chính xác **08 hồ sơ mô phỏng tiêu chuẩn (`DEMO-FO-UAT-01..08`)** để Kiểm thử viên thực hiện rà soát 14 kịch bản nghiệm thu E2E trên giao diện live.

---

## 2. Các Chốt Chặn An Toàn Bắt Buộc Trước Nạp (`Mandatory Safety Pre-conditions`)
Trước khi chạy kịch bản nạp dữ liệu (`seed-financial-obligation-demo.ts`), Quản trị viên bắt buộc phải kiểm chứng và hoàn thành 5 điều kiện chốt chặn an toàn:

| STT | Chốt Chặn An Toàn (Safety Gate) | Yêu Cầu Kỹ Thuật & Pháp Lý (Specification) | Trạng Thái Kiểm Chứng |
| :---: | :--- | :--- | :---: |
| **1** | **Xác nhận Môi trường Phân lập** | Thực thi duy nhất trên DB Local/Docker UAT (`legalflow_prod` local port 5432). Tuyệt đối không trỏ ra cơ sở dữ liệu sản xuất ngoại vi. | `PASSED` |
| **2** | **Xác minh Bản Sao lưu Trước Nạp** | Tệp sao lưu `legalflow_prod_pre_phase12j_demo_seed_20260715-210028.sql` đã tồn tại trong `backups/` với kích thước `992,762` bytes (> 0 KB). | `PASSED` |
| **3** | **Kiểm chứng Bộ Kiểm Thử & Build** | Chạy `npx prisma generate`, `npx prisma migrate status`, `npm test` (169/169 tests passed) và `npm run build` thành công 100%. | `PASSED` |
| **4** | **Xác nhận Không Xâm Lấn Kiến Trúc** | **Không** sửa `schema.prisma`, **không** tạo migration, **không** chỉnh `.env`, **không** reset hay restore DB. | `VERIFIED` |
| **5** | **Yêu cầu Chuỗi Xác Nhận Bắt Buộc** | Script seed yêu cầu truyền chính xác chuỗi xác nhận: `I UNDERSTAND THIS SEEDS DEMO DATA ONLY`. | `VERIFIED` |

---

## 3. Đặc Tả Phạm Vi Nạp 8 Kịch Bản Demo (`Demo Cases Specification`)
Toàn bộ 8 hồ sơ nạp vào DB được gắn namespace nhận diện tuyệt đối: `DEMO-FO-UAT-01` đến `DEMO-FO-UAT-08`.

1. **`DEMO-FO-UAT-01` (Cấp GCN lần đầu):** Thiếu thông tin diện tích/nghĩa vụ tài chính. Trạng thái: `MISSING_INFORMATION`. Nút hoàn thành thủ tục bị khóa (`DISABLED`).
2. **`DEMO-FO-UAT-02` (Chuyển mục đích sử dụng đất):** Hồ sơ có chiết tính dự kiến AI draft (`AI_ASSISTED`). Tiền SDĐ dự kiến 120 triệu VNĐ, LPTB 600 nghìn VNĐ. Trường `officialTotalAmount = null`. Ghi chú: `DEMO ESTIMATE - NOT OFFICIAL AMOUNT`. Nút hoàn thành bị khóa.
3. **`DEMO-FO-UAT-03` (Chuyển mục đích sử dụng đất):** Có Thông báo thuế demo (`TBT-DEMO-2026/003` - 150 triệu VNĐ) nhưng chưa có chứng từ nộp tiền. Trạng thái: `TAX_NOTICE_RECEIVED`. Nút hoàn thành bị khóa.
4. **`DEMO-FO-UAT-04` (Cấp GCN lần đầu):** Đủ Thông báo thuế demo (`TBT-DEMO-2026/004`) và Chứng từ nộp tiền demo (`BNT-DEMO-2026/004` - 25 triệu VNĐ). Trạng thái: `PAYMENT_UPLOADED`. Khóa do chưa có chữ ký đối chiếu của Cán bộ (`officerReviewStatus = UNVERIFIED`).
5. **`DEMO-FO-UAT-05` (Chuyển nhượng quyền sử dụng đất):** **Happy Path (Sẵn sàng nghiệm thu).** Đủ Thông báo thuế demo, Chứng từ nộp tiền demo (`12.5 triệu VNĐ`) và đã được Cán bộ kiểm tra (`OFFICER_VERIFIED`). Nút bấm hoàn thành thủ tục màu xanh (`ACTIVE/UNLOCKED`).
6. **`DEMO-FO-UAT-06` (Tặng cho cha con):** Hồ sơ miễn thuế / không phát sinh (`NOT_APPLICABLE`). Số tiền `0` VNĐ. Cán bộ đã xác nhận quan hệ thân nhân (`OFFICER_VERIFIED`). Nút hoàn thành mở khóa (`ACTIVE/UNLOCKED`).
7. **`DEMO-FO-UAT-07` (Gia đình chính sách):** Hồ sơ ghi nợ tiền sử dụng đất (`80 triệu VNĐ`), đã nộp đối ứng 10 triệu VNĐ. Cán bộ đã kiểm tra (`OFFICER_VERIFIED`) nhưng cần Lãnh đạo phê duyệt kép (`Dual Control` - `managerReviewStatus = PENDING`). Khóa cho đến khi Manager duyệt.
8. **`DEMO-FO-UAT-08` (Chuyển mục đích cây lâu năm):** Hồ sơ chỉ có AI draft với số tiền lớn (`300 triệu VNĐ`), trường `officialTotalAmount = null`. Chốt chặn an toàn khóa vĩnh viễn việc bấm hoàn thành trên bản dự kiến (`STRICTLY BLOCKED`).

---

## 4. Cấu Trúc Kịch Bản Seed & Quy Tắc An Toàn (`Seed Script & Safety Rules`)
* **Đường dẫn tệp lệnh (`Script Path`):** `legalflow-backend/scripts/seed-financial-obligation-demo.ts`
* **Lệnh khởi chạy kiểm soát (`Execution Command`):**
  ```powershell
  cd C:\Users\Admin\legalflow-docker-uat\legalflow-backend
  npx ts-node scripts/seed-financial-obligation-demo.ts "I UNDERSTAND THIS SEEDS DEMO DATA ONLY"
  ```
* **Quy tắc an toàn tích hợp trong script (`Built-in Safety Protections`):**
  - Tự động quét kiểm tra thư mục `backups/` có tệp SQL > 0 bytes mới cho phép chạy.
  - Sử dụng logic `prisma.administrativeProcedureCase.upsert` và `prisma.financialObligationAssessment.upsert` đảm bảo tính lũy đẳng (`Idempotency`), chạy nhiều lần không tạo bản ghi trùng lặp.
  - Tích hợp cờ lệnh `--cleanup` cho phép dọn dẹp chính xác 100% dữ liệu demo mà không chạm vào dữ liệu thật.
