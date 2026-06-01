import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsGuardMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const expectedToken = process.env.METRICS_INTERNAL_TOKEN;
    const token = req.headers['x-internal-metrics-token'];

    if (!expectedToken) {
      return res
        .status(403)
        .json({ statusCode: 403, message: 'Metrics disabled' });
    }

    if (token !== expectedToken) {
      return res.status(403).json({ statusCode: 403, message: 'Forbidden' });
    }

    next();
  }
}
