import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameId } from './interfaces/game.interface';
import { Ball } from './interfaces/ball.interface';
import { GamesUtileService } from './gameUtiles.service';

@Injectable()
export class GamePortal {
  constructor(private gameUtile: GamesUtileService) {}
  detectPortalCollision(ballObj: Ball, game: GameId) {
    const portalLeft = game.portal.entryPosX - game.portal.width / 2;
    const portalRight = game.portal.entryPosX + game.portal.width / 2;
    const portalTop = game.portal.entryPosY - game.portal.height / 2;
    const portalBottom = game.portal.entryPosY + game.portal.height / 2;

    /*balle touche le portail*/
    if (
      ballObj.left < portalRight &&
      ballObj.right > portalLeft &&
      ballObj.top < portalBottom &&
      ballObj.bottom > portalTop
    ) {
      return 1;
    }
    return 0;
  }
  spawnPortals(server: Server, gameId: string, runningGames: Array<GameId>) {
    const loop = setInterval(() => {
      const index = this.gameUtile.getGameIndex(gameId, 'gameId', runningGames);
      const game = runningGames[index];
      if (game.portalOn === false) {
        const halfWidth = field.width / 2;
        const halfHeight = field.height / 2;
        game.portal.entryPosX = Math.floor(
          Math.random() * (halfWidth - 200 - (-halfWidth + 200) + 1) +
            (-halfWidth + 200),
        );
        game.portal.entryPosY = Math.floor(
          Math.random() * (halfHeight - 200 - (-halfHeight + 200) + 1) +
            (-halfHeight + 200),
        );
        game.portal.exitPosX = Math.floor(
          Math.random() * (halfHeight - 200 - (-halfHeight + 200) + 1) +
            (-halfHeight + 200),
        );
        game.portal.exitPosY = Math.floor(
          Math.random() * (halfHeight - 200 - (-halfHeight + 200) + 1) +
            (-halfHeight + 200),
        );
        game.portalOn = true;
        server.in(gameId).emit('recPortalInteraction', {
          portalObj: game.portal,
          state: 'on',
        });
      }
      if (game.gameStatus === 0) clearInterval(loop);
    }, 10000);
  }
}
let field: { width: number; height: number };

field = {
  width: 1200,
  height: 600,
};
