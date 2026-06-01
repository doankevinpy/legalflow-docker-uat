import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsGuardMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const expectedToken = process.env.METRICS_INTERNAL_TOKEN;

    if (!expectedToken) {
      return res.status(503).json({
        statusCode: 503,
        message: 'Metrics disabled (token not configured)',
      });
    }

    const customHeaderToken = req.headers['x-internal-metrics-token'];
    let authHeaderToken: string | undefined;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      authHeaderToken = authHeader.substring(7);
    }

    const providedToken = customHeaderToken || authHeaderToken;

    if (!providedToken || providedToken !== expectedToken) {
      return res.status(403).json({
        statusCode: 403,
        message: 'Forbidden',
      });
    }

    next();
  }
}
