import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreatePaymentEvidenceRecordDto {
  @IsDateString()
  paymentDate!: string;

  @IsNumber()
  amountPaid!: number;

  @IsString()
  payerName!: string;

  @IsString()
  receiptNumber!: string;

  @IsString()
  treasuryOrBank!: string;

  @IsString()
  fileAttachmentId!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
