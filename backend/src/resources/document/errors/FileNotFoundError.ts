import {BaseError} from "../../../utils/baseError";
import {StatusCodes} from "http-status-codes";

export class FileNotFoundError extends BaseError {
    constructor() {
        super("File not found", StatusCodes.UNPROCESSABLE_ENTITY);
    }
}