import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const alertService = inject(AlertService); // Injeta o service
    return next(req).pipe(
        catchError((response) => {
            // console.error('Status: ' + response.status);
            // console.error('Erro: ', response.error);

            if (response.status === 0) {
                // console.log(
                //     'Não foi possível conectar-se ao serviço no momento, Tente novamente mais tarde. '
                // );
                return throwError(() => response);
            }

            if (response instanceof HttpErrorResponse) {
                if (response.status === 500) {
                    alertService.showErrorAlert(response.error.message);
                } else if (response.status === 403) {
                    alertService.showErrorAlert(
                        'Erro 403, Sua sessão expirou, faça o login novamente'
                    );
                    //   this.authService.removeAuthorizationToken()
                    //   this.router.navigate(["/login"])
                } else {
                    console.log('Erro no sistema');
                }
            }

            return throwError(() => response);
        })
    );
};
