import { RequestHandler } from 'express';
import { getAll, getOne, createOne, updateOne, deleteOne, search } from '@middleware/controllers';
import MenuItem from '@models/menuItem';

export const searchMenuItems = search(MenuItem, ['name', 'description', 'category', 'ingredients', 'tags']);
export const getAllMenuItems = getAll(MenuItem, { path: 'reviews' });
export const getMenuItem = getOne(MenuItem, { path: 'reviews' });
export const createMenuItem = createOne(MenuItem);
export const updateMenuItem = updateOne(MenuItem);
export const deleteMenuItem = deleteOne(MenuItem);

export const setItemId: RequestHandler = (req, res, next) => {
    if (!req.body.menuItem) req.body.menuItem = req.params.itemId;
    next();
};
