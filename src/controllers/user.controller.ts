import { RequestHandler } from 'express';
import { search, getAll, getOne, createOne, updateOne, deleteOne } from '@middleware/controllers';
import User from '@models/user';

export const searchUsers = search(User, ['firstName', 'lastName', 'phoneNum', 'email']);
export const getAllUsers = getAll(User, { path: 'reservations orders payments reviews' });
export const getUser = getOne(User, { path: 'reservations orders payments reviews' });
export const createUser = createOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);

export const setUserId: RequestHandler = (req, res, next) => {
    if (!req.body.user) req.body.user = req.params.userId;
    next();
};
