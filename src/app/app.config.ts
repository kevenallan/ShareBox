import {
    APP_INITIALIZER,
    ApplicationConfig,
    inject,
    provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Import the new animations provider
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AuthRequestTokenInterceptor } from './core/interceptors/auth-request-token.interceptor';
import { FirebaseApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { FirebaseService } from './core/services/firebase.service';
import { firstValueFrom } from 'rxjs';

// Variável para armazenar a configuração do Firebase
let firebaseConfig: any = null;

// Função para carregar a configuração do Firebase antes de iniciar o app
function loadFirebaseConfig(configService: FirebaseService) {
    return () =>
        firstValueFrom(configService.getConfig()).then((config) => {
            firebaseConfig = config;
        });
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([
                LoadingInterceptor,
                ErrorInterceptor,
                AuthRequestTokenInterceptor
            ])
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: loadFirebaseConfig,
            deps: [FirebaseService],
            multi: true
        },
        provideFirebaseApp(() => {
            if (!firebaseConfig) {
                throw new Error('Firebase config not loaded');
            }
            return initializeApp(firebaseConfig) as FirebaseApp; // Inicialização síncrona com a configuração carregada
        }),
        // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth())
    ]
};
