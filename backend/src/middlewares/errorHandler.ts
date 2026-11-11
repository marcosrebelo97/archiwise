import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../utils/baseError';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  else {
    console.error('Erro não operacional:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};
