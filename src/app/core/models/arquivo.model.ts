export class Arquivo {
    nome: string;
    extensao: string;
    dataCriacao?: Date;
    dataUltimaModificacao?: Date;
    file?: File;
    base64?: string;
    previewSrc?: string;
    url?: string;

    constructor(nome: string, extensao: string) {
        this.nome = nome;
        this.extensao = extensao;
    }
}
