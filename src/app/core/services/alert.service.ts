import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor() {}

    showSuccessAlert() {
        Swal.fire({
            title: 'Success!',
            text: 'Successful.',
            icon: 'success',
            confirmButtonText: 'Great!'
        });
    }

    showInfoAlert(texto: string) {
        Swal.fire({
            title: 'Information',
            text: texto,
            icon: 'info',
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
            confirmButtonText: 'OK'
        });
    }

    showErrorAlert(texto: string) {
        Swal.fire({
            title: 'Erro',
            text: texto,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    showConfirmationAlert(action: () => void) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to proceed with this action?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            customClass: {
                confirmButton: 'swal2-custom-confirm',
                cancelButton: 'swal2-custom-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                action();
                Swal.fire(
                    'Confirmed!',
                    'You have chosen to proceed.',
                    'success'
                );
            } else {
                // Action cancelled
                Swal.fire('Cancelled', 'Your action was cancelled.', 'error');
            }
        });
    }
}
