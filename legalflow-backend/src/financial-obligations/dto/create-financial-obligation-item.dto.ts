import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { FinancialObligationItemType } from '@prisma/client';

export class CreateFinancialObligationItemDto {
  @IsEnum(FinancialObligationItemType)
  itemType!: FinancialObligationItemType;

  @IsString()
  itemLabel!: string;

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
