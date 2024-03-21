import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { UserRoleItem } from '../../../models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule,
    MatOptionModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  userId: string | null = null;

  form: FormGroup;
  initialFormValue: any;

  roles: UserRoleItem[] = [UserRoleItem.admin, UserRoleItem.regular];

  constructor(private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute) {
    this.form = this.initForm();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe()
      .subscribe({
        next: data => {
          if (data.get('id')) {
            console.log(data);
            this.userId = data.get('id');
            this.loadUser();
            console.log(this.userId);
          }
        }
      })
  }

  loadUser() {
    this.usersService.getOne(this.userId)
      .pipe()
      .subscribe({
        next: (users: any) => {
          console.log(users);
          this.form.patchValue(users);
          this.initialFormValue = this.form.value;
        }
        // error: error => this.snackbar.open('There was an error', this.translate.instant('Dismiss'), {duration: 8000})
      });
  }

  initForm() {
    return this.fb.group({
      _id: [],
      firstName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.value;

    if (this.userId) {
      // UPDATE User
      val._id = this.userId;
      this.usersService.update(this.userId, val).subscribe(
        {
          next: (responseData) => {
            console.log('responseData', responseData);
            this.router.navigate(['./users-list'])
          },

          error: err => {
            console.log(err)
          },
        }
      );
    } else {
      this.usersService.create(val).subscribe(
        {
          next: (responseData) => {
            console.log('responseData', responseData);
            this.router.navigate(['./users-list'])
          },

          error: err => {
            console.log(err)
          },
        }
      );
    }
  }

  clearUserEnteredData() {

    if (this.userId) {
      console.log(this.initialFormValue);
      this.form.patchValue(this.initialFormValue);
    } else {
      this.form.reset();
    }
  }

  exitRoute() {
    this.router.navigate(['/users-list']);
  }

}
