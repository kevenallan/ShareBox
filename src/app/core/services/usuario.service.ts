import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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
            .post(`${environment.urlBackEnd}/usuario/login`, usuario)
            .pipe(map((response: ResponseModel) => response.model));
    }

    loginGoogle(usuario: Usuario) {
        return this.http
            .post(`${environment.urlBackEnd}/usuario/login-google`, usuario)
            .pipe(map((response: ResponseModel) => response.model));
    }

    cadastro(usuario: Usuario) {
        return this.http
            .post(`${environment.urlBackEnd}/usuario/cadastrar`, usuario)
            .pipe(map((response: ResponseModel) => response.model));
    }

    async esqueceuASenha(email: string) {
        let params = new HttpParams().set('email', email);
        return await lastValueFrom(
            this.http.get(
                `${environment.urlBackEnd}/usuario/esqueceu-sua-senha`,
                {
                    params
                }
            )
        );
    }

    async alterarSenha(novaSenha: string, token: string) {
        let params = new HttpParams()
            .append('novaSenha', novaSenha)
            .append('token', token);
        return await lastValueFrom(
            //prettier-ignore
            this.http.put(
                `${environment.urlBackEnd}/usuario/alterar-senha`,
                {},
                { params }
            )
        );
    }

    async dadosUsuario() {
        return await lastValueFrom(
            this.http
                .get(`${environment.urlBackEnd}/usuario/dados-usuario`)
                .pipe(map((response: ResponseModel) => response.model))
        );
    }

    async atualizarUsuario(usuarioAtualizado: Usuario) {
        return await lastValueFrom(
            this.http
                .put(
                    `${environment.urlBackEnd}/usuario/atualizar-usuario`,
                    usuarioAtualizado
                )
                .pipe(map((response: ResponseModel) => response.model))
        );
    }

    async atualizarUsuarioGoogle(usuarioAtualizado: Usuario) {
        return await lastValueFrom(
            this.http
                .put(
                    `${environment.urlBackEnd}/usuario/atualizar-usuario-google`,
                    usuarioAtualizado
                )
                .pipe(map((response: ResponseModel) => response.model))
        );
    }
}
