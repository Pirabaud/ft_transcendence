import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {GameService} from "../../services/game.service";
import {Router, ActivatedRoute} from "@angular/router";
import { HttpService } from '../../http.service';
import {Subscription} from "rxjs";

/*Name and identifier of the differents files of the component*/
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {
  /*Access the DOM elements (browser page)*/
  @ViewChild('field') fieldElement: ElementRef;
  @ViewChild('ball') ballElement: ElementRef;
  @ViewChild('portal') portalElement: ElementRef;
  @ViewChild('teleport') teleportElement: ElementRef;
  @ViewChild('transparent') overlayElement: ElementRef;
  @ViewChild('cancelButton') cancelButtonElement: ElementRef;
  @ViewChild('matchmaking_message') matchmakingMsgElement: ElementRef;
  @ViewChild('disconnection_message') disconnectionMsgElement: ElementRef;
  @ViewChild('countdown') countdownElement: ElementRef;
  @ViewChild('p1_score') p1ScoreElement: ElementRef;
  @ViewChild('p2_score') p2ScoreElement: ElementRef;
  @ViewChild('p1_victory_message') p1VictoryMessageElement: ElementRef;
  @ViewChild('p2_victory_message') p2VictoryMessageElement: ElementRef;
  @ViewChild('paddle1') paddle1Element: ElementRef;
  @ViewChild('paddle2') paddle2Element: ElementRef;
  /*All the necessary variables for one client to run the game*/
  gameId: string;
  clientId: string;
  fieldRect: any;
  paddle1Rect: any;
  paddle2Rect: any;
  portalRect: any;
  p1_count: number;
  p2_count: number;
  p1_score: number;
  p2_score: number;
  animationId: any;
  gameStarted: boolean;

  ballObj: {
    posX: number,
    posY: number,
    directionX: number,
    directionY: number,
    speed: number,
    width: number,
    height: number
  };

  paddleObj1: {
    posX: number,
    posY: number,
    width: number,
    height: number
  };

  paddleObj2: {
    posX: number,
    posY: number,
    width: number,
    height: number
  };

  portalObj: {
    posX: number,
    posY: number,
    width: number,
    height: number
  }
  joinGameSubscription: Subscription;
  initIdSubscription: Subscription;
  startCountdownSubscription: Subscription;
  initBallDirSubscription: Subscription;
  ballPosSubscription: Subscription;
  paddlePosSubscription: Subscription;
  cancelGameSubscription: Subscription;
  stopGameSubscription: Subscription;
  goalScoredSubscription: Subscription;
  portalInteractionSubscription: Subscription;
  resumeGameSubscription: Subscription;
  backLobbySubscription: Subscription;

  /*GameService: Access the socket events emitting functions for the backend
    route: Give data about a specific route
    router: Navigate between the different components using routes*/
  constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router, private httpBackEnd: HttpService) {
    /*Initialize all game variables with neutral values*/
    this.gameId = "0";
    this.clientId = "0";
    this.fieldRect = undefined;
    this.paddle1Rect = undefined;
    this.paddle2Rect = undefined;
    this.portalRect = undefined;
    this.p1_count = 3;
    this.p2_count = 3;
    this.p1_score = 0;
    this.p2_score = 0;
    this.animationId = undefined;
    this.gameStarted = false;

    this.ballObj = {
      posX: 0,
      posY: 0,
      directionX: 0,
      directionY: 0,
      speed: 0,
      width: 0,
      height: 0
    };

    this.paddleObj1 = {
      posX: 0,
      posY: 0,
      width: 0,
      height: 0
    };

    this.paddleObj2 = {
      posX: 0,
      posY: 0,
      width: 0,
      height: 0
    }
    this.portalObj = {
      posX: 0,
      posY: 0,
      width: 0,
      height: 0
    }
  }

  /*Calling all receivers at initialisation so they are ready for the first event emission*/
  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get("id")!;
    this.joinGameSubscription = this.gameService.getJoinGame().subscribe(() => this.receiveJoinedPlayers());
    this.initIdSubscription = this.gameService.getInitId().subscribe((clientId: string) => this.clientId = clientId)
    this.startCountdownSubscription = this.gameService.getStartCountdown().subscribe((message: string) => this.countdownElement.nativeElement.innerHTML = message);
    this.initBallDirSubscription = this.gameService.getInitBallDir().subscribe((ball: {directionX: number, directionY: number}) => this.receiveInitBallDir(ball))
    this.ballPosSubscription = this.gameService.getGamePos().subscribe((data: any) => this.receiveBallPos(data));
    this.paddlePosSubscription = this.gameService.getPaddlePosUpdate().subscribe((data: any) => this.receivePaddlePosUpdate(data));
    this.cancelGameSubscription = this.gameService.getCancelGame().subscribe(() => this.receiveCancelGame());
    this.stopGameSubscription = this.gameService.getStopGame().subscribe((player : any) => this.receiveStopGame(player));
    this.goalScoredSubscription = this.gameService.getGoalScored().subscribe((score : {p1_score: number, p2_score: number}) => this.receiveGoalScored(score));
    this.portalInteractionSubscription = this.gameService.getPortalInteraction().subscribe((portalData: any) => this.receivePortalInteraction(portalData));
    this.resumeGameSubscription = this.gameService.getResumeGame().subscribe(() => this.receiveResumeGame());
    this.backLobbySubscription =   this.gameService.getBackLobby().subscribe(() => this.router.navigate(["/lobby"]));
    this.httpBackEnd.getCurrentGameId().subscribe(
      (currentGameId: { currentGameId: string }) =>
    {
      if (!this.gameService.getJoinedViaMatchmaking() || ((currentGameId.currentGameId !== '' && currentGameId.currentGameId !== null) && currentGameId.currentGameId !== this.gameId))
      {
        this.httpBackEnd.updateUserStatus('offline').subscribe(() => {});
        this.router.navigate(["/login"]);
      }
    })
    window.addEventListener('beforeunload', () =>
    {
      this.httpBackEnd.updateUserStatus('offline').subscribe(() => {});
      this.cancelMatchmaking();
      if (this.gameStarted === true) {
        this.gameService.cancelGame(this.gameId);
        this.httpBackEnd.setGameStatus(false).subscribe(() => {});
        this.httpBackEnd.setCurrentGameId("").subscribe(() => {});
      }
      this.router.navigate(['/lobby']);
    })
  }

  ngOnDestroy() {
    if (this.joinGameSubscription)
      this.joinGameSubscription.unsubscribe();
    if (this.initIdSubscription)
      this.initIdSubscription.unsubscribe();
    if (this.startCountdownSubscription)
      this.startCountdownSubscription.unsubscribe();
    if (this.initBallDirSubscription)
      this.initBallDirSubscription.unsubscribe();
    if (this.ballPosSubscription)
      this.ballPosSubscription.unsubscribe();
    if (this.paddlePosSubscription)
      this.paddlePosSubscription.unsubscribe();
    if (this.stopGameSubscription)
      this.stopGameSubscription.unsubscribe();
    if (this.goalScoredSubscription)
      this.goalScoredSubscription.unsubscribe();
    if (this.portalInteractionSubscription)
      this.portalInteractionSubscription.unsubscribe();
    if (this.resumeGameSubscription)
      this.resumeGameSubscription.unsubscribe();
    if (this.backLobbySubscription)
      this.backLobbySubscription.unsubscribe();
  }

  /*------------------------------------------------UTILS-FUNCTIONS--------------------------------------------------*/

    moveBall()
    {
      //start game and make the ball visible
      this.ballElement.nativeElement.style.visibility = "visible";

      const moveBallAnimation = () => {
        this.ballObj.posX += this.ballObj.speed * this.ballObj.directionX;
        this.ballObj.posY += this.ballObj.speed * this.ballObj.directionY;
        this.ballElement.nativeElement.style.left = this.ballObj.posX + "px";
        this.ballElement.nativeElement.style.top = this.ballObj.posY + "px";
        if (!this.gameStarted)
        {
          //stop the ball movement when the game is over
          cancelAnimationFrame(this.animationId)
          return;
        }
        this.animationId = requestAnimationFrame(moveBallAnimation);
        //loop in the function to move the ball
      };
      this.animationId = requestAnimationFrame(moveBallAnimation);
  }
  initPaddles()
  {
    /*initialize the paddles positions depending on the window size*/

    this.fieldRect = this.fieldElement.nativeElement.getBoundingClientRect()!;
    this.paddle1Rect = this.paddle1Element.nativeElement.getBoundingClientRect();
    this.paddle2Rect = this.paddle2Element.nativeElement.getBoundingClientRect();
      this.paddleObj1.posX = (parseFloat(window.getComputedStyle(this.fieldElement.nativeElement).getPropertyValue("width")) / 2) * -1;
      this.paddleObj1.width = parseFloat(window.getComputedStyle(this.paddle1Element.nativeElement).getPropertyValue("width"));
      this.paddleObj1.height = parseFloat(window.getComputedStyle(this.paddle1Element.nativeElement).getPropertyValue("height"));
      this.paddleObj2.posX = (parseFloat(window.getComputedStyle(this.fieldElement.nativeElement).getPropertyValue("width")) / 2);
      this.paddleObj2.width = parseFloat(window.getComputedStyle(this.paddle2Element.nativeElement).getPropertyValue("width"));
      this.paddleObj2.height = parseFloat(window.getComputedStyle(this.paddle2Element.nativeElement).getPropertyValue("height"));
  }

  initPortals()
  {
    /*initialize the portals positions depending on the window size*/
    this.fieldRect = this.fieldElement.nativeElement.getBoundingClientRect()!;
    this.portalRect = this.portalElement.nativeElement.getBoundingClientRect();
    this.portalObj.width = parseFloat(window.getComputedStyle(this.portalElement.nativeElement).getPropertyValue("width"));
    this.portalObj.height = parseFloat(window.getComputedStyle(this.portalElement.nativeElement).getPropertyValue("height"));
  }

  ngAfterViewInit() {
    if (this.gameService.getSimulateRecJoinedPlayers())
      this.receiveJoinedPlayers();
    this.httpBackEnd.getGameStatus().subscribe(
      (gameStatus: boolean) => {
        if (gameStatus === false && this.gameService.getJoinedViaMatchmaking())
          this.httpBackEnd.setCurrentGameId(this.gameId).subscribe(() => {});
      })
    this.initPaddles();

    /*Set up a listener that will make the paddle follow the mouse*/

    document.addEventListener("mousemove", evt => {
      if (this.gameStarted) {
        let mouseYInWin = evt.clientY;
        if (this.clientId === "0") {
          this.paddleObj1.height = this.paddle1Rect.height;
          this.paddleObj1.width = this.paddle1Rect.width;
          if (evt.clientY < this.fieldRect.bottom - this.paddle1Rect.height / 2 && evt.clientY > this.fieldRect.top + this.paddle1Rect.height / 2) {
            this.paddleObj1.posY = mouseYInWin - this.fieldRect.top;
            this.paddle1Element.nativeElement.style.top = (this.paddleObj1.posY - this.paddleObj1.height / 2) * 100 / this.fieldRect.height + "%";
            this.paddleObj1.posY -= this.fieldRect.height / 2;
          }
        }
        else if (this.clientId === "1") {
          this.paddleObj2.height = this.paddle2Rect.height;
          this.paddleObj2.width = this.paddle2Rect.width;
          if (evt.clientY < this.fieldRect.bottom - this.paddle2Rect.height / 2 && evt.clientY > this.fieldRect.top + this.paddle2Rect.height / 2) {
            this.paddleObj2.posY = mouseYInWin - this.fieldRect.top;
            this.paddle2Element.nativeElement.style.top = (this.paddleObj2.posY - this.paddleObj2.height / 2) * 100 / this.fieldRect.height + "%";
            this.paddleObj2.posY -= this.fieldRect.height / 2;
          }
        }
      }
    });
    /*Set up a listener that will make the board, ball and paddles adapt to the size of the window*/
    window.addEventListener("resize", () => {
      const newFieldRect = this.fieldElement.nativeElement.getBoundingClientRect();
      const newPaddle1Rect = this.paddle1Element.nativeElement.getBoundingClientRect();
      const newPaddle2Rect = this.paddle2Element.nativeElement.getBoundingClientRect();
      const heightRatio = newFieldRect.height / this.fieldRect.height;
      this.paddleObj1.posY = this.paddleObj1.posY * heightRatio;
      this.paddleObj1.width = newPaddle1Rect.width;
      this.paddleObj1.height = newPaddle1Rect.height;
      this.paddleObj2.width = newPaddle2Rect.width;
      this.paddleObj2.height = newPaddle2Rect.height;
      this.paddleObj2.posY = this.paddleObj2.posY * heightRatio;
      this.paddle1Rect = newPaddle1Rect;
      this.paddle2Rect = newPaddle2Rect;
      this.fieldRect = newFieldRect;
    });

        /*This interval will call the updateGame method 60 times per second which will make our game run at 60 fps,
      this is only for the paddles movements*/
    setInterval(() =>
    {
      if (this.gameStarted) {
        if (this.clientId === "0") {
          const data = {clientId: this.clientId, data: this.paddleObj1};
          this.updatePaddlePos(data);
        }
        else
        {
          const data = {clientId: this.clientId, data: this.paddleObj2};
          this.updatePaddlePos(data);
        }
      }
    }, 1000 / 60);
  }

  /*Handle game canceled*/
  receiveCancelGame() {
    this.gameStarted = false;
    this.httpBackEnd.setGameStatus(false).subscribe(() => {});
    this.httpBackEnd.setCurrentGameId('').subscribe(() => {});
    this.gameService.setSimulateRecJoinedPlayers(false);
    this.gameService.setJoinedViaMatchmaking(false);
    this.router.navigate(['/lobby']);
  }

  cancelMatchmaking()
  {
    this.gameService.cancelMatchmaking(this.gameService.getGameMode(), this.gameId);
    this.gameService.setSimulateRecJoinedPlayers(false);
    this.gameService.setJoinedViaMatchmaking(false);
    this.httpBackEnd.setCurrentGameId('').subscribe(() => {});
    this.router.navigate(["/lobby"])
  }
  /*Handle game over*/
  receiveStopGame(player: any) {
    this.gameService.setSimulateRecJoinedPlayers(false);
    this.gameService.setJoinedViaMatchmaking(false);
    this.gameStarted = false;
    this.ballElement.nativeElement.style.visibility = "hidden";
    this.p1ScoreElement.nativeElement.innerHTML = "0";
    this.p2ScoreElement.nativeElement.innerHTML = "0";

    this.p1VictoryMessageElement.nativeElement.innerHTML = player + ' wins !';
    this.overlayElement.nativeElement.style.visibility = "visible";
    this.p1VictoryMessageElement.nativeElement.style.visibility = "visible";
    setTimeout(() => {
      this.p1VictoryMessageElement.nativeElement.style.visibility = "hidden";
      document.documentElement.style.cursor = 'auto';
      this.httpBackEnd.setGameStatus(false).subscribe(() => {});
      this.httpBackEnd.setCurrentGameId('').subscribe(() => {});
      this.router.navigate(['/lobby']);
      }, 2500);
  }

  /*get other player paddle pos data*/
  updatePaddlePos(data: any) {
    this.gameService.updatePaddlePos(this.gameId, data, this.fieldRect.height);
  }

  /*receive other player paddle pos data*/
  receivePaddlePosUpdate(data: any) {
      if (!data || data.data.clientId === this.clientId)
        return ;
      if (this.clientId === "0")
      {
        this.paddleObj2.posY = data.data.data.posY * this.fieldRect.height / data.height;
        this.paddle2Element.nativeElement.style.top = ((this.paddleObj2.posY + this.fieldRect.height / 2) - this.paddleObj2.height / 2) * 100 / this.fieldRect.height + "%";
      }
      else if (this.clientId === "1")
      {
        this.paddleObj1.posY = data.data.data.posY * this.fieldRect.height / data.height;
        this.paddle1Element.nativeElement.style.top = ((this.paddleObj1.posY + this.fieldRect.height / 2) - this.paddleObj1.height / 2) * 100 / this.fieldRect.height + "%";
      }
  }
  /*Change score when a goal is scored*/
  receiveGoalScored(score: {p1_score: number, p2_score: number})
  {
      this.p1ScoreElement.nativeElement.innerHTML = score.p1_score;
      this.p2ScoreElement.nativeElement.innerHTML = score.p2_score;
      this.ballElement.nativeElement.style.visibility = "hidden";
  }
  /*Backend sends a new ball position 60 times per second, this function changes the current position to the new
  * one sent by the server. This position is then changed in the moveBall method*/
  receiveBallPos(data: any)
  {
      this.ballObj.posX = (this.fieldRect.width * data.ball.posX) / 1200;
      this.ballObj.posY = (this.fieldRect.height * data.ball.posY) / 600;
      this.ballObj.directionX = data.ball.directionX;
      this.ballObj.directionY = data.ball.directionY;
      this.ballObj.width = (this.ballObj.width * data.ball.width) / 25;
      this.ballObj.height = (this.ballObj.height * data.ball.height) / 50;
      this.ballObj.speed = data.ball.speed;
      this.portalObj.height = (this.fieldRect.height * data.portal.height) / 600;
      this.portalObj.width = (this.fieldRect.width * data.portal.width) / 1200;
      this.portalObj.posX = ((this.fieldRect.width * data.portal.entryPosX) / 1200) + (this.fieldRect.width / 2) - (this.portalObj.width / 2);
      this.portalObj.posY = ((this.fieldRect.height * data.portal.entryPosY) / 600) + (this.fieldRect.height / 2) - (this.portalObj.height / 2);
      this.portalElement.nativeElement.style.top = this.portalObj.posY + "px";
      this.portalElement.nativeElement.style.left = this.portalObj.posX + "px";
      this.portalElement.nativeElement.style.width = this.portalObj.width + "px";
      this.portalElement.nativeElement.style.height = this.portalObj.height + "px";
  }
  /*Give the first direction of the ball for movement*/
  receiveInitBallDir(ball: {directionX: number, directionY: number})
  {
      this.ballObj.directionX = ball.directionX;
      this.ballObj.directionY = ball.directionY;
  }
  /*After each goal, the game is resumed when this method receives an event*/
  receiveResumeGame()
  {
    this.httpBackEnd.setGameStatus(true).subscribe(() => {});
    this.gameStarted = true;
    this.moveBall();
    this.initPaddles();
    this.matchmakingMsgElement.nativeElement.style.visibility = 'hidden';
    this.disconnectionMsgElement.nativeElement.style.visibility = 'hidden';
    this.overlayElement.nativeElement.style.visibility = "hidden";
    if ((this.p1ScoreElement.nativeElement.innerHTML !== "8" &&
        this.p2ScoreElement.nativeElement.innerHTML !== "8") ||
        (this.p2ScoreElement.nativeElement.innerHTML !== "8" &&
         this.p1ScoreElement.nativeElement.innerHTML !== "8")) {
      this.ballElement.nativeElement.style.visibility = "visible";
    }
  }

  /*This method spawns and remove portals when needed*/
  receivePortalInteraction(portalData: any)
  {
      if (portalData.state === "on")
      {
        this.portalElement.nativeElement.style.visibility = "visible";
      }
      else {
        this.portalElement.nativeElement.style.visibility = "hidden";
        this.teleportElement.nativeElement.style.left = ((this.fieldRect.width * portalData.portalObj.exitPosX) / 1200) + (this.fieldRect.width / 2) - (this.portalObj.width / 2) + "px";
        this.teleportElement.nativeElement.style.top = ((this.fieldRect.height * portalData.portalObj.exitPosY) / 600) + (this.fieldRect.height / 2) - (this.portalObj.height / 2) + "px";
        this.teleportElement.nativeElement.classList.add("teleport");
        setTimeout(() => {
          this.teleportElement.nativeElement.classList.remove("teleport");
        }, 1000);
      }
  }

  /*This method starts the game when 2 players join the room*/
  receiveJoinedPlayers() {
    this.gameId = this.route.snapshot.paramMap.get("id")!;
    this.httpBackEnd.setCurrentOpponentId(this.gameId).subscribe(() => {})
    this.initPortals();
    this.cancelButtonElement.nativeElement.style.visibility = "hidden";
    this.matchmakingMsgElement.nativeElement.style.visibility = "hidden";
    this.overlayElement.nativeElement.style.visibility = "hidden";
    this.gameService.startGame(this.gameId);
    this.httpBackEnd.setGameStatus(true).subscribe(() => {});
    this.gameStarted = true;
    setTimeout(() => {
      this.moveBall();
      }, 3650);
  }
}
