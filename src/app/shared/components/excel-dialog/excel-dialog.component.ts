import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Arquivo } from '../../../core/models/arquivo.model';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { ArquivoService } from '../../../core/services/arquivo.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';

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
    arquivoList: Arquivo[] = [];
    mimeType?: string;

    excelData: any[][] = [];
    celulaEmEdicao: any[][] = [];
    isEditar: boolean = true;

    @Output() atualizarTabela = new EventEmitter();

    constructor(
        private arquivoService: ArquivoService,
        private alertService: AlertService
    ) {
        this.celulaEmEdicao = [];
        this.isEditar = true;
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

    showDialogNovoExcelXlsx(arquivoList: Arquivo[]) {
        this.arquivoList = arquivoList;
        this.isEditar = false;
        this.header = 'Novo(a) Planilha do Microsoft Excel';
        this.displayExcel = true;
        this.excelData.push(['-', '-'], ['-', '-']);
        this.celulaEmEdicao = this.excelData.map((row) => [...row]);
    }

    hideDialogEditor() {
        this.displayExcel = false;
        this.excelData = [];
        this.celulaEmEdicao = [];
        this.isEditar = true;
    }
    async loadExcelData(file: File): Promise<void> {
        const reader: FileReader = new FileReader();

        reader.onload = (e: any) => {
            const binaryStr: string = e.target.result;
            try {
                const workbook: XLSX.WorkBook = XLSX.read(binaryStr, {
                    type: 'binary'
                });
                const firstSheetName: string = workbook.SheetNames[0];
                const worksheet: XLSX.WorkSheet =
                    workbook.Sheets[firstSheetName];

                this.excelData = <any[][]>(
                    XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                );
                this.celulaEmEdicao = this.excelData.map((row) => [...row]);
            } catch (error) {
                const errorMessage = (error as Error).message;
                if (errorMessage.includes('password')) {
                    this.alertService.showWarningAlert(
                        'Excel protegido por senha.'
                    );
                    // Aqui você pode disparar um diálogo SweetAlert2 para solicitar a senha.
                } else {
                    this.alertService.showErrorAlert(
                        'Erro ao tentar ler o conteúdo do excel'
                    );
                }
            }
        };

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
        let nomeArquivo = this.arquivoService.concatenarNomeExtensaoArquivo(
            this.arquivo?.nome || '',
            this.arquivo?.extensao || ''
        );
        if (!this.isEditar) {
            nomeArquivo = this.getNomeArquivoNovo();
        }
        // Converte o Blob em um arquivo
        const file = new File([blob], nomeArquivo, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Prepara os dados para enviar para o backend
        const formData = new FormData();

        // Chama o serviço para enviar o arquivo atualizado
        if (this.isEditar) {
            formData.append('file', file);
            formData.append('nome', nomeArquivo);
            formData.append('nomeArquivoAntigo', nomeArquivo);
            this.arquivoService.update(formData).subscribe(() => {
                this.atualizarTabela.emit();
            });
        } else {
            formData.append('files', file);
            this.arquivoService.upload(formData).subscribe(() => {
                this.atualizarTabela.emit();
            });
        }
    }

    salvarAlteracoes() {
        this.onRowEditSave();
        this.displayExcel = false;
    }

    adicionarColuna() {
        this.excelData.forEach((linha) => {
            linha.push('-');
        });
        this.celulaEmEdicao = this.excelData.map((row) => [...row]);
    }
    adicionarLinha() {
        let novaLinha: any = [];
        this.excelData[0].forEach((linha) => novaLinha.push('-'));
        this.excelData.push(novaLinha);
        this.celulaEmEdicao = this.excelData.map((row) => [...row]);
    }

    getNomeArquivoNovo() {
        let nomeArquivoNovo = 'Novo(a) Planilha do Microsoft Excel';
        const extensao = '.xlsx';
        let contador = 2;

        const nomeJaExiste = (nome: string) =>
            this.arquivoList.some((arquivo) => arquivo.nome === nome);

        while (nomeJaExiste(nomeArquivoNovo)) {
            nomeArquivoNovo = `Novo(a) Planilha do Microsoft Excel (${contador})`;
            contador++;
        }
        return nomeArquivoNovo + extensao;
    }
}
