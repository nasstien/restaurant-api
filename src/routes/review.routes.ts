import { Router } from 'express';
import { getMenuItemReviews, createReview, getReview, updateReview, deleteReview } from '@controllers/review';
import { setUserId } from '@controllers/user';
import { setItemId } from '@controllers/menuItem';
import { protect } from '@middleware/auth';

const router = Router({ mergeParams: true });

router.route('/').get(getMenuItemReviews).post(protect, setUserId, setItemId, createReview);
router.route('/:id').get(getReview).patch(protect, updateReview).delete(protect, deleteReview);

export default router;
