import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../http.service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent {
  @ViewChild('matchHistoryList') matchHistoryListElement: ElementRef;
  @ViewChild('leaderboardList') leaderboardListElement: ElementRef;
  @ViewChild('profilePic') profilePicElement: ElementRef;
  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('statsWin') statsWinElement: ElementRef;
  @ViewChild('statsLose') statsLoseElement: ElementRef;
  @ViewChild('statsElo') statsEloElement: ElementRef;
  private userId: string;

  constructor(private route: ActivatedRoute, 
    private httpBackend: HttpService, 
    private jwtHelper: JwtHelperService, 
    private router: Router) {}

  ngOnInit()
  {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
      this.router.navigate(['/login']);

    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.httpBackend.getProfileById(this.userId).subscribe(
      (profile: any) => {
        if(this.statsWinElement)
        {
          this.statsWinElement.nativeElement.innerHTML = profile.win;
        }
        if(this.statsLoseElement)
        {
          this.statsLoseElement.nativeElement.innerHTML = profile.lose;
        }
        if(this.statsEloElement)
        {
          this.statsEloElement.nativeElement.innerHTML = profile.elo;
        }
        if (this.usernameElement) {
          this.usernameElement.nativeElement.innerHTML = profile.username;
        }
        if (this.profilePicElement) {
          this.profilePicElement.nativeElement.src = profile.img;
        }

      },
      (error) => {
        console.error('no data', error);
      }
    );
  }
}
