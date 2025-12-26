import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  AuthSignal,
  logIn,
} from '../../../../../../common-ui/auth/auth.signal';
import { BaseComponent } from '../../../../../../common-ui/base/base.component';
import { AuthService } from '../../../../../../common-ui/auth/auth.service';
import { UserRoleEnum } from '@app/contracts';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  errorMessage = signal<string>('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.initForm();
    if (AuthSignal().isAuthenticated) {
      this.redirect();
    }
  }

  initForm() {
    return this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.value;

    try {
      this.dataLoaded.set(false);
      const loginResponse = await firstValueFrom(this.authService.login(val));
      if (
        loginResponse.user.role !== UserRoleEnum.Admin &&
        loginResponse.user.role !== UserRoleEnum.Manager
      ) {
        this.errorMessage.set('Login not allowed.');
        return;
      }
      logIn(loginResponse);
      this.form.reset();
      this.redirect();
    } catch (error) {
      this.errorMessage.set(this.extractErrorMessage(error));
    } finally {
      this.dataLoaded.set(true);
    }
  }

  redirect() {
    this.router.navigate(['./dashboard']);
  }
}
