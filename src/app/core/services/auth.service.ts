import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../models/usuario.model';
import { LoginDTO } from '../dto/login.dto';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    isUserLoggedIn() {
        const token = this.getAuthorizationToken();
        if (!token) {
            return false;
        }
        return true;
    }

    getAuthorizationToken() {
        const token = localStorage.getItem('token');
        return token;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('isUsuarioGoogle');
        localStorage.removeItem('usuario');
    }

    getUsuarioFromToken(): any {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.sub;
        }
        return null;
    }

    isUsuarioGoogle() {
        const isUsuarioGoogle = localStorage.getItem('isUsuarioGoogle');
        return isUsuarioGoogle === 'true';
    }

    setLoginStorage(loginDTO: LoginDTO) {
        localStorage.setItem('token', loginDTO.token);
        if (loginDTO.usuarioModel) {
            this.setNomeUsuarioStorage(loginDTO.usuarioModel.nome);
            localStorage.setItem(
                'isUsuarioGoogle',
                loginDTO.usuarioModel.isUsuarioGoogle ? 'true' : 'false'
            );
        }
    }

    setNomeUsuarioStorage(nomeUsuario: string) {
        localStorage.setItem('usuario', nomeUsuario);
    }

    getTokenExpirationDate(token: string) {
        const decode: any = jwtDecode(token);
        if (decode.exp === undefined) {
            return null;
        }

        const date = new Date(0);
        date.setUTCSeconds(decode.exp);
        return date;
    }

    isTokenExpired(token?: string) {
        if (!token) {
            return true;
        }

        const dateExpToken = this.getTokenExpirationDate(token);

        if (dateExpToken === undefined) {
            return false;
        }
        return !(dateExpToken!.valueOf() > new Date().valueOf());
    }
}
