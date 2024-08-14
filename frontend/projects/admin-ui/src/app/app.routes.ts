import { UserRoleEnum } from '@app/contracts';
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { isLoggedIn } from '../../../common-ui/auth/is-logged-in.guard';
import { hasRole } from '../../../common-ui/auth/has-role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    data: {
      roles: [UserRoleEnum.Admin, UserRoleEnum.Manager],
    },
    canActivate: [isLoggedIn, hasRole],
    canActivateChild: [isLoggedIn, hasRole],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.routes),
  },
  {
    path: 'users',
    component: LayoutComponent,
    data: {
      roles: [UserRoleEnum.Admin],
    },
    canActivate: [isLoggedIn, hasRole],
    canActivateChild: [isLoggedIn, hasRole],
    loadChildren: () =>
      import('./features/users/users.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
