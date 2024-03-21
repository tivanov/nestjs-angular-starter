import { RouterModule } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  isPhonePortrait = false;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50, 100];
  displayedColumns = ['userName', 'role', 'actions'];
  searchValue: string = '';
  searchForm: FormGroup;

  @ViewChild('usersPaginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usersService: UsersService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar,
    private responsive: BreakpointObserver,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchValue: ''
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    this.responsive.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(map(result => result.breakpoints))
      .subscribe(breakpoints => {
        this.isPhonePortrait = breakpoints[Breakpoints.HandsetPortrait];
        this.displayedColumns = this.isPhonePortrait ? ['userName', 'role', 'actions'] : ['firstName', 'userName', 'role', 'actions'];
      });
  }

  ngAfterViewInit(): void {
    this.usersDs.paginator = this.paginator;
    this.usersDs.sort = this.sort;
  }

  onDelete(user: User): void {
    const dialogRef = this.dialogService.openConfirmDialog('Are you sure to delete this record');
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.usersService.delete(user.id).subscribe(() => {
          this.loadUsers(); // Assuming this method reloads the user list
          this.snackBar.open('Record deleted.', '', { duration: 2000 });
        });
      }
    });
  }



  connect(): Observable<User[]> {
    return merge(observableOf(this.usersDs), this.paginator.page, this.sort.sortChange)
      .pipe(
        map(() => this.getPagedData(this.getSortedData([...this.usersDs.data])))
      );
  }

  private getPagedData(data: User[]): User[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  private getSortedData(data: User[]): User[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'firstName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'userName': return this.compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onSearchSubmit(): void {
    this.searchValue = this.searchForm.value.searchValue || '';
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers(1, 100).subscribe((users: any) => {
      this.usersDs.data = users.docs;
    });
  }

}
