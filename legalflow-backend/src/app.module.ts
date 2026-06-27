import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CasesModule } from './cases/cases.module';
import { AdminAuditLogsModule } from './admin-audit-logs/admin-audit-logs.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StorageModule } from './storage/storage.module';
import { CustomThrottlerGuard } from './common/custom-throttler.guard';
import { MetricsModule } from './metrics/metrics.module';
import { LandProfileModule } from './land-profile/land-profile.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    CasesModule,
    AdminAuditLogsModule,
    AnalyticsModule,
    MetricsModule,
    LandProfileModule,
    AiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
