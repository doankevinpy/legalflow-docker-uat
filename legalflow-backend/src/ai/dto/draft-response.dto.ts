import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class DraftResponseDto {
  @IsString()
  @IsNotEmpty()
  draftType!: string;

  @IsObject()
  @IsOptional()
  petitionContext?: Record<string, any>;

  @IsString()
  @IsOptional()
  caseId?: string;

  @IsString()
  @IsOptional()
  customInstructions?: string;
}

