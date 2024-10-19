import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ArquivoService } from './arquivo.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor() {}

    showSuccessAlert(titulo: string) {
        Swal.fire({
            title: titulo,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-custom-confirm'
            }
        });
    }

    showWarningAlert(texto: string) {
        Swal.fire({
            title: 'Atenção!',
            text: texto,
            icon: 'warning',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-custom-confirm'
            }
        });
    }

    showErrorAlert(texto: string) {
        Swal.fire({
            title: 'Erro',
            text: texto,
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal2-custom-confirm'
            }
        });
    }

    async showConfirmationAlertFile(titulo: string, texto: string) {
        const result = await Swal.fire({
            title: titulo,
            text: texto,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                confirmButton: 'swal2-custom-confirm',
                cancelButton: 'swal2-custom-cancel'
            }
        });
        return result.isConfirmed;
    }

    async showConfirmationAlertWarning(titulo: string, texto: string) {
        const result = await Swal.fire({
            title: titulo,
            text: texto,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                confirmButton: 'swal2-custom-confirm',
                cancelButton: 'swal2-custom-cancel'
            }
        });
        return result.isConfirmed;
    }

    async showInputAlertFileName(
        arquivosExistentes: string[],
        fileAtual: File
    ): Promise<string | null> {
        const result = await Swal.fire({
            title: 'Nome do arquivo duplicado',
            text: 'Por favor, escolha outro nome:',
            input: 'text',
            inputValue: fileAtual.name as string, // Garantindo que o valor seja string
            icon: 'info',
            inputPlaceholder: 'Escolha um novo nome',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            customClass: {
                confirmButton: 'swal2-custom-confirm'
            },
            preConfirm: (inputValue) => {
                if (!inputValue) {
                    Swal.showValidationMessage(
                        'O nome do arquivo não pode ser vazio'
                    );
                    return false;
                } else if (
                    arquivosExistentes.includes(inputValue?.split('.')[0])
                ) {
                    Swal.showValidationMessage(
                        `Um arquivo com o nome "${inputValue}" já existe. Por favor, escolha outro.`
                    );
                    return false;
                }
                return inputValue;
            }
        });

        if (result.isConfirmed) {
            return result.value;
        }

        return null;
    }
}
