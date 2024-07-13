import validator from 'validator';
import { Model, Schema, model } from 'mongoose';
import { IMenuItem } from 'IMenuItem';
import { IReview } from 'IReview';
import { MenuItemTag, MenuItemStatus } from '@enums/menu-item.enum';

const MenuItemSchema = new Schema<IMenuItem>(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            validate: {
                validator: function (v: string) {
                    return validator.isAlpha(v);
                },
                message: 'Name cannot include numbers or special characters.',
            },
        },
        description: {
            type: String,
            required: [true, 'Description is required.'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required.'],
            trim: true,
        },
        ingredients: {
            type: [String],
            required: [true, 'Ingredients are required.'],
        },
        tags: {
            type: [String],
            enum: {
                values: Object.values(MenuItemTag),
                message:
                    'Invalid value provided. Allowed values for tags: vegan, vegetarian, gluten-free, dairy-free, nut-free, low-carb.',
            },
        },
        price: {
            type: Number,
            required: [true, 'Price is required.'],
        },
        cookingTime: {
            type: Number,
            required: [true, 'Cooking time is required.'],
        },
        coverImage: {
            type: String,
            required: [true, 'Cover image is required.'],
        },
        images: {
            type: [String],
            min: [1, 'At least 1 image must be uploaded.'],
            max: [10, 'Maximum of 10 images can be uploaded.'],
        },
        status: {
            type: String,
            enum: {
                values: Object.values(MenuItemStatus),
                message:
                    "Invalid value provided. Allowed values for status: best-selling, featured, chef's special, new.",
            },
        },
        discount: {
            type: Number,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    },
);

MenuItemSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'menuItem',
    localField: '_id',
});

MenuItemSchema.virtual('avgRating').get(function () {
    if (this.reviews && this.reviews.length > 0) {
        const sum = this.reviews.reduce((acc, review: IReview) => acc + review.rating, 0);
        return sum / this.reviews.length;
    }
    return 0;
});

MenuItemSchema.index({ price: 1 });
MenuItemSchema.index({ category: 1 });

const MenuItem: Model<IMenuItem> = model<IMenuItem>('MenuItem', MenuItemSchema);
export default MenuItem;
