import { RequestHandler, Request, Response, NextFunction } from 'express';

export const handleAsyncErrors = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
};

export const addSpaceBeforeBigLetter = (str: string): string => {
    const match = /[a-z][A-Z][a-z]/.exec(str);

    if (match) {
        return `${str.slice(0, match.index + 1)} ${str.slice(match.index + 1)}`;
    }

    return str;
};
