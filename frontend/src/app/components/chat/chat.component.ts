import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { KickComponent } from '../chat/room_service/kick/kick.component';
import { BanComponent } from '../chat/room_service/ban/ban.component';
import { MuteComponent } from '../chat/room_service/mute/mute.component';
import { SetPasswordComponent } from '../chat/room_service/set-password/set-password.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // Définissez une variable pour garder un compte des divs ajoutées
  roomCount: number = 0;
  users: string[] = [];

  constructor(private dialog: MatDialog) {}

  // Fonction pour ajouter une nouvelle div
  addRoom() {
    this.roomCount++;
    const newDiv = document.createElement('div');
    newDiv.textContent = `Room ${this.roomCount}`;
    
    // Ajoutez la classe "room-item" à la nouvelle div
    newDiv.classList.add('room-item');
    
    // Ajoutez la nouvelle div à la classe .all_room_name
    const allRoomName = document.querySelector('.all_room_name');
    if (allRoomName) {
      allRoomName.appendChild(newDiv);
    }
  }
  
  addUser() {

    
    this.users.push("ksncjelopsmr");

    // const contenuHTML = `
    //   <div class="avatar_on_off">
    //     <div class="avatar_user">
    //       <img class="img_meter" src="https://icons.iconarchive.com/icons/iconarchive/dog-breed/256/Bernese-Mountain-Dog-icon.png" alt="avatar">
    //     </div>
    //     <div class="online_offline">
    //         <img src="https://icons.iconarchive.com/icons/hopstarter/soft-scraps/16/Button-Blank-Green-icon.png" alt="">
    //     </div>
    //   </div>
    //   <div class="name_user">
    //       <p>Luserbghkjokoku</p>
    //   </div>
    //   <div class="sidebar_user">
    //   </div>
    // `;
    // const newDiv = document.createElement('div');
    // newDiv.classList.add('room-avatar'); // Assurez-vous d'utiliser la même classe que dans le contenu HTML
    // newDiv.innerHTML = contenuHTML;
  
    // // Ajoutez la nouvelle div à la classe .column_user (vous avez utilisé ".column_user" au lieu de ".column_user" dans votre code)
    // const columnUser = document.querySelector('#column_user');
    // if (columnUser) {
    //   columnUser.appendChild(newDiv);
    // }
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

}
