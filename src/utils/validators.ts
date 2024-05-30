import { Model, Document } from 'mongoose';

export function isConfirmedPassword(password: string, passwordConfirm: string): boolean {
    return password === passwordConfirm;
}

export function isValidDate(date: Date): boolean {
    return date >= new Date();
}

export async function isValidId<T extends Document>(Model: Model<T>, id: string): Promise<boolean> {
    return Model.findById(id)
        .then((doc) => !!doc)
        .catch((_err) => false);
}
