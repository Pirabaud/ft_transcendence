import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
  ) {}

  redirectionToApi() {
    window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-432267aa4b3890b662e54696989bc6813155db335ed202391ec9efc9c6e24b87&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin-handler&response_type=code";
  }

  ngOnInit() {
	localStorage.setItem('api', "");
	localStorage.setItem('tfa', "");
  }

}