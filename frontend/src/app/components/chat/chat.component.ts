import { JwtHelperService } from '@auth0/angular-jwt';
import {Component, OnInit} from '@angular/core';
import {ChatService, MessageEventDto} from '../../services/chat.service';
import {ActivatedRoute, Router} from '@angular/router';

interface Participant {
  avatar: string;
  connected: string;
}

interface ParticipantEvent extends Participant{
  username: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  title = 'chat-app';

  public connected = false;
  public roomId = '';
  public username = '';
  public avatar = '';
  public messages: MessageEventDto[] = [];
  public userAvatarsMap = new Map<string, Participant>();
  public messageContent = '';

  constructor(private jwtHelper: JwtHelperService, private router: Router, private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit()
  {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
      this.router.navigate(['/chat']);

    this.route.queryParams.subscribe(params => {
      const roomId = params['room'];
      const username = params['user'];
      const avatar = params['avatar'];
      if (roomId && username && avatar) {
        this.roomId = roomId;
        this.username = username;
        this.avatar = avatar;
        this.connection();
      }
    });

  }

    // private connection() {
  //   console.log('Connecting user: %s to room: %s', this.username, this.roomId);
  //   this.chatService.getMessage()
  //     .subscribe({
  //       next: (messages) => {
  //         this.initConnection(messages);
  //       },
  //       error: (error) => {
  //         console.log("la room : ", this.roomId);
  //         // console.error(error);
  //         alert(' T NULLLLLLLLLLLLLLLLLLLL');
  //       },
  //     });
  // }
  
  private connection() {
    console.log('Connecting user: %s to room: %s', this.username, this.roomId);
    this.chatService.createRoom();
    this.messages = this.chatService.getAllMessage();
    if (this.messages)
      this.initConnection(this.messages);
    else
      alert(' T NULLLLLLLLLLLLLLLLLLLL');
      // .subscribe({
      //   next: (messages) => {
      //     console.log(messages);
      //     this.initConnection(messages);
      //   },
      //   error: (error) => {
      //     console.log("TURERE : ", this.roomId);
      //     // console.error(error);
      //     alert(' T NULLLLLLLLLLLLLLLLLLLL');
      //   },
      // });
      // console.log("FAIL");
  }

  private initConnection(messages: MessageEventDto[]) {
    console.log("caca");
    this.messages = messages
    this.chatService.participate(this.roomId, this.username, this.avatar);
    this.chatService.receiveEvent(this.roomId).subscribe((message: MessageEventDto) => {
      console.debug('received message event: ', message);
      this.messages.push(message)
    });
    this.chatService.receiveEvent(`participants/${this.roomId}`).subscribe((participants: ParticipantEvent[]) => {
      console.debug('received participants event: ', participants);
      this.userAvatarsMap = this.toUserAvatarsMap(participants);
    });
    this.connected = true;
  }

  private toUserAvatarsMap(participants: ParticipantEvent[]): Map<string, Participant> {
    const mp = new Map<string, Participant>();
    participants.forEach(p => mp.set(p.username, {avatar: p.avatar, connected: p.connected}));
    return mp;
  }

  // createRoom() {
  
  //   this.chatService.createRoom(this.roomId, this.username, this.avatar).subscribe(
  //     (response) => {
  //       console.log('Room created successfully', response);
  //       // Traitez la réponse si nécessaire
  //     },
  //     (error) => {
  //       console.error('Error creating room', error);
  //       // Gérez l'erreur
  //     }
  //   );
  // }

  sendMessage(): void {
    if (this.messageContent.trim().length === 0) {
      return;
    }
    const message = {
      roomId: this.roomId,
      username: this.username,
      content: this.messageContent,
      createdAt: new Date()
    } as MessageEventDto;

    console.log('Posting message event: ', message);
    this.chatService.sendMessage(message);
    this.messageContent = '';
  }

  navigateToRoom(): void {
    if (this.roomId && this.username && this.avatar) {
      this.connection();
    } else {
      alert('All fields are required.');
    }
  }
}
