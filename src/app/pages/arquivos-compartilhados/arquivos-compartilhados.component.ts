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
import { EditorTextoDialogComponent } from '../../shared/components/editor-texto-dialog/editor-texto-dialog.component';
import { AbrirDialogModel } from '../../core/models/abrirDialog.model';

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
        MidiaDialogComponent,
        EditorTextoDialogComponent
    ],
    providers: [DatePipe],
    templateUrl: './arquivos-compartilhados.component.html',
    styleUrl: './arquivos-compartilhados.component.scss'
})
export class ArquivosCompartilhadosComponent implements OnInit {
    arquivosCompartilhados!: Arquivo[];

    @ViewChild('midiaDialog') midiaDialog!: MidiaDialogComponent;
    @ViewChild('editorTextoDialog')
    editorTextoDialog!: EditorTextoDialogComponent;

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
        let dialog: any;
        let abrirDialogModel: AbrirDialogModel = new AbrirDialogModel();
        abrirDialogModel.arquivo = arquivo;
        if (this.arquivoService.isMidiaExtensao(arquivo.extensao)) {
            abrirDialogModel.isMidiaDialog = true;
            abrirDialogModel.dialog = this.midiaDialog;
        } else if (this.arquivoService.isTxtExtensao(arquivo.extensao)) {
            abrirDialogModel.isEditorTextoDialog = true;
            abrirDialogModel.dialog = this.editorTextoDialog;
        } else if (this.arquivoService.isPdfExtensao(arquivo.extensao)) {
            this.arquivoService.abrirPdf(arquivo);
            return;
        }

        this.arquivoService.abrirDialog(abrirDialogModel);
    }

    downloadFile(arquivo: Arquivo): void {
        this.arquivoService.downloadFile(arquivo.pathArquivo);
    }
}
