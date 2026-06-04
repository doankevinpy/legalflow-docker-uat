import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsBoolean,
  IsInt,
} from 'class-validator';
import {
  LandProcedureType,
  LandType,
  Neighborhood,
  PlanningStatus,
  DisputeStatus,
  OriginOfLandStatus,
  DocumentCompleteness,
  FinancialObligationStatus,
  LandOutcome,
  LandReasonCode,
  ComplaintType,
  RiskReviewStatus,
} from '@prisma/client';

export class CreateLandProfileDto {
  @IsEnum(LandProcedureType)
  @IsOptional()
  procedureType?: LandProcedureType;

  @IsEnum(LandType)
  landType!: LandType;

  @IsEnum(LandType)
  currentLandUseType!: LandType;

  @IsEnum(LandType)
  @IsOptional()
  requestedLandUseType?: LandType;

  @IsNumber()
  @IsPositive()
  area!: number;

  @IsEnum(Neighborhood)
  neighborhood!: Neighborhood;

  @IsEnum(PlanningStatus)
  @IsOptional()
  planningStatus?: PlanningStatus;

  @IsEnum(DisputeStatus)
  @IsOptional()
  disputeStatus?: DisputeStatus;

  @IsEnum(OriginOfLandStatus)
  @IsOptional()
  originOfLandStatus?: OriginOfLandStatus;

  @IsEnum(DocumentCompleteness)
  @IsOptional()
  documentCompleteness?: DocumentCompleteness;

  @IsEnum(FinancialObligationStatus)
  @IsOptional()
  financialObligationStatus?: FinancialObligationStatus;

  @IsEnum(LandOutcome)
  @IsOptional()
  outcome?: LandOutcome;

  @IsEnum(LandReasonCode)
  @IsOptional()
  reasonCode?: LandReasonCode;

  @IsBoolean()
  @IsOptional()
  complaintFlag?: boolean;

  @IsEnum(ComplaintType)
  @IsOptional()
  complaintType?: ComplaintType;

  @IsInt()
  @IsOptional()
  processingDays?: number;

  @IsInt()
  @IsOptional()
  overdueDays?: number;

  @IsEnum(RiskReviewStatus)
  @IsOptional()
  riskReviewStatus?: RiskReviewStatus;
}
