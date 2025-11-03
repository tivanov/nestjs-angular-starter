import { Route } from '@angular/router';
import { UserRoleEnum } from '@app/contracts';
import { CircuitBreakerComponent } from './circuit-breaker/circuit-breaker.component';
import { CircuitBreakersListComponent } from './circuit-breakers-list/circuit-breakers-list.component';

export const routes: Route[] = [
  {
    path: 'list',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Circuit Breakers List',
    },
    component: CircuitBreakersListComponent,
  },
  {
    path: ':id',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Circuit Breaker',
    },
    component: CircuitBreakerComponent,
  },
];
