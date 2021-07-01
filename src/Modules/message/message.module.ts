import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './entities/message.entity';
import { RoomsService } from '../rooms/rooms.service';
import { UserMessage } from './entities/user-message.entity';

@Module({
  imports: [SequelizeModule.forFeature([Message]), SequelizeModule.forFeature([UserMessage])],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
