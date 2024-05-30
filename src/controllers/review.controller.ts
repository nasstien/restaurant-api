import { getAll, getOne, createOne, updateOne, deleteOne } from '@middleware/controllers';
import Review from '@models/review';

export const getMenuItemReviews = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
