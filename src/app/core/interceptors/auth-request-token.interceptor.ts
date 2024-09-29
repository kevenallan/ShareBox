import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthRequestTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService); // Injeta o service
    const token = authService.getAuthorizationToken();

    // if (token && !authService.isTokenExpired(token)) {
    const requestClone = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
    return next(requestClone);
    // }

    // return next(req);
};
