import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';

import { ArquivoService } from '../../../core/services/arquivo.service';
import { Arquivo } from '../../../core/models/arquivo.model';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-editor-texto-dialog',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DialogModule,
        EditorModule,
        ButtonModule
    ],
    templateUrl: './editor-texto-dialog.component.html',
    styleUrls: ['./editor-texto-dialog.component.scss']
})
export class EditorTextoDialogComponent {
    @Input() header?: string;
    @Output() eventUpdate = new EventEmitter();
    displayEditor: boolean = false;
    texto?: string;
    mimeType?: string;

    arquivo?: Arquivo;
    arquivoList: Arquivo[] = [];

    constructor(private arquivoService: ArquivoService) {}

    async showDialogEditorTexto(arquivo: Arquivo) {
        this.arquivo = arquivo;
        this.header = 'Editar ' + arquivo.nome;
        this.mimeType = arquivo.mimeType;
        this.texto = await this.getTexto(arquivo);
        this.displayEditor = true;
    }

    async showDialogCriarArquivoTexto(arquivoList: Arquivo[]) {
        this.arquivoList = arquivoList;
        this.header = 'Criar arquivo';
        this.displayEditor = true;
    }

    hideDialogEditor() {
        this.displayEditor = false;
        this.arquivo = undefined;
        this.texto = '';
    }

    async getTexto(arquivo: Arquivo) {
        if (arquivo.mimeType?.includes('text/plain')) {
            return await this.arquivoService.convertTxtBase64ToText(
                arquivo.base64 || ''
            );
        }
        return '';
    }

    updateArquivo() {
        const nomeArquivo = this.arquivoService.concatenarNomeExtensaoArquivo(
            this.arquivo?.nome || '',
            this.arquivo?.extensao || ''
        );
        const file = this.arquivoService.convertTxtToFile(
            this.texto || '',
            nomeArquivo
        );
        const formData = new FormData();
        formData.append('file', file);
        formData.append('nome', nomeArquivo);
        formData.append('nomeArquivoAntigo', nomeArquivo);
        this.arquivoService.update(formData).subscribe(() => {
            this.eventUpdate.emit();
            this.hideDialogEditor();
        });
    }

    uploadArquivo() {
        const nomeArquivo = this.getNomeArquivoNovo();
        const fileExtension = nomeArquivo.split('.')[1];
        const file = this.arquivoService.convertTxtToFile(
            this.texto || '',
            nomeArquivo
        );
        const formData = new FormData();
        formData.append('file', file);
        formData.append('nome', nomeArquivo);
        formData.append('extensao', fileExtension);

        this.arquivoService.upload(formData).subscribe(() => {
            this.eventUpdate.emit();
            this.hideDialogEditor();
        });
    }

    getNomeArquivoNovo() {
        let nomeArquivoNovo = 'Novo Documento de texto';
        const extensao = '.txt';
        let contador = 2;

        const nomeJaExiste = (nome: string) =>
            this.arquivoList.some((arquivo) => arquivo.nome === nome);

        while (nomeJaExiste(nomeArquivoNovo)) {
            nomeArquivoNovo = `Novo Documento de texto (${contador})`;
            contador++;
        }
        return nomeArquivoNovo + extensao;
    }
}
