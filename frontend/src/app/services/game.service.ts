import { Injectable } from '@angular/core';
import { GameSocketService } from "./game-socket.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private socket: GameSocketService) {}
  getheader(){
    return this.socket.getConfig();
  }
  accessGame(): void
  {
    this.socket.emit("accessGame");
  }
  createGame(gameId: string, gameMode: number): void
  {
    console.log(localStorage.getItem('jwt'));
    let obj = {
      gameId: gameId,
      gameMode: gameMode
    }
    this.socket.emit("createGame", obj);
  }
  startGame(gameId: string): void
  {
    this.socket.emit("startGame", gameId);
  }
  updatePaddlePos(gameId: string, data: any, clientHeight: number): void
  {
    let obj = {
      data: data,
      gameId: gameId,
      clientHeight: clientHeight
    };
    this.socket.emit("updatePaddlePos", obj);
  }
  assignPaddle(gameId: string): void
  {
    this.socket.emit("assignPaddle", gameId);
  }
  getAccessGame(): Observable<boolean>
  {
    return this.socket.fromEvent<boolean>("recAccessGame");
  }
  getCreateGame(): Observable<string>
  {
    return this.socket.fromEvent<string>("recCreateGame");
  }
  getInitId(): Observable<string>
  {
    return this.socket.fromEvent<string>("recInitId");
  }
  getJoinGame(): Observable<number>
  {
    return this.socket.fromEvent<number>("recJoinGame");
  }
  getStartCountdown(): Observable<string>
  {
    return this.socket.fromEvent<string>("recStartCountdown")
  }
  getInitBallDir(): Observable<number>
  {
    return this.socket.fromEvent<number>("recInitBallDir")
  }
  getGamePos(): Observable<any>
  {
    return this.socket.fromEvent<any>("recBallPos");
  }
  getPauseGame(): Observable<any>
  {
    return this.socket.fromEvent<any>("recPauseGame");
  }
  getPaddlePosUpdate(): Observable<any>
  {
    return this.socket.fromEvent<any>("recPaddlePosUpdate");
  }
  getGoalScored(): Observable<any>
  {
    return this.socket.fromEvent<any>("recGoalScored");
  }
  getStopGame(): Observable<string>
  {
    return this.socket.fromEvent<string>("recStopGame");
  }
  getResumeGame(): Observable<void>
  {
    return this.socket.fromEvent<void>("recResumeGame");
  }

  getPortalInteraction(): Observable<any>
  {
    return this.socket.fromEvent<any>("recPortalInteraction");
  }
  getBackLobby(): Observable<void>
  {
    return this.socket.fromEvent<void>("recBackLobby");
  }
  // /*servira pour la fleche retour*/
  // // pageBack(clientId : string)
  // // {
  // //   this.socket.emit("pageBack", clientId)
  // // }
  //
}
