export class Arquivo {
    nome: string;
    file?: File; //ARMAZENA O ARQUIVO NA HORA DO UPLOAD
    extensao: string;
    mimeType?: string; //USADO NA REPRODUÇÃO DO VIDEO
    tamanho?: string;
    base64?: string; //USADO PARA EXIBIR AS IMAGENS DE PREVIEW, VIDEO E MUSICA
    dataCriacao?: Date;
    //FRONT
    previewSrc?: string; //USADO PARA EXIBIR A IMAGEM DE PREVIEW NA TABELA

    constructor(nome: string, extensao: string) {
        this.nome = nome;
        this.extensao = extensao;
    }
}
