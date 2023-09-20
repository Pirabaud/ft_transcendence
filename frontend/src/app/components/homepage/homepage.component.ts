import {Component, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {
  constructor(private router: Router, 
    private httpBackend:HttpService, 
    private jwtHelper: JwtHelperService) {};

  @ViewChild('profilePic') profilePicElement: ElementRef;
  @ViewChild('username') usernameElement: ElementRef;
  @ViewChild('statsWins') statsWinsElement: ElementRef;
  @ViewChild('statsLoses') statsLosesElement: ElementRef;
  @ViewChild('statsElo') statsEloElement: ElementRef;
  ngOnInit() {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
          this.router.navigate(['/login']);
    this.httpBackend.getProfile().subscribe(
      (response: any) => {
        if(this.statsWinsElement)
        {
          this.statsWinsElement.nativeElement.innerHTML = response.win;
        }
        if(this.statsLosesElement)
        {
          this.statsLosesElement.nativeElement.innerHTML = response.lose;
        }
        if(this.statsEloElement)
        {
          this.statsEloElement.nativeElement.innerHTML = response.elo;
        }
        if (this.usernameElement) {
           this.usernameElement.nativeElement.innerHTML = response.username;
         }
         if (this.profilePicElement) {
          this.profilePicElement.nativeElement.src = response.img;
        }

      },
      (error) => {
        console.error('no data', error);
      }
    );
  }

  navToChat() {
    this.router.navigate(['/chat']);
  }

  navToLobby() {
    this.router.navigate(['/lobby']);
  }
}
