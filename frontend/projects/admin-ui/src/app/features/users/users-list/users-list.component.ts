import { GetUsersQuery, UserDto, UserRoleEnum } from '@app/contracts';
import { RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../../../../common-ui/services/users.service';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';

@Component({
    selector: 'app-users-list',
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
        MatSortModule,
        SpinnerComponent,
    ],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.scss'
})
export class UsersListComponent extends BaseListComponent<UserDto> {
  roles = Object.values(UserRoleEnum);

  private usersService = inject(UsersService);

  override setColumns(): void {
    this.defaultColumns = [
      'userName',
      'firstName',
      'lastName',
      'role',
      'createdAt',
      'actions',
    ];
    this.mobileColumns = ['userName', 'role', 'actions'];
  }

  buildForm(): void {
    this.filterForm = this.formBuilder.group({
      userName: ['', [Validators.maxLength(100), Validators.minLength(3)]],
      role: [],
      searchQuery: [null, Validators.maxLength(200)],
    });
  }

  onDelete(user: UserDto): void {
    if (confirm('Are you sure to delete this record?')) {
      this.dataLoaded = false;
      this.usersService.delete(user.id).subscribe({
        next: () => {
          this.dataLoaded = true;
          this.load({ pageIndex: 0 });
          this.snackBar.open('Record deleted.', '', { duration: 2000 });
        },
        error: this.onFetchError.bind(this),
      });
    }
  }

  public load($event: { pageIndex: any; pageSize?: any }) {
    this.dataLoaded = false;
    const filter: GetUsersQuery = this.populateShapeableQuery($event);

    this.usersService
      .get(filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (paged) => {
          this.dataSource.data = paged.docs;
          this.totalItems = paged.totalDocs;
          this.setQueryParams(filter);
          this.dataLoaded = true;
        },
        error: this.onFetchError.bind(this),
      });
  }
}
