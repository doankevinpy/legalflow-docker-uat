import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_MESSAGE_VI } from '../../common/constants';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  @IsString()
  currentPassword!: string;

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE_VI })
  newPassword!: string;

  @IsNotEmpty({ message: 'Mật khẩu xác nhận không được để trống' })
  @IsString()
  confirmPassword!: string;
}
