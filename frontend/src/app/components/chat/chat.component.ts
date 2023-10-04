
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { KickComponent } from '../chat/room_service/kick/kick.component';
import { BanComponent } from '../chat/room_service/ban/ban.component';
import { MuteComponent } from '../chat/room_service/mute/mute.component';
import { SetPasswordComponent } from '../chat/room_service/set-password/set-password.component';
import { ChatService } from '../../services/chat.service';
import { CreateRoomComponent } from "./room_service/create-room/create-room.component";
import { JoinRoomComponent } from "./room_service/join-room/join-room.component";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from '../../http.service';

export interface Participant {
  userId: number;
  username: string;
  avatar: string;
  status: string;
}

export interface MessageEvent {
  socketId: string;
  roomId: string;
  username: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // Définissez une variable pour garder un compte des divs ajoutées
  roomCount: number = 0;
  users: Participant[] = [];
  messages: MessageEvent[] = [];
  myUserId: number = 0;

  constructor(private dialog: MatDialog, private chatService: ChatService, private httpService: HttpService, private router: Router, private jwtHelper: JwtHelperService) {}

  ngOnInit() {
    // if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
      // this.router.navigate(['/login']);
    var ok: boolean;

    this.httpService.getUserId().subscribe((response: any) => {
      if (response) {
        this.myUserId = response.UserId;
      }
    });

    
    this.chatService.getAllRoom().subscribe((Response) => {
      if (Response) {
        var i = 0;
        while (Response[i]) {
          ok = false;
          var j = 0;
          while (Response[i].participants[j]) {
            if (Response[i].participants[j] == this.myUserId) {
              ok = true;
            }
            j++;
          }
          if (ok) {
            this.addRoom(Response[i].roomId);
          }
          i++;
        }
      } else {
        console.error("Error while retreiving all Rooms");
      }
    });
  }

 //  <button class="close-button">
 //    <div class="close-icon">&#10006;</div>
 //  </button>

  // Fonction pour ajouter une nouvelle div
  addRoom(roomId: string) {
    this.roomCount++;
    const newDiv = document.createElement('div');
    newDiv.textContent = roomId;
    
    // Ajoutez la classe "room-item" à la nouvelle div
    newDiv.classList.add('room-item');

    // Ajoutez un gestionnaire d'événement de clic à la div
    newDiv.addEventListener('click', () => {

      this.removeAllUser();

      this.chatService.getAllParticipants(roomId).subscribe((Response: Array<number>) => {
        if (Response) {
          var i = 0;
          while ( Response[i] ) {
            this.addUser(Response[i]);
            i++;
          }
        }
      });

    });
    // Ajoutez la nouvelle div à la classe .all_room_name
    const allRoomName = document.querySelector('.all_room_name');
    if (allRoomName) {
      allRoomName.appendChild(newDiv);
    }
  }

  removeAllUser() {
    var i = 0;

    this.users.pop();
    while (this.users[i]) {
      this.users.pop();
      i++;
    }
  }
  
  addUser(userID: number) {

    var ok: boolean = true;

    var i = 0;
    while (this.users[i]) {
      if (this.users[i].userId == userID) {
        ok = false;
        break;
      }
      i++;
    }

    if (!ok)
      return;

    var status: boolean;
    var username: string;
    var pic: string;

    this.chatService.getUsername(userID).subscribe((response1: any) => {
      if (response1) {
        username = response1.Username;
        
        this.chatService.getPic(userID).subscribe((response2: any) => {
          if (response2) {
            pic = response2.Img;
    
            this.chatService.getStatus(userID).subscribe((response3: any) => {
              if (response3) {
                if (response3.Status == "online") {
                  this.users.push({
                    userId: userID,
                    username: username,
                    avatar: pic,
                    status: "../../../assets/images/Button-Blank-Green-icon.png",
                  });
                } else {
                  this.users.push({
                    userId: userID,
                    username: username,
                    avatar: pic,
                    status: "../../../assets/images/Button-Blank-Red-icon.png",
                  });
                }
              }
            });
          }
        });
      }
    });
    
  
  }
    
  
  openDataKick() {
    const dialogRef = this.dialog.open(KickComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;
        console.log(name);
        // this.chatService.kick();
      }
    });
  }

  openDataJoinRoom() {
    const dialogRef = this.dialog.open(JoinRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        const name = result.name;
        const password = result.password;
        this.chatService.joinRoom(name, password).subscribe(result2 => {
          if (result2) {
            // Opération réussie, utilisez la valeur ici
            this.addRoom(name);
          } else {
            // Opération échouée
          }
        });
      }
    });
  }

  openDataCreateRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        const name = result.name;
        const password = result.password;
        this.chatService.createRoom(name, password);
        this.addRoom(name);
      }
      else
        alert("Channel can't be NULL");
    });
  }

  viewProfilUser(id: number) {
    this.router.navigate(['/friendProfile', id.toString()]);
  }
}
