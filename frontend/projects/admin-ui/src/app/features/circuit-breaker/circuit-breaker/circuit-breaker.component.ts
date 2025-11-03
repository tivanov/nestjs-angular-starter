import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CircuitBreakerDto } from '@app/contracts';
import { BaseEditComponent } from '../../../../../../common-ui/base/base-edit.component';
import { CircuitBreakersService } from '../../../../../../common-ui/services/circuit-breakers.service';
import { CardComponent } from '../../../core/components/card/card.component';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { AppTextComponent } from '../../../core/components/text/text.component';

@Component({
  selector: 'app-circuit-breaker',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    SpinnerComponent,
    CardComponent,
    AppTextComponent,
    MatDatepickerModule,
    FormsModule,
  ],
  templateUrl: './circuit-breaker.component.html',
  styleUrl: './circuit-breaker.component.scss',
})
export class CircuitBreakerComponent
  extends BaseEditComponent<CircuitBreakerDto>
  implements OnInit, AfterViewInit
{
  protected readonly circuitBreakers = inject(CircuitBreakersService);

  readonly nextAttemptTime = signal<string>(
    this.toDateInputFormat(new Date(Date.now() + 1000 * 60 * 60 * 24)),
  );

  override load(circuitBreakerId: string) {
    this.circuitBreakers.getOne(circuitBreakerId).subscribe({
      next: (circuitBreaker) => {
        this.entity = circuitBreaker;
        this.dataLoaded.set(true);
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open(this.extractErrorMessage(error), 'Close', {
          duration: 5000,
        });
      },
    });
  }

  override buildForm() {
    this.form = this.formBuilder.group({});
  }

  resetCb(): void {
    this.circuitBreakers.reset(this.entity.id).subscribe({
      next: () => {
        this.snackBar.open('Item resetted', 'Close', { duration: 3000 });
      },
      error: this.onFetchError.bind(this),
    });
  }

  open(): void {
    this.circuitBreakers.open(this.entity.id).subscribe({
      next: () => {
        this.snackBar.open('Circuit breaker opened', 'Close', {
          duration: 3000,
        });
      },
      error: this.onFetchError.bind(this),
    });
  }

  setNextAttemptTime(): void {
    const nextAttemptDate = new Date(this.nextAttemptTime() ?? new Date());
    this.circuitBreakers
      .setNextAttemptTime(this.entity.id, nextAttemptDate)
      .subscribe({
        next: () => {
          this.snackBar.open('Next attempt time set', 'Close', {
            duration: 3000,
          });
        },
        error: this.onFetchError.bind(this),
      });
  }
}
