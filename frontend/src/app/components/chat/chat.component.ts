
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { KickComponent } from '../chat/room_service/kick/kick.component';
import { BanComponent } from '../chat/room_service/ban/ban.component';
import { MuteComponent } from '../chat/room_service/mute/mute.component';
import { SetPasswordComponent } from '../chat/room_service/set-password/set-password.component';
import { ChatService, MessageEventDto } from '../../services/chat.service';
import { CreateRoomComponent } from "./room_service/create-room/create-room.component";
import { JoinRoomComponent } from "./room_service/join-room/join-room.component";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from '../../http.service';

export interface Participant {
  userId: number;
  username: string;
  avatar: string;
  status: string,
}

interface SimpleParticipant {
  avatar: string;
  connected: string;
}

interface ParticipantEvent extends SimpleParticipant{
  username: string;
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
  myUserId: number = 0;
  currentRoomId: string = "";
  settingsVisible = false;
  boutonsAdminVisible = true;
  
  // chat
  public connected = false;
  public username = '';
  public avatar = '';
  public messages: MessageEventDto[] = [];
  public userAvatarsMap = new Map<string, SimpleParticipant>();
  public messageContent = '';

  constructor(private dialog: MatDialog, private chatService: ChatService, private httpService: HttpService, private router: Router, private jwtHelper: JwtHelperService) {}

  ngOnInit() {
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

  // private initConnection(messages: MessageEventDto[], roomID: string) {
  //   console.log("caca");

  //   var username: string = "";
  //   var pic: string = "";

  //   this.chatService.getUsername(this.myUserId).subscribe((response1: any) => {
  //     if (response1) {
  //       username = response1.Username;

  //       this.chatService.getPic(this.myUserId).subscribe((response2: any) => {
  //         if (response2) {
  //           pic = response2.Img;

  //           this.messages = messages
  //           this.chatService.participate(roomID, username, pic);
  //           this.chatService.receiveEvent(roomID).subscribe((message: MessageEventDto) => {
  //             console.debug('received message event: ', message);
  //             this.messages.push(message)
  //           });
  //           this.chatService.receiveEvent(`participants/${roomID}`).subscribe((participants: ParticipantEvent[]) => {
  //             console.debug('received participants event: ', participants);
  //             this.userAvatarsMap = this.toUserAvatarsMap(participants);
  //           });
  //           this.connected = true;

  //         }
  //       });
  //     }
  //   });  
  // }

  // private toUserAvatarsMap(participants: ParticipantEvent[]): Map<string, SimpleParticipant> {
  //   const mp = new Map<string, SimpleParticipant>();
  //   participants.forEach(p => mp.set(p.username, {avatar: p.avatar, connected: p.connected}));
  //   return mp;
  // }

  // Fonction pour ajouter une nouvelle div
  addRoom(roomId: string) {
    this.roomCount++;
    const newDiv = document.createElement('div');
    newDiv.textContent = roomId;
    
    // Ajoutez la classe "room-item" à la nouvelle div
    newDiv.classList.add('room-item');

    // Ajoutez un gestionnaire d'événement de clic à la div
    newDiv.addEventListener('click', () => {

      this.currentRoomId = roomId;

      this.settingsVisible = true;

      const divChannelName = document.querySelector(".channel_name");

      if (divChannelName) {
        const paragraphe = divChannelName.querySelector("p");

        if (paragraphe) {
          paragraphe.textContent = roomId;
        } else {
          console.error("Paragraphe introuvable dans le div.");
        }

      } else {
        console.error("Div avec la classe 'channel_name' introuvable.");
      }

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

    // this.initConnection(this.messages, roomId);
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

  leaveRoom() {
    this.chatService.leaveRoom(this.currentRoomId, this.myUserId);

    this.removeAllUser();

    const roomItems = document.querySelectorAll('.room-item');

    roomItems.forEach((div) => {
      if (div.textContent === this.currentRoomId) {
        div.remove();
      }
    });
  }
  
  async openDataKick() {
    const dialogRef = this.dialog.open(KickComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '300px',
    });

    await dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;
        var UserId: number;
        var ok: boolean = false;

        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            UserId = response1.id;

            this.chatService.getAllParticipants(this.currentRoomId).subscribe((Response: Array<number>) => {
              if (Response) {
                var i = 0;
                while ( Response[i] ) {
                  if (Response[i] == UserId) {
                    ok = true;
                  }
                  i++;
                }

                if (ok) {

                  this.chatService.kickRoom(this.currentRoomId, UserId);
                  alert("The user " + name + " has been kicked from the room " + this.currentRoomId);
                
                  this.removeAllUser();

                  this.chatService.getAllParticipants(this.currentRoomId).subscribe((Response: Array<number>) => {
                    if (Response) {
                      var i = 0;
                      while ( Response[i] ) {
                        this.addUser(Response[i]);
                        i++;
                      }
                    } else {console.log("error3")}
                  });
                
                } else {
                  alert("This user isn't in the room!")
                }
              } else {console.log("error2")}
            });

          } else {
            alert("This user doesn't exist!");
          }
        });


      } else {console.log("error1")}
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

 sendMessage(): void {
  if (this.messageContent.trim().length === 0) {
    return;
  }
  var username: string = "";

  this.chatService.getUsername(this.myUserId).subscribe((response1: any) => {
    if (response1) {
      username = response1.Username;
      
      const message = {
        roomId: this.currentRoomId,
        username: username,
        content: this.messageContent,
        createdAt: new Date()
      } as MessageEventDto;
    
      console.log("MESSAGE:", message);
      this.messages.push(message);
      this.chatService.sendMessage(message);
      this.messageContent = '';
    }
  });

 }

  viewProfilUser(id: number) {
    this.router.navigate(['/friendProfile', id.toString()]);
  }
}
