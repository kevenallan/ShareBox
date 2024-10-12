import { UsuarioService } from './../../core/services/usuario.service';
import { AlertService } from './../../core/services/alert.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Usuario } from '../../core/models/usuario.model';
import { FormsModule } from '@angular/forms';

//PRIMENG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { LoginDTO } from '../../core/dto/login.dto';
import { AuthService } from '../../core/services/auth.service';
import { DialogModule } from 'primeng/dialog';

import {
    Auth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from '@angular/fire/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        //PRIMENG
        ButtonModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        DialogModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    usuario: Usuario = new Usuario();
    visible = false;
    emailRecuperarSenha = '';

    constructor(
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router,
        private auth: Auth
    ) {}

    login() {
        if (
            this.usuario.usuario == undefined ||
            this.usuario.senha == undefined
        ) {
            this.alertService.showWarningAlert(
                'Preencha os campos de Usuário e Senha!'
            );
            return;
        }
        this.usuarioService
            .login(this.usuario)
            .subscribe((response: LoginDTO) => {
                if (response) {
                    const usuarioLogado: LoginDTO = response;
                    if (usuarioLogado) {
                        const token = usuarioLogado.token;
                        if (token) {
                            this.authService.setTokenStorage(token);
                            this.router.navigate(['/inicio']);
                        }
                    } else {
                        this.alertService.showErrorAlert(
                            'Usuário ou Senha inválido.'
                        );
                    }
                }
            });
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            console.log('Usuário logado: ', result.user);
            const user = result.user;
            if (user) {
                this.usuarioService
                    .loginGoogle(user.uid)
                    .subscribe((response: LoginDTO) => {
                        if (response) {
                            const usuarioLogado: LoginDTO = response;
                            if (usuarioLogado) {
                                const token = usuarioLogado.token;
                                if (token) {
                                    this.authService.setTokenStorage(token);
                                    this.router.navigate(['/inicio']);
                                }
                            } else {
                                this.alertService.showErrorAlert(
                                    'Usuário ou Senha inválido.'
                                );
                            }
                        }
                    });
            }
        } catch (error) {
            console.error('Erro ao fazer login com Google: ', error);
        }
    }

    abrirDialogEsquecerSenha() {
        this.emailRecuperarSenha = '';
        this.visible = true;
    }

    async esqueceuASenha() {
        if (this.emailRecuperarSenha !== '') {
            await this.usuarioService.esqueceuASenha(this.emailRecuperarSenha);
        }
        this.visible = false;
    }

    telaCadastro() {
        this.router.navigate(['/cadastro']);
    }
}
