import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from "../room_service/create-room/create-room.component";
import { JoinRoomComponent } from "../room_service/join-room/join-room.component";
import { ChatService, Participant } from '../../../services/chat.service';
import {Observable, of} from 'rxjs';
import { HttpService } from '../../../http.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.css']
})
export class ChatLobbyComponent {

  constructor(private chatService: ChatService, private httpService: HttpService, private dialog: MatDialog, private jwtHelper: JwtHelperService, private router: Router) {}

  ngOnInit() {
	if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
    this.httpService.updateUserStatus('offline');
    this.router.navigate(['/login']);
  }
  }

  getMyUser(userID: number): Observable<Participant> {
    return new Observable<Participant>(observer => {
      var username: string = "";
      var pic: string = "";

      this.chatService.getUsername(userID).subscribe((response1: any) => {
        if (response1) {
          username = response1.Username;
          
          this.chatService.getPic(userID).subscribe((response2: any) => {
            if (response2) {
              pic = response2.Img;
      
              this.chatService.getStatus(userID).subscribe((response3: any) => {
                if (response3) {
                  if (response3.Status == "online") {
                    observer.next({
                      userId: userID,
                      username: username,
                      avatar: pic,
                      status: "../../../assets/images/Button-Blank-Green-icon.png",
                    } as Participant);
                  } else {
                    observer.next({
                      userId: userID,
                      username: username,
                      avatar: pic,
                      status: "../../../assets/images/Button-Blank-Red-icon.png",
                    } as Participant);
                  }
                }
                observer.complete();
              });
            }
          });
        }
      });
    });

  }

  openDataJoinRoom() {
    const dialogRef = this.dialog.open(JoinRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.name) {
          const name = result.name;
          const password = result.password;
          
          this.chatService.joinRoom(name, password).subscribe(result2 => {
            if (result2) {

              this.httpService.getUserId().subscribe((response: any) => {
                if (response) {
                  const myUserId = response.UserId;
                  
                  this.getMyUser(myUserId).subscribe((result3) => {
                    if (result3) {
                      this.chatService.participate(name, result3);
                      this.router.navigate(['/chat']);
                    }
                  });
                }
              });
            } else {
              console.error("Error while joining the room");
            }
          });
        }
      }
    });
  }

  openDataCreateRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.name) {
          const name = result.name;
          const password = result.password;
          this.chatService.createRoom(name, password).subscribe(result2 => {
            if (result2) {
              this.router.navigate(['/chat']);
            } else {
              console.error("Error while creating the room");
            }
          });
        
        }
        else
          alert("Channel can't be NULL");
      }
    });
  }
}
