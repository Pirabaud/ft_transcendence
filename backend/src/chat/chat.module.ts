import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomData } from './chat.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatWebsocketGateway } from "./chat.websocket.gateway";

@Module({
  controllers: [ChatController],
    imports: [TypeOrmModule.forFeature([RoomData]), ChatModule],
    providers: [ChatWebsocketGateway, ChatService],
  })
export class ChatModule {}
