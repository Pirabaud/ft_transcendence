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
  updateUserStatus(@Body() statusObject: { status: string}, @Request() req) {
    return this.userService.updateUserStatus(req.user.sub, statusObject.status);
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
  async checkUserExists(@Body() usernameObject: any) {
    const users = await this.userService.findAll();
    for (let i = 0; i < users.length; ++i) {
      if (users[i].username === usernameObject.username) return true;
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
    async ChangeGoogle(@Request() req, @Body() google: { secret: string, imageUrl: string }): Promise<any> {
        return await this.userService.changeGoogle(req.user.sub, google.secret, google.imageUrl);
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
  @Get('leaderBoard')
  async getLeaderBoard() {
    return await this.userService.getLeaderBoard();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUsername')
  async getUsername(@Request() req) {
    return await this.userService.getUsername(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getPic')
  async getPic(@Request() req) {
    return await this.userService.getPic(req.user.sub);
  }

}