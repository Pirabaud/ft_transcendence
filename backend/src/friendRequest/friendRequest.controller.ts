import {Body, Controller, Post, UseGuards, Request, Get} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendRequestService } from './friend-request.service';

@Controller('friendRequest')
export class FriendRequestController {
  constructor(
    private userService: UserService,
    private friendRequestService: FriendRequestService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('createFR')
  createFriendRequest(@Body() usernameObject: any, @Request() req) {
    this.friendRequestService.createFriendRequest(req.user.sub, usernameObject.username);
    this.userService.updateFriendsRequestsNb(usernameObject.username, 'add');
  }
  @UseGuards(JwtAuthGuard)
  @Get('friendRequests')
  getFriendRequests(@Request() req) {
    return this.friendRequestService.findByReceiver(req.user.sub);
  }
  @Post('usernameWithId')
  getUsernameWithId(@Body() id: any) {
    return this.friendRequestService.getUsernameWithId(id.id);
  }
}
