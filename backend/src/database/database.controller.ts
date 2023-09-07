import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('database')
export class DatabaseController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Post('fileUpload')
  @UseInterceptors(
    FileInterceptor('files', { dest: '../frontend/src/assets/images' }),
  )
  uploadSingle(@UploadedFile() file: any, @Request() req) {
    const path = 'assets/images/' + file.filename;
    return this.userService.updateAvatar(req.user.sub, { path });
  }

  @UseGuards(JwtAuthGuard)
  @Post('doubleUsername')
  async checkDoubleUsername(@Body() usernameObject: any) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i)
    {
      if (users[i].login === usernameObject.username)
        return false;
    }
    return true;
  }
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers() {
    return await this.userService.findAll();
  }
}
