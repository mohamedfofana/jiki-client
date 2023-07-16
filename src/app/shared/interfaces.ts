import { IUser } from './model/user.model';

export interface IUserLogin {
    username: string;
    password: string;
}

export interface IResponseType<T> {
    status: string;
    entity: T;
    message: string;
}

export interface IAuthResponse {
    status: boolean;
    token: string;
    user:IUser,
}
