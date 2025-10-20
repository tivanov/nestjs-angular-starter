import {
  Component,
  OnInit,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-base-input',
  template: '',
  standalone: true,
})
export class BaseInputComponent extends BaseComponent implements OnInit {
  readonly type = input('text');
  readonly control = input<FormControl>();
  readonly controlName = input<string>();
  readonly formGroup = input<FormGroup>();
  readonly label = input<string>();
  readonly placeholder = input<string>('');
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly name = input<string>();
  readonly hint = input<string>();
  readonly valueChange = output<string>();
  readonly suffix = input<string | null>(null);
  readonly suffixActionIcon = input<string | null>(null);
  readonly suffixAction = output<void>();

  readonly actualControl = signal<FormControl>(null);

  readonly mandatory = computed(() => {
    if (this.required()) return true;

    const ctrl = this.actualControl();
    if (!ctrl) return false;

    if (ctrl.hasValidator?.(Validators.required)) return true;

    if (ctrl.validator) {
      const errors = ctrl.validator(ctrl);
      if (errors?.['required']) return true;
    }

    return false;
  });

  ngOnInit(): void {
    this.initControl();
  }

  initControl() {
    let control: FormControl = null;
    if (this.controlName() && this.formGroup()) {
      control = this.formGroup().controls[this.controlName()] as FormControl;
    } else if (this.control()) {
      control = this.control()!;
    } else {
      const validators = [];
      if (this.required()) {
        validators.push(Validators.required);
      }
      control = new FormControl('', validators);
    }
    this.actualControl.set(control);

    if (control) {
      control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value) => {
          this.valueChange.emit(value);
        });
    }
  }

  clearValue(): void {
    const control = this.actualControl();
    if (control) {
      control.reset();
      control.markAsTouched();
    }
  }
}
