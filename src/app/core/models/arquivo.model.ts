export class Arquivo {
    nome: string;
    arquivo: string;
    extensao: string;
    dataCriacao?: Date;
    dataUltimaModificacao?: Date;
    file?: File;

    constructor(
        arquivo: string,
        nome: string,
        extensao: string,
        prefixoBase64: string
    ) {
        this.nome = nome;
        this.arquivo = arquivo;
        this.extensao = extensao;
    }
}
