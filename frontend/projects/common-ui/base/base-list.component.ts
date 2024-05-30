import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BaseComponent } from './base.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    template: '',
    standalone: true,
})
export abstract class BaseListComponent<T> extends BaseComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [];
  totalItems;
  pageSizeOptions = [10, 100, 200];

  protected filterForm: FormGroup;

  dataSource = new MatTableDataSource<T>();

  formBuilder: FormBuilder;

  @ViewChild('mainPaginator') paginator: MatPaginator;


  public constructor() {
    super();
    this.formBuilder = inject(FormBuilder);
  }
  ngAfterViewInit(): void {
    // placeholder, call it if you inherit from this class
  }

  ngOnInit(): void {
    this.buildForm();
  }

  
  public abstract load($event: { pageIndex: any; pageSize?: any; });
  public abstract buildForm(): void;
}
