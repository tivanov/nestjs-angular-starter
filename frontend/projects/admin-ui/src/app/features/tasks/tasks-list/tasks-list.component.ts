import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GetTasksQuery, TaskDto, TaskTypeEnum } from '@app/contracts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { firstValueFrom } from 'rxjs';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { TasksService } from '../../../../../../common-ui/services/tasks.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
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
    FontAwesomeModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
})
export class TasksListComponent
  extends BaseListComponent<TaskDto>
  implements OnInit
{
  taskId = input<string>();
  search = input<string>();
  public readonly Types = Object.values(TaskTypeEnum);

  private tasksService = inject(TasksService);

  override setColumns(): void {
    this.defaultColumns = [
      'active',
      'type',
      'name',
      'runOnce',
      'timeout',
      'runImmediately',
      'cronString',
      'lastRun',
      'actions',
    ];

    this.mobileColumns = ['active', 'name', 'lastRun', 'actions'];
  }

  public buildForm(): void {
    this.filterForm = this.formBuilder.group({
      id: [this.taskId()],
      activeOnly: [],
      type: [],
      onlyOneTime: [],
      onlyRecurring: [],
      search: [this.search()],
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.sortBy = 'active';
    this.sortDirection = 'desc';
  }

  public load($event: { pageIndex: number; pageSize?: number }) {
    const filter: GetTasksQuery = this.populateShapeableQuery($event);

    this.tasksService.get(filter).subscribe({
      next: (paged) => {
        this.dataSource.data = paged.docs;
        this.totalItems = paged.totalDocs;
        this.dataLoaded.set(true);
        this.setQueryParams(filter);
      },
      error: this.onFetchError.bind(this),
    });
  }

  async toggleTask(event, task: TaskDto) {
    try {
      if (event.checked) {
        if (confirm(`Are you sure you want to activate task ${task.type}?`)) {
          await firstValueFrom(this.tasksService.start(task.id));
          this.load({ pageIndex: 0 });
        }
      } else {
        if (confirm(`Are you sure you want to deactivate task ${task.type}?`)) {
          await firstValueFrom(this.tasksService.stop(task.id));
          this.load({ pageIndex: 0 });
        }
      }
    } catch (error) {
      this.onFetchError(error);
    }
  }

  onDelete(task: TaskDto) {
    if (confirm(`Are you sure you want to delete task ${task.type}?`)) {
      this.tasksService.delete(task.id).subscribe({
        next: () => {
          this.load({ pageIndex: 0 });
        },
        error: this.onFetchError.bind(this),
      });
    }
  }
}
