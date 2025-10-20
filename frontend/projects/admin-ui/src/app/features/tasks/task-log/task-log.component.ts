import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TaskLogDto } from '@app/contracts';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { TaskLogsService } from '../../../../../../common-ui/services/task-logs.service';
import { SectionDividerComponent } from '../../../core/components/section-divider/section-divider.component';
import { AppTextComponent } from '../../../core/components/text/text.component';

@Component({
  imports: [
    CommonModule,
    AppTextComponent,
    MatButtonModule,
    SectionDividerComponent,
  ],
  selector: 'app-task-log',
  templateUrl: 'task-log.component.html',
})
export class TaskLogComponent extends BaseComponent implements OnInit {
  id: string;
  entry: TaskLogDto;
  additionalData: object;

  taskLogs = inject(TaskLogsService);
  route = inject(ActivatedRoute);
  snackbar = inject(MatSnackBar);
  location = inject(Location);

  ngOnInit() {
    this.route.paramMap.pipe().subscribe({
      next: (data) => {
        if (data.get('id')) {
          this.id = data.get('id');
          this.load();
        }
      },
    });
  }

  load() {
    this.taskLogs.getById(this.id).subscribe({
      next: (entry) => {
        this.entry = entry;
        this.additionalData = JSON.parse(entry.jsonData || null);
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open('Error loading task log', 'Dismiss', {
          duration: 5000,
        });
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
