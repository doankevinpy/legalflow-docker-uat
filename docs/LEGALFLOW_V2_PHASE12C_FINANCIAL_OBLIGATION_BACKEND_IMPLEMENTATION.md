# BÁO CÁO TRIỂN KHAI NỀN TẢNG BACKEND MODULE "HỖ TRỢ NGHĨA VỤ TÀI CHÍNH" (PHASE 12C)

## 1. Tổng quan Phase 12C
Phase 12C (`v2.12.2-backend-financial-obligation-foundation`) thực hiện chuyển đổi toàn bộ thiết kế kiến trúc, mô hình dữ liệu và API contract từ Phase 12A và Phase 12B thành mã nguồn thực thi hoàn chỉnh trên tầng Backend của LegalFlow V2.

### Các nguyên tắc an toàn tuyệt đối đã tuân thủ:
1. **Không sửa Frontend code:** Tầng Frontend (`legalflow-web`) được giữ nguyên tuyệt đối, không có bất kỳ thay đổi hay can thiệp nào.
2. **Không sửa biến môi trường (`.env`):** Giữ nguyên toàn bộ cấu hình kết nối database và thông số hệ thống.
3. **Không reset/restore/seed database:** Thực hiện migration an toàn (`prisma migrate dev`) giữ nguyên dữ liệu hiện hữu của hệ thống.
4. **Tuân thủ ranh giới trách nhiệm pháp lý & an toàn rủi ro:**
   - Hệ thống không thay thế cơ quan thuế.
   - Hệ thống không tự tính số tiền chính thức hoặc tự ý cập nhật `officialTotalAmount` mà không có hồ sơ chứng từ hợp lệ (`TaxNoticeRecord`).
   - Hệ thống không tự động phát hành thông báo thuế hay tự động đánh dấu hoàn thành hồ sơ khi chưa qua kiểm duyệt nhiều lớp của cán bộ Căn cứ.
   - Mọi dự toán AI/chiết tính tham khảo (`generateDraft`) đều được đánh dấu `isEstimate = true` và kèm theo cảnh báo an toàn rõ ràng cho người dùng (`safetyWarnings`).

---

## 2. Thay đổi Cơ sở dữ liệu & Prisma Schema (`schema.prisma`)

### 2.1. Quan hệ với các thực thể hiện hữu
- Bổ sung quan hệ giữa `User` và các thực thể mới (Creator, Reviewer, Approver, Verifier, AuditActor).
- Bổ sung quan hệ `financialObligationAssessment FinancialObligationAssessment? @relation("ProcedureCaseFinancialAssessment")` vào model `AdministrativeProcedureCase` (line 467).

### 2.2. Các Enums mới được bổ sung
1. `FinancialObligationAssessmentStatus`: `NOT_STARTED`, `MISSING_INFORMATION`, `READY_FOR_REVIEW`, `ESTIMATED`, `WAITING_FOR_TAX_NOTICE`, `TAX_NOTICE_RECEIVED`, `WAITING_FOR_PAYMENT`, `PAYMENT_UPLOADED`, `OFFICER_VERIFIED`, `MANAGER_VERIFIED`, `COMPLETED`, `BLOCKED`, `NOT_APPLICABLE`
2. `FinancialObligationAssessmentMode`: `MANUAL`, `AI_ASSISTED`, `IMPORTED_TAX_NOTICE`
3. `TaxNoticeStatus`: `NONE`, `AWAITING`, `RECEIVED`, `VERIFIED`, `DISCREPANCY_DETECTED`
4. `PaymentStatus`: `PENDING`, `PARTIAL`, `PAID_FULL`, `VERIFIED`
5. `OfficerReviewStatus`: `UNVERIFIED`, `OFFICER_VERIFIED`, `REJECTED_NEEDS_INFO`
6. `ManagerReviewStatus`: `NOT_REQUIRED`, `PENDING`, `MANAGER_VERIFIED`, `REJECTED_TO_OFFICER`
7. `FinancialRiskLevel`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
8. `FinancialObligationItemType`: `LAND_USE_FEE`, `DIFFERENTIAL_LAND_USE_FEE`, `LAND_RENTAL_FEE`, `REGISTRATION_FEE`, `PERSONAL_INCOME_TAX`, `APPRAISAL_FEE`, `ISSUANCE_FEE`, `CADASTRAL_FEE`, `OTHER_FEE`
9. `FinancialAuditAction`: `ASSESSMENT_CREATED`, `ASSESSMENT_UPDATED`, `AI_SUGGESTION_GENERATED`, `ITEM_CREATED`, `ITEM_UPDATED`, `OFFICER_EDITED`, `OFFICER_CONFIRMED`, `TAX_NOTICE_UPLOADED`, `PAYMENT_EVIDENCE_UPLOADED`, `OFFICER_VERIFIED`, `MANAGER_VERIFIED`, `STATUS_CHANGED`, `EXPORT_GENERATED`, `COMPLETED`, `COMPLETION_BLOCKED`

### 2.3. Các Model mới được bổ sung
1. **`FinancialObligationAssessment`**: Bảng gốc quản lý đánh giá nghĩa vụ tài chính của từng hồ sơ thủ tục hành chính (`caseId @unique`), lưu trữ trạng thái, số tiền dự kiến (`estimatedTotalAmount`), số tiền chính thức (`officialTotalAmount`), cờ dự toán (`isEstimate`), mức độ rủi ro (`riskLevel`) và cảnh báo an toàn.
2. **`FinancialObligationItem`**: Chi tiết từng khoản nghĩa vụ tài chính con (tiền sử dụng đất, lệ phí trước bạ,...), căn cứ tính toán (`calculationBasis`), căn cứ pháp lý (`legalBasis`) và cờ xác nhận chính thức (`isOfficial`).
3. **`TaxNoticeRecord`**: Biên bản ghi nhận thông báo thuế chính thức từ cơ quan thuế (`issuingAuthority`, `noticeNumber`, `totalAmount`, `fileAttachmentId`).
4. **`PaymentEvidenceRecord`**: Chứng từ/biên lai nộp tiền vào ngân sách nhà nước/kho bạc (`amountPaid`, `receiptNumber`, `treasuryOrBank`, `fileAttachmentId`).
5. **`FinancialObligationAuditLog`**: Nhật ký kiểm toán chuyên dụng lưu vết 100% thao tác thay đổi dữ liệu, kiểm duyệt, tạo bản thảo AI, và các lần chặn hoàn thành sai quy định.

### 2.4. Kết quả Migration
- Tên migration: `20260712111120_add_financial_obligation_support`
- Đã chạy thành công `npx prisma migrate dev --name add_financial_obligation_support`.
- Đã sinh Prisma Client (`v7.8.0`) và kiểm tra `npx prisma migrate status` đạt trạng thái `Database schema is up to date!`.

---

## 3. Cấu trúc Module Backend (`src/financial-obligations`)

Module được khởi tạo theo chuẩn kiến trúc NestJS modular, bao gồm các thành phần sau:
```
legalflow-backend/src/financial-obligations/
├── dto/
│   ├── create-financial-obligation-assessment.dto.ts
│   ├── update-financial-obligation-assessment.dto.ts
│   ├── create-financial-obligation-item.dto.ts
│   ├── update-financial-obligation-item.dto.ts
│   ├── create-tax-notice-record.dto.ts
│   ├── create-payment-evidence-record.dto.ts
│   ├── verify-financial-obligation.dto.ts
│   └── mark-financial-obligation-completed.dto.ts
├── financial-obligations.controller.ts
├── financial-obligations.controller.spec.ts
├── financial-obligations.service.ts
├── financial-obligations.service.spec.ts
└── financial-obligations.module.ts
```

Module `FinancialObligationsModule` đã được import vào `AppModule` (`src/app.module.ts`), tích hợp đầy đủ `PrismaModule` để phục vụ các yêu cầu truy vấn.

---

## 4. Các cơ chế An toàn & Blocking Rules đã triển khai trong Service

### 4.1. Cảnh báo an toàn bắt buộc (`Safety Warnings`)
Mỗi phản hồi API truy vấn hoặc tạo/cập nhật hồ sơ có chứa số tiền dự toán (`isEstimate = true`) đều bắt buộc đính kèm mảng `safetyWarnings`:
- `⚠️ DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC`
- `⚠️ HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ`
- `⚠️ CÁN BỘ PHẢI KIỂM TRA ĐỐI CHIẾU HỒ SƠ THỰC TẾ TRƯỚC KHI SỬ DỤNG`

### 4.2. Khóa an toàn AI (`generateDraft`)
Khi gọi endpoint `generateDraft`:
- Hệ thống chỉ tính toán và tạo bản thảo tham khảo (`isOfficial: false`).
- Bắt buộc đặt `isEstimate = true`.
- **Tuyệt đối không** tự động ghi đè hoặc tạo `officialTotalAmount`.
- Ghi nhận nhật ký kiểm toán với hành động `AI_SUGGESTION_GENERATED`.

### 4.3. 6 Quy tắc chặn hoàn thành (`Blocking Rules` tại `markCompleted`)
Hệ thống sẽ ném `UnprocessableEntityException` và ghi log `COMPLETION_BLOCKED` nếu vi phạm bất kỳ quy tắc nào sau đây:
1. **Rule 1 (`COMPLETE_BLOCKED_ESTIMATE_ONLY`):** Chặn hoàn thành nếu hồ sơ chỉ có số tiền dự kiến (`isEstimate == true && officialTotalAmount == null`) mà chưa có chứng từ thông báo thuế chính thức.
2. **Rule 2 (`COMPLETE_BLOCKED_NO_TAX_NOTICE`):** Chặn hoàn thành nếu thiếu thông báo thuế chính thức từ cơ quan thuế (`taxNotice == null` khi không phải trường hợp miễn nghĩa vụ `NOT_APPLICABLE`).
3. **Rule 3 (`COMPLETE_BLOCKED_NO_PAYMENT`):** Chặn hoàn thành nếu chưa tải lên và xác minh chứng từ nộp tiền (`paymentEvidences` rỗng hoặc trạng thái thanh toán chưa đạt `PAID_FULL`/`VERIFIED`).
4. **Rule 4 (`COMPLETE_BLOCKED_UNVERIFIED`):** Chặn hoàn thành nếu cán bộ chưa kiểm duyệt và xác nhận hồ sơ đối chiếu (`officerReviewStatus !== OFFICER_VERIFIED`).
5. **Rule 5 (`COMPLETE_BLOCKED_MISSING_INFO`):** Chặn hoàn thành nếu hồ sơ còn mục thông tin đầu vào bị thiếu (`assessmentStatus === MISSING_INFORMATION`).
6. **Rule 6 (`COMPLETE_BLOCKED_HIGH_RISK`):** Chặn hoàn thành nếu hồ sơ thuộc mức độ rủi ro cao hoặc đặc biệt nghiêm trọng (`riskLevel === HIGH || CRITICAL`) mà chưa có sự phê duyệt formal từ cấp Quản lý (`managerReviewStatus !== MANAGER_VERIFIED`).

---

## 5. Danh sách 12 REST API Endpoints đã triển khai

| # | Method | Route | RBAC Roles | Mô tả |
|---|--------|-------|------------|-------|
| 1 | `GET` | `/procedure-cases/:caseId/financial-obligations` | `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` | Lấy thông tin đánh giá nghĩa vụ tài chính của hồ sơ thủ tục hành chính, bao gồm danh sách items, taxNotice và paymentEvidences. |
| 2 | `POST` | `/procedure-cases/:caseId/financial-obligations` | `ADMIN`, `MANAGER`, `STAFF` | Khởi tạo đánh giá nghĩa vụ tài chính mới cho hồ sơ, mặc định ở chế độ dự kiến với cảnh báo đầy đủ. |
| 3 | `PATCH` | `/financial-obligations/:assessmentId` | `ADMIN`, `MANAGER`, `STAFF` | Cập nhật thông tin chung của assessment (status, mode, riskLevel, warningText). |
| 4 | `POST` | `/financial-obligations/:assessmentId/generate-draft` | `ADMIN`, `MANAGER`, `STAFF` | Tạo bản thảo chiết tính dự toán tham khảo (AI assisted / automatic estimate). |
| 5 | `POST` | `/financial-obligations/:assessmentId/items` | `ADMIN`, `MANAGER`, `STAFF` | Thêm khoản nghĩa vụ tài chính con (tiền sử dụng đất, lệ phí trước bạ...). |
| 6 | `PATCH` | `/financial-obligation-items/:itemId` | `ADMIN`, `MANAGER`, `STAFF` | Cập nhật chi tiết một khoản nghĩa vụ tài chính con và tính lại tổng dự kiến. |
| 7 | `POST` | `/financial-obligations/:assessmentId/tax-notices` | `ADMIN`, `MANAGER`, `STAFF` | Ghi nhận/cập nhật thông báo thuế chính thức từ cơ quan thuế (`fileAttachmentId` bắt buộc), cập nhật `officialTotalAmount` và đổi `isEstimate = false`. |
| 8 | `POST` | `/financial-obligations/:assessmentId/payment-evidence` | `ADMIN`, `MANAGER`, `STAFF` | Tải lên chứng từ/biên lai nộp tiền (`fileAttachmentId` bắt buộc), kiểm tra đủ số tiền để cập nhật `paymentStatus`. |
| 9 | `POST` | `/financial-obligations/:assessmentId/officer-verify` | `ADMIN`, `MANAGER`, `STAFF` | Cán bộ kiểm duyệt và xác nhận đối chiếu hồ sơ thực tế. |
| 10 | `POST` | `/financial-obligations/:assessmentId/manager-verify` | `ADMIN`, `MANAGER` | Quản lý phê duyệt hồ sơ rủi ro cao hoặc trường hợp đặc biệt. |
| 11 | `POST` | `/financial-obligations/:assessmentId/mark-completed` | `ADMIN`, `MANAGER`, `STAFF` | Đánh dấu hoàn thành nghĩa vụ tài chính sau khi vượt qua 6 quy tắc kiểm tra chặn an toàn. |
| 12 | `GET` | `/financial-obligations/:assessmentId/audit-logs` | `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` | Lấy danh sách nhật ký kiểm toán đầy đủ của assessment. |
