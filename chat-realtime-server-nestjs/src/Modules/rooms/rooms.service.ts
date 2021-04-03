import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './entities/room.entity';
// import { UpdateRoomDto } from './dto/update-room.dto';
import * as Bcrypt from 'bcrypt';
import { UserRoomService } from '../user-room/user-room.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room) private readonly roomModel: typeof Room,
              private readonly userRoomService: UserRoomService,
  ) {
  }

  async create(createRoomDto: CreateRoomDto) {
    const newRoom = new Room();
    newRoom.code = await Bcrypt.hash(Date.now().toString(), 0);
    newRoom.name = createRoomDto.name;
    const room = await newRoom.save();
    for (const item of createRoomDto.token) {
      await this.userRoomService.create({ room_id: room.id, user_id: +item });
    }
    return room;
  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(condition) {
    return this.roomModel.findOne({
      where: condition,
      include: [
        {
          model: User,
          as: "users",
          attributes: ["email", "avatar", "id"],
          through: {
            attributes: [],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "deletedAt"]
      }
    });
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {
  //   return `This action updates a #${id} room`;
  // }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async storeRoom(room) {
    room.save();
  }
}
