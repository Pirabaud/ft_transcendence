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

  async updateUsername(id: number, usernameObject: any) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.login = usernameObject.username;
    await this.userRepository.save(userToUpdate);
    return usernameObject;
  }

  async updateAvatar(id: number, imagePathObject: any) {
    const userToUpdate = await this.userRepository.findOneBy({ id });
    userToUpdate.img = imagePathObject.path;
    await this.userRepository.save(userToUpdate);
    return imagePathObject;
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
