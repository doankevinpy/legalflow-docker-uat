-- CreateEnum
CREATE TYPE "AiActionType" AS ENUM ('SUMMARIZE', 'CLASSIFY', 'CHECKLIST', 'DRAFT');

-- CreateEnum
CREATE TYPE "AiLogStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "AiFeedbackStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'MODIFIED');

-- CreateTable
CREATE TABLE "AiAuditLog" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "userId" TEXT NOT NULL,
    "actionType" "AiActionType" NOT NULL,
    "modelName" TEXT NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "latencyMs" INTEGER,
    "inputPayload" JSONB NOT NULL,
    "outputPayload" JSONB NOT NULL,
    "status" "AiLogStatus" NOT NULL,
    "errorMessage" TEXT,
    "userFeedback" "AiFeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCaseSuggestion" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "suggestedSummary" TEXT,
    "suggestedType" "CaseType",
    "suggestedField" "CaseField",
    "confidenceScore" DOUBLE PRECISION,
    "legalRationale" TEXT,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "lastGeneratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCaseSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiAuditLog_caseId_idx" ON "AiAuditLog"("caseId");

-- CreateIndex
CREATE INDEX "AiAuditLog_userId_idx" ON "AiAuditLog"("userId");

-- CreateIndex
CREATE INDEX "AiAuditLog_actionType_idx" ON "AiAuditLog"("actionType");

-- CreateIndex
CREATE INDEX "AiAuditLog_status_idx" ON "AiAuditLog"("status");

-- CreateIndex
CREATE INDEX "AiAuditLog_createdAt_idx" ON "AiAuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiCaseSuggestion_caseId_key" ON "AiCaseSuggestion"("caseId");

-- CreateIndex
CREATE INDEX "AiCaseSuggestion_isApplied_idx" ON "AiCaseSuggestion"("isApplied");

-- AddForeignKey
ALTER TABLE "AiAuditLog" ADD CONSTRAINT "AiAuditLog_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "LegalCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAuditLog" ADD CONSTRAINT "AiAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCaseSuggestion" ADD CONSTRAINT "AiCaseSuggestion_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "LegalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
