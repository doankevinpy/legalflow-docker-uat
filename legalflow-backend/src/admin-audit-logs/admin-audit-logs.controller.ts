import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAuditLogsService } from './admin-audit-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/role.enum';

@Controller('admin-audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminAuditLogsController {
  constructor(private readonly auditLogsService: AdminAuditLogsService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: any) {
    return this.auditLogsService.findAll(query);
  }
}
