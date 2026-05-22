import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_MESSAGE_VI } from '../../common/constants';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MESSAGE_VI })
  passwordTemp!: string;
}
