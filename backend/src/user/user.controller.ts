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
  constructor(private UserService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('saveUsername')
  saveUsername(@Request() req, @Body() username: string) {
    return this.UserService.updateUsername(req.user.sub, username);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.UserService.findOne(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('leaderBoard')
  async getLeaderBoard()
  {
    return await this.UserService.getLeaderBoard();
  }
}
