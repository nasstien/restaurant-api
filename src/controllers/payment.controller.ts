import { getAll, getOne, createOne, updateOne, deleteOne } from '@middleware/controllers';
import Payment from '@models/payment';

export const getUserPayments = getAll(Payment);
export const getPayment = getOne(Payment);
export const createPayment = createOne(Payment);
export const updatePayment = updateOne(Payment);
export const deletePayment = deleteOne(Payment);
