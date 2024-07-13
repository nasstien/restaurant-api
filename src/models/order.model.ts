import { Model, Query, Schema, model } from 'mongoose';
import { IOrder } from 'IOrder';
import { OrderStatus } from '@enums/order.enum';
import { isValidId, isValidDate } from '@utils/validators';
import User from './user.model';
import Table from './table.model';
import MenuItem from './menu-item.model';

const OrderSchema = new Schema<IOrder>(
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
            validate: {
                validator: async function (id: string) {
                    return await isValidId(Table, id);
                },
                message: "The table you provided doesn't exist.",
            },
        },
        menuItems: [
            {
                count: {
                    type: Number,
                    default: 1,
                },
                menuItem: {
                    type: 'ObjectId',
                    ref: 'MenuItem',
                    required: [true, 'Menu item is required.'],
                    validate: {
                        validator: async function (id: string) {
                            return await isValidId(MenuItem, id);
                        },
                        message: (props: { value: string }) => `The menu item ${props.value} doesn't exist.`,
                    },
                },
                _id: false,
            },
        ],
        staffAssigned: [
            {
                type: 'ObjectId',
                ref: 'User',
                required: [true, 'Assigned staff is required.'],
                validate: {
                    validator: async function (id: string) {
                        return await isValidId(User, id);
                    },
                    message: (props: { value: string }) => `The user ${props.value} doesn't exist.`,
                },
            },
        ],
        status: {
            type: String,
            enum: {
                values: Object.values(OrderStatus),
                message:
                    'Invalid value provided. Allowed values for status: received, confirmed, cooking, ready for pickup, out for delivery, delivered, cancelled, delayed.',
            },
            default: OrderStatus.received,
        },
        deliveryAddress: {
            type: {
                country: String,
                city: String,
                street: String,
                _id: false,
            },
        },
        deliveryDate: {
            type: Date,
            validate: {
                validator: function (v: Date) {
                    return isValidDate(v);
                },
                message: 'You provided a date from the past.',
            },
        },
        notes: String,
    },
    { timestamps: true },
);

OrderSchema.index({ user: 1 });

OrderSchema.pre(/^find/, function (this: Query<IOrder, IOrder[]>, next) {
    this.populate([
        { path: 'user table menuItems.menuItem' },
        {
            path: 'staffAssigned',
            select: 'firstName lastName profilePhoto',
        },
    ]);
    next();
});

const Order: Model<IOrder> = model<IOrder>('Order', OrderSchema);
export default Order;
