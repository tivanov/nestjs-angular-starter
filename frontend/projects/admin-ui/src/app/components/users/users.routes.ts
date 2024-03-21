import { Route } from "@angular/router";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserComponent } from './user/user.component';


export const routes: Route[] = [
    {
        path: '',
        component: UsersListComponent,
        providers: []
    },
    {
        path: 'create',
        component: UserComponent
    },
    {
        path: ':id',
        component: UserComponent
    },

]