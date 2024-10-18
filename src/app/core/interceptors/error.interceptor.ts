import {
    HttpErrorResponse,
    HttpInterceptorFn,
    HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ResponseModel } from '../models/response.model';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const alertService = inject(AlertService); // Injeta o service
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                let response: ResponseModel;
                if (typeof event.body === 'string') {
                    try {
                        response = JSON.parse(event.body) as ResponseModel;
                    } catch (error) {
                        console.error(
                            'Erro ao fazer parse da resposta JSON',
                            error
                        );
                        return;
                    }
                } else {
                    response = event.body as ResponseModel;
                }
                if (response != null && response.mensagem != null) {
                    alertService.showSuccessAlert(response.mensagem);
                }
            }
        }),
        catchError((response) => {
            if (response.status === 0) {
                alertService.showErrorAlert(
                    'Não foi possível conectar-se ao serviço no momento, Tente novamente mais tarde. '
                );
                return throwError(() => response);
            }

            if (response instanceof HttpErrorResponse) {
                //EXCEPTION DO BACK
                if (response.status === 500) {
                    //REMOVENDO .MENSAGEM 29/09 09:07
                    alertService.showErrorAlert(response.error);
                } else if (response.status === 403) {
                    alertService.showErrorAlert(
                        'Sua sessão expirou, faça o login novamente'
                    );
                    authService.logout();
                    router.navigate(['/login']);
                } else {
                    alertService.showErrorAlert(
                        'Erro no sistema, por favor processar Bruna Luiza.'
                    );
                }
            }

            return throwError(() => response);
        })
    );
};
