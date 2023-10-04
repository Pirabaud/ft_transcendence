import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-kick',
  templateUrl: './kick.component.html',
  styleUrls: ['./kick.component.css']
})
export class KickComponent {
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<KickComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}
