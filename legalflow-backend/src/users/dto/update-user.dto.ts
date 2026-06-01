import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../../common/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Họ tên không được để trống nếu cập nhật' })
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
