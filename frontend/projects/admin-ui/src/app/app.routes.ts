import { Routes } from '@angular/router';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [

    {
        path: 'auth',
        component: LoginComponent
    },

    {
        path: 'users-list',
        component: LayoutComponent,

        loadChildren: () => import('./components/users/users.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: 'auth'
    }


];
