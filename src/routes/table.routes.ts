import { Router } from 'express';
import { getAllTables, createTable, getTable, updateTable, deleteTable } from '@controllers/table';
import { protect, checkUserRole } from '@middleware/auth';
import { Role } from '@enums/user';

const router = Router();

router.route('/').get(getAllTables).post(protect, checkUserRole(Role.employee, Role.admin), createTable);
router
    .route('/:id')
    .get(getTable)
    .patch(protect, checkUserRole(Role.employee, Role.admin), updateTable)
    .delete(protect, checkUserRole(Role.employee, Role.admin), deleteTable);

export default router;
