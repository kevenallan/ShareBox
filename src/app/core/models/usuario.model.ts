import { Token } from './token.model';

export class Usuario {
    id?: number;
    nome?: string;
    login?: string;
    senha?: string;
    token?: Token;

    // constructor(nome?: string, senha?: string, id?: number) {
    //     this.id = id;
    //     this.nome = nome;
    //     this.senha = senha;
    // }
}
