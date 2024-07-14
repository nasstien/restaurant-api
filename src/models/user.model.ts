import bcrypt from 'bcrypt';
import crypto from 'crypto';
import validator from 'validator';
import { Model, Schema, model } from 'mongoose';
import { IUser } from 'IUser';
import { Role } from '@enums/user';
import { isConfirmedPassword } from '@utils/validators';

const UserSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required.'],
            trim: true,
            validate: {
                validator: function (v: string) {
                    return validator.isAlpha(v);
                },
                message: 'First name cannot include numbers or special characters.',
            },
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required.'],
            trim: true,
            validate: {
                validator: function (v: string) {
                    return validator.isAlpha(v);
                },
                message: 'Last name cannot include numbers or special characters.',
            },
        },
        phoneNum: {
            type: String,
            required: [true, 'Phone number is required.'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return validator.isEmail(v);
                },
                message: 'Invalid email provided.',
            },
        },
        role: {
            type: String,
            enum: {
                values: Object.values(Role),
                message: 'Invalid value provided. Allowed values for role: customer, employee, admin.',
            },
            default: Role.customer,
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minLength: [8, 'Password must be at least 8 characters long.'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Confirm your password.'],
            select: false,
            validate: {
                validator: function (this: IUser, v: string) {
                    return isConfirmedPassword(this.password, v);
                },
                message: 'Mismatched passwords.',
            },
        },
        passwordUpdatedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpires: Date,
        profilePhoto: {
            type: String,
            default: './',
        },
        reservations: [
            {
                type: 'ObjectId',
                ref: 'Reservation',
            },
        ],
        orders: [
            {
                type: 'ObjectId',
                ref: 'Order',
            },
        ],
        payments: [
            {
                type: 'ObjectId',
                ref: 'Payment',
            },
        ],
        reviews: [
            {
                type: 'ObjectId',
                ref: 'Review',
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        validateModifiedOnly: true,
        timestamps: true,
    },
);

UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods.passwordUpdatedAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordUpdatedAt) {
        const updatedTimestamp = +this.passwordUpdatedAt.getTime() / 1000;
        return JWTTimestamp < updatedTimestamp;
    }
    return false;
};

UserSchema.methods.generatePasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

UserSchema.pre('save', async function (next) {
    if (this.isModified('role')) {
        this.role.toLowerCase();
        return next();
    } else if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    }
    next();
});

const User: Model<IUser> = model<IUser>('User', UserSchema);
export default User;
