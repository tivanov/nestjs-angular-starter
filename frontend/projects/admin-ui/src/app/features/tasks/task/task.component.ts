import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateTaskCommand, TaskDto, TaskTypeEnum, UpdateTaskCommand } from '@app/contracts';
import { BaseEditComponent } from '../../../../../../common-ui/base/base-edit.component';
import { takeUntil } from 'rxjs';
import { StatusEnumPipe } from '../../../../../../common-ui/pipes/status-enum.pipe';
import { TasksService } from '../../../../../../common-ui/services/tasks.service';
import { StringUtils } from '../../../../../../common-ui/utils/string-utils';
import { CardComponent } from '../../../core/components/card/card.component';
import { TaskLogsListComponent } from '../task-logs-list/task-logs-list.component';

@Component({
  selector: 'app-task',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    CardComponent,
    TaskLogsListComponent,
    StatusEnumPipe,
  ],
  templateUrl: './task.component.html',
})
export class TaskComponent extends BaseEditComponent<TaskDto> {
  readonly types = Object.values(TaskTypeEnum).sort((a, b) => a.localeCompare(b));

  private readonly tasksService = inject(TasksService);

  load(id: string) {
    this.tasksService.getOne(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (task) => {
        this.entity = task;
        this.form.patchValue(task);
        this.dataLoaded.set(true);
      },
      error: (error) => this.onFetchError(error),
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      active: [false],
      type: [null, Validators.required],
      name: [null, Validators.required],
      params: [],
      script: [],
      runImmediately: [false],
      runOnce: [false],
      timeout: [],
      cronString: [],
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const command: CreateTaskCommand = this.form.getRawValue();
    const isUpdate = !!this.entity;
    // Identity belongs in the URL; type is only part of the create contract.
    const { type, ...updateCommand }: CreateTaskCommand = command;
    const request = this.entity
      ? this.tasksService.update(this.entity.id, updateCommand satisfies UpdateTaskCommand)
      : this.tasksService.create(command);

    request.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.snackBar.open(isUpdate ? 'Task updated' : 'Task created', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/tasks/list']);
      },
      error: (error) => this.onFetchError(error),
    });
  }

  onTypeChange(type: string) {
    if (this.entity) {
      return;
    }

    this.form.patchValue({
      name: StringUtils.kebabToTitleCase(type),
    });
  }
}
