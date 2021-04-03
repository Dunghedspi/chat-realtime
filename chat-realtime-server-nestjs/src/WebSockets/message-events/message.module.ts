import { CacheModule, Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageModule as MessageModuleResource } from '../../Modules/message/message.module';
import { RoomsModule } from '../../Modules/rooms/rooms.module';
import * as redisStore from 'cache-manager-redis-store';
import { UserRoomModule } from '../../Modules/user-room/user-room.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule,MessageModuleResource, RoomsModule, UserRoomModule, CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 10000,
  })],
  controllers: [],
  providers: [MessageGateway],
})
export class MessageModule {
}
