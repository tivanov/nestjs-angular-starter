import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {
  GetTaskLogsQuery,
  TaskLogDto,
  TaskLogTypeEnum,
  TaskTypeEnum,
} from '@app/contracts';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { TaskLogsService } from '../../../../../../common-ui/services/task-logs.service';

@Component({
  selector: 'app-task-logs-list',
  templateUrl: './task-logs-list.component.html',
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
    MatSortModule,
    MatInputModule,
  ],
})
export class TaskLogsListComponent extends BaseListComponent<TaskLogDto> {
  logTypes = Object.values(TaskLogTypeEnum);
  taskTypes = Object.values(TaskTypeEnum);

  taskId = input<string>();

  private taskLogsService = inject(TaskLogsService);

  override setColumns(): void {
    this.defaultColumns = [
      'createdAt',
      'taskType',
      'logType',
      'message',
      'actions',
    ];
  }

  public buildForm(): void {
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setTime(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.filterForm = this.formBuilder.group({
      startDate: [startDate],
      endDate: [endDate],
      taskType: [],
      logType: [],
      taskId: [this.taskId()],
    });
  }

  public load($event: { pageIndex: number; pageSize?: number }) {
    const filter: GetTaskLogsQuery = this.populateShapeableQuery($event);

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
      error: this.onFetchError.bind(this),
    });
  }
}
