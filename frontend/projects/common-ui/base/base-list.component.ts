import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { BaseComponent } from './base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, take, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '',
  standalone: true,
})
export abstract class BaseListComponent<T>
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: string[] = [];
  defaultColumns: string[] = [];
  mobileColumns: string[] = [];

  totalItems: number;
  pageSizeOptions = [10, 100, 200];
  showFirstLastButtons = true;

  protected filterForm: FormGroup;

  dataSource = new MatTableDataSource<T>();

  formBuilder: FormBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  responsive = inject(BreakpointObserver);
  route = inject(ActivatedRoute);

  sortBy: string;
  sortDirection: string;

  @ViewChild('mainPaginator') paginator: MatPaginator;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.setColumns();
    this.buildForm();
    this.responsive
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(map((result) => result.breakpoints))
      .subscribe((breakpoints) => {
        const isPhonePortrait = breakpoints[Breakpoints.HandsetPortrait];
        this.displayedColumns =
          isPhonePortrait && this.mobileColumns.length
            ? this.mobileColumns
            : this.defaultColumns;
      });

    this.route.queryParams.pipe(take(1)).subscribe((queryParams) => {
      this.filterForm?.patchValue(queryParams);
      this.load({ pageIndex: (queryParams['page'] - 1) | 0 });
    });
  }

  onSortChange(event: any) {
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.load({
      pageIndex: this.paginator?.pageIndex || 0,
    });
  }

  onResetFilter() {
    if (this.filterForm) {
      this.filterForm.reset();
    }

    this.sortBy = null;
    this.sortDirection = null;
    this.load({
      pageIndex: this.paginator?.pageIndex || 0,
    });
  }

  public populateShapeableQuery($event: {
    pageIndex: number;
    pageSize?: number;
  }) {
    const filter = this.filterForm?.getRawValue() || {};
    filter.page = $event.pageIndex + 1;
    filter.limit =
      $event.pageSize || this.paginator?.pageSize || this.pageSizeOptions[0];
    filter.sortBy = this.sortBy || 'createdAt';
    filter.sortDirection = this.sortDirection || 'desc';

    return filter;
  }

  public onFetchError(error) {
    this.snackBar.open(this.extractErrorMessage(error), 'Dismiss', {
      duration: 5000,
    });
    console.error(error);
    this.dataLoaded = true;
  }

  public abstract load($event: { pageIndex: number; pageSize?: number });
  public abstract buildForm(): void;
  public abstract setColumns(): void;
}
