import { Arquivo } from './arquivo.model';

export class AbrirDialogModel {
    dialog?: any;
    isMidiaDialog?: boolean = false;
    isEditorTextoDialog?: boolean = false;
    isExcelDialog?: boolean = false;
    arquivo?: Arquivo = new Arquivo();
    arquivoList?: Arquivo[];
}
