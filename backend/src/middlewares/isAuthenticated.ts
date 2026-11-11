import {Request, Response, NextFunction} from "express";
import {BaseError} from "../utils/baseError";
import {StatusCodes} from "http-status-codes";

class NoAuthError extends BaseError {
    constructor() {
        super('Usuário não autenticado', StatusCodes.UNAUTHORIZED);
    }
}

export function isAuthenticated(req: Request, res: Response, next:NextFunction) {
    if (req.session && req.session.uid) {
        next();
    } else {
        throw new NoAuthError();
    }
}