import { Model, Query, Schema, model } from 'mongoose';
import { IReservation } from 'IReservation';
import { isValidId, isValidDate } from '@utils/validators';
import User from './user.model';
import Table from './table.model';

const ReservationSchema = new Schema<IReservation>(
    {
        user: {
            type: 'ObjectId',
            ref: 'User',
            required: [true, 'User is required.'],
            validate: {
                validator: async function (id: string) {
                    return await isValidId(User, id);
                },
                message: "The user you provided doesn't exist.",
            },
        },
        table: {
            type: 'ObjectId',
            ref: 'Table',
            required: [true, 'Table is required.'],
            validate: {
                validator: async function (id: string) {
                    return await isValidId(Table, id);
                },
                message: "The table you provided doesn't exist.",
            },
        },
        date: {
            type: Date,
            required: [true, 'Date is required.'],
            validate: {
                validator: function (v: Date) {
                    return isValidDate(v);
                },
                message: 'You provided a date from the past.',
            },
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'confirmed', 'cancelled', 'no-show', 'rescheduled'],
                message:
                    'Invalid value provided. Allowed values for status: pending, confirmed, cancelled, no-show, rescheduled.',
            },
            default: 'pending',
        },
        depositAmount: {
            type: Number,
            required: [true, 'Deposit amount is required.'],
        },
        occasion: String,
        notes: String,
    },
    { timestamps: true },
);

ReservationSchema.index({ user: 1 });

ReservationSchema.pre(/^find/, function (this: Query<IReservation, IReservation[]>, next) {
    this.populate([
        {
            path: 'user',
            select: 'firstName lastName profilePhoto',
        },
        { path: 'table' },
    ]);
    next();
});

const Reservation: Model<IReservation> = model<IReservation>('Reservation', ReservationSchema);
export default Reservation;
