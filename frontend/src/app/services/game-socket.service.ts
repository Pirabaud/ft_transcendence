import { Injectable } from "@angular/core"
import { SocketIoConfig, Socket } from "ngx-socket-io"

// const config: SocketIoConfig = {
//   url: "http://localhost:3000", {
//   auth: {
//     authorization: localStorage.getItem("jwt") }
//   }
// }



export function getJwt() {
      return localStorage.getItem('jwt');
  }

const config: SocketIoConfig = {
url: 'http://localhost:3000', options: {
      extraHeaders: {
      authorization: (localStorage.getItem('jwt') || '{}'),
      }
    }
  }

@Injectable({
  providedIn: "root",
})

export class GameSocketService extends Socket
{
  private readonly tokenJwt = localStorage.getItem('jwt');
  constructor(){
    super(config);
  }

 }
