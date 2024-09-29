import {
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService); // Injeta o service
    loadingService.show(); // Mostra o loading
    return next(req).pipe(
        finalize(() => loadingService.hide()) // Oculta o loading quando a requisição termina
    );
};
