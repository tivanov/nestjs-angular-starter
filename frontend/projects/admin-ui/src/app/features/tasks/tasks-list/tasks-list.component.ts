import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { TasksService } from '../../../../../../common-ui/services/tasks.service';
import { GetTasksQuery, TaskDto } from '@app/contracts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
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
    FontAwesomeModule,
    MatSortModule,
  ],
})
export class TasksListComponent
  extends BaseListComponent<TaskDto>
  implements OnInit
{
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
  }

  public buildForm(): void {
    this.filterForm = this.formBuilder.group({
      organisationId: [],
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
      next: this.onDataReceived.bind(this),
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
