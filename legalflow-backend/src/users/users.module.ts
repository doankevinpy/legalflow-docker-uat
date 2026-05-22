import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminAuditLogsModule } from '../admin-audit-logs/admin-audit-logs.module';

@Module({
  imports: [AdminAuditLogsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

