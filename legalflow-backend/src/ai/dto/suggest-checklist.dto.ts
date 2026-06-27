import { IsString, IsOptional } from 'class-validator';

export class SuggestChecklistDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  caseId?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  field?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  request?: string;
}
