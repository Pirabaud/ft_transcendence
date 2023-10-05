import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent {
  data: {oldPassword: string, newPassword: string} = {oldPassword: '', newPassword: ''};

  constructor(private dialogRef: MatDialogRef<SetPasswordComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    if (this.data.newPassword == '')
      this.data.newPassword = '\0';
    if (this.data.oldPassword == '')
      this.data.oldPassword = '\0';
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}