import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ProcedurePriority } from '@prisma/client';

export class AddProcedureChecklistDto {
  @IsString()
  checklistGroup!: string;

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProcedurePriority)
  @IsOptional()
  priority?: ProcedurePriority;
}
