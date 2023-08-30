// import { Server } from "socket.io";
// import { Game } from "./interfaces/game.interface";

// export class  GameRunning
// {
//   constructor(private game: Game, multiGameId: string, gameMode: number, p1SocketId: string, p2SocketId: string)
//   {
//     // se servir de gameMode pour identifier les parties differentes (autre map ou autre mode de jeu), pas sur que ca ai sa place ici, peut etre une autre classe Gametruc
//     this.game.gameMode = gameMode;
//     this.game.multiGameId = multiGameId;
//     this.game.gameStatus = 0; //0: game stopped, 1: game in progress, 2: player disconnected
//     this.game.once = 0; //is used to make sure only one client triggers the start og the game
//     this.game.p1SocketId = p1SocketId;
//     this.game.p2SocketId = p2SocketId;
//     this.game.portalOn = false;
//     this.game.count = 3;
//     this.game.goalIsProcessed = true; //is used to make sure the previous goal has been processed before resuming the game, it could cause issues with the ball position without it
//     this.game.countdownDone = false;
//     this.game.field = {
//       width: 1200,
//       height: 600
//     }
//     this.game.ball = {
//       posX: 0,
//       posY: 0,
//       directionX: Math.random() < 0.5 ? -1 : 1,
//       directionY: Math.random() < 0.5 ? -1 : 1,
//       height: 60,
//       width: 30,
//       speed: (this.game.field.width - this.game.field.height) / 110
//     }

//     this.game.paddle1 = {
//       posX: -this.game.field.width / 2,
//       posY: 0,
//       width: 14,
//       height: 120
//     }

//     this.game.paddle2 = {
//       posX: this.game.field.width / 2,
//       posY: 0,
//       width: 14,
//       height: 120
//     }

//     /*envoyer event toutes les 5 secondes pour faire spawn un portail*/
//     this.game.portal = {
//       entryPosX: 0,
//       entryPosY: 0,
//       exitPosX: 0,
//       exitPosY: 0,
//       width: 120,
//       height: 120
//     }

//     this.game.score = {
//       p1_score: 0,
//       p2_score: 0
//     }

//     this.game.height = {
//       client1Height: 0,
//       client2Height: 0
//     }
//   }
// }

// /*--------------------------------------------------------------UTILS--------------------------------------------------*/

// /*Where all the data about players waiting and ingame is stored*/
// let waitRoomNormal: Array<any> = [];
// let waitRoomPortal: Array<any> = [];
// let runningGames: Array<Game> = [];
// let knownClients: Map<any, any> = new Map();

// /*returns how many players are associated to a gameId to know which id to give it (0, 1)*/
// function    countValues(gameId: string)
// {
//   let count = 0;
//   for (let iter of knownClients.values())
//   {
//     if (iter.gameId === gameId) {
//       count++;
//     }
//   }
//   return (count);
// }

// /*Adds a client to the list of known clients*/
// function    addNewClient(socket: any, gameId: string)
// {
//   let count = countValues(gameId);
//   socket.join(gameId);
//   if (count === 0)
//     knownClients.set(socket.id, {gameId: gameId, clientId: "0"});
//   else {
//     knownClients.set(socket.id, {gameId: gameId, clientId: "1"});
//   }
//     console.log("a user joined the room " + gameId);
// }

// /*Get the game instance associated with a gameId*/
// function getGameIndex(data: string, dataType: string)
// {
//   if (dataType === "gameId") {
//     for (let i = 0; runningGames[i]; ++i) {
//       if (runningGames[i].multiGameId === data)
//         return (i);
//     }
//     return (-1);
//   }
//   else {
//     for (let i = 0; runningGames[i]; ++i) {
//       if (runningGames[i].p1SocketId === data || runningGames[i].p2SocketId === data)
//         return (i);
//     }
//     return (-1);
//   }
// }

// /*-------------------------------------------------GAME CALCULATION--------------------------------------------------*/

// /*Game calculation is done using a template board to simplify the responsive aspect of the game*/
// function ballMovement(server: Server, gameId: string)
// {
//   let index = getGameIndex(gameId, "gameId");
//   const game = runningGames[index];
//   const halfWidth = (field.width / 2) - (game.ball.width / 2);
//   const halfHeight = (field.height / 2) - (game.ball.height / 2);

//   game.ball.posX += game.ball.speed * game.ball.directionX;
//   game.ball.posY += game.ball.speed * game.ball.directionY;

//   if (game.ball.posX >= halfWidth && game.goalIsProcessed) {
//     ++game.score.p1_score;
//     server.in(gameId).emit("recGoalScored", game.score);
//     if (game.score.p1_score === 8) {
//       game.gameStatus = 0;
//       server.in(gameId).emit("recStopGame", 1);
//       stopGame(server, gameId);
//       return ;
//     }
//     resetBall("right", server, gameId);
//   }
//   else if (game.ball.posX < -halfWidth && game.goalIsProcessed) {
//     ++game.score.p2_score;
//     server.in(gameId).emit("recGoalScored", game.score);
//     if (game.score.p2_score === 8) {
//       game.gameStatus = 0;
//       server.in(gameId).emit("recStopGame", 2);
//       stopGame(server, gameId);
//       return ;
//     }
//     resetBall("left", server, gameId);
//   }
//   if (game.ball.posY > halfHeight + game.ball.height / 5) {
//     game.ball.posY = halfHeight;
//     game.ball.directionY *= -1;
//   }
//   else if (game.ball.posY < -halfHeight - game.ball.height / 5) {
//     game.ball.posY = -halfHeight;
//     game.ball.directionY *= -1;
//   }
//   checkAllCollisionTypes(game, server, gameId);
// }

// /*After each goal, places back the ball in the middle*/
// function resetBall(side: string, server: Server, gameId: string) {
//   let index = getGameIndex(gameId, "gameId");
//   const game = runningGames[index];
//   const saveSpeed = game.ball.speed;

//   game.ball.posY = 0;
//   game.ball.posX = 0;
//   game.ball.speed = 0;
//   game.goalIsProcessed = false;
//   setTimeout(() => {
//     game.ball.posX = 0;
//     game.ball.posY = 0;
//     if (side === 'left') {
//       game.ball.directionX = -1;
//       game.ball.directionY = Math.random() < 0.5 ? -1 : 1;
//     }
//     if (side === 'right') {
//       game.ball.directionX = 1;
//       game.ball.directionY = Math.random() < 0.5 ? -1 : 1;
//     }
//     // server.in(gameId).emit("recMoveBall", game.data)
//     game.goalIsProcessed = true;
//     game.ball.speed = saveSpeed;
//     server.in(gameId).emit("recResumeGame");
//   }, 800);
// }

// /*Spawns a portal every 10 seconds if there is not already one on the board*/
// function spawnPortals(server: Server, gameId: string)
// {
//   const loop = setInterval(() => {
//     let index = getGameIndex(gameId, "gameId");
//     let game = runningGames[index];
//     if (game.portalOn === false)
//     {
//       let halfWidth = field.width / 2;
//       let halfHeight = field.height / 2;
//       game.portal.entryPosX = Math.floor(Math.random() * ((halfWidth - 200) - (-halfWidth + 200) + 1) + (-halfWidth + 200));
//       game.portal.entryPosY = Math.floor(Math.random() * ((halfHeight - 200) - (-halfHeight + 200) + 1) + (-halfHeight + 200));
//       game.portal.exitPosX = Math.floor(Math.random() * ((halfHeight - 200) - (-halfHeight + 200) + 1) + (-halfHeight + 200));
//       game.portal.exitPosY = Math.floor(Math.random() * ((halfHeight - 200) - (-halfHeight + 200) + 1) + (-halfHeight + 200));
//       game.portalOn = true;
//       console.log("portal spawned at x: " + game.portal.entryPosX + " y: " + game.portal.entryPosY);
//       server.in(gameId).emit("recPortalInteraction", {portalObj: game.portal, state: "on"});
//     }
//     if (game.gameStatus === 0)
//       clearInterval(loop);
//   }, 10000);
// }

// /*Game over*/
// function stopGame(server: Server, gameId: string)
// {
//   let index = getGameIndex(gameId, "gameId");
//   setTimeout(() => {
//     runningGames[index].count = 3;
//     runningGames[index].countdownDone = false;
//     runningGames[index].score.p1_score = 0;
//     runningGames[index].score.p2_score = 0;
//     runningGames[index].ball.posX = 0;
//     runningGames[index].ball.posY = 0;
//     runningGames[index].ball.directionX = Math.random() < 0.5 ? -1 : 1;
//     runningGames[index].ball.directionY = Math.random() < 0.5 ? -1 : 1;
//   }, 2500);
// }

// /*Detects collision with paddle or portal*/
// function checkAllCollisionTypes(game: any, server: any, gameId: string)
// {
//   const ballLeft = game.ball.posX - (game.ball.width / 2);
//   const ballRight = game.ball.posX + (game.ball.width / 2);
//   const ballTop = game.ball.posY - (game.ball.height / 2);
//   const ballBottom = game.ball.posY + (game.ball.height / 2);

//   const ballObj = { ballLeft: ballLeft, ballRight: ballRight, ballTop: ballTop, ballBottom: ballBottom };

//   let checkCollision = detectPaddleCollision(ballObj, game);
//   if (checkCollision === 1 || checkCollision === 2) {
//     if (checkCollision === 1)
//       game.ball.posX += 10;
//     else
//       game.ball.posX -= 10;
//   }
//   if (game.gameMode === 1 && game.portalOn == true) {
//     checkCollision = detectPortalCollision(ballObj, game);
//     if (checkCollision === 1) {
//       let ballSpeed = Math.sqrt(game.ball.directionX * game.ball.directionX + game.ball.directionY * game.ball.directionY);
//       let randomAngle = Math.random() * Math.PI - Math.PI / 2;

//       /*sends data about the portal and teleport the ball to the previously calulated exit of the portal*/
//       game.ball.posX = game.portal.exitPosX;
//       game.ball.posY = game.portal.exitPosY;
//       game.ball.directionX = Math.cos(randomAngle);
//       game.ball.directionY = Math.sin(randomAngle);
//       game.ball.directionX *= ballSpeed;
//       game.ball.directionY *= ballSpeed;
//       game.portalOn = false;
//       server.in(gameId).emit("recPortalInteraction", { portalObj: game.portal, state: "off" });
//     }
//   }
// }

// /*Detect collision with paddle and calculates a bounce angle for the ball*/
// function detectPaddleCollision(ballObj: any, game: any) {

//   if (game.ball.posX < 0) {
//     const paddleLeft = -field.width / 2;
//     const paddleRight = -field.width / 2 + game.paddle1.width;
//     const paddleTop = game.paddle1.posY - (game.paddle1.height / 2);
//     const paddleBottom = game.paddle1.posY + (game.paddle1.height / 2);
//     if (
//         ballObj.ballLeft < paddleRight &&
//         ballObj.ballRight > paddleLeft &&
//         ballObj.ballTop < paddleBottom &&
//         ballObj.ballBottom > paddleTop
//     ) {
//       let paddleOffset = (game.ball.posY - game.paddle1.posY) / (game.paddle1.height / 2);
//       let maxBounceAngle = Math.PI / 4;
//       let bounceAngle = paddleOffset * maxBounceAngle;
//       let ballSpeed = Math.sqrt(game.ball.directionX * game.ball.directionX + game.ball.directionY * game.ball.directionY); // Calculate current speed

//       /*Speed cap*/
//       if (ballSpeed < 2.7)
//         ballSpeed += 0.1;
//       game.ball.directionX = Math.cos(bounceAngle);
//       game.ball.directionY = Math.sin(bounceAngle);
//       game.ball.directionX *= ballSpeed;
//       game.ball.directionY *= ballSpeed;

//       return 1;
//     }
//   }
//   else if (game.ball.posX > 0)
//   {
//     let paddleLeft = field.width / 2 - game.paddle2.width;
//     let paddleRight = field.width / 2;
//     let paddleTop = game.paddle2.posY - (game.paddle2.height / 2);
//     let paddleBottom = game.paddle2.posY + (game.paddle2.height / 2);

//     if (
//         ballObj.ballLeft < paddleRight &&
//         ballObj.ballRight > paddleLeft &&
//         ballObj.ballTop < paddleBottom &&
//         ballObj.ballBottom > paddleTop
//     ) {
//       let paddleOffset = (game.ball.posY - game.paddle2.posY) / (game.paddle2.height / 2);
//       let maxBounceAngle = Math.PI / 4;
//       let bounceAngle = paddleOffset * maxBounceAngle;
//       let ballSpeed = Math.sqrt(game.ball.directionX * game.ball.directionX + game.ball.directionY * game.ball.directionY); // Calculate current speed

//       /*Speed cap*/
//       if (ballSpeed < 2.7)
//         ballSpeed += 0.1;
//       game.ball.directionX = Math.cos(bounceAngle) * -1;
//       game.ball.directionY = Math.sin(bounceAngle);
//       game.ball.directionX *= ballSpeed;
//       game.ball.directionY *= ballSpeed;

//       return 2;
//     }
//   }
//   return 0;
// }

// function detectPortalCollision(ballObj: any, game: any) {

//   const portalLeft = game.portal.entryPosX - (game.portal.width / 2);
//   const portalRight = game.portal.entryPosX + (game.portal.width / 2);
//   const portalTop = game.portal.entryPosY - (game.portal.height / 2);
//   const portalBottom = game.portal.entryPosY + (game.portal.height / 2);

//   /*balle touche le portail*/
//   if (ballObj.ballLeft < portalRight &&
//       ballObj.ballRight > portalLeft &&
//       ballObj.ballTop < portalBottom &&
//       ballObj.ballBottom > portalTop)
//   {
//     return 1;
//   }
//   return 0;
// }