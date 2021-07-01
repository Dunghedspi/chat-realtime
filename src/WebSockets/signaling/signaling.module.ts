import { CacheModule, Module } from '@nestjs/common';
import { SignalingService } from './signaling.service';
import { SignalingGateway } from './signaling.gateway';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 10000,
  })],
  providers: [SignalingGateway, SignalingService]
})
export class SignalingModule {}
