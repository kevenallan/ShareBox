import { Usuario } from './usuario.model';

export class LoginDTO {
    constructor(
        public usuario: Usuario,
        public token: string
    ) {}
}
