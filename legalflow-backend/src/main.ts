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

  const frontendOrigin = configService.get<string>('FRONTEND_ORIGIN', 'http://localhost:5173');
  if (frontendOrigin === '*') {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '[SECURITY WARNING] Wildcard CORS (*) is enabled. For production or intranet trials, please specify the exact frontend origin.',
    );
  }
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
