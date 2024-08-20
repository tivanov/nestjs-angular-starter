import { GetUsersQuery, UserDto, UserRoleEnum } from '@app/contracts';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, of as observableOf, take, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../../../../common-ui/services/users.service';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-users-list',
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
    MatSortModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent
  extends BaseListComponent<UserDto>
  implements OnInit
{
  roles = Object.values(UserRoleEnum);

  isPhonePortrait = false;

  defaultColumns = ['userName', 'firstName', 'lastName', 'role', 'actions'];
  mobuleColumns = ['userName', 'role', 'actions'];

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.displayedColumns = this.defaultColumns;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.queryParams.pipe(take(1)).subscribe((queryParams) => {
      this.filterForm.patchValue(queryParams);
      this.load({ pageIndex: (queryParams['page'] - 1) | 0 });
    });

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

  buildForm(): void {
    this.filterForm = this.fb.group({
      userName: ['', [Validators.maxLength(100), Validators.minLength(3)]],
      role: [],
      searchQuery: [null, Validators.maxLength(200)],
    });
  }

  onDelete(user: UserDto): void {
    if (confirm('Are you sure to delete this record?')) {
      this.usersService.delete(user.id).subscribe({
        next: () => {
          this.load({ pageIndex: 0 });
          this.snackBar.open('Record deleted.', '', { duration: 2000 });
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(this.extractErrorMessage(error), '', {
            duration: 5000,
          });
        },
      });
    }
  }

  public load($event: { pageIndex: any; pageSize?: any }) {
    const filter: GetUsersQuery = this.filterForm.value;
    filter.sortBy = this.sortBy;
    filter.sortDirection = this.sortDirection;
    filter.page = $event.pageIndex + 1;
    filter.limit =
      $event.pageSize || this.paginator?.pageSize || this.pageSizeOptions[0];

    this.usersService
      .get(filter)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (paged) => {
          this.dataSource.data = paged.docs;
          this.totalItems = paged.totalDocs;

          this.router.navigate([], {
            queryParams: filter,
            relativeTo: this.route,
            // NOTE: By using the replaceUrl option, we don't increase the Browser's
            // history depth with every filtering keystroke. This way, the List-View
            // remains a single item in the Browser's history, which allows the back
            // button to function much more naturally for the user.
            replaceUrl: true,
          });
        },
        error: (error: any) => {
          console.error(error);
          this.snackBar.open(this.extractErrorMessage(error), '', {
            duration: 5000,
          });
        },
      });
  }
}
