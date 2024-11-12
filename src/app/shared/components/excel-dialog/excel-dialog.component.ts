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
import { TabViewModule } from 'primeng/tabview';

@Component({
    selector: 'app-excel-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        TableModule,
        TabViewModule
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
    abaSelecionada: number = 0;
    excelData: { sheetName: string; data: any[][] }[] = [];
    celulaEmEdicao: { sheetName: string; data: any[][] }[] = [];
    isEditar: boolean = true;
    colunasExcel: string[] = [];
    isExibirCheckBox = false;
    selecionado = [];

    @Output() atualizarTabela = new EventEmitter();

    constructor(
        private arquivoService: ArquivoService,
        private alertService: AlertService
    ) {
        this.abaSelecionada = 0;
        this.isExibirCheckBox = false;
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
        await this.loadExcelData(file);
    }

    showDialogNovoExcelXlsx(arquivoList: Arquivo[]) {
        this.arquivoList = arquivoList;
        this.isEditar = false;
        this.header = 'Novo(a) Planilha do Microsoft Excel';
        this.displayExcel = true;
        this.excelData = [
            {
                sheetName: 'Sheet1',
                data: [
                    ['-', '-'],
                    ['-', '-']
                ]
            }
        ];
        this.celulaEmEdicao = this.excelData.map((sheet) => ({
            sheetName: sheet.sheetName,
            data: sheet.data.map((row) => [...row])
        }));

        this.colunasExcel = this.generateAlphabetHeader(2);
    }

    hideDialogEditor() {
        this.displayExcel = false;
        this.excelData = [];
        this.celulaEmEdicao = [];
        this.isEditar = true;
        this.abaSelecionada = 0;
        this.isExibirCheckBox = false;
        this.selecionado = [];
    }

    async loadExcelData(file: File): Promise<void> {
        const reader: FileReader = new FileReader();

        reader.onload = (e: any) => {
            const binaryStr: string = e.target.result;
            try {
                const workbook: XLSX.WorkBook = XLSX.read(binaryStr, {
                    type: 'binary'
                });

                this.excelData = [];
                this.celulaEmEdicao = [];

                workbook.SheetNames.forEach((sheetName: string) => {
                    const worksheet: XLSX.WorkSheet =
                        workbook.Sheets[sheetName];
                    let sheetData: any[][] = <any[][]>(
                        XLSX.utils.sheet_to_json(worksheet, { header: 1 })
                    );

                    // Ajusta a tabela para ter o mesmo número de colunas em todas as linhas
                    sheetData =
                        this.ajustarTabelaParaFormatoQuadrado(sheetData);

                    // Armazena o número de colunas e cria o cabeçalho alfabético
                    const columnCount = sheetData[0].length - 1;
                    this.colunasExcel =
                        this.generateAlphabetHeader(columnCount);

                    this.excelData.push({ sheetName, data: sheetData });
                    this.celulaEmEdicao.push({
                        sheetName,
                        data: sheetData.map((row) => [...row])
                    });
                });
            } catch (error) {
                const errorMessage = (error as Error).message;
                if (errorMessage.includes('password')) {
                    this.alertService.showWarningAlert(
                        'Excel protegido por senha.'
                    );
                } else {
                    this.alertService.showErrorAlert(
                        'Erro ao tentar ler o conteúdo do excel'
                    );
                }
            }
        };

        reader.readAsBinaryString(file);
    }

    mudarAba(aba: number) {
        const columnCount = this.excelData[aba].data[0].length;
        this.colunasExcel = this.generateAlphabetHeader(columnCount);
    }

    onRowEditChange(
        sheetIndex: number,
        rowIndex: number,
        colIndex: number
    ): void {
        this.excelData[sheetIndex].data[rowIndex][colIndex] =
            this.celulaEmEdicao[sheetIndex].data[rowIndex][colIndex];
    }

    onRowEditSave(): void {
        this.excelData = this.celulaEmEdicao.map((sheet) => ({
            sheetName: sheet.sheetName,
            data: sheet.data.map((row) => [...row])
        }));

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        this.excelData.forEach((sheet) => {
            const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheet.data);
            XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
        });

        const excelBuffer: any = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array'
        });
        const blob: Blob = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });

        let nomeArquivo = this.arquivoService.concatenarNomeExtensaoArquivo(
            this.arquivo?.nome || '',
            this.arquivo?.extensao || ''
        );
        if (!this.isEditar) {
            nomeArquivo = this.getNomeArquivoNovo();
        }

        const file = new File([blob], nomeArquivo, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const formData = new FormData();

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

    adicionarColuna(sheetIndex: number): void {
        this.excelData[sheetIndex].data.forEach((row) => row.push('-'));

        this.celulaEmEdicao[sheetIndex] = {
            sheetName: this.excelData[sheetIndex].sheetName,
            data: this.excelData[sheetIndex].data.map((row) => [...row])
        };

        const columnCount = this.excelData[sheetIndex].data[0].length;
        this.colunasExcel = this.generateAlphabetHeader(columnCount);
    }

    adicionarLinha(sheetIndex: number): void {
        const novaLinha = Array(this.excelData[sheetIndex].data[0].length).fill(
            '-'
        );

        this.excelData[sheetIndex].data.push(novaLinha);

        this.celulaEmEdicao[sheetIndex] = {
            sheetName: this.excelData[sheetIndex].sheetName,
            data: this.excelData[sheetIndex].data.map((row) => [...row])
        };
    }

    exibirCheckBox(sheetIndex: number): void {
        let columnCount = this.excelData[sheetIndex].data[0].length;
        this.isExibirCheckBox = !this.isExibirCheckBox;
        this.colunasExcel = this.generateAlphabetHeader(columnCount);
    }

    generateAlphabetHeader(columnCount: number): string[] {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let headers = [''];

        if (this.isExibirCheckBox) {
            columnCount++;
            headers = ['', ''];
        }

        for (let i = 0; i < columnCount; i++) {
            let label = '';
            let index = i;

            // Gera rótulos como A, B, ..., Z, AA, AB, etc.
            while (index >= 0) {
                label = alphabet[index % 26] + label;
                index = Math.floor(index / 26) - 1;
            }

            headers.push(label);
        }

        return headers;
    }

    teste() {
        console.log(this.selecionado);
    }

    getExcelColumnLetter(index: number): string {
        let letter = '';
        while (index >= 0) {
            letter = String.fromCharCode((index % 26) + 65) + letter;
            index = Math.floor(index / 26) - 1;
        }
        return letter;
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

    removeFocus() {
        setTimeout(() => {
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement) {
                activeElement.blur();
            }
            const dialogContent = document.querySelector('.p-dialog-content');
            if (dialogContent) {
                dialogContent.scrollTop = 0;
            }
        });
    }

    ajustarTabelaParaFormatoQuadrado(tabela: any[][]): any[][] {
        // Determina o comprimento da linha mais longa
        const maxColumns = tabela.reduce(
            (max, row) => Math.max(max, row.length),
            0
        );

        // Adiciona células vazias nas linhas que têm menos colunas
        return tabela.map((row) => {
            const novaLinha = [...row];
            while (novaLinha.length < maxColumns) {
                novaLinha.push(''); // ou use null para células vazias
            }
            return novaLinha;
        });
    }
}
