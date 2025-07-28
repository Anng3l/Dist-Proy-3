import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as coockieParser from 'cookie-parser';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(coockieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
