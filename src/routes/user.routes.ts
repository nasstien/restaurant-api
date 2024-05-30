import { Router } from 'express';
import { searchUsers, getAllUsers, createUser, getUser, updateUser, deleteUser } from '@controllers/user';
import { updateUserRole, updatePassword, deleteAccount } from '@controllers/auth';
import { protect, checkUserRole } from '@middleware/auth';
import reservationRouter from '@routes/reservation';
import orderRouter from '@routes/order';
import paymentRouter from '@routes/payment';

const router = Router();

router.get('/search', protect, checkUserRole('employee', 'admin'), searchUsers);

router
    .route('/')
    .get(protect, checkUserRole('employee', 'admin'), getAllUsers)
    .post(protect, checkUserRole('admin'), createUser);
router
    .route('/:id')
    .get(getUser)
    .patch(protect, checkUserRole('admin'), updateUser)
    .delete(protect, checkUserRole('admin'), deleteUser);

router.patch('/update-role', protect, checkUserRole('admin'), updateUserRole);
router.patch('/update-password', protect, updatePassword);
router.patch('/delete-account', protect, deleteAccount);

router.use('/:userId/reservations', reservationRouter);
router.use('/:userId/orders', orderRouter);
router.use('/:userId/payments', paymentRouter);

export default router;
