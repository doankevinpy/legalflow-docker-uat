import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AiFeedbackStatus } from '@prisma/client';

export class AiFeedbackDto {
  @IsString()
  @IsNotEmpty()
  caseId!: string;

  @IsEnum(AiFeedbackStatus)
  feedback!: AiFeedbackStatus; // 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'PENDING'

  @IsOptional()
  @IsBoolean()
  applyToCase?: boolean;
}
