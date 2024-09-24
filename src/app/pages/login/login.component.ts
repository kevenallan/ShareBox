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
        PasswordModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    usuario: Usuario = new Usuario();

    constructor(
        private usuarioService: UsuarioService,
        private alertService: AlertService,
        private router: Router
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
        this.usuarioService.login(this.usuario).subscribe(
            (response: LoginDTO) => {
                if (response) {
                    const usuarioLogado: LoginDTO = response;
                    if (usuarioLogado) {
                        const token = usuarioLogado.token;
                        if (token) {
                            sessionStorage.setItem('token', token);
                        }
                        this.router.navigate(['/inicio']);
                    } else {
                        this.alertService.showErrorAlert(
                            'Usuário ou Senha inválido.'
                        );
                    }
                }
            },
            (error) => {
                this.alertService.showErrorAlert('ERROR LOGIN');
                console.error(error);
            }
        );
    }

    telaCadastro() {
        this.router.navigate(['/cadastro']);
    }
}
