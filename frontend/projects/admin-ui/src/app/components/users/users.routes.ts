import { Route } from "@angular/router";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserComponent } from './user/user.component';
import { isLoggedIn } from "../../../../../common-ui/auth/is-logged-in.guard";


export const routes: Route[] = [
    {
        path: '',
        component: UsersListComponent,
        canActivate: [isLoggedIn],
        providers: []
    },
    {
        path: 'create',
        canActivate: [isLoggedIn],
        component: UserComponent
    },
    {
        path: ':id',
        canActivate: [isLoggedIn],
        component: UserComponent
    },

]