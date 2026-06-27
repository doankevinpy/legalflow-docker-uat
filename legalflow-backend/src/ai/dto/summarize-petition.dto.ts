import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SummarizePetitionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsOptional()
  caseId?: string;
}
