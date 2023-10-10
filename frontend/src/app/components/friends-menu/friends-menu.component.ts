import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { HttpService } from "../../http.service";
import { Router, ActivatedRoute, UrlSegment } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
import {FriendObject} from "./friend-object.interface";

@Component({
  selector: 'app-friends-menu',
  templateUrl: './friends-menu.component.html',
  styleUrls: ['./friends-menu.component.css']
})
export class FriendsMenuComponent {

  nbRequests: number = 0;
  allFriends: FriendObject[] = [];
  allRequests: string[] = [];
  isOpened: boolean = false;
  @ViewChild('friendsMenuButton') friendsMenuButtonElement: ElementRef;
  @ViewChild('drawer') drawerElement: ElementRef;
  @ViewChild('noRequests') noRequestsElement: ElementRef;
  @ViewChild('noFriends') noFriendsElement: ElementRef;
  @ViewChild('friendUsername') friendUsernameElement: ElementRef;
  @ViewChild('requestsContainer') requestsContainerElement: ElementRef;
  @ViewChild('friendListContainer') friendsContainerElement: ElementRef;
  @ViewChild('userStatus') userStatusElement: ElementRef;
  constructor(private httpBackend: HttpService,
    private renderer: Renderer2,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit()
  {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this.httpBackend.updateUserStatus('offline');
      this.router.navigate(['/login']);
    }
    this.activatedRoute.url.subscribe(
      (url: UrlSegment[]) =>
      {
        let interval;
        if (url[0].path !== 'login') {
          this.fetchAndUpdateFriendRequests();
          this.fetchAndUpdateFriendlist();
          interval = setInterval(() => {
          this.fetchAndUpdateFriendRequests();
          this.fetchAndUpdateFriendlist();
          }, 5000);
        }
        else
          clearInterval(interval);
      }
    )
  }
  setIsOpened()
  {
    this.isOpened = !this.isOpened;
    console.log(this.isOpened);
  }
  sendFriendRequest(keycode: KeyboardEvent)
  {
    if (keycode.code === 'Enter' || keycode.code === 'NumpadEnter')
    {
      let username = this.friendUsernameElement.nativeElement.value
      this.friendUsernameElement.nativeElement.value = '';
      this.httpBackend.getProfile().subscribe(
        (profile: any) =>
        {
          if (profile.username === username) {
            window.alert('You can\'t add yourself as a friend');
            return ;
          }
          this.httpBackend.checkUserExists(username).subscribe(
            (userExists: boolean) =>
            {
              if (userExists === true)
              {
                this.httpBackend.getIdWithUsername(username).subscribe(
                  (id: number) =>
                  {
                    if (profile.friendList) {
                      for (let i = 0; i < profile.friendList.length; ++i) {
                        if (profile.friendList[i] == id) {
                          window.alert(`You are already friends with ${username}`);
                          return;
                        }
                      }
                    }
                    this.httpBackend.getFriendRequests().subscribe(
                      (friendRequests: any) =>
                      {
                       if (friendRequests)
                       {
                         for (let i = 0; i < friendRequests.length; ++i)
                         {
                           if (friendRequests[i].sender === id)
                             window.alert(`${username} already asked you as a friend, you can accept the request`);
                           else {
                             this.httpBackend.createFriendRequest(username).subscribe(
                               (friendRequest: any) => {
                                 if (friendRequest === null)
                                   window.alert('Friend request already pending');
                                 else
                                   window.alert(`Friend request sent to ${username}`);
                               }
                             )
                           }
                         }
                       }
                       else {
                         this.httpBackend.createFriendRequest(username).subscribe(
                           (friendRequest: any) => {
                             if (friendRequest === null)
                               window.alert('Friend request already pending');
                             else
                               window.alert(`Friend request sent to ${username}`);
                           }
                         )
                       }
                      }
                    )

                  }
                )
              }
                  else
                    window.alert('This user does not exist');
            }
          )
        })
    }
  }
  removeFriend(id: string)
  {
    if (window.confirm("Do you really want to remove this friend ?")) {
      this.httpBackend.removeFriend(id).subscribe(
        () => {
          this.httpBackend.getUsernameWithId(parseInt(id)).subscribe(
            (username: string) => {
              const index = this.allRequests.indexOf(username);
              this.allRequests.splice(index, 1);
              this.fetchAndUpdateFriendlist();
            }
          )
        }
      );
    }
  }
  private fetchAndUpdateFriendRequests()
  {
    this.httpBackend.getFriendRequests().subscribe(
      (response: any) =>
      {
        const length = response ? response.length : 0;

        this.allRequests = [];
          for (let i = 0; i < length; ++i)
          {
            const friendRequest = response[i];
            this.httpBackend.getUsernameWithId(friendRequest.sender).subscribe(
              (response: any) =>
              {
                this.allRequests.push(response.username);
              }
            );
          }
      })
    this.httpBackend.getProfile().subscribe(
      (response: {friendRequestsNb: number}) => {
        this.nbRequests = response.friendRequestsNb
        if (this.nbRequests !== 0) {
          this.noRequestsElement.nativeElement.style.visibility = 'hidden';
          this.noRequestsElement.nativeElement.style.maxHeight = 0;
          this.noRequestsElement.nativeElement.style.margin = 0;
        }
        else {
          this.noRequestsElement.nativeElement.style.visibility = 'visible';
          this.noRequestsElement.nativeElement.style.maxHeight = 22 + 'px';
          this.noRequestsElement.nativeElement.style.margin = 15 + 'px';
        }
      });
  }

  private fetchAndUpdateFriendlist()
  {
    this.httpBackend.getProfile().subscribe(
      (profile: any) =>
      {
        const length = profile.friendList ? profile.friendList.length : 0;

        if (length === 0) {
          this.noFriendsElement.nativeElement.style.visibility = "visible"
          this.noFriendsElement.nativeElement.style.maxHeight = 22 + 'px';
          this.noFriendsElement.nativeElement.style.margin = 15 + 'px';
        }
        else {
          this.noFriendsElement.nativeElement.style.visibility = "hidden"
          this.noFriendsElement.nativeElement.style.maxHeight = 0;
          this.noFriendsElement.nativeElement.style.margin = 0;
        }

        this.allFriends = [];
        for (let i = 0; i < length; ++i)
        {
          const friend = profile.friendList[i];
          this.httpBackend.getProfileById(friend).subscribe(
            (profile: any) =>
            {
              let friendObject: FriendObject = {username: profile.username, status: profile.status === 'in game' ? 'in-game' : profile.status, id: profile.id};
              this.allFriends.push(friendObject);
            }
          );
        }
      })
  }
  acceptFriendRequest(senderUsername: string) {
    this.httpBackend.getIdWithUsername(senderUsername).subscribe(
      (senderId: number) =>
      {
        this.httpBackend.acceptFriendRequest(senderId).subscribe(
          () =>
          {
            const index = this.allRequests.indexOf(senderUsername);
            this.allRequests.splice(index, 1);
            this.fetchAndUpdateFriendRequests();
            this.fetchAndUpdateFriendlist();
          }
        )
      }
    );
  }

  refuseFriendRequest(senderUsername: string) {
    this.httpBackend.getIdWithUsername(senderUsername).subscribe(
      (senderId: number) =>
      {
        this.httpBackend.refuseFriendRequest(senderId).subscribe(
          () =>
          {
            const index = this.allRequests.indexOf(senderUsername);
            this.allRequests.splice(index, 1);
            this.fetchAndUpdateFriendRequests();
          }
        )
      }
    );
  }
}
