# Đặc Tả Cấu Trúc Thông Báo Thuế & Chứng Từ Nộp Tiền Demo - Giai Đoạn 12H
## Phase 12H: Demo Tax Notice and Payment Evidence Specification (`DEMO ONLY`)

> [!WARNING]
> **QUY ĐỊNH VỀ TỆP TIN VÀ NHÃN AN TOÀN (WATERMARK & LABEL RULES):**
> Giai đoạn 12H chỉ thiết kế cấu trúc đặc tả (Specification Only), **chưa tạo file PDF thật** và **chưa nạp vào hệ thống**.
> Khi tiến hành khởi tạo các tệp mô phỏng tại Phase 12I, mọi Thông báo nộp thuế và Chứng từ thanh toán mẫu đều **bắt buộc phải được in chìm watermark và hiển thị dòng chữ in hoa nổi bật ở phần đầu/cuối trang** theo đúng tiêu chuẩn an toàn dưới đây.

---

## 1. Quy Tắc Nhãn An Toàn (Mandatory Safety Labeling & Watermarking Rules)

### A. Đối với Thông báo thuế Demo (`Tax Notice Demo`)
* **Watermark in chìm trên mỗi trang:** `DEMO TAX NOTICE - NOT OFFICIAL` (Góc nghiêng 45 độ, màu đỏ nhạt opacity 20%).
* **Văn bản bắt buộc hiển thị trên tiêu đề và chân trang (Top & Bottom Header):**
  **`DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT`**
* **Cảnh báo pháp lý đính kèm:** *"Tài liệu này là mẫu mô phỏng giả lập thuộc Hệ thống kiểm thử LegalFlow UAT. Không có giá trị thanh toán, không thay thế cho văn bản chính thức của Cơ quan Thuế và không được sử dụng để thực hiện bất kỳ giao dịch tài chính nào ngoài thực tế."*

### B. Đối với Chứng từ nộp tiền Demo (`Payment Evidence Demo`)
* **Watermark in chìm trên mỗi trang:** `DEMO PAYMENT EVIDENCE - NOT REAL` (Góc nghiêng 45 độ, màu xanh nhạt opacity 20%).
* **Văn bản bắt buộc hiển thị trên tiêu đề và chân trang:**
  **`DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`**
* **Cảnh báo pháp lý đính kèm:** *"Biên lai/chứng từ này chỉ là mô phỏng giả lập cho luồng kiểm thử nghiệp vụ UAT. Không chứng minh việc đã nộp tiền vào Ngân sách Nhà nước hay Kho bạc Nhà nước thực tế."*

---

## 2. Cấu Trúc Thông Báo Thuế Demo (`Demo Tax Notice Record Structure`)
Khi Cán bộ thụ lý (hoặc script giả lập) thực hiện thao tác cập nhật Thông báo thuế vào bảng `tax_notice_records`, cấu trúc dữ liệu mô phỏng cần đáp ứng các trường sau:

```json
{
  "$schema": "https://legalflow.local/schemas/demo-tax-notice.json",
  "demoCaseReference": "DEMO-FO-2026-003",
  "noticeNumber": "TBT-DEMO-2026/003",
  "issuingAuthority": "Chi cục Thuế Mô Phỏng UAT (DEMO ONLY)",
  "issuedDate": "2026-07-15T00:00:00.000Z",
  "taxpayerName": "Người dân Demo 03",
  "taxpayerId": "000000000103",
  "landParcelDescription": "Thửa số 9903, Tờ bản đồ số 903, Khu phố Demo 3, TP UAT",
  "lineItems": [
    {
      "itemCode": "LAND_USE_FEE",
      "itemName": "Tiền sử dụng đất (Mô phỏng Demo)",
      "amountVnd": 149000000,
      "safetyLabel": "DEMO ESTIMATE"
    },
    {
      "itemCode": "REGISTRATION_FEE",
      "itemName": "Lệ phí trước bạ nhà đất (Mô phỏng Demo)",
      "amountVnd": 1000000,
      "safetyLabel": "DEMO ESTIMATE"
    }
  ],
  "totalTaxAmountVnd": 150000000,
  "paymentDeadline": "2026-08-15T00:00:00.000Z",
  "treasuryAccountInfo": "Kho bạc Nhà nước Mô Phỏng UAT - STK: 0000.DEMO.UAT",
  "simulatedAttachmentUrl": "https://uat.legalflow.local/minio/legalflow-docs/demo-cases/DEMO_TAX_NOTICE_NOT_OFFICIAL_003.pdf",
  "safetyBannerText": "DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT"
}
```

---

## 3. Cấu Trúc Chứng Từ Nộp Tiền Demo (`Demo Payment Evidence Record Structure`)
Khi cập nhật chứng từ nộp tiền của công dân vào bảng `payment_evidence_records`, cấu trúc dữ liệu mô phỏng tuân theo đặc tả sau:

```json
{
  "$schema": "https://legalflow.local/schemas/demo-payment-evidence.json",
  "demoCaseReference": "DEMO-FO-2026-004",
  "receiptNumber": "BL-DEMO-2026/004",
  "transactionReference": "TRANS-DEMO-9904-UAT",
  "paymentMethod": "BANK_TRANSFER_DEMO",
  "paymentDate": "2026-07-15T10:30:00.000Z",
  "payerName": "Người dân Demo 04",
  "payerId": "000000000104",
  "beneficiaryAccount": "Kho bạc Nhà nước Mô Phỏng UAT (DEMO ONLY)",
  "paidAmountVnd": 25000000,
  "paymentPurpose": "Nộp tiền sử dụng đất theo Thông báo số TBT-DEMO-2026/004 (DEMO ONLY)",
  "simulatedAttachmentUrl": "https://uat.legalflow.local/minio/legalflow-docs/demo-cases/DEMO_PAYMENT_EVIDENCE_NOT_REAL_004.pdf",
  "safetyBannerText": "DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT",
  "officerNote": "Đã kiểm tra chứng từ mô phỏng hợp lệ cho mục đích UAT."
}
```

---

## 4. Bộ Tiêu Chuẩn Kiểm Chứng Kỹ Thuật Khi Tạo Tệp (Technical Validation Checklist)
Trước khi đưa các tệp tin mô phỏng trên vào sử dụng tại Phase 12I, hệ thống kiểm thử tự động hoặc Cán bộ rà soát phải kiểm tra:
1. **Kiểm tra từ khóa cấm (Blocklist Check):** Tệp tin không được chứa tên Chi cục Thuế thực tế của bất kỳ tỉnh/thành phố nào ngoài đời thực. Phải dùng tên `Chi cục Thuế Mô Phỏng UAT` hoặc `Cơ quan Thuế Kiểm Thử Demo`.
2. **Kiểm tra Watermark:** Tệp tin PDF (khi được tạo ở Phase 12I) phải có layer text chìm `DEMO TAX NOTICE - NOT OFFICIAL` hoặc `DEMO PAYMENT EVIDENCE - NOT REAL` trên toàn bộ các trang.
3. **Kiểm tra khớp số tiền:** Số tiền trên `Demo Tax Notice` và `Demo Payment Evidence` phải trùng khớp với số liệu ghi trong bảng đặc tả `LEGALFLOW_V2_PHASE12H_DEMO_CASE_DATA_SPEC.md` của từng case tương ứng.
