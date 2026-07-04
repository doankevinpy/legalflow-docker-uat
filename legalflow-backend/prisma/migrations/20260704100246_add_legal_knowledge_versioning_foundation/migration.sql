-- CreateEnum
CREATE TYPE "LegalDocumentType" AS ENUM ('LAW', 'DECREE', 'CIRCULAR', 'DECISION', 'INTERNAL_PROCESS', 'LAND_PRICE_TABLE', 'OTHER');

-- CreateEnum
CREATE TYPE "LegalDocumentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'AMENDED', 'EXPIRED', 'REPLACED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LegalDocumentRelationType" AS ENUM ('AMENDS', 'REPLACES', 'GUIDES', 'ANNULS', 'REFERENCES', 'IMPLEMENTS');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('DRAFT', 'REVIEWING', 'APPROVED', 'ACTIVE', 'ARCHIVED', 'EXPIRED', 'REPLACED');

-- CreateEnum
CREATE TYPE "LegalUpdateReviewStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'APPLIED');

-- CreateTable
CREATE TABLE "LegalDocument" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "documentType" "LegalDocumentType" NOT NULL,
    "issuingAuthority" TEXT,
    "issuedDate" TIMESTAMP(3),
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" "LegalDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "sourceUrl" TEXT,
    "fileObjectKey" TEXT,
    "summary" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalDocumentRelation" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "relatedDocumentId" TEXT NOT NULL,
    "relationType" "LegalDocumentRelationType" NOT NULL,
    "description" TEXT,
    "effectiveFrom" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalDocumentRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureTypeVersion" (
    "id" TEXT NOT NULL,
    "procedureTypeId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" "VersionStatus" NOT NULL DEFAULT 'DRAFT',
    "procedureName" TEXT NOT NULL,
    "procedureCode" TEXT,
    "field" TEXT,
    "group" TEXT,
    "requiredDocuments" JSONB,
    "processingTimeDays" INTEGER,
    "receivingAgency" TEXT,
    "resolvingAgency" TEXT,
    "workflowSteps" JSONB,
    "legalBasisDocumentIds" JSONB,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedureTypeVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiPromptVersion" (
    "id" TEXT NOT NULL,
    "promptKey" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "procedureTypeCode" TEXT,
    "procedureGroup" TEXT,
    "analysisType" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "outputSchema" JSONB,
    "legalDocumentIds" JSONB,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" "VersionStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistVersion" (
    "id" TEXT NOT NULL,
    "checklistKey" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "procedureTypeCode" TEXT,
    "procedureGroup" TEXT,
    "checklistItems" JSONB NOT NULL,
    "legalDocumentIds" JSONB,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "status" "VersionStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalUpdateLog" (
    "id" TEXT NOT NULL,
    "updateTitle" TEXT NOT NULL,
    "sourceDocumentId" TEXT,
    "affectedDocumentIds" JSONB,
    "affectedProcedureTypes" JSONB,
    "affectedPromptKeys" JSONB,
    "affectedChecklistKeys" JSONB,
    "impactSummary" TEXT,
    "reviewStatus" "LegalUpdateReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalUpdateLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureAiAnalysisLegalSnapshot" (
    "id" TEXT NOT NULL,
    "procedureAiAnalysisId" TEXT NOT NULL,
    "legalDocumentIds" JSONB,
    "promptVersionId" TEXT,
    "checklistVersionId" TEXT,
    "procedureTypeVersionId" TEXT,
    "knowledgeBaseVersion" TEXT,
    "snapshotJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcedureAiAnalysisLegalSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LegalDocument_documentCode_idx" ON "LegalDocument"("documentCode");

-- CreateIndex
CREATE INDEX "LegalDocument_documentType_idx" ON "LegalDocument"("documentType");

-- CreateIndex
CREATE INDEX "LegalDocument_status_idx" ON "LegalDocument"("status");

-- CreateIndex
CREATE INDEX "LegalDocument_effectiveFrom_idx" ON "LegalDocument"("effectiveFrom");

-- CreateIndex
CREATE INDEX "LegalDocument_effectiveTo_idx" ON "LegalDocument"("effectiveTo");

-- CreateIndex
CREATE INDEX "LegalDocumentRelation_documentId_idx" ON "LegalDocumentRelation"("documentId");

-- CreateIndex
CREATE INDEX "LegalDocumentRelation_relatedDocumentId_idx" ON "LegalDocumentRelation"("relatedDocumentId");

-- CreateIndex
CREATE INDEX "LegalDocumentRelation_relationType_idx" ON "LegalDocumentRelation"("relationType");

-- CreateIndex
CREATE INDEX "ProcedureTypeVersion_procedureTypeId_idx" ON "ProcedureTypeVersion"("procedureTypeId");

-- CreateIndex
CREATE INDEX "ProcedureTypeVersion_status_idx" ON "ProcedureTypeVersion"("status");

-- CreateIndex
CREATE INDEX "ProcedureTypeVersion_effectiveFrom_idx" ON "ProcedureTypeVersion"("effectiveFrom");

-- CreateIndex
CREATE INDEX "ProcedureTypeVersion_effectiveTo_idx" ON "ProcedureTypeVersion"("effectiveTo");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureTypeVersion_procedureTypeId_version_key" ON "ProcedureTypeVersion"("procedureTypeId", "version");

-- CreateIndex
CREATE INDEX "AiPromptVersion_promptKey_idx" ON "AiPromptVersion"("promptKey");

-- CreateIndex
CREATE INDEX "AiPromptVersion_analysisType_idx" ON "AiPromptVersion"("analysisType");

-- CreateIndex
CREATE INDEX "AiPromptVersion_status_idx" ON "AiPromptVersion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AiPromptVersion_promptKey_version_key" ON "AiPromptVersion"("promptKey", "version");

-- CreateIndex
CREATE INDEX "ChecklistVersion_checklistKey_idx" ON "ChecklistVersion"("checklistKey");

-- CreateIndex
CREATE INDEX "ChecklistVersion_procedureTypeCode_idx" ON "ChecklistVersion"("procedureTypeCode");

-- CreateIndex
CREATE INDEX "ChecklistVersion_procedureGroup_idx" ON "ChecklistVersion"("procedureGroup");

-- CreateIndex
CREATE INDEX "ChecklistVersion_status_idx" ON "ChecklistVersion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistVersion_checklistKey_version_key" ON "ChecklistVersion"("checklistKey", "version");

-- CreateIndex
CREATE INDEX "LegalUpdateLog_sourceDocumentId_idx" ON "LegalUpdateLog"("sourceDocumentId");

-- CreateIndex
CREATE INDEX "LegalUpdateLog_reviewStatus_idx" ON "LegalUpdateLog"("reviewStatus");

-- CreateIndex
CREATE INDEX "LegalUpdateLog_createdAt_idx" ON "LegalUpdateLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureAiAnalysisLegalSnapshot_procedureAiAnalysisId_key" ON "ProcedureAiAnalysisLegalSnapshot"("procedureAiAnalysisId");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysisLegalSnapshot_procedureAiAnalysisId_idx" ON "ProcedureAiAnalysisLegalSnapshot"("procedureAiAnalysisId");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysisLegalSnapshot_promptVersionId_idx" ON "ProcedureAiAnalysisLegalSnapshot"("promptVersionId");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysisLegalSnapshot_checklistVersionId_idx" ON "ProcedureAiAnalysisLegalSnapshot"("checklistVersionId");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysisLegalSnapshot_procedureTypeVersionId_idx" ON "ProcedureAiAnalysisLegalSnapshot"("procedureTypeVersionId");

-- AddForeignKey
ALTER TABLE "LegalDocument" ADD CONSTRAINT "LegalDocument_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalDocument" ADD CONSTRAINT "LegalDocument_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalDocumentRelation" ADD CONSTRAINT "LegalDocumentRelation_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "LegalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalDocumentRelation" ADD CONSTRAINT "LegalDocumentRelation_relatedDocumentId_fkey" FOREIGN KEY ("relatedDocumentId") REFERENCES "LegalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureTypeVersion" ADD CONSTRAINT "ProcedureTypeVersion_procedureTypeId_fkey" FOREIGN KEY ("procedureTypeId") REFERENCES "ProcedureType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureTypeVersion" ADD CONSTRAINT "ProcedureTypeVersion_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPromptVersion" ADD CONSTRAINT "AiPromptVersion_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistVersion" ADD CONSTRAINT "ChecklistVersion_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalUpdateLog" ADD CONSTRAINT "LegalUpdateLog_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "LegalDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalUpdateLog" ADD CONSTRAINT "LegalUpdateLog_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysisLegalSnapshot" ADD CONSTRAINT "ProcedureAiAnalysisLegalSnapshot_procedureAiAnalysisId_fkey" FOREIGN KEY ("procedureAiAnalysisId") REFERENCES "ProcedureAiAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysisLegalSnapshot" ADD CONSTRAINT "ProcedureAiAnalysisLegalSnapshot_promptVersionId_fkey" FOREIGN KEY ("promptVersionId") REFERENCES "AiPromptVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysisLegalSnapshot" ADD CONSTRAINT "ProcedureAiAnalysisLegalSnapshot_checklistVersionId_fkey" FOREIGN KEY ("checklistVersionId") REFERENCES "ChecklistVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysisLegalSnapshot" ADD CONSTRAINT "ProcedureAiAnalysisLegalSnapshot_procedureTypeVersionId_fkey" FOREIGN KEY ("procedureTypeVersionId") REFERENCES "ProcedureTypeVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
