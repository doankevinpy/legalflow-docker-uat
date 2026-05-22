import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength, Matches } from 'class-validator';
import { Role } from '../../common/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  fullName!: string;

  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role!: Role;

  @IsNotEmpty({ message: 'Mật khẩu tạm không được để trống' })
  @MinLength(8, { message: 'Mật khẩu tạm phải có ít nhất 8 ký tự' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    { message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt' }
  )
  passwordTemp!: string;
}
