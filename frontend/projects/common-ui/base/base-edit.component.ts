import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, delay, take, takeUntil } from 'rxjs';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-base-edit',
  template: '',
  standalone: true,
})
export abstract class BaseEditComponent<T>
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  entity: T | null = null;
  form: FormGroup;

  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly location = inject(Location);
  protected readonly dialog = inject(MatDialog);

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.dataLoaded.set(false);

    combineLatest([this.route.paramMap, this.route.queryParams.pipe(take(1))])
      .pipe(delay(0), takeUntil(this.ngUnsubscribe))
      .subscribe(([params, queryParams]) => {
        if (params.get('id')) {
          this.load(params.get('id') ?? '');
        } else {
          setTimeout(() => {
            const patch: Record<string, string> = {};
            if (queryParams['organisationId']) {
              patch['organisation'] = queryParams['organisationId'];
            }

            if (queryParams['campaignId']) {
              patch['campaign'] = queryParams['campaignId'];
            }

            if (Object.keys(patch).length) {
              this.form.patchValue(patch);
            }
          }, 500);
          this.dataLoaded.set(true);
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
    this.dataLoaded.set(true);
    this.dataLoaded.set(true);
  }

  public abstract load(id: string | null);
  public abstract buildForm(): void;
}
