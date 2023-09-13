import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameHistory } from "src/game/game.entity";
import { GameId } from "src/game/interfaces/game.interface";
import { Match } from "src/game/interfaces/match.interface";
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

        if (await this.findMatch(game.multiGameId) != null)
            return;
        if (idWinner === 1)
        {
            match = {
            id: game.multiGameId,
            winner: game.user1.img,
            winnerScore: game.score.p1_score,
            loser: game.user2.img,
            loserScore: game.score.p2_score,
            }
        }
        else
        {
          match = {
            id: game.multiGameId,
            winner: game.user1.img,
            winnerScore: game.score.p1_score,
            loser: game.user2.img,
            loserScore: game.score.p2_score,
            }
        }
        await this.gameRepository.save(match);
    }
    
    async updateUserData(user1: User, user2: User, gameId: string, victory: number){

        // if (this.findMatch(gameId) !== null)
        //     return;

        if (victory === 1)
        {
            await this.userDatabase.updateElo(user1.id, true);
            await this.userDatabase.updateElo(user2.id, false);
        }
        else
        {
            await this.userDatabase.updateElo(user1.id, false);
            await this.userDatabase.updateElo(user2.id, true);
        }
        await this.userDatabase.updateHistory(user1.id, gameId);
        await this.userDatabase.updateHistory(user2.id, gameId);
    }

    async getMatch(idGame: string, idUser: number) : Promise<Match>
    {
        const user = await this.userDatabase.findById(idUser);
        const gameHistory = await this.findMatch(idGame);
        if (gameHistory === null)
            return;
        let match: Match

        if (user.img === gameHistory.winner)
        {
            match = {
            yourImg: user.img,
            oppImg: gameHistory.loser,
            yourScore: gameHistory.winnerScore,
            oppScore: gameHistory.loserScore,
            victory:  true,
            }
        }
        else
        {
            match = {
            yourImg: user.img,
            oppImg: gameHistory.winner,
            yourScore: gameHistory.loserScore,
            oppScore: gameHistory.winnerScore,
            victory:  false,
            }
       }
        return match
    }

    
    async getMatchesHistory(id: number) : Promise<Match[]>
    {
        let gameHistory: Match[] = [];
        const gameId: string[] = await this.userDatabase.findMatchesid(id);
        if (gameId == null)
            return gameHistory;
        for (var i = 0; i < gameId.length; i++)
        {
            gameHistory.push(await this.getMatch(gameId[i], id));
        }
        return gameHistory;
    }

}