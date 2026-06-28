import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SuggestDraftDto {
  @IsString()
  @IsNotEmpty()
  caseId!: string;

  @IsString()
  @IsNotEmpty()
  draftType!: string; // PHIEU_XU_LY | GIAY_MOI_LAM_VIEC

  @IsString()
  @IsOptional()
  customInstructions?: string;
}
