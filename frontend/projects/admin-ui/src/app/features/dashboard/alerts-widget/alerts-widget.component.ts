import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { AlertDto, GetAlertsQuery } from '@app/contracts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { AlertsService } from '../../../../../../common-ui/services/alerts.service';

@Component({
  selector: 'app-alerts-widget',
  templateUrl: 'alerts-widget.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class AlertsWidgetComponent
  extends BaseListComponent<AlertDto>
  implements OnInit
{
  constructor(
    private readonly alertsService: AlertsService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    super();
    this.pageSizeOptions = [5, 10, 25, 100];
    this.displayedColumns = ['type', 'message', 'actions'];
  }

  public override load($event: { pageIndex: number; pageSize?: number }) {
    const filter: GetAlertsQuery = {
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      page: $event.pageIndex + 1,
      unreadOnly: true,
      limit:
        $event.pageSize || this.paginator?.pageSize || this.pageSizeOptions[0],
    };

    this.alertsService.get(filter).subscribe({
      next: (paged) => {
        this.dataSource.data = paged.docs;
        this.totalItems = paged.totalDocs;
      },
      error: (error) => {
        console.error('Error loading alerts', error);
        this.snackbar.open(this.extractErrorMessage(error), 'Close', {
          duration: 5000,
        });
      },
    });
  }
  public override buildForm(): void {}

  override ngOnInit() {
    super.ngOnInit();
    this.load({ pageIndex: 0 });
  }

  view(alert: AlertDto) {
    this.dialog.open(AlertDialogComponent, {
      data: { alert },
    });
  }

  dismiss(alert: AlertDto) {
    if (!alert) {
      return;
    }

    this.alertsService.dismiss(alert.id).subscribe({
      next: () => {
        this.load({ pageIndex: 0 });
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open(this.extractErrorMessage(error), 'Dismiss', {
          duration: 5000,
        });
      },
    });
  }
}
