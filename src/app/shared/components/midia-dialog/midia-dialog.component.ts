import { Component, Input } from '@angular/core';

import { ArquivoService } from '../../../core/services/arquivo.service';
import { Arquivo } from '../../../core/models/arquivo.model';

import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-midia-dialog',
    standalone: true,
    imports: [DialogModule],
    templateUrl: './midia-dialog.component.html',
    styleUrl: './midia-dialog.component.scss'
})
export class MidiaDialogComponent {
    @Input() header?: string;
    displayVideo: boolean = false;
    displayAudio: boolean = false;
    displayImagem: boolean = false;
    midia?: string;
    mimeType?: string;

    constructor(private arquivoService: ArquivoService) {}

    showDialogMidia(arquivo: Arquivo) {
        this.header = arquivo.nome;
        this.mimeType = arquivo.mimeType;
        this.midia = this.createBase64Arquivo(
            this.mimeType || '',
            arquivo.base64 || ''
        );

        this.openDisplayVideoOrAudio(this.mimeType || '');
    }

    hideDialogMidia() {
        this.displayVideo = false;
        this.displayAudio = false;
        this.displayImagem = false;
    }

    createBase64Arquivo(mimeType: string, base64: string) {
        let resultado = '';
        let prefixoBase64;

        //VIDEO
        prefixoBase64 = this.arquivoService.videoBase64Prefixos.filter(
            (item) => {
                return item.includes(mimeType);
            }
        );

        if (prefixoBase64.length != 0) {
            return resultado + prefixoBase64[0] + base64;
        }

        //AUDIO
        prefixoBase64 = this.arquivoService.audioBase64Prefixos.filter(
            (item) => {
                return item.includes(mimeType);
            }
        );

        if (prefixoBase64.length != 0) {
            return resultado + prefixoBase64[0] + base64;
        }

        //IMAGEM
        prefixoBase64 = this.arquivoService.imagemBase64Prefixos.filter(
            (item) => {
                return item.includes(mimeType);
            }
        );

        if (prefixoBase64.length != 0) {
            return resultado + prefixoBase64[0] + base64;
        }

        return resultado;
    }

    openDisplayVideoOrAudio(mimeType: string) {
        this.arquivoService.videoBase64Prefixos.map((item) => {
            if (item.includes(mimeType)) {
                this.displayVideo = true;
            }
        });
        this.arquivoService.audioBase64Prefixos.map((item) => {
            if (item.includes(mimeType)) {
                this.displayAudio = true;
            }
        });
        this.arquivoService.imagemBase64Prefixos.map((item) => {
            if (item.includes(mimeType)) {
                this.displayImagem = true;
            }
        });
    }
}
