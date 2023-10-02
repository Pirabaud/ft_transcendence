import { Module } from '@nestjs/common';
import {RoomsController} from "./rooms.controller";
import {ChatWebsocketGateway} from "./chat.websocket.gateway";

@Module({
    imports: [ChatModule],
    controllers: [RoomsController],
    providers: [ChatWebsocketGateway],
  })
export class ChatModule {}
