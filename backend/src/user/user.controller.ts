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
  @Post('updateStatus')
  async updateUserStatus(@Body() statusObject: { status: string }, @Request() req) {
    await this.userService.updateUserStatus(req.user.sub, statusObject.status);
    return this.userService.updateUserStatus(req.user.sub, statusObject.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('updateStatus')
  getUserStatus(@Request() req) {
    return this.userService.getUserStatus(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post('doubleUsername')
  async checkDoubleUsername(@Body() usernameObject: any) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i) {
      if (users[i].username === usernameObject.username) return false;
    }
    return true;
  }
  @UseGuards(JwtAuthGuard)
  @Post('userExists')
  async checkUserExists(@Body() usernameObject: { username: string }) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i) {
      if (users[i].username === usernameObject.username) return true;
    }
    return false;
  }
  @UseGuards(JwtAuthGuard)
  @Post('idExists')
  async checkIdExists(@Body() idObject: { id: string }) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i) {
      if (users[i].id === parseInt(idObject.id)) return true;
    }
    return false;
  }

  @UseGuards(JwtAuthGuard)
  @Get('setTfaTrue')
  async TurnOnTfa(@Request() req) {
    return await this.userService.turnOnTfa(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('setTfaFalse')
  async TurnOffTfa(@Request() req) {
    return await this.userService.turnOffTfa(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getTfa')
  async GetTfaStatus(@Request() req) {
    return await this.userService.getTfaStatus(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('changeGoogle')
  async ChangeGoogle(
    @Request() req,
    @Body() google: { secret: string; imageUrl: string },
  ): Promise<any> {
    return await this.userService.changeGoogle(
      req.user.sub,
      google.secret,
      google.imageUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('getQRcode')
  async GetQRcode(@Request() req) {
    return await this.userService.getQRcode(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSecret')
  async GetSecret(@Request() req) {
    return await this.userService.getSecret(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('removeFriend')
  async removeFriend(@Body() idObject: any, @Request() req) {
    await this.userService.removeFriend(idObject.id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderBoard() {
    return await this.userService.getLeaderBoard();
  }
  @UseGuards(JwtAuthGuard)
  @Get('gameStatus')
  getGameStatus(@Request() req) {
    return this.userService.getGameStatus(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post('gameStatus')
  async setGameStatus(@Body() statusObj: { status: boolean }, @Request() req) {
    return await this.userService.setGameStatus(statusObj.status, req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('currentGameId')
  getCurrentGameId(@Request() req) {
    return this.userService.getCurrentGameId(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post('currentGameId')
  setCurrentGameId(@Body() gameIdObj: { gameId: string }, @Request() req) {
    return this.userService.setCurrentGameId(gameIdObj.gameId, req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('currentOpponentId')
  getCurrentOpponentId(@Request() req) {
    return this.userService.getCurrentOpponentId(req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Post('currentOpponentId')
  setCurrentOpponentId(@Body() gameIdObj: { gameId: string }, @Request() req) {
    return this.userService.setCurrentOpponentId(
      req.user.sub,
      gameIdObj.gameId,
    );
  }
}
