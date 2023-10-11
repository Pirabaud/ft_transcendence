import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KickComponent } from '../chat/room_service/kick/kick.component';
import { BanComponent } from '../chat/room_service/ban/ban.component';
import { MuteComponent } from '../chat/room_service/mute/mute.component';
import { UnmuteComponent } from './room_service/unmute/unmute.component';
import { ClassicGameComponent } from './user_service/classic-game/classic-game.component'
import { PortalGameComponent } from './user_service/portal-game/portal-game.component'
import { SetPasswordComponent } from '../chat/room_service/set-password/set-password.component';
import { ChatService, Participant, MessageEvent, Visible } from '../../services/chat.service';
import { CreateRoomComponent } from "./room_service/create-room/create-room.component";
import { JoinRoomComponent } from "./room_service/join-room/join-room.component";
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
import {Observable, Subscription} from 'rxjs';
import { AddAdminComponent } from './room_service/add-admin/add-admin.component';
import { RemoveAdminComponent } from './room_service/remove-admin/remove-admin.component';
import { UnbanComponent } from './room_service/unban/unban.component';
import { v4 as uuidv4 } from "uuid";
import { GameService } from "../../services/game.service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  myUserId: number = 0;
  users: Participant[] = [];
  messages: MessageEvent[] = [];
  currentRoomId: string = "";
  settingsVisible = false;
  boutonsAdminVisible: any = false;
  messageContent = '';
  ReceivePrivateClassicGameSubscription: Subscription;
  ReceivePrivatePortalGameSubscription: Subscription;
  ReceiveRefusePrivateGameSubscription: Subscription;
  ReceiveAcceptPrivateGameSubscription: Subscription;
  ReceiveKickSubscription: Subscription;
  ReceivePrivateMessageSubscription: Subscription;
  ReceiveParticipateSubscription: Subscription;
  ReceiveLeaveSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private chatService: ChatService,
              private httpService: HttpService,
              private jwtHelper: JwtHelperService,
              private router: Router,
              private gameService: GameService) {}

  ngOnInit() {
	if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
    this.httpService.updateUserStatus('offline');
    this.router.navigate(['/login']);
  }

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
        this.initConnection2();
      } else {
        console.error("Error while retreiving all Rooms");
      }
    });
  }

  ngOnDestroy() {
    if (this.ReceivePrivateClassicGameSubscription) {
      this.ReceivePrivateClassicGameSubscription.unsubscribe();
    }
    if (this.ReceivePrivatePortalGameSubscription) {
      this.ReceivePrivatePortalGameSubscription.unsubscribe();
    }
    if (this.ReceiveRefusePrivateGameSubscription) {
      this.ReceiveRefusePrivateGameSubscription.unsubscribe();
    }
    if (this.ReceiveAcceptPrivateGameSubscription) {
      this.ReceiveAcceptPrivateGameSubscription.unsubscribe();
    }
    if (this.ReceiveKickSubscription) {
      this.ReceiveKickSubscription.unsubscribe();
    }
    if (this.ReceivePrivateMessageSubscription) {
      this.ReceivePrivateMessageSubscription.unsubscribe();
    }
    if (this.ReceiveParticipateSubscription) {
      this.ReceiveParticipateSubscription.unsubscribe();
    }
    if (this.ReceiveLeaveSubscription) {
      this.ReceiveLeaveSubscription.unsubscribe();
    }
  }

  private initConnection2() {
    this.ReceivePrivateMessageSubscription = this.chatService.receiveEvent(`receive-private-message`).subscribe((room: any) => this.ReceivePrivateMessage(room));

    this.ReceivePrivateClassicGameSubscription = this.chatService.receiveEvent(`receive-private-classic-game`).subscribe((room: any) => this.ReceivePrivateClassicGame(room));

    this.ReceivePrivatePortalGameSubscription = this.chatService.receiveEvent(`receive-private-portal-game`).subscribe((room: any) => this.ReceivePrivatePortalGame(room));

    this.ReceiveRefusePrivateGameSubscription = this.chatService.receiveEvent(`receive-refuse-private-game`).subscribe((room: any) => this.ReceiveRefusePrivateGame(room));

    this.ReceiveAcceptPrivateGameSubscription = this.chatService.receiveEvent(`receive-accept-private-game`).subscribe((room: any) => this.ReceiveAcceptPrivateGame(room));

    this.ReceiveKickSubscription = this.chatService.receiveEvent(`receive-kick`).subscribe((room: any) => this.receiveKick(room.roomID, room.userID));
  }

  ReceivePrivateMessage(room: any) {
    if (room.userID == this.myUserId) {
      this.addRoom(room.roomID);
    }
  }

  ReceivePrivateClassicGame(room: any) {
    if (room.userID == this.myUserId) {
      const dialogRef = this.dialog.open(ClassicGameComponent, {
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const data = result.YesOrNo;
          const otherUserId = room.otherUserID;
          
          if (data == true) {
            this.createPrivateGame(0, otherUserId, 1);
            this.chatService.acceptPrivateGame("classic", otherUserId);
          } else if (data == false) {
            this.chatService.refusePrivateGame("classic", otherUserId);
          }
        }
      });
    }
  }

  ReceivePrivatePortalGame(room: any) {
    if (room.userID == this.myUserId) {
      const dialogRef = this.dialog.open(PortalGameComponent, {
        width: '400px',
      });
      
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const data = result.YesOrNo;
          const otherUserId = room.otherUserID;
          
          if (data == true) {
            this.createPrivateGame(1, otherUserId, 1);
            this.chatService.acceptPrivateGame("portal", otherUserId);
          } else if (data == false) {
            this.chatService.refusePrivateGame("portal", otherUserId);
          }
        }
      });
    }
  }

  ReceiveRefusePrivateGame(room: any) {
    if (room.userID == this.myUserId) {
      alert("Your private request for a " + room.type + " game has been declined");
    }
  }

  ReceiveAcceptPrivateGame(room: any) {
    if (room.userID == this.myUserId) {
      if (room.type == "classic") {
        setTimeout(() => {
          this.createPrivateGame(0, this.myUserId, 2);
        }, 100);
      } else if (room.type == "portal") {
        setTimeout(() => {
          this.createPrivateGame(1, this.myUserId, 2);
        }, 100);
      }
    }
  }

  receiveKick(roomID: string, userId: number) {
    if (userId != this.myUserId && this.currentRoomId == roomID) {
      var j = 0;
      while (this.users[j]) {
        if (this.users[j].userId == userId) {
          this.users.pop();
        }
        j++;
      }
    }
    if (this.myUserId == userId) {
      var RoomId = "";
      this.chatService.IsPrivateRoom(roomID).subscribe((Response2: any) => {
        if (Response2) {
          var roomId = roomID;
          var TabUsersID = roomId.split('/', 2);
          var myUserId = this.myUserId.toString();
          var i = 0;
          if (TabUsersID[0] == myUserId) {
            i = 1;
          }
          const otherUserId = parseInt(TabUsersID[i], 10);
          this.chatService.getUsername(otherUserId).subscribe((Response3: any) => {
            if (Response3) {
              RoomId = Response3.Username;
              this.removeAllUser();
              this.messages = [];
              const roomItems = document.querySelectorAll('.room-item');
              roomItems.forEach((div) => {
                if (div.textContent == RoomId) {
                    div.remove();
                }
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
              if (roomItems.length == 1) {
                this.router.navigate(['chat-lobby']);
              }
              alert("You have been kicked from the private room with " + RoomId);
            }
          });

        } else {
            RoomId = roomID;
            this.removeAllUser();
            this.messages = [];
            const roomItems = document.querySelectorAll('.room-item');
            roomItems.forEach((div) => {
              if (div.textContent == RoomId) {
                div.remove();
              }
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
          if (roomItems.length == 1) {
            this.router.navigate(['chat-lobby']);
          }
          alert("You have been kicked from the room " + RoomId);
        }
      });
    }
  }

  addRoom2(roomId: string, roomName: string, p: boolean) {
    var ok: boolean = true;
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach((div) => {
      if (div.textContent === roomName) {
        ok = false;
      }
    });
    if (ok) {
      const newDiv = document.createElement('div');
      newDiv.textContent = roomName;
      if (p) {
        newDiv.style.backgroundColor = 'red';
      }
      newDiv.classList.add('room-item');

      newDiv.addEventListener('click', () => {
        this.currentRoomId = roomId;
        this.messages = [];
        this.settingsVisible = true;
        const divChannelName = document.querySelector(".channel_name");
        if (divChannelName) {
          const paragraphe = divChannelName.querySelector("p");
          if (paragraphe) {
            paragraphe.textContent = roomName;
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
            this.chatService.getAdmin(this.myUserId, this.currentRoomId).subscribe((response) => {
              if (response) {
                this.boutonsAdminVisible = response.ok;
                this.chatService.getMessages(roomId).subscribe((response2: MessageEvent[]) => {
                  if (response2) {
                    var j = 0;
                    while ( response2[j] ) {
                      this.messages.push(response2[j]);
                      this.sleep(100);
                      j++;
                    }
                  }
                });
              }
            });
          }
        });
      });

      const allRoomName = document.querySelector('.all_room_name');
      if (allRoomName) {
        allRoomName.appendChild(newDiv);
      }
      this.initConnection(roomId);
    }
  }

  addRoom(roomId: string) {
      var roomName = "";
      var p: boolean = false;

      this.chatService.IsPrivateRoom(roomId).subscribe((Response2: any) => {
      if (Response2) {
        p = true;
        var TabUsersID = roomId.split('/', 2);
        var myUserId = this.myUserId.toString();
        var i = 0;
        if (TabUsersID[0] == myUserId) {
          i = 1;
        }
        const otherUserId = parseInt(TabUsersID[i], 10);
        this.chatService.getUsername(otherUserId).subscribe((Response3: any) => {
          if (Response3) {
            roomName = Response3.Username;
            this.addRoom2(roomId, roomName, p);
          }
        });
      } else {
        roomName = roomId;
        this.addRoom2(roomId, roomName, p);
      }
    });
  }

  // Vérifie si le message a déjà été reçu
  private isMessageAlreadyReceived(message: MessageEvent): boolean {
    var i = 0;
    while (this.messages[i]) {
      i++;
    }
    if (i != 0) {
      const PreventMessageDate = this.messages[i - 1].createdAt;
      const CurrentMessageDate = message.createdAt;
      if (PreventMessageDate == CurrentMessageDate) {
        return true;
      }
    }
    return false;
  }

  ReceiveParticipate(participant: Participant, roomID: string) {
    if (participant.userId != this.myUserId && this.currentRoomId == roomID) {
      if (!participant.boutonVisible) {
        this.chatService.getVisibleButton(participant.userId, this.myUserId).subscribe((response: any) => {

          var boutonVisible: Visible = {userId: 0, privateMessage: true, classicGame: true, portalGame: true, block: true, unblock: false };
          
          if (response) {
            boutonVisible = response;
          }
          
          participant.boutonVisible = boutonVisible;
          this.users.push(participant);
      });
      } else {
        this.users.push(participant);
      }
    }
  }

  ReceiveLeave(userId: number, roomID: string) {
    if (userId != this.myUserId && this.currentRoomId == roomID) {
      var i = 0;
      while (this.users[i]) {
        if (this.users[i].userId == userId) {
          this.users.splice(i, 1);;
        }
        i++;
      }
    }
  }

  private initConnection(roomID: string) {

    this.chatService.receiveEvent(roomID).subscribe((message: MessageEvent) => {
      if (message.roomId == this.currentRoomId && !this.isMessageAlreadyReceived(message)) {
        this.messages.push(message);
        this.sleep(100);
      }
    });

    this.ReceiveParticipateSubscription = this.chatService.receiveEvent(`participant/${roomID}`).subscribe((participant: Participant) => this.ReceiveParticipate(participant, roomID));

    this.ReceiveLeaveSubscription = this.chatService.receiveEvent(`leave/${roomID}`).subscribe((userId: number) => this.ReceiveLeave(userId, roomID));

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
                this.chatService.getVisibleButton(userID, this.myUserId).subscribe((response: any) => {

                  var boutonVisible: Visible = {userId: 0, privateMessage: true, classicGame: true, portalGame: true, block: true, unblock: false };
                  
                  if (response) {
                    boutonVisible = response;
                  }
                  if (response3.Status == "online") {
                    this.users.push({
                      userId: userID,
                      username: username,
                      avatar: pic,
                      status: "../../../assets/images/Button-Blank-Green-icon.png",
                      boutonVisible: boutonVisible,
                    });
                  } else if (response3.Status == "in game") {
                    this.users.push({
                      userId: userID,
                      username: username,
                      avatar: pic,
                      status: "../../../assets/images/Button-Blank-Blue-icon.png",
                      boutonVisible: boutonVisible,
                    });
                  } else {
                    this.users.push({
                      userId: userID,
                      username: username,
                      avatar: pic,
                      status: "../../../assets/images/Button-Blank-Red-icon.png",
                      boutonVisible: boutonVisible,
                    });
                  }
                });
              }
            });
          }
        });
      }
    });


  }
  leaveRoom2(RoomId: string) {
    const roomItems = document.querySelectorAll('.room-item');
    var i = 0;
    roomItems.forEach((div) => {
      if (div.textContent === RoomId) {
        div.remove();
      }
      i++;
    });

    this.removeAllUser();

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

    if (roomItems.length == 1) {
      this.router.navigate(['chat-lobby']);
    }
  }

  leaveRoom() {
    this.chatService.kickRoom(this.currentRoomId, this.myUserId).subscribe((response: any) => {
      if (response) {
        if (response.ok == true) {
          this.chatService.leave(this.currentRoomId, this.myUserId);
          this.messages = [];
          var RoomId = "";
          var otherUserID: number = 0;
            this.chatService.IsPrivateRoom(this.currentRoomId).subscribe((Response2: any) => {
            if (Response2) {
              var i = 0;
              while (this.users[i]) {
                if (this.users[i].userId != this.myUserId) {
                  otherUserID = this.users[i].userId;
                  RoomId = this.users[i].username;
                  this.chatService.kickRoom(this.currentRoomId, otherUserID).subscribe((Response3: any) => {
                    if (Response3) {
                      this.chatService.kick(this.currentRoomId, otherUserID);
                      this.leaveRoom2(RoomId);
                    }
                  });
                }
                i++;
              }
            } else {
              RoomId = this.currentRoomId;
              this.leaveRoom2(RoomId);
            }
          });
        } else if (response.ok == false) {
          RoomId = this.currentRoomId;
          this.leaveRoom2(RoomId);
        }
      }
    });
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

                      }

                    });

                  } else {
                    alert("This user isn't in the room!")
                  }
                }
              });

            } else {
              alert("You can't kick yourself!");
            }

          } else {
            alert("This user doesn't exist!");
          }
        });

      }
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
      if (result) {
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
      }
    });
  }

  openDataCreateRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.name) {
          const name: string = result.name;
          const password: string = result.password;
          if (name.includes(" ") || name.includes("	") || password.includes(" ") || password.includes("	")) {
            alert("The channel name and the password can't contain spaces or tabs");
          } else {
            this.chatService.createRoom(name, password).subscribe((response) => {
              if (response) {
                this.addRoom(name);
              }
            });
          }
        }
        else
          alert("Channel can't be NULL");
      }
    });
  }

 sendMessage(): void {
  if (this.messageContent.trim().length === 0) {
    return;
  }
  if (this.currentRoomId == "") {
	  return;
  }

  this.chatService.IsPrivateRoom(this.currentRoomId).subscribe((Response2: any) => {
    if (Response2) {
      var otherUserID: number = 0;
      var otherUsername: string = "";
      var i = 0;
      while (this.users[i]) {
        if (this.users[i].userId != this.myUserId) {
          otherUserID = this.users[i].userId;
          otherUsername = this.users[i].username;
        }
        i++;
      }
      this.chatService.checkBlock(this.myUserId, otherUserID).subscribe((reponse) => {
        if (reponse) {
          alert("You have been blocked by : " + otherUsername);
        } else {


          this.chatService.checkMute(this.myUserId, this.currentRoomId).subscribe((response: any) =>{
            if (response) {
              alert("you have been muted");
            } else {
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
          });
        }
      });


    } else {


      this.chatService.checkMute(this.myUserId, this.currentRoomId).subscribe((response: any) =>{
        if (response) {
          alert("you have been muted");
        } else {
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
      });


    }
  });

 }

 sendPrivateMessage (id: number, username: string) {

  this.chatService.checkBlock(this.myUserId, id).subscribe((reponse) => {
    if (reponse) {
      alert("You have been blocked by : " + username);
    } else {
      if (id != this.myUserId) {
        this.chatService.createPrivateRoom(id.toString(), "", id).subscribe((result2) => {
          if (result2) {
            this.addRoom(id.toString() + "/" + this.myUserId.toString());
            this.chatService.privateMessage(id.toString() + "/" + this.myUserId.toString(), id);
          }
        });
      } else {
        alert("You can't send private messages to yourself!");
      }
    }
  });
 }

  viewProfilUser(id: number) {
    this.router.navigate(['/friendProfile', id.toString()]);
  }

  openDataRemoveAdmin() {
    const dialogRef = this.dialog.open(RemoveAdminComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;

        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            var UserId = response1.id;
          }
          if (UserId == this.myUserId) {
            alert("impossible to remove the admin yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
            return ;
          }
          const nameId = UserId;
          this.chatService.removeAdmin(nameId, this.currentRoomId).subscribe((response: any) =>{
            if (response == 0) {
              alert('Room not found');
            } else if (response == 1) {
              alert(name + " : is the channel owner !");
            } else if (response == 2) {
              alert(name + " : is not in the room !");
            } else if (response == 3) {
              alert(name + " : is not an admin !");
            }else if (response == 4) {
              alert(name + " : he is no longer an admin");
            }
          });
        });
      }
    });

  }

  openDataAddAdmin() {
    const dialogRef = this.dialog.open(AddAdminComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;

        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            var UserId = response1.id;
          }
          if (UserId == this.myUserId) {
            alert("You are already admin !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
            return ;
          }
          const nameId = UserId;
          this.chatService.addAdmin(nameId, this.currentRoomId).subscribe((response: any) =>{
            if (response == 0) {
              alert('Room not found');
            } else if (response == 1) {
              alert(name + " : is already admin !");
            } else if (response == 2) {
              alert(name + " : is not in the room !");
            } else if (response == 3) {
              alert(name + " : is the channel owner !");
            }else if (response == 4) {
              alert(name + " : is admin !");
            }
          });
        });
      }
    });
  }

  addRemovePassword() {
    const dialogRef = this.dialog.open(SetPasswordComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var oldPassword: string = result.oldPassword;
        var newPassword: string = result.newPassword;

        this.chatService.verifyPassword(this.currentRoomId, oldPassword).subscribe((reponse: any) => {
          if (reponse) {
            if (reponse.verify) {
                if (newPassword == '\0') {
                  this.chatService.setPassword(this.currentRoomId, newPassword).subscribe((reponse1: any) => {
                    if (reponse1) {
                      alert("the channel is no longer protected by a password");
                    } else {
                      alert("Room not found");
                    }
                  });
                } else {
                  var message: string;
                  this.chatService.verifyPassword(this.currentRoomId, "").subscribe((reponse3: any) => {
                    if (reponse3) {
                      if (reponse3.verify) {
                        message = "the channel changed its password";
                      }
                      else {
                        message = "the channel is protected by a password";
                      }
                    } else {
                      alert("Room not found");
                    }
                  });
                  this.chatService.setPassword(this.currentRoomId, newPassword).subscribe((reponse2: any) => {
                    if (reponse2) {
                      alert(message);
                    } else {
                      alert("Room not found");
                    }
                  });
                }
            } else {
              alert(oldPassword + " : does not match the current password !");
            }
          } else {
            alert("Room not found");
          }
        });
      }
    });
  }

  openDataBan() {
    const dialogRef = this.dialog.open(BanComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;

        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            var UserId = response1.id;
          }
          if (UserId == this.myUserId) {
            alert("impossible to ban yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
            return ;
          }
          const nameId = UserId;
          this.chatService.banUser(nameId, this.currentRoomId).subscribe((response: any) =>{
            if (response == 0) {
              alert('Room not found');
            } else if (response == 1) {
              alert(name + " : is already ban !");
            } else if (response == 2) {
              alert(name + " : is not in the room !");
            } else if (response == 3) {
              alert(name + " : is the channel owner !");
            }else if (response == 4) {
              this.chatService.kickRoom(this.currentRoomId, UserId).subscribe((response2: any) => {
                if (response2) {
                  this.chatService.kick(this.currentRoomId, UserId);
                  alert(name + " : is ban !");
                }
              });
            }
          });
        });
      }
    });
  }

  openDataUnBan () {
    const dialogRef = this.dialog.open(UnbanComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;

        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            var UserId = response1.id;
          }
          if (UserId == this.myUserId) {
            alert("impossible to unban yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
            return ;
          }
          const nameId = UserId;
          this.chatService.unBanUser(nameId, this.currentRoomId).subscribe((response: any) =>{
            if (response == 0) {
              alert('Room not found');
            } else if (response == 1) {
              alert(name + " : is the channel owner !");
            } else if (response == 2) {
              alert(name + " : is not in the room !");
            } else if (response == 3) {
              alert(name + " : is not ban !");
            }else if (response == 4) {
              alert(name + " : he is no longer banned !");
            }
          });
        });
      }
    });
  }

  openDataMute() {
    const dialogRef = this.dialog.open(MuteComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;

        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            var UserId = response1.id;
          }
          if (UserId == this.myUserId) {
            alert("impossible to ban yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
            return ;
          }
          const nameId = UserId;
          this.chatService.muteUser(nameId, this.currentRoomId).subscribe((response: any) =>{
            if (response == 0) {
              alert('Room not found');
            } else if (response == 1) {
              alert(name + " : is already mute !");
            } else if (response == 2) {
              alert(name + " : is not in the room !");
            } else if (response == 3) {
              alert(name + " : is the channel owner !");
            }else if (response == 4) {
              alert(name + " : is mute !");
            }
          });
        });
      }
    });
  }

  openDataUnMute() {
    const dialogRef = this.dialog.open(UnmuteComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const name = result.name;
        
        this.chatService.getUserId(name).subscribe((response1: any) => {
          if (response1) {
            var UserId = response1.id;
          }
          if (UserId == this.myUserId) {
            alert("impossible to unban yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
            return ;
          }
          const nameId = UserId;
          this.chatService.unMuteUser(nameId, this.currentRoomId).subscribe((response: any) =>{
            if (response == 0) {
              alert('Room not found');
            } else if (response == 1) {
              alert(name + " : is the channel owner !");
            } else if (response == 2) {
              alert(name + " : is not in the room !");
            } else if (response == 3) {
              alert(name + " : is not mute !");
            }else if (response == 4) {
              alert(name + " : is no longer muted !");
            }
          });
        });
      }
    });
  }

  createPrivateGame(gameMode: number, hostname: number, position: number) {
    let gameId = uuidv4();
    this.gameService.createGame(gameId, gameMode, hostname, position);
    /*If it is the first player joining this game, it keeps its gameId, otherwise, it changes the gameId to the other player's gameId*/
    this.gameService.getCreateGame().subscribe((newGameId: string) => {
      if (newGameId === "") {
        alert('An error occured');
        return ;
      }
      if (newGameId !== "0")
        gameId = <string>newGameId;
      this.gameService.setJoinedViaMatchmaking(true);
      this.gameService.setGameMode(gameMode);
      this.router.navigate(['/game', gameId]);
    });
  }

  openDataBlock(nameId: number, name: string, users: Participant) {

      if (nameId == this.myUserId) {
        alert("impossible to block yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
        return ;
      }
      this.chatService.blockUser(nameId, this.myUserId).subscribe((response: any) =>{
        if (response == 0) {
          alert('Room not found');
        } else if (response == 1) {
          alert(name + " : is already block !");
        } else if (response == 2) {

          this.chatService.setBlockUserVisibleButton(nameId, this.myUserId).subscribe((response: any) =>{
            if (response) {
              users.boutonVisible = response;
            }
          });
          alert(name + " : is block !");
        }
      });
  }

  openDataUnBlock(nameId: number, name: string, users: Participant) {

    if (nameId == this.myUserId) {
      alert("impossible to unBlock yourself !\nAre u Dumb !!!!!!!!!!!!!!!!!!!");
      return ;
    }
    this.chatService.unBlockUser(nameId, this.myUserId).subscribe((response: any) =>{
      if (response == 0) {
        alert('Room not found');
      } else if (response == 1) {

        this.chatService.setUnBlockUserVisibleButton(nameId, this.myUserId).subscribe((response: any) =>{
          if (response) {
            users.boutonVisible = response;
          }
        });
        alert(name + " : he is no longer blocked !");
      } else if (response == 2) {
        alert(name + " : is not blocked !");
      }
    });
  }

  sendClassicGame(user: Participant) {
    if (user.userId != this.myUserId) {

      this.chatService.checkBlock(this.myUserId, user.userId).subscribe((reponse) => {
        if (reponse) {
          alert("You have been blocked by : " + user.username);
        } else {
          this.chatService.privateClassicGame(user.userId, this.myUserId);
          alert("You have sent a private request for a classic game to " + user.username + "!");
        }
      });

    } else {
      alert("You cannot send yourself a private request for a classic game.");
    }
  }

  sendPortalGame(user: Participant) {
    if (user.userId != this.myUserId) {

      this.chatService.checkBlock(this.myUserId, user.userId).subscribe((reponse) => {
        if (reponse) {
          alert("You have been blocked by : " + user.username);
        } else {
          this.chatService.privatePortalGame(user.userId, this.myUserId);
          alert("You have sent a private request for a portal game to " + user.username + "!");
        }
      });

    } else {
      alert("You cannot send yourself a private request for a portal game.");
    }
  }

  scrollToBottom() {
    const chatMessages = document.getElementById("content_msg_id");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  async sleep(ms: number) {
    setTimeout(() => {
      this.scrollToBottom();
    }, ms);
  }
}
