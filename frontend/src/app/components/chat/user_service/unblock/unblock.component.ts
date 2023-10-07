import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-unblock',
  templateUrl: './unblock.component.html',
  styleUrls: ['./unblock.component.css']
})
export class UnblockComponent {
  
  data: {name: string} = {name: ''};

  constructor(private dialogRef: MatDialogRef<UnblockComponent>) {}

  closeDialog() {
    this.dialogRef.close(); //return rien au dialog opener
  }

  saveData() {
    // Ici ta logique pour sauvegarder la data, creer la room
    this.dialogRef.close(this.data); //return this.data au dialog opener
  }
}