import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LocalDateTimeFormatPipe } from '../../shared/pipe/local-date-time-format.pipe';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule, DatePipe } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { Arquivo } from '../../core/models/arquivo.model';
import { ArquivoService } from '../../core/services/arquivo.service';
import { MidiaDialogComponent } from '../../shared/components/midia-dialog/midia-dialog.component';

@Component({
    selector: 'app-arquivos-compartilhados',
    standalone: true,
    imports: [
        MenuComponent,
        TableModule,
        ButtonModule,
        TooltipModule,
        LocalDateTimeFormatPipe,
        OverlayModule,
        OverlayPanelModule,
        CommonModule,
        MidiaDialogComponent
    ],
    providers: [DatePipe],
    templateUrl: './arquivos-compartilhados.component.html',
    styleUrl: './arquivos-compartilhados.component.scss'
})
export class ArquivosCompartilhadosComponent implements OnInit {
    arquivosCompartilhados!: Arquivo[];

    @ViewChild('midiaDialog') midiaDialog!: MidiaDialogComponent;

    constructor(
        private usuarioService: UsuarioService,
        private arquivoService: ArquivoService
    ) {}

    async ngOnInit(): Promise<void> {
        await this.listarArquivosCompartilhados();
    }

    async listarArquivosCompartilhados() {
        this.arquivosCompartilhados =
            await this.usuarioService.listarArquivosCompartilhados();

        this.arquivosCompartilhados.map((arquivo) => {
            arquivo.base64 = arquivo.bytes;
        });
        this.adicionarImgPreview();
    }

    adicionarImgPreview() {
        this.arquivosCompartilhados.forEach((arquivo) => {
            arquivo.previewSrc = this.preview(arquivo);
        });
    }

    preview(arquivo: Arquivo) {
        if (this.arquivoService.isImagemExtensao(arquivo.extensao)) {
            return (
                'data:image/' + arquivo.extensao + ';base64,' + arquivo.base64
            );
        } else if (this.arquivoService.isVideoExtensao(arquivo.extensao)) {
            return '/assets/video.png';
        } else if (this.arquivoService.isAudioExtensao(arquivo.extensao)) {
            return '/assets/musica.png';
        } else if (this.arquivoService.isPdfExtensao(arquivo.extensao)) {
            return '/assets/pdf.png';
        } else if (this.arquivoService.isTxtExtensao(arquivo.extensao)) {
            return '/assets/txt.png';
        } else if (this.arquivoService.isDocxExtensao(arquivo.extensao)) {
            return '/assets/docx.png';
        } else {
            return '/assets/arquivo.png';
        }
    }

    isArquivoGenerico(extensao: string) {
        return this.arquivoService.isArquivoGenerico(extensao);
    }

    abrirArquivo(arquivo: Arquivo) {
        if (
            this.arquivoService.isImagemExtensao(arquivo.extensao) ||
            this.arquivoService.isVideoExtensao(arquivo.extensao) ||
            this.arquivoService.isAudioExtensao(arquivo.extensao)
        ) {
            this.abrirMidia(arquivo);
            // }
            // else if (this.arquivoService.isTxtExtensao(arquivo.extensao)) {
            //     this.abrirEditorTexto(arquivo);
        } else if (this.arquivoService.isPdfExtensao(arquivo.extensao)) {
            const blob = this.base64ToBlob(
                arquivo.base64 || '',
                'application/pdf'
            );
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    abrirMidia(arquivo: Arquivo) {
        const dialog = this.midiaDialog;
        dialog.showDialogMidia(arquivo);
    }

    base64ToBlob(base64: string, type: string): Blob {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
    }

    downloadFile(arquivo: Arquivo): void {
        this.arquivoService
            .download(arquivo.pathArquivo)
            .subscribe((response: Blob) => {
                const blob = new Blob([response], { type: response.type });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.arquivoService.concatenarNomeExtensaoArquivo(
                    arquivo.nome,
                    arquivo.extensao
                ); // Nome do arquivo a ser baixado
                document.body.appendChild(a);
                a.click(); // Inicia o download
                document.body.removeChild(a); // Remove o link após o clique
                window.URL.revokeObjectURL(url); // Limpa a URL temporária
            });
    }
}
