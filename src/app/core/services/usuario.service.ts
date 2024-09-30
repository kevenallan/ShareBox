import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBackEnd } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { lastValueFrom, map } from 'rxjs';
import { ResponseModel } from '../models/response.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    constructor(private http: HttpClient) {}

    login(usuario: Usuario) {
        return this.http
            .post(`${urlBackEnd}/usuario/login`, usuario)
            .pipe(map((response: ResponseModel) => response.model));
    }
    cadastro(usuario: Usuario) {
        return this.http
            .post(`${urlBackEnd}/usuario/cadastrar`, usuario)
            .pipe(map((response: ResponseModel) => response.model));
    }

    async esqueceuASenha(email: string) {
        let params = new HttpParams().set('email', email);
        return await lastValueFrom(
            this.http.get(`${urlBackEnd}/usuario/esqueceu-sua-senha`, {
                params
            })
        );
    }

    async alterarSenha(novaSenha: string, token: string) {
        let params = new HttpParams()
            .append('novaSenha', novaSenha)
            .append('token', token);
        console.log(params);
        return await lastValueFrom(
            //prettier-ignore
            this.http.put(
                `${urlBackEnd}/usuario/alterar-senha`,
                {},
                { params }
            )
        );
    }
}
