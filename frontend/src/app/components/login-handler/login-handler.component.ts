import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login-handler',
  templateUrl: './login-handler.component.html',
  styleUrls: ['./login-handler.component.css']
})
export class LoginHandlerComponent implements OnInit {

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
          localStorage.setItem('jwt', response.jwt_token);
          localStorage.setItem('api', "true");
          if (response.first_connection) {
				  localStorage.setItem('tfa', "true");
				  this.router.navigate(['/two-factor-first-co']);
		  } else {
            this.httpBackend.getTfaStatus().subscribe((response: any) => {
            	if (response == true) {
            	  this.router.navigate(['/google']);
				} else {
				  localStorage.setItem('tfa', "true");
            	  this.router.navigate(['/home']);
				}
			});
          }
        } else {
          console.error('Failure to obtain access token');
          this.router.navigate(['/login']);
        }
      });
    }
    else {
      this.router.navigate(['/login']);
    }

  }

}

function getParamFromUrl(url: string, param: string): string | null {
  const searchParams = new URLSearchParams(new URL(url).search);
  return searchParams.get(param);
}
