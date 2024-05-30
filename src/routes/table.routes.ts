import { Router } from 'express';
import { getAllTables, createTable, getTable, updateTable, deleteTable } from '@controllers/table';
import { protect, checkUserRole } from '@middleware/auth';

const router = Router();

router.route('/').get(getAllTables).post(protect, checkUserRole('employee', 'admin'), createTable);
router
    .route('/:id')
    .get(getTable)
    .patch(protect, checkUserRole('employee', 'admin'), updateTable)
    .delete(protect, checkUserRole('employee', 'admin'), deleteTable);

export default router;
