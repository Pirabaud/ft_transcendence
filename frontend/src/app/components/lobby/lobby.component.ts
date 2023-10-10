import { Component } from "@angular/core";
import {GameService} from "../../services/game.service";
import { Router } from "@angular/router";
import { v4 as uuidv4 } from "uuid"
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpService } from "../../http.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})

export class LobbyComponent {
  constructor(private router:Router, private gameService: GameService, private jwtHelper: JwtHelperService, private httpBackend: HttpService) {}
  ngOnInit() {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this.httpBackend.updateUserStatus('offline');
      this.router.navigate(['/login']);
    }
  }
  createGame(gameMode: number)
  {
    let gameId = uuidv4();
    this.gameService.createGame(gameId, gameMode, -1, 0);
    /*If it is the first player joining this game, it keeps its gameId, otherwise, it changes the gameId to the other player's gameId*/
    this.gameService.getCreateGame().subscribe((newGameId: string) => {
      if (newGameId === "") {
        alert('An error occured');
        return ;
      }
      if (newGameId !== "0")
        gameId = <string>newGameId;
      this.gameService.setJoinedViaMatchmaking(true);
      this.gameService.setGameMode(gameMode);
      this.router.navigate(['/game', gameId]);
    });
  }
}
