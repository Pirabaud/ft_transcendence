import { Injectable } from '@nestjs/common';
import { GameId } from './interfaces/game.interface';

@Injectable()
export class GamesUtileService {
  constructor() {}

  countValues(gameId: string, knownClients: Map<any, any>): number {
    let count = 0;
    for (const iter of knownClients.values()) {
      if (iter.gameId === gameId) {
        count++;
      }
    }
    return count;
  }

  getGameIndex(
    data: string,
    dataType: string,
    runningGames: Array<GameId>,
  ): number {
    if (dataType === 'gameId') {
      for (let i = 0; runningGames[i]; ++i) {
        if (runningGames[i].multiGameId === data) return i;
      }
      return -1;
    } else {
      for (let i = 0; runningGames[i]; ++i) {
        if (
          runningGames[i].p1SocketId === data ||
          runningGames[i].p2SocketId === data
        )
          return i;
      }
      return -1;
    }
  }
}
