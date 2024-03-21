import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

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
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.form = this.initForm();
  }
  initForm() {
    return this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.value;

    //  this.authService.login(val).subscribe(
    //  {
    //    next: (responseData) => {
    //      console.log('responseData', responseData);
    //      this.router.navigate(['./jackpots-list'])
    //    },
    //  }
    //  );
    this.form.reset();
  }
}
