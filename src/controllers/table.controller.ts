import { getAll, getOne, createOne, updateOne, deleteOne } from '@middleware/controllers';
import Table from '@models/table';

export const getAllTables = getAll(Table);
export const getTable = getOne(Table);
export const createTable = createOne(Table);
export const updateTable = updateOne(Table);
export const deleteTable = deleteOne(Table);
