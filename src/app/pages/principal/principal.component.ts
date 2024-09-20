import { previewVideo } from './../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { ArquivoService } from '../../core/services/arquivo.service';
import { Arquivo } from '../../core/models/arquivo.model';
//PRIMENG
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

//
import { previewArquivo } from '../../../environments/environment';
import { AlertService } from '../../core/services/alert.service';

import { AuthService } from '../../core/services/auth.service';

import { LocalDateTimeFormatPipe } from '../../shared/pipe/local-date-time-format.pipe';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
    selector: 'app-principal',
    standalone: true,
    imports: [
        CommonModule,
        //PRIMENG
        ButtonModule,
        SplitButtonModule,
        ToastModule,
        MenuModule,
        BadgeModule,
        RippleModule,
        AvatarModule,
        TableModule,
        MessagesModule,
        CardModule,
        SpeedDialModule,
        MenubarModule,
        InputTextModule,
        OverlayPanelModule,
        TooltipModule,
        DialogModule,
        //
        LocalDateTimeFormatPipe,
        DialogComponent
    ],

    templateUrl: './principal.component.html',
    styleUrl: './principal.component.scss',
    providers: [MessageService, DatePipe]
})
export class PrincipalComponent implements OnInit {
    arquivoList: Arquivo[] = [];
    items: MenuItem[] | undefined;
    previewArquivo: string = previewArquivo;
    previewVideo: string = previewVideo;

    //
    @ViewChild('dialog') dialog!: DialogComponent;
    videoDialog: string = '';
    videoExtensao: string = '';
    //
    constructor(
        private arquivoService: ArquivoService,
        private alertService: AlertService,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home'
            },
            {
                label: 'Features',
                icon: 'pi pi-star'
            }
        ];
        this.listar();
    }

    clickUploadFile() {
        const fileInput = document.getElementById(
            'fileInput'
        ) as HTMLInputElement;
        fileInput.click();
    }

    async onFileSelected(event: any): Promise<void> {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop(); // Pega a extensão do arquivo

            const formData = new FormData();
            formData.append('file', file);
            formData.append('nome', fileName);
            formData.append('extensao', fileExtension);
            formData.append('usuario', this.authService.getUsuarioFromToken());

            const arquivoExistente =
                await this.verificarExistenciaArquivo(formData);

            if (!arquivoExistente) this.uploadFile(formData);
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
        this.arquivoService.listar().subscribe(
            (response) => {
                this.arquivoList = response;
                this.adicionarImgPreview();
                console.log(this.arquivoList);
            },
            (error) => {
                this.alertService.showErrorAlert(
                    'Erro ao tentar listar arquivos'
                );
            }
        );
    }

    adicionarImgPreview(){
        this.arquivoList.forEach((arquivo) => {
            arquivo.previewSrc = this.preview(arquivo);
        });
    }

    downloadFile(nomeArquivo: string, extensao: string): void {
        this.arquivoService
            .download(this.concatenarNomeExtensaoArquivo(nomeArquivo, extensao))
            .subscribe(
                (response: Blob) => {
                    const blob = new Blob([response], { type: response.type });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = nomeArquivo + '.' + extensao; // Nome do arquivo a ser baixado
                    document.body.appendChild(a);
                    a.click(); // Inicia o download
                    document.body.removeChild(a); // Remove o link após o clique
                    window.URL.revokeObjectURL(url); // Limpa a URL temporária
                },
                (error) => {
                    this.alertService.showErrorAlert(
                        'Erro ao tentar fazer o download'
                    );
                    console.error('Erro no download', error);
                }
            );
    }

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
                this.videoDialog =
                    'data:video/' +
                    arquivo.extensao +
                    ';base64,' +
                    arquivo.base64;
                this.videoExtensao = arquivo.extensao;
                return (
                    'data:video/' +
                    arquivo.extensao +
                    ';base64,' +
                    arquivo.base64
                );
            case 'pdf':
            const blob = this.base64ToBlob(
                arquivo.base64 || '',
                'application/pdf'
            );
            arquivo.url = URL.createObjectURL(blob);
            return  previewArquivo;// Cria um URL do Blob
            default:
                return previewVideo;
        }
    }

    sair() {
        this.authService.removeAuthorizationToken();
        this.router.navigate(['/login']);
    }

    async deletar(nomeArquivo: string, extensao: string) {
        try {
            await this.arquivoService.deletar(
                this.concatenarNomeExtensaoArquivo(nomeArquivo, extensao)
            );
            this.listar();
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

    concatenarNomeExtensaoArquivo(nomeArquivo: string, extensao: string) {
        return nomeArquivo + '.' + extensao;
    }

    openDialogVideo() {
        const dialog = this.dialog; // Referência ao componente de diálogo
        dialog.showDialogVideo();
    }

    abrirVideo(video: string) {
        console.log(video);
        this.videoDialog = video;
        this.videoExtensao = 'video/mp4'
        this.openDialogVideo();
    }
}
