import { TaskDto, TaskTypeEnum } from '@app/contracts';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TasksService } from '../../../../../../common-ui/services/tasks.service';
import { BaseEditComponent } from '../../../../../../common-ui/base/base-edit.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './task.component.html',
})
export class TaskComponent extends BaseEditComponent<TaskDto> {
  types = Object.values(TaskTypeEnum);

  private readonly tasks = inject(TasksService);

  load(id: string) {
    this.tasks.getOne(id).subscribe({
      next: (task) => {
        this.entity = task;
        this.form.patchValue(task);
      },
      error: (err) => {
        this.snackBar.open(this.extractErrorMessage(err), 'Close', {
          duration: 5000,
        });
        console.error(err);
      },
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      active: [false],
      type: [null, Validators.required],
      name: [null, Validators.required],
      params: [],
      script: [],
      runImmediately: [false],
      cronString: [null, Validators.required],
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.getRawValue();

    if (val.id) {
      this.tasks.update(val.id, val).subscribe({
        next: () => {
          this.snackBar.open('Task updated', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['./tasks/list']);
        },

        error: (err) => {
          this.snackBar.open(this.extractErrorMessage(err), 'Close', {
            duration: 5000,
          });
          console.error(err);
        },
      });
    } else {
      this.tasks.create(val).subscribe({
        next: () => {
          this.snackBar.open('Task created', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['./tasks/list']);
        },

        error: (err) => {
          this.snackBar.open(this.extractErrorMessage(err), 'Close', {
            duration: 5000,
          });
          console.error(err);
        },
      });
    }
  }
}
