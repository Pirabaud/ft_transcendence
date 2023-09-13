import { Module } from '@nestjs/common';
import { FriendRequestController } from './friendRequest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { FriendRequestService } from './friend-request.service';
import { FriendRequest } from './friendRequest.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, User]), AuthModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, UserService],
})
export class FriendRequestModule {}
