import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-unmute',
  templateUrl: './unmute.component.html',
  styleUrls: ['./unmute.component.css']
})
export class UnmuteComponent {
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<UnmuteComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}