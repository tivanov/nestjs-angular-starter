import { Route } from '@angular/router';
import { UserRoleEnum } from '@app/contracts';
import { hasRole } from '../../../../../common-ui/auth/has-role.guard';
import { isLoggedIn } from '../../../../../common-ui/auth/is-logged-in.guard';
import { SystemHealthComponent } from './system-health.component';

export const routes: Route[] = [
  {
    path: '',
    component: SystemHealthComponent,
    canActivate: [isLoggedIn, hasRole],
    data: {
      title: 'System Health',
      roles: [UserRoleEnum.Admin],
    },
  },
];
