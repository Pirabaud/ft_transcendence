import { Socket } from "socket.io";
import { User } from "src/user/user.entity";

export interface UserWaiting {
    socket: Socket;
    gameId: string;
    user: User;
}