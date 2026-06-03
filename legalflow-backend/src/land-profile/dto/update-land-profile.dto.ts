import { PartialType } from '@nestjs/mapped-types';
import { CreateLandProfileDto } from './create-land-profile.dto';

export class UpdateLandProfileDto extends PartialType(CreateLandProfileDto) {}
