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
      this.httpBackend.getTfaStatus().subscribe((response1: any) => {
      if (response1 == true) {
        this.isChecked = true;
        
        this.httpBackend.getQRcode().subscribe((response2: any) => {
          if (response2) {
            const QRcodeSRC = response2.QRcode;
            
            const QRcodeImageElement: HTMLImageElement | null = document.getElementById("QR-Code-image") as HTMLImageElement;
            
            if (QRcodeImageElement) {
              QRcodeImageElement.src = QRcodeSRC;
            }
          } else {
            console.error("Error during QR code retrieval");
          }
        });
      } else {
        this.isChecked = false;
      }
    });
  }

  setupGoogle() {
    const QRcodeImageElement: HTMLImageElement | null = document.getElementById("QR-Code-image") as HTMLImageElement;

    if (this.isChecked == true) {
      this.httpBackend.setTfaTrue().subscribe((response1: any) => {
        if (response1) {
          this.GenerateQRcode();
        } else {
          console.error("Error while activating 2FA");
        }
      });
    } else {
      this.httpBackend.setTfaFalse().subscribe((response2: any) => {
        if (response2) {
          if (QRcodeImageElement) {
            QRcodeImageElement.src = "./assets/images/caneton.jpg";
          }
        } else {
          console.error("Error while deactivating 2FA");
        }
      });
    }
    }

  GenerateQRcode() {
    this.httpBackend.generate2fa().subscribe((response2: any) => {
      if (response2) {
        this.httpBackend.postGoogle(response2).subscribe((response3: any) => {
          if (response3 == null)
            console.error("Error while saving 2FA infos");
        });
        
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
