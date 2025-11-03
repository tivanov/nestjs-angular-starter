import { Route } from '@angular/router';
import { UserRoleEnum } from '@app/contracts';
import { hasRole } from '../../../../../common-ui/auth/has-role.guard';
import { isLoggedIn } from '../../../../../common-ui/auth/is-logged-in.guard';
import { SystemSettingsComponent } from './system-settings.component';

export const routes: Route[] = [
  {
    path: '',
    component: SystemSettingsComponent,
    canActivate: [isLoggedIn, hasRole],
    data: {
      title: 'System Settings',
      roles: [UserRoleEnum.Admin],
    },
  },
];
