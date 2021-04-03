import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { SignalingService } from './signaling.service';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Socket } from 'socket.io';
import { Server } from 'ws';

@WebSocketGateway({namespace: "/signaling"})
export class SignalingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  constructor(private readonly signalingService: SignalingService,
              @Inject(CACHE_MANAGER) private cacheModule: Cache) {
  }

  @SubscribeMessage("signal")
  public sendOffer(client:Socket, payload){
    const { message } = payload;
    console.log(message);
    switch (message.type) {
      case "offer":{

      }
      default: {

      }
    }
  }

  afterInit(server: any): any {
    console.log("init")
  }

  handleConnection(client: any, ...args: any[]): any {
  }

  handleDisconnect(client: any): any {

  }

}
