import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { lastValueFrom, map } from 'rxjs';
import { ResponseModel } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    constructor(private http: HttpClient) {}

    // async getConfig() {
    //     return await lastValueFrom(
    //         this.http.get(`${environment.urlBackEnd}/firebase/get-config`)
    //     );
    // }
    getConfig(): Promise<any> {
        return this.http
            .get<ResponseModel>(`${environment.urlBackEnd}/firebase/get-config`)
            .pipe(
                map((response: ResponseModel) => response.model) // Use o map para transformar a resposta
            )
            .toPromise(); // Chama toPromise no final da cadeia
    }
}
