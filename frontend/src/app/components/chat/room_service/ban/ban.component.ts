import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-ban',
  templateUrl: './ban.component.html',
  styleUrls: ['./ban.component.css']
})
export class BanComponent {
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<BanComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}
