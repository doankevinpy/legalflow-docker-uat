import { Injectable, BadRequestException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AdminAuditLogsService } from '../admin-audit-logs/admin-audit-logs.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    private prisma: PrismaService,
    private readonly auditLogsService: AdminAuditLogsService,
  ) {}

  private readonly safeSelect = {
    id: true,
    email: true,
    fullName: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.safeSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(createUserDto: CreateUserDto, adminUser: any) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();

    // Check duplicate
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new ConflictException('Email này đã được sử dụng');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.passwordTemp, salt);

    // Save
    const newUser = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName: createUserDto.fullName,
        role: createUserDto.role,
        passwordHash,
      },
      select: this.safeSelect,
    });

    this.logger.log(`[CREATE_USER] Admin (${adminUser.email}) created user (${newUser.email}) with role (${newUser.role})`);
    
    await this.auditLogsService.logAction({
      actorUserId: adminUser.id,
      actorEmail: adminUser.email,
      action: 'CREATE_USER',
      targetUserId: newUser.id,
      targetEmail: newUser.email,
      details: {
        role: newUser.role,
        fullName: newUser.fullName,
      },
    });

    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto, adminUser: any) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // 1. Check self lock
    if (id === adminUser.id && updateUserDto.isActive === false) {
      throw new BadRequestException('Quản trị viên không thể tự khóa tài khoản của chính mình');
    }

    // 2. Protect last admin
    if (targetUser.role === 'ADMIN' && targetUser.isActive) {
      const activeAdmins = await this.prisma.user.findMany({
        where: { role: 'ADMIN', isActive: true },
      });

      if (activeAdmins.length === 1 && activeAdmins[0].id === targetUser.id) {
        // Checking if deactivating last admin
        if (updateUserDto.isActive === false) {
          throw new BadRequestException('Không thể khóa tài khoản ADMIN duy nhất còn hoạt động');
        }
        // Checking if demoting last admin
        if (updateUserDto.role && updateUserDto.role !== 'ADMIN') {
          throw new BadRequestException('Không thể hạ vai trò của tài khoản ADMIN duy nhất còn hoạt động');
        }
      }
    }

    // Update
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updateUserDto.fullName !== undefined && { fullName: updateUserDto.fullName }),
        ...(updateUserDto.role !== undefined && { role: updateUserDto.role }),
        ...(updateUserDto.isActive !== undefined && { isActive: updateUserDto.isActive }),
      },
      select: this.safeSelect,
    });

    // Logging actions
    if (updateUserDto.isActive !== undefined) {
      const action = updateUserDto.isActive ? 'UNLOCK_USER' : 'LOCK_USER';
      this.logger.log(`[${action}] Admin (${adminUser.email}) ${updateUserDto.isActive ? 'unlocked' : 'locked'} user (${updatedUser.email})`);
      await this.auditLogsService.logAction({
        actorUserId: adminUser.id,
        actorEmail: adminUser.email,
        action: action,
        targetUserId: updatedUser.id,
        targetEmail: updatedUser.email,
        details: { oldIsActive: targetUser.isActive, newIsActive: updatedUser.isActive },
      });
    }

    if (updateUserDto.role !== undefined && updateUserDto.role !== targetUser.role) {
      this.logger.log(`[CHANGE_ROLE] Admin (${adminUser.email}) changed role of user (${updatedUser.email}) from (${targetUser.role}) to (${updatedUser.role})`);
      await this.auditLogsService.logAction({
        actorUserId: adminUser.id,
        actorEmail: adminUser.email,
        action: 'CHANGE_ROLE',
        targetUserId: updatedUser.id,
        targetEmail: updatedUser.email,
        details: { oldRole: targetUser.role, newRole: updatedUser.role },
      });
    }

    if (updateUserDto.fullName !== undefined && updateUserDto.fullName !== targetUser.fullName) {
      this.logger.log(`[UPDATE_USER] Admin (${adminUser.email}) updated fullName of user (${updatedUser.email})`);
      await this.auditLogsService.logAction({
        actorUserId: adminUser.id,
        actorEmail: adminUser.email,
        action: 'UPDATE_USER',
        targetUserId: updatedUser.id,
        targetEmail: updatedUser.email,
        details: { changedFields: ['fullName'] },
      });
    }

    return updatedUser;
  }

  async resetPassword(id: string, passwordTemp: string, adminUser: any) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordTemp, salt);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    this.logger.log(`[RESET_PASSWORD] Admin (${adminUser.email}) reset password for user (${targetUser.email})`);
    
    await this.auditLogsService.logAction({
      actorUserId: adminUser.id,
      actorEmail: adminUser.email,
      action: 'RESET_PASSWORD',
      targetUserId: targetUser.id,
      targetEmail: targetUser.email,
      details: {},
    });

    return { message: 'Đặt lại mật khẩu thành công' };
  }

  async remove(id: string, adminUser: any) {
    const targetUser = await this.prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // 1. Chặn tự xóa chính mình
    if (id === adminUser.id) {
      throw new BadRequestException('Quản trị viên không thể tự xóa tài khoản của chính mình');
    }

    // 2. Chặn xóa ADMIN cuối cùng
    if (targetUser.role === 'ADMIN') {
      const allAdmins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
      });
      if (allAdmins.length === 1) {
        throw new BadRequestException('Không thể xóa tài khoản ADMIN duy nhất còn lại trên hệ thống');
      }
    }

    // 3. Chặn hard delete nếu đã có dữ liệu tác nghiệp liên kết
    // a. Check LegalCase (created or assigned)
    const linkedCasesCount = await this.prisma.legalCase.count({
      where: {
        OR: [
          { assignedToId: id },
          { createdById: id },
        ],
      },
    });

    if (linkedCasesCount > 0) {
      throw new ConflictException('Không thể xóa tài khoản này vì đã có dữ liệu hồ sơ liên kết. Hãy khóa tài khoản thay thế.');
    }

    // b. Check CaseNote
    const linkedNotesCount = await this.prisma.caseNote.count({
      where: { userId: id },
    });
    if (linkedNotesCount > 0) {
      throw new ConflictException('Không thể xóa tài khoản này vì đã có dữ liệu ghi chú liên kết. Hãy khóa tài khoản thay thế.');
    }

    // c. Check CaseHistory
    const linkedHistoryCount = await this.prisma.caseHistory.count({
      where: { userId: id },
    });
    if (linkedHistoryCount > 0) {
      throw new ConflictException('Không thể xóa tài khoản này vì đã có lịch sử thao tác liên kết. Hãy khóa tài khoản thay thế.');
    }

    // d. Check CaseChecklistItem (completed)
    const linkedChecklistCount = await this.prisma.caseChecklistItem.count({
      where: { completedById: id },
    });
    if (linkedChecklistCount > 0) {
      throw new ConflictException('Không thể xóa tài khoản này vì đã có dữ liệu checklist hoàn thành liên kết. Hãy khóa tài khoản thay thế.');
    }

    // Thực hiện Hard Delete
    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`[DELETE_USER] Admin (${adminUser.email}) deleted user (${targetUser.email})`);
    
    await this.auditLogsService.logAction({
      actorUserId: adminUser.id,
      actorEmail: adminUser.email,
      action: 'DELETE_USER',
      targetUserId: targetUser.id,
      targetEmail: targetUser.email,
      details: { role: targetUser.role },
    });

    return { success: true };
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}

