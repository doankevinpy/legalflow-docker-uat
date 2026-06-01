import { Module } from '@nestjs/common';
import { AdminAuditLogsService } from './admin-audit-logs.service';
import { AdminAuditLogsController } from './admin-audit-logs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdminAuditLogsService],
  controllers: [AdminAuditLogsController],
  exports: [AdminAuditLogsService],
})
export class AdminAuditLogsModule {}
