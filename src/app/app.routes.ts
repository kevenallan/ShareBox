import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';
import { CadastroAtualizacaoUsuarioComponent } from './pages/cadastro-atualizacao-usuario/cadastro-atualizacao-usuario.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'cadastro',
        component: CadastroAtualizacaoUsuarioComponent
    },
    {
        path: 'inicio',
        component: PrincipalComponent,
        canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: '/login' }
];
