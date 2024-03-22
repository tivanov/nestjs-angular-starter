import { UserDto, UserRoleEnum } from '@app/contracts';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DialogService } from '../../../services/dialog.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, merge, of as observableOf, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../../../../common-ui/services/users.service';
import { BaseListComponent } from '../../../../../../common-ui/base/base-list.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule,
    MatSelectModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent extends BaseListComponent<UserDto> implements OnInit{
  roles = Object.values(UserRoleEnum)

  isPhonePortrait = false;

  constructor(
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver,
    private fb: FormBuilder
  ) {
    super();    
    this.displayedColumns = ['userName', 'role', 'actions'];

  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.load({ pageIndex: 0 });

    this.responsive.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(map(result => result.breakpoints))
      .subscribe(breakpoints => {
        this.isPhonePortrait = breakpoints[Breakpoints.HandsetPortrait];
        this.displayedColumns = this.isPhonePortrait ? ['userName', 'role', 'actions'] : ['firstName', 'userName', 'role', 'actions'];
      });
  }

  buildForm(): void {
    this.filterForm = this.fb.group({
      userName: ['', [Validators.maxLength(100), Validators.minLength(3)]],
      role: [],
    });
  }

  onDelete(user: UserDto): void {
    if (confirm('Are you sure to delete this record?')) {
      this.usersService.delete(user.id).subscribe(() => {
        this.load({pageIndex: 0}); // Assuming this method reloads the user list
        this.snackBar.open('Record deleted.', '', { duration: 2000 });
      });
    }

    // const dialogRef = this.dialogService.openConfirmDialog('Are you sure to delete this record');
    // dialogRef.afterClosed().subscribe(response => {
    //   if (response) {
    //     this.usersService.delete(user.id).subscribe(() => {
    //       this.load({pageIndex: 0}); // Assuming this method reloads the user list
    //       this.snackBar.open('Record deleted.', '', { duration: 2000 });
    //     });
    //   }
    // });
  }

  public load($event: { pageIndex: any; pageSize?: any; }) {
    const filter = this.filterForm.value;
    filter.page = $event.pageIndex + 1;
    filter.limit = $event.pageSize || this.itemsPerPage;

    this.usersService.get(filter)
    .pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((users: any) => {
      this.dataSource.data = users.docs;
    });
  }

}
