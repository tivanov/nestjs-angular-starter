import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { logIn } from '../../../../../common-ui/auth/auth.signal';
import { BaseComponent } from '../../../../../common-ui/base/base.component';
import { AuthService } from '../../../../../common-ui/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  errorMessage: string = ''

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    super();    
  }

  ngOnInit(): void {
    this.form = this.initForm();
  }

  initForm() {
    return this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.value;

    try {
      const loginResponse = await firstValueFrom(this.authService.login(val));
      logIn(loginResponse);
      this.form.reset();
      this.router.navigate(['./users-list']);      
    } catch (error) {
      this.errorMessage = error.message;
    }
  }
}
