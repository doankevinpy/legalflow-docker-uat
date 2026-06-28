import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsArray } from 'class-validator';
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

  @IsOptional()
  @IsString()
  feedbackType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  checklistItems?: string[];

  @IsOptional()
  @IsString()
  draftType?: string;

  @IsOptional()
  @IsString()
  draftTitle?: string;

  @IsOptional()
  @IsString()
  draftContent?: string;
}

