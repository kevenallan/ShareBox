import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Arquivo } from '../../../core/models/arquivo.model';
import { ArquivoService } from '../../../core/services/arquivo.service';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [DialogModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    //
    displayHTML: boolean = false;
    @Input() header?: string;
    @Input() content?: string; // HTML string
    //VIDEO / AUDIO
    displayVideo: boolean = false;
    displayAudio: boolean = false;
    midia?: string;
    mimeType?: string;
    //

    constructor(private arquivoService: ArquivoService) {}

    showDialogHTML() {
        this.displayHTML = true;
    }

    hideDialogHTML() {
        this.displayHTML = false;
    }

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
    }

    createBase64Arquivo(mimeType: string, base64: string) {
        let resultado = '';
        let prefixoBase64;
        prefixoBase64 = this.arquivoService.videoBase64Prefixos.filter(
            (item) => {
                return item.includes(mimeType);
            }
        );

        //VIDEO
        if (prefixoBase64.length != 0) {
            return resultado + prefixoBase64[0] + base64;
        }

        prefixoBase64 = this.arquivoService.audioBase64Prefixos.filter(
            (item) => {
                return item.includes(mimeType);
            }
        );

        //AUDIO
        if (prefixoBase64.length != 0) {
            return resultado + prefixoBase64[0] + base64;
        }
        return base64;
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
    }
}
