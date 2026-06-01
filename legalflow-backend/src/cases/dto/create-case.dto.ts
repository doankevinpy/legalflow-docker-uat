import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CaseType, CaseField, CaseNeighborhood } from '../enums/case.enum';

class DocumentDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateCaseDto {
  @IsString()
  senderName!: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsEnum(CaseType)
  type!: CaseType;

  @IsEnum(CaseField)
  field!: CaseField;

  @IsEnum(CaseNeighborhood)
  neighborhood!: CaseNeighborhood;

  @IsString()
  summary!: string;

  @IsString()
  request!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  @IsOptional()
  documents?: DocumentDto[];

  @IsDateString()
  @IsOptional()
  receivedDate?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;
}
