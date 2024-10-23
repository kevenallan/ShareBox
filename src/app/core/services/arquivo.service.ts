import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Arquivo } from '../models/arquivo.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseModel } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class ArquivoService {
    //EXTENSAO
    imagemExtensoes = ['png', 'jpg', 'jpeg', 'gif'];
    videoExtensoes = ['mp4', 'webm', 'ogg'];
    audioExtensoes = ['mp3', 'wav', 'ogg'];
    pdfExtensao = 'pdf';
    txtExtensao = 'txt';
    docxExtensao = 'docx';

    //PREFIXO BASE64
    imagemBase64Prefixos = [
        'data:image/png;base64,',
        'data:image/jpeg;base64,',
        'data:image/gif;base64,',
        'data:image/bmp;base64,',
        'data:image/svg+xml;base64,',
        'data:image/webp;base64,'
    ];
    audioBase64Prefixos = [
        'data:audio/mpeg;base64,',
        'data:audio/wav;base64,',
        'data:audio/ogg;base64,',
        'data:audio/aac;base64,'
    ];
    videoBase64Prefixos = [
        'data:video/mp4;base64,',
        'data:video/webm;base64,',
        'data:video/x-msvideo;base64,',
        'data:video/quicktime;base64,'
    ];
    documentoBase64Prefixos = [
        'data:application/pdf;base64,',
        'data:text/plain;base64,',
        'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,',
        'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
    ];
    outrosBase64Prefixos = [
        'data:application/zip;base64,',
        'data:application/json;base64,',
        'data:application/xml;base64,'
    ];

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    listar() {
        return this.http
            .get<ResponseModel>(`${environment.urlBackEnd}/arquivo/listar`)
            .pipe(
                map((response: ResponseModel) => response.model as Arquivo[]) // retorna apenas o model
            );
    }

    upload(formData: FormData) {
        return this.http.post(
            `${environment.urlBackEnd}/arquivo/upload`,
            formData
        );
    }

    uploadLink(formData: FormData) {
        return this.http
            .post(`${environment.urlBackEnd}/arquivo/upload-zip-link`, formData)
            .pipe(
                map((response: ResponseModel) => response.model as string) // retorna apenas o model
            );
    }

    update(formData: FormData) {
        return this.http.put(
            `${environment.urlBackEnd}/arquivo/update`,
            formData
        );
    }

    download(nomeArquivo: string): Observable<Blob> {
        let params = new HttpParams().set('nomeArquivo', nomeArquivo);
        return this.http.get(`${environment.urlBackEnd}/arquivo/download`, {
            params,
            responseType: 'blob'
        });
    }

    async buscarArquivo(nomeArquivo: string): Promise<Blob> {
        let params = new HttpParams().set('nomeArquivo', nomeArquivo);
        return await lastValueFrom(
            this.http.get(`${environment.urlBackEnd}/arquivo/buscar`, {
                params,
                responseType: 'blob'
            })
        );
    }

    async deletar(nomesArquivos: string[]) {
        let params = new HttpParams();
        nomesArquivos.forEach((nomeArquivo) => {
            params = params.append('nomesArquivos', nomeArquivo);
        });
        await lastValueFrom(
            this.http.delete<void>(
                `${environment.urlBackEnd}/arquivo/deletar`,
                {
                    params
                }
            )
        );
    }

    async compartilharArquivos(formData: FormData) {
        console.log('service');

        await lastValueFrom(
            this.http.post(
                `${environment.urlBackEnd}/usuario/compartilhar-arquivos`,
                formData
            )
        );
    }

    //---
    isImagemExtensao(extensao: string) {
        return this.imagemExtensoes.includes(extensao);
    }
    isVideoExtensao(extensao: string) {
        return this.videoExtensoes.includes(extensao);
    }
    isAudioExtensao(extensao: string) {
        return this.audioExtensoes.includes(extensao);
    }
    isPdfExtensao(extensao: string) {
        return this.pdfExtensao === extensao;
    }
    isTxtExtensao(extensao: string) {
        return this.txtExtensao === extensao;
    }
    isDocxExtensao(extensao: string) {
        return this.docxExtensao === extensao;
    }
    isArquivoGenerico(extensao: string) {
        return (
            !this.isImagemExtensao(extensao) &&
            !this.isVideoExtensao(extensao) &&
            !this.isAudioExtensao(extensao) &&
            !this.isPdfExtensao(extensao) &&
            !this.isTxtExtensao(extensao)
        );
    }
    //TXT
    async convertTxtBase64ToText(base64: string): Promise<string> {
        const decodedText = atob(base64); // Decodifica o conteúdo Base64
        return decodedText; // Retorna o texto sem modificar as quebras de linha
    }

    convertTxtToFile(texto: string, nomeArquivo: string): File {
        // Garantindo que a codificação seja UTF-8
        const utf8Texto = new TextEncoder().encode(texto);
        const blob = new Blob([utf8Texto], {
            type: 'text/plain;charset=utf-8'
        });
        const file = new File([blob], nomeArquivo, {
            type: 'text/plain;charset=utf-8'
        });
        return file;
    }
    concatenarNomeExtensaoArquivo(nomeArquivo: string, extensao: string) {
        return nomeArquivo + '.' + extensao;
    }
}
