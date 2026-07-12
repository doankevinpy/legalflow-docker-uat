import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FinancialObligationAssessmentMode } from '@prisma/client';

export class CreateFinancialObligationAssessmentDto {
  @IsString()
  @IsOptional()
  procedureType?: string;

  @IsEnum(FinancialObligationAssessmentMode)
  @IsOptional()
  assessmentMode?: FinancialObligationAssessmentMode;
}
