import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'inicio',
        component: PrincipalComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/login' }
];
