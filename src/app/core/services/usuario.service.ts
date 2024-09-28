import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBackEnd } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    constructor(private http: HttpClient) {}

    login(usuario: Usuario) {
        return this.http.post(`${urlBackEnd}/usuario/login`, usuario);
    }

    // validarToken(token: string) {
    //     // Configura os parâmetros da requisição com o token
    //     const params = new HttpParams().set('token', token);
    //     return this.http.get(`${urlBackEnd}/usuario/validar-token`, { params });
    // }

    cadastro(usuario: Usuario) {
        return this.http.post(`${urlBackEnd}/usuario/cadastrar`, usuario);
    }

    async esqueceuASenha(email: string) {
        let params = new HttpParams().set('email', email);
        return await lastValueFrom(
            this.http.get(`${urlBackEnd}/usuario/esqueceu-sua-senha`, {
                params,
                responseType: 'text'
            })
        );
    }
}
