import { PopulatedDoc, Document } from 'mongoose';

declare interface ITable extends Document {
    num: number;
    capacity: number;
    status: 'reserved' | 'occupied' | 'available';
    location: 'indoor' | 'outdoor' | 'private room';
    staffAssigned: PopulatedDoc<IUser & Document>[];
    reservation?: PopulatedDoc<IReservation & Document>;
    isCleaned: boolean;
}
