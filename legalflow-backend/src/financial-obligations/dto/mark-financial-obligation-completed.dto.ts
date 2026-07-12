import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class MarkFinancialObligationCompletedDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  forceCompleted?: boolean;
}
