import { getAll, getOne, createOne, updateOne, deleteOne } from '@middleware/controllers';
import Order from '@models/order';

export const getAllOrders = getAll(Order);
export const getUserOrders = getAll(Order);
export const getOrder = getOne(Order);
export const createOrder = createOne(Order);
export const updateOrder = updateOne(Order);
export const deleteOrder = deleteOne(Order);
