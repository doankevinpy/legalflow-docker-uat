import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { MinioHealthIndicator } from './minio.health';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private minioHealth: MinioHealthIndicator,
    private prismaService: PrismaService,
    private metricsService: MetricsService,
  ) {}

  @Get('health')
  checkLiveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  async checkReadiness() {
    let isDbReady = false;
    let isMinioReady = false;

    try {
      const result = await this.health.check([
        async () => {
          const res = await this.prismaHealth.pingCheck(
            'database',
            this.prismaService,
          );
          isDbReady = res.database.status === 'up';
          return res;
        },
        async () => {
          const res = await this.minioHealth.isHealthy('storage');
          isMinioReady = res.storage.status === 'up';
          return res;
        },
      ]);
      this.metricsService.setDbReady(isDbReady);
      this.metricsService.setMinioReady(isMinioReady);
      return result;
    } catch (error: any) {
      if (error && error.response && error.response.details) {
        const details = error.response.details;
        this.metricsService.setDbReady(details.database?.status === 'up');
        this.metricsService.setMinioReady(details.storage?.status === 'up');
      }
      throw error;
    }
  }
}
