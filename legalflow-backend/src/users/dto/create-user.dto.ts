import { IsEmail, IsNotEmpty, IsString, IsEnum, Matches, MaxLength } from 'class-validator';
import { Role } from '../../common/role.enum';
import { PASSWORD_REGEX, PASSWORD_MESSAGE_VI } from '../../common/constants';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  @MaxLength(100)
  fullName!: string;

  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role!: Role;

  @IsNotEmpty({ message: 'Mật khẩu tạm không được để trống' })
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE_VI })
  passwordTemp!: string;
}
