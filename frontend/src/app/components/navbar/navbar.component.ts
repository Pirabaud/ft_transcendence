import {Component, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpService } from "../../http.service";
import { AppComponent } from "../../app.component";
import { GameService } from "../../services/game.service";
import {Subscription} from "rxjs";
import { GameComponent } from "../game/game.component";
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private joinGameSubscription: Subscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private httpBackend: HttpService, private chatService: ChatService, private appService: AppComponent, private gameService: GameService) {
  };
  @ViewChild(GameComponent) gameComponent: GameComponent;

  ngAfterViewInit()
  {
    this.httpBackend.getCurrentGameId().subscribe(
      (gameIdObj: { currentGameId: string }) => {
        this.joinGameSubscription = this.gameService.getJoinGame().subscribe(() => {
          this.gameService.setSimulateRecJoinedPlayers(true);
          this.router.navigate(['/game', gameIdObj.currentGameId]);
        });
      });
  }
  ngOnInit()
  {
    this.activatedRoute.url.subscribe(
        (url: any) =>
        {
          if (url[0].path === 'game') {
            this.httpBackend.getUserStatus().subscribe((statusObj: {status: string}) =>
            {
              if (statusObj.status === 'offline')
                this.httpBackend.updateUserStatus('online').subscribe(() => {});
              else
                this.httpBackend.updateUserStatus('in game').subscribe(() => {});
            })
          }
          else if (url[0].path !== 'login')
          {
            this.httpBackend.getGameStatus().subscribe(
              (gameStatusObj: { gameStatus: number }) =>
            {
              setTimeout(() => {
                if (gameStatusObj.gameStatus === 1) {
                  this.httpBackend.getCurrentGameId().subscribe(
                    (gameIdObj: { currentGameId: string }) => {
                      this.gameService.cancelGame(gameIdObj.currentGameId);
                      this.httpBackend.setGameStatus(0).subscribe(() => {});
                    });
                }
                else
                  this.httpBackend.updateUserStatus('online').subscribe(() => {});
              }, 100);
            });
          }
        }
    )
    window.addEventListener('beforeunload', () =>
    {
          this.httpBackend.updateUserStatus('offline').subscribe(() => {});
          this.httpBackend.setGameStatus(0).subscribe(() => {});
          this.httpBackend.setCurrentGameId('').subscribe(() => {});
    })
  }

  ngOnDestroy()
  {
    if (this.joinGameSubscription)
      this.joinGameSubscription.unsubscribe();
  }
  navToHomepage() {
    this.router.navigate(['/home']);
  }

  navToProfile() {
    this.router.navigate(['/profile']);
  }

  navToChat() {

    var ok: boolean = false;
    var myUserId: number = 0;

    this.httpBackend.getUserId().subscribe((response: any) => {
      if (response) {
        myUserId = response.UserId;
      }
    });

    this.chatService.getAllRoom().subscribe((Response) => {
      if (Response) {
        var i = 0;
        while (Response[i]) {
          var j = 0;
          while (Response[i].participants[j]) {
            if (Response[i].participants[j] == myUserId) {
              ok = true;
            }
            j++;
          }
          i++;
        }
        if (ok) {
          this.router.navigate(['/chat']);
        } else {
          this.router.navigate(['/chat-lobby']);
        }
      } else {
        console.error("Error while retreiving all Rooms");
      }
    });

  }

  navToLobby() {
    this.httpBackend.getCurrentGameId().subscribe(
      (gameIdObj: {currentGameId: string}) => {
        if (gameIdObj.currentGameId)
          this.router.navigate(['/game', gameIdObj.currentGameId]);
        else
          this.router.navigate(['/lobby']);
      }
    )
  }

  navToLogin() {
    this.httpBackend.updateUserStatus('offline').subscribe(() => {
    });

    this.httpBackend.getGameStatus().subscribe(
      (gameStatusObj: { gameStatus: number }) =>
      {
        setTimeout(() => {
            this.httpBackend.getCurrentGameId().subscribe(
              (gameIdObj: { currentGameId: string }) => {
                if (gameStatusObj.gameStatus === 1 || gameStatusObj.gameStatus === 2) {
                this.gameService.cancelGame(gameIdObj.currentGameId);
                this.httpBackend.setGameStatus(0).subscribe(() => {});
                this.httpBackend.setCurrentGameId("").subscribe(() => {});
                }
                else {
                  this.gameService.cancelMatchmaking(this.gameService.getGameMode(), gameIdObj.currentGameId);
                  this.gameService.setSimulateRecJoinedPlayers(false);
                  this.gameService.setJoinedViaMatchmaking(false);
                  this.httpBackend.setCurrentGameId('').subscribe(() => {});
                }
              });

        }, 100);
      });
    this.router.navigate(['/login']);
  }
}
