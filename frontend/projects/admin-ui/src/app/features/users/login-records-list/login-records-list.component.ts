import { LoginRecordDto, PagedListDto } from '@app/contracts';
import { RouterModule } from '@angular/router';
import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { takeUntil } from 'rxjs';
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

  private loginRecordsService = inject(LoginRecordsService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.filterForm.patchValue({ userId: this.userId });
    this.load({ pageIndex: 0 });
  }

  public override setColumns(): void {
    this.defaultColumns = [
      'createdAt',
      'ip',
      'country',
      'client',
      'device',
      'isBot',
      'user',
    ];
    this.mobileColumns = ['createdAt', 'ip', 'country'];
  }

  buildForm(): void {
    this.filterForm = this.formBuilder.group({
      userId: [],
    });
  }

  public load($event: { pageIndex: any; pageSize?: any }) {
    const filter = this.populateShapeableQuery($event);

    this.loginRecordsService
      .get(filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (paged: PagedListDto<LoginRecordDto>) => {
          this.dataSource.data = paged.docs;
          this.totalItems = paged.totalDocs;
        },
        error: this.onFetchError.bind(this),
      });
  }
}
