import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet({
    contentSecurityPolicy: false, // Nới lỏng CSP cho môi trường dev/localhost
  }));

  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const frontendOriginStr = configService.get<string>('FRONTEND_ORIGIN', 'http://localhost:5173');
  
  // Xử lý origin thành mảng
  const allowedOrigins = frontendOriginStr
    .split(',')
    .map(o => o.trim())
    .filter(o => o && o !== '*');

  if (frontendOriginStr.includes('*')) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '[SECURITY WARNING] Wildcard CORS (*) is disabled by strict policy. Reverting to strict check or dropping wildcard.',
    );
  }

  app.enableCors({
    origin: (origin: string, callback: Function) => {
      // Cho phép request không có origin (ví dụ: server-to-server, curl, Postman local) 
      // Tuy nhiên nếu bạn muốn cực kỳ khắt khe, hãy bỏ dòng này và luôn reject nếu !origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy: Origin not allowed'));
      }
    },
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', '127.0.0.1'); // Bind 127.0.0.1 mặc định cho an toàn
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
