import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { HttpService } from "../../http.service";
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-friends-menu-temporary',
  templateUrl: './friends-menu-temporary.component.html',
  styleUrls: ['./friends-menu-temporary.component.css']
})
export class FriendsMenuTemporaryComponent {

  @ViewChild('friendUsername') friendUsernameElement: ElementRef;
  @ViewChild('notifsField') notifsElement: ElementRef;
  @ViewChild('requestsContainer') requestsContainerElement: ElementRef;
  @ViewChild('friendListContainer') friendsContainerElement: ElementRef;
  @ViewChild('userStatus') userStatusElement: ElementRef;
  constructor(private httpBackend: HttpService, 
    private renderer: Renderer2, 
    private router: Router, 
    private jwtHelper: JwtHelperService) {}

    ngOnInit()
  {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
          this.router.navigate(['/login']);
    this.fetchAndUpdateFriendRequests();
    this.fetchAndUpdateFriendlist();
    setInterval(() => {
      this.fetchAndUpdateFriendRequests();
      this.fetchAndUpdateFriendlist();
    }, 10000);
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
          this.fetchAndUpdateFriendlist();
        }
      );
    }
  }
  viewFriendProfile(id: string)
  {
    this.router.navigate(['/friendProfile', id]);
  }
  private fetchAndUpdateFriendRequests()
  {
    this.httpBackend.getFriendRequests().subscribe(
      (response: any) =>
      {
        const length = response ? response.length : 0;
          const ulElement = this.renderer.createElement('ul');
          this.renderer.setAttribute(ulElement, 'id', 'friend-requests-ul'); // Assign an ID

          const existingUlElement = this.requestsContainerElement.nativeElement.querySelector('#friend-requests-ul');

          if (existingUlElement)
            this.renderer.removeChild(this.requestsContainerElement.nativeElement, existingUlElement);

          for (let i = 0; i < length; ++i)
          {
            const friendRequest = response[i];
            this.httpBackend.getUsernameWithId(friendRequest.sender).subscribe(
              (response: any) =>
              {
                const liElement = this.renderer.createElement('li');
                const senderText = this.renderer.createText(response.username.toString());

                this.renderer.appendChild(liElement, senderText);

                const buttonElement1 = this.renderer.createElement('button');
                const buttonElement2 = this.renderer.createElement('button');
                const acceptButtonText = this.renderer.createText('Accept');
                const refuseButtonText = this.renderer.createText('Refuse');

                this.renderer.listen(buttonElement1, 'click', () => this.acceptFriendRequest(response.username))
                this.renderer.listen(buttonElement2, 'click', () => this.refuseFriendRequest(response.username))
                this.renderer.appendChild(buttonElement1, acceptButtonText);
                this.renderer.appendChild(buttonElement2, refuseButtonText);
                this.renderer.appendChild(liElement, buttonElement1);
                this.renderer.appendChild(liElement, buttonElement2);
                this.renderer.appendChild(ulElement, liElement);
              }
            );
          }
          this.renderer.appendChild(this.requestsContainerElement.nativeElement, ulElement);
      })
    this.httpBackend.getProfile().subscribe(
      (response: any) =>
      {
        if (response.friendRequestsNb !== 0)
          this.notifsElement.nativeElement.innerHTML = response.friendRequestsNb;
        else
          this.notifsElement.nativeElement.innerHTML = '';
      })
  }

  private fetchAndUpdateFriendlist()
  {
    this.httpBackend.getProfile().subscribe(
      (profile: any) =>
      {
        const length = profile.friendList ? profile.friendList.length : 0;
        const ulElement = this.renderer.createElement('ul');
        this.renderer.setAttribute(ulElement, 'id', 'friendlist-ul');

        const existingUlElement = this.friendsContainerElement.nativeElement.querySelector('#friendlist-ul');

        if (existingUlElement)
          this.renderer.removeChild(this.friendsContainerElement.nativeElement, existingUlElement);

        for (let i = 0; i < length; ++i)
        {
          const friend = profile.friendList[i];
          this.httpBackend.getProfileById(friend).subscribe(
            (profile: any) =>
            {
              const liElement = this.renderer.createElement('li');
              const senderText = this.renderer.createText(profile.username.toString() + ': ' + profile.status);

              this.renderer.appendChild(liElement, senderText);

              const buttonElement1 = this.renderer.createElement('button');
              this.renderer.setAttribute(buttonElement1, 'id', friend.toString())
              const buttonElement2 = this.renderer.createElement('button');
              this.renderer.setAttribute(buttonElement2, 'id', friend.toString())
              const acceptButtonText = this.renderer.createText('Remove');
              const refuseButtonText = this.renderer.createText('Profile');

              this.renderer.listen(buttonElement1, 'click', (event) => {
                const id = event.target.id;
                this.removeFriend(id);
              });
              this.renderer.listen(buttonElement2, 'click', (event) => {
                const id = event.target.id;
                this.viewFriendProfile(id);
              });
              this.renderer.appendChild(buttonElement1, acceptButtonText);
              this.renderer.appendChild(buttonElement2, refuseButtonText);
              this.renderer.appendChild(liElement, buttonElement1);
              this.renderer.appendChild(liElement, buttonElement2);
              this.renderer.appendChild(ulElement, liElement);
            }
          );
        }
        this.renderer.appendChild(this.friendsContainerElement.nativeElement, ulElement);
      })
  }
  private acceptFriendRequest(senderUsername: string) {
    this.httpBackend.getIdWithUsername(senderUsername).subscribe(
      (senderId: number) =>
      {
        this.httpBackend.acceptFriendRequest(senderId).subscribe(
          () =>
          {
            this.fetchAndUpdateFriendRequests();
            this.fetchAndUpdateFriendlist();
          }
        )
      }
    );
  }

  private refuseFriendRequest(senderUsername: string) {
    this.httpBackend.getIdWithUsername(senderUsername).subscribe(
      (senderId: number) =>
      {
        this.httpBackend.refuseFriendRequest(senderId).subscribe(
          () =>
          {
            this.fetchAndUpdateFriendRequests();
          }
        )
      }
    );
  }
}
