import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('database')
export class DatabaseController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Post('fileUpload')
  uploadSingle(@Body() fileNameObject: any, @Request() req) {
    return this.userService.updateAvatar(req.user.sub, fileNameObject);
  }

  @UseGuards(JwtAuthGuard)
  @Post('doubleUsername')
  async checkDoubleUsername(@Body() usernameObject: any) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i)
    {
      if (users[i].username === usernameObject.username)
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
