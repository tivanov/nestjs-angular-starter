import { RouterModule } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../../../services/users.service';
import { DialogService } from '../../../services/dialog.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, merge, of as observableOf } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  usersDs = new MatTableDataSource<User>();
  selectedKey!: string;
  isPhonePortrait = false;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50, 100];
  landscape = window.matchMedia("(orientation: landscape)");

  dialogMessage = 'Are you sure to delete this record';

  displayedColumns = ['firstName', 'userName', 'role', 'actions'];

  @ViewChild('usersPaginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchValue: string = '';
  searchForm = this.fb.nonNullable.group({
    searchValue: ''
  })

  constructor(
    private usersService: UsersService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadUsers();

    this.responsive.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe()
      .subscribe(result => {
        let newDisplayColumns = ['firstName', 'userName', 'role', 'actions'];
        const breakpoints = result.breakpoints;
        this.isPhonePortrait = false;

        if (breakpoints[Breakpoints.HandsetPortrait]) {
          console.log("screens matches HandsetPortrait");
          this.isPhonePortrait = true;
          newDisplayColumns = ['userName', 'role', 'actions'];
        }
        else if (breakpoints[Breakpoints.HandsetLandscape]) {
          newDisplayColumns = ['userName', 'role', 'actions'];
        }

        this.displayedColumns = newDisplayColumns;
      });
  }

  ngAfterViewInit(): void {
    this.usersDs.paginator = this.paginator;
    this.usersDs.sort = this.sort;
  }

  onDelete(row: any) {
    this.dialogService.openConfirmDialog(this.dialogMessage).afterClosed().subscribe(response => {
      console.log(response);
      if (response) {
        this.usersService.delete(row.id).pipe()
          .subscribe({
            next: () => {
              this.loadUsers();
              let snackBarRef = this.snackBar.open('Are you sure you want to delete this record?', 'Undo', { duration: 5000 })
              snackBarRef.onAction()
                .pipe()
                .subscribe(() => {
                  this.usersService.create(row).subscribe();
                  this.loadUsers();
                });
            }
          }
          )
      }
    })
  }

  connect(): Observable<User[]> {
    if (this.paginator && this.sort) {
      return merge(observableOf(this.usersDs), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([... this.usersDs.data]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  private getPagedData(data: User[]): User[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: User[]): User[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'firstName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'userName': return this.compare(a.userName, b.userName, isAsc);
        case 'role': return this.compare(a.role, b.role, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onClick() {
    console.log('OnClick e kliknato')
  }

  onSearchSubmit(): void {
    this.searchValue = this.searchForm.value.searchValue ?? '';
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers(1, 100)
      .pipe()
      .subscribe({
        next: (users: any) => {
          this.usersDs.data = users.docs;
          console.log(users);
        },
      }
      )
  }

}
