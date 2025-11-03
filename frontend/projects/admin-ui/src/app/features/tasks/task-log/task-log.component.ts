import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskLogDto } from '@app/contracts';
import { BaseEditComponent } from '../../../../../../common-ui/base/base-edit.component';
import { TaskLogsService } from '../../../../../../common-ui/services/task-logs.service';
import { SectionDividerComponent } from '../../../core/components/section-divider/section-divider.component';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { AppTextComponent } from '../../../core/components/text/text.component';

@Component({
  imports: [
    CommonModule,
    AppTextComponent,
    MatButtonModule,
    SectionDividerComponent,
    SpinnerComponent,
  ],
  selector: 'app-task-log',
  templateUrl: 'task-log.component.html',
})
export class TaskLogComponent extends BaseEditComponent<TaskLogDto> {
  private readonly taskLogs = inject(TaskLogsService);
  private readonly snackbar = inject(MatSnackBar);

  public additionalData: object | null = null;

  public override buildForm(): void {
    this.form = this.formBuilder.group({});
  }

  public override load(id: string): void {
    this.dataLoaded.set(false);

    this.taskLogs.getById(id).subscribe({
      next: (entry) => this.onEntityLoaded(entry),
      error: (error) => this.onFetchError(error),
    });
  }

  private onEntityLoaded(entity: TaskLogDto): void {
    this.entity = entity;

    try {
      this.additionalData = entity.jsonData
        ? JSON.parse(entity.jsonData)
        : null;
    } catch (e) {
      console.warn('Invalid JSON in task log entry', e);
      this.additionalData = null;
    }

    this.dataLoaded.set(true);
  }

  public override onFetchError(error: any): void {
    console.error(error);
    this.snackbar.open('Error loading task log', 'Dismiss', { duration: 5000 });
    this.dataLoaded.set(true);
  }

  public goBack(): void {
    this.location.back();
  }
}
