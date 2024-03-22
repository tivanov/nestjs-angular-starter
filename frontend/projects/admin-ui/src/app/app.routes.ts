import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { isLoggedIn } from '../../../common-ui/auth/is-logged-in.guard';

export const routes: Routes = [

    {
        path: 'auth',
        component: LoginComponent,        
    },

    {
        path: 'users-list',
        component: LayoutComponent,
        canActivate: [isLoggedIn],
        canActivateChild: [isLoggedIn], 
        loadChildren: () => import('./components/users/users.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: 'auth'
    }


];
