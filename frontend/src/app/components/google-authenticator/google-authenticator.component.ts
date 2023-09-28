import { Component } from '@angular/core';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.css']
})
export class GoogleAuthenticatorComponent {

  constructor (
    private httpBackend: HttpService,
  ) {}

  verifyForm() {
    const form = document.getElementById('myForm') as HTMLFormElement;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputText = document.getElementById('inputText') as HTMLInputElement;
      const inputValue = inputText.value;

      this.httpBackend.getSecret().subscribe((response1: any) => {
        if (response1) {

          const obj: any = {
            input: inputValue,
            secret: response1.Secret,
          };
          this.httpBackend.verify2fa(obj).subscribe((response2: any) => {
            if (response2) {
              if (response2.success == true) {
				localStorage.setItem('tfa', "true");
                window.location.href = 'home';
              }
            }
          });
        }
      });
    });
  }
}
