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
  username: string;
  avatar: string;
  connected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  dataArray: any[] = [];
  // private apiUrl = 'http://localhost:3000/api';

  constructor(private socket: Socket, private http: HttpClient, private httpService: HttpService, private router: Router) {

  }

  // Méthode pour créer une salle
  // createRoom(roomId: string, username: string, avatar: string) {
  //   const body = {
  //     roomId: roomId,
  //     username: username,
  //   };

  //   return this.httpClient.post(`${this.apiUrl}/rooms`, body);
  // }

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

  // createRoom(): Observable<MessageEventDto[]> {
  //   return this.socket.emit('room');
  // }

  findAllRoom(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/chat/findAllRoom");
  }

  getAllRoom(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/chat/getAllRoom");
  }
  
  async createRoom(channel: string, password: string) {
    await this.httpService.getUsername().subscribe((response: any) => {
      if (response) {
        const room = {
          channel: channel,
          password: password,
          username: response.Username,
        };
        this.socket.emit('newRoom', room);
      } else {
        console.error("Error receiving username");
      }
    });
  }

  joinRoom(channel: string, password: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.getUsername().subscribe((response: any) => {
        if (response) {
          const room = {
            channel: channel,
            password: password,
            username: response.Username,
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
  
  getAllParticipants(channel: string): Observable<Array<string>> {
    const room = { channel: channel };
    return new Observable<string[]>(observer => {
      const room = { channel: channel };
      
      this.socket.emit('getAllParticipants', room, (response: string[]) => {
        observer.next(response); // Émettez la réponse lorsque les données sont disponibles
        observer.complete(); // Indiquez que l'observable est terminé
      });
    });
  }

  



  // FONCTIONS POUR LE BACK DE REMI

  // getUsers(): Observable<any> {
  //   return this.http.get<any>("http://localhost:3000/chat/getUsers");
  // }

  // getAdmins(): Observable<any> {
  //   return this.http.get<any>("http://localhost:3000/chat/getAdmins");
  // }

  // IsThereAPassword(): Observable<any> {
  //   return this.http.get<any>("http://localhost:3000/chat/IsThereAPassword");
  // }

  // savePassword(password: string): Observable<any> {
  //   return this.http.post<any>("http://localhost:3000/chat/savePassword", {password});
  // }

  // comparePassword(password: string): Observable<any> {
  //   return this.http.post<any>("http://localhost:3000/chat/comparePassword", {password});
  // }

  // saveMessage(message: MessageEventDto): Observable<any> {
  //   return this.http.post<any>("http://localhost:3000/chat/saveMessage", message);
  // }

  // kick(userId: string): Observable<any> {
  //   return this.http.post<any>("http://localhost:3000/chat/kick", {userId});
  // }

  // ban(userId: string): Observable<any> {
  //   return this.http.post<any>("http://localhost:3000/chat/ban", {userId});
  // }

}
