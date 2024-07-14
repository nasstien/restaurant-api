import { Router } from 'express';
import {
    getUserCountByRole,
    getUserCountByActivity,
    getIncomePerMonth,
    getTopSellingItems,
    getMostReservedTables,
    getReviewPercentage,
} from '@controllers/stats';
import { protect, checkUserRole } from '@middleware/auth';
import { Role } from '@enums/user';

const router = Router();

router.use(protect, checkUserRole(Role.admin));

router.get('/users/role', getUserCountByRole);
router.get('/users/activity', getUserCountByActivity);
router.get('/income-per-month/:month', getIncomePerMonth);
router.get('/top-selling-items', getTopSellingItems);
router.get('/most-reserved-tables', getMostReservedTables);
router.get('/review-percentage/:itemId', getReviewPercentage);

export default router;
