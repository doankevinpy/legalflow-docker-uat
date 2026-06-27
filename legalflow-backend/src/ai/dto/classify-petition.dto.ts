import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ClassifyPetitionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsString()
  @IsOptional()
  caseId?: string;
}
