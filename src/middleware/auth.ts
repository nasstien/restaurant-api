import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from 'IAuthRequest';
import { handleAsyncErrors } from '@utils/utils';
import APIError from '@utils/classes/APIError';
import User from '@models/user';

export const protect = handleAsyncErrors(async (req, res, next) => {
    const authReq = req as IAuthRequest;
    const token = req.cookies.session;

    if (!token) {
        return next(new APIError(401, 'You are not logged in.'));
    }

    const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const user = await User.findById(decodedToken.id);

    if (!user) {
        return next(new APIError(401, 'The user belonging to the token no longer exists.'));
    } else if (decodedToken.iat && user.passwordUpdatedAfter(decodedToken.iat)) {
        return next(new APIError(401, 'The user recently changed the password. Please login again.'));
    }

    authReq.user = user;
    next();
});

export const checkUserRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as IAuthRequest;

        if (!allowedRoles.includes(authReq.user.role)) {
            return next(new APIError(403, "You don't have permissions to access this endpoint."));
        }
        next();
    };
};
