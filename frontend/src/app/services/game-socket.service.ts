import { Injectable } from "@angular/core"
import { SocketIoConfig, Socket } from "ngx-socket-io"


export function getJwt() {
      return localStorage.getItem('jwt');
  }

const config: SocketIoConfig = {
url: 'http://localhost:3000', options: {
      extraHeaders: {
      authorization: (localStorage.getItem('jwt')!)
      }
    }
  }

@Injectable({
  providedIn: "root",
})

export class GameSocketService extends Socket
{
  constructor(){
    super({
      url: 'http://localhost:3000', options: {
            extraHeaders: {
            authorization: (localStorage.getItem('jwt')!)
            }
          }
        });
  }
 }
