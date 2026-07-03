import { IsString, IsOptional, IsEnum, IsObject, IsDateString } from 'class-validator';
import { ProcedureStatus, ProcedureField } from '@prisma/client';

export class UpdateProcedureCaseDto {
  @IsEnum(ProcedureStatus)
  @IsOptional()
  status?: ProcedureStatus;

  @IsEnum(ProcedureField)
  @IsOptional()
  field?: ProcedureField;

  @IsString()
  @IsOptional()
  applicantName?: string;

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
  assignedToId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
