import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis.adapter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  const PORT = Number.parseInt(process.env.SERVER_PORT);
  app.enableCors({ credentials: true, origin: process.env.CLIENT_DOMAIN });
  app.use(cookieParser());
  await app.listen(PORT);
}
bootstrap().catch((error) => console.log(error));
