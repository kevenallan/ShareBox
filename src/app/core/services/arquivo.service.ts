import { Injectable } from '@angular/core';
import { Arquivo } from '../models/arquivo.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlBackEnd } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ArquivoService {

    constructor(private http: HttpClient) {}

    listar() {
        return this.http.get<Arquivo[]>(`${urlBackEnd}/arquivo/listar`);
    }

    upload(arquivo: Arquivo) {
        console.log('upload front');
        return this.http.post(`${urlBackEnd}/arquivo/upload`, arquivo);
    }

    download(fileId: string): Observable<Blob> {
        return this.http.get(`${urlBackEnd}/arquivo/download/${fileId}`, {
          responseType: 'blob'
        });
      }
}
