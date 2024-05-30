import { PopulatedDoc, Document } from 'mongoose';

declare interface IPayment extends Document {
    user: PopulatedDoc<IUser & Document>;
    order: PopulatedDoc<IOrder & Document>;
    paymentMethod: 'cash' | 'card';
    status: 'pending' | 'authorized' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    totalAmount: number;
}
