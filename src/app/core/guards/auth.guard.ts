import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) {}

    canActivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        console.log('authGuard');
        if (this.authService.isUserLoggedIn()) {
            return true;
        } else {
            this.alertService.showInfoAlert('(FRONT) Sua sessão expirou');
            this.authService.removeAuthorizationToken();
            this.router.navigate(['/login']);
            return false;
        }
    }
}
