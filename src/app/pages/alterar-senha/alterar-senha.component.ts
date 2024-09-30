import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../core/services/alert.service';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
    selector: 'app-alterar-senha',
    standalone: true,
    imports: [FormsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './alterar-senha.component.html',
    styleUrl: './alterar-senha.component.scss'
})
export class AlterarSenhaComponent {
    alterarSenhaForm: FormGroup;
    constructor(
        private router: Router,
        private activedRouter: ActivatedRoute,
        private formBuilder: FormBuilder,
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private alertService: AlertService
    ) {
        this.alterarSenhaForm = this.formBuilder.group(
            {
                senha: ['', [Validators.required, Validators.minLength(3)]],
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
        if (this.alterarSenhaForm.valid) {
            this.alterarSenha();
        } else {
            // Marcar todos os campos como "tocados" para mostrar mensagens de erro
            this.alterarSenhaForm.markAllAsTouched();
        }
    }
    async alterarSenha() {
        const novaSenha = this.alterarSenhaForm.get('senha')?.value;
        const token =
            this.activedRouter.snapshot.queryParamMap.get('token') || '';
        await this.usuarioService.alterarSenha(novaSenha, token);
        this.router.navigate(['/login']);
    }
}
