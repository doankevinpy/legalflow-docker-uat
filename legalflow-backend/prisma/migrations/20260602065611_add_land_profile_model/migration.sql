-- CreateEnum
CREATE TYPE "LandProcedureType" AS ENUM ('CAP_GIAY_CHUNG_NHAN', 'CHUYEN_MUC_DICH_SD', 'TRANH_CHAP_DAT_DAI', 'GIAO_DAT_CHO_THUE_DAT', 'THU_HOI_DAT_BOI_THUONG', 'KHAC');

-- CreateEnum
CREATE TYPE "LandType" AS ENUM ('DAT_O_DO_THI', 'DAT_O_NONG_THON', 'DAT_TRONG_LUA', 'DAT_TRONG_CAY_LAU_NAM', 'DAT_RUNG_PHONG_HO', 'DAT_SAN_XUAT_KINH_DOANH', 'KHAC');

-- CreateEnum
CREATE TYPE "PlanningStatus" AS ENUM ('TRONG_QUY_HOACH', 'NGOAI_QUY_HOACH', 'CAN_XAC_MINH_THEM');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('DANG_TRANH_CHAP', 'KHONG_TRANH_CHAP', 'CAN_XAC_MINH_THEM');

-- CreateEnum
CREATE TYPE "OriginOfLandStatus" AS ENUM ('NHAN_CHUYEN_NHUONG', 'DUOC_THUA_KE', 'DUOC_TANG_CHO', 'DAT_KHAI_HOANG', 'NHA_NUOC_GIAO_DAT', 'NHA_NUOC_CHO_THUE_DAT', 'KHAC');

-- CreateEnum
CREATE TYPE "DocumentCompleteness" AS ENUM ('DU_HO_SO', 'THIEU_HO_SO');

-- CreateEnum
CREATE TYPE "FinancialObligationStatus" AS ENUM ('HOAN_THANH', 'CHUA_HOAN_THANH', 'MIEN_GIAM');

-- CreateEnum
CREATE TYPE "LandOutcome" AS ENUM ('CHAP_THUAN', 'TU_CHOI', 'CHUYEN_TRA');

-- CreateEnum
CREATE TYPE "LandReasonCode" AS ENUM ('QUY_HOACH_XUNG_DOT', 'TRANH_CHAP_CHUA_GIAI_QUYET', 'THIEU_GIAY_TO_PHAP_LY', 'CHUA_HOAN_THANH_NGHIA_VU_TAI_CHINH', 'HO_SO_KHONG_HOP_LE', 'KHAC');

-- CreateEnum
CREATE TYPE "ComplaintType" AS ENUM ('KN', 'TC', 'PA');

-- CreateEnum
CREATE TYPE "RiskReviewStatus" AS ENUM ('AN_TOAN', 'CAN_RA_SOAT', 'DA_XAC_MINH_BINH_THUONG', 'DA_XU_LY_DIEU_CHINH');

-- CreateTable
CREATE TABLE "LandProfile" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "procedureType" "LandProcedureType" NOT NULL DEFAULT 'KHAC',
    "landType" "LandType" NOT NULL,
    "currentLandUseType" "LandType" NOT NULL,
    "requestedLandUseType" "LandType",
    "area" DOUBLE PRECISION NOT NULL,
    "neighborhood" "Neighborhood" NOT NULL,
    "planningStatus" "PlanningStatus" NOT NULL DEFAULT 'NGOAI_QUY_HOACH',
    "disputeStatus" "DisputeStatus" NOT NULL DEFAULT 'KHONG_TRANH_CHAP',
    "originOfLandStatus" "OriginOfLandStatus" NOT NULL DEFAULT 'KHAC',
    "documentCompleteness" "DocumentCompleteness" NOT NULL DEFAULT 'DU_HO_SO',
    "financialObligationStatus" "FinancialObligationStatus" NOT NULL DEFAULT 'HOAN_THANH',
    "outcome" "LandOutcome",
    "reasonCode" "LandReasonCode",
    "complaintFlag" BOOLEAN NOT NULL DEFAULT false,
    "complaintType" "ComplaintType",
    "processingDays" INTEGER,
    "overdueDays" INTEGER,
    "riskReviewStatus" "RiskReviewStatus" NOT NULL DEFAULT 'AN_TOAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandProfile_caseId_key" ON "LandProfile"("caseId");

-- CreateIndex
CREATE INDEX "LandProfile_procedureType_idx" ON "LandProfile"("procedureType");

-- CreateIndex
CREATE INDEX "LandProfile_landType_idx" ON "LandProfile"("landType");

-- CreateIndex
CREATE INDEX "LandProfile_neighborhood_idx" ON "LandProfile"("neighborhood");

-- CreateIndex
CREATE INDEX "LandProfile_outcome_idx" ON "LandProfile"("outcome");

-- CreateIndex
CREATE INDEX "LandProfile_reasonCode_idx" ON "LandProfile"("reasonCode");

-- CreateIndex
CREATE INDEX "LandProfile_complaintFlag_idx" ON "LandProfile"("complaintFlag");

-- CreateIndex
CREATE INDEX "LandProfile_planningStatus_idx" ON "LandProfile"("planningStatus");

-- CreateIndex
CREATE INDEX "LandProfile_procedureType_outcome_idx" ON "LandProfile"("procedureType", "outcome");

-- CreateIndex
CREATE INDEX "LandProfile_neighborhood_outcome_idx" ON "LandProfile"("neighborhood", "outcome");

-- CreateIndex
CREATE INDEX "LandProfile_landType_outcome_idx" ON "LandProfile"("landType", "outcome");

-- CreateIndex
CREATE INDEX "LandProfile_complaintFlag_outcome_idx" ON "LandProfile"("complaintFlag", "outcome");

-- AddForeignKey
ALTER TABLE "LandProfile" ADD CONSTRAINT "LandProfile_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "LegalCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
