import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';

import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT');
  const APP_NAME = configService.get<string>('APP_NAME');

  if (!APP_NAME || !PORT) {
    throw new Error('ENV ERROR!');
  }
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // app.set('trust proxy', true);
  app.use(express.static(join(__dirname, '..', 'public')));

  await app.listen(PORT);
  process.once('SIGINT', () => void app.close());
  process.once('SIGTERM', () => void app.close());
  console.log(`${APP_NAME} started on port ${PORT}`);
}

void bootstrap();
