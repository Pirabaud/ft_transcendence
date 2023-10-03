import { Component } from '@angular/core';
// import {HttpClient} from "@angular/common/http";
// import {Socket} from 'ngx-socket-io';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from "../room_service/create-room/create-room.component";
import { JoinRoomComponent } from "../room_service/join-room/join-room.component";
import { ChatService } from "../../../services/chat.service"

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.css']
})
export class ChatLobbyComponent {
  
  constructor(private chatService: ChatService, private dialog: MatDialog, private router: Router) {}

  openDataJoinRoom() {
    const dialogRef = this.dialog.open(JoinRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        console.log(result.name);
        console.log(result.password);
        /*Ici tu recuperes la data que tu as save (result)*/
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
        this.router.navigate(['/chat']);
        // console.log(result);
        /*Ici tu recuperes la data que tu as save (result)*/
      }
      else
        alert("Channel can't be NULL");
    });
  }
}
