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

    constructor(private arquivoService: ArquivoService) {
        console.log('contructor', this.arquivo);
    }

    async showDialogEditorTexto(arquivo: Arquivo | undefined) {
        if (arquivo) {
            this.arquivo = arquivo;
            this.header = 'Editar ' + arquivo.nome;
            this.mimeType = arquivo.mimeType;
            this.texto = await this.getTexto(arquivo);
        } else {
            this.header = 'Criar arquivo';
        }
        console.log(this.arquivo);
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
        const nomeArquivo = 'Novo Documento de texto.txt';
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
}
