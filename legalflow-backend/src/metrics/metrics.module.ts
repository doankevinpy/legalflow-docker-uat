import { Module, MiddlewareConsumer, NestModule, Global } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsGuardMiddleware } from './metrics-guard.middleware';
import { HttpMetricsInterceptor } from './http-metrics.interceptor';
import { MetricsService } from './metrics.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics',
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeCounterProvider({
      name: 'http_errors_total',
      help: 'Total HTTP errors',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeCounterProvider({
      name: 'legalflow_upload_total',
      help: 'Total document uploads',
      labelNames: ['status'],
    }),
    makeCounterProvider({
      name: 'legalflow_download_url_total',
      help: 'Total document download URL generations',
      labelNames: ['status'],
    }),
    makeGaugeProvider({
      name: 'legalflow_db_ready',
      help: 'Database readiness status (1=ready, 0=not ready)',
    }),
    makeGaugeProvider({
      name: 'legalflow_minio_ready',
      help: 'MinIO readiness status (1=ready, 0=not ready)',
    }),
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsGuardMiddleware).forRoutes('/metrics');
  }
}
