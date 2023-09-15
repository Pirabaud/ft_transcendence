import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login-handler',
  templateUrl: './login-handler.component.html',
  styleUrls: ['./login-handler.component.css']
})
export class LoginHandlerComponent implements OnInit {
    private readonly key = 'jwt';

  constructor(
     private httpBackend: HttpService,
     private router: Router,
  ) {}


  ngOnInit() {
    const url = window.location.href;
    const code = getParamFromUrl(url, "code");

    if (code) {
      this.httpBackend.getjwt(code).subscribe((response: any) => {
        if (response && response.jwt_token) {
          localStorage.setItem(this.key, response.jwt_token);
          this.httpBackend.updateUserStatus('online').subscribe(
            () => {});
          this.router.navigate(['/profileConfig']);
        } else {
          console.log('failure to obtain access token');
          this.httpBackend.updateUserStatus('offline').subscribe(
            () => {});
          this.router.navigate(['/login']);
        }
      });
    }
    else {
      console.log('access denied');
      this.router.navigate(['/login']);
    }

  }

}

function getParamFromUrl(url: string, param: string): string | null {
  const searchParams = new URLSearchParams(new URL(url).search);
  return searchParams.get(param);
}
