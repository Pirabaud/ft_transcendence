import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../../http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpBackend: HttpService,
    private http: HttpClient,
  ) {}
  
  redirectionToGoogle() {
    this.httpBackend.setTfaTrue().subscribe((response1: any) => {
      if (response1) {
          this.httpBackend.generate2fa().subscribe((response2: any) => {
            console.log(response2);
        });
      } else
        window.location.href = '';
    });
  }

  redirectionToHome() {
    this.httpBackend.setTfaFalse().subscribe((response: any) => {
      if (response)
        window.location.href = 'home';
      else
        window.location.href = '';
    });
  }
}
