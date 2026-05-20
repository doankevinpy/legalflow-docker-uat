import { IsString, IsNotEmpty } from 'class-validator';

export class AddCaseNoteDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
