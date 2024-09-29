import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, LoadingComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'ShareBox';
    constructor(private primengConfig: PrimeNGConfig) {}
    ngOnInit(): void {
        this.primengConfig.zIndex = {
            modal: 1000, // Ajuste o zIndex global dos modais
            overlay: 999, // Ajuste o zIndex do overlay
            menu: 1000,
            tooltip: 1100
        };
    }
}
