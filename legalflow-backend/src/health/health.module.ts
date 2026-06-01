import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MinioHealthIndicator } from './minio.health';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TerminusModule, PrismaModule, StorageModule],
  controllers: [HealthController],
  providers: [MinioHealthIndicator],
})
export class HealthModule {}
