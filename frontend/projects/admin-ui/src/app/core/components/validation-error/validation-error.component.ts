import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { MatError } from '@angular/material/form-field';

@Component({
    selector: 'app-validation-error',
    imports: [CommonModule, MatError],
    templateUrl: './validation-error.component.html',
    styleUrl: './validation-error.component.scss'
})
export class ValidationErrorComponent extends BaseComponent implements OnInit {
  @Input() controlName!: string;
  @Input() messages!: { [key: string]: string };
  @Input() defaultError: string = 'Please enter a valid value';

  private formGroupDirective = inject(FormGroupDirective);

  control: AbstractControl;

  get shouldDisplayError(): boolean {
    return !!this.control && this.control.touched && !!this.control.errors;
  }

  get errorMessage(): string | null {
    if (!this.control.errors) return null;
    if (this.control.errors['minlength']) {
      return `Minimum length is ${this.control.errors['minlength'].requiredLength}`;
    } else if (this.control.errors['maxlength']) {
      return `Maximum length is ${this.control.errors['maxlength'].requiredLength}`;
    } else if (this.control.errors['required']) {
      return 'This field is required';
    } else if (this.control.errors['email']) {
      return 'Enter a valid email address';
    } else if (this.control.errors['pattern']) {
      return 'Please enter a valid value';
    } else if (this.control.errors['min']) {
      return `Minimum value is ${this.control.errors['min'].min}`;
    } else if (this.control.errors['max']) {
      return `Maximum value is ${this.control.errors['max'].max}`;
    }
    console.log(this.control.errors);
    const errorKey = Object.keys(this.control.errors)[0];
    return this.messages[errorKey] || this.defaultError;
  }

  ngOnInit(): void {
    if (this.formGroupDirective) {
      // Access the corresponding form control
      this.control = this.formGroupDirective.control.get(this.controlName);
    }
  }
}
