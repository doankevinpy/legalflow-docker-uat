import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateTaxNoticeRecordDto {
  @IsString()
  noticeNumber!: string;

  @IsString()
  issuingAuthority!: string;

  @IsDateString()
  issueDate!: string;

  @IsDateString()
  receivedDate!: string;

  @IsNumber()
  totalAmount!: number;

  @IsString()
  fileAttachmentId!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
