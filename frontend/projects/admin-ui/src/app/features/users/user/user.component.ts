import { UserRoleEnum, UserDto } from '@app/contracts';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../../../../common-ui/services/users.service';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginRecordsListComponent } from '../login-records-list/login-records-list.component';
import { HasErrorDirective } from '../../../../../../common-ui/directives/has-error.directive';
import { HasErrorRootDirective } from '../../../../../../common-ui/directives/has-error-root.directive';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    LoginRecordsListComponent,
    HasErrorDirective,
    HasErrorRootDirective,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent extends BaseComponent {
  userId: string | null = null;

  form: FormGroup;
  changePasswordForm: FormGroup;
  user: UserDto;

  roles = Object.values(UserRoleEnum);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.initForm();
    this.changePasswordForm = this.initPasswordForm();
    this.activatedRoute.paramMap.pipe().subscribe({
      next: (data) => {
        if (data.get('id')) {
          this.userId = data.get('id');
          this.loadUser();
        }
      },
    });
  }

  loadUser() {
    this.usersService
      .getById(this.userId)
      .pipe()
      .subscribe({
        next: (user) => {
          this.onUserLoaded(user);
        },
        error: (err) => {
          this.snackBar.open(this.extractErrorMessage(err), 'Close', {
            duration: 5000,
          });
          console.error(err);
        },
      });
  }

  onUserLoaded(user: UserDto) {
    this.user = user;
    this.form.patchValue(user);
    this.form.get('password').clearValidators();
    this.form.get('password').disable();
    this.form.get('role').disable();
    this.form.get('userName').disable();

    this.user = user;
    this.form.patchValue(user);
    this.form.get('password').clearValidators();
    this.form.get('password').disable();
    this.form.get('role').disable();
    this.form.get('userName').disable();

    if (user.lastLogin) {
      this.form.get('lastLogin').setValue(new Date(user.lastLogin));
    }
  }

  initForm() {
    return this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: [, [Validators.maxLength(200)]],
      lastName: [, [Validators.maxLength(200)]],
      userName: [, [Validators.required, Validators.minLength(5)]],
      password: [, [Validators.minLength(6)]],
      email: [, [Validators.email]],
      phone: [, [Validators.maxLength(200)]],
      address: [, [Validators.maxLength(1000)]],
      role: [, Validators.required],
      lastLogin: [{ value: null, disabled: true }],
      country: [{ value: null, disabled: true }],
    });
  }

  initPasswordForm() {
    return this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  changePassword() {
    const command = this.changePasswordForm.getRawValue();
    this.usersService.changePassword(this.userId, command).subscribe({
      next: (user) => {
        this.snackBar.open('Password changed', 'Close', { duration: 2000 });
        this.onUserLoaded(user);
      },
      error: (err) => {
        this.snackBar.open(this.extractErrorMessage(err), 'Close', {
          duration: 5000,
        });
      },
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.getRawValue();

    if (val.id) {
      this.usersService.updateBasicData(val.id, val).subscribe({
        next: (responseData) => {
          this.router.navigate(['./users/list']);
        },

        error: (err) => {
          this.snackBar.open(this.extractErrorMessage(err), 'Close', {
            duration: 5000,
          });
          console.error(err);
        },
      });
    } else {
      if (!val.password) {
        this.snackBar.open('Password is required', '', { duration: 2000 });
        return;
      }
      this.usersService.create(val).subscribe({
        next: (responseData) => {
          this.router.navigate(['./users/list']);
        },

        error: (err) => {
          this.snackBar.open(this.extractErrorMessage(err), 'Close', {
            duration: 5000,
          });
          console.error(err);
        },
      });
    }
  }

  clearUserEnteredData() {
    if (this.user) {
      this.onUserLoaded(this.user);
    } else {
      this.form.reset();
    }
  }

  exitRoute() {
    this.router.navigate(['/users/list']);
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get userName() {
    return this.form.get('userName') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }
}
