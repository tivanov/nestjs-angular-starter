import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { AlertDto, GetAlertsQuery } from '@app/contracts';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { AlertsService } from '../../../../../../common-ui/services/alerts.service';

@Component({
    selector: 'app-alerts-widget',
    templateUrl: 'alerts-widget.component.html',
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
    ]
})
export class AlertsWidgetComponent extends BaseListComponent<AlertDto> {
  constructor(private readonly alertsService: AlertsService) {
    super();
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
      error: this.onFetchError.bind(this),
    });
  }
  public override buildForm(): void {}

  override setColumns() {
    this.pageSizeOptions = [5, 10, 25, 100];
    this.defaultColumns = ['type', 'message', 'actions'];
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
      error: this.onFetchError.bind(this),
    });
  }
}
