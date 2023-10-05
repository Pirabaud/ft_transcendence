import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-unban',
  templateUrl: './unban.component.html',
  styleUrls: ['./unban.component.css']
})
export class UnbanComponent {
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<UnbanComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}
