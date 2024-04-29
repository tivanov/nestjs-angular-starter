import { ContentChild, Directive } from '@angular/core';
import { FormControlDirective } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Directive({
  selector: 'mat-form-field',
})
export class HasErrorRootDirective {
  @ContentChild(FormControlDirective)
  set formControl(formControl: FormControlDirective) {
    this._formControl$.next(formControl);
  }

  get formControl$() {
    return this._formControl$.asObservable();
  }

  private _formControl$ = new ReplaySubject<FormControlDirective>(1);
}