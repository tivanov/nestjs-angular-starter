import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { AlertDto } from '@app/contracts';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { BaseComponent } from '../../../../../../../common-ui/base/base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertsService } from '../../../../../../../common-ui/services/alerts.service';

export interface IAlertDialogData {
  alert: AlertDto;
}

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent extends BaseComponent {
  readonly dialogRef = inject(MatDialogRef<AlertDialogComponent>);
  readonly data = inject<IAlertDialogData>(MAT_DIALOG_DATA);
  readonly alert = model(this.data.alert);
  readonly alertService = inject(AlertsService);
  readonly snackbar = inject(MatSnackBar);

  dismiss() {
    if (!this.alert()) {
      return;
    }

    this.alertService.dismiss(this.alert().id).subscribe({
      next: () => {
        this.exit();
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open(this.extractErrorMessage(error), 'Dismiss', {
          duration: 5000,
        });
      },
    });
  }

  exit() {
    this.dialogRef.close();
  }
}
