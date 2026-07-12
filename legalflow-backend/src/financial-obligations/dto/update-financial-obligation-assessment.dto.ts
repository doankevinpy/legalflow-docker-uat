import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import {
  FinancialObligationAssessmentStatus,
  FinancialObligationAssessmentMode,
  FinancialRiskLevel,
} from '@prisma/client';

export class UpdateFinancialObligationAssessmentDto {
  @IsEnum(FinancialObligationAssessmentStatus)
  @IsOptional()
  assessmentStatus?: FinancialObligationAssessmentStatus;

  @IsEnum(FinancialObligationAssessmentMode)
  @IsOptional()
  assessmentMode?: FinancialObligationAssessmentMode;

  @IsEnum(FinancialRiskLevel)
  @IsOptional()
  riskLevel?: FinancialRiskLevel;

  @IsString()
  @IsOptional()
  warningText?: string;

  @IsNumber()
  @IsOptional()
  estimatedTotalAmount?: number;
}
