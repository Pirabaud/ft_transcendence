export interface Game
{
  gameMode: number;
  multiGameId: string;
  gameStatus: number;
  once: number;
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
  field: { width: number, height: number};
}