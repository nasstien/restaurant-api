import { Document } from 'mongoose';

declare interface IUser extends Document {
    firstName: string;
    lastName: string;
    phoneNum: string;
    email: string;
    role: 'customer' | 'employee' | 'admin';
    password: string;
    passwordConfirm: string | undefined;
    passwordUpdatedAt?: Date;
    passwordResetToken?: string;
    passwordResetTokenExpires?: Date;
    profilePhoto: string;
    reservations?: PopulatedDoc<IReservation & Document>[];
    orders?: PopulatedDoc<IOrder & Document>[];
    payments?: PopulatedDoc<IPayment & Document>[];
    reviews?: PopulatedDoc<IReview & Document>[];
    isActive: boolean;

    passwordUpdatedAfter: (JWTTimestamp: number) => boolean;
    generatePasswordResetToken: () => string;
}
