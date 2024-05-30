import { Router } from 'express';
import { getUserOrders, createOrder, getOrder, updateOrder, deleteOrder } from '@controllers/order';
import { setUserId } from '@controllers/user';
import { protect } from '@middleware/auth';

const router = Router({ mergeParams: true });

router.use(protect);

router.route('/').get(getUserOrders).post(setUserId, createOrder);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

export default router;
