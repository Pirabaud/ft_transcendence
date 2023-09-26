import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpService } from "../../http.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private httpBackend: HttpService) {
  };

  ngOnInit()
  {
    this.activatedRoute.url.subscribe(
        (url: any) =>
        {
          if (url[0].path === 'game')
            this.httpBackend.updateUserStatus('in game').subscribe((response: any) => {
              if (!response)
                console.error("Error while updating status");
            });
          else
            this.httpBackend.updateUserStatus('online').subscribe((response: any) => {
              if (!response)
                console.error("Error while updating status");
            });
        }
    )
    window.addEventListener('beforeunload', () =>
    {
      this.httpBackend.updateUserStatus('offline').subscribe((response: any) => {
        if (!response)
          console.error("Error while updating status");
      });
    })
  }
  navToHomepage() {
    this.router.navigate(['/home']);
  }

  navToProfile() {
    this.router.navigate(['/profile']);
  }

  navToChat() {
    this.router.navigate(['/chat']);
  }

  navToLobby() {
    this.router.navigate(['/lobby']);
  }

  navToLogin() {
    this.httpBackend.updateUserStatus('offline').subscribe((response: any) => {
      if (!response)
        console.error("Error while updating status");
    });
    this.router.navigate(['/login']);
  }
}
