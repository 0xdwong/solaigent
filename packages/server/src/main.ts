import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {MyLogger} from './utils/mylogger';

dotenv.config();

async function bootstrap() {
  const logger = new MyLogger();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { 
    cors: true,
    logger: logger
   });

  app.useStaticAssets('public')

  const PORT = process.env.PORT;
  await app.listen(PORT);

  logger.log(`APP listening on ${PORT}`);
}

bootstrap();
