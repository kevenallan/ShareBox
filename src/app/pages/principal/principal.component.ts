import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { ArquivoService } from '../../core/services/arquivo.service';
import { Arquivo } from '../../core/models/arquivo.model';
import { AlertService } from '../../core/services/alert.service';
import { AuthService } from '../../core/services/auth.service';
import { LocalDateTimeFormatPipe } from '../../shared/pipe/local-date-time-format.pipe';
import { MidiaDialogComponent } from '../../shared/components/midia-dialog/midia-dialog.component';

//PRIMENG
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
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
    items: MenuItem[] | undefined;
    arquivoUpdate!: Arquivo;

    @ViewChild('midiaDialog') midiaDialog!: MidiaDialogComponent;
    @ViewChild('editorTextoDialog')
    editorTextoDialog!: EditorTextoDialogComponent;
    constructor(
        private arquivoService: ArquivoService,
        private alertService: AlertService,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.items = [
            // {
            //     label: 'Home',
            //     icon: 'pi pi-home'
            // },
            // {
            //     label: 'Features',
            //     icon: 'pi pi-star'
            // }
        ];
        this.listar();
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

            const desejaSobrescrever =
                await this.alertService.showConfirmationAlertUploadFile(
                    'Tem certeza que deseja sobrescrever o arquivo?'
                );

            if (desejaSobrescrever) {
                this.arquivoService.deletar(
                    this.arquivoService.concatenarNomeExtensaoArquivo(
                        this.arquivoUpdate.nome,
                        this.arquivoUpdate.extensao
                    )
                );
                const arquivoExistente =
                    await this.verificarExistenciaArquivo(formData);

                if (!arquivoExistente) {
                    this.uploadFile(formData);
                }
                this.alertService.showSuccessAlert(
                    'Arquivo atualizado com sucesso!'
                );
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
        this.arquivoService.upload(arquivo).subscribe(
            () => {
                this.listar();
            },
            (error) => {
                this.alertService.showErrorAlert(
                    'Erro ao tentar fazer o upload'
                );
            }
        );
    }

    listar() {
        this.arquivoService.listar().subscribe((response) => {
            this.arquivoList = response;
            this.adicionarImgPreview();
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
            .subscribe(
                (response: Blob) => {
                    const blob = new Blob([response], { type: response.type });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download =
                        this.arquivoService.concatenarNomeExtensaoArquivo(
                            nomeArquivo,
                            extensao
                        ); // Nome do arquivo a ser baixado
                    document.body.appendChild(a);
                    a.click(); // Inicia o download
                    document.body.removeChild(a); // Remove o link após o clique
                    window.URL.revokeObjectURL(url); // Limpa a URL temporária
                },
                (error) => {
                    this.alertService.showErrorAlert(
                        'Erro ao tentar fazer o download'
                    );
                }
            );
    }
    //TODO:VERICIAR ONDE PODEMOS PEGAR ESSAS VARIAVEIS: 'data:image/' 'data:video/' 'data:audio/'
    preview(arquivo: Arquivo) {
        switch (arquivo.extensao) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return (
                    'data:image/' +
                    arquivo.extensao +
                    ';base64,' +
                    arquivo.base64
                );
            case 'mp4':
            case 'webm':
            case 'ogg':
                return '/assets/video.png';

            case 'mp3':
            case 'wav':
                //case 'ogg'   //Ogg também pode ser áudio
                return '/assets/musica.png';
            case 'pdf':
                const blob = this.base64ToBlob(
                    arquivo.base64 || '',
                    'application/pdf'
                );
                arquivo.url = URL.createObjectURL(blob);
                return '/assets/pdf.png';
            case 'txt':
                return '/assets/txt.png';
            default:
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

    abrirEditorTexto(arquivo: Arquivo) {
        this.openDialogEditorTexto(arquivo);
    }

    isImagemExtensao(extensao: string) {
        return this.arquivoService.isImagemExtensao(extensao);
    }
    isVideoExtensao(extensao: string) {
        return this.arquivoService.isVideoExtensao(extensao);
    }
    isAudioExtensao(extensao: string) {
        return this.arquivoService.isAudioExtensao(extensao);
    }
    isArquivoGenerico(extensao: string) {
        return this.arquivoService.isArquivoGenerico(extensao);
    }
    isPdfExtensao(extensao: string) {
        return this.arquivoService.isPdfExtensao(extensao);
    }
    isTxtExtensao(extensao: string) {
        return this.arquivoService.isTxtExtensao(extensao);
    }
    filterArquivos(event: Event, tbArquivos: any) {
        const input = event.target as HTMLInputElement;
        tbArquivos.filterGlobal(input.value, 'contains');
    }
}
