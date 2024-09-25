import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';
import { AuthService } from '../../core/services/auth.service';
import { LoginDTO } from '../../core/dto/login.dto';
import { AlertService } from '../../core/services/alert.service';

@Component({
    selector: 'app-cadastro-atualizacao-usuario',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        //PRIMENG
        ButtonModule,
        TooltipModule
    ],
    templateUrl: './cadastro-atualizacao-usuario.component.html',
    styleUrl: './cadastro-atualizacao-usuario.component.scss'
})
export class CadastroAtualizacaoUsuarioComponent {
    cadastroForm: FormGroup;
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.cadastroForm = this.formBuilder.group(
            {
                nome: ['', Validators.required],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.email,
                        Validators.pattern(
                            '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
                        )
                    ]
                ],
                usuario: ['', [Validators.required, Validators.minLength(3)]],
                senha: ['', [Validators.required, Validators.minLength(6)]],
                confirmarSenha: ['', Validators.required]
            },
            { validators: this.senhasIguais }
        );
    }

    senhasIguais(formGroup: FormGroup) {
        return formGroup.get('senha')?.value ===
            formGroup.get('confirmarSenha')?.value
            ? null
            : { senhasDiferentes: true };
    }

    onSubmit() {
        if (this.cadastroForm.valid) {
            this.cadastrar();
        } else {
            // Marcar todos os campos como "tocados" para mostrar mensagens de erro
            this.cadastroForm.markAllAsTouched();
        }
    }

    voltar() {
        this.router.navigate(['/login']);
    }

    cadastrar() {
        const form = this.cadastroForm;

        const usuario: Usuario = {
            nome: form.get('nome')?.value,
            email: form.get('email')?.value,
            usuario: form.get('usuario')?.value,
            senha: form.get('senha')?.value
        };

        this.usuarioService.cadastro(usuario).subscribe(
            (loginDTO: LoginDTO) => {
                if (loginDTO.token) {
                    this.authService.setTokenStorage(loginDTO.token);
                    this.router.navigate(['/inicio']);
                }
            },
            (error) => {
                this.alertService.showErrorAlert('ERRO NO CADASTRO');
                console.error(error);
            }
        );
    }
}
