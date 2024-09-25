import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode, { jwtDecode } from 'jwt-decode';

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

    getUsuarioFromToken(): any {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.sub;
        }
        return null;
    }

    setTokenStorage(token: string) {
        sessionStorage.setItem('token', token);
    }
}
