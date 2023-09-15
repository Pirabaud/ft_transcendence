import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistory } from './game.entity';

@Injectable()
export class GameDatabase {
  constructor(
    @InjectRepository(GameHistory)
    private gameRepository: Repository<GameHistory>,
  ) {}

  findAll(): Promise<GameHistory[]> {
    return this.gameRepository.find();
  }

  async saveGame(Game: GameHistory) {
    await this.gameRepository.save(Game);
  }
}
