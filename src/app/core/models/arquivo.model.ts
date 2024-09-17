export class Arquivo {
    id?: number;
    nome: string;
    arquivo: string;
    extensao: string;
    prefixoBase64: string;
    dataCriacao?:Date;
    dataUltimaModificacao?:Date;

    constructor(arquivo: string, nome: string, extensao: string, prefixoBase64: string, id?: number) {
        this.id = id;
        this.nome = nome;
        this.arquivo = arquivo;
        this.extensao = extensao;
        this.prefixoBase64 = prefixoBase64
    }
}
