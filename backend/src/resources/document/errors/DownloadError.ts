import {BaseError} from "../../../utils/baseError";
import {StatusCodes} from "http-status-codes";

export class FileNotFoundError extends BaseError {
    constructor() {
        super("Error ao baixar arquivo", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}