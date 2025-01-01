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
import { BaseComponent } from './base.component';
import { IdNameDto } from '@app/contracts';
import { takeUntil } from 'rxjs';

@Component({
  template: '',
  standalone: true,
})
export abstract class BasePickerComponent<T extends IdNameDto>
  extends BaseComponent
  implements OnInit
{
  @Input() label;
  @Input() selectIfOnlyOne: boolean;
  @Input() protected set disabled(value: boolean) {
    if (value) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  }
  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() control: FormControl;
  @Input() controlName: string;
  @Input() formGroup: FormGroup;
  @Input() multiple: boolean;
  @Input() hint: string;
  @Input() protected set value(value: string) {
    this.control?.setValue(value);
    this.valueChange?.emit(value);
  }
  @Output() valueChange = new EventEmitter<string>();

  options: T[] = [];

  protected readonly snackBar = inject(MatSnackBar);

  protected initControl() {
    let control: FormControl = null;
    if (this.controlName && this.formGroup) {
      control = this.formGroup.controls[this.controlName] as FormControl;
    } else if (this.control) {
      control = this.control as FormControl;
    } else {
      control = new FormControl('', []);
    }
    this.control = control;
    this.control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.valueChange.emit(value);
      });
  }

  protected onFetchError(error) {
    this.snackBar.open(this.extractErrorMessage(error), 'Dismiss', {
      duration: 5000,
    });
    console.error(error);
    setTimeout(() => {
      this.dataLoaded = true;
    });
  }

  ngOnInit() {
    this.dataLoaded = false;
    this.initControl();
    this.load();
  }

  protected onOptionsLoaded(options: T[]) {
    this.options = options;
    if (this.selectIfOnlyOne && this.options.length === 1) {
      this.control.setValue(this.options[0].id);
      this.valueChange.emit(this.options[0].id);
    } else if (this.control?.value) {
      if (!this.options.find((c) => c.id === this.control.value)) {
        this.value = null;
      }
    }
    setTimeout(() => {
      this.dataLoaded = true;
    });
  }

  public getSelected(): T {
    if (!this.options || !this.control.value) {
      return null;
    }

    return this.options.find((o) => o.id === this.control.value);
  }

  public hasError(error) {
    return (
      this.control &&
      this.control.hasError(error) &&
      (this.control.dirty || this.control.touched)
    );
  }

  public controlHasError(control, error) {
    return (
      control && control.hasError(error) && (control.dirty || control.touched)
    );
  }

  public isInvalid() {
    return (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  protected abstract load();
}
