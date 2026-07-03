import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProcedureNoteType } from '@prisma/client';

export class AddProcedureNoteDto {
  @IsString()
  content!: string;

  @IsEnum(ProcedureNoteType)
  @IsOptional()
  noteType?: ProcedureNoteType;
}
