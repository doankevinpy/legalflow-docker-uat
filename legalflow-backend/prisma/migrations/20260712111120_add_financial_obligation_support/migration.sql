-- CreateEnum
CREATE TYPE "FinancialObligationAssessmentStatus" AS ENUM ('NOT_STARTED', 'MISSING_INFORMATION', 'READY_FOR_REVIEW', 'ESTIMATED', 'WAITING_FOR_TAX_NOTICE', 'TAX_NOTICE_RECEIVED', 'WAITING_FOR_PAYMENT', 'PAYMENT_UPLOADED', 'OFFICER_VERIFIED', 'MANAGER_VERIFIED', 'COMPLETED', 'BLOCKED', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "FinancialObligationAssessmentMode" AS ENUM ('MANUAL', 'AI_ASSISTED', 'IMPORTED_TAX_NOTICE');

-- CreateEnum
CREATE TYPE "TaxNoticeStatus" AS ENUM ('NONE', 'AWAITING', 'RECEIVED', 'VERIFIED', 'DISCREPANCY_DETECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID_FULL', 'VERIFIED');

-- CreateEnum
CREATE TYPE "OfficerReviewStatus" AS ENUM ('UNVERIFIED', 'OFFICER_VERIFIED', 'REJECTED_NEEDS_INFO');

-- CreateEnum
CREATE TYPE "ManagerReviewStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'MANAGER_VERIFIED', 'REJECTED_TO_OFFICER');

-- CreateEnum
CREATE TYPE "FinancialRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FinancialObligationItemType" AS ENUM ('LAND_USE_FEE', 'DIFFERENTIAL_LAND_USE_FEE', 'LAND_RENTAL_FEE', 'REGISTRATION_FEE', 'PERSONAL_INCOME_TAX', 'APPRAISAL_FEE', 'ISSUANCE_FEE', 'CADASTRAL_FEE', 'OTHER_FEE');

-- CreateEnum
CREATE TYPE "FinancialAuditAction" AS ENUM ('ASSESSMENT_CREATED', 'ASSESSMENT_UPDATED', 'AI_SUGGESTION_GENERATED', 'ITEM_CREATED', 'ITEM_UPDATED', 'OFFICER_EDITED', 'OFFICER_CONFIRMED', 'TAX_NOTICE_UPLOADED', 'PAYMENT_EVIDENCE_UPLOADED', 'OFFICER_VERIFIED', 'MANAGER_VERIFIED', 'STATUS_CHANGED', 'EXPORT_GENERATED', 'COMPLETED', 'COMPLETION_BLOCKED');

-- CreateTable
CREATE TABLE "financial_obligation_assessments" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "procedureType" TEXT NOT NULL,
    "assessmentStatus" "FinancialObligationAssessmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "assessmentMode" "FinancialObligationAssessmentMode" NOT NULL DEFAULT 'MANUAL',
    "estimatedTotalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "officialTotalAmount" DECIMAL(18,2),
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "isEstimate" BOOLEAN NOT NULL DEFAULT true,
    "taxNoticeStatus" "TaxNoticeStatus" NOT NULL DEFAULT 'NONE',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "officerReviewStatus" "OfficerReviewStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "managerReviewStatus" "ManagerReviewStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "riskLevel" "FinancialRiskLevel" NOT NULL DEFAULT 'LOW',
    "warningText" TEXT DEFAULT 'DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC. HỆ THỐNG KHÔNG THAY THẾ CƠ QUAN THUẾ.',
    "createdById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_obligation_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_obligation_items" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "itemType" "FinancialObligationItemType" NOT NULL,
    "itemLabel" TEXT NOT NULL,
    "estimatedAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "officialAmount" DECIMAL(18,2),
    "calculationBasis" TEXT,
    "legalBasis" TEXT,
    "dataSource" TEXT NOT NULL,
    "confidenceLevel" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_obligation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_notice_records" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "noticeNumber" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    "issueDate" DATE NOT NULL,
    "receivedDate" DATE NOT NULL,
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "fileAttachmentId" TEXT NOT NULL,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_notice_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_evidence_records" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "paymentDate" DATE NOT NULL,
    "amountPaid" DECIMAL(18,2) NOT NULL,
    "payerName" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "treasuryOrBank" TEXT NOT NULL,
    "fileAttachmentId" TEXT NOT NULL,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_evidence_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_obligation_audit_logs" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "FinancialAuditAction" NOT NULL,
    "beforeValue" TEXT,
    "afterValue" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_obligation_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "financial_obligation_assessments_caseId_key" ON "financial_obligation_assessments"("caseId");

-- CreateIndex
CREATE INDEX "financial_obligation_assessments_caseId_idx" ON "financial_obligation_assessments"("caseId");

-- CreateIndex
CREATE INDEX "financial_obligation_assessments_assessmentStatus_idx" ON "financial_obligation_assessments"("assessmentStatus");

-- CreateIndex
CREATE INDEX "financial_obligation_assessments_taxNoticeStatus_idx" ON "financial_obligation_assessments"("taxNoticeStatus");

-- CreateIndex
CREATE INDEX "financial_obligation_assessments_paymentStatus_idx" ON "financial_obligation_assessments"("paymentStatus");

-- CreateIndex
CREATE INDEX "financial_obligation_assessments_riskLevel_idx" ON "financial_obligation_assessments"("riskLevel");

-- CreateIndex
CREATE INDEX "financial_obligation_items_assessmentId_idx" ON "financial_obligation_items"("assessmentId");

-- CreateIndex
CREATE INDEX "financial_obligation_items_itemType_idx" ON "financial_obligation_items"("itemType");

-- CreateIndex
CREATE INDEX "financial_obligation_items_isOfficial_idx" ON "financial_obligation_items"("isOfficial");

-- CreateIndex
CREATE UNIQUE INDEX "tax_notice_records_assessmentId_key" ON "tax_notice_records"("assessmentId");

-- CreateIndex
CREATE INDEX "tax_notice_records_assessmentId_idx" ON "tax_notice_records"("assessmentId");

-- CreateIndex
CREATE INDEX "tax_notice_records_noticeNumber_idx" ON "tax_notice_records"("noticeNumber");

-- CreateIndex
CREATE INDEX "tax_notice_records_issuingAuthority_idx" ON "tax_notice_records"("issuingAuthority");

-- CreateIndex
CREATE INDEX "payment_evidence_records_assessmentId_idx" ON "payment_evidence_records"("assessmentId");

-- CreateIndex
CREATE INDEX "payment_evidence_records_receiptNumber_idx" ON "payment_evidence_records"("receiptNumber");

-- CreateIndex
CREATE INDEX "payment_evidence_records_treasuryOrBank_idx" ON "payment_evidence_records"("treasuryOrBank");

-- CreateIndex
CREATE INDEX "financial_obligation_audit_logs_assessmentId_idx" ON "financial_obligation_audit_logs"("assessmentId");

-- CreateIndex
CREATE INDEX "financial_obligation_audit_logs_actorId_idx" ON "financial_obligation_audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "financial_obligation_audit_logs_action_idx" ON "financial_obligation_audit_logs"("action");

-- CreateIndex
CREATE INDEX "financial_obligation_audit_logs_createdAt_idx" ON "financial_obligation_audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "financial_obligation_assessments" ADD CONSTRAINT "financial_obligation_assessments_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "AdministrativeProcedureCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_obligation_assessments" ADD CONSTRAINT "financial_obligation_assessments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_obligation_assessments" ADD CONSTRAINT "financial_obligation_assessments_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_obligation_assessments" ADD CONSTRAINT "financial_obligation_assessments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_obligation_items" ADD CONSTRAINT "financial_obligation_items_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "financial_obligation_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_notice_records" ADD CONSTRAINT "tax_notice_records_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "financial_obligation_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_notice_records" ADD CONSTRAINT "tax_notice_records_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_evidence_records" ADD CONSTRAINT "payment_evidence_records_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "financial_obligation_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_evidence_records" ADD CONSTRAINT "payment_evidence_records_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_obligation_audit_logs" ADD CONSTRAINT "financial_obligation_audit_logs_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "financial_obligation_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_obligation_audit_logs" ADD CONSTRAINT "financial_obligation_audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
