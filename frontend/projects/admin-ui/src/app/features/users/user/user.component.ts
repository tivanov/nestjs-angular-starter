import { UserRoleEnum, UserDto } from '@app/contracts';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../../../../common-ui/services/users.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginRecordsListComponent } from '../login-records-list/login-records-list.component';
import { HasErrorDirective } from '../../../../../../common-ui/directives/has-error.directive';
import { HasErrorRootDirective } from '../../../../../../common-ui/directives/has-error-root.directive';
import { BaseEditComponent } from '../../../../../../common-ui/base/base-edit.component';
import { finalize, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { HttpEventType } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EnvironmentService } from '../../../../../../common-ui/services/environment.service';

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
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent extends BaseEditComponent<UserDto> {
  changePasswordForm: FormGroup;

  roles = Object.values(UserRoleEnum);

  avatarFile: File;
  uploadProgress: number;
  uploadSub: Subscription;

  private usersService = inject(UsersService);
  public env = inject(EnvironmentService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.changePasswordForm = this.initPasswordForm();
  }

  load(id: string) {
    this.usersService.getById(id).subscribe({
      next: this.onUserLoaded.bind(this),
      error: (err) => {
        this.snackBar.open(this.extractErrorMessage(err), 'Close', {
          duration: 5000,
        });
        console.error(err);
      },
    });
  }

  onUserLoaded(user: UserDto) {
    this.entity = user;
    this.form.patchValue(user);
    this.form.get('password').clearValidators();
    this.form.get('password').disable();
    this.form.get('role').disable();
    this.form.get('userName').disable();

    if (user.lastLogin) {
      this.form.get('lastLogin').setValue(new Date(user.lastLogin));
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
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
    return this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  changePassword() {
    if (!this.entity) {
      return;
    }

    const command = this.changePasswordForm.getRawValue();
    this.usersService.changePassword(this.entity.id, command).subscribe({
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

  save() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.getRawValue();

    if (val.id) {
      this.usersService.updateBasicData(val.id, val).subscribe({
        next: () => {
          this.snackBar.open('User updated', 'Close', { duration: 2000 });
          this.exit();
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
          this.snackBar.open('User created', 'Close', { duration: 2000 });
          this.exit();
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

  override reset() {
    if (this.entity) {
      this.onUserLoaded(this.entity);
    } else {
      this.form.reset();
    }
  }

  onFileSelected(event) {
    this.avatarFile = event.target.files[0];
  }

  uploadAvatar() {
    if (!this.avatarFile || !this.entity) {
      return;
    }

    this.uploadSub = this.usersService
      .uploadAvatar(this.entity?.id, this.avatarFile)
      .pipe(
        finalize(() => {
          this.snackBar.open('Avatar uploaded', 'Close', { duration: 2000 });
          this.load(this.entity.id);
        })
      )
      .subscribe({
        next: (event) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(
              100 * (event.loaded / event.total)
            );
          }
        },
        error: (err) => {
          this.snackBar.open(this.extractErrorMessage(err), 'Close', {
            duration: 5000,
          });
          console.error(err);
        },
      });
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
