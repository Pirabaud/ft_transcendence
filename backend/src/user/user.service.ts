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

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: any): Promise<User | null> {
    const usersList = await this.findAll();
    for (let i = 0; i < usersList.length; ++i) {
      if (username.username === usersList[i].username)
        return usersList[i];
    }
    return null;
  }

  async updateUsername(id: number, usernameObject: any) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.username = usernameObject.username;
    await this.userRepository.save(userToUpdate);
    return usernameObject;
  }

  async updateAvatar(id: number, imagePathObject: any) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.img = imagePathObject.fileName;
    await this.userRepository.save(userToUpdate);
    return imagePathObject;
  }
  async updateFriendRequests(username: string, action: string) {
    const userToUpdate = await this.findOneByUsername(username);
    console.log(userToUpdate)
    if (userToUpdate === null)
      return ;
    if (action === 'add')
      userToUpdate.friendRequests++;
    else
      userToUpdate.friendRequests--;
    await this.userRepository.save(userToUpdate);
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
