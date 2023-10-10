import { Injectable } from '@nestjs/common';
import { GameId } from './interfaces/game.interface';
import {UserWaiting} from "./interfaces/userWaiting.interface";

@Injectable()
export class GamesUtileService {
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
  findUserByHostname(waitRoom: Array<UserWaiting>, hostname: number)
  {
    for (let i = 0; i < waitRoom.length; ++i)
    {
      if (waitRoom[i].hostname === hostname)
        return waitRoom[i];
    }
    return null;
  }
  calculateRoomLengthWithoutPrivates(waitRoom: Array<UserWaiting>)
  {
    let len: number = 0;
    for (let i = 0; i < waitRoom.length; ++i)
    {
      if (waitRoom[i].hostname === -1)
        ++len;
    }
    return len;
  }
}
