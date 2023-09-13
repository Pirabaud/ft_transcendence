import { Component, OnInit } from '@angular/core';
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
  isChecked = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpBackend: HttpService,
    private http: HttpClient,
    ) {}

  ngOnInit() {
    this.httpBackend.getTfaStatus().subscribe((response: any) => {
      console.log(response);
      if (response == true) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
      });
  }

  setupGoogle() {
    if (this.isChecked == true) {
      this.httpBackend.setTfaTrue().subscribe((response1: any) => {
        if (response1) {
          console.log("2FA activated");
        } else {
          console.error("Error while activating 2FA");
        }
      });
    } else {
      this.httpBackend.setTfaFalse().subscribe((response2: any) => {
        if (response2) {
          console.log("2FA deactivated");
        } else {
          console.error("Error while deactivating 2FA");
        }
      });
    }
    }

  GenerateQRcode() {
    this.httpBackend.generate2fa().subscribe((response2: any) => {
      if (response2) {
        const QRcodeSRC = response2.imageUrl;
        
        const QRcodeImageElement: HTMLImageElement | null = document.getElementById("QR-Code-image") as HTMLImageElement;
        
        if (QRcodeImageElement) {
          QRcodeImageElement.src = QRcodeSRC;
        }
        
      } else {
        console.error("Error while generating QRcode 2FA");
      }
    });
  }

}
