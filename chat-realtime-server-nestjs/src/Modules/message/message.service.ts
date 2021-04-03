import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './entities/message.entity';
import { plainToClass } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { UserMessage } from './entities/user-message.entity';
// import sequelize, { Op } from "sequelize";
@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private readonly messageModel: typeof Message,
    @InjectModel(UserMessage)
    private readonly userMessageModel: typeof UserMessage,
  ) {}

  create(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = plainToClass(Message, createMessageDto);
    return newMessage.save();
  }

  findAll(room_id) {
    return this.messageModel.findAll({
      where: { room_id },
      attributes: {
        exclude: ['updatedAt', 'deletedAt', 'room_id'],
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['avatar', 'id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }

  findOne(condition) {
    return this.messageModel.findOne(condition);
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  findOneByRoomId(room_id: number) {
    return this.messageModel.findOne({
      where: { room_id },
      limit: 1,
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['updatedAt', 'deletedAt', 'id', 'room_id'],
      },
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['avatar', 'id'],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }
  public createReadMessage(data): Promise<UserMessage> {
    const { message_id, user_id } = data;
    const newCreateReadMessage = new UserMessage();
    newCreateReadMessage.message_id = message_id;
    newCreateReadMessage.user_id = user_id;
    return newCreateReadMessage.save();
  }

  // public async createAllReadMessage(data): Promise<UserMessage> {
  //   const { room_id } = data;
  //   const messages = this.messageModel.findAll({
  //     where: {
  //       room_id,
  //       // id: {
  //       //   [Op.notIn]:{
  //       //     sequelize.fn(),
  //       //   }
  //       // }
  //     },
  //   });
  // }
}
