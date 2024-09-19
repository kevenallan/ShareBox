import { Injectable } from '@angular/core';
import { Arquivo } from '../models/arquivo.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlBackEnd } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ArquivoService {
    constructor(private http: HttpClient) {}

    //TODO:PASSAR O USUARIO POR PARAMETRO
    listar() {
        let params = new HttpParams().set('usuario', 'dev');
        return this.http.get<Arquivo[]>(`${urlBackEnd}/arquivo/listar`, {
            params
        });
    }

    upload(arquivo: any) {
        return this.http.post(`${urlBackEnd}/arquivo/upload`, arquivo);
    }

    download(nomeArquivo: string): Observable<Blob> {
        //TODO:PEGAR O NOME DO USUARIO LOGADO
        let params = new HttpParams()
            .set('nomeArquivo', nomeArquivo)
            .set('usuario', 'dev');
        return this.http.get(`${urlBackEnd}/arquivo/download`, {
            params,
            responseType: 'blob'
        });
    }
}
