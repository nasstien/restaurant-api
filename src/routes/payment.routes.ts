import { Router } from 'express';
import { getUserPayments, createPayment, getPayment, updatePayment, deletePayment } from '@controllers/payment';
import { setUserId } from '@controllers/user';
import { protect } from '@middleware/auth';

const router = Router({ mergeParams: true });

router.use(protect);

router.route('/').get(getUserPayments).post(setUserId, createPayment);
router.route('/:id').get(getPayment).patch(updatePayment).delete(deletePayment);

export default router;
