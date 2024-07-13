import { Model, Query, Schema, model } from 'mongoose';
import { IReview } from 'IReview';
import { isValidId } from '@utils/validators';
import User from './user.model';
import MenuItem from './menu-item.model';

const ReviewSchema = new Schema<IReview>(
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
        menuItem: {
            type: 'ObjectId',
            ref: 'MenuItem',
            required: [true, 'Menu item is required.'],
            validate: {
                validator: async function (id: string) {
                    return await isValidId(MenuItem, id);
                },
                message: "The menu item you provided doesn't exist.",
            },
        },
        rating: {
            type: Number,
            min: [1, 'Provide a rating value from 1 to 5.'],
            max: [5, 'Provide a rating value from 1 to 5.'],
            required: [true, 'Rating is required.'],
        },
        comment: {
            type: String,
            required: [true, 'Comment is required.'],
            trim: true,
        },
    },
    { timestamps: true },
);

ReviewSchema.index({ user: 1 });
ReviewSchema.index({ menuItem: 1 });

ReviewSchema.pre(/^find/, function (this: Query<IReview, IReview[]>, next) {
    this.populate([
        { path: 'menuItem' },
        {
            path: 'user',
            select: 'firstName lastName profilePhoto',
        },
    ]);
    next();
});

const Review: Model<IReview> = model<IReview>('Review', ReviewSchema);
export default Review;
