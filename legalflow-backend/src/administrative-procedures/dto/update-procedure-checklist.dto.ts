import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateProcedureChecklistDto {
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
