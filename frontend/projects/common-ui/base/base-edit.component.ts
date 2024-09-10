import { Component, OnInit, inject } from '@angular/core';
import { BaseComponent } from './base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  template: '',
  standalone: true,
})
export abstract class BaseEditComponent<T>
  extends BaseComponent
  implements OnInit
{
  entity: T;

  form: FormGroup;

  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly location = inject(Location);

  ngOnInit() {
    this.buildForm();
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        if (params.get('id')) {
          this.load(params.get('id'));
        }
      });
  }

  reset() {
    if (this.entity) {
      this.form.patchValue(this.entity);
    } else {
      this.form.reset();
    }
  }

  exit() {
    this.location.back();
  }

  public onFetchError(error) {
    this.snackBar.open(this.extractErrorMessage(error), 'Dismiss', {
      duration: 5000,
    });
    console.error(error);
    this.dataLoaded = true;
  }

  public abstract load(id: string);
  public abstract buildForm(): void;
}
