import { Module } from '@nestjs/common';
import { LandProfileService } from './land-profile.service';
import { LandProfileController } from './land-profile.controller';
import { AdminAuditLogsModule } from '../admin-audit-logs/admin-audit-logs.module';

@Module({
  imports: [AdminAuditLogsModule],
  controllers: [LandProfileController],
  providers: [LandProfileService],
  exports: [LandProfileService],
})
export class LandProfileModule {}
