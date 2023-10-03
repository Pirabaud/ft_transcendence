import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { RoomData } from './chat.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatWebsocketGateway } from "./chat.websocket.gateway";

@Module({
  controllers: [ChatController],
    imports: [TypeOrmModule.forFeature([RoomData]), TypeOrmModule.forFeature([User]), ChatModule],
    providers: [ChatWebsocketGateway, ChatService, UserService],
  })
export class ChatModule {}
