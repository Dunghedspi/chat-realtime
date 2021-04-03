import { CACHE_MANAGER, CacheModule, forwardRef, Module } from '@nestjs/common';
import { UserRoomService } from './user-room.service';
import { UserRoomController } from './user-room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRoom } from './entities/user-room.entity';
import { MessageModule } from '../message/message.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [SequelizeModule.forFeature([UserRoom]), MessageModule, forwardRef(() => RoomsModule)],
  controllers: [UserRoomController],
  providers: [UserRoomService],
  exports: [UserRoomService],
})
export class UserRoomModule {
}
