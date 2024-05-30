import { Model, Query, Schema, model } from 'mongoose';
import { IPayment } from 'IPayment';
import { IMenuItem } from 'IMenuItem';
import { isValidId } from '@utils/validators';
import User from './user.model';
import Order from './order.model';

const PaymentSchema = new Schema<IPayment>(
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
        order: {
            type: 'ObjectId',
            ref: 'Order',
            required: [true, 'Order is required.'],
            validate: {
                validator: async function (id: string) {
                    return await isValidId(Order, id);
                },
                message: "The order you provided doesn't exist.",
            },
        },
        paymentMethod: {
            type: String,
            enum: {
                values: ['cash', 'card'],
            },
            required: [true, 'Payment method is required.'],
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'authorized', 'completed', 'failed', 'cancelled', 'refunded'],
                message:
                    'Invalid value provided. Allowed values for status: pending, authorized, completed, failed, cancelled, refunded.',
            },
            default: 'pending',
        },
        totalAmount: Number,
    },
    { timestamps: true },
);

PaymentSchema.index({ user: 1 });

PaymentSchema.pre('save', async function (next) {
    await this.populate('order');

    this.totalAmount = this.order.menuItems.reduce(
        (acc: number, item: { count: number; menuItem: IMenuItem }) => acc + item.menuItem.price * item.count,
        0,
    );

    next();
});

PaymentSchema.pre(/^find/, function (this: Query<IPayment, IPayment[]>, next) {
    this.populate([
        {
            path: 'user',
            select: 'firstName lastName profilePhoto',
        },
        { path: 'order' },
    ]);
    next();
});

const Payment: Model<IPayment> = model<IPayment>('Payment', PaymentSchema);
export default Payment;
