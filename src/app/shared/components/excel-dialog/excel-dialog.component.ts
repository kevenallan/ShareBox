import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Arquivo } from '../../../core/models/arquivo.model';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { ArquivoService } from '../../../core/services/arquivo.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-excel-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        TableModule
    ],
    templateUrl: './excel-dialog.component.html',
    styleUrl: './excel-dialog.component.scss'
})
export class ExcelDialogComponent {
    @Input() header?: string;
    displayExcel: boolean = false;

    arquivo?: Arquivo;
    mimeType?: string;

    excelData: any[][] = [];
    celulaEmEdicao: any[][] = [];

    @Output() atualizarTabela = new EventEmitter();

    constructor(private arquivoService: ArquivoService) {
        this.celulaEmEdicao = [];
    }

    async showDialogExcelXlsx(arquivo: Arquivo) {
        this.arquivo = arquivo;
        this.header = 'Editar ' + arquivo.nome;
        this.mimeType = arquivo.mimeType;
        this.displayExcel = true;
        const file = this.arquivoService.convertBase64ToFile(
            arquivo.base64 || '',
            arquivo.nome
        );
        this.loadExcelData(file);
    }

    hideDialogEditor() {
        this.displayExcel = false;
        this.celulaEmEdicao = [];
    }

    async loadExcelData(file: File): Promise<void> {
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const binaryStr: string = e.target.result;
            const workbook: XLSX.WorkBook = XLSX.read(binaryStr, {
                type: 'binary'
            });
            const firstSheetName: string = workbook.SheetNames[0];
            const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

            this.excelData = <any[][]>(
                XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            );
            this.celulaEmEdicao = this.excelData.map((row) => [...row]); // Faz uma cópia dos dados carregados
        };

        // Inicia a leitura do arquivo
        reader.readAsBinaryString(file);
    }

    onRowEditInit(rowIndex: number, colIndex: number) {
        this.excelData[rowIndex][colIndex] =
            this.celulaEmEdicao[rowIndex][colIndex];
    }

    onRowEditSave() {
        // Atualize `excelData` com os valores de `celulaEmEdicao`
        this.excelData = this.celulaEmEdicao.map((row) => [...row]);

        // Gera a nova planilha Excel a partir dos dados atualizados
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Gerar o arquivo Excel
        const excelBuffer: any = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array'
        });
        const blob: Blob = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });

        // Cria o nome do arquivo usando o serviço `arquivoService`
        const nomeArquivo = this.arquivoService.concatenarNomeExtensaoArquivo(
            this.arquivo?.nome || '',
            this.arquivo?.extensao || ''
        );

        // Converte o Blob em um arquivo
        const file = new File([blob], nomeArquivo, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Prepara os dados para enviar para o backend
        const formData = new FormData();
        formData.append('file', file);
        formData.append('nome', nomeArquivo);
        formData.append('nomeArquivoAntigo', nomeArquivo);

        // Chama o serviço para enviar o arquivo atualizado
        this.arquivoService.update(formData).subscribe(() => {
            this.atualizarTabela.emit();
        });
    }

    onRowEditCancel() {
        // if (this.arquivoEmEdicao.linha !== undefined && this.arquivoEmEdicao.coluna !== undefined) {
        //     this.excelData[this.arquivoEmEdicao.linha + 1][this.arquivoEmEdicao.coluna] = this.arquivoEmEdicao.valorOriginal;
        // }
        // this.removerEdicaoLinha();
    }

    removerEdicaoLinha() {
        // this.arquivoEmEdicao = { linha: undefined, coluna: undefined, valorOriginal: '' };
    }

    salvarAlteracoes() {
        // Função para salvar todas as alterações no arquivo Excel
        console.log('Salvando todas as alterações:', this.excelData);
        this.onRowEditSave();
        this.displayExcel = false;
    }
}
