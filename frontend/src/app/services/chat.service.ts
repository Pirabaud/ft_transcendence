import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, of} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

export interface Participant {
  userId: number;
  username: string;
  avatar: string;
  status: string,
}

export interface MessageEvent {
  socketId: string;
  roomId: string;
  user: Participant;
  content: string;
  createdAt: Date;
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


  sendMessage(message: MessageEvent): void {
    this.socket.emit('exchanges', message);
  }

  participate(roomId: string, user: Participant) {
    const room = {
      roomID: roomId,
      user: user,
    }
    this.socket.emit('participant', room);
  }

  leave(roomId: string, userId: number) {
    const room = {
      roomID: roomId,
      userID: userId,
    }
    this.socket.emit('leave', room);
  }

  receiveEvent(eventId: string): Observable<any> {
    return this.socket.fromEvent(eventId);
  }

  getAllRoom(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/chat/getAllRoom");
  }
  
  createRoom(channel: string, password: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.httpService.getUserId().subscribe((response: any) => {
        if (response) {
          const room = {
            channel: channel,
            password: password,
            userId: response.UserId,
          };
          this.socket.emit('newRoom', room);
          observer.next(true);
        } else {
          console.error("Error receiving username");
          observer.next(false);
        }
        observer.complete();
      });
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
