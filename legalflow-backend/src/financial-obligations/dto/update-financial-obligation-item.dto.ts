import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { FinancialObligationItemType } from '@prisma/client';

export class UpdateFinancialObligationItemDto {
  @IsEnum(FinancialObligationItemType)
  @IsOptional()
  itemType?: FinancialObligationItemType;

  @IsString()
  @IsOptional()
  itemLabel?: string;

  @IsNumber()
  @IsOptional()
  estimatedAmount?: number;

  @IsString()
  @IsOptional()
  calculationBasis?: string;

  @IsString()
  @IsOptional()
  legalBasis?: string;

  @IsString()
  @IsOptional()
  dataSource?: string;

  @IsNumber()
  @IsOptional()
  confidenceLevel?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
