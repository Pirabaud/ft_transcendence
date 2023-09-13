import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { leaderBoard } from './interface/leaderBoard.interface';

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

  async findMatchesid(id: number): Promise<string[]> {
    const User = await this.userRepository.findOneBy({ id });
    return User.matchHistory;
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

  async updateHistory(id: number, gameid: string) 
  {
    const user = await this.userRepository.findOneBy({ id });
    if (user.matchHistory == null)
    {
      user.matchHistory = [gameid];
    }
    user.matchHistory.push(gameid);
    await this.userRepository.save(user);
  }

  async updateElo(id: number, victory: boolean)
  {
      const user = await this.userRepository.findOneBy({ id })
      if (victory === true)
      {
          user.elo += 10;
          user.win++;
      }
      else 
      {
        if (user.elo !== 0)
            user.elo -= 10;
          user.lose++;
      }
      await this.userRepository.save(user);
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

  async getLeaderBoard(): Promise<leaderBoard[]>
  {
    let leaderBoard: leaderBoard[] = [];
    const allUser = await this.userRepository.createQueryBuilder("user").orderBy("user.elo", "DESC").getMany();
    if (allUser === null)
      return leaderBoard;
    for(let i = 0; i < allUser.length; i++)
    {
        leaderBoard[i] = {
          elo: allUser[i].elo,
          user: allUser[i].username
        }
    }
    return leaderBoard;
  }
}
