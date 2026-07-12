# LEGALFLOW V2 - PHASE 12B
# SCHEMA DRAFT & MIGRATION IMPACT

## 1. Purpose

Tài liệu này phác thảo chi tiết cấu trúc bảng (`Table Schemas`), danh mục các kiểu dữ liệu liệt kê (`Enums`), chỉ mục cơ sở dữ liệu (`Indexes`) và phân tích rủi ro di trú (`Migration Risk Assessment`) cho Module "Hỗ trợ nghĩa vụ tài chính" chuẩn bị cho Phase 12C.  
> [!IMPORTANT]
> **CAM KẾT AN TOÀN TUYỆT ĐỐI (`ZERO SCHEMA MODIFICATION IN PHASE 12B`):**  
> Đây là bản thiết kế đặc tả kỹ thuật chuẩn bị trước (`Blueprint Draft`). Trong Phase 12B, hệ thống **TUYỆT ĐỐI KHÔNG SỬA TỆP `schema.prisma`**, **KHÔNG TẠO MIGRATION**, **KHÔNG CHẠY `prisma migrate dev / push`** và giữ nguyên 100% cấu trúc cơ sở dữ liệu production hiện hành.

---

## 2. Proposed Models (Prisma Schema Blueprint Specification)

Dưới đây là đặc tả mã nguồn Prisma dự kiến (`Proposed Prisma DDL`) sẽ được bổ sung vào `schema.prisma` tại Phase 12C:

```prisma
// ============================================================================
// FINANCIAL OBLIGATION SUPPORT MODULE MODELS (DRAFT FOR PHASE 12C)
// ============================================================================

model FinancialObligationAssessment {
  id                    String                              @id @default(uuid()) @db.Uuid
  caseId                String                              @unique @db.Uuid
  procedureType         String                              @db.VarChar(50)
  assessmentStatus      FinancialObligationAssessmentStatus @default(NOT_STARTED)
  assessmentMode        FinancialObligationAssessmentMode   @default(MANUAL)
  estimatedTotalAmount  Decimal                             @default(0.00) @db.Decimal(18, 2)
  officialTotalAmount   Decimal?                            @db.Decimal(18, 2)
  currency              String                              @default("VND") @db.VarChar(10)
  isEstimate            Boolean                             @default(true)
  taxNoticeStatus       TaxNoticeStatus                     @default(NONE)
  paymentStatus         PaymentStatus                       @default(PENDING)
  officerReviewStatus   OfficerReviewStatus                 @default(UNVERIFIED)
  managerReviewStatus   ManagerReviewStatus                 @default(NOT_REQUIRED)
  riskLevel             FinancialRiskLevel                  @default(LOW)
  warningText           String?                             @db.Text
  createdById           String                              @db.Uuid
  reviewedById          String?                             @db.Uuid
  approvedById          String?                             @db.Uuid
  createdAt             DateTime                            @default(now())
  updatedAt             DateTime                            @updatedAt

  // Relations
  procedureCase         ProcedureCase                       @relation(fields: [caseId], references: [id], onDelete: Cascade)
  createdBy             User                                @relation("AssessmentCreator", fields: [createdById], references: [id])
  reviewedBy            User?                               @relation("AssessmentReviewer", fields: [reviewedById], references: [id])
  approvedBy            User?                               @relation("AssessmentApprover", fields: [approvedById], references: [id])
  items                 FinancialObligationItem[]
  taxNotice             TaxNoticeRecord?
  paymentEvidences      PaymentEvidenceRecord[]
  auditLogs             FinancialObligationAuditLog[]

  @@index([caseId])
  @@index([assessmentStatus])
  @@index([taxNoticeStatus])
  @@index([paymentStatus])
  @@index([riskLevel])
  @@map("financial_obligation_assessments")
}

model FinancialObligationItem {
  id               String                        @id @default(uuid()) @db.Uuid
  assessmentId     String                        @db.Uuid
  itemType         FinancialObligationItemType
  itemLabel        String                        @db.VarChar(255)
  estimatedAmount  Decimal                       @default(0.00) @db.Decimal(18, 2)
  officialAmount   Decimal?                      @db.Decimal(18, 2)
  calculationBasis String?                       @db.Text
  legalBasis       String?                       @db.Text
  dataSource       String                        @db.VarChar(50)
  confidenceLevel  Float                         @default(1.0)
  isOfficial       Boolean                       @default(false)
  notes            String?                       @db.Text
  createdAt        DateTime                      @default(now())
  updatedAt        DateTime                      @updatedAt

  // Relations
  assessment       FinancialObligationAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  @@index([assessmentId])
  @@index([itemType])
  @@index([isOfficial])
  @@map("financial_obligation_items")
}

model TaxNoticeRecord {
  id               String                        @id @default(uuid()) @db.Uuid
  assessmentId     String                        @unique @db.Uuid
  noticeNumber     String                        @db.VarChar(100)
  issuingAuthority String                        @db.VarChar(255)
  issueDate        DateTime                      @db.Date
  receivedDate     DateTime                      @db.Date
  totalAmount      Decimal                       @db.Decimal(18, 2)
  fileAttachmentId String                        @db.VarChar(255)
  verifiedById     String?                       @db.Uuid
  verifiedAt       DateTime?
  notes            String?                       @db.Text
  createdAt        DateTime                      @default(now())
  updatedAt        DateTime                      @updatedAt

  // Relations
  assessment       FinancialObligationAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  verifiedBy       User?                         @relation("TaxNoticeVerifier", fields: [verifiedById], references: [id])

  @@index([assessmentId])
  @@index([noticeNumber])
  @@index([issuingAuthority])
  @@map("tax_notice_records")
}

model PaymentEvidenceRecord {
  id               String                        @id @default(uuid()) @db.Uuid
  assessmentId     String                        @db.Uuid
  paymentDate      DateTime                      @db.Date
  amountPaid       Decimal                       @db.Decimal(18, 2)
  payerName        String                        @db.VarChar(255)
  receiptNumber    String                        @db.VarChar(100)
  treasuryOrBank   String                        @db.VarChar(255)
  fileAttachmentId String                        @db.VarChar(255)
  verifiedById     String?                       @db.Uuid
  verifiedAt       DateTime?
  notes            String?                       @db.Text
  createdAt        DateTime                      @default(now())
  updatedAt        DateTime                      @updatedAt

  // Relations
  assessment       FinancialObligationAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  verifiedBy       User?                         @relation("PaymentVerifier", fields: [verifiedById], references: [id])

  @@index([assessmentId])
  @@index([receiptNumber])
  @@index([treasuryOrBank])
  @@map("payment_evidence_records")
}

model FinancialObligationAuditLog {
  id           String                        @id @default(uuid()) @db.Uuid
  assessmentId String                        @db.Uuid
  actorId      String                        @db.Uuid
  action       FinancialAuditAction
  beforeValue  String?                       @db.Text
  afterValue   String?                       @db.Text
  reason       String?                       @db.Text
  createdAt    DateTime                      @default(now())

  // Relations
  assessment   FinancialObligationAssessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  actor        User                          @relation("AuditActor", fields: [actorId], references: [id])

  @@index([assessmentId])
  @@index([actorId])
  @@index([action])
  @@index([createdAt])
  @@map("financial_obligation_audit_logs")
}
```

---

## 3. Enum Draft (9 Standardized Enumeration Types)

Để đồng bộ hóa logic kiểm soát trạng thái trên toàn bộ hệ thống từ Database, Backend DTO đến Frontend UI, 9 kiểu dữ liệu `Enum` chuẩn được quy định (`Enum Draft Matrix`):

```prisma
enum FinancialObligationAssessmentStatus {
  NOT_STARTED
  MISSING_INFORMATION
  READY_FOR_REVIEW
  ESTIMATED
  WAITING_FOR_TAX_NOTICE
  TAX_NOTICE_RECEIVED
  WAITING_FOR_PAYMENT
  PAYMENT_UPLOADED
  OFFICER_VERIFIED
  MANAGER_VERIFIED
  COMPLETED
  BLOCKED
  NOT_APPLICABLE
}

enum FinancialObligationAssessmentMode {
  MANUAL
  AI_ASSISTED
  IMPORTED_TAX_NOTICE
}

enum TaxNoticeStatus {
  NONE
  AWAITING
  RECEIVED
  VERIFIED
  DISCREPANCY_DETECTED
}

enum PaymentStatus {
  PENDING
  PARTIAL
  PAID_FULL
  VERIFIED
}

enum OfficerReviewStatus {
  UNVERIFIED
  OFFICER_VERIFIED
  REJECTED_NEEDS_INFO
}

enum ManagerReviewStatus {
  NOT_REQUIRED
  PENDING
  MANAGER_VERIFIED
  REJECTED_TO_OFFICER
}

enum FinancialRiskLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum FinancialObligationItemType {
  LAND_USE_FEE
  DIFFERENTIAL_LAND_USE_FEE
  LAND_RENTAL_FEE
  REGISTRATION_FEE
  PERSONAL_INCOME_TAX
  APPRAISAL_FEE
  ISSUANCE_FEE
  CADASTRAL_FEE
  OTHER_FEE
}

enum FinancialAuditAction {
  AI_SUGGESTION_GENERATED
  OFFICER_EDITED
  OFFICER_CONFIRMED
  TAX_NOTICE_UPLOADED
  PAYMENT_EVIDENCE_UPLOADED
  OFFICER_VERIFIED
  MANAGER_VERIFIED
  STATUS_CHANGED
  EXPORT_GENERATED
}
```

---

## 4. Migration Risk Assessment & Mitigation Matrix

Việc bổ sung 5 bảng mới và 9 enums tại Phase 12C cần được kiểm soát chặt chẽ rủi ro di trú (`Migration Risk Assessment Matrix`):

| Area | Risk | Impact | Mitigation | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **1. Database Schema Contention** | Thêm 5 bảng mới vào `schema.prisma` có thể xung đột định danh bảng nếu đã có tên tương tự. | **Low** | Sử dụng ánh xạ `@map` với tiền tố `financial_obligation_*` và `tax_notice_*`, `payment_evidence_*` độc lập hoàn toàn. | Các bảng mới tách biệt với hệ thống cũ, không can thiệp vào cột của bảng khác. |
| **2. Relation to `ProcedureCase`** | Khóa ngoại `@relation(ProcedureCase)` nếu dùng `onDelete: Cascade` hoặc `Restrict` có thể ảnh hưởng xóa hồ sơ. | **Medium** | Thiết lập `onDelete: Cascade` trên `caseId` để khi xóa hồ sơ test/nháp thì toàn bộ assessment đi kèm được dọn sạch tự động. | Bảo đảm tính toàn vẹn dữ liệu phụ thuộc theo cha (`ProcedureCase`). |
| **3. Relation to `User` table** | Các trường `createdById`, `reviewedById`, `approvedById`, `actorId` liên kết với bảng `User`. | **Low** | Thiết lập tên quan hệ rõ ràng (`"AssessmentCreator"`, `"AssessmentReviewer"`, `"AuditActor"`...) để tránh lỗi `Ambiguous relation` của Prisma. | Kiểm tra kỹ khi build `@relation` kép với cùng bảng `User`. |
| **4. Decimal Type Precision** | Trường tiền tệ `Decimal(18, 2)` có thể gặp lỗi quy tròn hoặc tràn số đối với các thửa đất dự án lớn hàng nghìn tỷ VNĐ. | **Medium** | Chuẩn hóa quy định `@db.Decimal(18, 2)` (tối đa `9,999,999,999,999,999.99` VNĐ) và ép kiểu bignumber trên NestJS/TypeScript (`Prisma.Decimal`). | Đủ sức chứa các khoản thu ngân sách lớn nhất theo quy định hiện hành. |
| **5. Production Downtime / Lock** | Khi chạy `prisma migrate dev --name add_financial_obligations` trên môi trường đang có dữ liệu lớn. | **Low** | Tạo migration chỉ gồm `CREATE TABLE` và `CREATE TYPE` (không có `ALTER TABLE` sửa dữ liệu bảng cũ hay khóa bảng `ProcedureCase`). | Thời gian chạy migration ước tính dưới `200ms`, `Zero downtime`. |

---

## 5. No Migration Confirmation (Cam kết Không thực thi Migration trong Phase 12B)

Xin xác nhận chính thức bằng văn bản:
1. **Toàn bộ nội dung Model và Enum trong tài liệu này là BẢN NHÁP THIẾT KẾ (`Draft Blueprint only`).**
2. **Phase 12B KHÔNG thực thi chỉnh sửa tệp `prisma/schema.prisma`.**
3. **Phase 12B KHÔNG tạo bất kỳ thư mục hay tệp migration nào trong `prisma/migrations/`.**
4. **Phase 12B KHÔNG chạy lệnh `npx prisma migrate dev`, `npx prisma db push` hay `npx prisma db seed`.**
5. **Cấu trúc cơ sở dữ liệu production hiện tại (6 migrations đã hoàn thành tới `v2.11`) được bảo đảm nguyên trạng 100%.**
