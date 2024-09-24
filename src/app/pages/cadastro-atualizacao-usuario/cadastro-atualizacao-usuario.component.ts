import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-cadastro-atualizacao-usuario',
    standalone: true,
    imports: [
        //PRIMENG
        ButtonModule
    ],
    templateUrl: './cadastro-atualizacao-usuario.component.html',
    styleUrl: './cadastro-atualizacao-usuario.component.scss'
})
export class CadastroAtualizacaoUsuarioComponent {
    constructor(private router: Router) {}

    voltar() {
        this.router.navigate(['/login']);
    }
}
