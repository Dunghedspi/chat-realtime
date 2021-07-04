import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis.adapter';
import * as cookieParser from 'cookie-parser';
import fs from "fs"
async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.pem'),
    cert: fs.readFileSync('./secrets/public-certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, {httpsOptions});
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  const PORT = Number.parseInt(process.env.PORT);
  app.enableCors({ credentials: true, origin: process.env.CLIENT_DOMAIN });
  app.use(cookieParser());
  await app.listen(PORT);
}
bootstrap().catch((error) => console.log(error));
