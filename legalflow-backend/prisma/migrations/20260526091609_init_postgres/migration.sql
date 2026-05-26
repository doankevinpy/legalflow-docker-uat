-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'STAFF', 'VIEWER');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'NEEDS_MORE_INFO', 'IN_PROGRESS', 'RESPONDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('KN', 'TC', 'KNG', 'PA', 'TVPL', 'KHAC');

-- CreateEnum
CREATE TYPE "CaseField" AS ENUM ('DAT_DAI', 'DAN_SU', 'LAO_DONG', 'HON_NHAN_GIA_DINH', 'DOANH_NGHIEP', 'HANH_CHINH', 'KHAC');

-- CreateEnum
CREATE TYPE "Neighborhood" AS ENUM ('KP1', 'KP2', 'KP3', 'KP4', 'KP5', 'KHAC');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalCase" (
    "id" TEXT NOT NULL,
    "caseCode" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "contact" TEXT,
    "type" "CaseType" NOT NULL,
    "field" "CaseField" NOT NULL,
    "neighborhood" "Neighborhood" NOT NULL,
    "summary" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "documents" JSONB NOT NULL DEFAULT '[]',
    "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "status" "CaseStatus" NOT NULL DEFAULT 'NEW',
    "assignedToId" TEXT,
    "createdById" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseSequence" (
    "year" INTEGER NOT NULL,
    "lastSequence" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseSequence_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "CaseNote" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseHistory" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseChecklistItem" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "completedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetUserId" TEXT,
    "targetEmail" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LegalCase_caseCode_key" ON "LegalCase"("caseCode");

-- CreateIndex
CREATE INDEX "AdminAuditLog_action_idx" ON "AdminAuditLog"("action");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorEmail_idx" ON "AdminAuditLog"("actorEmail");

-- CreateIndex
CREATE INDEX "AdminAuditLog_targetEmail_idx" ON "AdminAuditLog"("targetEmail");

-- CreateIndex
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "LegalCase" ADD CONSTRAINT "LegalCase_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalCase" ADD CONSTRAINT "LegalCase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "LegalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseNote" ADD CONSTRAINT "CaseNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseHistory" ADD CONSTRAINT "CaseHistory_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "LegalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseHistory" ADD CONSTRAINT "CaseHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseChecklistItem" ADD CONSTRAINT "CaseChecklistItem_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "LegalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseChecklistItem" ADD CONSTRAINT "CaseChecklistItem_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
