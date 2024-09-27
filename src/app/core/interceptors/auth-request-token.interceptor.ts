import {
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthRequestTokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the auth token from the service.
        const authToken = this.auth.getAuthorizationToken();

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone({
            headers: req.headers.set('Authorization', 'TESTE')
        });

        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}
