import { CacheModule, Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageModule as MessageModuleResource } from '../../Modules/message/message.module';
import { RoomsModule } from '../../Modules/rooms/rooms.module';
import * as redisStore from 'cache-manager-redis-store';
import { UserRoomModule } from '../../Modules/user-room/user-room.module';
import { AuthModule } from '../../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheConfigService } from 'src/configs/cache.config';

@Module({
  imports: [
    AuthModule,
    MessageModuleResource,
    RoomsModule,
    UserRoomModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
    }),
  ],
  controllers: [],
  providers: [MessageGateway],
})
export class MessageModule {}
