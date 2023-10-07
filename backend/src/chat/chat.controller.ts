import { Body, Controller, Post, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Participant } from './chat.dto';
import { ChatModule } from './chat.module';
import { RoomData } from './chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('getAllRoom')
  async getAllRoom() {
    return this.chatService.getAllRoom();
  }

  @Get('IsThereAPassword')
  async IsThereAPassword(@Body() id: { id: string }) {
    return this.chatService.IsThereAPassword(id.id);
  }

  @Post('verifyPassword')
  async verifyPassword(@Body() obj: { id: string, password: string }) {
    return this.chatService.verifyPassword(obj.id, obj.password);
  }

  @Post('getMessages')
  async getMessages(@Body() userId: { userId: string }) {
    return await this.chatService.getMessages(userId.userId);
  }

}