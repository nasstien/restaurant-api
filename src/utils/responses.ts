import { Response } from 'express';

export const sendSuccessResponse = (
    res: Response,
    statusCode: number,
    data: object | object[] | undefined,
    message?: string,
) => {
    res.status(statusCode).json({
        status: 'success',
        code: statusCode,
        results: Array.isArray(data) ? data.length : undefined,
        message,
        data,
    });
};

export const sendErrorResponse = (res: Response, statusCode: number, message: string | string[]) => {
    res.status(statusCode).json({
        status: `${statusCode}`.startsWith('4') ? 'failed' : 'error',
        error: {
            code: statusCode,
            message,
        },
    });
};
