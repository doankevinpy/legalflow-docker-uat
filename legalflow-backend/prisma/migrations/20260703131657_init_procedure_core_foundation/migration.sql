-- CreateEnum
CREATE TYPE "ProcedureField" AS ENUM ('DAT_DAI', 'XAY_DUNG', 'KHAC');

-- CreateEnum
CREATE TYPE "ProcedureGroup" AS ENUM ('CAP_GCN_LAN_DAU', 'CHUYEN_MUC_DICH_SDD', 'NGHIA_VU_TAI_CHINH', 'CAP_PHEP_XAY_DUNG', 'KHAC');

-- CreateEnum
CREATE TYPE "ProcedureStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'SUPPLEMENT_REQUIRED', 'PENDING_APPROVAL', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProcedureDocReviewStatus" AS ENUM ('VALID', 'MISSING', 'NEEDS_VERIFICATION');

-- CreateEnum
CREATE TYPE "ProcedurePriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ProcedureNoteType" AS ENUM ('GENERAL', 'OFFICER_REVIEW', 'FIELD_INSPECTION');

-- CreateTable
CREATE TABLE "ProcedureType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "field" "ProcedureField" NOT NULL,
    "group" "ProcedureGroup" NOT NULL,
    "description" TEXT,
    "legalBasis" TEXT,
    "requiredDocuments" JSONB NOT NULL DEFAULT '[]',
    "processingTimeDays" INTEGER NOT NULL DEFAULT 15,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedureType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministrativeProcedureCase" (
    "id" TEXT NOT NULL,
    "caseCode" TEXT NOT NULL,
    "procedureTypeId" TEXT NOT NULL,
    "field" "ProcedureField" NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicantAddress" TEXT,
    "applicantPhone" TEXT,
    "landParcelSummary" JSONB,
    "constructionSummary" JSONB,
    "status" "ProcedureStatus" NOT NULL DEFAULT 'SUBMITTED',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "assignedToId" TEXT,
    "createdById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdministrativeProcedureCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureDocument" (
    "id" TEXT NOT NULL,
    "procedureCaseId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "objectKey" TEXT,
    "extractedText" TEXT,
    "reviewStatus" "ProcedureDocReviewStatus" NOT NULL DEFAULT 'NEEDS_VERIFICATION',
    "officerNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedureDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureChecklistItem" (
    "id" TEXT NOT NULL,
    "procedureCaseId" TEXT NOT NULL,
    "checklistGroup" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "ProcedurePriority" NOT NULL DEFAULT 'MEDIUM',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedById" TEXT,
    "completedAt" TIMESTAMP(3),
    "isAiSuggested" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedureChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureNote" (
    "id" TEXT NOT NULL,
    "procedureCaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "noteType" "ProcedureNoteType" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedureNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureAuditLog" (
    "id" TEXT NOT NULL,
    "procedureCaseId" TEXT,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "inputPayload" JSONB NOT NULL DEFAULT '{}',
    "outputPayload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcedureAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureType_code_key" ON "ProcedureType"("code");

-- CreateIndex
CREATE INDEX "ProcedureType_field_idx" ON "ProcedureType"("field");

-- CreateIndex
CREATE INDEX "ProcedureType_group_idx" ON "ProcedureType"("group");

-- CreateIndex
CREATE INDEX "ProcedureType_isActive_idx" ON "ProcedureType"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AdministrativeProcedureCase_caseCode_key" ON "AdministrativeProcedureCase"("caseCode");

-- CreateIndex
CREATE INDEX "AdministrativeProcedureCase_procedureTypeId_idx" ON "AdministrativeProcedureCase"("procedureTypeId");

-- CreateIndex
CREATE INDEX "AdministrativeProcedureCase_field_idx" ON "AdministrativeProcedureCase"("field");

-- CreateIndex
CREATE INDEX "AdministrativeProcedureCase_status_idx" ON "AdministrativeProcedureCase"("status");

-- CreateIndex
CREATE INDEX "AdministrativeProcedureCase_assignedToId_idx" ON "AdministrativeProcedureCase"("assignedToId");

-- CreateIndex
CREATE INDEX "AdministrativeProcedureCase_createdAt_idx" ON "AdministrativeProcedureCase"("createdAt");

-- CreateIndex
CREATE INDEX "ProcedureDocument_procedureCaseId_idx" ON "ProcedureDocument"("procedureCaseId");

-- CreateIndex
CREATE INDEX "ProcedureChecklistItem_procedureCaseId_idx" ON "ProcedureChecklistItem"("procedureCaseId");

-- CreateIndex
CREATE INDEX "ProcedureChecklistItem_isCompleted_idx" ON "ProcedureChecklistItem"("isCompleted");

-- CreateIndex
CREATE INDEX "ProcedureNote_procedureCaseId_idx" ON "ProcedureNote"("procedureCaseId");

-- CreateIndex
CREATE INDEX "ProcedureNote_userId_idx" ON "ProcedureNote"("userId");

-- CreateIndex
CREATE INDEX "ProcedureAuditLog_procedureCaseId_idx" ON "ProcedureAuditLog"("procedureCaseId");

-- CreateIndex
CREATE INDEX "ProcedureAuditLog_userId_idx" ON "ProcedureAuditLog"("userId");

-- CreateIndex
CREATE INDEX "ProcedureAuditLog_actionType_idx" ON "ProcedureAuditLog"("actionType");

-- AddForeignKey
ALTER TABLE "AdministrativeProcedureCase" ADD CONSTRAINT "AdministrativeProcedureCase_procedureTypeId_fkey" FOREIGN KEY ("procedureTypeId") REFERENCES "ProcedureType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrativeProcedureCase" ADD CONSTRAINT "AdministrativeProcedureCase_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrativeProcedureCase" ADD CONSTRAINT "AdministrativeProcedureCase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureDocument" ADD CONSTRAINT "ProcedureDocument_procedureCaseId_fkey" FOREIGN KEY ("procedureCaseId") REFERENCES "AdministrativeProcedureCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureChecklistItem" ADD CONSTRAINT "ProcedureChecklistItem_procedureCaseId_fkey" FOREIGN KEY ("procedureCaseId") REFERENCES "AdministrativeProcedureCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureChecklistItem" ADD CONSTRAINT "ProcedureChecklistItem_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureNote" ADD CONSTRAINT "ProcedureNote_procedureCaseId_fkey" FOREIGN KEY ("procedureCaseId") REFERENCES "AdministrativeProcedureCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureNote" ADD CONSTRAINT "ProcedureNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAuditLog" ADD CONSTRAINT "ProcedureAuditLog_procedureCaseId_fkey" FOREIGN KEY ("procedureCaseId") REFERENCES "AdministrativeProcedureCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAuditLog" ADD CONSTRAINT "ProcedureAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
