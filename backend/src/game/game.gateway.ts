import { SubscribeMessage, WebSocketGateway,WebSocketServer, OnGatewayDisconnect, OnGatewayConnection} from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { GameModule } from "./game.module";
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: { origin: ["http://localhost:4200"] } })
export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection{
  @WebSocketServer()
  private server: Server;
  private readonly gameModule: GameModule;
  constructor(private userService: UserService, private authService: AuthService) {
    this.gameModule = new GameModule();
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
    const user = await this.userService.findOne(decodedToken.sub);
    console.log("user :", user);
    socket.emit("recCreateGame", this.gameModule.checkGameAvailability(this.server, socket, gameData.gameId, gameData.gameMode, user));
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
