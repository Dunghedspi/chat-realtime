import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis.adapter';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./key.pem'),
  //   cert: fs.readFileSync('./cert.pem'),
  // };
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  const configService = app.get(ConfigService);
  const PORT = Number.parseInt(configService.get('host')?.port);

  app.enableCors({
    credentials: true,
    origin: configService.get('cors')?.domain,
  });

  app.use(cookieParser());
  await app.listen(PORT);
}
bootstrap().catch((error) => console.log(error));
