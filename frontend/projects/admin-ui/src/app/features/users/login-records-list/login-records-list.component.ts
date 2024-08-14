import { LoginRecordDto, PagedListDto } from '@app/contracts';
import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { MatSelectModule } from '@angular/material/select';
import { LoginRecordsService } from '../../../../../../common-ui/services/login-records.service';

@Component({
  selector: 'app-login-records-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
  ],
  templateUrl: './login-records-list.component.html',
  styleUrl: './login-records-list.component.scss',
})
export class LoginRecordsListComponent
  extends BaseListComponent<LoginRecordDto>
  implements OnInit, AfterViewInit
{
  @Input('userId') userId: string;

  isPhonePortrait = false;

  defaultColumns = [
    'createdAt',
    'ip',
    'country',
    'client',
    'device',
    'isBot',
    'user',
  ];
  mobuleColumns = ['createdAt', 'ip', 'country'];

  constructor(
    private loginRecordsService: LoginRecordsService,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver,
    private fb: FormBuilder
  ) {
    super();
    this.displayedColumns = this.defaultColumns;
    this.pageSizeOptions = [10, 25, 100];
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.filterForm.patchValue({ userId: this.userId });
    this.load({ pageIndex: 0 });

    this.responsive
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(map((result) => result.breakpoints))
      .subscribe((breakpoints) => {
        this.isPhonePortrait = breakpoints[Breakpoints.HandsetPortrait];
        this.displayedColumns = this.isPhonePortrait
          ? this.mobuleColumns
          : this.displayedColumns;
      });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  buildForm(): void {
    this.filterForm = this.fb.group({
      userId: [],
    });
  }

  public load($event: { pageIndex: any; pageSize?: any }) {
    const filter = this.filterForm.value;
    filter.page = $event.pageIndex + 1;
    filter.limit =
      $event.pageSize || this.paginator?.pageSize || this.pageSizeOptions[0];
    filter.sortBy = 'createdAt';
    filter.sortDirection = 'desc';

    this.loginRecordsService
      .get(filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((paged: PagedListDto<LoginRecordDto>) => {
        this.dataSource.data = paged.docs;
        this.totalItems = paged.totalDocs;
      });
  }
}
