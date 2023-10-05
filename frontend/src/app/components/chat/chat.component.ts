import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KickComponent } from '../chat/room_service/kick/kick.component';
import { BanComponent } from '../chat/room_service/ban/ban.component';
import { MuteComponent } from '../chat/room_service/mute/mute.component';
import { SetPasswordComponent } from '../chat/room_service/set-password/set-password.component';
import { ChatService, Participant, MessageEvent } from '../../services/chat.service';
import { CreateRoomComponent } from "./room_service/create-room/create-room.component";
import { JoinRoomComponent } from "./room_service/join-room/join-room.component";
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
import {Observable, of} from 'rxjs';
import { AddAdminComponent } from './room_service/add-admin/add-admin.component';
import { RemoveAdminComponent } from './room_service/remove-admin/remove-admin.component';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  public myUserId: number = 0;
  public users: Participant[] = [];
  public messages: MessageEvent[] = [];
  public currentRoomId: string = "";
  public settingsVisible = false;
  public boutonsAdminVisible: any = false;
  public messageContent = '';

  constructor(private dialog: MatDialog, private chatService: ChatService, private httpService: HttpService, private router: Router) {}

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
  
  addRoom(roomId: string) {
    const newDiv = document.createElement('div');
    newDiv.textContent = roomId;
    
    newDiv.classList.add('room-item');
    
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

      this.chatService.getAdmin(this.myUserId, this.currentRoomId).subscribe((response) => {
        console.log(response);
        if (response) {
          this.boutonsAdminVisible = response.ok;
        }
      });

    });
    
    const allRoomName = document.querySelector('.all_room_name');
    if (allRoomName) {
      allRoomName.appendChild(newDiv);
    }
    
    this.initConnection(roomId);
  }

  private initConnection(roomID: string) {
    this.chatService.receiveEvent(roomID).subscribe((message: MessageEvent) => {
      this.messages.push(message);
    });
    this.chatService.receiveEvent(`participant/${roomID}`).subscribe((participant: Participant) => {
      if (participant.userId != this.myUserId && this.currentRoomId == roomID) {
        this.users.push(participant);
      }
    });
    this.chatService.receiveEvent(`leave/${roomID}`).subscribe((userId: number) => {
      if (userId != this.myUserId && this.currentRoomId == roomID) {
        var i = 0;
        while (this.users[i]) {
          if (this.users[i].userId == userId) {
            this.users.pop();
          }
          i++;
        }
      }
    });
    this.chatService.receiveEvent(`kick/${roomID}`).subscribe((userId: number) => {
      if (this.currentRoomId == roomID) {
        var i = 0;
        while (this.users[i]) {
          if (this.users[i].userId == userId) {
            this.users.pop();
          }
          i++;
        }
      }
      if (this.myUserId == userId) {
        this.removeAllUser();
        const roomItems = document.querySelectorAll('.room-item');
        var j = 0;
        roomItems.forEach((div) => {
          if (div.textContent == roomID) {
              div.remove();
          }
          j++;
        });
        const divChannelName = document.querySelector(".channel_name");
        if (divChannelName) {
          const paragraphe = divChannelName.querySelector("p");
          if (paragraphe) {
            paragraphe.textContent = "";
          } else {
            console.error("Paragraphe introuvable dans le div.");
          }
        } else {
          console.error("Div avec la classe 'channel_name' introuvable.");
        }
        this.currentRoomId = "";
        this.settingsVisible = false;
        if (j == 1) {
          this.router.navigate(['chat-lobby']);
        }
      }
    });
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
    this.chatService.kickRoom(this.currentRoomId, this.myUserId).subscribe((response: any) => {
      if (response) {
        if (response.ok == true) {
          alert("This user leave the room " + this.currentRoomId);
        } else if (response.ok == false) {
          alert("This user leave the room " + this.currentRoomId + " and this room has been deleted");
        }
      }
    });
    
    this.chatService.leave(this.currentRoomId, this.myUserId);

    this.removeAllUser();
    
    const roomItems = document.querySelectorAll('.room-item');
    var i = 0;
    roomItems.forEach((div) => {
      if (div.textContent === this.currentRoomId) {
        div.remove();
      }
      i++;
    });

    const divChannelName = document.querySelector(".channel_name");
      
    if (divChannelName) {
      const paragraphe = divChannelName.querySelector("p");

      if (paragraphe) {
        paragraphe.textContent = "";
      } else {
        console.error("Paragraphe introuvable dans le div.");
      }
      
    } else {
      console.error("Div avec la classe 'channel_name' introuvable.");
    }
    this.currentRoomId = "";
    this.settingsVisible = false;

    if (i == 1) {
      this.router.navigate(['chat-lobby']);
    }
  }
  
  async openDataKick() {
    const dialogRef = this.dialog.open(KickComponent, {
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

            if (UserId != this.myUserId) {
              
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
                    
                    this.chatService.kickRoom(this.currentRoomId, UserId).subscribe((response2: any) => {
                      if (response2) {
                        if (response2.ok == true) {
                          alert("The user " + name + " has been kicked from the room " + this.currentRoomId);
                        } else if (response2.ok == false) {
                          alert("The user " + name + " has been kicked from the room " + this.currentRoomId + " and this room has been deleted");
                        }
                        
                        this.chatService.kick(this.currentRoomId, UserId);
                      
                        // this.removeAllUser();
                        
                        // this.chatService.getAllParticipants(this.currentRoomId).subscribe((Response: Array<number>) => {
                        //   if (Response) {
                        //     var i = 0;
                        //     while ( Response[i] ) {
                        //       this.addUser(Response[i]);
                        //       i++;
                        //     }
                        //   } else {console.log("error3")}
                        // });

                      }
                    });
                    
                  } else {
                    alert("This user isn't in the room!")
                  }
                } else {console.log("error2")}
              });
            
            } else {
              alert("You can't kick yourself!");
            }

          } else {
            alert("This user doesn't exist!");
          }
        });


      } else {console.log("error1")}
    });
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
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        const name = result.name;
        const password = result.password;
        this.chatService.joinRoom(name, password).subscribe((result2) => {
          if (result2) {
            this.addRoom(name);

            this.getMyUser(this.myUserId).subscribe((result3) => {
              if (result3) {
                this.chatService.participate(name, result3);
              }
            });
          }
        });
      } else {
        alert("Channel can't be NULL");
      }
    });
  }

  openDataCreateRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        const name = result.name;
        const password = result.password;
        this.chatService.createRoom(name, password).subscribe((response) => {
          if (response) {
            this.addRoom(name);
          }
        });
      }
      else
        alert("Channel can't be NULL");
    });
  }

 sendMessage(): void {
  if (this.messageContent.trim().length === 0) {
    return;
  }
  
  var i = 0;
  while (this.users[i]) {
    if (this.users[i].userId == this.myUserId) {
      const user: Participant = this.users[i];
      const message = {
        roomId: this.currentRoomId,
        user: user,
        content: this.messageContent,
        createdAt: new Date()
      } as MessageEvent;
      
      this.chatService.sendMessage(message);
      this.messageContent = '';
    }
    i++;
  }
 }

  viewProfilUser(id: number) {
    this.router.navigate(['/friendProfile', id.toString()]);
  }
  
  openDataRemoveAdmin() {
    const dialogRef = this.dialog.open(RemoveAdminComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      const name = result.name;

      this.chatService.getUserId(name).subscribe((response1: any) => {
        if (response1) {
          var UserId = response1.id;
        }
        if (UserId == this.myUserId) {
          alert("impossible to remove the admin yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
        } else if (UserId) {
          const name = UserId;
          this.chatService.removeAdmin(name, this.currentRoomId);
          // console.log("request : " + rep);
          // if (!rep) {
          //   alert('Room');
          // } else if (rep == 1) {
          //   alert(name + " : is already admin !");
          // } else if (rep == 2) {
          //   alert(name + " : is not in the room !");
          // } else if (rep == 3) {
          //   alert(name + " : is the channel owner !");
          // }else {
          //   alert(name + " : is admin !");
          // }
        } else {
          alert("Write anything my Brother !");
        }
  
        });
    });

  }

  openDataAddAdmin() {
    const dialogRef = this.dialog.open(AddAdminComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {

      console.log("1 : " + result.name);
      const name = result.name;

      this.chatService.getUserId(name).subscribe((response1: any) => {
        if (response1) {
          var UserId = response1.id;
        }
        if (UserId == this.myUserId) {
          alert("You are already admin !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
        } if (UserId) {
          const name = UserId;
          this.chatService.addAdmin(name, this.currentRoomId);
          // console.log("request : " + rep);
          // if (!rep) {
          //   alert('Room');
          // } else if (rep == 1) {
          //   alert(name + " : is already admin !");
          // } else if (rep == 2) {
          //   alert(name + " : is not in the room !");
          // } else if (rep == 3) {
          //   alert(name + " : is the channel owner !");
          // }else {
          //   alert(name + " : is admin !");
          // }
        } else {
          alert("Write anything my Brother !");
        }
  
        });
      });

  }
}
