import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number): any {
    const server = super.createIOServer(port);
    const redisAdapter = redisIoAdapter({
      // url: process.env.REDIS_URL, //deploy heroku
      host: process.env.REDIS_URL,
      port: parseInt(process.env.REDIS_PORT),
    });
    server.adapter(redisAdapter);
    return server;
  }
}
