import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-classic-game',
  templateUrl: './classic-game.component.html',
  styleUrls: ['./classic-game.component.css']
})
export class ClassicGameComponent {
  data: {YesOrNo: boolean} = {YesOrNo: false};

  constructor(private dialogRef: MatDialogRef<ClassicGameComponent>) {}

  yes() {
    this.data = {YesOrNo: true};
    this.dialogRef.close(this.data);
  }

  no() {
    this.dialogRef.close(this.data);
  }
}
