import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { GameService } from './game.service';
import { UserWaiting } from './interfaces/userWaiting.interface';
import { GamesUtileService } from './gameUtiles.service';
import { GamePortal } from './gamePortal.service';
import { GameCalculation } from './gameCalculation';
import { GameDatabase } from './gameDatabase.service';
import { MatchesService } from 'src/matches/matches.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200'] } })
export class GameGateway {
  @WebSocketServer()
  private server: Server;
  private readonly gameModule: GameService;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    gameUtile: GamesUtileService,
    gamePortal: GamePortal,
    gameCalculation: GameCalculation,
    gameDatabase: GameDatabase,
    matchesService: MatchesService,
  ) {
    this.gameModule = new GameService(
      gameUtile,
      gameCalculation,
      gamePortal,
      gameDatabase,
      matchesService,
    );
  }
  
  @SubscribeMessage('createGame')
  async handleCreateGame(socket: Socket, gameData: any) {
    const decodedToken = await this.authService.verifyJwt(
      socket.handshake.headers.authorization);
    const user = await this.userService.findById(decodedToken.sub);
    const userWaiting: UserWaiting = {
      socket: socket,
      gameId: gameData.gameId,
      user: user,
    };
    socket.emit(
      'recCreateGame',
      this.gameModule.checkGameAvailability(
        this.server,
        gameData.gameMode,
        userWaiting,
      ),
    );
  }

  @SubscribeMessage('startGame')
  handleStartGame(socket: Socket, gameId: string) {
    this.gameModule.startGame(this.server, socket, gameId);
  }
  @SubscribeMessage('cancelMatchmaking')
  handleCancelMatchmaking(socket: Socket, gameData: {gameId: string, gameMode: number}) {
    this.gameModule.cancelMatchmaking(socket, gameData);
  }
  @SubscribeMessage('cancelGame')
  handleCancelGame(socket: Socket, gameId: string) {
    this.gameModule.cancelGame(this.server, socket, gameId);
  }
  @SubscribeMessage('pauseGame')
  handlePauseGame(socket: Socket, gameId: string) {
    this.gameModule.pauseGame(this.server, gameId);
  }

  @SubscribeMessage('resumeGame')
  handleResumeGame(socket: Socket, gameId: string) {
    this.gameModule.resumeGame(this.server, socket, gameId);
  }

  @SubscribeMessage('updatePaddlePos')
  handlePaddlePosUpdate(socket: Socket, obj: any) {
    this.server
      .in(obj.gameId)
      .emit(
        'recPaddlePosUpdate',
        this.gameModule.updatePaddlePos(
          socket,
          obj.gameId,
          obj.data,
          obj.clientHeight,
        ),
      );
  }

  @SubscribeMessage('assignPaddle')
  handleAssignPaddle(socket: Socket, gameId: string) {
    this.server
      .in(gameId)
      .emit('recAssignPaddle', this.gameModule.assignPaddle(socket));
  }
}
