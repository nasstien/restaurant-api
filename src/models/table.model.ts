import { Model, Query, Schema, model } from 'mongoose';
import { ITable } from 'ITable';
import { isValidId } from '@utils/validators';
import Reservation from './reservation.model';

const TableSchema = new Schema<ITable>(
    {
        num: {
            type: Number,
            unique: true,
            required: [true, 'Number of the table is required.'],
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required.'],
        },
        status: {
            type: String,
            enum: {
                values: ['reserved', 'occupied', 'available'],
                message: 'Invalid value provided. Allowed values for status: reserved, occupied, available.',
            },
            default: 'available',
        },
        location: {
            type: String,
            enum: {
                values: ['indoor', 'outdoor', 'private room'],
            },
            required: [true, 'Location is required.'],
        },
        staffAssigned: [
            {
                type: 'ObjectId',
                ref: 'User',
                required: [true, 'Assigned staff is required.'],
            },
        ],
        reservation: {
            type: 'ObjectId',
            ref: 'Reservation',
            validate: {
                validator: async function (id: string) {
                    return await isValidId(Reservation, id);
                },
                message: "The reservation you provided doesn't exist.",
            },
        },
        isCleaned: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

TableSchema.pre(/^find/, function (this: Query<ITable, ITable[]>, next) {
    this.populate([
        { path: 'reservation' },
        {
            path: 'staffAssigned',
            select: 'firstName lastName profilePhoto',
        },
    ]);
    next();
});

const Table: Model<ITable> = model<ITable>('Table', TableSchema);
export default Table;
