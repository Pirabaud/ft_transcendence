import { Body, Controller, Post, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageEventDto, Participant } from './chat.dto';
import { ChatModule } from './chat.module';
import { RoomData } from './chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('findAllRoom')
  async findAllRoom() {
    return this.chatService.findAllRoom();
  }

  @Get('getAllRoom')
  async getAllRoom() {
    return this.chatService.getAllRoom();
  }

  // @Get('getUsers')
  // async getUsers(@Body() id: { id: string }) {
  //   return this.chatService.getUsers(id.id);
  // }

  // @Get('getAdmins')
  // async getAdmins(@Body() id: { id: string }) {
  //   return this.chatService.getAdmins(id.id);
  // }

  @Get('IsThereAPassword')
  async IsThereAPassword(@Body() id: { id: string }) {
    return this.chatService.IsThereAPassword(id.id);
  }

  // @Post('savePassword')
  // async savePassword(@Body() obj: { password: string }) {
  //   return this.chatService.savePassword(obj.password);
  // }

  @Post('verifyPassword')
  async verifyPassword(@Body() obj: { id: string, password: string }) {
    return this.chatService.verifyPassword(obj.id, obj.password);
  }

  // @Post('saveMessage')
  // async saveMessage(@Body() obj: { id: string, message: MessageEventDto}) {
  //   return this.chatService.saveMessage(obj.id, obj.message);
  // }

  // @Post('kick')
  // async kick(@Body() obj: { id: string, user: Participant }) {
  //   return this.chatService.kick(obj.id, obj.user);
  // }

  // @Post('ban')
  // async ban(@Body() obj: { id: string, userId: number }) {
  //   return this.chatService.ban(obj.id, obj.userId);
  // }

  // @Post('unban')
  // async unban(@Body() obj: { id: string, userId: number }) {
  //   return this.chatService.unban(obj.id, obj.userId);
  // }

}