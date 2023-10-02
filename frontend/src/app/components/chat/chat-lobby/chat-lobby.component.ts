import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from "../room_service/create-room/create-room.component";

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.css']
})
export class ChatLobbyComponent {
  
  constructor(private dialog: MatDialog) {}

  openDataJoinRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
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
      if (result) {
        /*Ici tu recuperes la data que tu as save (result)*/
      }
    });
  }
}
