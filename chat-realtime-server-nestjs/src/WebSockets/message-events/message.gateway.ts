import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import {
  CACHE_MANAGER,
  Inject,
  Logger,
  UseGuards,
  ExecutionContext,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { MessageService } from '../../Modules/message/message.service';
import { RoomsService } from '../../Modules/rooms/rooms.service';
import { Cache } from 'cache-manager';
import { MessageUtils } from './message.utils';
import { UserRoomService } from '../../Modules/user-room/user-room.service';
import { WsGuard } from '../../auth/guards/ws.guard';

const fs = require('fs');

@WebSocketGateway({ namespace: '/chat' })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: any[] = [];

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomsService,
    private readonly userRoomService: UserRoomService,
    @Inject(CACHE_MANAGER) private cacheModule: Cache,
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, payload): Promise<any> {
    client.join('room:' + payload.id);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('sendMess')
  @UseGuards(WsGuard)
  public async sendMess(client: Socket, payload) {
    let newMessage = await this.messageService.create(payload);
    if (newMessage) {
      newMessage.dataValues.users = [];
      this.server.to('room:' + payload.room_id).emit('recvMess', newMessage);
    }
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  @UseGuards(WsGuard)
  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.join('room-call:1');
  }

  @SubscribeMessage('afterConnect')
  @UseGuards(WsGuard)
  public async afterConnect(client: Socket, payload) {
    const { user } = payload;
    await this.cacheModule.set(user.id, client.id);
    client.broadcast.emit('online', { user_id: user.id });
  }

  @SubscribeMessage('joinListRoom')
  @UseGuards(WsGuard)
  public async joinListRoom(client: Socket, payload) {
    const { offset, user } = payload;
    const rooms = await this.userRoomService.findAll(user, offset);
    const payloadResponse = [];
    for (const room of rooms) {
      client.join('room:' + room.id);
      const index = room.users.findIndex((item) => item.id !== user.id);
      if (await this.cacheModule.get(room.users[index].id)) {
        room.users[index].dataValues.online = 1;
      }

      payloadResponse.push(room);
    }
    client.emit('rooms', rooms);
  }

  @SubscribeMessage('sendImage')
  public sendImage(client: Socket, payload) {
    const guess = payload.message.match(/^data:image\/(png|jpeg);base64,/)[1];
    let ext = '';
    switch (guess) {
      case 'png':
        ext = '.png';
        break;
      case 'jpeg':
        ext = '.jpg';
        break;
      default:
        ext = '.bin';
    }
    const savedFilename = MessageUtils.randomString(10) + ext;
    fs.writeFile(
      'uploads/image/' + savedFilename,
      MessageUtils.getBase64Image(payload.message),
      'base64',
      (err) => {
        const newMessage = {
          user_id: payload.user_id,
          message: savedFilename,
          room_id: payload.room_id,
          type: 'image',
        };
        this.messageService.create(newMessage).then(() => {
          this.server.to(`room:${newMessage.room_id}`).emit('recvMess', {
            ...newMessage,
            message: MessageUtils.getUrlImage(newMessage.message),
          });
        });
      },
    );
  }

  @SubscribeMessage('createRoom')
  public async createRoom(client: Socket, payload: any): Promise<any> {
    const { token } = payload;
    const room = await this.userRoomService.findRoomExit(token[0], token[1]);
    if (room) {
      const r = await this.roomService.findOne({ id: room.room_id });
      const messages = await this.messageService.findOneByRoomId(r.id);
      client.join('room:' + r.id);
      const payloadRes = {
        id: r.id,
        name: r.name,
        users: r.users,
        messages: messages ? messages : [],
      };
      this.server.to('room:' + r.id).emit('recvRoom', payloadRes);
    } else {
      try {
        const r = await this.roomService.create(payload);
        const searchRoom = await this.roomService.findOne({ id: r.id });
        const index = token.findIndex((id) => id === payload.user_id);
        const socketId = await this.cacheModule.get(token[index]);
        const payloadRes = {
          id: searchRoom.id,
          name: searchRoom.name,
          users: searchRoom.users,
          messages: [],
        };
        client.join('room:' + r.id);
        this.server.to(socketId).emit('recvRoom', payloadRes);
        this.server.to('room:' + r.id).emit('recvRoom', payloadRes);
      } catch (e) {
        console.log(e);
      }
    }
  }

  @SubscribeMessage('typing')
  public sendTyping(client: Socket, payload) {
    const { room_id } = payload;
    client.to('room:' + room_id).emit('typing', payload);
  }

  @SubscribeMessage('endtyping')
  public sendEndTyping(client: Socket, payload) {
    const { room_id } = payload;
    client.to('room:' + room_id).emit('endtyping', payload);
  }

  @SubscribeMessage('offline')
  @UseGuards(WsGuard)
  public async sendOffLine(client: Socket, payload) {
    const { user } = payload;
    await this.cacheModule.del(user.id);
    client.broadcast.emit('offline', { user_id: user.id });
  }

  @SubscribeMessage('read-message')
  @UseGuards(WsGuard)
  public async readMessage(client: Socket, payload) {
    const { id, user, room_id } = payload;
    const newUserReadMessage = await this.messageService.createReadMessage({
      message_id: id,
      user_id: user.id,
    });
    this.server
      .to('room:' + room_id)
      .emit('read-message', { message_id: id, room_id, user });
  }

  //p2p
  @SubscribeMessage('call-user')
  @UseGuards(WsGuard)
  public callUser(client: Socket, data): void {
    const { room_id } = data;
    client.join('room-call:' + room_id);
    this.server
      .to('room:' + room_id)
      .emit('call-user', { user: data.user, room_id: room_id });
  }

  @SubscribeMessage('make-answer')
  public makeAnswer(client: Socket, data: any): void {
    let { room_id } = data;
    client.to('room-call:' + room_id).emit('answer-made', {
      room_id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('make-offer')
  public makeOffer(client: Socket, data: any): void {
    let { room_id } = data;
    client.join('room-call:' + room_id);
    client.to('room-call:' + room_id).emit('call-made', {
      offer: data.offer,
      room_id,
    });
  }

  @SubscribeMessage('reject-call')
  @UseGuards(WsGuard)
  public rejectCall(client: Socket, data: any): void {
    const { room_id, user } = data;
    this.server.to('room-call:' + room_id).emit('reject-call', data);
  }

  @SubscribeMessage('resolve-call')
  public resolveCall(client: Socket, data: any): void {
    const { room_id } = data;
    client.join('room-call:' + room_id);
    client.to('room-call:' + room_id).emit('resolve-call', data);
  }
}
