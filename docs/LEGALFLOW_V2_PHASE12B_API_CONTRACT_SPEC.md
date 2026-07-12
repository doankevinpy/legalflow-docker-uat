# LEGALFLOW V2 - PHASE 12B
# FINANCIAL OBLIGATION API CONTRACT SPEC

## 1. Purpose

Tài liệu Đặc tả Hợp đồng Giao tiếp API (`API Contract Specification`) này thiết lập chuẩn giao thức REST cho 12 endpoint thuộc Module "Hỗ trợ nghĩa vụ tài chính" chuẩn bị cho Phase 12C.  
Tài liệu định nghĩa rõ ràng cấu trúc đường dẫn (`URL paths`), phương thức HTTP, DTO yêu cầu (`Request Payloads`), cấu trúc phản hồi chuẩn (`Response Schemas`), các quy tắc khống chế nghiệp vụ (`API Rules`), cảnh báo an toàn bắt buộc và bảng mã lỗi xử lý ngoại lệ (`Error Handling Matrix`).

---

## 2. Proposed Endpoints (12 Standard REST API Routes)

Toàn bộ 12 endpoint đều được bảo vệ bởi rào chắn xác thực JWT (`@UseGuards(JwtAuthGuard)`) và kiểm soát phân quyền (`@Roles(...)`):

```text
GET    /procedure-cases/:caseId/financial-obligations
POST   /procedure-cases/:caseId/financial-obligations
PATCH  /financial-obligations/:assessmentId
POST   /financial-obligations/:assessmentId/generate-draft
POST   /financial-obligations/:assessmentId/items
PATCH  /financial-obligation-items/:itemId
POST   /financial-obligations/:assessmentId/tax-notices
POST   /financial-obligations/:assessmentId/payment-evidence
POST   /financial-obligations/:assessmentId/officer-verify
POST   /financial-obligations/:assessmentId/manager-verify
POST   /financial-obligations/:assessmentId/mark-completed
GET    /financial-obligations/:assessmentId/audit-logs
```

### Chi tiết Hợp đồng Giao tiếp từng Endpoint:

#### 1. `GET /procedure-cases/:caseId/financial-obligations`
- **Mô tả:** Lấy thông tin toàn diện về đánh giá nghĩa vụ tài chính của 1 hồ sơ thủ tục đất đai (bao gồm checklist, items, tax notice, payment evidence và rủi ro).
- **Phân quyền:** `STAFF`, `MANAGER`, `ADMIN`.
- **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-...",
      "caseId": "f5e6d7c8-...",
      "procedureType": "FIRST_TIME_ISSUANCE",
      "assessmentStatus": "ESTIMATED",
      "isEstimate": true,
      "estimatedTotalAmount": 45000000.00,
      "officialTotalAmount": null,
      "taxNoticeStatus": "NONE",
      "paymentStatus": "PENDING",
      "officerReviewStatus": "UNVERIFIED",
      "riskLevel": "MEDIUM",
      "warningText": "Thửa đất có thời điểm sử dụng trước 15/10/1993, cần kiểm tra xác nhận của UBND cấp xã.",
      "safetyWarnings": [
        "⚠️ DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC",
        "⚠️ HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ"
      ],
      "items": [
        {
          "id": "item-1",
          "itemType": "LAND_USE_FEE",
          "itemLabel": "Tiền sử dụng đất (Đất ở vượt hạn mức)",
          "estimatedAmount": 45000000.00,
          "isOfficial": false,
          "legalBasis": "Điều 108 Luật Đất đai 2024; Nghị định 103/2024/NĐ-CP"
        }
      ],
      "taxNotice": null,
      "paymentEvidences": []
    }
  }
  ```

#### 2. `POST /procedure-cases/:caseId/financial-obligations`
- **Mô tả:** Khởi tạo phiên đánh giá nghĩa vụ tài chính mới cho hồ sơ (Chuyển từ `NOT_STARTED` sang `MISSING_INFORMATION` hoặc `READY_FOR_REVIEW`).
- **Phân quyền:** `STAFF`.
- **Request Body (CreateAssessmentDto):**
  ```json
  {
    "procedureType": "FIRST_TIME_ISSUANCE",
    "assessmentMode": "MANUAL"
  }
  ```

#### 3. `PATCH /financial-obligations/:assessmentId`
- **Mô tả:** Cập nhật thông tin rà soát, ghi chú nghiệp vụ hoặc chỉnh sửa chế độ đánh giá.
- **Phân quyền:** `STAFF`, `MANAGER`.

#### 4. `POST /financial-obligations/:assessmentId/generate-draft`
- **Mô tả:** Kích hoạt hệ thống/AI quét thông tin thửa đất, tính toán tham khảo và tự động sinh ra danh sách `FinancialObligationItem` với cờ `isOfficial = false`.
- **Phân quyền:** `STAFF`.
- **Request Body (GenerateDraftDto):**
  ```json
  {
    "applyAdjustmentCoefficientK": true,
    "selectedPriceTableId": "pt-2026-dongnai-01"
  }
  ```
- **Response Shape (201 Created):** Trả về object `assessment` cập nhật trạng thái `ESTIMATED` và tổng tiền dự kiến, kèm theo mảng `safetyWarnings` bắt buộc.

#### 5. `POST /financial-obligations/:assessmentId/items`
- **Mô tả:** Cán bộ bổ sung thủ công một khoản mục chi phí/lệ phí phát sinh (ví dụ phí trích lục hoặc phí thẩm định bổ sung).
- **Phân quyền:** `STAFF`.

#### 6. `PATCH /financial-obligation-items/:itemId`
- **Mô tả:** Cán bộ chỉnh sửa con số chiết tính dự kiến hoặc căn cứ pháp lý của một khoản mục.
- **Phân quyền:** `STAFF`.

#### 7. `POST /financial-obligations/:assessmentId/tax-notices`
- **Mô tả:** Cán bộ tiếp nhận văn bản từ Cơ quan Thuế, nhập số hiệu Thông báo thuế, số tiền chính thức và liên kết tệp PDF đính kèm.
- **Phân quyền:** `STAFF`.
- **Request Body (CreateTaxNoticeDto):**
  ```json
  {
    "noticeNumber": "123/TB-CCT-KV3",
    "issuingAuthority": "Chi cục Thuế Khu vực Biên Hòa - Vĩnh Cửu",
    "issueDate": "2026-07-10",
    "receivedDate": "2026-07-12",
    "totalAmount": 48500000.00,
    "fileAttachmentId": "minio://legalflow-uat/tax-notices/tb-123.pdf",
    "notes": "Đã kiểm tra khớp số thửa 45, tờ bản đồ số 12."
  }
  ```
- **Tác động nghiệp vụ:** Tự động gán `officialTotalAmount = totalAmount`, đổi `isEstimate = false`, chuyển trạng thái `taxNoticeStatus = RECEIVED` và `assessmentStatus = TAX_NOTICE_RECEIVED`.

#### 8. `POST /financial-obligations/:assessmentId/payment-evidence`
- **Mô tả:** Cán bộ tải lên giấy nộp tiền / biên lai kho bạc của công dân và ghi nhận số tiền đã thực nộp.
- **Phân quyền:** `STAFF`.
- **Request Body (CreatePaymentEvidenceDto):**
  ```json
  {
    "paymentDate": "2026-07-11",
    "amountPaid": 48500000.00,
    "payerName": "Nguyễn Văn A",
    "receiptNumber": "GNT-009988-KBNN",
    "treasuryOrBank": "Kho bạc Nhà nước Tỉnh Đồng Nai",
    "fileAttachmentId": "minio://legalflow-uat/payment-receipts/gnt-009988.pdf"
  }
  ```
- **Tác động nghiệp vụ:** Chuyển `paymentStatus = PAID_FULL` (nếu tổng nộp >= `officialTotalAmount`) và `assessmentStatus = PAYMENT_UPLOADED`.

#### 9. `POST /financial-obligations/:assessmentId/officer-verify`
- **Mô tả:** Cán bộ thụ lý chốt xác nhận đã đối chiếu chứng từ gốc và Thông báo thuế là hoàn toàn khớp đúng và hợp pháp.
- **Phân quyền:** `STAFF`.
- **Request Body:** `{"verificationNotes": "Khớp đúng 100% chứng từ nộp tiền và thông báo thuế."}`
- **Tác động nghiệp vụ:** Chuyển `officerReviewStatus = OFFICER_VERIFIED` và `assessmentStatus = OFFICER_VERIFIED`.

#### 10. `POST /financial-obligations/:assessmentId/manager-verify`
- **Mô tả:** Lãnh đạo Phòng (`MANAGER`) kiểm tra và phê chuẩn đối với ca rủi ro cao hoặc có miễn/giảm.
- **Phân quyền:** `MANAGER`.
- **Request Body:** `{"managerNotes": "Đồng ý phê chuẩn hoàn thành nghĩa vụ tài chính theo chứng từ đã đối chiếu."}`
- **Tác động nghiệp vụ:** Chuyển `managerReviewStatus = MANAGER_VERIFIED` và `assessmentStatus = MANAGER_VERIFIED`.

#### 11. `POST /financial-obligations/:assessmentId/mark-completed`
- **Mô tả:** Nút chốt nghiệm thu cuối cùng. Hệ thống kiểm tra toàn bộ 6 rào chắn an toàn (`Blocking Safeguards`). Nếu đạt, chuyển sang `COMPLETED`.
- **Phân quyền:** `STAFF`, `MANAGER`.

#### 12. `GET /financial-obligations/:assessmentId/audit-logs`
- **Mô tả:** Truy xuất toàn bộ lịch sử nhật ký kiểm toán bất biến của phiên rà soát nghĩa vụ tài chính.
- **Phân quyền:** `STAFF`, `MANAGER`, `ADMIN`.

---

## 3. API Rules (6 Quy tắc Giao tiếp & Xử lý Bắt buộc)

Để ngăn chặn các lỗ hổng logic trên lớp API, 6 quy tắc giao tiếp bắt buộc (`Mandatory API Rules`) được thực thi cứng trong các Controller & Interceptor:
1. **`generate-draft` chỉ tạo bản dự kiến (`Draft Only Enforcement Rule`):**  
   Endpoint `/generate-draft` **CẤM TUYỆT ĐỐI** việc ghi dữ liệu vào trường `officialTotalAmount` hay đặt cờ `isOfficial = true`. Mọi kết quả trả về phải giữ nguyên `isEstimate = true`.
2. **Không tự tạo số tiền chính thức (`Zero AI Official Amount Rule`):**  
   Không có bất kỳ endpoint AI hay cron job ngầm nào được quyền gọi hay tác động sửa giá trị của `officialTotalAmount`. Con số này **CHỈ** được cập nhật khi có cuộc gọi `POST /tax-notices` hợp lệ từ tài khoản con người (`STAFF`).
3. **Tax Notice phải do cán bộ nhập (`Human Tax Notice Intake Rule`):**  
   Payload của `POST /tax-notices` bắt buộc phải chứa `fileAttachmentId` hợp lệ trỏ tới hệ thống lưu trữ MinIO và phải do tài khoản cán bộ thực thi (`req.user.role IN ('STAFF', 'MANAGER')`).
4. **Payment Evidence phải do cán bộ nhập (`Human Payment Evidence Intake Rule`):**  
   Tương tự, `POST /payment-evidence` bắt buộc phải có `receiptNumber`, `treasuryOrBank` và `fileAttachmentId`. Hệ thống từ chối mọi yêu cầu ghi nhận nộp tiền không có file đính kèm (`FileAttachmentRequired`).
5. **Mark Completed phải kiểm tra điều kiện chặn (`Mandatory Blocking Check Rule`):**  
   Khi `POST /mark-completed` được gọi, Backend tự động thực thi chuỗi kiểm tra 6 rào chắn (`Validation Guard chain`). Nếu bất kỳ điều kiện nào thất bại (ví dụ `isEstimate == true`), API lập tức trả về lỗi `422 Unprocessable Entity` và từ chối chuyển trạng thái.
6. **Mọi hành động quan trọng phải Audit Log (`Immutable Audit Logging Rule`):**  
   Mọi cuộc gọi tới các method `POST`, `PATCH` trên nhóm endpoint nghĩa vụ tài chính đều kích hoạt dịch vụ ghi log ngầm (`AuditLogService`), chèn một bản ghi mới vào bảng `FinancialObligationAuditLog` trước khi hoàn tất phản hồi HTTP.

---

## 4. Required Warning in Response (Chuẩn hóa Cảnh báo trong JSON Response)

Để bảo đảm mọi client (Frontend Web, Mobile App hay Cổng liên thông) khi tiêu thụ API của LegalFlow V2 đều nhận được thông điệp cảnh báo pháp lý rạch ròi, **mọi phản hồi API (`API Response`) có chứa dữ liệu `ESTIMATED` (khi `isEstimate = true`) BẮT BUỘC phải đính kèm mảng `safetyWarnings`** tại cấp root của đối tượng trả về:

```json
{
  "success": true,
  "data": {
    "...": "...",
    "isEstimate": true,
    "estimatedTotalAmount": 45000000.00
  },
  "safetyWarnings": [
    "⚠️ DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC",
    "⚠️ HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ",
    "⚠️ CÁN BỘ PHẢI KIỂM TRA ĐỐI CHIẾU HỒ SƠ THỰC TẾ TRƯỚC KHI SỬ DỤNG"
  ]
}
```

---

## 5. Error Handling (Ma trận Mã lỗi Xử lý Ngoại lệ)

Hợp đồng API chuẩn hóa 7 mã lỗi nghiệp vụ đặc thù (`Domain Exception Error Codes`) để chỉ dẫn chính xác nguyên nhân từ chối thao tác:

| Error Code | HTTP Status | Trigger Condition | Standard Error Message |
| :--- | :---: | :--- | :--- |
| **`MISSING_CASE_RECORD`** | `404 Not Found` | Hồ sơ `caseId` không tồn tại trong hệ thống. | *"Không tìm thấy hồ sơ thủ tục đất đai tương ứng với ID đã cung cấp."* |
| **`MISSING_REQUIRED_INPUTS`** | `400 Bad Request` | Thiếu thông tin bắt buộc trong DTO khi tạo/cập nhật (`totalAmount < 0`, thiếu `fileAttachmentId`). | *"Dữ liệu đầu vào không hợp lệ hoặc thiếu thông tin bắt buộc (Số hiệu, Ngày ban hành, Tệp đính kèm)."* |
| **`RBAC_PERMISSION_DENIED`** | `403 Forbidden` | Tài khoản không có vai trò phù hợp (Ví dụ: `STAFF` bấm nút `Manager Verify` hoặc `AI` gọi API chốt số tiền). | *"Bạn không có thẩm quyền thực hiện thao tác này trên hồ sơ nghĩa vụ tài chính."* |
| **`AI_OFFICIAL_AMOUNT_FORBIDDEN`** | `422 Unprocessable` | Phát hiện nỗ lực dùng API `generate-draft` để gán số tiền chính thức (`isOfficial: true`). | *"Lỗi an toàn: Trợ lý AI không được phép tạo hoặc kết luận số tiền nghĩa vụ tài chính chính thức."* |
| **`COMPLETE_BLOCKED_NO_TAX_NOTICE`**| `422 Unprocessable` | Gọi `/mark-completed` trên hồ sơ thuộc diện phải có thông báo thuế nhưng `taxNoticeStatus != RECEIVED`. | *"Chặn hoàn thành: Hồ sơ chưa có Thông báo nộp tiền chính thức từ Cơ quan Thuế kèm tệp đính kèm."* |
| **`COMPLETE_BLOCKED_NO_PAYMENT`** | `422 Unprocessable` | Gọi `/mark-completed` khi chưa có chứng từ nộp tiền (`paymentStatus != PAID_FULL / VERIFIED`). | *"Chặn hoàn thành: Hồ sơ chưa tải lên chứng từ/biên lai nộp tiền hoặc số tiền đã nộp chưa đủ."* |
| **`COMPLETE_BLOCKED_UNVERIFIED`** | `422 Unprocessable` | Gọi `/mark-completed` khi Cán bộ chưa bấm xác nhận (`officerReviewStatus != OFFICER_VERIFIED`) hoặc Lãnh đạo chưa phê duyệt ca rủi ro cao. | *"Chặn hoàn thành: Cán bộ thụ lý (và Lãnh đạo) chưa thẩm tra và xác nhận đối chiếu chứng từ gốc."* |
