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
    window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-64336f890a3d4b312905d32aa8112365980d82c1510fa0980fd301d76d844dc8&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin-handler&response_type=code";
  }

  ngOnInit() {
	localStorage.setItem('api', "");
	localStorage.setItem('tfa', "");
  }

  redirectionToApi() {
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-64336f890a3d4b312905d32aa8112365980d82c1510fa0980fd301d76d844dc8&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin-handler&response_type=code';
  }
}