import { PopulatedDoc, Document } from 'mongoose';

declare interface IReview extends Document {
    user: PopulatedDoc<IUser & Document>;
    menuItem: PopulatedDoc<IMenuItem & Document>;
    rating: number;
    comment: string;
}
