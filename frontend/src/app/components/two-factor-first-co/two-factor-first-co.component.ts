import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-two-factor-first-co',
  templateUrl: './two-factor-first-co.component.html',
  styleUrls: ['./two-factor-first-co.component.css']
})
export class TwoFactorFirstCoComponent {
  isChecked = false;

  constructor(
    private router: Router,
    private httpBackend: HttpService,
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
        }
      });
    } else {
      this.httpBackend.setTfaFalse().subscribe((response2: any) => {
        if (response2) {
          if (QRcodeImageElement) {
            QRcodeImageElement.src = "./assets/images/caneton.jpg";
          }
        }
      });
    }
    }

  GenerateQRcode() {
    this.httpBackend.generate2fa().subscribe((response2: any) => {
      if (response2) {
        this.httpBackend.postGoogle(response2).subscribe(() => {
        });

        const QRcodeSRC = response2.imageUrl;

        const QRcodeImageElement: HTMLImageElement | null = document.getElementById("QR-Code-image") as HTMLImageElement;

        if (QRcodeImageElement) {
          QRcodeImageElement.src = QRcodeSRC;
        }
      }
    });
  }

  redirectToProfileConfig() {
    this.router.navigate(['/profileConfig']);
  }
}
