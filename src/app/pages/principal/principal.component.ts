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

//
import { previewVideo } from '../../../environments/environment';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
        CardModule
        //
    ],
    templateUrl: './principal.component.html',
    styleUrl: './principal.component.scss',
    providers: []
})
export class PrincipalComponent implements OnInit {
    arquivoList: Arquivo[] = [];
    // items: MenuItem[];
    selectedRow: any;
    constructor(
        private arquivoService: ArquivoService,
        private alertService: AlertService,
        private router: Router,
        private authService: AuthService
    ) {
        // this.items = [
        //     {
        //         label: 'Download',
        //         command: () => {
        //             console.log(this.selectedRow)
        //             // this.downloadFile("","")
        //         }
        //     },
        //     {
        //         label: 'Update',
        //         command: () => {
        //             // this.update();
        //         }
        //     },
        //     {
        //         label: 'Delete',
        //         command: () => {
        //             // this.delete();
        //         }
        //     },
        //     { label: 'Angular Website', url: 'http://angular.io' },
        //     { separator: true },
        //     { label: 'Upload', routerLink: ['/fileupload'] }
        // ];
    }

    ngOnInit() {
        this.listar();
    }

    getMenuItems(arquivo: any): MenuItem[] {
        return [
            {
                label: 'Download',
                icon: 'pi pi-download',
                command: () => this.downloadFile(arquivo.id, arquivo.nome)
            }
        ];
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

                arquivo = new Arquivo(
                    base64String,
                    fileName,
                    fileExtension,
                    prefixoBase64
                );

                this.uploadFile(arquivo);
            };
            reader.readAsDataURL(file); // Isso converte o arquivo para Base64
        }
    }

    uploadFile(arquivo: Arquivo): void {
        this.arquivoService.upload(arquivo).subscribe(
            (response) => {
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
                console.log(this.arquivoList[0]);
            },
            (error) => {
                this.alertService.showErrorAlert(
                    'Erro ao tentar listar arquivos'
                );
            }
        );
    }

    downloadFile(fileId: string, fileName: string): void {
        this.arquivoService.download(fileId).subscribe(
            (response: Blob) => {
                const blob = new Blob([response], { type: response.type });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName; // Nome do arquivo a ser baixado
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
                return arquivo.prefixoBase64 + ',' + arquivo.arquivo;
            default:
                return previewVideo;
        }
    }

    sair() {
        this.authService.removeAuthorizationToken();
        this.router.navigate(['/login']);
    }
}
