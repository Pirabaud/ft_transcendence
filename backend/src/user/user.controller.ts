import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('saveUsername')
  saveUsername(@Request() req, @Body() username: string) {
    return this.userService.updateUsername(req.user.sub, username);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.userService.findById(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post('profileById')
  async getProfileById(@Body() id) {
    return await this.userService.findById(id.id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('changePic')
  changePic(@Body() urlObject: any, @Request() req) {
    return this.userService.updateAvatar(req.user.sub, urlObject);
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
  @Post('removeFriend')
  async removeFriend(@Body() idObject: any, @Request() req) {
    await this.userService.removeFriend(idObject.id, req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('leaderBoard')
  async getLeaderBoard()
  {
    return await this.UserService.getLeaderBoard();
  }
}
