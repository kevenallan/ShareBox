import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Arquivo } from '../models/arquivo.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { urlBackEnd } from '../../../environments/environment';


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
        let params = new HttpParams().set(
            'usuario',
            this.authService.getUsuarioFromToken()
        );
        return this.http.get<Arquivo[]>(`${urlBackEnd}/arquivo/listar`, {
            params
        });
    }

    upload(formData: FormData) {
        formData.append('usuario', this.authService.getUsuarioFromToken());
        return this.http.post(`${urlBackEnd}/arquivo/upload`, formData);
    }

    download(nomeArquivo: string): Observable<Blob> {
        let params = new HttpParams()
            .set('nomeArquivo', nomeArquivo)
            .set('usuario', this.authService.getUsuarioFromToken());
        return this.http.get(`${urlBackEnd}/arquivo/download`, {
            params,
            responseType: 'blob'
        });
    }

    async buscarArquivo(nomeArquivo: string): Promise<Blob> {
        let params = new HttpParams()
            .set('nomeArquivo', nomeArquivo)
            .set('usuario', this.authService.getUsuarioFromToken());
        return await lastValueFrom(
            this.http.get(`${urlBackEnd}/arquivo/buscar`, {
                params,
                responseType: 'blob'
            })
        );
    }

    async deletar(nomeArquivo: string) {
        let params = new HttpParams()
            .set('nomeArquivo', nomeArquivo)
            .set('usuario', this.authService.getUsuarioFromToken());
        await lastValueFrom(
            this.http.delete<void>(`${urlBackEnd}/arquivo/deletar`, {
                params
            })
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
