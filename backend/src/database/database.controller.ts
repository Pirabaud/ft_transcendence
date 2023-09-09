import { Body, Request, Controller, Post, UseGuards } from '@nestjs/common';
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
  @Post('userExists')
  async checkUserExists(@Body() usernameObject: any) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i)
    {
      if (users[i].username === usernameObject.username)
        return true;
    }
    return false;
  }
  @UseGuards(JwtAuthGuard)
  @Post('createFR')
  createFriendRequest(@Body() usernameObject: any) {
    this.userService.updateFriendRequests(usernameObject, 'add');
  }
}
