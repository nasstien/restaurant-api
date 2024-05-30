import { RequestHandler } from 'express';
import { filterXSS } from 'xss';

export const sanitize = (): RequestHandler => {
    return (req, res, next) => {
        req.body = JSON.parse(
            filterXSS(JSON.stringify(req.body), {
                whiteList: {},
                stripIgnoreTag: true,
                stripIgnoreTagBody: ['script'],
            }),
        );
        next();
    };
};

export const disableCache = (): RequestHandler => {
    return (req, res, next) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        next();
    };
};
