import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpService} from "../../http.service";

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent {

  @ViewChild('profilePic') profilePicElement: ElementRef;
  @ViewChild('login') loginElement: ElementRef;
  @ViewChild('fileName') fileNameElement: ElementRef;

  constructor(private httpBackend:HttpService) {};
  onFileSelected(keycode: KeyboardEvent)
  {
    if (keycode.code === 'Enter' || keycode.code === 'NumpadEnter')
    {
      const url = this.fileNameElement.nativeElement.value.trim();

      if (!url) {
        alert("Enter a valid link");
        return;
      }

      this.checkUrlValidity(url).then((isValid) => {
        if (isValid) {
          const filenameValue: string = url;
          this.httpBackend.uploadFile(filenameValue).subscribe(
            (response: any) => {
              this.profilePicElement.nativeElement.src = response.url;
            }
          );
        } else {
          alert("The URL does not lead to a valid resource.");
        }
      });
    }
  }
  sendUsernameData(keycode: KeyboardEvent)
  {
    if (keycode.code === 'Enter' || keycode.code === 'NumpadEnter')
    {
      const usernameValue: string = this.loginElement.nativeElement.value.trim();
      if (usernameValue.length !== 0 && usernameValue.length <= 12)
      {
        this.httpBackend.checkDoubleUsername(usernameValue).subscribe(
          (response: any) =>
          {
            if (response === false)
            {
              window.alert('Username already taken');
            }
            else
            {
             this.httpBackend.saveNewUsername(usernameValue).subscribe(
               (response: any) =>
               {
                 window.alert('Your username has been successfully changed to ' + response.username)
               })
            }
          })
      }
      else {
        window.alert('Your username must be 12 characters or less and can\'t be blank');
      }
    }
  }

  async checkUrlValidity(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  ngOnInit() {

    this.httpBackend.getProfile().subscribe(

      (response: any) => {
        if (this.loginElement) {
          this.loginElement.nativeElement.value = response.username;
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
