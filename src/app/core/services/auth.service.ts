import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';
import { urlBackEnd } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    // validarToken(token: Token) {
    //     return this.http.post(`${urlBackEnd}/auth/validar-token`, token);
    // }

    isUserLoggedIn() {
        const token = this.getAuthorizationToken();
        if (!token) {
            return false;
        }
        return true;
    }

    getAuthorizationToken() {
        const token = sessionStorage.getItem('token');
        return token;
    }

    removeAuthorizationToken() {
        sessionStorage.removeItem('token');
    }
}
