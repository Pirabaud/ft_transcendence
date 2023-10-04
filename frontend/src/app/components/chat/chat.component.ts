
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

export interface Participant {
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

  constructor(private dialog: MatDialog, private chatService: ChatService, private router: Router, private jwtHelper: JwtHelperService) {}

  ngOnInit() {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
      this.router.navigate(['/login']);
    this.chatService.getAllRoom().subscribe((Response) => {
      if (Response) {
        var i = 0;
        while (Response[i]) {
          this.addRoom(Response[i].roomId);
          i++;
        }
      } else {
        console.error("Error while retreiving all Rooms");
      }
    });
  }

  // Fonction pour ajouter une nouvelle div
  addRoom(roomId: string) {
    this.roomCount++;
    const newDiv = document.createElement('div');
    newDiv.textContent = roomId;
    
    // Ajoutez la classe "room-item" à la nouvelle div
    newDiv.classList.add('room-item');

    // Ajoutez un gestionnaire d'événement de clic à la div
    newDiv.addEventListener('click', () => {

      this.chatService.getAllParticipants(roomId).subscribe((Response: Array<string>) => {
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
  
  addUser(pseudo: string) {

    var ok: boolean = true;
    var i = 0;
    while (this.users[i]) {
      if (this.users[i].username == pseudo) {
        ok = false;
        break;
      }
      i++;
    }

    if (!ok)
      return;
  
    var status: boolean;
    
    this.chatService.getPic(pseudo).subscribe((response1: any) => {
      if (response1) {
        const pic: string = response1.Img;

        this.chatService.getStatus(pseudo).subscribe((response2: any) => {
          if (response2) {
            if (response2.Status == "online") {
              this.users.push({
                username: pseudo,
                avatar: pic,
                status: "../../../assets/images/Button-Blank-Green-icon.png",
              });
            } else {
              this.users.push({
                username: pseudo,
                avatar: pic,
                status: "../../../assets/images/Button-Blank-Red-icon.png", // A REMPLACER PAR UNE ICONE ROUGE
              });
            }
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
        /*Ici tu recuperes la data que tu as save (result)*/
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

  viewProfilUser() {
    this.router.navigate(['/friendProfile']);
  }
}
