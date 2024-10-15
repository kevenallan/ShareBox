import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ArquivoService } from '../../core/services/arquivo.service';
import { Arquivo } from '../../core/models/arquivo.model';
import { AlertService } from '../../core/services/alert.service';
import { LocalDateTimeFormatPipe } from '../../shared/pipe/local-date-time-format.pipe';
import { MidiaDialogComponent } from '../../shared/components/midia-dialog/midia-dialog.component';

//PRIMENG
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { SpeedDialModule } from 'primeng/speeddial';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { EditorTextoDialogComponent } from '../../shared/components/editor-texto-dialog/editor-texto-dialog.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { TotalizadorModel } from '../../core/models/totalizador.model';

@Component({
    selector: 'app-principal',
    standalone: true,
    imports: [
        CommonModule,
        LocalDateTimeFormatPipe,
        MidiaDialogComponent,
        MenuComponent,
        //PRIMENG
        ButtonModule,
        SplitButtonModule,
        ToastModule,
        BadgeModule,
        RippleModule,
        AvatarModule,
        TableModule,
        MessagesModule,
        CardModule,
        SpeedDialModule,
        InputTextModule,
        OverlayPanelModule,
        TooltipModule,
        EditorTextoDialogComponent,
        IconFieldModule,
        InputIconModule
    ],

    templateUrl: './principal.component.html',
    styleUrl: './principal.component.scss',
    providers: [MessageService, DatePipe]
})
export class PrincipalComponent implements OnInit {
    arquivoList: Arquivo[] = [];
    totalizadoresArquivos: TotalizadorModel[] = [
        {
            titulo: 'IMAGENS',
            qtd: 0,
            tamanho: '0'
        },
        {
            titulo: 'ÁUDIOS',
            qtd: 0,
            tamanho: '0'
        },
        {
            titulo: 'VÍDEOS',
            qtd: 0,
            tamanho: '0'
        },
        {
            titulo: 'OUTROS',
            qtd: 0,
            tamanho: '0'
        }
    ];
    arquivoUpdate!: Arquivo;

    @ViewChild('midiaDialog') midiaDialog!: MidiaDialogComponent;
    @ViewChild('editorTextoDialog')
    editorTextoDialog!: EditorTextoDialogComponent;

    items!: any;
    constructor(
        private arquivoService: ArquivoService,
        private alertService: AlertService,
        private toastService: MessageService
    ) {}

    ngOnInit() {
        this.listar();

        this.items = [
            {
                icon: 'pi pi-upload',
                tooltip: 'Upload',
                command: () => {
                    this.clickUploadFile();
                }
            },
            {
                icon: 'pi pi-file-plus',
                tooltip: 'Cria arquivo de texto',
                iconStyle: { 'font-size': '22px' },
                command: () => {
                    this.abrirCriarArquivoTexto(this.arquivoList);
                }
            }
        ];
    }

    clickUploadFile() {
        const fileInput = document.getElementById(
            'fileUploadInput'
        ) as HTMLInputElement;
        fileInput.click();
    }

    async fileUpload(event: any): Promise<void> {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop(); // Pega a extensão do arquivo

            const formData = new FormData();
            formData.append('file', file);
            formData.append('nome', fileName);
            formData.append('extensao', fileExtension);

            const arquivoExistente =
                await this.verificarExistenciaArquivo(formData);

            if (!arquivoExistente) {
                this.uploadFile(formData);
            }
        }
    }

    clickUpdateFile(arquivoAtual: Arquivo) {
        const fileInput = document.getElementById(
            'fileUpdateInput'
        ) as HTMLInputElement;
        this.arquivoUpdate = arquivoAtual;
        fileInput.click();
    }

    async fileUpdate(event: any): Promise<void> {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop(); // Pega a extensão do arquivo

            const formData = new FormData();
            formData.append('file', file);
            formData.append('nome', fileName);
            formData.append('extensao', fileExtension);
            formData.append(
                'nomeArquivoAntigo',
                this.arquivoService.concatenarNomeExtensaoArquivo(
                    this.arquivoUpdate.nome,
                    this.arquivoUpdate.extensao
                )
            );

            const desejaSobrescrever =
                await this.alertService.showConfirmationAlertUploadFile(
                    'Tem certeza que deseja sobrescrever o arquivo?'
                );

            if (desejaSobrescrever) {
                this.updateFile(formData);
            }
        }
    }

    async verificarExistenciaArquivo(arquivo: FormData): Promise<boolean> {
        const nomeArquivo = arquivo.get('nome')?.toString();
        const arquivoVerificado = await this.arquivoService.buscarArquivo(
            nomeArquivo || ''
        );

        const lista: string[] = [];
        this.arquivoList.map((arquivo) => {
            lista.push(arquivo.nome);
        });

        if (arquivoVerificado.size > 0) {
            const arquivoRenomeado: FormData | null =
                await this.alertService.showInputAlertFileName(lista, arquivo);
            if (arquivoRenomeado) this.uploadFile(arquivoRenomeado);
            return true;
        }

        return false;
    }

    uploadFile(arquivo: FormData): void {
        this.arquivoService.upload(arquivo).subscribe(() => {
            this.listar();
        });
    }

    updateFile(arquivo: FormData): void {
        this.arquivoService.update(arquivo).subscribe(() => {
            this.listar();
        });
    }

    listar() {
        this.arquivoService.listar().subscribe((response) => {
            this.arquivoList = response;
            this.arquivoList.map((arquivo) => {
                arquivo.base64 = arquivo.bytes;
            });
            this.adicionarImgPreview();
            this.calcularTotais();
        });
    }

    adicionarImgPreview() {
        this.arquivoList.forEach((arquivo) => {
            arquivo.previewSrc = this.preview(arquivo);
        });
    }

    downloadFile(nomeArquivo: string, extensao: string): void {
        this.arquivoService
            .download(
                this.arquivoService.concatenarNomeExtensaoArquivo(
                    nomeArquivo,
                    extensao
                )
            )
            .subscribe((response: Blob) => {
                const blob = new Blob([response], { type: response.type });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.arquivoService.concatenarNomeExtensaoArquivo(
                    nomeArquivo,
                    extensao
                ); // Nome do arquivo a ser baixado
                document.body.appendChild(a);
                a.click(); // Inicia o download
                document.body.removeChild(a); // Remove o link após o clique
                window.URL.revokeObjectURL(url); // Limpa a URL temporária
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

    async deletar(nomeArquivo: string, extensao: string) {
        try {
            const isDelete =
                await this.alertService.showConfirmationAlertDeleteFile(
                    'Deletar Arquivo',
                    'Tem certeza que deseja deletar o arquivo?'
                );
            if (isDelete) {
                await this.arquivoService.deletar(
                    this.arquivoService.concatenarNomeExtensaoArquivo(
                        nomeArquivo,
                        extensao
                    )
                );
                this.alertService.showSuccessAlert(
                    'Arquivo deletado com sucesso!'
                );
                this.listar();
            }
        } catch (error) {
            this.alertService.showErrorAlert('Erro ao deletar o arquivo.');
        }
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

    openDialogMidia(arquivo: Arquivo) {
        const dialog = this.midiaDialog; // Referência ao componente de diálogo
        dialog.showDialogMidia(arquivo);
    }

    abrirMidia(arquivo: Arquivo) {
        this.openDialogMidia(arquivo);
    }

    openDialogEditorTexto(arquivo: Arquivo) {
        const dialog = this.editorTextoDialog; // Referência ao componente de diálogo
        dialog.showDialogEditorTexto(arquivo);
    }

    openDialogCriarArquivoTexto(arquivoList: Arquivo[]) {
        const dialog = this.editorTextoDialog; // Referência ao componente de diálogo
        dialog.showDialogCriarArquivoTexto(arquivoList);
    }

    abrirEditorTexto(arquivo: Arquivo) {
        this.openDialogEditorTexto(arquivo);
    }

    abrirCriarArquivoTexto(arquivoList: Arquivo[]) {
        this.openDialogCriarArquivoTexto(arquivoList);
    }

    abrirArquivo(arquivo: Arquivo) {
        if (
            this.arquivoService.isImagemExtensao(arquivo.extensao) ||
            this.arquivoService.isVideoExtensao(arquivo.extensao) ||
            this.arquivoService.isAudioExtensao(arquivo.extensao)
        ) {
            this.abrirMidia(arquivo);
        } else if (this.arquivoService.isTxtExtensao(arquivo.extensao)) {
            this.abrirEditorTexto(arquivo);
        } else if (this.arquivoService.isPdfExtensao(arquivo.extensao)) {
            const blob = this.base64ToBlob(
                arquivo.base64 || '',
                'application/pdf'
            );
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    isArquivoGenerico(extensao: string) {
        return this.arquivoService.isArquivoGenerico(extensao);
    }

    filterArquivos(event: Event, tbArquivos: any) {
        const input = event.target as HTMLInputElement;
        tbArquivos.filterGlobal(input.value, 'contains');
    }

    calcularTotais() {
        let qtdImagens = 0;
        let tamanhoTotalImagens = 0;
        let qtdAudio = 0;
        let tamanhoTotalAudio = 0;
        let qtdVideo = 0;
        let tamanhoTotalVideo = 0;
        let qtdOutros = 0;
        let tamanhoTotalOutros = 0;

        this.arquivoList.forEach((arquivo) => {
            if (this.arquivoService.isImagemExtensao(arquivo.extensao)) {
                qtdImagens++;
                tamanhoTotalImagens += this.converterParaKB(
                    arquivo.tamanho || ''
                );
            } else if (this.arquivoService.isAudioExtensao(arquivo.extensao)) {
                qtdAudio++;
                tamanhoTotalAudio += this.converterParaKB(
                    arquivo.tamanho || ''
                );
            } else if (this.arquivoService.isVideoExtensao(arquivo.extensao)) {
                qtdVideo++;
                tamanhoTotalVideo += this.converterParaKB(
                    arquivo.tamanho || ''
                );
            } else {
                qtdOutros++;
                tamanhoTotalOutros += this.converterParaKB(
                    arquivo.tamanho || ''
                );
            }
        });

        // Atualize ou adicione os totalizadores
        this.atualizarTotalizador(
            'IMAGENS',
            qtdImagens,
            this.formatarTamanho(tamanhoTotalImagens * 1024)
        );
        this.atualizarTotalizador(
            'ÁUDIOS',
            qtdAudio,
            this.formatarTamanho(tamanhoTotalAudio * 1024)
        );
        this.atualizarTotalizador(
            'VÍDEOS',
            qtdVideo,
            this.formatarTamanho(tamanhoTotalVideo * 1024)
        );
        this.atualizarTotalizador(
            'OUTROS',
            qtdOutros,
            this.formatarTamanho(tamanhoTotalOutros * 1024)
        );
    }

    converterParaKB(tamanho: string): number {
        let [valor, unidade] = tamanho.split(' ');
        valor = valor.replace(',', '.');
        switch (unidade) {
            case 'B':
                return Number(valor) / 1024;
            case 'KB':
                return Number(valor);
            case 'MB':
                return Number(valor) * 1024;
            case 'GB':
                return Number(valor) * 1024 * 1024;
            default:
                return 0;
        }
    }
    formatarTamanho(tamanhoEmBytes: number): string {
        if (tamanhoEmBytes < 1024) {
            return tamanhoEmBytes + ' B';
        } else if (tamanhoEmBytes < 1024 * 1024) {
            return (tamanhoEmBytes / 1024).toFixed(1) + ' KB';
        } else if (tamanhoEmBytes < 1024 * 1024 * 1024) {
            return (tamanhoEmBytes / (1024 * 1024)).toFixed(1) + ' MB';
        } else {
            return (tamanhoEmBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
        }
    }

    atualizarTotalizador(titulo: string, qtd: number, tamanho: string) {
        const index = this.totalizadoresArquivos.findIndex(
            (totalizador) => totalizador.titulo === titulo
        );
        if (index !== -1) {
            // Atualizar o existente
            this.totalizadoresArquivos[index].qtd = qtd;
            this.totalizadoresArquivos[index].tamanho = tamanho;
        } else {
            // Adicionar novo
            this.totalizadoresArquivos.push({
                titulo,
                qtd,
                tamanho
            });
        }
    }
}
