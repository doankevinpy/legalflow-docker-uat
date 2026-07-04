-- CreateEnum
CREATE TYPE "ProcedureAiAnalysisType" AS ENUM ('LAND_FIRST_CERTIFICATE_REVIEW', 'LAND_USE_PURPOSE_CHANGE_REVIEW', 'FINANCIAL_OBLIGATION_REVIEW', 'CONSTRUCTION_PERMIT_REVIEW');

-- CreateEnum
CREATE TYPE "ProcedureAiAnalysisStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "ProcedureAiAnalysis" (
    "id" TEXT NOT NULL,
    "procedureCaseId" TEXT NOT NULL,
    "analysisType" "ProcedureAiAnalysisType" NOT NULL,
    "inputSnapshot" JSONB NOT NULL DEFAULT '{}',
    "outputPayload" JSONB NOT NULL DEFAULT '{}',
    "disclaimer" TEXT NOT NULL DEFAULT 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA',
    "confidenceLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" "ProcedureAiAnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcedureAiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysis_procedureCaseId_idx" ON "ProcedureAiAnalysis"("procedureCaseId");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysis_analysisType_idx" ON "ProcedureAiAnalysis"("analysisType");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysis_status_idx" ON "ProcedureAiAnalysis"("status");

-- CreateIndex
CREATE INDEX "ProcedureAiAnalysis_createdById_idx" ON "ProcedureAiAnalysis"("createdById");

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysis" ADD CONSTRAINT "ProcedureAiAnalysis_procedureCaseId_fkey" FOREIGN KEY ("procedureCaseId") REFERENCES "AdministrativeProcedureCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysis" ADD CONSTRAINT "ProcedureAiAnalysis_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAiAnalysis" ADD CONSTRAINT "ProcedureAiAnalysis_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
