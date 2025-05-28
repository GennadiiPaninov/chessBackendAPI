import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { corsMiddleware } from '../middleware/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(corsMiddleware);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
