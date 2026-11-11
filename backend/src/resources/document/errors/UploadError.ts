import {BaseError} from "../../../utils/baseError";
import {StatusCodes} from "http-status-codes";

export class UploadError extends BaseError {
    constructor() {
        super("Error ao fazer upload do arquivo", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}