import { Router } from 'express';
import {
    getUserReservations,
    createReservation,
    getReservation,
    updateReservation,
    deleteReservation,
} from '@controllers/reservation';
import { setUserId } from '@controllers/user';
import { protect } from '@middleware/auth';

const router = Router({ mergeParams: true });

router.use(protect);

router.route('/').get(getUserReservations).post(setUserId, createReservation);
router.route('/:id').get(getReservation).patch(updateReservation).delete(deleteReservation);

export default router;
