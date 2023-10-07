import {Component, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from "@angular/router";
import { HttpService } from "../../http.service";
import { AppComponent } from "../../app.component";
import { GameService } from "../../services/game.service";
import {Subscription} from "rxjs";
import { GameComponent } from "../game/game.component";
import { ChatService } from '../../services/chat.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private joinGameSubscription: Subscription;
  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private httpBackend: HttpService, 
    private appService: AppComponent, 
    private gameService: GameService,
    private jwtHelper: JwtHelperService,
    private chatService: ChatService,) {
  };
  @ViewChild(GameComponent) gameComponent: GameComponent;

  ngAfterViewInit()
  {
    this.activatedRoute.url.subscribe(
      (url: UrlSegment[]) => {
        if (url[0].path !== 'login'){
          this.httpBackend.getCurrentGameId().subscribe(
          (currentGameId: string ) => {
          this.joinGameSubscription = this.gameService.getJoinGame().subscribe(() => {
          this.gameService.setSimulateRecJoinedPlayers(true);
          this.router.navigate(['/game', currentGameId]);
            });
          });
       }
      }
    )
  }
  ngOnInit()
  {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
          this.router.navigate(['/login']);

    this.activatedRoute.url.subscribe(
        (url: any) =>
        {
          if (url[0].path === 'game') {
            this.httpBackend.getUserStatus().subscribe((response: {status: string}) =>
            {
              if (response.status === 'offline')
                this.httpBackend.updateUserStatus('online').subscribe(() => {});
              else
                this.httpBackend.updateUserStatus('in game').subscribe(() => {});
            })
          }
          else if (url[0].path !== 'login')
          {
            this.httpBackend.getGameStatus().subscribe(
              (gameStatus: boolean ) =>
            {
              setTimeout(() => {
                if (gameStatus === true) {
                  this.httpBackend.getCurrentGameId().subscribe(
                    (currentGameId: string ) => {
                      this.gameService.cancelGame(currentGameId);
                      this.httpBackend.setGameStatus(false).subscribe(() => {});
                    });
                }
                else
                  this.httpBackend.updateUserStatus('online').subscribe(() => {});
              }, 100);
            });
          }
        }
    )
    window.addEventListener('unload', () =>
    {
          this.httpBackend.updateUserStatus('offline').subscribe(() => {});
          this.httpBackend.setGameStatus(false).subscribe(() => {});
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
      (currentGameId: string) => {
      if (currentGameId === null)
          this.router.navigate(['/lobby']);
        else
          this.router.navigate(['/game', currentGameId]);
      }
    )
  }

  navToLogin() {
    this.httpBackend.updateUserStatus('offline').subscribe(() => {
    });

    this.httpBackend.getGameStatus().subscribe(
      (gameStatus: boolean) =>
      {
        setTimeout(() => {
            this.httpBackend.getCurrentGameId().subscribe(
              ( currentGameId: string ) => {
                if (gameStatus === true){
                  this.gameService.cancelGame(currentGameId);
                  this.httpBackend.setGameStatus(false).subscribe(() => {});
                  this.httpBackend.setCurrentGameId("").subscribe(() => {});
                }
                else {
                  this.gameService.cancelMatchmaking(this.gameService.getGameMode(), currentGameId);
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
