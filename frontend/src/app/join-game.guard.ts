// import { CanActivateFn } from '@angular/router';
// import { GameService } from "./services/game.service";
// import { GameSocketService } from "./services/game-socket.service";
// import {Observable} from "rxjs";

// export const joinGameGuard: CanActivateFn = async (state) => {
//   const socket = new GameSocketService();
//   const gameService = new GameService(socket);

//   console.log("joingameguard", localStorage.getItem('jwt'));
//   gameService.accessGame();
//   const canConnectPromise = new Promise<boolean>((resolve) => {
//     gameService.getAccessGame().subscribe((result) => {
//       resolve(<boolean>result);
//     });
//   });

//   return await canConnectPromise;
// };
