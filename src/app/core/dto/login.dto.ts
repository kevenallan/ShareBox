import { Usuario } from '../models/usuario.model';

export class LoginDTO {
    usuarioModel?: Usuario;
    token?: string;
}
