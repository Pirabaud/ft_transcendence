import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent {
  constructor(private router: Router, private httpBackend:HttpService) {};

  ngOnInit() {

    this.httpBackend.getProfile().subscribe(
      (response: any) => {
        const profileImageElement: HTMLImageElement | null = document.getElementById("profile-image") as HTMLImageElement;
        const profileUsernameElement: HTMLElement | null = document.getElementById("profile-username");
        const winElement: HTMLElement | null = document.getElementById("stats-win");
        const loseElement: HTMLElement | null = document.getElementById("stats-lose");
        const eloElement: HTMLElement | null = document.getElementById("stats-elo");
        if(winElement)
        {
          winElement.textContent = response.win;
        }
        if(loseElement)
        {
          loseElement.textContent = response.lose;
        }
        if(eloElement)
        {
          eloElement.textContent = response.elo;
        }
        if (profileUsernameElement) {
           profileUsernameElement.textContent = response.username;
         }
         if (profileImageElement) {
          profileImageElement.src = response.img;
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
