import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as coockieParser from 'cookie-parser';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(coockieParser());
  app.enableCors({
    //CAMBIAR CUANDO YA SE CUENTE CON EL FRONT DESPLEGADO
    origin: 'http://127.0.0.1:5500', 
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.PORT ?? 3000);
}
bootstrap();
