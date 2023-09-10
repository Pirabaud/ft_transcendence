import { SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayDisconnect, OnGatewayConnection} from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { GameModule } from "./game.module";
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { GameService } from './game.service';
import { UserWaiting } from './interfaces/userWaiting.interface';
import { GamesUtileService } from './gameUtiles.service';
import { GamePortal } from './gamePortal.service';
import { GameCalculation } from './gameCalculation';

@WebSocketGateway({ cors: { origin: ["http://localhost:4200"] } })
export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()
  private server: Server;
  private readonly gameModule: GameService;
  constructor(private userService: UserService, 
    private authService: AuthService, 
    private gameUtile: GamesUtileService,
    private gamePortal: GamePortal,
    private gameCalculation: GameCalculation) {
    this.gameModule = new GameService(gameUtile, gameCalculation, gamePortal);
  }
  async handleConnection(socket: Socket) {
    //console.log("handleConnection jwt: ", socket.handshake.headers.authorization);
  }
  handleDisconnect(client: any): any {
    console.log(client.id + " disconnected");
  }
  @SubscribeMessage("accessGame")
  handleAccessGame(socket: Socket)
  {
    // socket.emit("recAccessGame", this.gameModule.accessGame());
  }
  @SubscribeMessage("createGame")
  async handleCreateGame(socket: Socket, gameData: any)
  {
    
    const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
    const user = await this.userService.findById(decodedToken.sub);
    const userWaiting: UserWaiting = {
      socket: socket,
      gameId: gameData.gameId,
      user: user,
    } 
    socket.emit("recCreateGame", this.gameModule.checkGameAvailability(this.server, gameData.gameMode, userWaiting));
  }

  @SubscribeMessage("startGame")
  handleStartGame(socket: Socket, gameId: string)
  {
    this.gameModule.startGame(this.server, socket, gameId);
  }

  @SubscribeMessage("updatePaddlePos")
  handlePaddlePosUpdate(socket: Socket, obj: any)
  {
    this.server.in(obj.gameId).emit("recPaddlePosUpdate", this.gameModule.updatePaddlePos(socket, obj.gameId, obj.data, obj.clientHeight));
  }

  @SubscribeMessage("assignPaddle")
  handleAssignPaddle(socket: Socket, gameId: string)
  {
    this.server.in(gameId).emit("recAssignPaddle", this.gameModule.assignPaddle(socket));
  }
}
