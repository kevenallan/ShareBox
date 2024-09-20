import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'localDateTimeFormat',
    standalone: true
})
export class LocalDateTimeFormatPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(
        value: string,
        format: string = 'dd/MM/yyyy HH:mm:ss'
    ): string | null {
        if (!value) {
            return null;
        }

        // Converte a string LocalDateTime em um objeto Date
        const date = new Date(value);

        // Usa o DatePipe para formatar a data
        return this.datePipe.transform(date, format);
    }
}
