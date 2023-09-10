import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameHistory } from "src/game/game.entity";
import { GameId } from "src/game/interfaces/game.interface";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(GameHistory)
        private gameRepository: Repository<GameHistory>,
        private userDatabase: UserService,
        ) {}

    findAll(): Promise<GameHistory[]> {
        return this.gameRepository.find();
    }

    async findMatch(id: string): Promise<GameHistory>{
        return await this.gameRepository.findOneBy({ id });
    }

    async saveGame(game: GameId, idWinner: number){
        let match: GameHistory;
        if (idWinner === 1)
        {
            match = {
            id: game.multiGameId,
            winner: game.user1.username,
            winnerScore: game.score.p1_score,
            loser: game.user2.username,
            loserScore: game.score.p2_score,
            }
        }
        else
        {
          match = {
            id: game.multiGameId,
            winner: game.user1.username,
            winnerScore: game.score.p1_score,
            loser: game.user2.username,
            loserScore: game.score.p2_score,
            }
        }
        await this.gameRepository.save(match);
        }
    
    async updateMatchHistory(user1: User, user2: User, gameId: string){
        await this.userDatabase.updateHistory(user1.id, gameId);
        await this.userDatabase.updateHistory(user2.id, gameId); 
    }

    async getMatchesHistory(id: number) : Promise<GameHistory[]>
    {
        let gameHistory: GameHistory[] = [];
        const gameId: string[] = await this.userDatabase.findMatchesid(id);
        if (gameId == null)
            return gameHistory;
        for (var i = 0; i < gameId.length; i++)
        {
            gameHistory.push(await this.findMatch(gameId[i]))
        }
        return gameHistory;
    }

}