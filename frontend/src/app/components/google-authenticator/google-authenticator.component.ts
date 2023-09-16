import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../../http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.css']
})
export class GoogleAuthenticatorComponent {
  
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private httpBackend: HttpService,
    private http: HttpClient,
  ) {}

  verifyForm() {
    const form = document.getElementById('myForm') as HTMLFormElement;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
    
      const inputText = document.getElementById('inputText') as HTMLInputElement;
      const valeurInput = inputText.value;

      this.httpBackend.getSecret().subscribe((response1: any) => {
        if (response1) {
          
          const obj: any = {
            input: valeurInput,
            secret: response1.Secret,
          };
          this.httpBackend.verify2fa(obj).subscribe((response2: any) => {
            if (response2) {
              if (response2.success == true) {
                window.location.href = 'home';
              } else {
                window.alert("Please enter a valid code");
              }
            } else {
              console.error("Error during two-factor authentication verification");
            }
          });
        } else {
          console.error("Error during Secret Code retrieval");
        }
      });
    });
  }

}
