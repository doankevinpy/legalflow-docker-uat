import { IsEnum } from 'class-validator';
import { CaseStatus } from '../enums/case.enum';

export class ChangeCaseStatusDto {
  @IsEnum(CaseStatus)
  status!: CaseStatus;
}
