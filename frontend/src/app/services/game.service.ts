import { Injectable } from '@angular/core';
import { GameSocketService } from "./game-socket.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  constructor(private socket: GameSocketService) {}
  
  private simulateRecJoinedPlayers = false;
  private joinedViaMatchmaking = false;
  private gameMode = 0;
  
  getheader(){
    return this.socket.getConfig();
  }
  setSimulateRecJoinedPlayers(value: boolean)
  {
    this.simulateRecJoinedPlayers = value;
  }
  getSimulateRecJoinedPlayers()
  {
    return this.simulateRecJoinedPlayers;
  }
  getJoinedViaMatchmaking(): boolean {
    return this.joinedViaMatchmaking;
  }
  setJoinedViaMatchmaking(value: boolean) {
    this.joinedViaMatchmaking = value;
  }
  getGameMode(): number {
    return this.gameMode;
  }
  setGameMode(value: number) {
    this.gameMode = value;
  }
  accessGame(): void
  {
    this.socket.emit("accessGame");
  }
  createGame(gameId: string, gameMode: number): void
  {
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
  getInitBallDir(): Observable<{directionX: number, directionY: number}>
  {
    return this.socket.fromEvent<{directionX: number, directionY: number}>("recInitBallDir")
  }
  getGamePos(): Observable<any>
  {
    return this.socket.fromEvent<any>("recBallPos");
  }
  pauseGame(gameId: string)
  {
    this.socket.emit('pauseGame', gameId)
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
  cancelMatchmaking(gameMode: number, gameId: string)
  {
    const gameData = {gameId: gameId, gameMode: gameMode};
    this.socket.emit('cancelMatchmaking', gameData);
  }
  cancelGame(gameId: string)
  {
    this.socket.emit('cancelGame', gameId);
  }
  getCancelGame(): Observable<string>
  {
    return this.socket.fromEvent<string>("recCancelGame");
  }
  getStopGame(): Observable<string>
  {
    return this.socket.fromEvent<string>("recStopGame");
  }
  resumeGame(gameId: string)
  {
    this.socket.emit('resumeGame', gameId)
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
