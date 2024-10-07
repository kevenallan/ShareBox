import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [MenubarModule, AvatarModule, OverlayPanelModule, ButtonModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent {
    items: MenuItem[] = [];
    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.items = [
            // {
            //     label: 'Home',
            //     icon: 'pi pi-home'
            // },
            // {
            //     label: 'Features',
            //     icon: 'pi pi-star'
            // }
        ];
    }
    sair() {
        this.authService.removeAuthorizationToken();
        this.router.navigate(['/login']);
    }
    telaPrincipal() {
        this.router.navigate(['/inicio']);
    }
    editarPerfil() {
        this.router.navigate(['/editar-perfil']);
    }
}
