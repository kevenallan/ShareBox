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
        private formBuilder: FormBuilder
    ) {
        this.cadastroForm = this.formBuilder.group(
            {
                nome: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
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
            // Aqui você pode enviar os dados para o backend
            console.log(this.cadastroForm.value);
        } else {
            // Marcar todos os campos como "tocados" para mostrar mensagens de erro
            this.cadastroForm.markAllAsTouched();
        }
    }

    voltar() {
        this.router.navigate(['/login']);
    }
}
