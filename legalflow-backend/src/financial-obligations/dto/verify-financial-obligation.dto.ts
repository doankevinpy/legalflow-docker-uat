import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OfficerReviewStatus, ManagerReviewStatus } from '@prisma/client';

export class VerifyFinancialObligationDto {
  @IsEnum(OfficerReviewStatus)
  @IsOptional()
  officerReviewStatus?: OfficerReviewStatus;

  @IsEnum(ManagerReviewStatus)
  @IsOptional()
  managerReviewStatus?: ManagerReviewStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
