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


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // Définissez une variable pour garder un compte des divs ajoutées
  roomCount: number = 0;
  users: string[] = [];

  constructor(private dialog: MatDialog, private chatService: ChatService, private router: Router) {}

  ngOnInit() {
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
    const index = this.users.indexOf(pseudo);
    if (!(index > -1))
      this.users.push(pseudo);
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

}
