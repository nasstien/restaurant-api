import { getAll, getOne, createOne, updateOne, deleteOne } from '@middleware/controllers';
import Reservation from '@models/reservation';

export const getAllReservations = getAll(Reservation);
export const getUserReservations = getAll(Reservation);
export const getReservation = getOne(Reservation);
export const createReservation = createOne(Reservation);
export const updateReservation = updateOne(Reservation);
export const deleteReservation = deleteOne(Reservation);
