import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form: FormGroup;
  errorMessage: string = ''

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.initForm();
  }
  initForm() {
    return this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.value;

    this.authService.login(val).subscribe(
      {
        next: (responseData) => {
          console.log('responseData', responseData);
          localStorage.setItem('token', responseData.token);
          this.authService.currentUserSig.set(responseData.user);
          this.router.navigate(['./users-list']);
          console.log(this.authService.currentUserSig().userName);
        },
      }
    );
    this.form.reset();
  }
}
