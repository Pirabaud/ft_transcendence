import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  ngOnInit()
  {
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('jwt')))
      this.router.navigate(['/login']);
  }

}
