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

  kick(roomId: string, userId: number) {
    const room = {
      roomID: roomId,
      userID: userId,
    }
    this.socket.emit('kick', room);
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
          this.socket.emit('newRoom', room, (response: any) => {
            if (response == -1) {
            alert("This room already exist!");
            observer.next(false);
            observer.complete();
          } else if (response == 42) {
            observer.next(true);
            observer.complete();
            }
          });
        } else {
          console.error("Error receiving username");
          observer.next(false);
          observer.complete();
        }
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

  kickRoom(channel: string, userId: number): Observable<any> {
    const room = {
      channel: channel,
      user: userId,
    };
    return new Observable<any>((observer) => {
      this.socket.emit('leaveRoom', room, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  async addAdmin(admin: number, roomId: string) {
    const room = {
      user: admin,
      id: roomId,
    };
    this.socket.emit('addAdmin', room, (response: any) => {
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
    this.socket.emit('removeAdmin', room, (response: any) => {
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
  
  getAdmin(admin: number, roomId: string): Observable<any> {
    const room = {
      user: admin,
      id: roomId,
    };
  
    return new Observable<any>((observer) => {
      this.socket.emit('getAdmin', room, (response: any) => {
        observer.next(response);
        observer.complete();
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
