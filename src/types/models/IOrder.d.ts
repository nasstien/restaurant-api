import { PopulatedDoc, Document } from 'mongoose';

declare interface IOrder extends Document {
    user: PopulatedDoc<IUser & Document>;
    table?: PopulatedDoc<ITable & Document>;
    menuItems: {
        count: number;
        menuItem: PopulatedDoc<IMenuItem & Document>;
    }[];
    staffAssigned: PopulatedDoc<IUser & Document>[];
    status:
        | 'received'
        | 'confirmed'
        | 'cooking'
        | 'ready for pickup'
        | 'out for delivery'
        | 'delivered'
        | 'cancelled'
        | 'delayed';
    deliveryAddress?: {
        country: string;
        city: string;
        street: string;
    };
    deliveryDate?: Date;
    notes: string;
}
