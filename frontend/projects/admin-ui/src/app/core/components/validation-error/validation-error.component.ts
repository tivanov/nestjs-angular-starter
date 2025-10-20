import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';

@Component({
  selector: 'app-validation-error',
  imports: [CommonModule, MatError],
  templateUrl: './validation-error.component.html',
  styleUrl: './validation-error.component.scss',
})
export class ValidationErrorComponent extends BaseComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() controlName!: string;
  @Input() messages!: Record<string, string>;
  @Input() defaultError = 'Please enter a valid value';

  private formGroupDirective = inject(FormGroupDirective);

  _control: AbstractControl;

  get shouldDisplayError(): boolean {
    return !!this._control && this._control.touched && !!this._control.errors;
  }

  get errorMessage(): string | null {
    if (!this._control.errors) return null;
    if (this._control.errors['minlength']) {
      return `Minimum length is ${this._control.errors['minlength'].requiredLength}`;
    } else if (this._control.errors['maxlength']) {
      return `Maximum length is ${this._control.errors['maxlength'].requiredLength}`;
    } else if (this._control.errors['required']) {
      return 'This field is required';
    } else if (this._control.errors['email']) {
      return 'Enter a valid email address';
    } else if (this._control.errors['pattern']) {
      return 'Please enter a valid value';
    } else if (this._control.errors['min']) {
      return `Minimum value is ${this._control.errors['min'].min}`;
    } else if (this._control.errors['max']) {
      return `Maximum value is ${this._control.errors['max'].max}`;
    }
    console.log(this._control.errors);
    const errorKey = Object.keys(this._control.errors)[0];
    return this.messages[errorKey] || this.defaultError;
  }

  ngOnInit(): void {
    if (this.control) {
      this._control = this.control;
    } else if (this.formGroupDirective) {
      // Access the corresponding form control
      this._control = this.formGroupDirective.control.get(this.controlName);
    }
  }
}
