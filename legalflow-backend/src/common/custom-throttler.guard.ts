import { Injectable, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger('RateLimiter');

  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: any): Promise<void> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip;
    const method = req.method;
    const url = req.url;

    // Log the event to console
    this.logger.warn(`[RATE_LIMIT_HIT] IP: ${ip} - Method: ${method} - URL: ${url}`);

    throw new HttpException(
      'Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau ít phút.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
