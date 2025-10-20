import { Route } from '@angular/router';
import { UserRoleEnum } from '@app/contracts';
import { ContactRequestComponent } from './contact-request/contact-request.component';
import { ContactRequestsListComponent } from './contact-requests-list/contact-requests-list.component';

export const routes: Route[] = [
  {
    path: 'list',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Contact Requests',
    },
    component: ContactRequestsListComponent,
  },
  {
    path: ':id',
    data: { roles: [UserRoleEnum.Admin], title: 'Contact Request' },
    component: ContactRequestComponent,
  },
];
