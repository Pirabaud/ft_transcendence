import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const usersList = await this.findAll();
    for (let i = 0; i < usersList.length; ++i) {
      if (username === usersList[i].username)
        return usersList[i];
    }
    return null;
  }

  async updateUsername(id: number, usernameObject: any) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.username = usernameObject.username;
    await this.saveUser(userToUpdate);
    return usernameObject;
  }

  async updateAvatar(id: number, imagePathObject: any) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.img = imagePathObject.url;
    await this.saveUser(userToUpdate);
    return imagePathObject;
  }
  async updateFriendsRequestsNb(id: number, action: string) {
    const userToUpdate = await this.findById(id);
    if (userToUpdate !== null) {
      if (action === 'add')
        userToUpdate.friendRequestsNb++;
      else
        userToUpdate.friendRequestsNb--;
      await this.saveUser(userToUpdate);
    }
  }
  async removeFriend(friendId: number, userId: number)
  {
    let userToUpdate= await this.findById(userId);
    let friendListArray = userToUpdate.friendList;
    let index = friendListArray.indexOf(friendId);
    friendListArray.splice(index, 1);
    userToUpdate.friendList = friendListArray;
    await this.saveUser(userToUpdate);
    userToUpdate = await this.findById(friendId);
    friendListArray = userToUpdate.friendList;
    index = friendListArray.indexOf(userId);
    friendListArray.splice(index, 1);
    userToUpdate.friendList = friendListArray;
    await this.saveUser(userToUpdate);
  }
  async addFriend(friendId: number, userId: number)
  {
    let userToUpdate= await this.findById(userId);
    let friendListArray = userToUpdate.friendList;
    if (friendListArray)
      friendListArray.push(friendId);
    else
      friendListArray = [friendId];
    userToUpdate.friendList = friendListArray;
    await this.saveUser(userToUpdate);
    userToUpdate = await this.findById(friendId);
    friendListArray = userToUpdate.friendList;
    if (friendListArray)
      friendListArray.push(userId);
    else
      friendListArray = [userId];
    userToUpdate.friendList = friendListArray;
    await this.saveUser(userToUpdate);
  }
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async saveUser(user: User) {
    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.error('error for save', error);
    }
  }
}
