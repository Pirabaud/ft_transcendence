import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-portal-game',
  templateUrl: './portal-game.component.html',
  styleUrls: ['./portal-game.component.css']
})
export class PortalGameComponent {
  data: {YesOrNo: boolean} = {YesOrNo: false};

  constructor(private dialogRef: MatDialogRef<PortalGameComponent>) {}

  yes() {
    this.data = {YesOrNo: true};
    this.dialogRef.close(this.data);
  }

  no() {
    this.dialogRef.close(this.data);
  }
}
