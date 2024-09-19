import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

//
import { previewVideo } from '../../../environments/environment';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InputTextModule } from 'primeng/inputtext';

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
        OverlayPanelModule
        //
    ],

    templateUrl: './principal.component.html',
    styleUrl: './principal.component.scss',
    providers: [MessageService]
})
export class PrincipalComponent implements OnInit {
    arquivoList: Arquivo[] = [];
    items: MenuItem[] | undefined;
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

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            let arquivo = null;
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop(); // Pega a extensão do arquivo
            const reader = new FileReader();
            reader.onload = () => {
                let base64String = reader.result as string;
                const prefixoBase64 = base64String.split(',')[0];
                base64String = base64String.split(',')[1]; // Removendo o prefixo da string base64

                // arquivo = new Arquivo(
                //     base64String,
                //     fileName,
                //     fileExtension,
                //     prefixoBase64
                // );
                // arquivo.file = file;

                const formData = new FormData();
                formData.append('file', file);
                formData.append('nome', fileName);
                formData.append('extensao', fileExtension);
                //TODO: PEGAR O USUARIO DO USUARIO LOGADO
                formData.append('usuario', 'dev');

                this.uploadFile(formData);
            };
            reader.readAsDataURL(file); // Isso converte o arquivo para Base64
        }
    }

    uploadFile(arquivo: any): void {
        this.arquivoService.upload(arquivo).subscribe(
            (response) => {
                console.log('response', response);
                this.listar();
            },
            (error) => {
                console.log('error', error);
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
            },
            (error) => {
                this.alertService.showErrorAlert(
                    'Erro ao tentar listar arquivos'
                );
            }
        );
    }

    downloadFile(nomeArquivo: string): void {
        this.arquivoService.download(nomeArquivo).subscribe(
            (response: Blob) => {
                const blob = new Blob([response], { type: response.type });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = nomeArquivo; // Nome do arquivo a ser baixado
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
            //TODO:AJUSTAR PREVIEW
            // return arquivo.prefixoBase64 + ',' + arquivo.arquivo;
            default:
                return previewVideo;
        }
    }

    sair() {
        this.authService.removeAuthorizationToken();
        this.router.navigate(['/login']);
    }
}
