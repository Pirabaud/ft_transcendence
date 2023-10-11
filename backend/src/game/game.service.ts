import { Injectable } from '@nestjs/common';
import { GameId } from './interfaces/game.interface';
import { Server } from 'socket.io';
import { GamesUtileService } from './gameUtiles.service';
import { UserWaiting } from './interfaces/userWaiting.interface';
import { Socket } from 'socket.io';
import { GamePortal } from './gamePortal.service';
import { GameCalculation } from './gameCalculation';
import { GameDatabase } from './gameDatabase.service';
import { MatchesService } from 'src/matches/matches.service';

@Injectable()
export class GameService {
  constructor(
    private gameUtile: GamesUtileService,
    private gameCalculation: GameCalculation,
    private gamePortal: GamePortal,
    gameDatabase: GameDatabase,
    MatchesService: MatchesService,
  ) {
    this.gameCalculation = new GameCalculation(
      gameUtile,
      gamePortal,
      gameDatabase,
      MatchesService,
    );
  }
  /*Where all the data about players waiting and ingame is stored*/
  waitRoomNormal: Array<UserWaiting> = [];
  waitRoomPortal: Array<UserWaiting> = [];
  runningGames: Array<GameId> = [];
  knownClients: Map<any, any> = new Map();

  /*Adds a client to the list of known clients*/
  addNewClient(socket: Socket, gameId: string) {
    const count = this.gameUtile.countValues(gameId, this.knownClients);
    socket.join(gameId);
    if (count === 0)
      this.knownClients.set(socket.id, { gameId: gameId, clientId: '0' });
    else {
      this.knownClients.set(socket.id, { gameId: gameId, clientId: '1' });
    }
  }

  /*-------------------------------------------------GAME CALCULATION--------------------------------------------------*/

  /*Game over*/
  stopGame(server: Server, gameId: string) {
    const index = this.gameUtile.getGameIndex(
      gameId,
      'gameId',
      this.runningGames,
    );
    setTimeout(() => {
      this.runningGames.splice(index, 1);
    }, 2500);
  }

  createGame(
    multiGameId: string,
    gameMode: number,
    firstPlayer: UserWaiting,
    secondPlayer: UserWaiting,
  ): GameId {
    const game: GameId = {
      user1: firstPlayer.user,
      user2: secondPlayer.user,
      gameMode: gameMode,
      multiGameId: multiGameId,
      gameStatus: 0,
      once: 0,
      p1SocketId: firstPlayer.socket.id,
      p2SocketId: secondPlayer.socket.id,
      portalOn: false,
      count: 3,
      goalIsProcessed: true,
      countdownDone: false,
      ball: {
        posX: 0,
        posY: 0,
        directionX: Math.random() < 0.5 ? -1 : 1,
        directionY: Math.random() < 0.5 ? -1 : 1,
        height: 60,
        width: 30,
        speed: (field.width - field.height) / 120,
      },

      paddle1: {
        posX: -field.width / 2,
        posY: 0,
        width: 14,
        height: 120,
      },

      paddle2: {
        posX: field.width / 2,
        posY: 0,
        width: 14,
        height: 120,
      },

      /*envoyer event toutes les 5 secondes pour faire spawn un portail*/
      portal: {
        entryPosX: 0,
        entryPosY: 0,
        exitPosX: 0,
        exitPosY: 0,
        width: 120,
        height: 120,
      },

      score: {
        p1_score: 0,
        p2_score: 0,
      },

      height: {
        client1Height: 0,
        client2Height: 0,
      },

      field: {
        width: 1200,
        height: 600,
      },
    };
    return game;
  }

  /*Places a player in the waiting room if it is the first one for this mode, otherwise, creates a game with the player waiting and the one who just joined*/
  checkGameAvailability(server: Server, gameMode: number, userWaiting: UserWaiting) {

    const waitRoomLength: number =
      gameMode === 0 ? this.gameUtile.calculateRoomLengthWithoutPrivates(this.waitRoomNormal) : this.gameUtile.calculateRoomLengthWithoutPrivates(this.waitRoomPortal);
    if ((waitRoomLength === 0 && userWaiting.position === 0) || userWaiting.position === 1) {
      this.addNewClient(userWaiting.socket, userWaiting.gameId);
      if (gameMode === 0)
        this.waitRoomNormal.push(userWaiting);
      else
        this.waitRoomPortal.push(userWaiting);
      /*loops every 2 seconds to check if another player joined*/
      const gameReadyCheck = setInterval(() => {
        const i: number = this.gameUtile.getGameIndex(
          userWaiting.gameId,
          'gameId',
          this.runningGames,
        );
        if (i !== -1) {
          server.in(userWaiting.gameId).emit('recJoinGame');
          clearInterval(gameReadyCheck);
        }
      }, 1);
      return '0';
    }
    else {
      /*if the player joining is the second one, the waitRoom is emptied and a Game is created with this client
     and the one waiting in the waiting room, the gameId of the first player is then emitted to make it the same for both clients*/
      let res: UserWaiting;
      if (gameMode === 0)
      {
        if (userWaiting.hostname === -1)
          res = this.waitRoomNormal[0];
        else
          res = this.gameUtile.findUserByHostname(this.waitRoomNormal, userWaiting.hostname);
      }
      else
      {
        if (userWaiting.hostname === -1)
          res = this.waitRoomPortal[0];
        else
          res = this.gameUtile.findUserByHostname(this.waitRoomPortal, userWaiting.hostname);
      }
      if (!res)
        return ("");
      this.addNewClient(userWaiting.socket, res.gameId);
      if (gameMode === 0) {
        this.runningGames.push(
          this.createGame(res.gameId, gameMode, res, userWaiting),
        );
        this.waitRoomNormal = this.gameUtile.removeUserFromWaitRoom(this.waitRoomNormal, res);
      } else {
        this.runningGames.push(
          this.createGame(res.gameId, gameMode, res, userWaiting),
        );
        this.waitRoomPortal = this.gameUtile.removeUserFromWaitRoom(this.waitRoomPortal, res);
      }
      return res.gameId;
    }
  }

  /*sends all the init events (initId, countdown, initBallDir) and then starts the game loop*/
  startGame(server: Server, socket: any, gameId: string) {
    const obj: any = this.knownClients.get(socket.id);
    const index: number = this.gameUtile.getGameIndex(
      gameId,
      'gameId',
      this.runningGames,
    );
    const game = this.runningGames[index];

    socket.emit('recInitId', obj.clientId.toString());

    if (game.once === 0) {
      ++game.once;
      /*send events for the countdown every 0.7 seconds*/
      const countdown = setInterval(() => {
        if (game.count > 0) {
          server.in(gameId).emit('recStartCountdown', game.count.toString());
          game.count--;
        } else {
          clearInterval(countdown);
          server.in(gameId).emit('recStartCountdown', 'GO');
          setTimeout(() => {
            server.in(gameId).emit('recStartCountdown', '');
            game.countdownDone = true;
          }, 700);
        }
      }, 700);
      /*game started*/
      game.gameStatus = 1;
      /*send the first ball direction randomly calculated to the clients*/
      socket.to(gameId).emit('recInitBallDir', game.ball);
      /*while the game is in progress, the backend will send the ball position 60 times per second*/
      if (game.gameMode === 1)
        this.gamePortal.spawnPortals(server, gameId, this.runningGames);
      const ballLoop = setInterval(() => {
        if (game.gameStatus === 1 && game.countdownDone) {
          game.gameStatus = this.gameCalculation.ballMovement(
            server,
            gameId,
            this.runningGames,
          );
          server
            .in(gameId)
            .emit('recBallPos', { ball: game.ball, portal: game.portal });
        } else if (game.gameStatus === 0) {
          this.stopGame(server, gameId);
          clearInterval(ballLoop);
        }
      }, 1000 / 60);
    }
  }
  cancelGame(server: Server, socket: Socket, gameId: string) {
    const index: number = this.gameUtile.getGameIndex(
      gameId,
      'gameId',
      this.runningGames,
    );
    if (index === -1) return;
    const game = this.runningGames[index];

    game.gameStatus = 0;
    server.in(gameId).emit('recCancelGame');
  }

  cancelMatchmaking(
    socket: Socket,
    gameData: { gameId: string; gameMode: number },
  ) {
    socket.leave(gameData.gameId);
    if (gameData.gameMode === 0)
      this.waitRoomNormal = [];
    else
      this.waitRoomPortal = [];
  }

  /*Extract data from the client and convert it to the backend template game to make all the calculations, once it is done,
   * the data is sent back to the clients*/
  updatePaddlePos(
    socket: Socket,
    gameId: string,
    data: any,
    clientHeight: number,
  ) {
    const index = this.gameUtile.getGameIndex(
      gameId,
      'gameId',
      this.runningGames,
    );
    if (index === -1) return;
    const clientId = this.knownClients.get(socket.id);
    if (clientId.clientId === '0') {
      this.runningGames[index].paddle1.posY = data.data.posY - clientHeight / 2;
      this.runningGames[index].paddle1.posY =
        this.runningGames[index].paddle1.posY * (600 / clientHeight);
      this.runningGames[index].paddle1.posY += 600 / 2;
      this.runningGames[index].height.client1Height = clientHeight;
    } else {
      this.runningGames[index].paddle2.posY = data.data.posY - clientHeight / 2;
      this.runningGames[index].paddle2.posY =
        this.runningGames[index].paddle2.posY * (600 / clientHeight);
      this.runningGames[index].paddle2.posY += 600 / 2;
      this.runningGames[index].height.client2Height = clientHeight;
    }
    return { data: data, height: clientHeight };
  }

  /*assigns an id (0, 1) to a client to know which player is left paddle and which is right*/
  assignPaddle(socket: Socket) {
    const obj = this.knownClients.get(socket.id);
    return obj.clientId.toString();
  }
}

/*The backend board template used to make all the calculations*/
let field: { width: number; height: number };

field = {
  width: 1200,
  height: 600,
};
