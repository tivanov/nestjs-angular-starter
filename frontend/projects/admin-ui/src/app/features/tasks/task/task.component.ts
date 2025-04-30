import { TaskDto, TaskTypeEnum } from '@app/contracts';
import { Component, OnInit } from '@angular/core';
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
import { StringUtils } from '../../../../../../common-ui/utils/string-utils';

@Component({
    selector: 'app-task',
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
    templateUrl: './task.component.html'
})
export class TaskComponent extends BaseComponent implements OnInit {
  taskId: string | null = null;

  form: FormGroup;
  task: TaskDto;

  types = Object.values(TaskTypeEnum);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tasksService: TasksService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.initForm();
    this.activatedRoute.paramMap.pipe().subscribe({
      next: (data) => {
        if (data.get('id')) {
          this.taskId = data.get('id');
          this.load();
        }
      },
    });
  }

  load() {
    this.tasksService
      .getOne(this.taskId)
      .pipe()
      .subscribe({
        next: (task) => {
          this.task = task;
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

  initForm() {
    return this.fb.group({
      id: [{ value: '', disabled: true }],
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

    const val = this.form.getRawValue();

    if (val.id) {
      this.tasksService.update(val.id, val).subscribe({
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
      this.tasksService.create(val).subscribe({
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

  clear() {
    if (this.task) {
      this.form.patchValue(this.task);
    } else {
      this.form.reset();
    }
  }

  exit() {
    this.router.navigate(['/tasks/list']);
  }

  onTypeChange(type: string) {
    if (this.task) {
      return;
    }

    this.form.patchValue({
      name: StringUtils.toTitleCase(type.replace('-', ' ')),
    });
  }
}
