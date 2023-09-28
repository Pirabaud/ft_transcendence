import { Server } from 'socket.io';
import { GamePortal } from './gamePortal.service';
import { GamesUtileService } from './gameUtiles.service';
import { GameId } from './interfaces/game.interface';
import { Ball } from './interfaces/ball.interface';
import { GameDatabase } from './gameDatabase.service';
import { MatchesService } from 'src/matches/matches.service';

export class GameCalculation {
  constructor(
    private gameUtileService: GamesUtileService,
    private gamePortal: GamePortal,
    private gameDatabase: GameDatabase,
    private matchesService: MatchesService,
  ) {}

  ballMovement(server: Server, gameId: string, runningGames: Array<GameId>) {
    const index = this.gameUtileService.getGameIndex(
      gameId,
      'gameId',
      runningGames,
    );
    const game = runningGames[index];
    const halfWidth = field.width / 2 - game.ball.width / 2;
    const halfHeight = field.height / 2 - game.ball.height / 2;

    game.ball.posX += game.ball.speed * game.ball.directionX;
    game.ball.posY += game.ball.speed * game.ball.directionY;

    if (game.ball.posX >= halfWidth && game.goalIsProcessed) {
      ++game.score.p1_score;
      server.in(gameId).emit('recGoalScored', game.score);
      if (game.score.p1_score === 1) {
        this.matchesService.saveGame(game, 1);
        this.matchesService.updateUserData(
          game.user1,
          game.user2,
          game.multiGameId,
          1,
        );
        server.in(gameId).emit('recStopGame', game.user1.username);
        return 0;
      }
      this.resetBall('right', server, gameId, runningGames);
    } else if (game.ball.posX < -halfWidth && game.goalIsProcessed) {
      ++game.score.p2_score;
      server.in(gameId).emit('recGoalScored', game.score);
      if (game.score.p2_score === 1) {
        this.matchesService.saveGame(game, 2);
        this.matchesService.updateUserData(
          game.user1,
          game.user2,
          game.multiGameId,
          2,
        );
        game.gameStatus = 0;
        server.in(gameId).emit('recStopGame', game.user2.username);
        return 0;
      }
      this.resetBall('left', server, gameId, runningGames);
    }
    if (game.ball.posY > halfHeight + game.ball.height / 5) {
      game.ball.posY = halfHeight;
      game.ball.directionY *= -1;
    } else if (game.ball.posY < -halfHeight - game.ball.height / 5) {
      game.ball.posY = -halfHeight;
      game.ball.directionY *= -1;
    }
    this.checkAllCollisionTypes(game, server, gameId);
    return 1;
  }

  checkAllCollisionTypes(game: GameId, server: Server, gameId: string) {
    const ball: Ball = {
      left: game.ball.posX - game.ball.width / 2,
      right: game.ball.posX + game.ball.width / 2,
      top: game.ball.posY - game.ball.height / 2,
      bottom: game.ball.posY + game.ball.height / 2,
    };

    let checkCollision = this.detectPaddleCollision(ball, game);
    if (checkCollision === 1 || checkCollision === 2) {
      if (checkCollision === 1) game.ball.posX += 10;
      else game.ball.posX -= 10;
    }
    if (game.gameMode === 1 && game.portalOn == true) {
      checkCollision = this.gamePortal.detectPortalCollision(ball, game);
      if (checkCollision === 1) {
        const ballSpeed = Math.sqrt(
          game.ball.directionX * game.ball.directionX +
            game.ball.directionY * game.ball.directionY,
        );
        const randomAngle = Math.random() * Math.PI - Math.PI / 2;

        /*sends data about the portal and teleport the ball to the previously calulated exit of the portal*/
        game.ball.posX = game.portal.exitPosX;
        game.ball.posY = game.portal.exitPosY;
        game.ball.directionX = Math.cos(randomAngle);
        game.ball.directionY = Math.sin(randomAngle);
        game.ball.directionX *= ballSpeed;
        game.ball.directionY *= ballSpeed;
        game.portalOn = false;
        server.in(gameId).emit('recPortalInteraction', {
          portalObj: game.portal,
          state: 'off',
        });
      }
    }
  }
  detectPaddleCollision(ballObj: Ball, game: GameId): number {
    if (game.ball.posX < 0) {
      const paddleLeft = -field.width / 2;
      const paddleRight = -field.width / 2 + game.paddle1.width;
      const paddleTop = game.paddle1.posY - game.paddle1.height / 2;
      const paddleBottom = game.paddle1.posY + game.paddle1.height / 2;
      if (
        ballObj.left < paddleRight &&
        ballObj.right > paddleLeft &&
        ballObj.top < paddleBottom &&
        ballObj.bottom > paddleTop
      ) {
        const paddleOffset =
          (game.ball.posY - game.paddle1.posY) / (game.paddle1.height / 2);
        const maxBounceAngle = Math.PI / 4;
        const bounceAngle = paddleOffset * maxBounceAngle;
        let ballSpeed = Math.sqrt(
          game.ball.directionX * game.ball.directionX +
            game.ball.directionY * game.ball.directionY,
        ); // Calculate current speed

        /*Speed cap*/
        if (ballSpeed < 2.7) ballSpeed += 0.1;
        game.ball.directionX = Math.cos(bounceAngle);
        game.ball.directionY = Math.sin(bounceAngle);
        game.ball.directionX *= ballSpeed;
        game.ball.directionY *= ballSpeed;

        return 1;
      }
    } else if (game.ball.posX > 0) {
      const paddleLeft = field.width / 2 - game.paddle2.width;
      const paddleRight = field.width / 2;
      const paddleTop = game.paddle2.posY - game.paddle2.height / 2;
      const paddleBottom = game.paddle2.posY + game.paddle2.height / 2;
      if (
        ballObj.left < paddleRight &&
        ballObj.right > paddleLeft &&
        ballObj.top < paddleBottom &&
        ballObj.bottom > paddleTop
      ) {
        const paddleOffset =
          (game.ball.posY - game.paddle2.posY) / (game.paddle2.height / 2);
        const maxBounceAngle = Math.PI / 4;
        const bounceAngle = paddleOffset * maxBounceAngle;
        let ballSpeed = Math.sqrt(
          game.ball.directionX * game.ball.directionX +
            game.ball.directionY * game.ball.directionY,
        ); // Calculate current speed

        /*Speed cap*/
        if (ballSpeed < 2.7) ballSpeed += 0.1;
        game.ball.directionX = Math.cos(bounceAngle) * -1;
        game.ball.directionY = Math.sin(bounceAngle);
        game.ball.directionX *= ballSpeed;
        game.ball.directionY *= ballSpeed;

        return 2;
      }
      return 0;
    }
  }

  resetBall(
    side: string,
    server: Server,
    gameId: string,
    runningGames: Array<GameId>,
  ) {
    const index = this.gameUtileService.getGameIndex(
      gameId,
      'gameId',
      runningGames,
    );
    const game = runningGames[index];
    const saveSpeed = game.ball.speed;

    game.ball.posY = 0;
    game.ball.posX = 0;
    game.goalIsProcessed = false;
    setTimeout(() => {
      game.ball.posX = 0;
      game.ball.posY = 0;
      if (side === 'left') {
        game.ball.directionX = -1;
        game.ball.directionY = Math.random() < 0.5 ? -1 : 1;
      }
      if (side === 'right') {
        game.ball.directionX = 1;
        game.ball.directionY = Math.random() < 0.5 ? -1 : 1;
      }
      game.goalIsProcessed = true;
      game.ball.speed = saveSpeed;
      server.in(gameId).emit('recResumeGame');
    }, 800);
  }
}

/*The backend board template used to make all the calculations*/

const field = {
  width: 1200,
  height: 600,
};
