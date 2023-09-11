import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.css']
})
export class GoogleAuthenticatorComponent {
  
  constructor (
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  redirectionToHome() {
    window.location.href = 'home';
  }
}
