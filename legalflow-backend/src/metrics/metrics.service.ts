import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('legalflow_upload_total')
    private uploadCounter: Counter<string>,
    @InjectMetric('legalflow_download_url_total')
    private downloadCounter: Counter<string>,
    @InjectMetric('legalflow_db_ready') private dbReadyGauge: Gauge<string>,
    @InjectMetric('legalflow_minio_ready')
    private minioReadyGauge: Gauge<string>,
  ) {}

  incUpload(status: 'success' | 'fail') {
    this.uploadCounter.inc({ status });
  }

  incDownload(status: 'success' | 'fail') {
    this.downloadCounter.inc({ status });
  }

  setDbReady(isReady: boolean) {
    this.dbReadyGauge.set(isReady ? 1 : 0);
  }

  setMinioReady(isReady: boolean) {
    this.minioReadyGauge.set(isReady ? 1 : 0);
  }
}
