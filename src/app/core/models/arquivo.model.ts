export class Arquivo {
    nome: string = '';
    file?: File;
    extensao: string = 'extensão desconhecida';
    mimeType?: string;
    tamanho: string = '0 KB';
    bytes?: any;
    base64?: string;
    dataCriacao?: Date;
    previewSrc?: string;
}
