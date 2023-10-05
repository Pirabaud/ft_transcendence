import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, of} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { HttpService } from '../http.service';
import { Router } from '@angular/router';


export interface MessageEventDto {
  socketId: string;
  roomId: string;
  username: string;
  content: string;
  createdAt: Date;
}

export interface Participant {
  roomId: string;
  username: string;
  avatar: string;
  connected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket, private http: HttpClient, private httpService: HttpService, private router: Router) {}

  connected(): boolean {
    return this.socket.ioSocket.connected;
  }

  getSocketId(): string {
    return this.socket.ioSocket.id;
  }


  sendMessage(message: MessageEventDto): void {
    this.socket.emit('exchanges', message);
  }

  participate(roomId: string, username: string, avatar: string): boolean {
    this.socket.emit('participants', {roomId, username, avatar});
    return this.socket.ioSocket.connected;
  }

  receiveEvent(eventId: string): Observable<any> {
    return this.socket.fromEvent(eventId);
  }

  // getMessage(roomId: string, fromIndex: number, toIndex: number): Observable<MessageEventDto[]> {
  //   // console.log("socket is : %s", <MessageEventDto>);
  //   return this.httpClient.get<MessageEventDto[]>(
  //     `/api/rooms/${roomId}/messages?fromIndex=${fromIndex}&toIndex=${toIndex}`,
  //     { headers: { 'Access-Control-Allow-Origin': '*'}, withCredentials: true}, );
      
  // }
  // getMessage(): Observable<MessageEventDto[]> {
  //   // console.log("socket is : %s", <MessageEventDto>);
  //   return this.httpClient.get<MessageEventDto[]>(
  //     `/api/rooms/roomId`,
  //     { headers: { 'Access-Control-Allow-Origin': '*'}, withCredentials: true}, );
      
  // }


  getAllRoom(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/chat/getAllRoom");
  }
  
  async createRoom(channel: string, password: string) {
    await this.httpService.getUserId().subscribe((response: any) => {
      if (response) {
        const room = {
          channel: channel,
          password: password,
          userId: response.UserId,
        };
        this.socket.emit('newRoom', room);
      } else {
        console.error("Error receiving username");
      }
    });
  }

  joinRoom(channel: string, password: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.getUserId().subscribe((response: any) => {
      if (response) {
          const room = {
            channel: channel,
            password: password,
            user: response.UserId,
          };
  
          this.socket.emit('joinRoom', room, (response: any) => {
            if (response == 1) {
              window.alert("This room doesn't exist!");
              observer.next(false);
            } else if (response == 2) {
              window.alert("Wrong password!");
              observer.next(false);
            } else if (response == 3) {
              window.alert("You're already in the room!");
              observer.next(false);
            } else {
              window.alert("Bravo!");
              observer.next(true);
            }
            observer.complete();
          });
        } else {
          console.error("Error receiving username");
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  leaveRoom(channel: string, userId: number) {
    const room = {
      channel: channel,
      user: userId,
    };
    this.socket.emit('leaveRoom', room);
    alert("This user leave the room " + channel);
  }

  kickRoom(channel: string, userId: number) {
    const room = {
      channel: channel,
      user: userId,
    };
    this.socket.emit('leaveRoom', room);
  }

  async addAdmin(admin: number, roomId: string) {
    const room = {
      user: admin,
      id: roomId,
    };
    console.log("service : " + room.user);
    console.log("service 2 : " +  room.id);
    this.socket.emit('addAdmin', room, (response: any) => {
      console.log("reponse" + response);
      if (!response) {
        alert('Room');
      } else if (response == 1) {
        alert(admin + " : is already admin !");
      } else if (response == 2) {
        alert(admin + " : is not in the room !");
      } else if (response == 3) {
        alert(admin + " : is the channel owner !");
      }else {
        alert(admin + " : is admin !");
      }
    });
  }

  removeAdmin(admin: number, roomId: string) {
    const room = {
      user: admin,
      id: roomId,
    };
    console.log("service : " + room.user);
    console.log("service 2 : " +  room.id);
    this.socket.emit('removeAdmin', room, (response: any) => {
      console.log("reponse" + response);
      if (response == 0) {
        alert('Room not found');
      } else if (response == 1) {
        alert(admin + " : is the channel owner !");
      } else if (response == 2) {
        alert(admin + " : is not in the room !");
      } else if (response == 3) {
        alert(admin + " : is not an admin !");
      }else if (response == 4) {
        alert(admin + " : he is no longer an admin");
      }
    });
  }
  
  getAdmin(admin: number, roomId: string): Observable<boolean> {
    const room = {
      user: admin,
      id: roomId,
    };
  
    return new Observable<boolean>((observer) => {
      this.socket.emit('getAdmin', room, (response: boolean) => {
        console.log("sorti : " + response);
        observer.next(response); // Émet la réponse
        observer.complete(); // Termine l'observable
      });
    });
  }

  

  getAllParticipants(channel: string): Observable<Array<number>> {
    const room = { channel: channel };
    return new Observable<number[]>(observer => {
      const room = { channel: channel };
      
      this.socket.emit('getAllParticipants', room, (response: number[]) => {
        observer.next(response); // Émettez la réponse lorsque les données sont disponibles
        observer.complete(); // Indiquez que l'observable est terminé
      });
    });
  }

  getUserId(username: string): Observable<any> {
    return this.http.post<any>("http://localhost:3000/user/getUserIdfromUsername", {username});
  }

  getUsername(userId: number): Observable<any> {
    return this.http.post<any>("http://localhost:3000/user/getUsername", {userId});
  }

  getPic(userId: number): Observable<any> {
    return this.http.post<any>("http://localhost:3000/user/getPic", {userId});
  }

  getStatus(userId: number): Observable<any> {
    return this.http.post<any>("http://localhost:3000/user/getStatus", {userId});
  }

}
