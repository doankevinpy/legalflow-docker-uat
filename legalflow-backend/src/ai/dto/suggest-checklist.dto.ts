import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SuggestChecklistDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsOptional()
  caseId?: string;
}
