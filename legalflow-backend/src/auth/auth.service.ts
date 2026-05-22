import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản này đã bị khóa hoặc ngừng hoạt động');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // 1. Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    // 2. Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu hiện tại');
    }

    // 3. Kiểm tra mật khẩu mới và xác nhận mật khẩu khớp nhau
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Mật khẩu mới và mật khẩu xác nhận không khớp');
    }

    // 4. Băm mật khẩu mới và lưu
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, salt);

    await this.usersService.updatePassword(userId, newPasswordHash);

    // In log quản trị sử dụng NestJS Logger
    this.logger.log(`[CHANGE_PASSWORD] User (${user.email}) changed password successfully`);

    return {
      message: 'Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
    };
  }
}
