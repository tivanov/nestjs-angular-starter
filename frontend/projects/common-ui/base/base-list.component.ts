import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BaseComponent } from './base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  template: '',
  standalone: true,
})
export abstract class BaseListComponent<T>
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: string[] = [];

  totalItems;
  pageSizeOptions = [10, 100, 200];
  showFirstLastButtons = true;

  protected filterForm: FormGroup;

  dataSource = new MatTableDataSource<T>();

  formBuilder: FormBuilder;

  sortBy: string;
  sortDirection: string;

  @ViewChild('mainPaginator') paginator: MatPaginator;

  public constructor() {
    super();
    this.formBuilder = inject(FormBuilder);
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.buildForm();
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

  public abstract load($event: { pageIndex: number; pageSize?: number });
  public abstract buildForm(): void;
}
