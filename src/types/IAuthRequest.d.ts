import { Request } from 'express';

declare interface IAuthRequest extends Request {
    user: IUser;
}
