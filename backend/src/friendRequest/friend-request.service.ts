import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './friendRequest.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private userService: UserService,
  ) {}

  async createFriendRequest(sender: number, receiver: string) {
    const receiverId = await this.getIdWithUsername(receiver);

    const friendRequestExists = await this.checkFRAlreadyExists(sender, receiverId);
    if (friendRequestExists !== null) {
      return null;
    }

    await this.userService.updateFriendsRequestsNb(receiverId, 'add');

    const newFriendRequest: FriendRequest = new FriendRequest();
    newFriendRequest.sender = sender;
    newFriendRequest.receiver = receiverId;
    newFriendRequest.status = 'pending';
    return await this.saveFriendRequest(newFriendRequest);
  }
  async removeFriendRequest(id: number): Promise<void> {
    await this.friendRequestRepository.delete(id);
  }

  findAll(): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find();
  }

  async findBySender(sender: number): Promise<FriendRequest[] | null> {
    const FRList = await this.findAll();
    const res: FriendRequest[] = [];
    for (let i = 0; i < FRList.length; ++i) {
      if (sender === FRList[i].sender)
        res.push(FRList[i]);
    }
    if (res.length !== 0)
      return res;
    else
      return null;
  }
  async findByReceiver(receiver: number): Promise<FriendRequest[] | null> {
    const FRList = await this.findAll();
    const res: FriendRequest[] = [];
    for (let i = 0; i < FRList.length; ++i) {
      if (receiver === FRList[i].receiver)
        res.push(FRList[i]);
    }
    if (res.length !== 0)
      return res;
    else
      return null;
  }
  async findBySenderAndReceiver(sender: number, receiver: number): Promise<FriendRequest | null> {
    const FRList = await this.findAll();
    for (let i = 0; i < FRList.length; ++i) {
      if (receiver === FRList[i].receiver && sender === FRList[i].sender)
        return FRList[i];
    }
    return null;
  }
  async checkFRAlreadyExists(sender: number, receiver: number)
  {
    const friendRequests = await this.findAll();
    if (friendRequests) {
      for (let i = 0; i < friendRequests.length; ++i) {
        if (
          friendRequests[i].sender === sender &&
          friendRequests[i].receiver === receiver
        )
          return friendRequests[i];
      }
    }
    return null;
  }
  async saveFriendRequest(friendRequest: FriendRequest) {
    try {
      return await this.friendRequestRepository.save(friendRequest);
    } catch (error) {
      console.error('error for save', error);
    }
  }
  async getUsernameWithId(id: number) {
    const profile = await this.userService.findById(id);
    return { username: profile.username };
  }
  async getIdWithUsername(username: string) {
    const profile = await this.userService.findOneByUsername(username);
    return profile.id;
  }
  async acceptFriendRequest(senderId: number, receiverId: number)
  {
    const friendRequest = await this.findBySenderAndReceiver(senderId, receiverId)
    await this.userService.addFriend(senderId, receiverId);
    await this.userService.updateFriendsRequestsNb(receiverId, 'removeOne')
    await this.removeFriendRequest(friendRequest.id);
  }
  async refuseFriendRequest(senderId: number, receiverId: number)
  {
    const friendRequest = await this.findBySenderAndReceiver(senderId, receiverId)
    await this.userService.updateFriendsRequestsNb(receiverId, 'removeOne')
    await this.removeFriendRequest(friendRequest.id);
  }
}
