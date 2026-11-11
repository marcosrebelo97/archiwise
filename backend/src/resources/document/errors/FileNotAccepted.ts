import {BaseError} from "../../../utils/baseError";
import {StatusCodes} from "http-status-codes";

export class FileNotAccepted extends BaseError {
    constructor() {
        super("Tipo de arquivo não aceito pelo sistema(aceitos apenas .docx, .pdf, .txt, .pptx, .doc, .xls, .xlsx, .odt, .ods, .odp)", StatusCodes.UNPROCESSABLE_ENTITY);
    }
}