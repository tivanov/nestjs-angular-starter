import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mat-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './mat-dialog.component.html',
  styleUrl: './mat-dialog.component.scss'
})
export class MatDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MatDialogComponent>
  ) {

  }

  ngOnInit(): void {

  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
