import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-mute',
  templateUrl: './mute.component.html',
  styleUrls: ['./mute.component.css']
})
export class MuteComponent {
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<MuteComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}