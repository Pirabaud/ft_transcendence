import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";


export interface MessageEventDto {
  socketId: string;
  roomId: string;
  username: string;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  dataArray: any[] = [];
  // private apiUrl = 'http://localhost:3000/api';

  constructor(private socket: Socket, private http: HttpClient) {

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

  createRoom(): void { 
      this.socket.emit('room'); // Émet l'événement WebSocket
      // this.socket.fromEvent('roomResponse').subscribe((data) => {
      //   observer.next(data); // Émet les données reçues à l'observateur
      //   observer.complete(); // Termine l'Observable lorsque c'est nécessaire
      // });

      // Gérer les erreurs ici si nécessaire
  }
  
  getAllMessage(): MessageEventDto[] {
    this.socket.fromEvent('fill data').subscribe((data: any) => {
      this.dataArray = data;
      console.log('Tableau reçu du serveur :', this.dataArray);
    })
    return this.dataArray;
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
