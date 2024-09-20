import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [DialogModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    //
    displayHTML: boolean = false;
    @Input() header?: string;
    @Input() content?: string; // HTML string
    //
    displayVideo: boolean = false;
    @Input() video?: string;
    @Input() extensao?: string;
    //

    showDialogHTML() {
        this.displayHTML = true;
    }

    hideDialogHTML() {
        this.displayHTML = false;
    }

    showDialogVideo() {
        console.log(this.video);
        this.displayVideo = true;
    }

    hideDialogVideo() {
        this.displayVideo = false;
    }
}
