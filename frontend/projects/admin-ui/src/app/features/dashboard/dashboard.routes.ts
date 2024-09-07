import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserRoleEnum } from '@app/contracts';

export const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      roles: [UserRoleEnum.Admin, UserRoleEnum.Manager],
    },
  },
];
