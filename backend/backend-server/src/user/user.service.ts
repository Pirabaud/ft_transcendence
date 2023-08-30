
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Match } from 'src/game/interfaces/match.interface';

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
    console.log(id);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async save(user: User) {
    try {
      await this.userRepository.save(user);
      console.log('save to database:', user)
    }
    catch (error) {
      console.error('error for save' , error);
    }
  }

  // async newMatch(match: Match) {
  //     const user = await this.findOne(match.yourId);
  //     if (user)
  //     {
  //       user.match.push(match);
  //       this.save(user);
  //     }
  // }
}
