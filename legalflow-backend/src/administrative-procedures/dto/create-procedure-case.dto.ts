import { IsString, IsOptional, IsEnum, IsObject, IsDateString } from 'class-validator';
import { ProcedureField, ProcedureStatus } from '@prisma/client';

export class CreateProcedureCaseDto {
  @IsString()
  procedureTypeId!: string;

  @IsEnum(ProcedureField)
  field!: ProcedureField;

  @IsString()
  applicantName!: string;

  @IsString()
  @IsOptional()
  applicantAddress?: string;

  @IsString()
  @IsOptional()
  applicantPhone?: string;

  @IsObject()
  @IsOptional()
  landParcelSummary?: Record<string, any>;

  @IsObject()
  @IsOptional()
  constructionSummary?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
