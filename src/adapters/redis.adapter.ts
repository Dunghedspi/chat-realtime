import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { ConfigService } from '@nestjs/config';
export class RedisIoAdapter extends IoAdapter {
  readonly app: any;
  constructor(app?: any) {
    super(app);
    this.app = app;
  }
  createIOServer(port: number): any {
    const server = super.createIOServer(port);
    const redisAdapter = redisIoAdapter(this.app.get(ConfigService).get('redis'));
    server.adapter(redisAdapter);
    return server;
  }
}