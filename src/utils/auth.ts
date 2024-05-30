import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { IUser } from 'IUser';

export const signToken = (user: IUser) => {
    return jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const sendTokenCookie = (res: Response, token: string) => {
    res.cookie('session', token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
};

export const comparePasswords = (inputPassword: string, userPassword: string) => {
    return bcrypt.compare(inputPassword, userPassword);
};
