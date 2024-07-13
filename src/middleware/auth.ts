import jwt from 'jsonwebtoken';
import { IAuthRequest } from 'IAuthRequest';
import { Request, Response, NextFunction } from 'express';
import { handleAsyncErrors } from '@utils/utils';
import APIError from '@utils/classes/APIError';
import User from '@models/user';

export const protect = handleAsyncErrors(async (req, res, next) => {
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

    (req as IAuthRequest).user = user;
    next();
});

export const checkUserRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes((req as IAuthRequest).user!.role)) {
            return next(new APIError(403, "You don't have permissions to access this endpoint."));
        }
        next();
    };
};
