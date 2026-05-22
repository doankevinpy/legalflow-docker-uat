import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CasesModule } from './cases/cases.module';
import { AdminAuditLogsModule } from './admin-audit-logs/admin-audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HealthModule,
    CasesModule,
    AdminAuditLogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
