import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-loading',
    standalone: true,
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [CommonModule]
})
export class LoadingComponent implements OnInit {
    isLoading: Observable<boolean>;

    constructor(private loadingervice: LoadingService) {
        this.isLoading = this.loadingervice.loading$; // Inicialização no construtor
    }

    ngOnInit() {}
}
