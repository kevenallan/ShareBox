import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    show() {
        this.loadingSubject.next(true);
    }

    hide() {
        this.loadingSubject.next(false);
    }

    exibirTelaLoadingInitializeFirebase() {
        const loadingDiv = document.getElementById(
            'loading-app-config-initialize'
        );
        if (loadingDiv) {
            loadingDiv.innerHTML = `
            <div class="loading-overlay" >
                <div class="spinner"></div>
            </div>`;
        }
    }

    ocultarTelaLoadingInitializeFirebase() {
        const loadingDiv = document.getElementById(
            'loading-app-config-initialize'
        );
        if (loadingDiv) {
            loadingDiv.innerHTML = ``;
        }
    }
}
