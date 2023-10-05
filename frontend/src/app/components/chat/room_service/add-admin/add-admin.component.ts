import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent {
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<AddAdminComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}

