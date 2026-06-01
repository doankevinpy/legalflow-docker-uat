import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  constructor(private readonly storageService: StorageService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isReady = await this.storageService.checkReadiness();
    const result = this.getStatus(key, isReady);

    if (isReady) {
      return result;
    }
    throw new HealthCheckError('MinIO check failed', result);
  }
}
