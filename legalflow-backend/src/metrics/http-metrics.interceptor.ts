import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
    @InjectMetric('http_errors_total')
    private readonly errorCounter: Counter<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method = req.method;

    // Use route path to avoid PII in URL. e.g. req.route.path is '/api/users/:id' instead of '/api/users/john.doe'
    // Fallback to route if available
    let route = 'unknown_route';
    if (req.route && req.route.path) {
      route = req.route.path;
    } else if (req.path === '/metrics') {
      route = '/metrics';
    }

    if (route === '/metrics') {
      return next.handle();
    }

    const endTimer = this.requestDuration.startTimer();

    return next.handle().pipe(
      tap(() => {
        const status = res.statusCode;
        this.requestCounter.inc({
          method,
          route,
          status_code: status.toString(),
        });
        endTimer({ method, route, status_code: status.toString() });
      }),
      catchError((error) => {
        let status = 500;
        if (error instanceof HttpException) {
          status = error.getStatus();
        }

        this.requestCounter.inc({
          method,
          route,
          status_code: status.toString(),
        });
        this.errorCounter.inc({
          method,
          route,
          status_code: status.toString(),
        });
        endTimer({ method, route, status_code: status.toString() });

        return throwError(() => error);
      }),
    );
  }
}
