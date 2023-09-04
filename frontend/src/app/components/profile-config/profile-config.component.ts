import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpService} from "../../http.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent {

  @ViewChild('profilePic') profilePicElement: ElementRef;
  @ViewChild('login') loginElement: ElementRef;

  constructor(private http:HttpClient, private httpBackend:HttpService) {};
  onFileSelected(event: any)
  {
     const file: File = event.target.files[0];

     if (file)
     {

       const formData = new FormData();

       formData.append("thumbnail", file);

       const upload$ = this.http.post("/api/thumbnail-upload", formData);
       upload$.subscribe();
     }
  }
  ngOnInit() {
    this.httpBackend.getProfile().subscribe(
      (response: any) => {
        if (this.loginElement) {
          this.loginElement.nativeElement.value = response.login;
        }
        if (this.profilePicElement) {
         this.profilePicElement.nativeElement.src = response.img;
        }
      },
      (error) => {
        console.error('no data', error);
      }
    );
  }
}
