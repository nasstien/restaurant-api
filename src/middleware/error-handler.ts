import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '@utils/responses';
import mongoose from 'mongoose';
import APIError from '@utils/classes/APIError';

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = (err as APIError).statusCode || 400;
    let message: string | string[] = err.message;

    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors);
        message = errors.length > 1 ? errors.map((err) => err.message) : errors[0].message;
    } else if (err instanceof mongoose.Error.CastError) {
        message = `The value ${err.value} is not valid for ${err.path} property.`;
    } else if ('code' in err && err.code === 11000) {
        const key = Object.keys('keyPattern' in err && (err.keyPattern as object));
        message = `Provided ${key} already exists.`;
    }

    sendErrorResponse(res, statusCode, message);
};
