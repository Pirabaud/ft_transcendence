import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  redirectionToGoogle() {
    window.location.href = 'google';
  }

  redirectionToHome() {
    window.location.href = 'home';
  }
}
