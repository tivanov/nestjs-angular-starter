import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HealthCheckResultDto } from '@app/contracts';
import { BaseComponent } from '../../../../../common-ui/base/base.component';
import { HealthService } from '../../../../../common-ui/services/health.service';
import { CardComponent } from '../../core/components/card/card.component';
import { SpinnerComponent } from '../../core/components/spinner/spinner.component';
import { AppTextComponent } from '../../core/components/text/text.component';

interface HealthIndicatorEntry {
  name: string;
  status: string;
}

@Component({
  selector: 'app-system-health',
  imports: [
    CardComponent,
    SpinnerComponent,
    AppTextComponent,
    MatButtonModule,
  ],
  templateUrl: './system-health.component.html',
  styleUrl: './system-health.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemHealthComponent extends BaseComponent implements OnInit {
  private readonly healthService = inject(HealthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly result = signal<HealthCheckResultDto | null>(null);

  readonly indicatorEntries = computed<HealthIndicatorEntry[]>(() => {
    const health = this.result();
    if (!health?.details) {
      return [];
    }

    return Object.entries(health.details).map(([name, indicator]) => ({
      name,
      status: indicator.status,
    }));
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.dataLoaded.set(false);
    this.healthService.get().subscribe({
      next: (response) => {
        this.result.set(response);
        this.dataLoaded.set(true);
      },
      error: (error) => {
        this.dataLoaded.set(true);
        this.snackBar.open(this.extractErrorMessage(error), 'Close', {
          duration: 5000,
        });
      },
    });
  }
}
