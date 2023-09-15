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

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async save(user: User) {
    try {
      await this.userRepository.save(user);
    }
    catch (error) {
      console.error('error for save' , error);
    }
  }

  async turnOnTfa(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      console.error('User with ID ${id} not found');
      return null;
    }
    
    await this.userRepository.delete(id);
    user.tfa = true;
    await this.userRepository.save(user);
    return true;
  }

  async turnOffTfa(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      console.error('User with ID ${id} not found');
      return null;
    }
    
    await this.userRepository.delete(id);
    user.tfa = false;
    await this.userRepository.save(user);
    return true;
  }

  async getTfaStatus(id: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      console.error('User with ID ${id} not found');
      return null;
    }

    return user.tfa;
  }
  
  async changeGoogle(id: number, secret: string, imageUrl: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      console.error('User with ID ${id} not found');
      return null;
    }

    await this.userRepository.delete(id);
    user.secret = secret;
    user.QRcode = imageUrl;
    await this.userRepository.save(user);
    return true;
  }

  async getQRcode(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      console.error('User with ID ${id} not found');
      return null;
    }

    return { QRcode: user.QRcode };
  }

  async getSecret(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      console.error('User with ID ${id} not found');
      return null;
    }

    return { Secret: user.secret };
  }

}
