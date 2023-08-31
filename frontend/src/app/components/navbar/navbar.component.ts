import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) {
  };

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
    this.router.navigate(['/login']);
  }
}
