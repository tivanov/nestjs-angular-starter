import { Route } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';
import { isLoggedIn } from '../../../../../common-ui/auth/is-logged-in.guard';

export const routes: Route[] = [
  {
    path: 'list',
    component: UsersListComponent,
    data: {
      title: 'Users List',
    },
  },
  {
    path: 'create',
    component: UserComponent,
    data: {
      title: 'Create User',
    },
  },
  {
    path: ':id',
    component: UserComponent,
    data: {
      title: 'Edit User',
    },
  },
];
