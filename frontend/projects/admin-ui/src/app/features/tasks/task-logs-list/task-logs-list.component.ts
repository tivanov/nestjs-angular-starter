import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import {
  GetTaskLogsQuery,
  TaskLogDto,
  TaskLogTypeEnum,
  TaskTypeEnum,
} from '@app/contracts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TaskLogsService } from '../../../../../../common-ui/services/task-logs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-task-logs-list',
  templateUrl: './task-logs-list.component.html',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
  ],
})
export class TaskLogsListComponent
  extends BaseListComponent<TaskLogDto>
  implements OnInit
{
  logTypes = Object.values(TaskLogTypeEnum);
  taskTypes = Object.values(TaskTypeEnum);

  constructor(
    private taskLogsService: TaskLogsService,
    private snackBar: MatSnackBar
  ) {
    super();
    this.displayedColumns = [
      'createdAt',
      'taskType',
      'logType',
      'message',
      'actions',
    ];
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.load({ pageIndex: 0 });
  }

  public buildForm(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setTime(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.filterForm = this.formBuilder.group({
      startDate: [startDate],
      endDate: [endDate],
      taskType: [],
      logType: [],
    });
  }

  public load($event: { pageIndex: number; pageSize?: number }) {
    const filter: GetTaskLogsQuery = this.filterForm.getRawValue();
    filter.sortBy = this.sortBy;
    filter.sortDirection = this.sortDirection;
    filter.page = $event.pageIndex + 1;
    filter.limit =
      $event.pageSize || this.paginator?.pageSize || this.pageSizeOptions[0];

    if (filter.startDate) {
      filter.startDate = new Date(filter.startDate).toISOString();
    }

    if (filter.endDate) {
      filter.endDate = new Date(filter.endDate).toISOString();
    }

    this.taskLogsService.get(filter).subscribe({
      next: (paged) => {
        this.dataSource.data = paged.docs;
        this.totalItems = paged.totalDocs;
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open(this.extractErrorMessage(error), '', {
          duration: 5000,
        });
      },
    });
  }
}
