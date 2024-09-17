import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBackEnd } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    constructor(private http: HttpClient) {}

    login(usuario: Usuario) {
        return this.http.post(`${urlBackEnd}/usuario/login`, usuario);
    }

}
