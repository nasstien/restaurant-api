import { PopulatedDoc, Document } from 'mongoose';

declare interface IReservation extends Document {
    user: PopulatedDoc<IUser & Document>;
    table: PopulatedDoc<ITable & Document>;
    date: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'no-show' | 'rescheduled';
    depositAmount: number;
    occasion?: string;
    notes: string;
}
