import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Import the new animations provider
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(), // <-- Add this to enable animations
        provideHttpClient(withInterceptors([LoadingInterceptor]))
    ]
};
