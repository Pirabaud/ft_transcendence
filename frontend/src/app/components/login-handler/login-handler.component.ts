import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-login-handler',
  templateUrl: './login-handler.component.html',
  styleUrls: ['./login-handler.component.css']
})
export class LoginHandlerComponent implements OnInit {
    private readonly key = 'jwt';

  constructor( 
     private httpBackend: HttpService,
     private http: HttpClient,
  ) {}

  
  ngOnInit() {
    const url = window.location.href;
    const code = getParamFromUrl(url, "code");

    if (code) {
      this.httpBackend.getjwt(code).subscribe((response: any) => {
        if (response && response.jwt_token) {
          localStorage.setItem(this.key, response.jwt_token);
          window.location.href = 'home';
        } else {
          console.log('failure to obtain access token');
          window.location.href = '';
        }
      });
    } 
    else {
      console.log('access denied');
      window.location.href = '';
    }

  }

}

function getParamFromUrl(url: string, param: string): string | null {
  const searchParams = new URLSearchParams(new URL(url).search);
  return searchParams.get(param);
}
