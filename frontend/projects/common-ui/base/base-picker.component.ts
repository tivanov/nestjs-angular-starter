import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IdNameDto } from '@app/contracts';
import { takeUntil } from 'rxjs';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-base-picker',
  template: '',
  standalone: true,
})
export abstract class BasePickerComponent<T extends IdNameDto>
  extends BaseComponent
  implements OnInit
{
  @Input() label: string | null;
  @Input() selectIfOnlyOne: boolean | null;
  @Input() protected set disabled(value: boolean) {
    if (value) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }
  @Input() required: boolean | null;
  @Input() placeholder: string | null;
  @Input() control: FormControl | null;
  @Input() controlName: string | null;
  @Input() formGroup: FormGroup | null;
  @Input() multiple: boolean | null;
  @Input() hint: string | null;
  @Input() protected set value(value: string | null) {
    this.control?.setValue(value);
    this.valueChange.emit(value);
  }
  @Output() readonly valueChange = new EventEmitter<string | null>();

  options: T[] | null = [];

  protected readonly snackBar = inject(MatSnackBar);

  protected initControl() {
    let control: FormControl | null = this.control;
    if (this.controlName && this.formGroup) {
      control = this.formGroup.controls[this.controlName] as FormControl;
      if (!control) {
        throw new Error(
          `Control with name ${this.controlName} not found in form group `
        );
      }
    }
    this.control = control ?? new FormControl('', []);
    if (this.control) {
      this.control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((value) => {
          this.valueChange.emit(value);
        });
    }
  }

  protected onFetchError(error: any) {
    this.snackBar.open(this.extractErrorMessage(error), 'Dismiss', {
      duration: 5000,
    });
    console.error(error);
    setTimeout(() => {
      this.dataLoaded.set(true);
    });
  }

  ngOnInit() {
    this.dataLoaded.set(false);
    this.initControl();
    this.load();
  }

  protected onOptionsLoaded(options: T[]) {
    this.options = options;
    if (this.selectIfOnlyOne && this.options.length === 1) {
      this.control?.setValue(this.options[0].id);
      this.valueChange.emit(this.options[0].id);
    } else if (this.control?.value) {
      if (typeof this.control.value === 'string') {
        if (!this.options.find((c) => c.id === this.control?.value)) {
          this.value = null;
        }
      } else if (Array.isArray(this.control.value)) {
        if (!this.options.find((c) => this.control?.value.includes(c.id))) {
          this.value = null;
        }
      }
    }
    setTimeout(() => {
      this.dataLoaded.set(true);
    });
  }

  public getSelected(): T | null {
    if (!this.options || !this.control?.value) {
      return null;
    }

    return this.options.find((o) => o.id === this.control?.value) ?? null;
  }

  public hasError(error) {
    return (
      this.control &&
      this.control.hasError(error) &&
      (this.control.dirty || this.control.touched)
    );
  }

  public controlHasError(control, error) {
    return control?.hasError(error) && (control.dirty || control.touched);
  }

  public isInvalid() {
    return (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  protected abstract load(): void;
}
