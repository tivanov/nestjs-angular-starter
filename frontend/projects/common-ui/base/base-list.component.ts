import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
  model,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedListDto } from '@app/contracts';
import { delay, map, take, takeUntil } from 'rxjs';
import { BaseComponent } from './base.component';

@Component({
  selector: 'app-base-list',
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
  selection = new SelectionModel<T>(true, []);

  formBuilder: FormBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  responsive = inject(BreakpointObserver);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);

  sortBy: string | null = null;
  sortDirection: string | null = null;

  readonly disableFilterToQuery = model<boolean>(false);

  @ViewChild('mainPaginator') paginator: MatPaginator;

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
  }

  ngAfterViewInit(): void {
    // This is called at least once, both when there are query params and when there are not
    this.route.queryParams.pipe(take(1), delay(0)).subscribe((queryParams) => {
      const filter = this.filterForm?.getRawValue() || {};
      const query = this.disableFilterToQuery() ? {} : queryParams;
      const pageIndex = Math.max((query['page'] - 1) | 0, 0);
      let pageSize = this.pageSizeOptions[0];
      if (query['limit'] || !isNaN(query['limit'])) {
        pageSize = Number.parseInt(query['limit']);
      }
      this.filterForm?.patchValue({ ...filter, ...query });
      if (this.paginator) {
        this.paginator.pageIndex = pageIndex;
        this.paginator.pageSize = pageSize;
      }
      this.load({ pageIndex, pageSize });
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

  public setQueryParams(filter: any) {
    if (this.disableFilterToQuery()) {
      return;
    }

    if (filter.page) {
      this.paginator.pageIndex = filter.page - 1;
    }

    if (filter.limit) {
      this.paginator.pageSize = filter.limit;
    }

    void this.router.navigate([], {
      queryParams: filter,
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  public onFetchError(error) {
    this.snackBar.open(this.extractErrorMessage(error), 'Dismiss', {
      duration: 5000,
    });
    console.error(error);
    this.dataLoaded.set(true);
  }

  public onDataReceived(paged: PagedListDto<T>) {
    this.dataSource.data = paged.docs;
    this.totalItems = paged.totalDocs;
    this.dataLoaded.set(true);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numRows !== 0 && numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.selection.selected.length) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  public abstract load($event: { pageIndex: number; pageSize?: number });
  public abstract buildForm(): void;
  public abstract setColumns(): void;
}
