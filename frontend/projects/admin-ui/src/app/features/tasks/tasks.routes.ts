import { Route } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { UserRoleEnum } from '@app/contracts';
import { TaskComponent } from './task/task.component';
import { TaskLogsListComponent } from './task-logs-list/task-logs-list.component';
import { TaskLogComponent } from './task-log/task-log.component';

export const routes: Route[] = [
  {
    path: 'create',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Create Task',
    },
    component: TaskComponent,
  },
  {
    path: 'list',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Tasks',
    },
    component: TasksListComponent,
  },
  {
    path: 'logs',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Task Logs',
    },
    component: TaskLogsListComponent,
  },
  {
    path: 'logs/:id',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Task Log Entry',
    },
    component: TaskLogComponent,
  },
  {
    path: ':id',
    data: {
      roles: [UserRoleEnum.Admin],
      title: 'Edit Task',
    },
    component: TaskComponent,
  },
];
