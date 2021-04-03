import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserRoomDto } from './dto/create-user-room.dto';
import { UpdateUserRoomDto } from './dto/update-user-room.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoom } from './entities/user-room.entity';
import { RoomsService } from '../rooms/rooms.service';
import { MessageService } from '../message/message.service';
import { Cache } from 'cache-manager';

@Injectable()
export class UserRoomService {
  constructor(@InjectModel(UserRoom) private readonly userRoomModel: typeof UserRoom,
              @Inject(forwardRef(() => RoomsService)) private readonly roomsService: RoomsService,
              private readonly messageService: MessageService,
  ) {
  }

  async create(createUserRoomDto: CreateUserRoomDto) {
    const userRoom = new UserRoom();
    userRoom.room_id = createUserRoomDto.room_id;
    userRoom.user_id = createUserRoomDto.user_id;
    await userRoom.save();
  }

  async findAll(user: any, offset: number) {
    const result = [];
    const userRooms = await this.userRoomModel.findAll({
      where: { user_id: user.id },
      include: ['room'],
      order: [['room', 'updatedAt', 'DESC']],
      offset,
      limit: 10,
    });
    for (const userRoom of userRooms) {
      const room = await this.roomsService.findOne({ id: userRoom.room_id });
      const messages = await this.messageService.findOneByRoomId(userRoom.room_id);
      const { users } = room;
      result.push({ id: room.id, name: room.name, users, messages: messages ? [messages] : [] });
    }
    return result;
  }

  async findRoomExit(user1: number, user2: number): Promise<any> {
    const rooms = await this.userRoomModel.findAll({ where: { user_id: user1 } });
    let roomExit;
    for (const room of rooms) {
      roomExit = await this.userRoomModel.findOne({ where: { user_id: user2, room_id: room.id } });
      if (roomExit) {
        break;
      }
    }
    return roomExit;
  }

}
