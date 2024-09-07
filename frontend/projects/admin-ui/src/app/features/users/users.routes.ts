import { Route } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';
import { isLoggedIn } from '../../../../../common-ui/auth/is-logged-in.guard';
import { UserRoleEnum } from '@app/contracts';

export const routes: Route[] = [
  {
    path: 'list',
    component: UsersListComponent,
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Users List',
    },
  },
  {
    path: 'create',
    component: UserComponent,
    data: {
      title: 'Create User',
      roles: [UserRoleEnum.Admin],
    },
  },
  {
    path: ':id',
    component: UserComponent,
    data: {
      title: 'Edit User',
      roles: [UserRoleEnum.Admin],
    },
  },
];
