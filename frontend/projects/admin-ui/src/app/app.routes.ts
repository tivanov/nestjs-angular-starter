import { UserRoleEnum } from '@app/contracts';
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { isLoggedIn } from '../../../common-ui/auth/is-logged-in.guard';
import { hasRole } from '../../../common-ui/auth/has-role.guard';

export const routes: Routes = [

    {
        path: 'auth',
        component: LoginComponent,        
    },

    {
        path: 'users',
        component: LayoutComponent,
        data: {
            roles: [UserRoleEnum.Admin]
        },
        canActivate: [isLoggedIn, hasRole],
        canActivateChild: [isLoggedIn, hasRole], 
        loadChildren: () => import('./components/users/users.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: 'auth'
    }


];
