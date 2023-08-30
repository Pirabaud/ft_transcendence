import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { Server } from "socket.io";
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [GameModule, AuthModule, UserModule, TypeOrmModule.forFeature([User])],
  providers: [GameGateway, AuthService, UserService]
})
export class GameModule {
  /*sert a verifier si l'utilisateur peut se connecter a la partie, ne sert pas pour l'instant*/
  // accessGame()
  // {
  //   let res = false;
  //   if (waitRoom.length === 1 && lastWaitRoomSize === 0)
  //     res = true;
  //   else if (waitRoom.length === 0 && lastWaitRoomSize === 1)
  //     res = true;
  //   lastWaitRoomSize = waitRoom.length;
  //   return res;
  // }

  /*Places a player in the waiting room if it is the first one for this mode, otherwise, creates a game with the player waiting and the one who just joined*/
  checkGameAvailability(server: Server, socket: any, gameId: string, gameMode: number, user: User) {
    let res: string;
    let waitRoomLength: number;

    waitRoomLength = gameMode === 0 ? waitRoomNormal.length : waitRoomPortal.length;
    if (waitRoomLength === 0) {
      addNewClient(socket, gameId);
      if (gameMode === 0)
        waitRoomNormal.push({gameId: gameId, socket: socket.id, user: user});
      else
        waitRoomPortal.push({gameId: gameId, socket: socket.id, user: user});
      res = "0";
      /*loops every 2 seconds to check if another player joined*/
      const gameReadyCheck = setInterval(() => {
        let i: number = getGameIndex(gameId, "gameId");
        if (i !== -1) {
          server.in(gameId).emit("recJoinGame", gameMode);
          clearInterval(gameReadyCheck);
        }
      }, 2000);
    }
    /*if the player joining is the second one, the waitRoom is emptied and a Game is created with this client
     and the one waiting in the waiting room, the gameId of the first player is then emitted to make it the same for both clients*/
    else {
      if (gameMode === 0)
        res = waitRoomNormal[0].gameId;
      else
        res = waitRoomPortal[0].gameId;
      addNewClient(socket, res);
      if (gameMode === 0)
      {
        const user2: User = waitRoomNormal[0].user;
        runningGames.push(new Game(res, gameMode, waitRoomNormal[0].socket, socket.id, user, user2));
        waitRoomNormal = [];
      }
      else
      {
        runningGames.push(new Game(res, gameMode, waitRoomPortal[0].socket, socket.id, user, waitRoomPortal[0].user));
        waitRoomPortal = [];
      }
    }
    return res;
  }

  /*sends all the init events (initId, countdown, initBallDir) and then starts the game loop*/
  startGame(server: Server, socket: any, gameId: string) {
    let obj: any = knownClients.get(socket.id);
    let index: number = getGameIndex(gameId, "gameId");
    const game = runningGames[index];

    socket.emit("recInitId", obj.clientId.toString());
    console.log("start.game", game.user1.login);
    if (game.once === 0) {
      ++game.once;
      /*send events for the countdown every 0.7 seconds*/
      const countdown = setInterval(() => {
        if (game.count > 0) {
          server.in(gameId).emit("recStartCountdown", game.count.toString());
          game.count--;
        } else {
          clearInterval(countdown);
          server.in(gameId).emit("recStartCountdown", "GO");
          setTimeout(() => {
            server.in(gameId).emit("recStartCountdown", "");
            game.countdownDone = true;
          }, 700);
        }
      }, 700);
      /*game started*/
      game.gameStatus = 1;
      /*send the first ball direction randomly calculated to the clients*/
      socket.to(gameId).emit("recInitBallDir", game.ball);
      /*while the game is in progress, the backend will send the ball position 60 times per second*/
      if (game.gameMode === 1)
        spawnPortals(server, gameId);
      const ballLoop = setInterval(() => {
        if (game.gameStatus === 1 && game.countdownDone) {
          ballMovement(server, gameId);
          server.in(gameId).emit("recBallPos", {ball: game.ball, portal: game.portal});
        }
        else if (game.gameStatus === 2)
          server.in(gameId).emit("recPauseGame");
        else if (game.gameStatus === 0)
          clearInterval(ballLoop)
      }, 1000 / 60);
    }
  }

  /*Extract data from the client and convert it to the backend template game to make all the calculations, once it is done,
  * the data is sent back to the clients*/
  updatePaddlePos(socket: any, gameId: string, data: any, clientHeight: number) {
    let index = getGameIndex(gameId, "gameId");
    let clientId = knownClients.get(socket.id);
    //console.log(clientId)
    if (clientId === "0") {
      runningGames[index].paddle1.posY = data.data.posY - (clientHeight / 2);
      runningGames[index].paddle1.posY = runningGames[index].paddle1.posY * (600 / clientHeight);
      runningGames[index].paddle1.posY += (600 / 2);
      runningGames[index].height.client1Height = clientHeight;
    } else {
      runningGames[index].paddle2.posY = data.data.posY - (clientHeight / 2);
      runningGames[index].paddle2.posY = runningGames[index].paddle2.posY * (600 / clientHeight);
      runningGames[index].paddle2.posY += (600 / 2);
      runningGames[index].height.client2Height = clientHeight;
    }
    return {data: data, height: clientHeight};
  }

  /*assigns an id (0, 1) to a client to know which player is left paddle and which is right*/
  assignPaddle(socket: any) {
    let obj = knownClients.get(socket.id);
    return obj.clientId.toString();
  }
}

/*The backend board template used to make all the calculations*/
let field: {width: number, height: number};

field = {
  width: 1200,
  height: 600
}

/*This class represents an ongoing game, it has all the necessary variables for one game of any mode*/
class   Game
{
  gameMode: number;
  multiGameId: string;
  gameStatus: number;
  once: number;
  user1: User;
  user2: User;
  p1SocketId: string;
  p2SocketId: any;
  portalOn: boolean;
  count: number;
  goalIsProcessed: boolean;
  countdownDone: boolean;
  ball: { posX: number; posY: number; width: number; directionX: number; directionY: number; speed: number; height: number };
  paddle1: { posX: number; posY: number; width: number; height: number };
  paddle2: { posX: number; posY: number; width: number; height: number };
  portal: { entryPosX: number; entryPosY: number; exitPosX: number; exitPosY: number; width: number; height: number };
  score: { p1_score: number; p2_score: number };
  height: { client2Height: number; client1Height: number };
  constructor(multiGameId: string, gameMode: number, p1SocketId: string, p2SocketId: string, user1: User, user2: User)
  {
    // se servir de gameMode pour identifier les parties differentes (autre map ou autre mode de jeu), pas sur que ca ai sa place ici, peut etre une autre classe Gametruc
    this.user1 = user1;
    this.user2 = user2;
    this.gameMode = gameMode;
    this.multiGameId = multiGameId;
    this.gameStatus = 0; //0: game stopped, 1: game in progress, 2: player disconnected
    this.once = 0; //is used to make sure only one client triggers the start og the game
    this.p1SocketId = p1SocketId;
    this.p2SocketId = p2SocketId;
    this.portalOn = false;
    this.count = 3;
    this.goalIsProcessed = true; //is used to make sure the previous goal has been processed before resuming the game, it could cause issues with the ball position without it
    this.countdownDone = false;
    this.ball = {
      posX: 0,
      posY: 0,
      directionX: Math.random() < 0.5 ? -1 : 1,
      directionY: Math.random() < 0.5 ? -1 : 1,
      height: 60,
      width: 30,
      speed: (field.width - field.height) / 110
    }

    this.paddle1 = {
      posX: -field.width / 2,
      posY: 0,
      width: 14,
      height: 120
    }

    this.paddle2 = {
      posX: field.width / 2,
      posY: 0,
      width: 14,
      height: 120
    }

    /*envoyer event toutes les 5 secondes pour faire spawn un portail*/
    this.portal = {
      entryPosX: 0,
      entryPosY: 0,
      exitPosX: 0,
      exitPosY: 0,
      width: 120,
      height: 120
    }

    this.score = {
      p1_score: 0,
      p2_score: 0
    }

    this.height = {
      client1Height: 0,
      client2Height: 0
    }
  }
}

/*--------------------------------------------------------------UTILS--------------------------------------------------*/

/*Where all the data about players waiting and ingame is stored*/
let waitRoomNormal: Array<any> = [];
let waitRoomPortal: Array<any> = [];
let runningGames: Array<Game> = [];
let knownClients: Map<any, any> = new Map();

/*returns how many players are associated to a gameId to know which id to give it (0, 1)*/
function    countValues(gameId: string)
{
  let count = 0;
  for (let iter of knownClients.values())
  {
    if (iter.gameId === gameId) {
      count++;
    }
  }
  return (count);
}

/*Adds a client to the list of known clients*/
function    addNewClient(socket: any, gameId: string)
{
  let count = countValues(gameId);
  socket.join(gameId);
  if (count === 0)
    knownClients.set(socket.id, {gameId: gameId, clientId: "0"});
  else {
    knownClients.set(socket.id, {gameId: gameId, clientId: "1"});
  }
    console.log("a user joined the room " + gameId);
}

/*Get the game instance associated with a gameId*/
function getGameIndex(data: string, dataType: string)
{
  if (dataType === "gameId") {
    for (let i = 0; runningGames[i]; ++i) {
      if (runningGames[i].multiGameId === data)
        return (i);
    }
    return (-1);
  }
  else {
    for (let i = 0; runningGames[i]; ++i) {
      if (runningGames[i].p1SocketId === data || runningGames[i].p2SocketId === data)
        return (i);
    }
    return (-1);
  }
}

/*-------------------------------------------------GAME CALCULATION--------------------------------------------------*/

/*Game calculation is done using a template board to simplify the responsive aspect of the game*/
function ballMovement(server: Server, gameId: string)
{
  let index = getGameIndex(gameId, "gameId");
  const game = runningGames[index];
  const halfWidth = (field.width / 2) - (game.ball.width / 2);
  const halfHeight = (field.height / 2) - (game.ball.height / 2);

  game.ball.posX += game.ball.speed * game.ball.directionX;
  game.ball.posY += game.ball.speed * game.ball.directionY;

  if (game.ball.posX >= halfWidth && game.goalIsProcessed) {
    ++game.score.p1_score;
    server.in(gameId).emit("recGoalScored", game.score);
    if (game.score.p1_score === 1) {
      game.gameStatus = 0;
      server.in(gameId).emit("recStopGame", game.user1.login);
      stopGame(server, gameId);
      return ;
    }
    resetBall("right", server, gameId);
  }
  else if (game.ball.posX < -halfWidth && game.goalIsProcessed) {
    ++game.score.p2_score;
    server.in(gameId).emit("recGoalScored", game.score);
    if (game.score.p2_score === 1) {
      game.gameStatus = 0;
      server.in(gameId).emit("recStopGame", game.user2.login);
      stopGame(server, gameId);
      return ;
    }
    resetBall("left", server, gameId);
  }
  if (game.ball.posY > halfHeight + game.ball.height / 5) {
    game.ball.posY = halfHeight;
    game.ball.directionY *= -1;
  }
  else if (game.ball.posY < -halfHeight - game.ball.height / 5) {
    game.ball.posY = -halfHeight;
    game.ball.directionY *= -1;
  }
  checkAllCollisionTypes(game, server, gameId);
}

/*After each goal, places back the ball in the middle*/
function resetBall(side: string, server: Server, gameId: string) {
  let index = getGameIndex(gameId, "gameId");
  const game = runningGames[index];
  const saveSpeed = game.ball.speed;

  game.ball.posY = 0;
  game.ball.posX = 0;
  game.ball.speed = 0;
  game.goalIsProcessed = false;
  setTimeout(() => {
    game.ball.posX = 0;
    game.ball.posY = 0;
    if (side === 'left') {
      game.ball.directionX = -1;
      game.ball.directionY = Math.random() < 0.5 ? -1 : 1;
    }
    if (side === 'right') {
      game.ball.directionX = 1;
      game.ball.directionY = Math.random() < 0.5 ? -1 : 1;
    }
    // server.in(gameId).emit("recMoveBall", game.data)
    game.goalIsProcessed = true;
    game.ball.speed = saveSpeed;
    server.in(gameId).emit("recResumeGame");
  }, 800);
}

/*Spawns a portal every 10 seconds if there is not already one on the board*/
function spawnPortals(server: Server, gameId: string)
{
  const loop = setInterval(() => {
    let index = getGameIndex(gameId, "gameId");
    let game = runningGames[index];
    if (game.portalOn === false)
    {
      let halfWidth = field.width / 2;
      let halfHeight = field.height / 2;
      game.portal.entryPosX = Math.floor(Math.random() * ((halfWidth - 200) - (-halfWidth + 200) + 1) + (-halfWidth + 200));
      game.portal.entryPosY = Math.floor(Math.random() * ((halfHeight - 200) - (-halfHeight + 200) + 1) + (-halfHeight + 200));
      game.portal.exitPosX = Math.floor(Math.random() * ((halfHeight - 200) - (-halfHeight + 200) + 1) + (-halfHeight + 200));
      game.portal.exitPosY = Math.floor(Math.random() * ((halfHeight - 200) - (-halfHeight + 200) + 1) + (-halfHeight + 200));
      game.portalOn = true;
      console.log("portal spawned at x: " + game.portal.entryPosX + " y: " + game.portal.entryPosY);
      server.in(gameId).emit("recPortalInteraction", {portalObj: game.portal, state: "on"});
    }
    if (game.gameStatus === 0)
      clearInterval(loop);
  }, 10000);
}

/*Game over*/
function stopGame(server: Server, gameId: string)
{
  let index = getGameIndex(gameId, "gameId");
  setTimeout(() => {
    runningGames[index].count = 3;
    runningGames[index].countdownDone = false;
    runningGames[index].score.p1_score = 0;
    runningGames[index].score.p2_score = 0;
    runningGames[index].ball.posX = 0;
    runningGames[index].ball.posY = 0;
    runningGames[index].ball.directionX = Math.random() < 0.5 ? -1 : 1;
    runningGames[index].ball.directionY = Math.random() < 0.5 ? -1 : 1;
  }, 2500);
}

/*Detects collision with paddle or portal*/
function checkAllCollisionTypes(game: any, server: any, gameId: string)
{
  const ballLeft = game.ball.posX - (game.ball.width / 2);
  const ballRight = game.ball.posX + (game.ball.width / 2);
  const ballTop = game.ball.posY - (game.ball.height / 2);
  const ballBottom = game.ball.posY + (game.ball.height / 2);

  const ballObj = { ballLeft: ballLeft, ballRight: ballRight, ballTop: ballTop, ballBottom: ballBottom };

  let checkCollision = detectPaddleCollision(ballObj, game);
  if (checkCollision === 1 || checkCollision === 2) {
    if (checkCollision === 1)
      game.ball.posX += 10;
    else
      game.ball.posX -= 10;
  }
  if (game.gameMode === 1 && game.portalOn == true) {
    checkCollision = detectPortalCollision(ballObj, game);
    if (checkCollision === 1) {
      let ballSpeed = Math.sqrt(game.ball.directionX * game.ball.directionX + game.ball.directionY * game.ball.directionY);
      let randomAngle = Math.random() * Math.PI - Math.PI / 2;

      /*sends data about the portal and teleport the ball to the previously calulated exit of the portal*/
      game.ball.posX = game.portal.exitPosX;
      game.ball.posY = game.portal.exitPosY;
      game.ball.directionX = Math.cos(randomAngle);
      game.ball.directionY = Math.sin(randomAngle);
      game.ball.directionX *= ballSpeed;
      game.ball.directionY *= ballSpeed;
      game.portalOn = false;
      server.in(gameId).emit("recPortalInteraction", { portalObj: game.portal, state: "off" });
    }
  }
}

/*Detect collision with paddle and calculates a bounce angle for the ball*/
function detectPaddleCollision(ballObj: any, game: any) {

  if (game.ball.posX < 0) {
    const paddleLeft = -field.width / 2;
    const paddleRight = -field.width / 2 + game.paddle1.width;
    const paddleTop = game.paddle1.posY - (game.paddle1.height / 2);
    const paddleBottom = game.paddle1.posY + (game.paddle1.height / 2);
    if (
        ballObj.ballLeft < paddleRight &&
        ballObj.ballRight > paddleLeft &&
        ballObj.ballTop < paddleBottom &&
        ballObj.ballBottom > paddleTop
    ) {
      let paddleOffset = (game.ball.posY - game.paddle1.posY) / (game.paddle1.height / 2);
      let maxBounceAngle = Math.PI / 4;
      let bounceAngle = paddleOffset * maxBounceAngle;
      let ballSpeed = Math.sqrt(game.ball.directionX * game.ball.directionX + game.ball.directionY * game.ball.directionY); // Calculate current speed

      /*Speed cap*/
      if (ballSpeed < 2.7)
        ballSpeed += 0.1;
      game.ball.directionX = Math.cos(bounceAngle);
      game.ball.directionY = Math.sin(bounceAngle);
      game.ball.directionX *= ballSpeed;
      game.ball.directionY *= ballSpeed;

      return 1;
    }
  }
  else if (game.ball.posX > 0)
  {
    let paddleLeft = field.width / 2 - game.paddle2.width;
    let paddleRight = field.width / 2;
    let paddleTop = game.paddle2.posY - (game.paddle2.height / 2);
    let paddleBottom = game.paddle2.posY + (game.paddle2.height / 2);

    if (
        ballObj.ballLeft < paddleRight &&
        ballObj.ballRight > paddleLeft &&
        ballObj.ballTop < paddleBottom &&
        ballObj.ballBottom > paddleTop
    ) {
      let paddleOffset = (game.ball.posY - game.paddle2.posY) / (game.paddle2.height / 2);
      let maxBounceAngle = Math.PI / 4;
      let bounceAngle = paddleOffset * maxBounceAngle;
      let ballSpeed = Math.sqrt(game.ball.directionX * game.ball.directionX + game.ball.directionY * game.ball.directionY); // Calculate current speed

      /*Speed cap*/
      if (ballSpeed < 2.7)
        ballSpeed += 0.1;
      game.ball.directionX = Math.cos(bounceAngle) * -1;
      game.ball.directionY = Math.sin(bounceAngle);
      game.ball.directionX *= ballSpeed;
      game.ball.directionY *= ballSpeed;

      return 2;
    }
  }
  return 0;
}

function detectPortalCollision(ballObj: any, game: any) {

  const portalLeft = game.portal.entryPosX - (game.portal.width / 2);
  const portalRight = game.portal.entryPosX + (game.portal.width / 2);
  const portalTop = game.portal.entryPosY - (game.portal.height / 2);
  const portalBottom = game.portal.entryPosY + (game.portal.height / 2);

  /*balle touche le portail*/
  if (ballObj.ballLeft < portalRight &&
      ballObj.ballRight > portalLeft &&
      ballObj.ballTop < portalBottom &&
      ballObj.ballBottom > portalTop)
  {
    return 1;
  }
  return 0;
}
