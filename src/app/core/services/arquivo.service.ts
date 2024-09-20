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

    upload(arquivo: any) {
        return this.http.post(`${urlBackEnd}/arquivo/upload`, arquivo);
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
}
