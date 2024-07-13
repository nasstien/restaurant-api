import { Router } from 'express';
import {
    searchMenuItems,
    getAllMenuItems,
    createMenuItem,
    getMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from '@controllers/menu-item';
import { protect, checkUserRole } from '@middleware/auth';
import reviewRouter from '@routes/review';

const router = Router();

router.get('/search', searchMenuItems);

router.route('/').get(getAllMenuItems).post(protect, checkUserRole('employee', 'admin'), createMenuItem);
router
    .route('/:id')
    .get(getMenuItem)
    .patch(protect, checkUserRole('employee', 'admin'), updateMenuItem)
    .delete(protect, checkUserRole('employee', 'admin'), deleteMenuItem);

router.use('/:itemId/reviews', reviewRouter);

export default router;
