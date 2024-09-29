import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

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
